import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, View } from "react-native";

import AppButton from "../../../components/ui/AppButton";
import AppCard from "../../../components/ui/AppCard";
import SectionHeader from "../../../components/ui/SectionHeader";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";

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
  repliesCount,
  onChangeReplyText,
  onSubmitReply,
}: IncidentReplyComposerProps) {
  return (
    <View style={styles.section}>
      <SectionHeader
        title="Discussion"
        subtitle="Tambahkan update kondisi, rute alternatif, atau informasi lapangan."
        style={styles.sectionHeader}
      />

      <AppCard style={styles.inputBox}>
        <TextInput
          value={replyText}
          onChangeText={onChangeReplyText}
          editable={!replySubmitting}
          placeholder="Tulis update atau diskusi tentang incident..."
          placeholderTextColor={colors.textSoft}
          multiline
          textAlignVertical="top"
          style={styles.input}
        />

        <AppButton
          title="Kirim Reply"
          variant="primary"
          size="md"
          loading={replySubmitting}
          disabled={!replyIsValid || replySubmitting}
          onPress={onSubmitReply}
          leftIcon={
            <Ionicons name="send" size={17} color={colors.textInverse} />
          }
        />
      </AppCard>

      {repliesCount === 0 ? (
        <AppCard variant="muted" style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>Belum ada diskusi</Text>
          <Text style={styles.emptyText}>
            Tambahkan update kondisi, rute alternatif, atau informasi lapangan.
          </Text>
        </AppCard>
      ) : null}
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
  inputBox: {
    gap: spacing.md,
  },
  input: {
    minHeight: 92,
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    textAlignVertical: "top",
  },
  emptyBox: {
    marginTop: spacing.md,
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