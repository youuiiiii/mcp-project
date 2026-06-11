import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import AppButton from "../../../components/ui/AppButton";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import type { IncidentReply } from "../../../types/incident";
import { useI18n } from "../../../i18n";

type IncidentReplyComposerProps = {
  replyText: string;
  replyImageUri: string | null;
  replyingTo: IncidentReply | null;
  replySubmitting: boolean;
  replyIsValid: boolean;
  onChangeReplyText: (value: string) => void;
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
  onChangeReplyText,
  onTakePhoto,
  onPickImage,
  onRemoveImage,
  onCancelReplyTo,
  onSubmitReply,
}: IncidentReplyComposerProps) {
  const { t } = useI18n();
  const targetName =
    replyingTo?.userName || replyingTo?.userEmail || t("incident.replyComposer.defaultTarget");

  return (
    <View style={styles.wrapper}>
      {replyingTo ? (
        <View style={styles.replyingToBox}>
          <View style={styles.replyingTextGroup}>
            <Text style={styles.replyingLabel}>{t("incident.replyComposer.replyingLabel")}</Text>
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
            replyingTo
              ? t("incident.replyComposer.placeholderReply")
              : t("incident.replyComposer.placeholderComment")
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
