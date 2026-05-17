import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import {
  getIncidentCategoryMeta,
  getIncidentDisplayMeta,
} from "../../../constants/incident";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";
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
    <AppCard style={styles.card}>
      <IconBadge
        variant="neutral"
        size="lg"
        rounded={false}
        style={{
          backgroundColor: meta.lightColor,
        }}
      >
        <Ionicons
          name={getIncidentIcon(incident)}
          size={24}
          color={meta.color}
        />
      </IconBadge>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {incident.title}
        </Text>

        <Text style={styles.type} numberOfLines={1}>
          {categoryMeta.label} - {meta.label}
        </Text>

        <Text style={styles.description} numberOfLines={3}>
          {incident.description || "Tidak ada deskripsi."}
        </Text>
      </View>
    </AppCard>
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
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
  },
  type: {
    marginTop: 3,
    ...typography.caption,
    color: colors.textMuted,
  },
  description: {
    marginTop: spacing.sm,
    ...typography.caption,
    color: "#475569",
  },
});
