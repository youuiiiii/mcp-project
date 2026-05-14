import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";

export default function ReportsEmptyState() {
  return (
    <AppCard style={styles.card}>
      <IconBadge variant="neutral" size="lg" rounded={false}>
        <Ionicons name="document-text-outline" size={28} color={colors.info} />
      </IconBadge>

      <Text style={styles.title}>Tidak ada laporan</Text>

      <Text style={styles.message}>
        Belum ada laporan yang cocok dengan filter atau pencarian saat ini.
      </Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    paddingVertical: spacing["3xl"],
  },
  title: {
    marginTop: spacing.md,
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
  },
  message: {
    marginTop: spacing.sm,
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
  },
});