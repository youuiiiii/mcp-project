import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import AppButton from "../../../components/ui/AppButton";
import { useI18n } from "../../../i18n";
import { colors } from "../../../theme/colors";
import { radius, shadow, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";
import type { Coordinate, ReportLocationDraft } from "../../../types/incident";

type IncidentLocationPickerModalProps = {
  visible: boolean;
  incidentLocation: ReportLocationDraft | null;
  onClose: () => void;
  onConfirm: (coordinate: Coordinate) => void;
};

export default function IncidentLocationPickerModal({
  visible,
  incidentLocation,
  onClose,
  onConfirm,
}: IncidentLocationPickerModalProps) {
  const { t } = useI18n();

  const handleConfirm = () => {
    if (!incidentLocation) {
      return;
    }

    onConfirm({
      latitude: incidentLocation.latitude,
      longitude: incidentLocation.longitude,
    });
    onClose();
  };

  if (!incidentLocation) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.panel}>
          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <Ionicons name="map-outline" size={24} color={colors.primary} />
            </View>

            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color={colors.text} />
            </Pressable>
          </View>

          <Text style={styles.title}>{t("report.location.picker.title")}</Text>
          <Text style={styles.message}>
            Map pin editing is available on mobile. On web, you can confirm the
            selected coordinates.
          </Text>

          <View style={styles.coordinateBox}>
            <Text style={styles.coordinateLabel}>{t("report.location.title")}</Text>
            <Text style={styles.coordinateText}>
              {incidentLocation.latitude.toFixed(6)},{" "}
              {incidentLocation.longitude.toFixed(6)}
            </Text>
          </View>

          <View style={styles.actions}>
            <AppButton
              title={t("common.cancel")}
              variant="secondary"
              size="md"
              onPress={onClose}
              style={styles.actionButton}
            />
            <AppButton
              title={t("report.location.picker.save")}
              variant="danger"
              size="md"
              onPress={handleConfirm}
              style={styles.actionButton}
              leftIcon={
                <Ionicons name="checkmark" size={17} color={colors.textInverse} />
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15,23,42,0.42)",
    padding: spacing.xl,
  },
  panel: {
    width: "100%",
    maxWidth: 430,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadow.floating,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.text,
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
  },
  coordinateBox: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
    gap: spacing.xs,
  },
  coordinateLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  coordinateText: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});
