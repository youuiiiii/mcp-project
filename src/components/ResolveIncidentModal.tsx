import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";

import AppButton from "./ui/AppButton";
import AppCard from "./ui/AppCard";
import SectionHeader from "./ui/SectionHeader";
import StatusBadge from "./ui/StatusBadge";
import EvidencePicker from "../features/incident/components/EvidencePicker";
import IncidentModalShell from "../features/incident/components/IncidentModalShell";
import IncidentPreviewCard from "../features/incident/components/IncidentPreviewCard";
import { useAuth } from "../contexts/AuthContext";
import { uploadImageAsync } from "../services/cloudinaryService";
import { resolveIncidentReport } from "../services/incidentService";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/layout";
import { typography } from "../theme/typography";
import { IncidentReport } from "../types/incident";

type ResolveIncidentModalProps = {
  visible: boolean;
  incident: IncidentReport | null;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function ResolveIncidentModal({
  visible,
  incident,
  onClose,
  onSuccess,
}: ResolveIncidentModalProps) {
  const { user } = useAuth();

  const [resolutionNote, setResolutionNote] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    Boolean(incident && user && imageUri && resolutionNote.trim().length >= 10) &&
    !submitting;

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
        allowsEditing: true,
        quality: 0.7,
        aspect: [4, 3],
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
        allowsEditing: true,
        quality: 0.7,
        aspect: [4, 3],
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
    if (!user) {
      Alert.alert("Login Required", "Please log in first.");
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
      if (!validateForm() || !incident || !imageUri) {
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
          : "Terjadi kesalahan saat menyimpan bukti selesai."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <IncidentModalShell
      visible={visible}
      title="Resolution Validation"
      subtitle="Upload gambar terbaru agar status selesai bisa dipercaya."
      submitting={submitting}
      onClose={handleClose}
      footer={
        <>
          <AppButton
            title="Cancel"
            variant="secondary"
            size="lg"
            disabled={submitting}
            onPress={handleClose}
            style={styles.footerCancelButton}
          />

          <AppButton
            title="Mark Resolved"
            variant="danger"
            size="lg"
            loading={submitting}
            disabled={!canSubmit}
            onPress={handleSubmit}
            leftIcon={
              <Ionicons
                name="checkmark-done"
                size={18}
                color={colors.textInverse}
              />
            }
            style={styles.footerSubmitButton}
          />
        </>
      }
    >
      {incident ? <IncidentPreviewCard incident={incident} /> : null}

      <AppCard variant="muted" style={styles.noticeCard}>
        <StatusBadge label="Validation Required" variant="warning" size="sm" />

        <View style={styles.noticeTextGroup}>
          <Ionicons name="warning" size={20} color={colors.warningDark} />
          <TextInput
            editable={false}
            multiline
            value="The photo should match the report and show that the location is safe, cleared, or no longer disrupting nearby activity."
            style={styles.noticeText}
          />
        </View>
      </AppCard>

      <EvidencePicker
        title="Resolution Evidence Photo"
        subtitle="Upload a fresh photo as evidence that the incident is resolved."
        emptyTitle="No resolution evidence yet"
        emptyMessage="Upload a fresh photo as evidence that the incident is resolved."
        imageUri={imageUri}
        disabled={submitting}
        onTakePhoto={handleTakePhoto}
        onPickFromGallery={handlePickFromGallery}
        onRemoveImage={() => setImageUri(null)}
      />

      <View style={styles.section}>
        <SectionHeader
          title="Resolution Notes"
          subtitle="Explain why this report can be marked resolved."
        />

        <TextInput
          value={resolutionNote}
          onChangeText={setResolutionNote}
          placeholder="Example: The road has been cleared and vehicles can pass."
          placeholderTextColor={colors.textSoft}
          style={styles.input}
          multiline
          textAlignVertical="top"
          editable={!submitting}
        />

        <StatusBadge
          label={`${Math.max(
            resolutionNote.trim().length,
            0
          )}/10 minimum characters`}
          variant={resolutionNote.trim().length >= 10 ? "success" : "neutral"}
          size="sm"
        />
      </View>
    </IncidentModalShell>
  );
}

const styles = StyleSheet.create({
  noticeCard: {
    marginTop: spacing["2xl"],
    gap: spacing.md,
    backgroundColor: colors.warningSoft,
    borderColor: "#FDE68A",
  },
  noticeTextGroup: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  noticeText: {
    flex: 1,
    padding: 0,
    margin: 0,
    ...typography.caption,
    color: "#92400E",
  },
  section: {
    marginTop: spacing["2xl"],
    gap: spacing.md,
  },
  input: {
    minHeight: 112,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: 13,
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    lineHeight: 20,
  },
  footerCancelButton: {
    flex: 1,
  },
  footerSubmitButton: {
    flex: 1.45,
  },
});
