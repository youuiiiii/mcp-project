import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import LoadingState from "../../../components/ui/LoadingState";
import SectionHeader from "../../../components/ui/SectionHeader";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";
import type { IncidentReply } from "../../../types/incident";
import { formatIncidentDate } from "./threadLabels";

type IncidentDiscussionListProps = {
  replies: IncidentReply[];
  loading: boolean;
};

export default function IncidentDiscussionList({
  replies,
  loading,
}: IncidentDiscussionListProps) {
  return (
    <View style={styles.section}>
      <SectionHeader
        title="Discussion"
        subtitle="Update dan informasi tambahan dari warga."
      />

      {loading ? (
        <AppCard style={styles.loadingCard}>
          <LoadingState message="Memuat diskusi..." />
        </AppCard>
      ) : null}

      {!loading && replies.length === 0 ? (
        <AppCard variant="muted" style={styles.emptyCard}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={22}
            color={colors.textMuted}
          />

          <View style={styles.emptyTextGroup}>
            <Text style={styles.emptyTitle}>Belum ada diskusi</Text>
            <Text style={styles.emptyText}>
              Reply pertama akan muncul di sini.
            </Text>
          </View>
        </AppCard>
      ) : null}

      {!loading && replies.length > 0 ? (
        <View style={styles.list}>
          {replies.map((reply) => (
            <AppCard key={reply.id} style={styles.replyCard}>
              <View style={styles.replyHeader}>
                <View style={styles.replyAuthor}>
                  <View style={styles.avatar}>
                    <Ionicons
                      name="person"
                      size={15}
                      color={colors.textInverse}
                    />
                  </View>

                  <View style={styles.authorTextGroup}>
                    <Text style={styles.authorName} numberOfLines={1}>
                      {reply.userName || reply.userEmail || "Anonymous"}
                    </Text>

                    <Text style={styles.replyDate} numberOfLines={1}>
                      {formatIncidentDate(reply.createdAt)}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.replyMessage}>{reply.message}</Text>
            </AppCard>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing["2xl"],
    gap: spacing.md,
  },
  loadingCard: {
    minHeight: 90,
    justifyContent: "center",
  },
  emptyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  emptyTextGroup: {
    flex: 1,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  emptyText: {
    marginTop: 2,
    ...typography.caption,
    color: colors.textMuted,
  },
  list: {
    gap: spacing.sm,
  },
  replyCard: {
    gap: spacing.sm,
  },
  replyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  replyAuthor: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: colors.info,
    alignItems: "center",
    justifyContent: "center",
  },
  authorTextGroup: {
    flex: 1,
  },
  authorName: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
  },
  replyDate: {
    marginTop: 1,
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
  },
  replyMessage: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
    color: "#475569",
  },
});