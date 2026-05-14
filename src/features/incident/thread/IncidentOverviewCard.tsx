import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import StatusBadge from "../../../components/ui/StatusBadge";
import { getIncidentDisplayMeta } from "../../../constants/incident";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";
import type { IncidentReport } from "../../../types/incident";
import {
  formatIncidentDate,
  getStatusLabel,
  getStatusVariant,
} from "./threadLabels";

type IncidentOverviewCardProps = {
  incident: IncidentReport;
};

export default function IncidentOverviewCard({
  incident,
}: IncidentOverviewCardProps) {
  const meta = getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });

  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <IconBadge
          variant="neutral"
          size="lg"
          rounded={false}
          style={{
            backgroundColor: meta.lightColor,
          }}
        >
          <Ionicons name={meta.iconName} size={24} color={meta.color} />
        </IconBadge>

        <View style={styles.titleGroup}>
          <Text style={styles.title} numberOfLines={2}>
            {incident.title}
          </Text>

          <Text style={styles.metaText} numberOfLines={1}>
            {meta.label}
          </Text>
        </View>

        <StatusBadge
          label={getStatusLabel(incident.status)}
          variant={getStatusVariant(incident.status)}
          size="sm"
        />
      </View>

      <View style={styles.badgeRow}>
        <StatusBadge
          label={getSeverityLabel(incident.severity)}
          variant={getSeverityVariant(incident.severity)}
          size="sm"
        />
      </View>

      <Text style={styles.description}>
        {incident.description || "Tidak ada deskripsi."}
      </Text>

      {incident.imageUri ? (
        <Image source={{ uri: incident.imageUri }} style={styles.image} />
      ) : null}

      <View style={styles.infoBox}>
        <InfoLine
          iconName="person-outline"
          text={`Pelapor: ${incident.reportedBy || "Anonymous"}`}
        />

        <InfoLine
          iconName="time-outline"
          text={`Dibuat: ${formatIncidentDate(incident.createdAt)}`}
        />
      </View>
    </AppCard>
  );
}

function InfoLine({
  iconName,
  text,
}: {
  iconName: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.infoLine}>
      <Ionicons name={iconName} size={15} color={colors.textMuted} />
      <Text style={styles.infoText} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

function getSeverityLabel(severity: IncidentReport["severity"]) {
  if (severity === "high") {
    return "Tinggi";
  }

  if (severity === "medium") {
    return "Sedang";
  }

  return "Rendah";
}

function getSeverityVariant(
  severity: IncidentReport["severity"]
): "success" | "warning" | "danger" {
  if (severity === "high") {
    return "danger";
  }

  if (severity === "medium") {
    return "warning";
  }

  return "success";
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  titleGroup: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "800",
    color: colors.text,
  },
  metaText: {
    marginTop: 3,
    ...typography.caption,
    color: colors.textMuted,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
    color: "#475569",
  },
  image: {
    width: "100%",
    height: 190,
    borderRadius: radius.xl,
    backgroundColor: colors.border,
  },
  infoBox: {
    gap: spacing.xs,
  },
  infoLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
  },
});