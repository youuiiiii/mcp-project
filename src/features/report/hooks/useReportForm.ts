import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import {
  calculateIncidentUrgency,
  DEFAULT_IMPACT_ANSWERS,
  getReportKindOption,
  IMPACT_QUESTION_OPTIONS,
  type ReportKindOption,
} from "../../../constants/reportTaxonomy";
import { useAuth } from "../../../contexts/AuthContext";
import { type TFunction, useI18n } from "../../../i18n";
import { uploadImageAsync } from "../../../services/cloudinaryService";
import {
  createIncidentReport,
  findNearbyActiveIncidentCandidates,
  type NearbyIncidentCandidate,
} from "../../../services/incidentService";
import type {
  Coordinate,
  IncidentImpactAnswers,
  IncidentImpactKey,
  IncidentKind,
  ReportLocationDraft,
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

  const [kind, setKind] = useState<IncidentKind | null>(null);
  const [impactAnswers, setImpactAnswers] = useState<IncidentImpactAnswers>({
    ...DEFAULT_IMPACT_ANSWERS,
  });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [incidentLocation, setIncidentLocation] =
    useState<ReportLocationDraft | null>(null);
  const [reporterLocation, setReporterLocation] =
    useState<ReportLocationDraft | null>(null);

  const cleanTitle = title.trim();
  const cleanDescription = description.trim();

  const canSubmit = Boolean(
    user &&
      kind &&
      photoUris.length >= 1 &&
      photoUris.length <= MAX_REPORT_PHOTOS &&
      !loading
  );

  const handleSetKind = (nextKind: IncidentKind) => {
    setKind(nextKind);
  };

  const toggleImpactAnswer = (key: IncidentImpactKey) => {
    setImpactAnswers((current) => ({
      ...current,
      [key]: current[key] !== true,
    }));
  };

  const appendPhotos = (uris: string[]) => {
    setPhotoUris((current) => {
      const merged = Array.from(new Set([...current, ...uris]));
      return merged.slice(0, MAX_REPORT_PHOTOS);
    });
  };

  const requestCurrentLocation = async (): Promise<ReportLocationDraft | null> => {
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
  };

  const useCurrentLocationForIncident = async (): Promise<ReportLocationDraft | null> => {
    if (loading || loadingLocation) return null;

    try {
      setLoadingLocation(true);
      const currentLocation = await requestCurrentLocation();

      if (!currentLocation) return null;

      setReporterLocation(currentLocation);
      setIncidentLocation(currentLocation);
      return currentLocation;
    } catch (error) {
      Alert.alert(
        t("report.error.send.title"),
        error instanceof Error ? error.message : t("report.error.send.fallback")
      );
      return null;
    } finally {
      setLoadingLocation(false);
    }
  };

  const updateManualIncidentLocation = (coordinate: Coordinate) => {
    setIncidentLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      accuracyMeters: null,
      source: "manual_pin",
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
    setKind(null);
    setImpactAnswers({ ...DEFAULT_IMPACT_ANSWERS });
    setTitle("");
    setDescription("");
    setPhotoUris([]);
    setIncidentLocation(null);
    setReporterLocation(null);
  };

  const validateForm = () => {
    if (!user) {
      Alert.alert(
        t("report.validation.loginRequired.title"),
        t("report.validation.loginRequired.message")
      );
      return false;
    }
    if (!kind) {
      Alert.alert(
        t("report.validation.kindRequired.title"),
        t("report.validation.kindRequired.message")
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
      if (!validateForm() || !user || !kind) return;
      setLoading(true);
      const kindOption = getReportKindOption(kind);

      if (!kindOption) {
        Alert.alert(
          t("report.validation.kindRequired.title"),
          t("report.validation.kindRequired.message")
        );
        return;
      }

      const currentReporterLocation = await requestCurrentLocation();

      if (!currentReporterLocation) return;

      const selectedIncidentLocation = incidentLocation ?? currentReporterLocation;

      setReporterLocation(currentReporterLocation);

      if (!incidentLocation) {
        setIncidentLocation(currentReporterLocation);
      }

      const urgency = calculateIncidentUrgency({
        kind,
        impactAnswers,
      });
      const reportDraft = buildReportDraft({
        cleanTitle,
        cleanDescription,
        impactAnswers,
        kindOption,
        t,
      });

      const nearbyCandidates = await findNearbyActiveIncidentCandidates({
        category: kindOption.legacyCategory,
        subcategory: kindOption.legacySubcategory,
        latitude: selectedIncidentLocation.latitude,
        longitude: selectedIncidentLocation.longitude,
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
        category: kindOption.legacyCategory,
        subcategory: kindOption.legacySubcategory,
        domain: kindOption.domain,
        kind,
        impactAnswers,
        urgencyScore: urgency.score,
        urgencyLevel: urgency.level,
        title: reportDraft.title,
        description: reportDraft.description,
        severity: urgency.severity,
        imageUri: uploadedImageUrls[0],
        imageUris: uploadedImageUrls,
        latitude: selectedIncidentLocation.latitude,
        longitude: selectedIncidentLocation.longitude,
        locationSource: selectedIncidentLocation.source,
        reportedFromLatitude: currentReporterLocation.latitude,
        reportedFromLongitude: currentReporterLocation.longitude,
        locationAccuracyMeters: currentReporterLocation.accuracyMeters,
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
    kind,
    setKind: handleSetKind,
    impactAnswers,
    toggleImpactAnswer,
    title,
    setTitle,
    description,
    setDescription,
    photoUris,
    setPhotoUris,
    loading,
    loadingLocation,
    incidentLocation,
    reporterLocation,
    canSubmit,
    useCurrentLocationForIncident,
    updateManualIncidentLocation,
    takePhoto,
    pickFromGallery,
    removePhoto,
    handleSubmit,
  };
};

function buildReportDraft({
  cleanTitle,
  cleanDescription,
  impactAnswers,
  kindOption,
  t,
}: {
  cleanTitle: string;
  cleanDescription: string;
  impactAnswers: IncidentImpactAnswers;
  kindOption: ReportKindOption;
  t: TFunction;
}) {
  const kindLabel = t(kindOption.labelKey);
  const title = cleanTitle || kindOption.defaultTitle;
  const selectedImpacts = IMPACT_QUESTION_OPTIONS.filter((item) => {
    return impactAnswers[item.value] === true;
  }).map((item) => t(item.labelKey));
  const impactSentence =
    selectedImpacts.length > 0
      ? `Current impact: ${selectedImpacts.join(", ")}.`
      : "No additional impact flags selected.";
  const description =
    cleanDescription ||
    `${kindLabel} reported near the selected map pin. ${impactSentence}`;

  return {
    title,
    description,
  };
}

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
