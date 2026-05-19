import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";

import { useAuth } from "../../contexts/AuthContext";
import { uploadImageAsync } from "../../services/cloudinaryService";
import { resolveIncidentReport } from "../../services/incidentService";
import type { ResolveIncidentModalProps } from "./types";

export function useResolveIncidentModal({
  incident,
  onClose,
  onSuccess,
}: Pick<ResolveIncidentModalProps, "incident" | "onClose" | "onSuccess">) {
  const { user, isModerator, roleLoading } = useAuth();

  const [resolutionNote, setResolutionNote] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const actorKey = user?.uid ?? null;

  const canSubmit = Boolean(
    incident &&
      user &&
      actorKey &&
      isModerator &&
      !roleLoading &&
      imageUri &&
      resolutionNote.trim().length >= 10
  ) && !submitting;

  const resetForm = () => {
    setResolutionNote("");
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
          "The app needs camera permission to capture resolution evidence."
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
          "The app needs gallery permission to choose resolution evidence."
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

  const validateForm = () => {
    if (!user || !actorKey) {
      Alert.alert("Login Required", "Please log in first.");
      return false;
    }

    if (roleLoading) {
      Alert.alert(
        "Checking Access",
        "Wait until your moderator access has finished loading."
      );
      return false;
    }

    if (!isModerator) {
      Alert.alert(
        "Moderator Access Required",
        "Only moderators can mark a report as resolved. Nearby users can use On-site Check instead."
      );
      return false;
    }

    if (!incident) {
      Alert.alert("Invalid Report", "Report data was not found.");
      return false;
    }

    if (!imageUri) {
      Alert.alert(
        "Evidence Photo Required",
        "You must add a fresh photo showing the incident has been resolved."
      );
      return false;
    }

    const cleanNote = resolutionNote.trim();

    if (!cleanNote) {
      Alert.alert(
        "Notes Required",
        "Explain why this report can be marked resolved."
      );
      return false;
    }

    if (cleanNote.length < 10) {
      Alert.alert(
        "Notes Too Short",
        "Resolution notes must be at least 10 characters."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!incident || !imageUri || !actorKey || resolutionNote.trim().length < 10) {
        validateForm();
        return;
      }

      if (!validateForm()) {
        return;
      }

      setSubmitting(true);

      const uploadedImageUrl = await uploadImageAsync(
        imageUri,
        "resolution-images"
      );

      await resolveIncidentReport({
        reportId: incident.id,
        resolvedImageUri: uploadedImageUrl,
        resolutionNote: resolutionNote.trim(),
        resolvedBy: user?.displayName ?? user?.email ?? user?.uid,
        resolvedByActorKey: actorKey,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {}
      );

      Alert.alert(
        "Report Marked Resolved",
        "Resolution evidence was saved. The report is now marked resolved.",
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
        "Could Not Resolve Report",
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the resolution evidence."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    resolutionNote,
    setResolutionNote,
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
