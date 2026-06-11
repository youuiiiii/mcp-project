import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "../../../components/ui/AppButton";
import AppCard from "../../../components/ui/AppCard";
import { useI18n } from "../../../i18n";
import { colors } from "../../../theme/colors";
import { radius, shadow, spacing } from "../../../theme/layout";
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
  const hasLocation = !!incidentLocation;
  
  const statusText = incidentLocation
    ? hasManualPin
      ? t("report.location.manualPin")
      : t("report.location.currentPin")
    : t("report.location.notSet");

  // Determine GPS accuracy level & color
  let accuracyColor: string = colors.textSoft;
  let accuracyLabel = "";
  if (incidentLocation && incidentLocation.accuracyMeters !== null && incidentLocation.accuracyMeters !== undefined) {
    const acc = incidentLocation.accuracyMeters;
    if (acc <= 10) {
      accuracyColor = colors.success;
      accuracyLabel = "Akurasi Tinggi";
    } else if (acc <= 35) {
      accuracyColor = colors.warning;
      accuracyLabel = "Akurasi Sedang";
    } else {
      accuracyColor = colors.danger;
      accuracyLabel = "Akurasi Rendah";
    }
  }

  return (
    <AppCard variant="muted" style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.iconContainer, { backgroundColor: hasLocation ? colors.primarySoft : colors.surfaceContainerHigh }]}>
          <Ionicons 
            name={hasLocation ? "location" : "location-outline"} 
            size={22} 
            color={hasLocation ? colors.primaryDark : colors.textSoft} 
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{t("report.location.title")}</Text>
          <Text style={styles.description} numberOfLines={1}>
            {t("report.location.description")}
          </Text>
        </View>
      </View>

      {incidentLocation && (
        <View style={styles.coordinatePreview}>
          <Ionicons name="navigate" size={17} color={colors.primary} />
          <Text style={styles.coordinateText} numberOfLines={1}>
            {incidentLocation.latitude.toFixed(5)},{" "}
            {incidentLocation.longitude.toFixed(5)}
          </Text>
        </View>
      )}

      <View style={styles.statusBox}>
        <View style={styles.statusTextGroup}>
          <Text style={styles.statusLabel}>{statusText}</Text>

          {incidentLocation?.accuracyMeters !== null &&
          incidentLocation?.accuracyMeters !== undefined ? (
            <View style={styles.accuracyRow}>
              <View style={[styles.accuracyDot, { backgroundColor: accuracyColor }]} />
              <Text style={styles.accuracyText}>
                {t("report.location.accuracy", {
                  accuracy: Math.round(incidentLocation.accuracyMeters),
                })} ({accuracyLabel})
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.actions}>
        <AppButton
          title={t("report.location.useCurrent")}
          variant="secondary"
          size="md"
          loading={loadingLocation}
          disabled={disabled || loadingLocation}
          onPress={onUseCurrentLocation}
          style={styles.actionButton}
          leftIcon={
            <Ionicons name="locate" size={16} color={colors.primary} />
          }
        />

        <AppButton
          title={t("report.location.adjustPin")}
          variant="primary"
          size="md"
          disabled={disabled || !incidentLocation}
          onPress={onAdjustPin}
          style={styles.actionButton}
          leftIcon={
            <Ionicons name="map" size={16} color={colors.textInverse} />
          }
        />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow.card,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    color: colors.text,
    fontWeight: "700",
  },
  description: {
    marginTop: 2,
    ...typography.caption,
    color: colors.textMuted,
  },
  coordinatePreview: {
    minHeight: 38,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.primarySoft,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  coordinateText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  statusBox: {
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  statusTextGroup: {
    gap: 4,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
  },
  accuracyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  accuracyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  accuracyText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
