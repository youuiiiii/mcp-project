import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Alert } from "react-native";

import type { TFunction } from "../../../i18n";
import type { ReportLocationDraft } from "../../../types/incident";
import {
  LOCATION_MAX_ACCURACY_METERS,
  MAX_REPORT_PHOTOS,
} from "./reportFormConstants";

export function alertReportPhotoLimit(t: TFunction) {
  Alert.alert(
    t("report.validation.photoLimit.title"),
    t("common.photoLimit", { max: MAX_REPORT_PHOTOS })
  );
}

export async function requestReportLocation(
  t: TFunction
): Promise<ReportLocationDraft | null> {
  const permission = await Location.requestForegroundPermissionsAsync();

  if (permission.status !== "granted") {
    Alert.alert(
      t("report.validation.locationPermission.title"),
      t("report.validation.locationPermission.message")
    );
    return null;
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
    return null;
  }

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    accuracyMeters: Math.round(accuracy),
    source: "current_location",
  };
}

export async function takeReportPhoto(t: TFunction): Promise<string | null> {
  try {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        t("report.validation.cameraPermission.title"),
        t("report.validation.cameraPermission.message")
      );
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.75,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.canceled) return null;

    const assetUri = result.assets?.[0]?.uri;

    if (!assetUri) {
      Alert.alert(
        t("report.validation.invalidPhoto.title"),
        t("report.validation.invalidCapturedPhoto.message")
      );
      return null;
    }

    return assetUri;
  } catch (error) {
    Alert.alert(
      t("report.error.openCamera.title"),
      error instanceof Error ? error.message : t("report.error.openCamera.fallback")
    );
    return null;
  }
}

export async function pickReportPhotos(
  t: TFunction,
  selectionLimit: number
): Promise<string[]> {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        t("report.validation.galleryPermission.title"),
        t("report.validation.galleryPermission.message")
      );
      return [];
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      allowsMultipleSelection: true,
      selectionLimit,
      quality: 0.75,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.canceled) return [];

    const uris = result.assets
      .map((asset) => asset.uri)
      .filter((uri): uri is string => Boolean(uri));

    if (uris.length === 0) {
      Alert.alert(
        t("report.validation.invalidPhoto.title"),
        t("report.validation.invalidSelectedPhoto.message")
      );
      return [];
    }

    return uris;
  } catch (error) {
    Alert.alert(
      t("report.error.openGallery.title"),
      error instanceof Error ? error.message : t("report.error.openGallery.fallback")
    );
    return [];
  }
}
