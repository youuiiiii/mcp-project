import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import StatusBadge from "../../../components/ui/StatusBadge";
import { getIncidentDisplayMeta } from "../../../constants/incident";
import IncidentImpactSummary from "../components/IncidentImpactSummary";
import IncidentImageGallery from "../components/IncidentImageGallery";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";
import type { IncidentReport } from "../../../types/incident";
import { getIncidentConfidenceMeta } from "../../../utils/incidentConfidence";
import { getIncidentFreshnessMeta } from "../../../utils/incidentFreshness";
import {
  formatIncidentDate,
  getCommunityUpdateMeta,
  getStatusLabel,
  getStatusVariant,
} from "./threadLabels";

type IncidentOverviewCardProps = {
  incident: IncidentReport;
  onReportContent: () => void;
};

export default function IncidentOverviewCard({
  incident,
  onReportContent,
}: IncidentOverviewCardProps) {
  const meta = getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });

  const author = incident.reportedBy || incident.reporterEmail || "Anonymous";
  const confidence = getIncidentConfidenceMeta(incident);
  const freshness = getIncidentFreshnessMeta(incident);
  const urgencyLevel = incident.urgencyLevel ?? incident.severity;
  const urgencyLabel =
    typeof incident.urgencyScore === "number"
      ? `Urgency ${incident.urgencyScore}`
      : `${getUrgencyLevelLabel(urgencyLevel)} urgency`;
  const latestUpdate = incident.latestCommunityUpdateType
    ? getCommunityUpdateMeta(incident.latestCommunityUpdateType)
    : null;

  return (
    <View style={styles.post}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={18} color={colors.textInverse} />
      </View>

      <View style={styles.body}>
        <View style={styles.authorRow}>
          <Text style={styles.authorName} numberOfLines={1}>
            {author}
          </Text>

          <Text style={styles.dot}>-</Text>

          <Text style={styles.timeText} numberOfLines={1}>
            {formatIncidentDate(incident.createdAt)}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <View
            style={[
              styles.categoryPill,
              {
                backgroundColor: meta.lightColor,
              },
            ]}
          >
            <Ionicons name={meta.iconName} size={14} color={meta.color} />
            <Text
              style={[
                styles.categoryText,
                {
                  color: meta.color,
                },
              ]}
              numberOfLines={1}
            >
              {meta.label}
            </Text>
          </View>

          <StatusBadge
            label={getStatusLabel(incident.status)}
            variant={getStatusVariant(incident.status)}
            size="sm"
          />

          <StatusBadge
            label={urgencyLabel}
            variant={getUrgencyVariant(urgencyLevel)}
            size="sm"
          />
        </View>

        <Text style={styles.title}>{incident.title}</Text>

        <Text style={styles.description}>
          {incident.description || "No description provided."}
        </Text>

        <IncidentImpactSummary impactAnswers={incident.impactAnswers} />

        <IncidentImageGallery
          imageUri={incident.imageUri}
          imageUris={incident.imageUris}
          variant="detail"
        />

        <View
          style={[
            styles.signalNotice,
            {
              backgroundColor: confidence.backgroundColor,
              borderColor: confidence.borderColor,
            },
          ]}
        >
          <View style={styles.scoreDial}>
            <Text style={[styles.scoreText, { color: confidence.color }]}>
              {confidence.score}
            </Text>
          </View>

          <View style={styles.signalTextGroup}>
            <Text
              style={[
                styles.signalTitle,
                {
                  color: confidence.color,
                },
              ]}
            >
              {confidence.label}
            </Text>

            <Text style={styles.signalDescription}>
              {confidence.description}
            </Text>

            <Text style={styles.freshnessText}>{freshness.message}</Text>

            {latestUpdate ? (
              <View style={styles.latestUpdateRow}>
                <Ionicons
                  name={latestUpdate.iconName}
                  size={14}
                  color={latestUpdate.color}
                />
                <Text style={styles.latestUpdateText} numberOfLines={2}>
                  Latest community update: {latestUpdate.label}
                </Text>
              </View>
            ) : null}

            <View style={styles.signalGrid}>
              {confidence.signals.map((signal) => (
                <View key={signal.label} style={styles.signalItem}>
                  <Text style={styles.signalValue}>{signal.value}</Text>
                  <Text style={styles.signalLabel}>{signal.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Text style={styles.disclaimer}>
          This report comes from the community and may not be official
          information. Treat it as an early signal and stay careful on site.
        </Text>

        <Pressable
          onPress={onReportContent}
          style={({ pressed }) => [
            styles.reportContentButton,
            pressed && styles.reportContentPressed,
          ]}
        >
          <Ionicons
            name="flag-outline"
            size={16}
            color={colors.primaryDark}
          />
          <Text style={styles.reportContentText}>Report Content</Text>
        </Pressable>
      </View>
    </View>
  );
}

function getUrgencyLevelLabel(urgency: NonNullable<IncidentReport["urgencyLevel"]>) {
  if (urgency === "high") {
    return "High";
  }

  if (urgency === "medium") {
    return "Medium";
  }

  return "Low";
}

function getUrgencyVariant(
  urgency: NonNullable<IncidentReport["urgencyLevel"]>
): "success" | "warning" | "danger" {
  if (urgency === "high") {
    return "danger";
  }

  if (urgency === "medium") {
    return "warning";
  }

  return "success";
}

const styles = StyleSheet.create({
  post: {
    flexDirection: "row",
    gap: spacing.md,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  authorName: {
    maxWidth: "54%",
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  dot: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMuted,
  },
  timeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
  },
  metaRow: {
    marginTop: spacing.sm,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  categoryPill: {
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "800",
  },
  signalNotice: {
    marginTop: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  scoreDial: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
  },
  scoreText: {
    fontSize: 15,
    fontWeight: "900",
  },
  signalTextGroup: {
    flex: 1,
  },
  signalTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  signalDescription: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "500",
    color: colors.textMuted,
  },
  freshnessText: {
    marginTop: spacing.xs,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "700",
    color: colors.text,
  },
  latestUpdateRow: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  latestUpdateText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "800",
    color: colors.text,
  },
  signalGrid: {
    marginTop: spacing.sm,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  signalItem: {
    minWidth: 58,
    borderRadius: radius.md,
    backgroundColor: "rgba(255, 255, 255, 0.64)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  signalValue: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.text,
  },
  signalLabel: {
    marginTop: 1,
    fontSize: 9,
    fontWeight: "800",
    color: colors.textMuted,
    textTransform: "uppercase",
  },
  title: {
    marginTop: spacing.md,
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "800",
    color: colors.text,
  },
  description: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
    color: "#475569",
  },
  disclaimer: {
    marginTop: spacing.md,
    ...typography.caption,
    color: colors.textMuted,
  },
  reportContentButton: {
    marginTop: spacing.md,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.dangerSoft,
  },
  reportContentPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  reportContentText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primaryDark,
  },
});
