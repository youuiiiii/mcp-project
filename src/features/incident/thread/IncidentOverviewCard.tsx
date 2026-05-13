import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import StatusBadge from "../../../components/ui/StatusBadge";
import { getIncidentCategoryMeta, getIncidentDisplayMeta } from "../../../constants/incident";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";
import type { IncidentReport } from "../../../types/incident";
import { getIncidentExpiryMessage } from "../../../utils/incidentExpiry";
import IncidentTrustBadge from "../../../components/IncidentTrustBadge";
import IncidentUrgencyBadge from "../../../components/IncidentUrgencyBadge";
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

  const categoryMeta = getIncidentCategoryMeta(incident.category);

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

        <View style={styles.headerInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {incident.title}
          </Text>

          <Text style={styles.type} numberOfLines={1}>
            {categoryMeta.label}
            {meta.label !== categoryMeta.label ? ` • ${meta.label}` : ""}
          </Text>
        </View>

        <StatusBadge
          label={getStatusLabel(incident.status)}
          variant={getStatusVariant(incident.status)}
          size="sm"
        />
      </View>

      <Text style={styles.description}>{incident.description}</Text>

      <View style={styles.compactBadgeRow}>
        <IncidentTrustBadge incident={incident} variant="compact" />
        <IncidentUrgencyBadge incident={incident} variant="compact" />
      </View>

      <AppCard variant="muted" padding="sm" style={styles.expiryBox}>
        <View style={styles.expiryHeader}>
          <Ionicons name="sync-circle" size={18} color={colors.info} />
          <Text style={styles.expiryTitle}>Status Update Otomatis</Text>
        </View>

        <Text style={styles.expiryText}>
          {getIncidentExpiryMessage(incident)}
        </Text>
      </AppCard>

      {incident.imageUri ? (
        <Image source={{ uri: incident.imageUri }} style={styles.image} />
      ) : null}

      <View style={styles.metaBox}>
        <InfoLine
          icon="person"
          label={`Pelapor: ${incident.reportedBy || "Anonymous"}`}
        />
        <InfoLine
          icon="time"
          label={`Dibuat: ${formatIncidentDate(incident.createdAt)}`}
        />
      </View>
    </AppCard>
  );
}

function InfoLine({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.infoLine}>
      <Ionicons name={icon} size={14} color={colors.textSoft} />
      <Text style={styles.metaText} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
  },
  type: {
    marginTop: 3,
    ...typography.caption,
    color: colors.textMuted,
  },
  description: {
    ...typography.caption,
    color: "#475569",
  },
  compactBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  expiryBox: {
    gap: spacing.xs,
  },
  expiryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  expiryTitle: {
    ...typography.label,
    color: colors.text,
  },
  expiryText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  image: {
    width: "100%",
    height: 210,
    borderRadius: radius.xl,
    backgroundColor: colors.border,
  },
  metaBox: {
    gap: spacing.xs,
  },
  infoLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSoft,
  },
});