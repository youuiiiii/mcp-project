import { StyleSheet, Text, TextInput, View } from "react-native";

import SectionHeader from "../../../components/ui/SectionHeader";
import StatusBadge from "../../../components/ui/StatusBadge";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";

type ReportDetailsFieldsProps = {
  title: string;
  description: string;
  disabled: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
};

export default function ReportDetailsFields({
  title,
  description,
  disabled,
  onTitleChange,
  onDescriptionChange,
}: ReportDetailsFieldsProps) {
  const titleLength = title.trim().length;
  const descriptionLength = description.trim().length;

  return (
    <View style={styles.section}>
      <SectionHeader
        title="2. Detail Laporan"
        subtitle="Judul dan deskripsi adalah sumber detail utama laporan."
        style={styles.sectionHeader}
      />

      <Text style={styles.label}>Judul laporan</Text>
      <TextInput
        value={title}
        onChangeText={onTitleChange}
        editable={!disabled}
        placeholder="Contoh: Pohon tumbang menutup jalan utama"
        placeholderTextColor={colors.textSoft}
        style={styles.input}
      />

      <StatusBadge
        label={`${titleLength}/5 minimum karakter`}
        variant={titleLength >= 5 ? "success" : "neutral"}
        size="sm"
      />

      <Text style={styles.label}>Deskripsi</Text>
      <TextInput
        value={description}
        onChangeText={onDescriptionChange}
        editable={!disabled}
        placeholder="Jelaskan situasi, kondisi sekitar, dampak, dan hal penting yang perlu diketahui."
        placeholderTextColor={colors.textSoft}
        multiline
        textAlignVertical="top"
        style={[styles.input, styles.textArea]}
      />

      <StatusBadge
        label={`${descriptionLength}/10 minimum karakter`}
        variant={descriptionLength >= 10 ? "success" : "neutral"}
        size="sm"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    marginBottom: 0,
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginTop: spacing.xs,
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
  },
});