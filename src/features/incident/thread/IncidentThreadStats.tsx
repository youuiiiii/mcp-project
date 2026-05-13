import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/layout";
import type { IncidentReport } from "../../../types/incident";
import type { AppIconName } from "./threadLabels";

type StatItem = {
  value: number;
  label: string;
  icon: AppIconName;
  color: string;
};

type IncidentThreadStatsProps = {
  incident: IncidentReport;
};

export default function IncidentThreadStats({
  incident,
}: IncidentThreadStatsProps) {
  const items: StatItem[] = [
    {
      value: incident.verificationCount ?? 0,
      label: "Benar",
      icon: "checkmark-circle",
      color: colors.success,
    },
    {
      value: incident.disputeCount ?? 0,
      label: "Tidak Sesuai",
      icon: "close-circle",
      color: colors.danger,
    },
    {
      value: incident.evidenceCount ?? 0,
      label: "Bukti",
      icon: "image",
      color: colors.info,
    },
    {
      value: incident.replyCount ?? 0,
      label: "Diskusi",
      icon: "chatbubbles",
      color: colors.warningDark,
    },
  ];

  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <AppCard key={item.label} padding="sm" style={styles.card}>
          <Ionicons name={item.icon} size={18} color={item.color} />
          <Text style={styles.value}>{item.value}</Text>
          <Text style={styles.label} numberOfLines={1}>
            {item.label}
          </Text>
        </AppCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    marginTop: spacing.md,
    flexDirection: "row",
    gap: spacing.sm,
  },
  card: {
    flex: 1,
    alignItems: "center",
    minHeight: 84,
  },
  value: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
  },
  label: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
    textAlign: "center",
  },
});