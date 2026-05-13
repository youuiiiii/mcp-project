import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

import { getIncidentDisplayMeta, getIncidentMeta } from "../constants/incident";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/layout";
import { typography } from "../theme/typography";
import { IncidentReport } from "../types/incident";
import AppCard from "./ui/AppCard";
import IconBadge from "./ui/IconBadge";
import StatusBadge, { StatusBadgeVariant } from "./ui/StatusBadge";

type AppIconName = keyof typeof Ionicons.glyphMap;

type IncidentCardProps = {
  incident: IncidentReport;
  onPress?: (incident: IncidentReport) => void;
  showImage?: boolean;
};

export default function IncidentCard({
  incident,
  onPress,
  showImage = true,
}: IncidentCardProps) {
  const meta = getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });
  const incidentIcon = getIncidentIcon(incident);

  return (
    <AppCard
      onPress={onPress ? () => onPress(incident) : undefined}
      style={styles.card}
    >
      <View style={styles.header}>
        <IconBadge
          variant="neutral"
          size="lg"
          rounded={false}
          style={{
            backgroundColor: meta.lightColor,
          }}
        >
          <Ionicons name={incidentIcon} size={24} color={meta.color} />
        </IconBadge>

        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={1}>
            {incident.title || "Untitled incident"}
          </Text>

          <Text style={styles.category} numberOfLines={1}>
            {meta.label}
          </Text>
        </View>

        <StatusBadge
          label={getStatusLabel(incident.status)}
          variant={getStatusVariant(incident.status)}
          size="sm"
        />
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {incident.description || "Tidak ada deskripsi."}
      </Text>

      {showImage && incident.imageUri ? (
        <Image source={{ uri: incident.imageUri }} style={styles.image} />
      ) : null}

      <View style={styles.footer}>
        <StatusBadge
          label={getSeverityLabel(incident.severity)}
          variant={getSeverityVariant(incident.severity)}
          size="sm"
        />

        <View style={styles.dateWrap}>
          <Ionicons name="time-outline" size={14} color={colors.textSoft} />
          <Text style={styles.date} numberOfLines={1}>
            {formatDate(incident.createdAt)}
          </Text>
        </View>
      </View>
    </AppCard>
  );
}

function formatDate(date?: Date) {
  if (!date) {
    return "Waktu tidak tersedia";
  }

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusLabel(status: IncidentReport["status"]) {
  if (status === "active") {
    return "Active";
  }

  if (status === "resolved") {
    return "Resolved";
  }

  return String(status);
}

function getStatusVariant(status: IncidentReport["status"]): StatusBadgeVariant {
  if (status === "active") {
    return "active";
  }

  if (status === "resolved") {
    return "resolved";
  }

  return "neutral";
}

function getSeverityLabel(severity: IncidentReport["severity"]) {
  if (severity === "high") {
    return "High";
  }

  if (severity === "medium") {
    return "Medium";
  }

  return "Low";
}

function getSeverityVariant(
  severity: IncidentReport["severity"]
): StatusBadgeVariant {
  if (severity === "high") {
    return "danger";
  }

  if (severity === "medium") {
    return "warning";
  }

  return "success";
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
    borderRadius: radius["2xl"],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
  },
  category: {
    marginTop: 3,
    ...typography.caption,
    color: colors.textMuted,
  },
  description: {
    marginTop: spacing.md,
    ...typography.caption,
    color: "#475569",
  },
  image: {
    marginTop: spacing.md,
    width: "100%",
    height: 150,
    borderRadius: radius.lg,
    backgroundColor: colors.border,
  },
  footer: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  dateWrap: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 5,
  },
  date: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSoft,
  },
});