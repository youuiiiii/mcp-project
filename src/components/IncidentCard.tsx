import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getIncidentDisplayMeta } from "../constants/incident";
import { colors } from "../theme/colors";
import { radius, shadow, spacing } from "../theme/layout";
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
  compact = false,
}: IncidentCardProps) {
  const meta = getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });

  const title = incident.title?.trim() || meta.shortLabel || "Incident";
  const address =
    incident.address ||
    `${incident.latitude.toFixed(4)}, ${incident.longitude.toFixed(4)}`;
  const status = getIncidentStatusMeta(incident);
  const reportCount =
    (incident.verificationCount ?? 0) +
    (incident.replyCount ?? 0) +
    (incident.evidenceCount ?? 0);

  return (
    <Pressable
      onPress={() => onPress?.(incident)}
      style={({ pressed }) => [
        styles.card,
        compact && styles.cardCompact,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: meta.lightColor }]}>
        <Ionicons name={meta.iconName} size={22} color={meta.color} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.fg }]}>
              {status.label}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={13} color={colors.textSoft} />
          <Text style={styles.locationText} numberOfLines={1}>
            {address}
          </Text>
        </View>

        <View style={styles.footerRow}>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={13} color={colors.textSoft} />
            <Text style={styles.timeText} numberOfLines={1}>
              {formatRelativeTime(incident.createdAt)}
            </Text>
          </View>

          {!compact ? (
            <Text style={styles.reportText}>
              {reportCount || 1} {reportCount === 1 ? "report" : "reports"}
            </Text>
          ) : null}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.borderStrong} />
    </Pressable>
  );
}

function getIncidentStatusMeta(incident: IncidentReport) {
  if (incident.status === "resolved") {
    return {
      label: "Resolved",
      bg: colors.successSoft,
      fg: colors.successDark,
    };
  }

  if (
    incident.verificationStatus === "pending" ||
    incident.trustStatus === "questioned" ||
    (incident.conditionUpdateCount ?? 0) > 0
  ) {
    return {
      label: "Monitoring",
      bg: colors.warningSoft,
      fg: colors.warningDark,
    };
  }

  return {
    label: "Active",
    bg: colors.dangerSoft,
    fg: colors.dangerDark,
  };
}

function formatRelativeTime(date?: Date): string {
  if (!date) return "Unknown time";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
}

const styles = StyleSheet.create({
  card: {
    minHeight: 94,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(226,232,240,0.76)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...shadow.sm,
  },
  cardCompact: {
    minHeight: 82,
    borderRadius: radius.xl,
  },
  cardPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.99 }],
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 5,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  statusPill: {
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },
  infoRow: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    flex: 1,
    minWidth: 0,
    fontSize: 12,
    fontWeight: "700",
    color: "#31517A",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  timeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8290B6",
  },
  reportText: {
    flexShrink: 0,
    fontSize: 11,
    fontWeight: "700",
    color: "#8290B6",
  },
});
