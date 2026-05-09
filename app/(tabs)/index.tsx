import { Href, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import BmkgEarthquakeSection from "../../src/components/home/BmkgEarthquakeSection";
import RealtimeReportsSection from "../../src/components/home/RealtimeReportsSection";
import { homeStyles as styles } from "../../src/styles/homeStyles";

const REPORTS_ROUTE = "/(tabs)/reports" as Href;
const EDUCATION_ROUTE = "/(tabs)/education" as Href;

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>LIVE INCIDENT MONITORING</Text>
        </View>

        <Text style={styles.title}>🚨 SIGAP</Text>

        <Text style={styles.subtitle}>
          Disaster Early Warning System untuk memantau gempa BMKG dan laporan
          kejadian sekitar secara real-time.
        </Text>
      </View>

      <View style={quickStyles.quickSection}>
        <Text style={quickStyles.quickTitle}>Menu Cepat</Text>

        <View style={quickStyles.quickGrid}>
          <Pressable
            style={({ pressed }) => [
              quickStyles.quickCard,
              pressed && quickStyles.quickCardPressed,
            ]}
            onPress={() => router.push(REPORTS_ROUTE)}
          >
            <Text style={quickStyles.quickIcon}>📋</Text>
            <Text style={quickStyles.quickCardTitle}>Reports</Text>
            <Text style={quickStyles.quickCardSubtitle}>
              Lihat daftar laporan warga
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              quickStyles.quickCard,
              pressed && quickStyles.quickCardPressed,
            ]}
            onPress={() => router.push(EDUCATION_ROUTE)}
          >
            <Text style={quickStyles.quickIcon}>📚</Text>
            <Text style={quickStyles.quickCardTitle}>Education</Text>
            <Text style={quickStyles.quickCardSubtitle}>
              Edukasi kesiapsiagaan bencana
            </Text>
          </Pressable>
        </View>
      </View>

      <BmkgEarthquakeSection />

      <RealtimeReportsSection />
    </ScrollView>
  );
}

const quickStyles = StyleSheet.create({
  quickSection: {
    marginBottom: 22,
  },
  quickTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 12,
  },
  quickGrid: {
    gap: 12,
  },
  quickCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  quickCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  quickIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickCardTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 4,
  },
  quickCardSubtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    lineHeight: 19,
  },
});