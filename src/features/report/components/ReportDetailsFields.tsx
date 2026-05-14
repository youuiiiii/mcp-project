import { StyleSheet, TextInput, View } from "react-native";

import SectionHeader from "../../../components/ui/SectionHeader";
import StatusBadge from "../../../components/ui/StatusBadge";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";

type ReportDetailsFieldsProps = {
  title: string;
  description: string;
  disabled?: boolean;
  onChangeTitle: (value: string) => void;
  onChangeDescription: (value: string) => void;
};

export default function ReportDetailsFields({
  title,
  description,
  disabled = false,
  onChangeTitle,
  onChangeDescription,
}: ReportDetailsFieldsProps) {
  const cleanTitleLength = title.trim().length;
  const cleanDescriptionLength = description.trim().length;

  return (
    <View style={styles.section}>
      <SectionHeader
        title="2. Detail Kejadian"
        subtitle="Judul dan deskripsi adalah sumber detail utama laporan."
      />

      <TextInput
        value={title}
        onChangeText={onChangeTitle}
        editable={!disabled}
        placeholder="Contoh: Pohon tumbang menutup jalan utama"
        placeholderTextColor={colors.textSoft}
        style={styles.input}
      />

      <StatusBadge
        label={`${cleanTitleLength}/5 minimum karakter`}
        variant={cleanTitleLength >= 5 ? "success" : "neutral"}
        size="sm"
      />

      <TextInput
        value={description}
        onChangeText={onChangeDescription}
        editable={!disabled}
        placeholder="Jelaskan situasi, kondisi sekitar, dampak, dan hal penting yang perlu diketahui."
        placeholderTextColor={colors.textSoft}
        multiline
        textAlignVertical="top"
        style={[styles.input, styles.textArea]}
      />

      <StatusBadge
        label={`${cleanDescriptionLength}/10 minimum karakter`}
        variant={cleanDescriptionLength >= 10 ? "success" : "neutral"}
        size="sm"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: 13,
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  textArea: {
    minHeight: 120,
    lineHeight: 20,
  },
});