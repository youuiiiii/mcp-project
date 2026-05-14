import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

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
  {
    value: "all",
    label: "Semua",
    iconName: "globe",
    color: colors.dark,
  },
  {
    value: "active",
    label: "Aktif",
    iconName: "radio",
    color: colors.danger,
  },
  {
    value: "resolved",
    label: "Selesai",
    iconName: "checkmark-circle",
    color: colors.success,
  },
];

export default function FilterBar({
  selectedFilter,
  onChange,
}: FilterBarProps) {
  const items: FilterItem[] = [
    ...STATIC_FILTERS,
    ...INCIDENT_CATEGORY_OPTIONS.map((item) => ({
      value: item.value,
      label: item.shortLabel,
      iconName: item.iconName,
      color: item.color,
    })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {items.map((item) => {
        const active = selectedFilter === item.value;
        const categoryActive = isIncidentCategory(item.value) && active;

        return (
          <Pressable
            key={item.value}
            onPress={() => onChange(item.value)}
            style={({ pressed }) => [
              styles.chip,
              active && {
                backgroundColor: item.color,
                borderColor: item.color,
              },
              categoryActive && styles.categoryActive,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name={item.iconName}
              size={15}
              color={active ? colors.textInverse : item.color}
            />

            <Text
              numberOfLines={1}
              style={[
                styles.label,
                active && {
                  color: colors.textInverse,
                },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
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
  categoryActive: {
    shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
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
});