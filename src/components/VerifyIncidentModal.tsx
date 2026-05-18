import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

import AppButton from "./ui/AppButton";
import AppCard from "./ui/AppCard";
import IconBadge from "./ui/IconBadge";
import SectionHeader from "./ui/SectionHeader";
import StatusBadge from "./ui/StatusBadge";
import EvidencePicker from "../features/incident/components/EvidencePicker";
import IncidentModalShell from "../features/incident/components/IncidentModalShell";
import IncidentPreviewCard from "../features/incident/components/IncidentPreviewCard";
import {
  VERIFICATION_DISTANCE_METERS,
} from "../constants/incident";
import { useAuth } from "../contexts/AuthContext";
import { uploadImageAsync } from "../services/cloudinaryService";
import { createIncidentVerification } from "../services/incidentService";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/layout";
import { typography } from "../theme/typography";
import {
  Coordinate,
  IncidentConditionStatus,
  IncidentReport,
  VerificationType,
} from "../types/incident";
import { formatDistance, getDistanceInMeters } from "../utils/geo";

type AppIconName = keyof typeof Ionicons.glyphMap;

type VerifyIncidentModalProps = {
  visible: boolean;
  incident: IncidentReport | null;
  userLocation: Coordinate | null;
  onClose: () => void;
  onSuccess?: () => void;
};

type VerificationOption = {
  value: VerificationType;
  label: string;
  description: string;
  color: string;
  icon: AppIconName;
};

type ConditionOption = {
  value: IncidentConditionStatus;
  label: string;
  description: string;
  color: string;
  icon: AppIconName;
};

const VERIFICATION_OPTIONS: VerificationOption[] = [
  {
    value: "valid",
    label: "Confirmed",
    description: "I saw that this incident is real.",
    color: colors.success,
    icon: "checkmark-circle",
  },
  {
    value: "condition_update",
    label: "Condition Update",
    description: "The incident exists, but the condition needs an update.",
    color: colors.warning,
    icon: "sync-circle",
  },
  {
    value: "invalid",
    label: "Not Accurate",
    description: "I could not find an incident matching this report.",
    color: colors.danger,
    icon: "close-circle",
  },
];

const CONDITION_OPTIONS: ConditionOption[] = [
  {
    value: "still_happening",
    label: "Still Happening",
    description: "The incident is still happening at the location.",
    color: colors.warning,
    icon: "radio",
  },
  {
    value: "getting_worse",
    label: "Getting Worse",
    description: "The condition appears to be getting worse.",
    color: colors.danger,
    icon: "trending-up",
  },
  {
    value: "partially_resolved",
    label: "Improving",
    description: "The condition is improving, but not resolved yet.",
    color: colors.info,
    icon: "construct",
  },
  {
    value: "resolved_but_not_closed",
    label: "Appears Resolved",
    description: "The incident appears resolved, but still needs confirmation.",
    color: colors.success,
    icon: "checkmark-done",
  },
  {
    value: "not_found",
    label: "Not Found",
    description: "The incident was not found around the location.",
    color: colors.textMuted,
    icon: "search",
  },
];

export default function VerifyIncidentModal({
  visible,
  incident,
  userLocation,
  onClose,
  onSuccess,
}: VerifyIncidentModalProps) {
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
          "The app needs gallery permission to choose verification evidence."
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
    if (!user || !actorKey) {
      Alert.alert("Login Required", "Please log in to send an update.");
      return false;
    }

    if (!incident) {
      Alert.alert("Invalid Incident", "Incident data was not found.");
      return false;
    }

    if (!userLocation) {
      Alert.alert(
        "Location Unavailable",
        "The app has not received your realtime location yet."
      );
      return false;
    }

    const distance = getDistanceInMeters(userLocation, {
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

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (
        !validateForm() ||
        !incident ||
        !userLocation ||
        !imageUri ||
        !actorKey
      ) {
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
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
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

  return (
    <IncidentModalShell
      visible={visible}
      title="Verification / Condition Update"
      subtitle="Send a fresh evidence photo and condition notes from the location."
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
            title="Send to Timeline"
            variant="primary"
            size="lg"
            loading={submitting}
            disabled={!canSubmit}
            onPress={handleSubmit}
            leftIcon={
              <Ionicons name="send" size={18} color={colors.textInverse} />
            }
            style={styles.footerSubmitButton}
          />
        </>
      }
    >
      {incident ? <IncidentPreviewCard incident={incident} /> : null}

      <View style={styles.section}>
        <SectionHeader
          title="Contribution Type"
          subtitle="Choose whether you are confirming, disputing, or updating the condition."
        />

        <View style={styles.optionList}>
          {VERIFICATION_OPTIONS.map((item) => (
            <SelectableOptionCard
              key={item.value}
              label={item.label}
              description={item.description}
              icon={item.icon}
              color={item.color}
              active={verificationType === item.value}
              disabled={submitting}
              onPress={() => setVerificationType(item.value)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Latest Condition"
          subtitle="Choose the condition that best matches the location."
        />

        <View style={styles.optionList}>
          {conditionOptions.map((item) => (
            <SelectableOptionCard
              key={item.value}
              label={item.label}
              description={item.description}
              icon={item.icon}
              color={item.color}
              active={conditionStatus === item.value}
              disabled={submitting}
              onPress={() => setConditionStatus(item.value)}
            />
          ))}
        </View>
      </View>

      <EvidencePicker
        title="Latest Evidence Photo"
        subtitle="A photo is required to prove the latest incident condition."
        emptyTitle="No photo yet"
        emptyMessage="A photo is required to prove the latest incident condition."
        imageUri={imageUri}
        disabled={submitting}
        onTakePhoto={handleTakePhoto}
        onPickFromGallery={handlePickFromGallery}
        onRemoveImage={() => setImageUri(null)}
      />

      <View style={styles.section}>
        <SectionHeader
          title="Condition Notes"
          subtitle="Write short and clear notes based on the on-site condition."
        />

        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Example: The incident is still active, but one lane can be used."
          placeholderTextColor={colors.textSoft}
          style={styles.input}
          multiline
          textAlignVertical="top"
          editable={!submitting}
        />

        <StatusBadge
          label={`${Math.max(note.trim().length, 0)}/8 minimum characters`}
          variant={note.trim().length >= 8 ? "success" : "neutral"}
          size="sm"
        />
      </View>
    </IncidentModalShell>
  );
}

function SelectableOptionCard({
  label,
  description,
  icon,
  color,
  active,
  disabled,
  onPress,
}: {
  label: string;
  description: string;
  icon: AppIconName;
  color: string;
  active: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <AppCard
      onPress={disabled ? undefined : onPress}
      style={[
        styles.optionCard,
        active && {
          borderColor: color,
          backgroundColor: withAlpha(color, "12"),
        },
      ]}
    >
      <IconBadge
        variant="neutral"
        size="md"
        rounded={false}
        style={{
          backgroundColor: active ? color : colors.surfaceMuted,
        }}
      >
        <Ionicons
          name={icon}
          size={22}
          color={active ? colors.textInverse : color}
        />
      </IconBadge>

      <View style={styles.optionContent}>
        <Text
          style={[
            styles.optionTitle,
            active && {
              color,
            },
          ]}
        >
          {label}
        </Text>

        <Text style={styles.optionDescription}>{description}</Text>
      </View>
    </AppCard>
  );
}

function withAlpha(hexColor: string, alpha: string) {
  if (!hexColor.startsWith("#") || hexColor.length !== 7) {
    return hexColor;
  }

  return `${hexColor}${alpha}`;
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing["2xl"],
    gap: spacing.md,
  },
  optionList: {
    gap: spacing.sm,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  optionDescription: {
    marginTop: 3,
    ...typography.caption,
    color: colors.textMuted,
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
