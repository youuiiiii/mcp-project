import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "../../components/ui/AppCard";
import AppScreen from "../../components/ui/AppScreen";
import LoadingState from "../../components/ui/LoadingState";
import SectionHeader from "../../components/ui/SectionHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import {
  fetchRecentBmkgEarthquakes,
  type BmkgEarthquake,
} from "../../services/bmkgService";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";

export default function EarthquakeDetailScreen() {
  const [earthquakes, setEarthquakes] = useState<BmkgEarthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const latest = earthquakes[0] ?? null;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        const items = await fetchRecentBmkgEarthquakes();
        setEarthquakes(items);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Gagal memuat data gempa BMKG."
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <SectionHeader
        title="BMKG Earthquake"
        subtitle="Data gempa terkini dari BMKG."
      />

      {loading ? (
        <AppCard style={styles.loadingCard}>
          <LoadingState message="Memuat data BMKG..." />
        </AppCard>
      ) : null}

      {!loading && errorMessage ? (
        <AppCard variant="muted" style={styles.errorCard}>
          <Ionicons name="warning" size={22} color={colors.danger} />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </AppCard>
      ) : null}

      {!loading && latest ? (
        <AppCard style={styles.mainCard}>
          <View style={styles.topRow}>
            <View style={styles.titleGroup}>
              <StatusBadge
                label="Latest Earthquake"
                variant="warning"
                size="sm"
              />

              <Text style={styles.location}>
                {latest.Wilayah ?? "Lokasi tidak diketahui"}
              </Text>
            </View>

            <View style={styles.magnitudeBox}>
              <Text style={styles.magnitudeLabel}>M</Text>
              <Text style={styles.magnitudeValue}>
                {latest.Magnitude ?? "-"}
              </Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <InfoItem label="Tanggal" value={latest.Tanggal ?? "-"} />
            <InfoItem label="Jam" value={latest.Jam ?? "-"} />
            <InfoItem label="Kedalaman" value={latest.Kedalaman ?? "-"} />
            <InfoItem label="Koordinat" value={latest.Coordinates ?? "-"} />
          </View>

          <AppCard variant="muted" style={styles.potentialCard}>
            <Ionicons name="alert-circle" size={20} color={colors.danger} />
            <View style={styles.potentialText}>
              <Text style={styles.potentialTitle}>Potensi</Text>
              <Text style={styles.potentialDescription}>
                {latest.Potensi ?? "Informasi potensi tidak tersedia."}
              </Text>
            </View>
          </AppCard>

          {latest.Dirasakan ? (
            <AppCard variant="muted" style={styles.potentialCard}>
              <Ionicons name="people" size={20} color={colors.info} />
              <View style={styles.potentialText}>
                <Text style={styles.potentialTitle}>Dirasakan</Text>
                <Text style={styles.potentialDescription}>
                  {latest.Dirasakan}
                </Text>
              </View>
            </AppCard>
          ) : null}
        </AppCard>
      ) : null}

      {!loading && earthquakes.length > 1 ? (
        <View style={styles.section}>
          <SectionHeader
            title="Gempa Lainnya"
            subtitle="Daftar gempa terbaru dari BMKG."
          />

          {earthquakes.slice(1, 6).map((item, index) => (
            <AppCard
              key={`${item.DateTime ?? index}-${item.Magnitude ?? ""}`}
              style={styles.listCard}
            >
              <Text style={styles.listMagnitude}>M {item.Magnitude ?? "-"}</Text>

              <View style={styles.listContent}>
                <Text style={styles.listTitle} numberOfLines={2}>
                  {item.Wilayah ?? "Lokasi tidak diketahui"}
                </Text>

                <Text style={styles.listMeta}>
                  {item.Jam ?? "-"} - {item.Kedalaman ?? "-"}
                </Text>
              </View>
            </AppCard>
          ))}
        </View>
      ) : null}
    </AppScreen>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing["2xl"],
  },
  loadingCard: {
    minHeight: 140,
    justifyContent: "center",
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
  },
  errorText: {
    flex: 1,
    ...typography.body,
    color: colors.primaryDark,
  },
  mainCard: {
    gap: spacing.lg,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  titleGroup: {
    flex: 1,
  },
  location: {
    marginTop: spacing.md,
    fontSize: 22,
    lineHeight: 29,
    fontWeight: "900",
    color: colors.text,
  },
  magnitudeBox: {
    minWidth: 78,
    height: 78,
    borderRadius: radius["2xl"],
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  magnitudeLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.textInverse,
    opacity: 0.85,
  },
  magnitudeValue: {
    marginTop: 2,
    fontSize: 27,
    fontWeight: "900",
    color: colors.textInverse,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  infoItem: {
    width: "48%",
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
  },
  infoValue: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
    color: colors.text,
  },
  potentialCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  potentialText: {
    flex: 1,
  },
  potentialTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.text,
  },
  potentialDescription: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
    color: colors.textMuted,
  },
  section: {
    gap: spacing.md,
  },
  listCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  listMagnitude: {
    minWidth: 58,
    fontSize: 15,
    fontWeight: "900",
    color: colors.danger,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "900",
    color: colors.text,
  },
  listMeta: {
    marginTop: 3,
    ...typography.caption,
    color: colors.textMuted,
  },
});