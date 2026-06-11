import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from "react-native";

import LoadingState from "../../../components/ui/LoadingState";
import { colors } from "../../../theme/colors";
import type { IncidentReply } from "../../../types/incident";
import {
  ImagePreviewModal,
  ReplyItem,
} from "./IncidentDiscussionItems";
import { incidentDiscussionStyles as styles } from "./incidentDiscussionStyles";
import { useI18n } from "../../../i18n";

type IncidentDiscussionListProps = {
  replies: IncidentReply[];
  loading: boolean;
  onReplyTo: (reply: IncidentReply) => void;
};

export default function IncidentDiscussionList({
  replies,
  loading,
  onReplyTo,
}: IncidentDiscussionListProps) {
  const { t } = useI18n();
  const [previewImageUri, setPreviewImageUri] = useState<string | null>(null);

  const topLevelReplies = replies.filter((reply) => !reply.parentReplyId);

  const repliesByParentId = replies.reduce<Record<string, IncidentReply[]>>(
    (acc, reply) => {
      if (!reply.parentReplyId) {
        return acc;
      }

      if (!acc[reply.parentReplyId]) {
        acc[reply.parentReplyId] = [];
      }

      acc[reply.parentReplyId].push(reply);
      return acc;
    },
    {}
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t("incident.discussion.title")}</Text>
        <Text style={styles.sectionSubtitle}>
          {t("incident.discussion.count", { count: replies.length })}
        </Text>
      </View>

      {loading ? <LoadingState message={t("incident.discussion.loading")} /> : null}

      {!loading && replies.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={22}
            color={colors.textMuted}
          />

          <View style={styles.emptyTextGroup}>
            <Text style={styles.emptyTitle}>{t("incident.discussion.emptyTitle")}</Text>
            <Text style={styles.emptyText}>
              {t("incident.discussion.emptyDesc")}
            </Text>
          </View>
        </View>
      ) : null}

      {!loading && topLevelReplies.length > 0 ? (
        <View style={styles.thread}>
          {topLevelReplies.map((reply, index) => {
            const childReplies = repliesByParentId[reply.id] ?? [];

            return (
              <ReplyItem
                key={reply.id}
                reply={reply}
                childReplies={childReplies}
                isLast={index === topLevelReplies.length - 1}
                onReplyTo={onReplyTo}
                onPreviewImage={setPreviewImageUri}
              />
            );
          })}
        </View>
      ) : null}

      <ImagePreviewModal
        imageUri={previewImageUri}
        onClose={() => setPreviewImageUri(null)}
      />
    </View>
  );
}
