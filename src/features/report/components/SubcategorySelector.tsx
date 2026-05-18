import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import SectionHeader from "../../../components/ui/SectionHeader";
import { getSubcategoriesByCategory } from "../../../constants/incident";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import type { IncidentCategory, IncidentSubcategory } from "../../../types/incident";

type SubcategorySelectorProps = {
  category: IncidentCategory;
  selectedSubcategory: IncidentSubcategory | null;
  disabled?: boolean;
  onSelectSubcategory: (subcategory: IncidentSubcategory) => void;
};

export default function SubcategorySelector({
  category,
  selectedSubcategory,
  disabled = false,
  onSelectSubcategory,
}: SubcategorySelectorProps) {
  const options = getSubcategoriesByCategory(category);

  if (options.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionHeader
        title="2. Subcategory"
        subtitle="Choose a more specific incident type when useful."
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {options.map((item) => {
          const active = selectedSubcategory === item.value;

          return (
            <Pressable
              key={item.value}
              disabled={disabled}
              onPress={() => onSelectSubcategory(item.value)}
              style={({ pressed }) => [
                styles.chip,
                active && { borderColor: item.color, backgroundColor: item.lightColor },
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.chipIcon, { backgroundColor: active ? item.color : colors.surfaceMuted }]}>
                <Ionicons
                  name={item.iconName}
                  size={16}
                  color={active ? colors.textInverse : item.color}
                />
              </View>
              <Text style={[styles.chipLabel, active && { color: item.color }]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  scrollContent: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  chipIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
});
