import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Image,
  LayoutChangeEvent,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import LoadingState from "../../../components/ui/LoadingState";
import StatusBadge from "../../../components/ui/StatusBadge";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";
import type { IncidentReply } from "../../../types/incident";
import { formatIncidentDate, getCommunityUpdateMeta } from "./threadLabels";

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
        <Text style={styles.sectionTitle}>Community Comments</Text>
        <Text style={styles.sectionSubtitle}>
          {replies.length} comments available
        </Text>
      </View>

      {loading ? <LoadingState message="Loading comments..." /> : null}

      {!loading && replies.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={22}
            color={colors.textMuted}
          />

          <View style={styles.emptyTextGroup}>
            <Text style={styles.emptyTitle}>No comments yet</Text>
            <Text style={styles.emptyText}>
              Be the first to add useful information.
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

function ReplyItem({
  reply,
  childReplies,
  isLast,
  onReplyTo,
  onPreviewImage,
}: {
  reply: IncidentReply;
  childReplies: IncidentReply[];
  isLast: boolean;
  onReplyTo: (reply: IncidentReply) => void;
  onPreviewImage: (imageUri: string) => void;
}) {
  return (
    <View style={styles.replyRow}>
      <View style={styles.replyRail}>
        <Avatar size={32} />

        {!isLast ? <View style={styles.replyLine} /> : null}
      </View>

      <View style={styles.replyBody}>
        <ReplyContent
          reply={reply}
          onReplyTo={onReplyTo}
          onPreviewImage={onPreviewImage}
        />

        {childReplies.length > 0 ? (
          <View style={styles.childList}>
            {childReplies.map((child) => (
              <View key={child.id} style={styles.childRow}>
                <Avatar size={24} />

                <View style={styles.childBody}>
                  <ReplyContent
                    reply={child}
                    compact
                    onReplyTo={onReplyTo}
                    onPreviewImage={onPreviewImage}
                  />
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

function ReplyContent({
  reply,
  compact = false,
  onReplyTo,
  onPreviewImage,
}: {
  reply: IncidentReply;
  compact?: boolean;
  onReplyTo: (reply: IncidentReply) => void;
  onPreviewImage: (imageUri: string) => void;
}) {
  const author = reply.userName || reply.userEmail || "Anonymous";
  const updateMeta = getCommunityUpdateMeta(reply.updateType);

  return (
    <View>
      <View style={styles.replyHeader}>
        <Text style={styles.replyAuthor} numberOfLines={1}>
          {author}
        </Text>

        <Text style={styles.replyDot}>-</Text>

        <Text style={styles.replyTime} numberOfLines={1}>
          {formatIncidentDate(reply.createdAt)}
        </Text>
      </View>

      {!compact ? (
        <StatusBadge
          label={updateMeta.label}
          variant={getUpdateBadgeVariant(reply.updateType)}
          size="sm"
          style={styles.updateBadge}
        />
      ) : null}

      {reply.replyToUserName ? (
        <Text style={styles.replyingToText}>
          Replying to {reply.replyToUserName}
        </Text>
      ) : null}

      <Text style={[styles.replyMessage, compact && styles.compactMessage]}>
        {reply.message}
      </Text>

      {reply.imageUri ? (
        <NaturalReplyImage
          imageUri={reply.imageUri}
          compact={compact}
          onPress={() => onPreviewImage(reply.imageUri as string)}
        />
      ) : null}

      <Pressable
        onPress={() => onReplyTo(reply)}
        style={({ pressed }) => [styles.replyAction, pressed && styles.pressed]}
      >
        <Ionicons
          name="chatbubble-outline"
          size={14}
          color={colors.textMuted}
        />

        <Text style={styles.replyActionText}>Reply</Text>
      </Pressable>
    </View>
  );
}

function getUpdateBadgeVariant(
  updateType: IncidentReply["updateType"]
): "active" | "danger" | "success" | "warning" | "info" | "neutral" {
  if (updateType === "still_happening") {
    return "active";
  }

  if (updateType === "getting_worse") {
    return "danger";
  }

  if (updateType === "safe_now") {
    return "success";
  }

  if (updateType === "not_found") {
    return "warning";
  }

  if (updateType === "improving") {
    return "info";
  }

  return "neutral";
}

function NaturalReplyImage({
  imageUri,
  compact,
  onPress,
}: {
  imageUri: string;
  compact: boolean;
  onPress: () => void;
}) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    Image.getSize(
      imageUri,
      (width, height) => {
        if (!mounted || width <= 0 || height <= 0) {
          return;
        }

        setAspectRatio(width / height);
      },
      () => {
        if (mounted) {
          setAspectRatio(null);
        }
      }
    );

    return () => {
      mounted = false;
    };
  }, [imageUri]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;

    if (width > 0 && width !== containerWidth) {
      setContainerWidth(width);
    }
  };

  const fallbackHeight = compact ? 150 : 190;

  const imageHeight =
    containerWidth > 0 && aspectRatio && aspectRatio > 0
      ? containerWidth / aspectRatio
      : fallbackHeight;

  return (
    <Pressable
      onPress={onPress}
      onLayout={handleLayout}
      style={({ pressed }) => [
        styles.replyImageFrame,
        {
          height: imageHeight,
        },
        pressed && styles.pressed,
      ]}
    >
      <Image
        source={{ uri: imageUri }}
        style={styles.replyImage}
        resizeMode="cover"
      />

      <View style={styles.imageHint}>
        <Ionicons name="expand-outline" size={13} color={colors.textInverse} />
        <Text style={styles.imageHintText}>View</Text>
      </View>
    </Pressable>
  );
}

function ImagePreviewModal({
  imageUri,
  onClose,
}: {
  imageUri: string | null;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={Boolean(imageUri)}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.previewBackdrop}>
        <Pressable style={styles.previewCloseArea} onPress={onClose} />

        <View style={styles.previewHeader}>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.previewCloseButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="close" size={24} color={colors.textInverse} />
          </Pressable>
        </View>

        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.previewImage}
            resizeMode="contain"
          />
        ) : null}
      </View>
    </Modal>
  );
}

function Avatar({ size }: { size: number }) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: radius.full,
        },
      ]}
    >
      <Ionicons
        name="person"
        size={Math.max(12, Math.round(size * 0.42))}
        color={colors.textInverse}
      />
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
  avatar: {
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
    minHeight: 28,
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
  replyingToText: {
    marginTop: 1,
    fontSize: 11,
    fontWeight: "700",
    color: colors.info,
  },
  updateBadge: {
    marginTop: 2,
  },
  replyMessage: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
    color: "#475569",
  },
  compactMessage: {
    fontSize: 13,
    lineHeight: 19,
  },
  replyImageFrame: {
    marginTop: spacing.sm,
    width: "100%",
    borderRadius: radius.xl,
    overflow: "hidden",
    backgroundColor: colors.border,
    borderWidth: 1,
    borderColor: colors.border,
  },
  replyImage: {
    width: "100%",
    height: "100%",
  },
  imageHint: {
    position: "absolute",
    right: spacing.sm,
    bottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: radius.full,
    backgroundColor: "rgba(15, 23, 42, 0.72)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  imageHintText: {
    fontSize: 10,
    fontWeight: "900",
    color: colors.textInverse,
  },
  replyAction: {
    alignSelf: "flex-start",
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
  },
  pressed: {
    opacity: 0.75,
  },
  replyActionText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textMuted,
  },
  childList: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  childRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingLeft: spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: colors.border,
  },
  childBody: {
    flex: 1,
  },
  previewBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.94)",
    alignItems: "center",
    justifyContent: "center",
  },
  previewCloseArea: {
    ...StyleSheet.absoluteFillObject,
  },
  previewHeader: {
    position: "absolute",
    top: 48,
    right: 18,
    zIndex: 2,
  },
  previewCloseButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: "rgba(15, 23, 42, 0.72)",
    alignItems: "center",
    justifyContent: "center",
  },
  previewImage: {
    width: "100%",
    height: "82%",
  },
});
