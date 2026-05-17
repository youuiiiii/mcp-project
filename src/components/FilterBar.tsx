import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  INCIDENT_CATEGORY_OPTIONS,
  isIncidentCategory,
} from "../constants/incident";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/layout";
import type { IncidentCategory } from "../types/incident";

export type MapFilterValue = "all" | "active" | "resolved" | IncidentCategory;

type AppIconName = keyof typeof Ionicons.glyphMap;

type FilterBarProps = {
  selectedFilter: MapFilterValue;
  onChange: (value: MapFilterValue) => void;
};

type FilterItem = {
  value: MapFilterValue;
  label: string;
  iconName: AppIconName;
  color: string;
};

const STATIC_FILTERS: FilterItem[] = [
  { value: "all", label: "All", iconName: "globe", color: colors.dark },
  { value: "active", label: "Active", iconName: "radio", color: colors.danger },
  { value: "resolved", label: "Resolved", iconName: "checkmark-circle", color: colors.success },
];

export default function FilterBar({ selectedFilter, onChange }: FilterBarProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const selectedCategory = isIncidentCategory(selectedFilter)
    ? INCIDENT_CATEGORY_OPTIONS.find((c) => c.value === selectedFilter)
    : null;

  const handleSelectCategory = (value: IncidentCategory) => {
    onChange(value);
    setDropdownVisible(false);
  };

  const handleClearCategory = () => {
    onChange("all");
    setDropdownVisible(false);
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {STATIC_FILTERS.map((item) => {
          const active = selectedFilter === item.value;
          return (
            <Pressable
              key={item.value}
              onPress={() => onChange(item.value)}
              style={({ pressed }) => [
                styles.chip,
                active && { backgroundColor: item.color, borderColor: item.color },
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name={item.iconName}
                size={15}
                color={active ? colors.textInverse : item.color}
              />
              <Text style={[styles.label, active && { color: colors.textInverse }]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}

        {/* Dropdown trigger */}
        <Pressable
          onPress={() => setDropdownVisible(true)}
          style={({ pressed }) => [
            styles.chip,
            selectedCategory && {
              backgroundColor: selectedCategory.color,
              borderColor: selectedCategory.color,
            },
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name={selectedCategory ? selectedCategory.iconName : "filter"}
            size={15}
            color={selectedCategory ? colors.textInverse : colors.text}
          />
          <Text style={[styles.label, selectedCategory && { color: colors.textInverse }]}>
            {selectedCategory ? selectedCategory.shortLabel : "Category"}
          </Text>
          <Ionicons
            name="chevron-down"
            size={13}
            color={selectedCategory ? colors.textInverse : colors.text}
          />
        </Pressable>
      </ScrollView>

      {/* Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setDropdownVisible(false)}>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownTitle}>Filter by Category</Text>

            <TouchableOpacity
              style={[styles.dropdownItem, !selectedCategory && styles.dropdownItemActive]}
              onPress={handleClearCategory}
            >
              <Ionicons name="globe" size={18} color={colors.dark} />
              <Text style={styles.dropdownItemLabel}>All Categories</Text>
              {!selectedCategory && (
                <Ionicons name="checkmark" size={16} color={colors.dark} />
              )}
            </TouchableOpacity>

            {INCIDENT_CATEGORY_OPTIONS.map((item) => {
              const active = selectedFilter === item.value;
              return (
                <TouchableOpacity
                  key={item.value}
                  style={[styles.dropdownItem, active && { backgroundColor: item.lightColor }]}
                  onPress={() => handleSelectCategory(item.value)}
                >
                  <Ionicons name={item.iconName} size={18} color={item.color} />
                  <Text style={[styles.dropdownItemLabel, active && { color: item.color }]}>
                    {item.label}
                  </Text>
                  {active && (
                    <Ionicons name="checkmark" size={16} color={item.color} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  chip: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.text,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-start",
    paddingTop: 160,
    paddingHorizontal: spacing.lg,
  },
  dropdown: {
    backgroundColor: colors.background,
    borderRadius: radius["2xl"],
    padding: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  dropdownTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.textMuted,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
  },
  dropdownItemActive: {
    backgroundColor: colors.surfaceMuted,
  },
  dropdownItemLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
});