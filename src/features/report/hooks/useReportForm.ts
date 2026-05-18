import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { useAuth } from "../../../contexts/AuthContext";
import { type TFunction, useI18n } from "../../../i18n";
import { uploadImageAsync } from "../../../services/cloudinaryService";
import {
  createIncidentReport,
  findNearbyActiveIncidentCandidates,
  type NearbyIncidentCandidate,
} from "../../../services/incidentService";
import type {
  IncidentCategory,
  IncidentSeverity,
  IncidentSubcategory,
} from "../../../types/incident";
import { formatDistance } from "../../../utils/geo";

const MAP_ROUTE = "/(tabs)/map" as Href;

const LOCATION_MAX_ACCURACY_METERS = 80;
const MAX_REPORT_PHOTOS = 4;
const DUPLICATE_CHECK_RADIUS_METERS = 150;

export const useReportForm = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useI18n();

  const [category, setCategory] = useState<IncidentCategory | null>(null);
  const [subcategory, setSubcategory] =
    useState<IncidentSubcategory | null>(null);
  const [severity, setSeverity] = useState<IncidentSeverity>("medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const cleanTitle = title.trim();
  const cleanDescription = description.trim();

  const canSubmit = Boolean(
    user &&
      category &&
      subcategory &&
      cleanTitle.length >= 5 &&
      cleanDescription.length >= 10 &&
      photoUris.length >= 1 &&
      photoUris.length <= MAX_REPORT_PHOTOS &&
      !loading
  );

  const handleSetCategory = (cat: IncidentCategory) => {
    setCategory(cat);
    setSubcategory(null);
  };

  const appendPhotos = (uris: string[]) => {
    setPhotoUris((current) => {
      const merged = Array.from(new Set([...current, ...uris]));
      return merged.slice(0, MAX_REPORT_PHOTOS);
    });
  };

  const takePhoto = async () => {
    if (loading) return;
    if (photoUris.length >= MAX_REPORT_PHOTOS) {
      Alert.alert(
        t("report.validation.photoLimit.title"),
        t("common.photoLimit", { max: MAX_REPORT_PHOTOS })
      );
      return;
    }
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          t("report.validation.cameraPermission.title"),
          t("report.validation.cameraPermission.message")
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.75,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (result.canceled) return;
      const assetUri = result.assets?.[0]?.uri;
      if (!assetUri) {
        Alert.alert(
          t("report.validation.invalidPhoto.title"),
          t("report.validation.invalidCapturedPhoto.message")
        );
        return;
      }
      appendPhotos([assetUri]);
    } catch (error) {
      Alert.alert(
        t("report.error.openCamera.title"),
        error instanceof Error
          ? error.message
          : t("report.error.openCamera.fallback")
      );
    }
  };

  const pickFromGallery = async () => {
    if (loading) return;
    if (photoUris.length >= MAX_REPORT_PHOTOS) {
      Alert.alert(
        t("report.validation.photoLimit.title"),
        t("common.photoLimit", { max: MAX_REPORT_PHOTOS })
      );
      return;
    }
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          t("report.validation.galleryPermission.title"),
          t("report.validation.galleryPermission.message")
        );
        return;
      }
      const remainingSlots = MAX_REPORT_PHOTOS - photoUris.length;
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
        quality: 0.75,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (result.canceled) return;
      const uris = result.assets
        .map((asset) => asset.uri)
        .filter((uri): uri is string => Boolean(uri));
      if (uris.length === 0) {
        Alert.alert(
          t("report.validation.invalidPhoto.title"),
          t("report.validation.invalidSelectedPhoto.message")
        );
        return;
      }
      appendPhotos(uris);
    } catch (error) {
      Alert.alert(
        t("report.error.openGallery.title"),
        error instanceof Error
          ? error.message
          : t("report.error.openGallery.fallback")
      );
    }
  };

  const removePhoto = (photoUri: string) => {
    setPhotoUris((current) => current.filter((item) => item !== photoUri));
  };

  const resetForm = () => {
    setCategory(null);
    setSubcategory(null);
    setSeverity("medium");
    setTitle("");
    setDescription("");
    setPhotoUris([]);
  };

  const validateForm = () => {
    if (!user) {
      Alert.alert(
        t("report.validation.loginRequired.title"),
        t("report.validation.loginRequired.message")
      );
      return false;
    }
    if (!category) {
      Alert.alert(
        t("report.validation.categoryRequired.title"),
        t("report.validation.categoryRequired.message")
      );
      return false;
    }
    if (!subcategory) {
      Alert.alert(
        t("report.validation.subcategoryRequired.title"),
        t("report.validation.subcategoryRequired.message")
      );
      return false;
    }
    if (cleanTitle.length < 5) {
      Alert.alert(
        t("report.validation.titleTooShort.title"),
        t("report.validation.titleTooShort.message", { min: 5 })
      );
      return false;
    }
    if (cleanDescription.length < 10) {
      Alert.alert(
        t("report.validation.descriptionTooShort.title"),
        t("report.validation.descriptionTooShort.message", { min: 10 })
      );
      return false;
    }
    if (photoUris.length < 1) {
      Alert.alert(
        t("report.validation.photoRequired.title"),
        t("report.validation.photoRequired.message")
      );
      return false;
    }
    if (photoUris.length > MAX_REPORT_PHOTOS) {
      Alert.alert(
        t("report.validation.photoLimit.title"),
        t("common.photoLimit", { max: MAX_REPORT_PHOTOS })
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm() || !user || !category || !subcategory) return;
      setLoading(true);

      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          t("report.validation.locationPermission.title"),
          t("report.validation.locationPermission.message")
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const accuracy = location.coords.accuracy ?? 999;

      if (accuracy > LOCATION_MAX_ACCURACY_METERS) {
        Alert.alert(
          t("report.validation.lowAccuracy.title"),
          t("report.validation.lowAccuracy.message", {
            accuracy: Math.round(accuracy),
          })
        );
        return;
      }

      const nearbyCandidates = await findNearbyActiveIncidentCandidates({
        category,
        subcategory,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        radiusMeters: DUPLICATE_CHECK_RADIUS_METERS,
      });

      if (nearbyCandidates.length > 0) {
        const shouldCreateNewReport = await confirmNewReportDespiteDuplicate(
          nearbyCandidates[0],
          t
        );

        if (!shouldCreateNewReport) {
          router.push(MAP_ROUTE);
          return;
        }
      }

      const uploadedImageUrls = await Promise.all(
        photoUris.map((photoUri) =>
          uploadImageAsync(photoUri, "incident-images")
        )
      );

      if (uploadedImageUrls.length < 1) {
        Alert.alert(
          t("report.validation.uploadFailed.title"),
          t("report.validation.uploadFailed.message")
        );
        return;
      }

      await createIncidentReport({
        category,
        subcategory,
        title: cleanTitle,
        description: cleanDescription,
        severity,
        imageUri: uploadedImageUrls[0],
        imageUris: uploadedImageUrls,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        locationAccuracyMeters: Math.round(accuracy),
        address: null,
        reportedBy: user.displayName || user.email || "Anonymous",
        reporterUid: user.uid,
        reporterEmail: user.email ?? null,
      });

      Alert.alert(t("report.success.title"), t("report.success.message"), [
        {
          text: t("report.success.viewMap"),
          onPress: () => {
            resetForm();
            router.push(MAP_ROUTE);
          },
        },
        { text: t("report.success.createAnother"), onPress: resetForm },
      ]);
    } catch (error) {
      console.error("Create report error:", error);
      Alert.alert(
        t("report.error.send.title"),
        error instanceof Error
          ? error.message
          : t("report.error.send.fallback")
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    category,
    setCategory: handleSetCategory,
    subcategory,
    setSubcategory,
    severity,
    setSeverity,
    title,
    setTitle,
    description,
    setDescription,
    photoUris,
    setPhotoUris,
    loading,
    canSubmit,
    takePhoto,
    pickFromGallery,
    removePhoto,
    handleSubmit,
  };
};

function confirmNewReportDespiteDuplicate(
  candidate: NearbyIncidentCandidate,
  t: TFunction
): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      t("report.duplicate.title"),
      t("report.duplicate.message", {
        title: candidate.incident.title,
        distance: formatDistance(candidate.distanceMeters),
      }),
      [
        {
          text: t("report.duplicate.reviewMap"),
          style: "cancel",
          onPress: () => resolve(false),
        },
        {
          text: t("report.duplicate.submitNew"),
          style: "destructive",
          onPress: () => resolve(true),
        },
      ]
    );
  });
}
