import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import AppButton from "../../../components/ui/AppButton";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import type { CommunityUpdateType, IncidentReply } from "../../../types/incident";
import {
  COMMUNITY_UPDATE_OPTIONS,
  getCommunityUpdateMeta,
} from "./threadLabels";

type IncidentReplyComposerProps = {
  replyText: string;
  replyImageUri: string | null;
  replyingTo: IncidentReply | null;
  replySubmitting: boolean;
  replyIsValid: boolean;
  repliesCount: number;
  selectedUpdateType: CommunityUpdateType;
  onChangeReplyText: (value: string) => void;
  onChangeUpdateType: (value: CommunityUpdateType) => void;
  onTakePhoto: () => void;
  onPickImage: () => void;
  onRemoveImage: () => void;
  onCancelReplyTo: () => void;
  onSubmitReply: () => void;
};

export default function IncidentReplyComposer({
  replyText,
  replyImageUri,
  replyingTo,
  replySubmitting,
  replyIsValid,
  selectedUpdateType,
  onChangeReplyText,
  onChangeUpdateType,
  onTakePhoto,
  onPickImage,
  onRemoveImage,
  onCancelReplyTo,
  onSubmitReply,
}: IncidentReplyComposerProps) {
  const targetName =
    replyingTo?.userName || replyingTo?.userEmail || "this comment";

  return (
    <View style={styles.wrapper}>
      {replyingTo ? (
        <View style={styles.replyingToBox}>
          <View style={styles.replyingTextGroup}>
            <Text style={styles.replyingLabel}>Replying to</Text>
            <Text style={styles.replyingName} numberOfLines={1}>
              {targetName}
            </Text>
          </View>

          <Pressable
            disabled={replySubmitting}
            onPress={onCancelReplyTo}
            style={({ pressed }) => [
              styles.cancelReplyButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="close" size={16} color={colors.textMuted} />
          </Pressable>
        </View>
      ) : null}

      {!replyingTo ? (
        <View style={styles.updateTypeSection}>
          <Text style={styles.updateTypeLabel}>Condition at location</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.updateTypeList}
          >
            {COMMUNITY_UPDATE_OPTIONS.map((updateType) => {
              const meta = getCommunityUpdateMeta(updateType);
              const selected = selectedUpdateType === updateType;

              return (
                <Pressable
                  key={updateType}
                  disabled={replySubmitting}
                  onPress={() => onChangeUpdateType(updateType)}
                  style={({ pressed }) => [
                    styles.updateTypeChip,
                    selected && {
                      backgroundColor: meta.color,
                      borderColor: meta.color,
                    },
                    pressed && styles.pressed,
                    replySubmitting && styles.disabled,
                  ]}
                >
                  <Ionicons
                    name={meta.iconName}
                    size={14}
                    color={selected ? colors.textInverse : meta.color}
                  />

                  <Text
                    style={[
                      styles.updateTypeChipText,
                      selected && styles.updateTypeChipTextSelected,
                    ]}
                  >
                    {meta.shortLabel}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}

      {replyImageUri ? (
        <View style={styles.imagePreviewWrapper}>
          <Image source={{ uri: replyImageUri }} style={styles.imagePreview} />

          <Pressable
            disabled={replySubmitting}
            onPress={onRemoveImage}
            style={({ pressed }) => [
              styles.removeImageButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="close" size={16} color={colors.textInverse} />
          </Pressable>
        </View>
      ) : null}

      <View style={styles.inputRow}>
        <Pressable
          disabled={replySubmitting}
          onPress={onTakePhoto}
          style={({ pressed }) => [
            styles.imageButton,
            pressed && styles.pressed,
            replySubmitting && styles.disabled,
          ]}
        >
          <Ionicons name="camera-outline" size={20} color={colors.textMuted} />
        </Pressable>

        <Pressable
          disabled={replySubmitting}
          onPress={onPickImage}
          style={({ pressed }) => [
            styles.imageButton,
            pressed && styles.pressed,
            replySubmitting && styles.disabled,
          ]}
        >
          <Ionicons name="image-outline" size={20} color={colors.textMuted} />
        </Pressable>

        <TextInput
          value={replyText}
          onChangeText={onChangeReplyText}
          editable={!replySubmitting}
          placeholder={
            replyingTo ? "Write a reply..." : "Write a condition update..."
          }
          placeholderTextColor={colors.textSoft}
          multiline
          maxLength={280}
          style={styles.input}
        />

        <AppButton
          title=""
          variant="primary"
          size="md"
          disabled={!replyIsValid || replySubmitting}
          loading={replySubmitting}
          onPress={onSubmitReply}
          style={styles.sendButton}
          leftIcon={
            <Ionicons name="send" size={17} color={colors.textInverse} />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing["2xl"],
    gap: spacing.sm,
  },
  replyingToBox: {
    borderRadius: radius.xl,
    backgroundColor: colors.infoSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  updateTypeSection: {
    gap: spacing.xs,
  },
  updateTypeLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.textMuted,
    textTransform: "uppercase",
  },
  updateTypeList: {
    gap: spacing.xs,
    paddingRight: spacing.md,
  },
  updateTypeChip: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  updateTypeChipText: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.text,
  },
  updateTypeChipTextSelected: {
    color: colors.textInverse,
  },
  replyingTextGroup: {
    flex: 1,
  },
  replyingLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.info,
  },
  replyingName: {
    marginTop: 1,
    fontSize: 13,
    fontWeight: "900",
    color: colors.text,
  },
  cancelReplyButton: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePreviewWrapper: {
    width: 132,
    height: 100,
    borderRadius: radius.xl,
    overflow: "hidden",
    backgroundColor: colors.border,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    right: spacing.xs,
    top: spacing.xs,
    width: 26,
    height: 26,
    borderRadius: radius.full,
    backgroundColor: "rgba(15, 23, 42, 0.72)",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius["2xl"],
    backgroundColor: colors.surface,
  },
  imageButton: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    maxHeight: 96,
    minHeight: 42,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    color: colors.text,
    textAlignVertical: "top",
  },
  sendButton: {
    width: 42,
    height: 42,
    paddingHorizontal: 0,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.96 }],
  },
  disabled: {
    opacity: 0.55,
  },
});
