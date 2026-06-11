import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

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

export default function IncidentsHeader({
  summary,
  searchQuery,
  selectedFilter,
  onSearchChange,
  onFilterChange,
}: IncidentsHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.hero}>
        <Text style={styles.title}>Daftar Laporan</Text>
        <Text style={styles.subtitle}>
          {summary.total > 0
            ? `${summary.active} Aktif • ${summary.resolved} Selesai • ${summary.total} Total`
            : "BELUM ADA LAPORAN DI AREA INI"}
        </Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={colors.textSoft} />
        <TextInput
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Cari laporan, kategori, atau status..."
          placeholderTextColor={colors.textSoft}
          style={styles.searchInput}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => onSearchChange("")}>
            <Ionicons name="close-circle" size={18} color={colors.textSoft} />
          </Pressable>
        )}
      </View>

      {/* Filter chips */}
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
    gap: spacing.md,
  },
  hero: {
    gap: 4,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    padding: 0,
    fontWeight: "500",
  },
  filterRow: {
    gap: spacing.sm,
    paddingBottom: spacing.xs,
  },
  filterChip: {
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipPressed: {
    opacity: 0.82,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
  },
  filterChipTextActive: {
    color: colors.textInverse,
  },
});