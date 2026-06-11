import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import {
  getIncidentCategoryMeta,
  getIncidentDisplayMeta,
} from "../../../constants/incident";
import { colors } from "../../../theme/colors";
import { radius, shadow, spacing } from "../../../theme/layout";
import type { IncidentReport } from "../../../types/incident";

type AppIconName = keyof typeof Ionicons.glyphMap;

type IncidentPreviewCardProps = {
  incident: IncidentReport;
};

export default function IncidentPreviewCard({
  incident,
}: IncidentPreviewCardProps) {
  const meta = getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });
  const categoryMeta = getIncidentCategoryMeta(incident.category);

  return (
    <View style={styles.card}>
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor: meta.color,
          },
        ]}
      >
        <Ionicons
          name={getIncidentIcon(incident)}
          size={24}
          color={colors.textInverse}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {incident.title}
        </Text>

        <Text style={styles.type} numberOfLines={1}>
          {categoryMeta.label.toUpperCase()} — {meta.label.toUpperCase()}
        </Text>

        {incident.description && !incident.description.includes("reported near the selected map pin") && !incident.description.includes("No additional impact") ? (
          <Text style={styles.description} numberOfLines={3}>
            {incident.description}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function getIncidentIcon(report: IncidentReport): AppIconName {
  const type = report.subcategory ?? report.type;

  switch (type) {
    case "flood":
      return "water";
    case "earthquake":
      return "pulse";
    case "landslide":
    case "collapsed_building":
      return "trail-sign";
    case "volcanic_eruption":
      return "flame";
    case "strong_wind":
      return "cloudy";
    case "tsunami":
      return "radio";
    case "fire":
    case "building_fire":
    case "vehicle_fire":
    case "land_fire":
    case "electrical_fire":
      return "flame";
    case "traffic_accident":
      return "car-sport";
    case "fallen_tree":
      return "leaf";
    case "road_block":
    case "damaged_road":
      return "construct";
    case "fallen_power_line":
      return "flash";
    case "crime":
    case "theft":
      return "shield";
    case "brawl":
    case "risky_crowd":
    case "mob_violence":
    case "public_disturbance":
      return "people";
    case "medical":
    case "fainted_person":
    case "work_accident":
    case "drowning":
    case "evacuation_needed":
      return "medkit";
    default:
      return "alert-circle";
  }
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: 0.5,
  },
  type: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  description: {
    marginTop: spacing.sm,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSoft,
  },
});
