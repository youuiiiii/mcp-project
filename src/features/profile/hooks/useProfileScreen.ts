import * as ImagePicker from "expo-image-picker";
import { type Href, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

import { useAuth } from "../../../contexts/AuthContext";
import { uploadImageAsync } from "../../../services/cloudinaryService";
import { subscribeToIncidents } from "../../../services/incidentService";
import type { IncidentReport } from "../../../types/incident";

const LOGIN_ROUTE = "/login" as Href;

export type ProfileStats = {
  totalReports: number;
  activeReports: number;
  resolvedReports: number;
  highSeverityReports: number;
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
        setErrorMessage(error.message || "Gagal memuat data laporan.");
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
    const emailKey = normalizeText(user?.email);
    const nameKey = normalizeText(user?.displayName);

    return reports.filter((report) => {
      const reporterEmail = normalizeText(report.reporterEmail);
      const reportedBy = normalizeText(report.reportedBy);

      if (emailKey) {
        return reporterEmail === emailKey || reportedBy === emailKey;
      }

      if (nameKey) {
        return reportedBy === nameKey;
      }

      return false;
    });
  }, [reports, user?.email, user?.displayName]);

  const stats = useMemo<ProfileStats>(() => {
    return {
      totalReports: userReports.length,
      activeReports: userReports.filter((report) => report.status === "active")
        .length,
      resolvedReports: userReports.filter(
        (report) => report.status === "resolved"
      ).length,
      highSeverityReports: userReports.filter(
        (report) => report.severity === "high"
      ).length,
    };
  }, [userReports]);

  const handleLogout = () => {
    Alert.alert("Logout", "Keluar dari akun ini?", [
      {
        text: "Batal",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            router.replace(LOGIN_ROUTE);
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Logout Gagal", "Terjadi kesalahan saat logout.");
          }
        },
      },
    ]);
  };

  const pickProfilePhoto = async () => {
    if (savingProfile) {
      return;
    }

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Izin Galeri Dibutuhkan",
          "Aktifkan izin galeri untuk memilih foto profil."
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
        Alert.alert("Foto Tidak Valid", "Gagal membaca gambar dari galeri.");
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
      Alert.alert("Foto Profil Tersimpan", "Foto profil berhasil diperbarui.");
    } catch (error) {
      setDraftPhotoUri(photoURL);
      Alert.alert(
        "Gagal Mengubah Foto",
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengubah foto profil."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const saveProfile = async () => {
    const cleanName = draftName.trim();

    if (!user) {
      Alert.alert("Belum Login", "Silakan login terlebih dahulu.");
      return;
    }

    if (cleanName.length < 2) {
      Alert.alert("Nama Terlalu Pendek", "Nama minimal 2 karakter.");
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
        "Profil Tersimpan",
        "Nama dan foto profil berhasil diperbarui."
      );
    } catch (error) {
      console.error("Update profile error:", error);
      Alert.alert(
        "Gagal Menyimpan Profil",
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan profil."
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
    stats,
    pickProfilePhoto,
    saveProfile,
    handleLogout,
  };
};
