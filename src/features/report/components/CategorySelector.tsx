import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import SectionHeader from "../../../components/ui/SectionHeader";
import { INCIDENT_CATEGORY_OPTIONS } from "../../../constants/incident";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";
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
        title="1. Tema Kejadian"
        subtitle="Pilih kategori besar. Detail spesifik cukup ditulis di judul dan deskripsi."
      />

      <View style={styles.list}>
        {INCIDENT_CATEGORY_OPTIONS.map((item) => {
          const active = selectedCategory === item.value;

          return (
            <AppCard
              key={item.value}
              onPress={disabled ? undefined : () => onSelectCategory(item.value)}
              style={[
                styles.card,
                active && {
                  borderColor: item.color,
                  backgroundColor: item.lightColor,
                },
              ]}
            >
              <IconBadge
                variant="neutral"
                size="lg"
                rounded={false}
                style={{
                  backgroundColor: active ? item.color : colors.surfaceMuted,
                }}
              >
                <Ionicons
                  name={item.iconName}
                  size={24}
                  color={active ? colors.textInverse : item.color}
                />
              </IconBadge>

              <View style={styles.content}>
                <Text
                  style={[
                    styles.title,
                    active && {
                      color: item.color,
                    },
                  ]}
                >
                  {item.label}
                </Text>

                <Text style={styles.description}>{item.description}</Text>
              </View>

              {active ? (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={item.color}
                />
              ) : null}
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
  list: {
    gap: spacing.md,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
  },
  description: {
    marginTop: 4,
    ...typography.caption,
    color: colors.textMuted,
  },
});