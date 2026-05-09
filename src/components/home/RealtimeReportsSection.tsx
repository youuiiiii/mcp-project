import { useEffect, useMemo, useState } from "react";
import { Alert, Text, View } from "react-native";

import IncidentCard from "../IncidentCard";
import StatsPanel from "../StatsPanel";
import EmptyState from "../ui/EmptyState";
import LoadingState from "../ui/LoadingState";
import { subscribeToIncidents } from "../../services/incidentService";
import { homeStyles as styles } from "../../styles/homeStyles";
import { IncidentReport } from "../../types/incident";

export default function RealtimeReportsSection() {
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
        console.error("Home realtime error:", error);
        setErrorMessage(error.message || "Gagal memuat data laporan.");
        setLoading(false);
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
    return <LoadingState message="Memuat laporan realtime..." />;
  }

  return (
    <>
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

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Gagal memuat data laporan</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      ) : null}

      {reports.length === 0 ? (
        <EmptyState
          icon="🗺️"
          title="Belum ada laporan warga"
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
    </>
  );
}