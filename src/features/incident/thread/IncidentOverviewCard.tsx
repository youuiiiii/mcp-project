import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

import IncidentTrustBadge from "../../../components/IncidentTrustBadge";
import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import StatusBadge from "../../../components/ui/StatusBadge";
import {
  getIncidentCategoryMeta,
  getIncidentDisplayMeta,
} from "../../../constants/incident";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";
import type { IncidentReport, IncidentSeverity } from "../../../types/incident";
import { getIncidentFreshnessMeta } from "../../../utils/incidentFreshness";
import {
  formatIncidentDate,
  getStatusLabel,
  getStatusVariant,
} from "./threadLabels";

type IncidentOverviewCardProps = {
  incident: IncidentReport;
};

type SeverityBadgeVariant = "success" | "warning" | "danger";

const SEVERITY_LABEL_BY_VALUE = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
} as const satisfies Record<IncidentSeverity, string>;

const SEVERITY_VARIANT_BY_VALUE = {
  low: "success",
  medium: "warning",
  high: "danger",
} as const satisfies Record<IncidentSeverity, SeverityBadgeVariant>;

export default function IncidentOverviewCard({
  incident,
}: IncidentOverviewCardProps) {
  const displayMeta = getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });

  const categoryMeta = getIncidentCategoryMeta(incident.category);
  const freshness = getIncidentFreshnessMeta(incident);
  const shouldShowFreshnessNotice = freshness.state === "stale";

  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <IconBadge
          variant="neutral"
          size="lg"
          rounded={false}
          style={{
            backgroundColor: displayMeta.lightColor,
          }}
        >
          <Ionicons
            name={displayMeta.iconName}
            size={24}
            color={displayMeta.color}
          />
        </IconBadge>

        <View style={styles.headerInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {incident.title}
          </Text>

          <Text style={styles.categoryText} numberOfLines={1}>
            {categoryMeta.label}
            {displayMeta.label !== categoryMeta.label
              ? ` • ${displayMeta.label}`
              : ""}
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

        <StatusBadge
          label={SEVERITY_LABEL_BY_VALUE[incident.severity]}
          variant={SEVERITY_VARIANT_BY_VALUE[incident.severity]}
          size="sm"
        />
      </View>

      {shouldShowFreshnessNotice ? (
        <AppCard variant="muted" padding="sm" style={styles.freshnessBox}>
          <View style={styles.freshnessHeader}>
            <Ionicons name="alert-circle" size={18} color={colors.info} />
            <Text style={styles.freshnessTitle}>Perlu Update Kondisi</Text>
          </View>

          <Text style={styles.freshnessText}>{freshness.message}</Text>
        </AppCard>
      ) : null}

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
  categoryText: {
    marginTop: 3,
    ...typography.caption,
    color: colors.textMuted,
  },
  description: {
    ...typography.caption,
    color: colors.textMuted,
  },
  compactBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  freshnessBox: {
    gap: spacing.xs,
  },
  freshnessHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  freshnessTitle: {
    ...typography.label,
    color: colors.text,
  },
  freshnessText: {
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