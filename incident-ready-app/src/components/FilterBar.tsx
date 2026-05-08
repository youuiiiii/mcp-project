import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  INCIDENT_CATEGORY_OPTIONS,
  getCategoryBySubcategory,
  getIncidentCategoryMeta,
  getSubcategoriesByCategory,
  isIncidentCategory,
  isIncidentType,
} from "../constants/incident";
import {
  IncidentCategory,
  IncidentSubcategory,
  IncidentType,
} from "../types/incident";

export type MapFilterValue =
  | "all"
  | "active"
  | "resolved"
  | IncidentCategory
  | IncidentType;

type FilterBarProps = {
  selectedFilter: MapFilterValue;
  onChange: (value: MapFilterValue) => void;
};

const STATIC_FILTERS: {
  value: MapFilterValue;
  label: string;
  icon: string;
  color: string;
  lightColor: string;
}[] = [
  {
    value: "all",
    label: "Semua",
    icon: "🌐",
    color: "#0F766E",
    lightColor: "#CCFBF1",
  },
  {
    value: "active",
    label: "Aktif",
    icon: "🚨",
    color: "#DC2626",
    lightColor: "#FEE2E2",
  },
  {
    value: "resolved",
    label: "Selesai",
    icon: "✅",
    color: "#16A34A",
    lightColor: "#DCFCE7",
  },
];

const getActiveCategory = (
  selectedFilter: MapFilterValue
): IncidentCategory | null => {
  if (isIncidentCategory(selectedFilter)) {
    return selectedFilter;
  }

  if (isIncidentType(selectedFilter)) {
    return getCategoryBySubcategory(selectedFilter as IncidentSubcategory);
  }

  return null;
};

export default function FilterBar({ selectedFilter, onChange }: FilterBarProps) {
  const activeCategory = getActiveCategory(selectedFilter);

  const subcategoryOptions = activeCategory
    ? getSubcategoriesByCategory(activeCategory)
    : [];

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
            <Pressable
              key={item.value}
              onPress={() => onChange(item.value)}
              style={({ pressed }) => [
                styles.button,
                active && {
                  backgroundColor: item.lightColor,
                  borderColor: item.color,
                },
                pressed && styles.buttonPressed,
              ]}
            >
              <View
                style={[
                  styles.iconCircle,
                  active && {
                    backgroundColor: item.color,
                  },
                ]}
              >
                <Text style={styles.icon}>{item.icon}</Text>
              </View>

              <Text
                numberOfLines={1}
                style={[
                  styles.label,
                  active && {
                    color: item.color,
                    fontWeight: "900",
                  },
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}

        {INCIDENT_CATEGORY_OPTIONS.map((item) => {
          const active =
            selectedFilter === item.value || activeCategory === item.value;

          return (
            <Pressable
              key={item.value}
              onPress={() => onChange(item.value)}
              style={({ pressed }) => [
                styles.button,
                active && {
                  backgroundColor: item.lightColor,
                  borderColor: item.color,
                },
                pressed && styles.buttonPressed,
              ]}
            >
              <View
                style={[
                  styles.iconCircle,
                  active && {
                    backgroundColor: item.color,
                  },
                ]}
              >
                <Text style={styles.icon}>{item.icon}</Text>
              </View>

              <Text
                numberOfLines={2}
                style={[
                  styles.label,
                  active && {
                    color: item.color,
                    fontWeight: "900",
                  },
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {activeCategory ? (
        <View style={styles.subcategorySection}>
          <Text style={styles.subcategoryTitle}>
            Subkategori {getIncidentCategoryMeta(activeCategory).label}
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subcategoryContainer}
          >
            <Pressable
              onPress={() => onChange(activeCategory)}
              style={({ pressed }) => [
                styles.subcategoryButton,
                selectedFilter === activeCategory && {
                  backgroundColor: getIncidentCategoryMeta(activeCategory).color,
                  borderColor: getIncidentCategoryMeta(activeCategory).color,
                },
                pressed && styles.buttonPressed,
              ]}
            >
              <Text
                style={[
                  styles.subcategoryText,
                  selectedFilter === activeCategory &&
                    styles.subcategoryTextActive,
                ]}
              >
                Semua
              </Text>
            </Pressable>

            {subcategoryOptions.map((item) => {
              const active = selectedFilter === item.value;

              return (
                <Pressable
                  key={item.value}
                  onPress={() => onChange(item.value)}
                  style={({ pressed }) => [
                    styles.subcategoryButton,
                    active && {
                      backgroundColor: item.color,
                      borderColor: item.color,
                    },
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.subcategoryIcon}>{item.icon}</Text>

                  <Text
                    numberOfLines={1}
                    style={[
                      styles.subcategoryText,
                      active && styles.subcategoryTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
  },
  container: {
    gap: 10,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  button: {
    minWidth: 92,
    maxWidth: 130,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
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
    borderRadius: 19,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
    color: "#475569",
    textAlign: "center",
    lineHeight: 14,
  },
  subcategorySection: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    padding: 10,
  },
  subcategoryTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 8,
  },
  subcategoryContainer: {
    gap: 8,
  },
  subcategoryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  subcategoryIcon: {
    fontSize: 15,
  },
  subcategoryText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#475569",
    maxWidth: 150,
  },
  subcategoryTextActive: {
    color: "#FFFFFF",
  },
});