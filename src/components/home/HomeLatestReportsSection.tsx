import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { subscribeToIncidents } from "../../services/incidentService";
import { homeStyles as styles } from "../../styles/homeStyles";
import { IncidentReport } from "../../types/incident";
import IncidentCard from "../IncidentCard";
import LoadingState from "../ui/LoadingState";

const MAP_ROUTE = "/(tabs)/map" as Href;

export default function HomeLatestReportsSection() {
  const router = useRouter();

  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToIncidents(
      (items) => {
        setReports(items);
        setErrorMessage(null);
        setLoading(false);
      },
      (error) => {
        console.error("Home latest reports error:", error);
        setErrorMessage(error.message || "Gagal memuat data laporan.");
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const latestReports = useMemo(() => {
    return reports.slice(0, 3);
  }, [reports]);

  const activeReports = useMemo(() => {
    return reports.filter((report) => report.status === "active");
  }, [reports]);

  const highSeverityReports = useMemo(() => {
    return reports.filter((report) => report.severity === "high");
  }, [reports]);

  const handleOpenMap = () => {
    router.push(MAP_ROUTE);
  };

  if (loading) {
    return <LoadingState message="Memuat laporan terbaru..." />;
  }

  return (
    <View style={localStyles.wrapper}>
      <View style={localStyles.statusCard}>
        <View style={localStyles.statusHeader}>
          <View style={localStyles.statusTitleGroup}>
            <Text style={localStyles.statusLabel}>Area Status</Text>

            <Text style={localStyles.statusTitle}>
              {activeReports.length > 0
                ? "Active Monitoring"
                : "No Active Incident"}
            </Text>
          </View>

          <View style={localStyles.liveBadge}>
            <View style={localStyles.liveDot} />
            <Text style={localStyles.liveText}>LIVE</Text>
          </View>
        </View>

        <Text style={localStyles.statusDescription}>
          Ada {activeReports.length} laporan aktif dari total {reports.length}{" "}
          laporan komunitas. {highSeverityReports.length} laporan berstatus high
          severity.
        </Text>

        <Pressable
          onPress={handleOpenMap}
          style={({ pressed }) => [
            localStyles.mapButton,
            pressed && localStyles.buttonPressed,
          ]}
        >
          <Ionicons name="map" size={18} color="#0F172A" />
          <Text style={localStyles.mapButtonText}>Open Crisis Map</Text>
        </Pressable>
      </View>

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Gagal memuat laporan</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={localStyles.sectionTitleGroup}>
            <Text style={styles.sectionTitle}>Latest Community Reports</Text>
            <Text style={styles.sectionSubtitle}>3 laporan terbaru</Text>
          </View>

          <Pressable
            onPress={handleOpenMap}
            style={({ pressed }) => [
              localStyles.viewMapButton,
              pressed && localStyles.viewMapButtonPressed,
            ]}
          >
            <Text style={localStyles.viewMapText}>View Map</Text>
            <Ionicons name="chevron-forward" size={15} color="#DC2626" />
          </Pressable>
        </View>

        {reports.length === 0 ? (
          <View style={localStyles.emptyCard}>
            <View style={localStyles.emptyIcon}>
              <Ionicons name="map-outline" size={28} color="#64748B" />
            </View>

            <Text style={localStyles.emptyTitle}>Belum ada laporan</Text>

            <Text style={localStyles.emptyText}>
              Laporan warga akan muncul di sini setelah dikirim.
            </Text>

            <Pressable
              onPress={handleOpenMap}
              style={({ pressed }) => [
                localStyles.emptyButton,
                pressed && localStyles.buttonPressed,
              ]}
            >
              <Text style={localStyles.emptyButtonText}>Open Map</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.latestList}>
            {latestReports.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onPress={handleOpenMap}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  wrapper: {
    marginBottom: 22,
  },
  statusCard: {
    backgroundColor: "#0F172A",
    borderRadius: 28,
    padding: 18,
    marginBottom: 22,
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 5,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 12,
  },
  statusTitleGroup: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#94A3B8",
    marginBottom: 4,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  statusDescription: {
    fontSize: 13,
    fontWeight: "600",
    color: "#CBD5E1",
    lineHeight: 21,
    marginBottom: 16,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#16A34A",
  },
  liveText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#166534",
  },
  mapButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  mapButtonText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  sectionTitleGroup: {
    flex: 1,
  },
  viewMapButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  viewMapButtonPressed: {
    opacity: 0.75,
  },
  viewMapText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#DC2626",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 22,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
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
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: "#0F172A",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  emptyButtonText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#FFFFFF",
  },
});