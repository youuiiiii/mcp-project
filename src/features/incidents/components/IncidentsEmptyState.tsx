import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";

export default function IncidentsEmptyState() {
  return (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <Ionicons name="shield-checkmark" size={32} color={colors.textSoft} />
      </View>

      <Text style={styles.title}>NO ACTIVE INCIDENTS</Text>

      <Text style={styles.message}>
        No incident reports match the current filter or search criteria in this sector.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    paddingVertical: spacing["3xl"],
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: "dashed",
    marginTop: spacing.md,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.textMuted,
    textAlign: "center",
    letterSpacing: 1,
  },
  message: {
    marginTop: spacing.sm,
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSoft,
    textAlign: "center",
    lineHeight: 20,
  },
});