import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import LoadingState from "../../../components/ui/LoadingState";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
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
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Update Warga</Text>
        <Text style={styles.sectionSubtitle}>
          {replies.length} update tersedia
        </Text>
      </View>

      {loading ? <LoadingState message="Memuat update..." /> : null}

      {!loading && replies.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={22}
            color={colors.textMuted}
          />

          <View style={styles.emptyTextGroup}>
            <Text style={styles.emptyTitle}>Belum ada update</Text>
            <Text style={styles.emptyText}>
              Jadilah yang pertama menambahkan informasi.
            </Text>
          </View>
        </View>
      ) : null}

      {!loading && replies.length > 0 ? (
        <View style={styles.thread}>
          {replies.map((reply, index) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              isLast={index === replies.length - 1}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function ReplyItem({
  reply,
  isLast,
}: {
  reply: IncidentReply;
  isLast: boolean;
}) {
  const author = reply.userName || reply.userEmail || "Anonymous";

  return (
    <View style={styles.replyRow}>
      <View style={styles.replyRail}>
        <View style={styles.replyAvatar}>
          <Ionicons name="person" size={13} color={colors.textInverse} />
        </View>

        {!isLast ? <View style={styles.replyLine} /> : null}
      </View>

      <View style={styles.replyBody}>
        <View style={styles.replyHeader}>
          <Text style={styles.replyAuthor} numberOfLines={1}>
            {author}
          </Text>

          <Text style={styles.replyDot}>·</Text>

          <Text style={styles.replyTime} numberOfLines={1}>
            {formatIncidentDate(reply.createdAt)}
          </Text>
        </View>

        <Text style={styles.replyMessage}>{reply.message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing["2xl"],
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },
  sectionSubtitle: {
    marginTop: 2,
    ...typography.caption,
    color: colors.textMuted,
  },
  emptyState: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.lg,
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
  thread: {
    gap: 0,
  },
  replyRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  replyRail: {
    width: 34,
    alignItems: "center",
  },
  replyAvatar: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.info,
    alignItems: "center",
    justifyContent: "center",
  },
  replyLine: {
    flex: 1,
    width: 2,
    marginVertical: 5,
    backgroundColor: colors.border,
  },
  replyBody: {
    flex: 1,
    paddingBottom: spacing.lg,
  },
  replyHeader: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  replyAuthor: {
    maxWidth: "46%",
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
  },
  replyDot: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
  },
  replyTime: {
    flex: 1,
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
  },
  replyMessage: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
    color: "#475569",
  },
});