import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  checkAndNotifyNearbyDisaster,
  requestNotificationPermission,
} from "../../services/notifications";
import { homeStyles as styles } from "../../styles/homeStyles";
import EmptyState from "../ui/EmptyState";

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
      checkAndNotifyNearbyDisaster(gempaList);
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
    return earthquakes.slice(0, 5);
  }, [earthquakes]);

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
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Gempa Terkini BMKG</Text>
        <Text style={styles.sectionSubtitle}>5 terbaru</Text>
      </View>

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Gagal memuat data BMKG</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      ) : null}

      {loading ? (
        <View style={bmkgStyles.loadingBox}>
          <ActivityIndicator size="large" color="#C0392B" />
          <Text style={bmkgStyles.loadingText}>Memuat data BMKG...</Text>
        </View>
      ) : latestEarthquakes.length === 0 ? (
        <EmptyState
          icon="🌍"
          title="Belum ada data gempa"
          message="Data gempa dari BMKG belum tersedia atau gagal dimuat."
        />
      ) : (
        <View style={bmkgStyles.list}>
          {latestEarthquakes.map((item, index) => (
            <TouchableOpacity
              key={`${item.DateTime ?? index}-${item.Magnitude ?? ""}`}
              style={bmkgStyles.card}
              activeOpacity={0.85}
              onPress={() => handleOpenEarthquake(item)}
            >
              <View style={bmkgStyles.cardHeader}>
                <Text style={bmkgStyles.cardTitle}>🌍 Gempa Bumi</Text>

                <View style={bmkgStyles.magnitudeBadge}>
                  <Text style={bmkgStyles.magnitudeText}>
                    M {item.Magnitude ?? "-"}
                  </Text>
                </View>
              </View>

              <Text style={bmkgStyles.cardText}>
                Lokasi: {item.Wilayah ?? "-"}
              </Text>

              <Text style={bmkgStyles.cardText}>
                Waktu: {item.Jam ?? "-"}, {item.Tanggal ?? "-"}
              </Text>

              <Text style={bmkgStyles.cardText}>
                Kedalaman: {item.Kedalaman ?? "-"}
              </Text>

              <Text style={bmkgStyles.cardText}>
                Potensi: {item.Potensi ?? "-"}
              </Text>

              <Text style={bmkgStyles.cardSeeMore}>Lihat detail →</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const bmkgStyles = StyleSheet.create({
  loadingBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderLeftWidth: 5,
    borderLeftColor: "#C0392B",
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 12,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
  },
  magnitudeBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  magnitudeText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#B91C1C",
  },
  cardText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 4,
    lineHeight: 19,
  },
  cardSeeMore: {
    color: "#C0392B",
    fontSize: 13,
    marginTop: 8,
    fontWeight: "900",
  },
});