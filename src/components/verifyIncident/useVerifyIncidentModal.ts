import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

import { VERIFICATION_DISTANCE_METERS } from "../../constants/incident";
import { useAuth } from "../../contexts/AuthContext";
import { uploadImageAsync } from "../../services/cloudinaryService";
import { createIncidentVerification } from "../../services/incidentService";
import type {
  Coordinate,
  IncidentConditionStatus,
  VerificationType,
} from "../../types/incident";
import { formatDistance, getDistanceInMeters } from "../../utils/geo";
import type { VerifyIncidentModalProps } from "./types";
import { CONDITION_OPTIONS } from "./verificationOptions";

export function useVerifyIncidentModal({
  incident,
  userLocation,
  onClose,
  onSuccess,
}: Pick<
  VerifyIncidentModalProps,
  "incident" | "userLocation" | "onClose" | "onSuccess"
>) {
  const { user } = useAuth();

  const [verificationType, setVerificationType] =
    useState<VerificationType>("valid");
  const [conditionStatus, setConditionStatus] =
    useState<IncidentConditionStatus>("still_happening");
  const [note, setNote] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const actorKey = user?.uid ?? user?.email ?? null;

  const conditionOptions = useMemo(() => {
    if (verificationType === "invalid") {
      return CONDITION_OPTIONS.filter((item) => item.value === "not_found");
    }

    if (verificationType === "valid") {
      return CONDITION_OPTIONS.filter((item) =>
        ["still_happening", "getting_worse"].includes(item.value)
      );
    }

    return CONDITION_OPTIONS;
  }, [verificationType]);

  const canSubmit =
    Boolean(incident && user && actorKey && imageUri && note.trim().length >= 8) &&
    !submitting;

  useEffect(() => {
    if (verificationType === "invalid") {
      setConditionStatus("not_found");
      return;
    }

    setConditionStatus("still_happening");
  }, [verificationType]);

  const resetForm = () => {
    setVerificationType("valid");
    setConditionStatus("still_happening");
    setNote("");
    setImageUri(null);
    setSubmitting(false);
  };

  const handleClose = () => {
    if (submitting) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Camera Permission Denied",
          "The app needs camera permission to capture verification evidence."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.7,
      });

      if (result.canceled) {
        return;
      }

      const uri = result.assets?.[0]?.uri;

      if (!uri) {
        Alert.alert("Invalid Photo", "Could not read the captured photo.");
        return;
      }

      setImageUri(uri);
      Haptics.selectionAsync().catch(() => {});
    } catch (error) {
      Alert.alert(
        "Could Not Open Camera",
        error instanceof Error
          ? error.message
          : "Something went wrong while opening the camera."
      );
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Gallery Permission Denied",
          "The app needs gallery permission to choose verification evidence."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 0.7,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (result.canceled) {
        return;
      }

      const uri = result.assets?.[0]?.uri;

      if (!uri) {
        Alert.alert("Invalid Photo", "Could not read the selected gallery image.");
        return;
      }

      setImageUri(uri);
      Haptics.selectionAsync().catch(() => {});
    } catch (error) {
      Alert.alert(
        "Could Not Open Gallery",
        error instanceof Error
          ? error.message
          : "Something went wrong while opening the gallery."
      );
    }
  };

  const getVerificationLocation = async (): Promise<Coordinate | null> => {
    if (userLocation) {
      return userLocation;
    }

    const permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status !== "granted") {
      Alert.alert(
        "Location Permission Needed",
        "Allow location access so the app can confirm you are near the incident."
      );
      return null;
    }

    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };
  };

  const validateForm = (currentLocation: Coordinate | null) => {
    if (!user || !actorKey) {
      Alert.alert("Login Required", "Please log in to send an update.");
      return false;
    }

    if (!incident) {
      Alert.alert("Invalid Incident", "Incident data was not found.");
      return false;
    }

    const actorAliases = [user?.uid, user?.email, user?.displayName].filter(
      (item): item is string => Boolean(item)
    );

    const isOwnIncident = actorAliases.some((item) => {
      return (
        incident.reporterUid === item ||
        incident.reporterEmail === item ||
        incident.reportedBy === item
      );
    });

    const hasVerified = actorAliases.some((item) => {
      return (
        incident.verifiedBy?.includes(item) ||
        incident.disputedBy?.includes(item)
      );
    });

    if (verificationType !== "condition_update" && isOwnIncident) {
      Alert.alert(
        "Cannot Verify",
        "You cannot verify a report you created. Use Condition Update if you want to update the condition."
      );
      return false;
    }

    if (verificationType !== "condition_update" && hasVerified) {
      Alert.alert(
        "Already Verified",
        "You have already submitted a valid/not accurate verification. Use Condition Update to add newer information."
      );
      return false;
    }

    if (!imageUri) {
      Alert.alert(
        "Evidence Photo Required",
        "Verification or condition updates must include a fresh photo."
      );
      return false;
    }

    const cleanNote = note.trim();

    if (!cleanNote) {
      Alert.alert(
        "Notes Required",
        "Add a short note about the incident condition."
      );
      return false;
    }

    if (cleanNote.length < 8) {
      Alert.alert("Notes Too Short", "Notes must be at least 8 characters.");
      return false;
    }

    if (!currentLocation) {
      Alert.alert(
        "Location Unavailable",
        "The app has not received your realtime location yet."
      );
      return false;
    }

    const distance = getDistanceInMeters(currentLocation, {
      latitude: incident.latitude,
      longitude: incident.longitude,
    });

    if (distance > VERIFICATION_DISTANCE_METERS) {
      Alert.alert(
        "Too Far From Incident",
        `You can only send verification or updates when you are within ${VERIFICATION_DISTANCE_METERS} meters of the incident location.\n\nYour current distance is about ${formatDistance(
          distance
        )}.`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!incident || !imageUri || !actorKey || note.trim().length < 8) {
        validateForm(userLocation ?? null);
        return;
      }

      const verificationLocation = await getVerificationLocation();

      if (!validateForm(verificationLocation) || !verificationLocation) {
        return;
      }

      setSubmitting(true);

      const uploadedImageUrl = await uploadImageAsync(
        imageUri,
        "incident-images"
      );

      await createIncidentVerification({
        reportId: incident.id,
        verificationType,
        conditionStatus,
        note: note.trim(),
        imageUri: uploadedImageUrl,
        latitude: verificationLocation.latitude,
        longitude: verificationLocation.longitude,
        userName: user?.displayName ?? user?.email ?? "Anonymous",
        userEmail: user?.email ?? null,
        actorKey,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {}
      );

      Alert.alert(
        "Update Sent",
        "The evidence photo and notes were sent to the incident timeline.",
        [
          {
            text: "OK",
            onPress: () => {
              resetForm();
              onSuccess?.();
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Could Not Send Update",
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the update."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    verificationType,
    setVerificationType,
    conditionStatus,
    setConditionStatus,
    conditionOptions,
    note,
    setNote,
    imageUri,
    setImageUri,
    submitting,
    canSubmit,
    handleClose,
    handleTakePhoto,
    handlePickFromGallery,
    handleSubmit,
  };
}
