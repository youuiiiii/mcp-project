import { Href, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import LoadingState from "../../src/components/ui/LoadingState";
import { useAuth } from "../../src/contexts/AuthContext";
import {
  subscribeToIncidents,
  subscribeToSOSLogs,
} from "../../src/services/incidentService";
import { IncidentReport, SOSLog } from "../../src/types/incident";

const LOGIN_ROUTE = "/login" as Href;

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [sosLogs, setSosLogs] = useState<SOSLog[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingSOS, setLoadingSOS] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeReports = subscribeToIncidents(
      (items) => {
        setReports(items);
        setLoadingReports(false);
      },
      (error) => {
        console.error("Profile reports error:", error);
        setErrorMessage(error.message || "Gagal memuat data laporan.");
        setLoadingReports(false);
      }
    );

    const unsubscribeSOS = subscribeToSOSLogs(
      (items) => {
        setSosLogs(items);
        setLoadingSOS(false);
      },
      (error) => {
        console.error("Profile SOS error:", error);
        setErrorMessage(error.message || "Gagal memuat data SOS.");
        setLoadingSOS(false);
      }
    );

    return () => {
      unsubscribeReports();
      unsubscribeSOS();
    };
  }, []);

  const loading = loadingReports || loadingSOS;

  const displayName = useMemo(() => {
    return user?.displayName || user?.email?.split("@")[0] || "Community Reporter";
  }, [user]);

  const userEmail = user?.email || "-";

  const userInitial = useMemo(() => {
    return displayName
      .split(" ")
      .map((item) => item.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [displayName]);

  const activeReports = useMemo(() => {
    return reports.filter((report) => report.status === "active");
  }, [reports]);

  const resolvedReports = useMemo(() => {
    return reports.filter((report) => report.status === "resolved");
  }, [reports]);

  const highReports = useMemo(() => {
    return reports.filter((report) => report.severity === "high");
  }, [reports]);

  const handleLogout = () => {
    Alert.alert("Logout", "Keluar dari akun ini?", [
      {
        text: "Batal",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            router.replace(LOGIN_ROUTE);
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Logout Gagal", "Terjadi kesalahan saat logout.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingState message="Memuat profile..." />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userInitial}</Text>
        </View>

        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{userEmail}</Text>

        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>Community Reporter</Text>
        </View>
      </View>

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Sebagian data gagal dimuat</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Contribution Summary</Text>
          <Text style={styles.sectionSubtitle}>Aktivitas komunitas realtime</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📍</Text>
            <Text style={styles.statValue}>{reports.length}</Text>
            <Text style={styles.statLabel}>Total Reports</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🚨</Text>
            <Text style={styles.statValue}>{activeReports.length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={styles.statValue}>{resolvedReports.length}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🆘</Text>
            <Text style={styles.statValue}>{sosLogs.length}</Text>
            <Text style={styles.statLabel}>SOS Logs</Text>
          </View>
        </View>
      </View>

      <View style={styles.alertCard}>
        <View style={styles.alertIcon}>
          <Text style={styles.alertIconText}>⚠️</Text>
        </View>

        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>High Severity Reports</Text>
          <Text style={styles.alertText}>
            Ada {highReports.length} laporan high severity yang tercatat di sistem.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <Text style={styles.sectionSubtitle}>Status aplikasi dan data</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Text style={styles.infoIconText}>📱</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Application</Text>
              <Text style={styles.infoValue}>Community Safety Monitoring</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Text style={styles.infoIconText}>⚡</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Realtime Database</Text>
              <Text style={styles.infoValue}>Firebase Firestore</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Text style={styles.infoIconText}>🧭</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Core Feature</Text>
              <Text style={styles.infoValue}>Map-based Incident Reporting</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Text style={styles.infoIconText}>🏷️</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0 Development</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.reminderCard}>
        <Text style={styles.reminderTitle}>Emergency Reminder</Text>
        <Text style={styles.reminderText}>
          Aplikasi ini membantu pelaporan dan pemantauan kejadian sekitar, tetapi
          tidak menggantikan layanan darurat resmi. Jika kondisi berbahaya,
          segera hubungi pihak berwenang.
        </Text>
      </View>

      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.logoutButtonPressed,
        ]}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 58,
    paddingBottom: 36,
  },
  hero: {
    backgroundColor: "#0F172A",
    borderRadius: 32,
    padding: 22,
    alignItems: "center",
    marginBottom: 22,
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 6,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0F172A",
  },
  name: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
  },
  email: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: "700",
    color: "#CBD5E1",
  },
  roleBadge: {
    marginTop: 14,
    backgroundColor: "#1E293B",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#991B1B",
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 13,
    fontWeight: "600",
    color: "#B91C1C",
    lineHeight: 20,
  },
  section: {
    marginBottom: 22,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#0F172A",
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    minHeight: 132,
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  statIcon: {
    fontSize: 26,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 27,
    fontWeight: "900",
    color: "#0F172A",
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
  },
  alertCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },
  alertIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  alertIconText: {
    fontSize: 22,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#991B1B",
    marginBottom: 4,
  },
  alertText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#B91C1C",
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  infoIconText: {
    fontSize: 22,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#64748B",
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 14,
  },
  reminderCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginBottom: 20,
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1E3A8A",
    marginBottom: 6,
  },
  reminderText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
    lineHeight: 21,
  },
  logoutButton: {
    backgroundColor: "#DC2626",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#991B1B",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
  logoutButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
  },
});