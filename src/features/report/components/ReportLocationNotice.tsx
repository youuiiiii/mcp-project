import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";

export default function ReportLocationNotice() {
  return (
    <AppCard variant="muted" style={styles.card}>
      <IconBadge variant="info" size="md" rounded={false}>
        <Ionicons name="location" size={22} color={colors.info} />
      </IconBadge>

      <View style={styles.content}>
        <Text style={styles.title}>Automatic report location</Text>

        <Text style={styles.description}>
          When you submit, SIGAP uses your current location. Make sure you are
          near the incident and location permission is enabled.
        </Text>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: colors.infoSoft,
    borderColor: "#BFDBFE",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.infoDark,
  },
  description: {
    marginTop: 4,
    ...typography.caption,
    color: "#1E3A8A",
  },
});
