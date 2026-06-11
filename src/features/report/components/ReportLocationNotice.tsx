import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

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
          <Text style={styles.description}>
            {t("report.location.description")}
          </Text>
        </View>
      </View>

      {/* Mini Map Preview when location is available */}
      {incidentLocation && (
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.miniMap}
            liteMode={true}
            initialRegion={{
              latitude: incidentLocation.latitude,
              longitude: incidentLocation.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            region={{
              latitude: incidentLocation.latitude,
              longitude: incidentLocation.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={{
                latitude: incidentLocation.latitude,
                longitude: incidentLocation.longitude,
              }}
              pinColor={colors.primary}
            />
          </MapView>
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
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadow.card,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.cardTitle,
    color: colors.text,
    fontWeight: "700",
  },
  description: {
    marginTop: 2,
    ...typography.caption,
    color: colors.textMuted,
  },
  mapContainer: {
    height: 120,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  miniMap: {
    ...StyleSheet.absoluteFillObject,
  },
  statusBox: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
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
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});
