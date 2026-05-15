import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";

type IncidentReplyComposerProps = {
  replyText: string;
  replySubmitting: boolean;
  replyIsValid: boolean;
  repliesCount: number;
  onChangeReplyText: (value: string) => void;
  onSubmitReply: () => void;
};

export default function IncidentReplyComposer({
  replyText,
  replySubmitting,
  replyIsValid,
  onChangeReplyText,
  onSubmitReply,
}: IncidentReplyComposerProps) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        value={replyText}
        onChangeText={onChangeReplyText}
        editable={!replySubmitting}
        placeholder="Tulis update..."
        placeholderTextColor={colors.textSoft}
        multiline
        maxLength={280}
        style={styles.input}
      />

      <Pressable
        disabled={!replyIsValid || replySubmitting}
        onPress={onSubmitReply}
        style={({ pressed }) => [
          styles.sendButton,
          (!replyIsValid || replySubmitting) && styles.sendButtonDisabled,
          pressed && replyIsValid && !replySubmitting && styles.sendButtonPressed,
        ]}
      >
        <Ionicons name="send" size={17} color={colors.textInverse} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing["2xl"],
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius["2xl"],
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    maxHeight: 96,
    minHeight: 42,
    paddingHorizontal: spacing.md,
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
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
  sendButtonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.96 }],
  },
});