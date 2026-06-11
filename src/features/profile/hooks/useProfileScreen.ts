import * as ImagePicker from "expo-image-picker";
import { type Href, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

import { useAuth } from "../../../contexts/AuthContext";
import { useI18n } from "../../../i18n";
import { uploadImageAsync } from "../../../services/cloudinaryService";
import { subscribeToIncidents } from "../../../services/incidentService";
import type { IncidentReport } from "../../../types/incident";

const LOGIN_ROUTE = "/login" as Href;

export type ProfileStats = {
  totalReports: number;
  activeReports: number;
  resolvedReports: number;
  highSeverityReports: number;
  points: number;
  areas: number;
  badges: number;
};

const normalizeText = (value?: string | null): string | null => {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  return normalized.length > 0 ? normalized : null;
};

const getInitials = (value: string): string => {
  return value
    .split(" ")
    .map((item) => item.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export const useProfileScreen = () => {
  const router = useRouter();
  const { user, logout, updateUserProfile } = useAuth();
  const { t } = useI18n();

  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftPhotoUri, setDraftPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribeReports = subscribeToIncidents(
      (items) => {
        setReports(items);
        setErrorMessage(null);
        setLoading(false);
      },
      (error) => {
        console.error("Profile reports error:", error);
        setErrorMessage(error.message || "Could not load report data.");
        setLoading(false);
      }
    );

    return unsubscribeReports;
  }, []);

  const displayName = useMemo(() => {
    return (
      user?.displayName || user?.email?.split("@")[0] || "Community Reporter"
    );
  }, [user?.displayName, user?.email]);

  const userEmail = user?.email || "-";
  const photoURL = user?.photoURL ?? null;

  useEffect(() => {
    setDraftName(displayName);
    setDraftPhotoUri(photoURL);
  }, [displayName, photoURL]);

  const userInitial = useMemo(() => {
    return getInitials(displayName);
  }, [displayName]);

  const userReports = useMemo(() => {
    const uidKey = normalizeText(user?.uid);
    const emailKey = normalizeText(user?.email);
    const nameKey = normalizeText(user?.displayName);

    return reports.filter((report) => {
      const reporterUid = normalizeText(report.reporterUid);
      const reporterEmail = normalizeText(report.reporterEmail);
      const reportedBy = normalizeText(report.reportedBy);

      if (uidKey && reporterUid === uidKey) {
        return true;
      }

      if (emailKey) {
        return reporterEmail === emailKey || reportedBy === emailKey;
      }

      if (nameKey) {
        return reportedBy === nameKey;
      }

      return false;
    });
  }, [reports, user?.uid, user?.email, user?.displayName]);

  const stats = useMemo<ProfileStats>(() => {
    const totalReports = userReports.length;
    const activeReports = userReports.filter((report) => report.status === "active")
      .length;
    const resolvedReports = userReports.filter(
      (report) => report.status === "resolved"
    ).length;
    const highSeverityReports = userReports.filter((report) => {
      return (report.urgencyLevel ?? report.severity) === "high";
    }).length;
    const areaKeys = new Set(
      userReports.map((report) => {
        if (report.address?.trim()) {
          return report.address.trim().split(",").slice(-2).join(",").trim();
        }

        return `${report.latitude.toFixed(1)},${report.longitude.toFixed(1)}`;
      })
    );
    const points =
      totalReports * 35 + resolvedReports * 45 + highSeverityReports * 20;

    return {
      totalReports,
      activeReports,
      resolvedReports,
      highSeverityReports,
      points,
      areas: areaKeys.size,
      badges: [
        totalReports > 0,
        resolvedReports > 0,
        highSeverityReports > 0,
        areaKeys.size >= 3,
      ].filter(Boolean).length,
    };
  }, [userReports]);

  const handleLogout = () => {
    Alert.alert(
      t("profile.hook.logout.title"),
      t("profile.hook.logout.message"),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("profile.action.logout"),
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              router.replace(LOGIN_ROUTE);
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert(
                t("profile.hook.logout.error.title"),
                t("profile.hook.logout.error.message")
              );
            }
          },
        },
      ]
    );
  };

  const pickProfilePhoto = async () => {
    if (savingProfile) {
      return;
    }

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          t("profile.hook.photo.permission.title"),
          t("profile.hook.photo.permission.message")
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.75,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (result.canceled) {
        return;
      }

      const assetUri = result.assets?.[0]?.uri;

      if (!assetUri) {
        Alert.alert(
          t("profile.hook.photo.invalid.title"),
          t("profile.hook.photo.invalid.message")
        );
        return;
      }

      setSavingProfile(true);
      setDraftPhotoUri(assetUri);

      const nextPhotoURL = await uploadImageAsync(assetUri, "profile-images");

      await updateUserProfile({
        displayName,
        photoURL: nextPhotoURL,
      });

      setDraftPhotoUri(nextPhotoURL);
      Alert.alert(
        t("profile.hook.photo.success.title"),
        t("profile.hook.photo.success.message")
      );
    } catch (error) {
      setDraftPhotoUri(photoURL);
      Alert.alert(
        t("profile.hook.photo.error.title"),
        error instanceof Error
          ? error.message
          : t("profile.hook.photo.error.message")
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const saveProfile = async () => {
    const cleanName = draftName.trim();

    if (!user) {
      Alert.alert(
        t("profile.hook.save.noLogin.title"),
        t("profile.hook.save.noLogin.message")
      );
      return;
    }

    if (cleanName.length < 2) {
      Alert.alert(
        t("profile.alert.nameTooShort.title"),
        t("profile.alert.nameTooShort.message")
      );
      return;
    }

    try {
      setSavingProfile(true);

      const shouldUploadPhoto =
        draftPhotoUri &&
        draftPhotoUri !== photoURL &&
        !draftPhotoUri.startsWith("http");

      const nextPhotoURL = shouldUploadPhoto
        ? await uploadImageAsync(draftPhotoUri, "profile-images")
        : draftPhotoUri;

      await updateUserProfile({
        displayName: cleanName,
        photoURL: nextPhotoURL,
      });

      setDraftPhotoUri(nextPhotoURL);
      Alert.alert(
        t("profile.hook.save.success.title"),
        t("profile.hook.save.success.message")
      );
    } catch (error) {
      console.error("Update profile error:", error);
      Alert.alert(
        t("profile.hook.save.error.title"),
        error instanceof Error
          ? error.message
          : t("profile.hook.save.error.message")
      );
    } finally {
      setSavingProfile(false);
    }
  };

  return {
    loading,
    savingProfile,
    errorMessage,
    displayName,
    userEmail,
    userInitial,
    photoURL,
    draftName,
    setDraftName,
    draftPhotoUri,
    reports,
    userReports,
    stats,
    pickProfilePhoto,
    saveProfile,
    handleLogout,
  };
};
