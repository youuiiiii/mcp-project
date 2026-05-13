import { Href, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import BmkgEarthquakeSection from "../../src/components/home/BmkgEarthquakeSection";
import HomeLatestReportsSection from "../../src/components/home/HomeLatestReportsSection";
import { useAuth } from "../../src/contexts/AuthContext";

const MAP_ROUTE = "/(tabs)/map" as Href;
const REPORT_ROUTE = "/(tabs)/report" as Href;
const ANALYTICS_ROUTE = "/(tabs)/analytics" as Href;
const PROFILE_ROUTE = "/(tabs)/profile" as Href;

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "Community Reporter";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{displayName}</Text>
          </View>

          <Pressable
            onPress={() => router.push(PROFILE_ROUTE)}
            style={({ pressed }) => [
              styles.avatarButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.avatarText}>
              {displayName
                .split(" ")
                .map((item) => item.charAt(0))
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.heroTitle}>Stay aware of nearby incidents</Text>

        <Text style={styles.heroSubtitle}>
          Pantau laporan warga, update resmi gempa, dan kondisi sekitar secara
          realtime.
        </Text>

        <View style={styles.heroStatusCard}>
          <View style={styles.statusDot} />

          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>Monitoring active</Text>
            <Text style={styles.statusText}>
              Community reports and official earthquake updates are being
              monitored.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.quickSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Text style={styles.sectionSubtitle}>Akses fitur utama</Text>
        </View>

        <View style={styles.quickGrid}>
          <Pressable
            onPress={() => router.push(REPORT_ROUTE)}
            style={({ pressed }) => [
              styles.quickCard,
              styles.quickCardPrimary,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.quickIcon}>🚨</Text>
            <Text style={styles.quickTitlePrimary}>Report Incident</Text>
            <Text style={styles.quickTextPrimary}>
              Buat laporan kejadian baru
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push(MAP_ROUTE)}
            style={({ pressed }) => [styles.quickCard, pressed && styles.pressed]}
          >
            <Text style={styles.quickIcon}>🗺️</Text>
            <Text style={styles.quickTitle}>Open Map</Text>
            <Text style={styles.quickText}>Pantau lokasi incident</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push(ANALYTICS_ROUTE)}
            style={({ pressed }) => [styles.quickCard, pressed && styles.pressed]}
          >
            <Text style={styles.quickIcon}>📊</Text>
            <Text style={styles.quickTitle}>Analytics</Text>
            <Text style={styles.quickText}>Lihat ringkasan data</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push(PROFILE_ROUTE)}
            style={({ pressed }) => [styles.quickCard, pressed && styles.pressed]}
          >
            <Text style={styles.quickIcon}>👤</Text>
            <Text style={styles.quickTitle}>Profile</Text>
            <Text style={styles.quickText}>Akun dan kontribusi</Text>
          </Pressable>
        </View>
      </View>

      <BmkgEarthquakeSection />

      <HomeLatestReportsSection />
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
    padding: 20,
    marginBottom: 24,
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 6,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
    gap: 14,
  },
  greeting: {
    fontSize: 13,
    fontWeight: "700",
    color: "#94A3B8",
  },
  userName: {
    marginTop: 3,
    fontSize: 19,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  avatarButton: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 36,
  },
  heroSubtitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#CBD5E1",
    lineHeight: 22,
  },
  heroStatusCard: {
    marginTop: 18,
    backgroundColor: "#1E293B",
    borderRadius: 22,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#22C55E",
    marginTop: 5,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  statusText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#CBD5E1",
    lineHeight: 18,
  },
  quickSection: {
    marginBottom: 24,
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
    marginTop: 3,
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    minHeight: 142,
    justifyContent: "space-between",
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  quickCardPrimary: {
    backgroundColor: "#DC2626",
    borderColor: "#DC2626",
  },
  quickIcon: {
    fontSize: 28,
  },
  quickTitle: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
  },
  quickTitlePrimary: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  quickText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    lineHeight: 18,
  },
  quickTextPrimary: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "700",
    color: "#FEE2E2",
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
});