import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, Pressable, View } from "react-native";

import { getIncidentDisplayMeta } from "../constants/incident";
import { colors } from "../theme/colors";
import { radius, spacing, shadow } from "../theme/layout";
import type { IncidentReport } from "../types/incident";
import StatusBadge from "./ui/StatusBadge";

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
  compact = false,
}: IncidentCardProps) {
  const meta = getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });

  const title = incident.title?.trim() || "Incident";
  const dateLabel = formatDate(incident.createdAt);
  const address = incident.address || `${incident.latitude.toFixed(4)}, ${incident.longitude.toFixed(4)}`;

  const urgencyScore = incident.urgencyScore ?? 20;
  let urgencyVariant: "danger" | "warning" | "success" = "success";
  let severityLabel = "Low";
  
  if (urgencyScore >= 70) {
    urgencyVariant = "danger";
    severityLabel = "High";
  } else if (urgencyScore >= 38) {
    urgencyVariant = "warning";
    severityLabel = "Moderate";
  }

  const verifications = incident.verificationCount ?? 0;
  const disputes = incident.disputeCount ?? 0;
  const totalVotes = verifications + disputes;

  return (
    <Pressable
      onPress={() => onPress && onPress(incident)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: meta.color }]}>
          <Ionicons name={meta.iconName} size={20} color={colors.textInverse} />
        </View>
        
        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{meta.label}</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.metaText}>{dateLabel}</Text>
          </View>
        </View>

        <StatusBadge label={severityLabel} variant={urgencyVariant} size="sm" />
      </View>

      <View style={styles.locationRow}>
        <Ionicons name="location" size={14} color={colors.textSoft} />
        <Text style={styles.locationText} numberOfLines={1}>{address}</Text>
      </View>

      {!compact && incident.description && !incident.description.includes("reported near the selected map pin") && !incident.description.includes("No additional impact") && (
        <Text style={styles.description} numberOfLines={2}>
          {incident.description}
        </Text>
      )}

      {!compact && (
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
      )}
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
    borderColor: colors.border,
    padding: spacing.md,
    ...shadow.sm,
  },
  cardPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSoft,
  },
  dotSeparator: {
    fontSize: 10,
    color: colors.borderStrong,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: spacing.xs,
  },
  locationText: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainer,
    marginTop: spacing.xs,
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
