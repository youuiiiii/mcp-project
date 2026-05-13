import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  checkAndNotifyNearbyDisaster,
  requestNotificationPermission,
} from "../../services/notifications";

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

  useEffect(() => {
    requestNotificationPermission();
    fetchBMKGData();
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

  const latestEarthquakes = useMemo(() => {
    return earthquakes.slice(0, 3);
  }, [earthquakes]);

  const mainEarthquake = latestEarthquakes[0];

  const getMagnitudeNumber = (value?: string) => {
    const magnitude = Number(value);
    return Number.isNaN(magnitude) ? 0 : magnitude;
  };

  const getMagnitudeColor = (value?: string) => {
    const magnitude = getMagnitudeNumber(value);

    if (magnitude >= 7) return "#7F1D1D";
    if (magnitude >= 5) return "#DC2626";
    if (magnitude >= 3) return "#F59E0B";

    return "#16A34A";
  };

  const getMagnitudeLabel = (value?: string) => {
    const magnitude = getMagnitudeNumber(value);

    if (magnitude >= 7) return "Major";
    if (magnitude >= 5) return "Strong";
    if (magnitude >= 3) return "Moderate";

    return "Light";
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
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionEyebrow}>OFFICIAL UPDATE</Text>
          <Text style={styles.sectionTitle}>BMKG Earthquake</Text>
        </View>

        <Pressable
          onPress={fetchBMKGData}
          disabled={loading}
          style={({ pressed }) => [
            styles.refreshButton,
            pressed && styles.pressed,
            loading && styles.disabled,
          ]}
        >
          <Text style={styles.refreshText}>Refresh</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator color="#DC2626" />
          <Text style={styles.loadingText}>Memuat data resmi BMKG...</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>BMKG unavailable</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : !mainEarthquake ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🌍</Text>
          <Text style={styles.emptyTitle}>Belum ada update gempa</Text>
          <Text style={styles.emptyText}>
            Data gempa resmi akan tampil di sini saat tersedia.
          </Text>
        </View>
      ) : (
        <>
          <Pressable
            onPress={() => handleOpenEarthquake(mainEarthquake)}
            style={({ pressed }) => [
              styles.featuredCard,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.featuredTop}>
              <View>
                <Text style={styles.featuredLabel}>Latest Earthquake</Text>
                <Text style={styles.featuredLocation}>
                  {mainEarthquake.Wilayah ?? "Lokasi tidak diketahui"}
                </Text>
              </View>

              <View
                style={[
                  styles.magnitudeBadge,
                  {
                    backgroundColor: getMagnitudeColor(
                      mainEarthquake.Magnitude
                    ),
                  },
                ]}
              >
                <Text style={styles.magnitudeLabel}>M</Text>
                <Text style={styles.magnitudeValue}>
                  {mainEarthquake.Magnitude ?? "-"}
                </Text>
              </View>
            </View>

            <View style={styles.featuredMetaRow}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Status</Text>
                <Text style={styles.metaValue}>
                  {getMagnitudeLabel(mainEarthquake.Magnitude)}
                </Text>
              </View>

              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Depth</Text>
                <Text style={styles.metaValue}>
                  {mainEarthquake.Kedalaman ?? "-"}
                </Text>
              </View>
            </View>

            <View style={styles.timeCard}>
              <Text style={styles.timeText}>
                {mainEarthquake.Jam ?? "-"}, {mainEarthquake.Tanggal ?? "-"}
              </Text>
            </View>

            <Text style={styles.openDetailText}>Open earthquake detail →</Text>
          </Pressable>

          {latestEarthquakes.length > 1 ? (
            <View style={styles.miniList}>
              {latestEarthquakes.slice(1).map((item, index) => (
                <Pressable
                  key={`${item.DateTime ?? index}-${item.Magnitude ?? ""}`}
                  onPress={() => handleOpenEarthquake(item)}
                  style={({ pressed }) => [
                    styles.miniCard,
                    pressed && styles.pressed,
                  ]}
                >
                  <View
                    style={[
                      styles.miniMagnitude,
                      {
                        backgroundColor: `${getMagnitudeColor(
                          item.Magnitude
                        )}18`,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.miniMagnitudeText,
                        {
                          color: getMagnitudeColor(item.Magnitude),
                        },
                      ]}
                    >
                      M {item.Magnitude ?? "-"}
                    </Text>
                  </View>

                  <View style={styles.miniInfo}>
                    <Text style={styles.miniTitle} numberOfLines={2}>
                      {item.Wilayah ?? "Lokasi tidak diketahui"}
                    </Text>

                    <Text style={styles.miniSubtitle}>
                      {item.Jam ?? "-"} · {item.Kedalaman ?? "-"}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 12,
  },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: "900",
    color: "#DC2626",
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
  },
  refreshButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  refreshText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#0F172A",
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  loadingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },
  errorCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#991B1B",
    marginBottom: 5,
  },
  errorText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#B91C1C",
    lineHeight: 20,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 34,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
  },
  emptyText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
  featuredCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  featuredTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 16,
  },
  featuredLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#64748B",
    marginBottom: 5,
  },
  featuredLocation: {
    flexShrink: 1,
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
    lineHeight: 24,
  },
  magnitudeBadge: {
    minWidth: 74,
    height: 74,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  magnitudeLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FFFFFF",
    opacity: 0.82,
  },
  magnitudeValue: {
    fontSize: 25,
    fontWeight: "900",
    color: "#FFFFFF",
    marginTop: 2,
  },
  featuredMetaRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  metaItem: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 12,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: "#64748B",
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
  },
  timeCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  timeText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#B91C1C",
  },
  openDetailText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#DC2626",
  },
  miniList: {
    marginTop: 12,
    gap: 10,
  },
  miniCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 12,
    alignItems: "center",
  },
  miniMagnitude: {
    minWidth: 62,
    borderRadius: 16,
    paddingHorizontal: 10,
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
    color: "#0F172A",
    lineHeight: 19,
  },
  miniSubtitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
});