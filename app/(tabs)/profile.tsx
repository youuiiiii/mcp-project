import { Href, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import LoadingState from "../../src/components/ui/LoadingState";
import { useAuth } from "../../src/contexts/AuthContext";
import {
  subscribeToIncidents,
  subscribeToSOSLogs,
} from "../../src/services/incidentService";
import { profileStyles as styles } from "../../src/styles/profileStyles";
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

  const userName = useMemo(() => {
    return user?.displayName || "SIGAP User";
  }, [user]);

  const userEmail = useMemo(() => {
    return user?.email || "-";
  }, [user]);

  const userInitial = useMemo(() => {
    return userName
      .split(" ")
      .map((item) => item.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [userName]);

  const activeReports = useMemo(() => {
    return reports.filter((report) => report.status === "active");
  }, [reports]);

  const resolvedReports = useMemo(() => {
    return reports.filter((report) => report.status === "resolved");
  }, [reports]);

  const handleLogout = () => {
    Alert.alert("Logout", "Apakah kamu yakin ingin keluar?", [
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
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>USER PROFILE</Text>
        </View>

        <Text style={styles.title}>Profile</Text>

        <Text style={styles.subtitle}>
          Informasi pengguna, ringkasan kontribusi laporan, dan status aplikasi
          SIGAP.
        </Text>
      </View>

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Gagal memuat sebagian data</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      ) : null}

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userInitial}</Text>
        </View>

        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>

        <View style={styles.userRole}>
          <Text style={styles.userRoleText}>Community Reporter</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Realtime Summary</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📍</Text>
            <Text style={styles.statValue}>{reports.length}</Text>
            <Text style={styles.statLabel}>Total laporan masuk</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🚨</Text>
            <Text style={styles.statValue}>{activeReports.length}</Text>
            <Text style={styles.statLabel}>Laporan aktif</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={styles.statValue}>{resolvedReports.length}</Text>
            <Text style={styles.statLabel}>Laporan selesai</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🆘</Text>
            <Text style={styles.statValue}>{sosLogs.length}</Text>
            <Text style={styles.statLabel}>SOS logs tercatat</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Information</Text>

        <View style={styles.appCard}>
          <View style={styles.appRow}>
            <View style={styles.appIcon}>
              <Text style={styles.appIconText}>📱</Text>
            </View>

            <View style={styles.appInfo}>
              <Text style={styles.appLabel}>Application Name</Text>
              <Text style={styles.appValue}>SIGAP</Text>
            </View>
          </View>

          <View style={styles.appRow}>
            <View style={styles.appIcon}>
              <Text style={styles.appIconText}>🧭</Text>
            </View>

            <View style={styles.appInfo}>
              <Text style={styles.appLabel}>Core Feature</Text>
              <Text style={styles.appValue}>
                Disaster Monitoring & Incident Reporting
              </Text>
            </View>
          </View>

          <View style={styles.appRow}>
            <View style={styles.appIcon}>
              <Text style={styles.appIconText}>⚡</Text>
            </View>

            <View style={styles.appInfo}>
              <Text style={styles.appLabel}>Realtime Database</Text>
              <Text style={styles.appValue}>Firebase Firestore</Text>
            </View>
          </View>

          <View style={styles.appRow}>
            <View style={styles.appIcon}>
              <Text style={styles.appIconText}>📊</Text>
            </View>

            <View style={styles.appInfo}>
              <Text style={styles.appLabel}>Analytics Status</Text>
              <Text style={styles.appValue}>Realtime Monitoring Active</Text>
            </View>
          </View>

          <View style={[styles.appRow, styles.appRowLast]}>
            <View style={styles.appIcon}>
              <Text style={styles.appIconText}>🏷️</Text>
            </View>

            <View style={styles.appInfo}>
              <Text style={styles.appLabel}>Version</Text>
              <Text style={styles.appValue}>1.0.0</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>Emergency Reminder</Text>
          <Text style={styles.warningText}>
            Aplikasi ini membantu pelaporan dan pemantauan kejadian sekitar,
            tetapi tidak menggantikan layanan darurat resmi. Jika kondisi
            berbahaya, segera hubungi pihak berwenang.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.actionCard}>
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.logoutButtonPressed,
            ]}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}