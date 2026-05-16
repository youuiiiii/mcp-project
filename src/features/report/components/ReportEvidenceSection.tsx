import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import SectionHeader from "../../../components/ui/SectionHeader";
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
  const canAddMore = photoUris.length < MAX_REPORT_PHOTOS && !disabled;

  return (
    <View style={styles.section}>
      <SectionHeader
        title="4. Evidence"
        subtitle="Tambahkan 1–4 foto kejadian. Foto pertama akan menjadi cover laporan."
      />

      <View style={styles.photoRow}>
        <AppCard
          onPress={canAddMore ? onTakePhoto : undefined}
          padding="lg"
          variant="outlined"
          style={[styles.photoButton, !canAddMore && styles.disabledCard]}
        >
          <IconBadge variant="danger" size="md" rounded={false}>
            <Ionicons name="camera" size={22} color={colors.danger} />
          </IconBadge>

          <Text style={styles.photoButtonText}>Camera</Text>
        </AppCard>

        <AppCard
          onPress={canAddMore ? onPickFromGallery : undefined}
          padding="lg"
          variant="outlined"
          style={[styles.photoButton, !canAddMore && styles.disabledCard]}
        >
          <IconBadge variant="info" size="md" rounded={false}>
            <Ionicons name="image" size={22} color={colors.info} />
          </IconBadge>

          <Text style={styles.photoButtonText}>Gallery</Text>
        </AppCard>
      </View>

      <Text style={styles.counterText}>
        {photoUris.length}/{MAX_REPORT_PHOTOS} foto dipilih
      </Text>

      {photoUris.length > 0 ? (
        <View style={styles.grid}>
          {photoUris.map((photoUri, index) => (
            <View key={photoUri} style={styles.photoTile}>
              <Image source={{ uri: photoUri }} style={styles.photoImage} />

              {index === 0 ? (
                <View style={styles.coverBadge}>
                  <Text style={styles.coverBadgeText}>Cover</Text>
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
            <Text style={styles.emptyTitle}>Belum ada foto</Text>
            <Text style={styles.emptyText}>
              Minimal 1 foto wajib agar laporan bisa tampil sebagai pin publik.
            </Text>
          </View>
        </AppCard>
      )}
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
    gap: spacing.sm,
  },
  photoTile: {
    width: "48.5%",
    aspectRatio: 1,
    borderRadius: radius.xl,
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
    left: spacing.sm,
    top: spacing.sm,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: "rgba(15, 23, 42, 0.76)",
  },
  coverBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: colors.textInverse,
  },
  removeButton: {
    position: "absolute",
    right: spacing.sm,
    top: spacing.sm,
    width: 28,
    height: 28,
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
    gap: spacing.md,
  },
  emptyTextGroup: {
    flex: 1,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  emptyText: {
    marginTop: 2,
    ...typography.caption,
    color: colors.textMuted,
  },
});