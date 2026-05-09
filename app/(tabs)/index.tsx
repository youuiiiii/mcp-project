import { ScrollView, Text, View } from "react-native";

import BmkgEarthquakeSection from "../../src/components/home/BmkgEarthquakeSection";
import RealtimeReportsSection from "../../src/components/home/RealtimeReportsSection";
import { homeStyles as styles } from "../../src/styles/homeStyles";

export default function HomeScreen() {
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

      <BmkgEarthquakeSection />

      <RealtimeReportsSection />
    </ScrollView>
  );
}