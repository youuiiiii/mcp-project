import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, Pressable, View } from "react-native";

import { getIncidentDisplayMeta } from "../constants/incident";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/layout";
import type { IncidentReport } from "../types/incident";

type IncidentCardProps = {
  incident: IncidentReport;
  onPress?: (incident: IncidentReport) => void;
  showImage?: boolean;
  compact?: boolean;
  variant?: "default" | "home";
};

export default function IncidentCard({
  incident,
  onPress,
}: IncidentCardProps) {
  const meta = getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });

  const title = incident.title?.trim() || "Incident";
  const dateLabel = formatDate(incident.createdAt);
  const address = incident.address || `${incident.latitude.toFixed(4)}, ${incident.longitude.toFixed(4)}`;

  const urgencyScore = incident.urgencyScore ?? 20;
  let urgencyColor: string = colors.info;
  let severityLabel = "Low Severity";
  
  if (urgencyScore >= 70) {
    urgencyColor = colors.danger;
    severityLabel = "High Severity";
  } else if (urgencyScore >= 38) {
    urgencyColor = colors.warning;
    severityLabel = "Medium Severity";
  }

  const verifications = incident.verificationCount ?? 0;
  const disputes = incident.disputeCount ?? 0;
  const totalVotes = verifications + disputes;

  return (
    <Pressable
      onPress={() => onPress && onPress(incident)}
      style={({ pressed }) => [
        styles.card,
        { borderLeftColor: urgencyColor },
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: meta.lightColor }]}>
          <Ionicons name={meta.iconName} size={14} color={meta.color} />
        </View>
        <Text style={styles.metaText}>{meta.label}</Text>
        <Text style={styles.dotSeparator}>•</Text>
        <Text style={styles.metaText}>{dateLabel}</Text>
        <View style={{ flex: 1 }} />
        <Text style={[styles.severityLabel, { color: urgencyColor }]}>{severityLabel}</Text>
      </View>

      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <View style={styles.locationRow}>
        <Ionicons name="location" size={14} color={colors.textSoft} />
        <Text style={styles.locationText} numberOfLines={1}>{address}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.verificationBadge}>
          <Ionicons name="shield-checkmark" size={12} color={totalVotes > 0 && verifications >= disputes ? colors.success : colors.textSoft} />
          <Text style={styles.verificationText}>
            {totalVotes === 0 ? "Unverified" : `${verifications} Confirmations`}
          </Text>
        </View>
        <View style={styles.footerRight}>
          <Text style={styles.detailsLink}>View Details</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </View>
      </View>
    </Pressable>
  );
}

function formatDate(date: Date | undefined): string {
  if (!date) return "Unknown time";
  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    borderLeftWidth: 5,
    padding: spacing.md,
  },
  cardPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: spacing.xs,
  },
  iconWrap: {
    padding: 4,
    borderRadius: radius.sm,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
  },
  dotSeparator: {
    fontSize: 10,
    color: colors.textSoft,
  },
  severityLabel: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: spacing.md,
  },
  locationText: {
    fontSize: 13,
    color: colors.textSoft,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainer,
  },
  verificationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  verificationText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  detailsLink: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
});
