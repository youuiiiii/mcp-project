import { Href, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { subscribeToIncidents } from "../../services/incidentService";
import { homeStyles as styles } from "../../styles/homeStyles";
import { IncidentReport } from "../../types/incident";
import IncidentCard from "../IncidentCard";
import EmptyState from "../ui/EmptyState";
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
          <View>
            <Text style={localStyles.statusLabel}>Area Status</Text>
            <Text style={localStyles.statusTitle}>
              {activeReports.length > 0 ? "Active Monitoring" : "No Active Incident"}
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
          <View>
            <Text style={styles.sectionTitle}>Latest Community Reports</Text>
            <Text style={styles.sectionSubtitle}>3 laporan terbaru</Text>
          </View>

          <Pressable onPress={handleOpenMap}>
            <Text style={localStyles.viewMapText}>View Map</Text>
          </Pressable>
        </View>

        {reports.length === 0 ? (
          <EmptyState
            icon="🗺️"
            title="Belum ada laporan"
            message="Laporan warga akan muncul di sini setelah dikirim."
          />
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
  viewMapText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#DC2626",
  },
});