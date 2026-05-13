import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import LoadingState from "../../../components/ui/LoadingState";
import SectionHeader from "../../../components/ui/SectionHeader";
import StatusBadge from "../../../components/ui/StatusBadge";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";
import {
  formatIncidentDate,
  getTimelineIcon,
} from "./threadLabels";
import type { TimelineItem } from "./types";

type IncidentTimelineProps = {
  items: TimelineItem[];
  loading: boolean;
};

export default function IncidentTimeline({
  items,
  loading,
}: IncidentTimelineProps) {
  return (
    <View style={styles.section}>
      <SectionHeader
        title="Timeline Kejadian"
        subtitle="Riwayat laporan awal, verifikasi, update kondisi, diskusi, dan penyelesaian."
        style={styles.sectionHeader}
      />

      {loading ? (
        <AppCard style={styles.loadingBox}>
          <LoadingState message="Memuat timeline..." />
        </AppCard>
      ) : null}

      {!loading && items.length === 0 ? (
        <EmptyThreadCard
          title="Belum ada timeline"
          message="Timeline akan muncul setelah ada laporan atau update kondisi."
        />
      ) : (
        <View style={styles.list}>
          {items.map((item, index) => (
            <TimelineRow
              key={item.id}
              item={item}
              isLast={index === items.length - 1}
            />
          ))}
        </View>
      )}
    </View>
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
        <View
          style={[
            styles.dot,
            {
              backgroundColor: item.color,
            },
          ]}
        >
          <Ionicons
            name={getTimelineIcon(item.kind)}
            size={14}
            color={colors.textInverse}
          />
        </View>

        {!isLast ? <View style={styles.line} /> : null}
      </View>

      <AppCard style={styles.timelineCard}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: item.color,
              },
            ]}
          >
            <Text style={styles.badgeText} numberOfLines={1}>
              {item.badgeLabel}
            </Text>
          </View>

          <Text style={styles.date} numberOfLines={1}>
            {formatIncidentDate(item.date)}
          </Text>
        </View>

        <Text style={styles.title}>{item.title}</Text>

        <Text style={styles.author} numberOfLines={1}>
          Oleh: {item.author || "Anonymous"}
        </Text>

        {item.conditionLabel ? (
          <StatusBadge
            label={`Kondisi: ${item.conditionLabel}`}
            variant="neutral"
            size="sm"
            style={styles.conditionPill}
          />
        ) : null}

        <Text style={styles.message}>{item.message}</Text>

        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.image} />
        ) : null}
      </AppCard>
    </View>
  );
}

function EmptyThreadCard({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <AppCard variant="muted" style={styles.emptyBox}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{message}</Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing["2xl"],
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  loadingBox: {
    minHeight: 100,
    justifyContent: "center",
  },
  list: {
    gap: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  rail: {
    width: 34,
    alignItems: "center",
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.surface,
    zIndex: 2,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#CBD5E1",
    marginTop: 2,
    marginBottom: 2,
  },
  timelineCard: {
    flex: 1,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
    alignItems: "center",
  },
  badge: {
    maxWidth: "58%",
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: colors.textInverse,
  },
  date: {
    flex: 1,
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSoft,
    textAlign: "right",
  },
  title: {
    marginTop: spacing.sm,
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  author: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
  },
  conditionPill: {
    marginTop: spacing.sm,
  },
  message: {
    marginTop: spacing.sm,
    ...typography.caption,
    color: "#475569",
  },
  image: {
    marginTop: spacing.sm,
    width: "100%",
    height: 175,
    borderRadius: radius.lg,
    backgroundColor: colors.border,
  },
  emptyBox: {
    gap: spacing.xs,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  emptyText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});