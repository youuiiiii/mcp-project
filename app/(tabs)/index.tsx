import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import BmkgEarthquakeSection from "../../src/components/home/BmkgEarthquakeSection";
import HomeLatestReportsSection from "../../src/components/home/HomeLatestReportsSection";
import { useAuth } from "../../src/contexts/AuthContext";

const MAP_ROUTE = "/(tabs)/map" as Href;
const REPORT_ROUTE = "/(tabs)/report" as Href;
const ANALYTICS_ROUTE = "/(tabs)/analytics" as Href;
const PROFILE_ROUTE = "/(tabs)/profile" as Href;

type QuickAction = {
  title: string;
  description: string;
  route: Href;
  icon: keyof typeof Ionicons.glyphMap;
  primary?: boolean;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    title: "Report Incident",
    description: "Buat laporan kejadian baru",
    route: REPORT_ROUTE,
    icon: "add-circle",
    primary: true,
  },
  {
    title: "Open Map",
    description: "Pantau lokasi incident",
    route: MAP_ROUTE,
    icon: "map",
  },
  {
    title: "Analytics",
    description: "Lihat ringkasan data",
    route: ANALYTICS_ROUTE,
    icon: "stats-chart",
  },
  {
    title: "Profile",
    description: "Akun dan kontribusi",
    route: PROFILE_ROUTE,
    icon: "person",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "Community Reporter";

  const initials = displayName
    .split(" ")
    .map((item) => item.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName} numberOfLines={1}>
              {displayName}
            </Text>
          </View>

          <Pressable
            onPress={() => router.push(PROFILE_ROUTE)}
            style={({ pressed }) => [
              styles.avatarButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </Pressable>
        </View>

        <Text style={styles.heroTitle}>Stay aware of nearby incidents</Text>

        <Text style={styles.heroSubtitle}>
          Pantau laporan warga, update resmi gempa, dan kondisi sekitar secara
          realtime.
        </Text>

        <View style={styles.heroStatusCard}>
          <View style={styles.statusIcon}>
            <Ionicons name="radio" size={22} color="#22C55E" />
          </View>

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
          {QUICK_ACTIONS.map((item) => (
            <Pressable
              key={item.title}
              onPress={() => router.push(item.route)}
              style={({ pressed }) => [
                styles.quickCard,
                item.primary && styles.quickCardPrimary,
                pressed && styles.pressed,
              ]}
            >
              <View
                style={[
                  styles.quickIconWrapper,
                  item.primary && styles.quickIconWrapperPrimary,
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={26}
                  color={item.primary ? "#FFFFFF" : "#DC2626"}
                />
              </View>

              <View>
                <Text
                  style={[
                    styles.quickTitle,
                    item.primary && styles.quickTitlePrimary,
                  ]}
                >
                  {item.title}
                </Text>

                <Text
                  style={[
                    styles.quickText,
                    item.primary && styles.quickTextPrimary,
                  ]}
                >
                  {item.description}
                </Text>
              </View>
            </Pressable>
          ))}
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
  userInfo: {
    flex: 1,
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
  statusIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "#064E3B",
    alignItems: "center",
    justifyContent: "center",
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
    minHeight: 150,
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
  quickIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  quickIconWrapperPrimary: {
    backgroundColor: "#B91C1C",
  },
  quickTitle: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
  },
  quickTitlePrimary: {
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
    color: "#FEE2E2",
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
});