import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import StatusBadge from "../../../components/ui/StatusBadge";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";
import type {
  IncidentReply,
  IncidentReport,
  IncidentVerification,
} from "../../../types/incident";
import {
  formatIncidentDate,
  getConditionLabel,
  getCommunityUpdateMeta,
  getTimelineIcon,
  getVerificationColor,
  getVerificationLabel,
} from "./threadLabels";
import type { TimelineItem } from "./types";

type IncidentTimelineProps = {
  incident: IncidentReport;
  verifications: IncidentVerification[];
  replies: IncidentReply[];
};

const MAX_VISIBLE_ITEMS = 7;

export default function IncidentTimeline({
  incident,
  verifications,
  replies,
}: IncidentTimelineProps) {
  const items = useMemo(() => {
    return buildTimelineItems({ incident, verifications, replies }).slice(
      0,
      MAX_VISIBLE_ITEMS
    );
  }, [incident, verifications, replies]);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Live Timeline</Text>
          <Text style={styles.subtitle}>
            Perubahan terbaru dari laporan dan warga sekitar.
          </Text>
        </View>

        <StatusBadge label={`${items.length} update`} variant="info" size="sm" />
      </View>

      <View style={styles.timeline}>
        {items.map((item, index) => (
          <TimelineRow
            key={item.id}
            item={item}
            isLast={index === items.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

function buildTimelineItems({
  incident,
  verifications,
  replies,
}: IncidentTimelineProps): TimelineItem[] {
  const reportItem: TimelineItem = {
    id: `report-${incident.id}`,
    kind: "report",
    date: incident.createdAt,
    title: "Laporan dibuat",
    message: incident.title || "Laporan baru masuk ke SIGAP.",
    author: incident.reportedBy ?? incident.reporterEmail,
    color: colors.info,
    badgeLabel: "Report",
  };

  const verificationItems: TimelineItem[] = verifications.map((item) => ({
    id: `verification-${item.id}`,
    kind: "verification",
    date: item.createdAt,
    title: getVerificationLabel(item.verificationType),
    message: item.note || getConditionLabel(item.conditionStatus),
    author: item.userName ?? item.userEmail,
    imageUri: item.imageUri,
    color: getVerificationColor(item.verificationType),
    badgeLabel: getConditionLabel(item.conditionStatus),
  }));

  const replyItems: TimelineItem[] = replies.slice(0, 5).map((item) => {
    const updateMeta = getCommunityUpdateMeta(item.updateType);

    return {
      id: `reply-${item.id}`,
      kind: "reply",
      date: item.createdAt,
      title: updateMeta.label,
      message: item.message,
      author: item.userName ?? item.userEmail,
      imageUri: item.imageUri,
      color: updateMeta.color,
      badgeLabel: item.imageUri
        ? `${updateMeta.shortLabel} + foto`
        : updateMeta.shortLabel,
    };
  });

  const resolvedItem: TimelineItem[] =
    incident.status === "resolved"
      ? [
          {
            id: `resolved-${incident.id}`,
            kind: "resolved",
            date: incident.resolvedAt,
            title: "Ditandai selesai",
            message:
              incident.resolutionNote ||
              "Laporan sudah ditandai selesai oleh komunitas.",
            author: incident.resolvedBy,
            imageUri: incident.resolvedImageUri,
            color: colors.success,
            badgeLabel: "Resolved",
          },
        ]
      : [];

  return [reportItem, ...verificationItems, ...replyItems, ...resolvedItem].sort(
    (a, b) => getTime(b.date) - getTime(a.date)
  );
}

function TimelineRow({
  item,
  isLast,
}: {
  item: TimelineItem;
  isLast: boolean;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
          <Ionicons
            name={getTimelineIcon(item.kind)}
            size={15}
            color={colors.textInverse}
          />
        </View>

        {!isLast ? <View style={styles.line} /> : null}
      </View>

      <View style={styles.content}>
        <View style={styles.rowHeader}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title}
          </Text>

          <StatusBadge label={item.badgeLabel} variant="neutral" size="sm" />
        </View>

        <Text style={styles.message} numberOfLines={3}>
          {item.message}
        </Text>

        <Text style={styles.meta} numberOfLines={1}>
          {item.author || "Anonymous"} - {formatIncidentDate(item.date)}
          {item.imageUri ? " - ada foto" : ""}
        </Text>
      </View>
    </View>
  );
}

function getTime(date?: Date) {
  return date?.getTime() ?? 0;
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing["2xl"],
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    ...typography.caption,
    color: colors.textMuted,
  },
  timeline: {
    gap: 0,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  rail: {
    width: 30,
    alignItems: "center",
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    flex: 1,
    width: 2,
    marginVertical: 4,
    backgroundColor: colors.border,
  },
  content: {
    flex: 1,
    paddingBottom: spacing.lg,
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  itemTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "900",
    color: colors.text,
  },
  message: {
    marginTop: spacing.xs,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
    color: "#475569",
  },
  meta: {
    marginTop: spacing.xs,
    fontSize: 11,
    fontWeight: "700",
    color: colors.textMuted,
  },
});
