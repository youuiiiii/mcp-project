import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";

export default function ReportLocationNotice() {
  return (
    <AppCard variant="muted" style={styles.locationCard}>
      <IconBadge variant="info" size="md" rounded={false}>
        <Ionicons name="location" size={22} color={colors.info} />
      </IconBadge>

      <View style={styles.locationInfo}>
        <Text style={styles.locationTitle}>Realtime location</Text>
        <Text style={styles.locationText}>
          Lokasi akan diambil otomatis saat laporan dikirim. Pastikan kamu
          berada di sekitar lokasi kejadian.
        </Text>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  locationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: colors.infoSoft,
    borderColor: colors.info,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.infoDark,
    marginBottom: 4,
  },
  locationText: {
    ...typography.caption,
    color: colors.info,
  },
});