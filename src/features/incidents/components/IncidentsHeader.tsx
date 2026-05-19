import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import StatusBadge from "../../../components/ui/StatusBadge";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";
import {
  INCIDENT_FILTER_OPTIONS,
  type IncidentFilter,
  type IncidentsSummary,
} from "../hooks/useIncidentsScreen";

type IncidentsHeaderProps = {
  summary: IncidentsSummary;
  searchQuery: string;
  selectedFilter: IncidentFilter;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: IncidentFilter) => void;
};

type SummaryItem = {
  label: string;
  value: number;
  iconName: keyof typeof Ionicons.glyphMap;
  color: string;
};

export default function IncidentsHeader({
  summary,
  searchQuery,
  selectedFilter,
  onSearchChange,
  onFilterChange,
}: IncidentsHeaderProps) {
  const summaryItems: SummaryItem[] = [
    {
      label: "Total",
      value: summary.total,
      iconName: "layers",
      color: colors.info,
    },
    {
      label: "Active",
      value: summary.active,
      iconName: "radio",
      color: colors.danger,
    },
    {
      label: "Resolved",
      value: summary.resolved,
      iconName: "checkmark-circle",
      color: colors.success,
    },
    {
      label: "High urgency",
      value: summary.highSeverity,
      iconName: "alert-circle",
      color: colors.warningDark,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <StatusBadge label="Realtime Incidents" variant="info" size="sm" />

        <Text style={styles.title}>Incidents</Text>

        <Text style={styles.subtitle}>
          Monitor community incidents, open detail threads, verify reports, and
          resolve confirmed incidents.
        </Text>
      </View>

      <View style={styles.summaryGrid}>
        {summaryItems.map((item) => (
          <AppCard key={item.label} style={styles.summaryCard}>
            <IconBadge variant="neutral" size="md" rounded={false}>
              <Ionicons name={item.iconName} size={22} color={item.color} />
            </IconBadge>

            <Text style={styles.summaryValue}>{item.value}</Text>
            <Text style={styles.summaryLabel}>{item.label}</Text>
          </AppCard>
        ))}
      </View>

      <AppCard style={styles.searchCard}>
        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color={colors.textSoft} />

          <TextInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Search incidents, categories, status, or reporter..."
            placeholderTextColor={colors.textSoft}
            style={styles.searchInput}
          />
        </View>
      </AppCard>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {INCIDENT_FILTER_OPTIONS.map((filter) => {
          const active = selectedFilter === filter.value;

          return (
            <Pressable
              key={filter.value}
              onPress={() => onFilterChange(filter.value)}
              style={({ pressed }) => [
                styles.filterChip,
                active && styles.filterChipActive,
                pressed && styles.filterChipPressed,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  active && styles.filterChipTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  hero: {
    gap: spacing.sm,
  },
  title: {
    ...typography.hero,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  summaryCard: {
    width: "48%",
    minHeight: 118,
  },
  summaryValue: {
    marginTop: spacing.md,
    fontSize: 26,
    fontWeight: "900",
    color: colors.text,
  },
  summaryLabel: {
    marginTop: 4,
    ...typography.caption,
    color: colors.textMuted,
  },
  searchCard: {
    paddingVertical: spacing.sm,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 4,
    ...typography.body,
    color: colors.text,
  },
  filterRow: {
    gap: spacing.sm,
  },
  filterChip: {
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  filterChipPressed: {
    opacity: 0.82,
  },
  filterChipText: {
    ...typography.label,
    color: colors.textMuted,
  },
  filterChipTextActive: {
    color: colors.textInverse,
  },
});