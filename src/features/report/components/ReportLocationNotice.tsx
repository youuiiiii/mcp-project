import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "../../../components/ui/AppButton";
import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import { useI18n } from "../../../i18n";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";
import type { ReportLocationDraft } from "../../../types/incident";

type ReportLocationNoticeProps = {
  incidentLocation: ReportLocationDraft | null;
  disabled?: boolean;
  loadingLocation?: boolean;
  onUseCurrentLocation: () => void;
  onAdjustPin: () => void;
};

export default function ReportLocationNotice({
  incidentLocation,
  disabled = false,
  loadingLocation = false,
  onUseCurrentLocation,
  onAdjustPin,
}: ReportLocationNoticeProps) {
  const { t } = useI18n();
  const hasManualPin = incidentLocation?.source === "manual_pin";
  const statusText = incidentLocation
    ? hasManualPin
      ? t("report.location.manualPin")
      : t("report.location.currentPin")
    : t("report.location.notSet");

  return (
    <AppCard variant="muted" style={styles.card}>
      <View style={styles.headerRow}>
        <IconBadge variant="info" size="md" rounded={false}>
          <Ionicons name="location" size={22} color={colors.info} />
        </IconBadge>

        <View style={styles.content}>
          <Text style={styles.title}>{t("report.location.title")}</Text>

          <Text style={styles.description}>
            {t("report.location.description")}
          </Text>
        </View>
      </View>

      <View style={styles.statusBox}>
        <View style={styles.statusTextGroup}>
          <Text style={styles.statusLabel}>{statusText}</Text>

          {incidentLocation?.accuracyMeters !== null &&
          incidentLocation?.accuracyMeters !== undefined ? (
            <Text style={styles.accuracyText}>
              {t("report.location.accuracy", {
                accuracy: incidentLocation.accuracyMeters,
              })}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.actions}>
        <AppButton
          title={t("report.location.useCurrent")}
          variant="secondary"
          size="sm"
          loading={loadingLocation}
          disabled={disabled || loadingLocation}
          onPress={onUseCurrentLocation}
          style={styles.actionButton}
          leftIcon={
            <Ionicons name="locate" size={15} color={colors.text} />
          }
        />

        <AppButton
          title={t("report.location.adjustPin")}
          variant="primary"
          size="sm"
          disabled={disabled || !incidentLocation}
          onPress={onAdjustPin}
          style={styles.actionButton}
          leftIcon={
            <Ionicons name="map" size={15} color={colors.textInverse} />
          }
        />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    backgroundColor: colors.infoSoft,
    borderColor: "#BFDBFE",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.infoDark,
  },
  description: {
    marginTop: 4,
    ...typography.caption,
    color: "#1E3A8A",
  },
  statusBox: {
    borderRadius: radius.lg,
    backgroundColor: "rgba(255,255,255,0.62)",
    borderWidth: 1,
    borderColor: "rgba(37,99,235,0.18)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  statusTextGroup: {
    gap: 2,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.infoDark,
  },
  accuracyText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  actionButton: {
    flexGrow: 1,
  },
});
