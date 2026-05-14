import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "../../../components/ui/AppCard";
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
        title="1. Kategori"
        subtitle="Pilih jenis kejadian utama. Detailnya cukup dijelaskan di judul dan deskripsi."
      />

      <View style={styles.grid}>
        {INCIDENT_CATEGORY_OPTIONS.map((item) => {
          const active = selectedCategory === item.value;

          return (
            <AppCard
              key={item.value}
              padding="sm"
              onPress={disabled ? undefined : () => onSelectCategory(item.value)}
              style={[
                styles.card,
                active && {
                  backgroundColor: item.lightColor,
                  borderColor: item.color,
                },
              ]}
            >
              <View
                style={[
                  styles.iconBox,
                  active && {
                    backgroundColor: item.color,
                  },
                ]}
              >
                <Ionicons
                  name={item.iconName}
                  size={22}
                  color={active ? colors.textInverse : item.color}
                />
              </View>

              <Text
                numberOfLines={2}
                style={[
                  styles.label,
                  active && {
                    color: item.color,
                  },
                ]}
              >
                {item.label}
              </Text>
            </AppCard>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  card: {
    width: "48.7%",
    minHeight: 112,
    justifyContent: "space-between",
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: spacing.md,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800",
    color: colors.text,
  },
});