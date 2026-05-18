import { StyleSheet, TextInput, View } from "react-native";

import SectionHeader from "../../../components/ui/SectionHeader";
import { useI18n } from "../../../i18n";
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
  const { t } = useI18n();

  return (
    <View style={styles.section}>
      <SectionHeader
        title={t("report.details.title")}
        subtitle={t("report.details.subtitle")}
      />

      <TextInput
        value={title}
        onChangeText={onChangeTitle}
        editable={!disabled}
        placeholder={t("report.details.titlePlaceholder")}
        placeholderTextColor={colors.textSoft}
        style={styles.input}
      />

      <TextInput
        value={description}
        onChangeText={onChangeDescription}
        editable={!disabled}
        placeholder={t("report.details.descriptionPlaceholder")}
        placeholderTextColor={colors.textSoft}
        multiline
        textAlignVertical="top"
        style={[styles.input, styles.textArea]}
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
