import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
  type IncidentSortMode,
  type IncidentsSummary,
} from "../hooks/useIncidentsScreen";

type IncidentsHeaderProps = {
  summary: IncidentsSummary;
  searchQuery: string;
  selectedFilter: IncidentFilter;
  sortMode: IncidentSortMode;
  resultCount: number;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: IncidentFilter) => void;
  onToggleSort: () => void;
};

export default function IncidentsHeader({
  summary,
  searchQuery,
  selectedFilter,
  sortMode,
  resultCount,
  onSearchChange,
  onFilterChange,
  onToggleSort,
}: IncidentsHeaderProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primaryDark, "#0FB8D0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Incident List</Text>
            <Text style={styles.subtitle}>
              {summary.total} incidents recorded today
            </Text>
          </View>

          <Pressable
            onPress={onToggleSort}
            accessibilityRole="button"
            accessibilityLabel="Change incident sort"
            style={({ pressed }) => [
              styles.sortButton,
              pressed && styles.sortButtonPressed,
            ]}
          >
            <Ionicons name="swap-vertical" size={22} color={colors.textInverse} />
          </Pressable>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textSoft} />
          <TextInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Search incident or location..."
            placeholderTextColor={colors.textSoft}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 ? (
            <Pressable onPress={() => onSearchChange("")}>
              <Ionicons name="close-circle" size={18} color={colors.textSoft} />
            </Pressable>
          ) : null}
        </View>
      </LinearGradient>

      <View style={styles.filterShell}>
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

        <View style={styles.sortMetaRow}>
          <Text style={styles.sortMetaText}>
            Sorted by:{" "}
            <Text style={styles.sortMetaStrong}>
              {sortMode === "latest" ? "Latest" : "Severity"}
            </Text>
          </Text>
          <Text style={styles.sortMetaText}>{resultCount} results</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  hero: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing["3xl"],
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  titleRow: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 21,
    fontWeight: "900",
    color: colors.textInverse,
  },
  subtitle: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.88)",
  },
  sortButton: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  sortButtonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
  searchBar: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    flex: 1,
    ...typography.caption,
    padding: 0,
    color: colors.text,
    fontWeight: "600",
  },
  filterShell: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterRow: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: "rgba(14,165,233,0.32)",
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
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
    fontWeight: "800",
    color: colors.primaryDark,
  },
  filterChipTextActive: {
    color: colors.textInverse,
  },
  sortMetaRow: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sortMetaText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8090B5",
  },
  sortMetaStrong: {
    color: colors.text,
    fontWeight: "900",
  },
});
