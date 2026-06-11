import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Image,
  LayoutChangeEvent,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";

import StatusBadge from "../../../components/ui/StatusBadge";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/layout";
import type { IncidentReply } from "../../../types/incident";
import { formatIncidentDate, getCommunityUpdateMeta } from "./threadLabels";
import { useI18n } from "../../../i18n";

export function ReplyItem({
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
  const { t, language } = useI18n();
  const author = reply.userName || reply.userEmail || t("incident.discussion.anonymous");
  const updateMeta = getCommunityUpdateMeta(reply.updateType);

  return (
    <View>
      <View style={styles.replyHeader}>
        <Text style={styles.replyAuthor} numberOfLines={1}>
          {author}
        </Text>

        <Text style={styles.replyDot}>-</Text>

        <Text style={styles.replyTime} numberOfLines={1}>
          {formatIncidentDate(reply.createdAt, t, language as any)}
        </Text>
      </View>

      {!compact ? (
        <StatusBadge
          label={t(updateMeta.label as any)}
          variant={getUpdateBadgeVariant(reply.updateType)}
          size="sm"
          style={styles.updateBadge}
        />
      ) : null}

      {reply.replyToUserName ? (
        <Text style={styles.replyingToText}>
          {t("incident.discussion.replyingTo", { name: reply.replyToUserName })}
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

        <Text style={styles.replyActionText}>{t("incident.discussion.replyAction")}</Text>
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
  const { t } = useI18n();
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
        <Text style={styles.imageHintText}>{t("common.view")}</Text>
      </View>
    </Pressable>
  );
}

export function ImagePreviewModal({
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
