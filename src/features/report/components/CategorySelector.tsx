import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import SectionHeader from "../../../components/ui/SectionHeader";
import { INCIDENT_CATEGORY_OPTIONS } from "../../../constants/incident";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import type { IncidentCategory } from "../../../types/incident";

type CategorySelectorProps = {
  selectedCategory: IncidentCategory | null;
  disabled?: boolean;
  onSelectCategory: (category: IncidentCategory) => void;
};

export default function CategorySelector({
  selectedCategory,
  disabled = false,
  onSelectCategory,
}: CategorySelectorProps) {
  return (
    <View style={styles.section}>
      <SectionHeader
        title="1. Category"
        subtitle="Choose the main type of incident."
      />

      <View style={styles.list}>
        {INCIDENT_CATEGORY_OPTIONS.map((item) => {
          const active = selectedCategory === item.value;

          return (
            <Pressable
              key={item.value}
              disabled={disabled}
              onPress={() => onSelectCategory(item.value)}
              style={({ pressed }) => [
                styles.row,
                active && {
                  borderColor: item.color,
                  backgroundColor: item.lightColor,
                },
                pressed && styles.pressed,
              ]}
            >
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: active ? item.color : colors.surfaceMuted,
                  },
                ]}
              >
                <Ionicons
                  name={item.iconName}
                  size={21}
                  color={active ? colors.textInverse : item.color}
                />
              </View>

              <View style={styles.textGroup}>
                <Text
                  style={[
                    styles.label,
                    active && {
                      color: item.color,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>

                <Text style={styles.description} numberOfLines={1}>
                  {item.shortLabel || item.label}
                </Text>
              </View>

              <Ionicons
                name={active ? "checkmark-circle" : "ellipse-outline"}
                size={21}
                color={active ? item.color : colors.textSoft}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  list: {
    gap: spacing.sm,
  },
  row: {
    minHeight: 68,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  textGroup: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  description: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
  },
});
