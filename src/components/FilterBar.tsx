import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import {
  INCIDENT_CATEGORY_OPTIONS,
  getIncidentCategoryMeta,
  isIncidentCategory,
} from "../constants/incident";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/layout";
import { typography } from "../theme/typography";
import { IncidentCategory } from "../types/incident";

export type MapFilterValue = "all" | "active" | "resolved" | IncidentCategory;

type AppIconName = keyof typeof Ionicons.glyphMap;

type FilterBarProps = {
  selectedFilter: MapFilterValue;
  onChange: (value: MapFilterValue) => void;
};

type StaticFilter = {
  value: MapFilterValue;
  label: string;
  iconName: AppIconName;
  color: string;
  lightColor: string;
};

const STATIC_FILTERS: StaticFilter[] = [
  {
    value: "all",
    label: "Semua",
    iconName: "globe",
    color: "#0F766E",
    lightColor: "#CCFBF1",
  },
  {
    value: "active",
    label: "Aktif",
    iconName: "radio",
    color: colors.danger,
    lightColor: colors.dangerSoft,
  },
  {
    value: "resolved",
    label: "Selesai",
    iconName: "checkmark-circle",
    color: colors.success,
    lightColor: colors.successSoft,
  },
];

export default function FilterBar({
  selectedFilter,
  onChange,
}: FilterBarProps) {
  const activeCategory = isIncidentCategory(selectedFilter)
    ? getIncidentCategoryMeta(selectedFilter)
    : null;

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {STATIC_FILTERS.map((item) => {
          const active = selectedFilter === item.value;

          return (
            <FilterChip
              key={item.value}
              label={item.label}
              iconName={item.iconName}
              active={active}
              color={item.color}
              lightColor={item.lightColor}
              onPress={() => onChange(item.value)}
            />
          );
        })}

        {INCIDENT_CATEGORY_OPTIONS.map((item) => {
          const active = selectedFilter === item.value;

          return (
            <FilterChip
              key={item.value}
              label={item.shortLabel}
              iconName={item.iconName}
              active={active}
              color={item.color}
              lightColor={item.lightColor}
              onPress={() => onChange(item.value)}
            />
          );
        })}
      </ScrollView>

      {activeCategory ? (
        <View
          style={[
            styles.categoryInfo,
            {
              backgroundColor: activeCategory.lightColor,
              borderColor: activeCategory.color,
            },
          ]}
        >
          <Ionicons
            name={activeCategory.iconName}
            size={18}
            color={activeCategory.color}
          />

          <View style={styles.categoryInfoTextGroup}>
            <Text
              style={[
                styles.categoryInfoTitle,
                {
                  color: activeCategory.color,
                },
              ]}
            >
              {activeCategory.label}
            </Text>

            <Text style={styles.categoryInfoDescription}>
              {activeCategory.description}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function FilterChip({
  label,
  iconName,
  active,
  color,
  lightColor,
  onPress,
}: {
  label: string;
  iconName: AppIconName;
  active: boolean;
  color: string;
  lightColor: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        active && {
          backgroundColor: lightColor,
          borderColor: color,
        },
        pressed && styles.buttonPressed,
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          active && {
            backgroundColor: color,
          },
        ]}
      >
        <Ionicons
          name={iconName}
          size={20}
          color={active ? colors.textInverse : color}
        />
      </View>

      <Text
        numberOfLines={1}
        style={[
          styles.label,
          active && {
            color,
            fontWeight: "900",
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  container: {
    gap: spacing.sm,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  button: {
    minWidth: 92,
    maxWidth: 116,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
    color: "#475569",
    textAlign: "center",
    lineHeight: 14,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  categoryInfoTextGroup: {
    flex: 1,
  },
  categoryInfoTitle: {
    ...typography.label,
  },
  categoryInfoDescription: {
    marginTop: 4,
    ...typography.caption,
    color: "#475569",
  },
});