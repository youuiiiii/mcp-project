import { useEffect, useMemo, useState } from "react";
import { Alert, RefreshControl, ScrollView, Text, View } from "react-native";
import IncidentCard from "../../src/components/IncidentCard";
import StatsPanel from "../../src/components/StatsPanel";
import EmptyState from "../../src/components/ui/EmptyState";
import LoadingState from "../../src/components/ui/LoadingState";
import { subscribeToIncidents } from "../../src/services/incidentService";
import { homeStyles as styles } from "../../src/styles/homeStyles";
import { IncidentReport } from "../../src/types/incident";

export default function HomeScreen() {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToIncidents(
      (items) => {
        setReports(items);
        setErrorMessage(null);
        setLoading(false);
        setRefreshing(false);
      },
      (error) => {
        console.error("Home realtime error:", error);
        setErrorMessage(error.message || "Gagal memuat data laporan.");
        setLoading(false);
        setRefreshing(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const latestReports = useMemo(() => {
    return reports.slice(0, 5);
  }, [reports]);

  const activeReports = useMemo(() => {
    return reports.filter((report) => report.status === "active");
  }, [reports]);

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  const handleOpenIncident = (incident: IncidentReport) => {
    Alert.alert(
      incident.title,
      `${incident.description || "Tidak ada deskripsi."}\n\nStatus: ${
        incident.status === "active" ? "Active" : "Resolved"
      }\nSeverity: ${incident.severity.toUpperCase()}`,
      [{ text: "OK" }]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingState message="Memuat dashboard realtime..." />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        reports.length === 0 && styles.emptyContent,
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>LIVE INCIDENT MONITORING</Text>
        </View>

        <Text style={styles.title}>Incident Ready App</Text>

        <Text style={styles.subtitle}>
          Pantau laporan kejadian sekitar secara real-time, mulai dari bencana,
          kecelakaan, pohon tumbang, jalan terhalang, kriminalitas, gangguan
          publik, hingga kondisi darurat medis.
        </Text>

        <View style={styles.liveCard}>
          <View style={styles.liveHeader}>
            <Text style={styles.liveTitle}>Realtime Status</Text>

            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>ONLINE</Text>
            </View>
          </View>

          <Text style={styles.liveDescription}>
            Ada {activeReports.length} laporan aktif yang sedang dipantau dari
            total {reports.length} laporan masuk.
          </Text>
        </View>
      </View>

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Gagal memuat data</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      ) : null}

      {reports.length === 0 ? (
        <EmptyState
          icon="🗺️"
          title="Belum ada laporan"
          message="Laporan dari warga akan muncul di sini secara realtime setelah data dikirim ke Firestore."
        />
      ) : (
        <>
          <StatsPanel reports={reports} />

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Latest Reports</Text>
              <Text style={styles.sectionSubtitle}>5 terbaru</Text>
            </View>

            <View style={styles.latestList}>
              {latestReports.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  onPress={handleOpenIncident}
                />
              ))}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}