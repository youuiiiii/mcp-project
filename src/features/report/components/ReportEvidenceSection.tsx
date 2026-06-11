import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import SectionHeader from "../../../components/ui/SectionHeader";
import { useI18n } from "../../../i18n";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";

type ReportEvidenceSectionProps = {
  photoUris: string[];
  disabled?: boolean;
  onTakePhoto: () => void;
  onPickFromGallery: () => void;
  onRemovePhoto: (photoUri: string) => void;
};

const MAX_REPORT_PHOTOS = 4;

export default function ReportEvidenceSection({
  photoUris,
  disabled = false,
  onTakePhoto,
  onPickFromGallery,
  onRemovePhoto,
}: ReportEvidenceSectionProps) {
  const { t } = useI18n();
  const canAddMore = photoUris.length < MAX_REPORT_PHOTOS && !disabled;

  return (
    <View style={styles.section}>
      <SectionHeader
        title={t("report.evidence.title")}
      />

      <View style={styles.photoRow}>
        <AppCard
          onPress={canAddMore ? onTakePhoto : undefined}
          padding="sm"
          variant="outlined"
          style={[styles.photoButton, !canAddMore && styles.disabledCard]}
        >
          <IconBadge variant="danger" size="md" rounded={false}>
            <Ionicons name="camera" size={18} color={colors.danger} />
          </IconBadge>

          <Text style={styles.photoButtonText}>{t("common.camera")}</Text>
        </AppCard>

        <AppCard
          onPress={canAddMore ? onPickFromGallery : undefined}
          padding="sm"
          variant="outlined"
          style={[styles.photoButton, !canAddMore && styles.disabledCard]}
        >
          <IconBadge variant="info" size="md" rounded={false}>
            <Ionicons name="image" size={18} color={colors.info} />
          </IconBadge>

          <Text style={styles.photoButtonText}>{t("common.gallery")}</Text>
        </AppCard>
      </View>

      <Text style={styles.counterText}>
        {t("report.evidence.counter", {
          count: photoUris.length,
          max: MAX_REPORT_PHOTOS,
        })}
      </Text>

      {photoUris.length > 0 ? (
        <View style={styles.grid}>
          {photoUris.map((photoUri, index) => (
            <View key={photoUri} style={styles.photoTile}>
              <Image source={{ uri: photoUri }} style={styles.photoImage} />

              {index === 0 ? (
                <View style={styles.coverBadge}>
                  <Text style={styles.coverBadgeText}>
                    {t("report.evidence.cover")}
                  </Text>
                </View>
              ) : null}

              <Pressable
                disabled={disabled}
                onPress={() => onRemovePhoto(photoUri)}
                style={({ pressed }) => [
                  styles.removeButton,
                  pressed && styles.removePressed,
                  disabled && styles.disabledRemove,
                ]}
              >
                <Ionicons name="close" size={16} color={colors.textInverse} />
              </Pressable>
            </View>
          ))}
        </View>
      ) : (
        <AppCard variant="muted" style={styles.emptyCard}>
          <Ionicons name="images-outline" size={22} color={colors.textMuted} />

          <View style={styles.emptyTextGroup}>
            <Text style={styles.emptyTitle}>{t("report.evidence.emptyTitle")}</Text>
            <Text style={styles.emptyText}>
              {t("report.evidence.emptyText")}
            </Text>
          </View>
        </AppCard>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  photoRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  photoButton: {
    flex: 1,
    alignItems: "center",
    borderStyle: "dashed",
    borderColor: colors.border,
    gap: 6,
    minHeight: 68,
  },
  disabledCard: {
    opacity: 0.55,
  },
  photoButtonText: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.text,
  },
  counterText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  photoTile: {
    width: "23.5%",
    aspectRatio: 1,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.border,
  },
  photoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  coverBadge: {
    position: "absolute",
    left: 4,
    top: 4,
    borderRadius: radius.full,
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: "rgba(15, 23, 42, 0.76)",
  },
  coverBadgeText: {
    fontSize: 8,
    fontWeight: "900",
    color: colors.textInverse,
  },
  removeButton: {
    position: "absolute",
    right: 4,
    top: 4,
    width: 22,
    height: 22,
    borderRadius: radius.full,
    backgroundColor: "rgba(15, 23, 42, 0.72)",
    alignItems: "center",
    justifyContent: "center",
  },
  removePressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  disabledRemove: {
    opacity: 0.5,
  },
  emptyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  emptyTextGroup: {
    flex: 1,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.text,
  },
  emptyText: {
    marginTop: 2,
    ...typography.caption,
    color: colors.textMuted,
  },
});
