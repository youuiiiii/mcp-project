import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/layout";

export type MapFilterValue =
  | "all"
  | "natural_disaster"
  | "fire_emergency"
  | "accident_infrastructure"
  | "medical_rescue"
  | "security_public_order";

type AppIconName = keyof typeof Ionicons.glyphMap;

type FilterBarProps = {
  selectedFilter: MapFilterValue;
  onChange: (value: MapFilterValue) => void;
};

type FilterItem = {
  value: MapFilterValue;
  label: string;
  iconName: AppIconName;
};

const MAP_FILTERS: FilterItem[] = [
  { value: "all", label: "All", iconName: "layers" },
  { value: "natural_disaster", label: "Nature", iconName: "thunderstorm-outline" },
  { value: "fire_emergency", label: "Fire", iconName: "flame-outline" },
  { value: "accident_infrastructure", label: "Accident", iconName: "car-outline" },
  { value: "medical_rescue", label: "Medical", iconName: "medkit-outline" },
  { value: "security_public_order", label: "Security", iconName: "shield-half-outline" },
];

export default function FilterBar({ selectedFilter, onChange }: FilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {MAP_FILTERS.map((item) => {
        const active = selectedFilter === item.value;

        return (
          <Pressable
            key={item.value}
            onPress={() => onChange(item.value)}
            style={({ pressed }) => [
              styles.chip,
              active && styles.chipActive,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name={item.iconName}
              size={15}
              color={active ? colors.textInverse : colors.primaryContainer}
            />
            <Text style={[styles.label, active && styles.labelActive]}>
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
    paddingVertical: spacing.sm,
  },
  chip: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: "rgba(14, 165, 233, 0.28)",
  },
  chipActive: {
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primaryContainer,
  },
  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primaryContainer,
  },
  labelActive: {
    color: colors.textInverse,
  },
});
