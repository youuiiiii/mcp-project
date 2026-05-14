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
  value: IncidentCategory | null;
  onChange: (value: IncidentCategory) => void;
};

export default function CategorySelector({
  value,
  onChange,
}: CategorySelectorProps) {
  const selectedCategoryMeta =
    INCIDENT_CATEGORY_OPTIONS.find((item) => item.value === value) ?? null;

  return (
    <View style={styles.section}>
      <SectionHeader
        title="1. Tema Kejadian"
        subtitle="Pilih kategori besar. Detail spesifik cukup ditulis di judul dan deskripsi."
        style={styles.sectionHeader}
      />

      <View style={styles.categoryList}>
        {INCIDENT_CATEGORY_OPTIONS.map((item) => {
          const active = value === item.value;

          return (
            <AppCard
              key={item.value}
              onPress={() => onChange(item.value)}
              padding="md"
              style={[
                styles.categoryCard,
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

              <View style={styles.categoryContent}>
                <Text
                  style={[
                    styles.categoryTitle,
                    active && {
                      color: item.color,
                    },
                  ]}
                >
                  {item.label}
                </Text>

                <Text style={styles.categoryDescription}>
                  {item.description}
                </Text>
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

      {selectedCategoryMeta ? (
        <AppCard
          variant="muted"
          style={[
            styles.categoryInfoCard,
            {
              backgroundColor: selectedCategoryMeta.lightColor,
              borderColor: selectedCategoryMeta.color,
            },
          ]}
        >
          <Text
            style={[
              styles.categoryInfoTitle,
              {
                color: selectedCategoryMeta.color,
              },
            ]}
          >
            {selectedCategoryMeta.label}
          </Text>

          <Text style={styles.categoryInfoText}>
            Gunakan judul dan deskripsi untuk menjelaskan detail kejadian tanpa
            memilih subkategori tambahan.
          </Text>
        </AppCard>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    marginBottom: 0,
  },
  categoryList: {
    gap: spacing.md,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
  },
  categoryDescription: {
    marginTop: 4,
    ...typography.caption,
    color: colors.textMuted,
  },
  categoryInfoCard: {
    gap: spacing.xs,
  },
  categoryInfoTitle: {
    fontSize: 14,
    fontWeight: "900",
  },
  categoryInfoText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});