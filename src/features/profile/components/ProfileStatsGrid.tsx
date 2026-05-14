import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import SectionHeader from "../../../components/ui/SectionHeader";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/layout";
import type { ProfileStats } from "../hooks/useProfileScreen";

type AppIconName = keyof typeof Ionicons.glyphMap;

type StatItem = {
  label: string;
  value: number;
  iconName: AppIconName;
  color: string;
  variant: "danger" | "success" | "warning" | "info";
};

type ProfileStatsGridProps = {
  stats: ProfileStats;
};

export default function ProfileStatsGrid({ stats }: ProfileStatsGridProps) {
  const items: StatItem[] = [
    {
      label: "Laporan Saya",
      value: stats.totalReports,
      iconName: "document-text",
      color: colors.info,
      variant: "info",
    },
    {
      label: "Aktif",
      value: stats.activeReports,
      iconName: "radio",
      color: colors.danger,
      variant: "danger",
    },
    {
      label: "Selesai",
      value: stats.resolvedReports,
      iconName: "checkmark-circle",
      color: colors.success,
      variant: "success",
    },
    {
      label: "Severity Tinggi",
      value: stats.highSeverityReports,
      iconName: "alert-circle",
      color: colors.warningDark,
      variant: "warning",
    },
  ];

  return (
    <View style={styles.section}>
      <SectionHeader
        title="Kontribusi Saya"
        subtitle="Ringkasan laporan yang dibuat oleh akun ini"
        style={styles.sectionHeader}
      />

      <View style={styles.statsGrid}>
        {items.map((item) => (
          <AppCard key={item.label} style={styles.statCard}>
            <IconBadge variant={item.variant} size="md" rounded={false}>
              <Ionicons name={item.iconName} size={23} color={item.color} />
            </IconBadge>

            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </AppCard>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    marginBottom: 0,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  statCard: {
    width: "48%",
    minHeight: 132,
  },
  statValue: {
    marginTop: spacing.md,
    fontSize: 27,
    fontWeight: "900",
    color: colors.text,
  },
  statLabel: {
    marginTop: spacing.xs,
    fontSize: 12,
    fontWeight: "800",
    color: colors.textMuted,
  },
});