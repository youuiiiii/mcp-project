import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

import AppButton from "../../../components/ui/AppButton";
import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import SectionHeader from "../../../components/ui/SectionHeader";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";

type EvidencePickerProps = {
  title: string;
  subtitle: string;
  emptyTitle: string;
  emptyMessage: string;
  imageUri: string | null;
  disabled?: boolean;
  onTakePhoto: () => void;
  onPickFromGallery: () => void;
  onRemoveImage: () => void;
};

export default function EvidencePicker({
  title,
  subtitle,
  emptyTitle,
  emptyMessage,
  imageUri,
  disabled = false,
  onTakePhoto,
  onPickFromGallery,
  onRemoveImage,
}: EvidencePickerProps) {
  return (
    <View style={styles.section}>
      <SectionHeader title={title} subtitle={subtitle} />

      {imageUri ? (
        <AppCard padding="none" style={styles.imageCard}>
          <Image source={{ uri: imageUri }} style={styles.image} />

          <View style={styles.imageFooter}>
            <View style={styles.imageInfo}>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={colors.success}
              />
              <Text style={styles.imageText}>Evidence photo selected</Text>
            </View>

            <AppButton
              title="Remove"
              variant="ghost"
              size="sm"
              disabled={disabled}
              onPress={onRemoveImage}
              textStyle={styles.removeText}
            />
          </View>
        </AppCard>
      ) : (
        <AppCard variant="outlined" style={styles.emptyCard}>
          <IconBadge variant="neutral" size="lg" rounded={false}>
            <Ionicons name="camera" size={28} color={colors.textMuted} />
          </IconBadge>

          <Text style={styles.emptyTitle}>{emptyTitle}</Text>
          <Text style={styles.emptyMessage}>{emptyMessage}</Text>
        </AppCard>
      )}

      <View style={styles.actions}>
        <AppButton
          title="Take Photo"
          variant="primary"
          size="md"
          disabled={disabled}
          onPress={onTakePhoto}
          leftIcon={
            <Ionicons name="camera" size={18} color={colors.textInverse} />
          }
          style={styles.actionButton}
        />

        <AppButton
          title="Choose Gallery"
          variant="secondary"
          size="md"
          disabled={disabled}
          onPress={onPickFromGallery}
          leftIcon={<Ionicons name="image" size={18} color={colors.text} />}
          style={styles.actionButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  imageCard: {
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 210,
    resizeMode: "cover",
    backgroundColor: colors.border,
  },
  imageFooter: {
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  imageInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  imageText: {
    flex: 1,
    ...typography.caption,
    color: colors.textMuted,
  },
  removeText: {
    color: colors.danger,
  },
  emptyCard: {
    alignItems: "center",
    borderStyle: "dashed",
    borderRadius: radius["2xl"],
    paddingVertical: spacing["2xl"],
  },
  emptyTitle: {
    marginTop: spacing.md,
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
  },
  emptyMessage: {
    marginTop: spacing.sm,
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
