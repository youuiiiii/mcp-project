import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  checkAndNotifyNearbyDisaster,
  requestNotificationPermission,
} from "../../services/notifications";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";
import AppButton from "../ui/AppButton";
import AppCard from "../ui/AppCard";
import IconBadge from "../ui/IconBadge";
import LoadingState from "../ui/LoadingState";
import SectionHeader from "../ui/SectionHeader";
import StatusBadge, { StatusBadgeVariant } from "../ui/StatusBadge";

type BmkgEarthquake = {
  Tanggal?: string;
  Jam?: string;
  DateTime?: string;
  Coordinates?: string;
  Lintang?: string;
  Bujur?: string;
  Magnitude?: string;
  Kedalaman?: string;
  Wilayah?: string;
  Potensi?: string;
  Dirasakan?: string;
};

export default function BmkgEarthquakeSection() {
  const router = useRouter();

  const [earthquakes, setEarthquakes] = useState<BmkgEarthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const latestEarthquakes = useMemo(() => {
    return earthquakes.slice(0, 3);
  }, [earthquakes]);

  const mainEarthquake = latestEarthquakes[0];

  useEffect(() => {
    void requestNotificationPermission();
    void fetchBMKGData();
  }, []);

  const fetchBMKGData = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const response = await fetch(
        "https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json"
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data BMKG.");
      }

      const data = await response.json();

      const gempaList: BmkgEarthquake[] = Array.isArray(
        data?.Infogempa?.gempa
      )
        ? data.Infogempa.gempa
        : [];

      setEarthquakes(gempaList);
      void checkAndNotifyNearbyDisaster(gempaList);
    } catch (error) {
      console.error("BMKG error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal memuat data gempa BMKG."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEarthquake = (item: BmkgEarthquake) => {
    router.push({
      pathname: "/(tabs)/detail",
      params: {
        magnitude: item.Magnitude ?? "-",
        wilayah: item.Wilayah ?? "-",
        jam: item.Jam ?? "-",
        tanggal: item.Tanggal ?? "-",
        kedalaman: item.Kedalaman ?? "-",
        lintang: item.Lintang ?? "-",
        bujur: item.Bujur ?? "-",
        potensi: item.Potensi ?? "-",
      },
    });
  };

  return (
    <View style={styles.wrapper}>
      <SectionHeader
        title="BMKG Earthquake"
        subtitle="Official earthquake update"
        style={styles.sectionHeader}
        right={
          <AppButton
            title="Refresh"
            variant="secondary"
            size="sm"
            loading={loading}
            disabled={loading}
            onPress={fetchBMKGData}
            leftIcon={
              <Ionicons
                name="refresh"
                size={15}
                color={colors.text}
              />
            }
          />
        }
      />

      {loading ? (
        <AppCard style={styles.loadingCard}>
          <LoadingState message="Memuat data resmi BMKG..." />
        </AppCard>
      ) : errorMessage ? (
        <AppCard variant="muted" style={styles.errorCard}>
          <IconBadge variant="danger" size="md" rounded={false}>
            <Ionicons name="warning" size={22} color={colors.danger} />
          </IconBadge>

          <View style={styles.errorContent}>
            <Text style={styles.errorTitle}>BMKG unavailable</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        </AppCard>
      ) : !mainEarthquake ? (
        <AppCard style={styles.emptyCard}>
          <IconBadge variant="info" size="lg" rounded={false}>
            <Ionicons name="earth" size={30} color={colors.info} />
          </IconBadge>

          <Text style={styles.emptyTitle}>Belum ada update gempa</Text>
          <Text style={styles.emptyText}>
            Data gempa resmi akan tampil di sini saat tersedia.
          </Text>
        </AppCard>
      ) : (
        <>
          <FeaturedEarthquakeCard
            earthquake={mainEarthquake}
            onPress={() => handleOpenEarthquake(mainEarthquake)}
          />

          {latestEarthquakes.length > 1 ? (
            <View style={styles.miniList}>
              {latestEarthquakes.slice(1).map((item, index) => (
                <MiniEarthquakeCard
                  key={`${item.DateTime ?? index}-${item.Magnitude ?? ""}`}
                  earthquake={item}
                  onPress={() => handleOpenEarthquake(item)}
                />
              ))}
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

function FeaturedEarthquakeCard({
  earthquake,
  onPress,
}: {
  earthquake: BmkgEarthquake;
  onPress: () => void;
}) {
  const magnitudeColor = getMagnitudeColor(earthquake.Magnitude);

  return (
    <AppCard onPress={onPress} style={styles.featuredCard}>
      <View style={styles.featuredTop}>
        <View style={styles.featuredInfo}>
          <StatusBadge
            label="Latest Earthquake"
            variant={getMagnitudeVariant(earthquake.Magnitude)}
            size="sm"
            style={styles.featuredBadge}
          />

          <Text style={styles.featuredLocation}>
            {earthquake.Wilayah ?? "Lokasi tidak diketahui"}
          </Text>
        </View>

        <View
          style={[
            styles.magnitudeBadge,
            {
              backgroundColor: magnitudeColor,
            },
          ]}
        >
          <Text style={styles.magnitudeLabel}>M</Text>
          <Text style={styles.magnitudeValue}>
            {earthquake.Magnitude ?? "-"}
          </Text>
        </View>
      </View>

      <View style={styles.featuredMetaRow}>
        <MetaItem
          label="Status"
          value={getMagnitudeLabel(earthquake.Magnitude)}
          icon="pulse"
        />

        <MetaItem
          label="Depth"
          value={earthquake.Kedalaman ?? "-"}
          icon="navigate"
        />
      </View>

      <AppCard variant="muted" padding="sm" style={styles.timeCard}>
        <Ionicons name="time" size={17} color={colors.primaryDark} />
        <Text style={styles.timeText}>
          {earthquake.Jam ?? "-"}, {earthquake.Tanggal ?? "-"}
        </Text>
      </AppCard>

      <View style={styles.openDetailRow}>
        <Text style={styles.openDetailText}>Open earthquake detail</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.danger} />
      </View>
    </AppCard>
  );
}

function MiniEarthquakeCard({
  earthquake,
  onPress,
}: {
  earthquake: BmkgEarthquake;
  onPress: () => void;
}) {
  const magnitudeColor = getMagnitudeColor(earthquake.Magnitude);

  return (
    <AppCard onPress={onPress} style={styles.miniCard}>
      <View
        style={[
          styles.miniMagnitude,
          {
            backgroundColor: withAlpha(magnitudeColor, "18"),
          },
        ]}
      >
        <Text
          style={[
            styles.miniMagnitudeText,
            {
              color: magnitudeColor,
            },
          ]}
        >
          M {earthquake.Magnitude ?? "-"}
        </Text>
      </View>

      <View style={styles.miniInfo}>
        <Text style={styles.miniTitle} numberOfLines={2}>
          {earthquake.Wilayah ?? "Lokasi tidak diketahui"}
        </Text>

        <Text style={styles.miniSubtitle}>
          {earthquake.Jam ?? "-"} · {earthquake.Kedalaman ?? "-"}
        </Text>
      </View>
    </AppCard>
  );
}

function MetaItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <AppCard variant="muted" padding="sm" style={styles.metaItem}>
      <Ionicons name={icon} size={18} color={colors.textMuted} />
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue} numberOfLines={1}>
        {value}
      </Text>
    </AppCard>
  );
}

function getMagnitudeNumber(value?: string) {
  const magnitude = Number(value);
  return Number.isNaN(magnitude) ? 0 : magnitude;
}

function getMagnitudeColor(value?: string) {
  const magnitude = getMagnitudeNumber(value);

  if (magnitude >= 7) return "#7F1D1D";
  if (magnitude >= 5) return colors.danger;
  if (magnitude >= 3) return colors.warning;

  return colors.success;
}

function getMagnitudeLabel(value?: string) {
  const magnitude = getMagnitudeNumber(value);

  if (magnitude >= 7) return "Major";
  if (magnitude >= 5) return "Strong";
  if (magnitude >= 3) return "Moderate";

  return "Light";
}

function getMagnitudeVariant(value?: string): StatusBadgeVariant {
  const magnitude = getMagnitudeNumber(value);

  if (magnitude >= 5) return "danger";
  if (magnitude >= 3) return "warning";

  return "success";
}

function withAlpha(hexColor: string, alpha: string) {
  if (!hexColor.startsWith("#") || hexColor.length !== 7) {
    return hexColor;
  }

  return `${hexColor}${alpha}`;
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.md,
  },
  sectionHeader: {
    marginBottom: 0,
  },
  loadingCard: {
    minHeight: 110,
    justifyContent: "center",
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#991B1B",
    marginBottom: 5,
  },
  errorText: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: spacing["2xl"],
  },
  emptyTitle: {
    marginTop: spacing.md,
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
  },
  emptyText: {
    marginTop: spacing.sm,
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
  },
  featuredCard: {
    borderRadius: radius["3xl"],
  },
  featuredTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  featuredInfo: {
    flex: 1,
  },
  featuredBadge: {
    marginBottom: spacing.sm,
  },
  featuredLocation: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    lineHeight: 24,
  },
  magnitudeBadge: {
    minWidth: 74,
    height: 74,
    borderRadius: radius["2xl"],
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  magnitudeLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.textInverse,
    opacity: 0.82,
  },
  magnitudeValue: {
    fontSize: 25,
    fontWeight: "900",
    color: colors.textInverse,
    marginTop: 2,
  },
  featuredMetaRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metaItem: {
    flex: 1,
    gap: 4,
  },
  metaLabel: {
    ...typography.label,
    color: colors.textMuted,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  timeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    marginBottom: spacing.md,
  },
  timeText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  openDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  openDetailText: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.danger,
  },
  miniList: {
    gap: spacing.sm,
  },
  miniCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  miniMagnitude: {
    minWidth: 62,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 9,
    alignItems: "center",
  },
  miniMagnitudeText: {
    fontSize: 13,
    fontWeight: "900",
  },
  miniInfo: {
    flex: 1,
  },
  miniTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
    lineHeight: 19,
  },
  miniSubtitle: {
    marginTop: 4,
    ...typography.caption,
    color: colors.textMuted,
  },
});