import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

import AppButton from "../../../components/ui/AppButton";
import AppCard from "../../../components/ui/AppCard";
import SectionHeader from "../../../components/ui/SectionHeader";
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
    <View style={styles.section}>
      <SectionHeader
        title="Add Reply"
        subtitle="Tambahkan informasi singkat jika ada update kondisi."
      />

      <AppCard style={styles.card}>
        <TextInput
          value={replyText}
          onChangeText={onChangeReplyText}
          editable={!replySubmitting}
          placeholder="Tulis update singkat..."
          placeholderTextColor={colors.textSoft}
          multiline
          textAlignVertical="top"
          style={styles.input}
        />

        <AppButton
          title="Kirim"
          variant="primary"
          size="md"
          loading={replySubmitting}
          disabled={!replyIsValid || replySubmitting}
          onPress={onSubmitReply}
          leftIcon={
            <Ionicons name="send" size={16} color={colors.textInverse} />
          }
          style={styles.submitButton}
        />
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing["2xl"],
    gap: spacing.md,
  },
  card: {
    gap: spacing.md,
  },
  input: {
    minHeight: 86,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    color: colors.text,
    textAlignVertical: "top",
    backgroundColor: colors.surface,
  },
  submitButton: {
    alignSelf: "flex-end",
    minWidth: 128,
  },
});