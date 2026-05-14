import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

import AppButton from "../../../components/ui/AppButton";
import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import SectionHeader from "../../../components/ui/SectionHeader";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";

type ReportEvidenceSectionProps = {
  photoUri: string | null;
  disabled?: boolean;
  onTakePhoto: () => void;
  onPickFromGallery: () => void;
  onRemovePhoto: () => void;
};

export default function ReportEvidenceSection({
  photoUri,
  disabled = false,
  onTakePhoto,
  onPickFromGallery,
  onRemovePhoto,
}: ReportEvidenceSectionProps) {
  return (
    <View style={styles.section}>
      <SectionHeader
        title="4. Evidence"
        subtitle="Foto wajib untuk membantu warga lain memahami kondisi."
      />

      <View style={styles.photoRow}>
        <AppCard
          onPress={disabled ? undefined : onTakePhoto}
          padding="lg"
          variant="outlined"
          style={styles.photoButton}
        >
          <IconBadge variant="danger" size="md" rounded={false}>
            <Ionicons name="camera" size={22} color={colors.danger} />
          </IconBadge>

          <Text style={styles.photoButtonText}>Camera</Text>
        </AppCard>

        <AppCard
          onPress={disabled ? undefined : onPickFromGallery}
          padding="lg"
          variant="outlined"
          style={styles.photoButton}
        >
          <IconBadge variant="info" size="md" rounded={false}>
            <Ionicons name="image" size={22} color={colors.info} />
          </IconBadge>

          <Text style={styles.photoButtonText}>Gallery</Text>
        </AppCard>
      </View>

      {photoUri ? (
        <AppCard padding="none" style={styles.previewCard}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />

          <View style={styles.previewFooter}>
            <View style={styles.previewInfo}>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={colors.success}
              />

              <Text style={styles.previewText}>Foto bukti sudah dipilih</Text>
            </View>

            <AppButton
              title="Remove"
              variant="ghost"
              size="sm"
              disabled={disabled}
              onPress={onRemovePhoto}
              textStyle={styles.removePhotoText}
            />
          </View>
        </AppCard>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  photoRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  photoButton: {
    flex: 1,
    alignItems: "center",
    borderStyle: "dashed",
    borderColor: colors.border,
    gap: spacing.sm,
  },
  photoButtonText: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.text,
  },
  previewCard: {
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
    backgroundColor: colors.border,
  },
  previewFooter: {
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  previewInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  previewText: {
    flex: 1,
    ...typography.caption,
    color: colors.textMuted,
  },
  removePhotoText: {
    color: colors.danger,
  },
});