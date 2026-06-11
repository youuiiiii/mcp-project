import { StyleSheet, TextInput, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import SectionHeader from "../../../components/ui/SectionHeader";
import { useI18n } from "../../../i18n";
import { colors } from "../../../theme/colors";
import { radius, shadow, spacing } from "../../../theme/layout";

type ReportDetailsFieldsProps = {
  description: string;
  disabled?: boolean;
  onChangeDescription: (value: string) => void;
};

export default function ReportDetailsFields({
  description,
  disabled = false,
  onChangeDescription,
}: ReportDetailsFieldsProps) {
  const { t } = useI18n();

  return (
    <View style={styles.section}>
      <SectionHeader
        title="Detail Tambahan"
        subtitle="Berikan informasi lebih spesifik jika diperlukan."
      />

      {/* Description Field */}
      <View style={styles.inputContainer}>
        <View style={styles.labelRow}>
          <View style={styles.iconLabel}>
            <Ionicons name="chatbox-ellipses-outline" size={16} color={colors.primary} />
            <Text style={styles.labelText}>Catatan (Opsional)</Text>
          </View>
          <Text style={[styles.charCounter, description.length > 500 && styles.charWarning]}>
            {description.length}/500
          </Text>
        </View>
        <TextInput
          value={description}
          onChangeText={onChangeDescription}
          editable={!disabled}
          placeholder="Misal: Ada pohon tumbang yang menutupi jalan utama..."
          placeholderTextColor={colors.textSoft}
          multiline
          maxLength={500}
          textAlignVertical="top"
          style={[styles.input, styles.textArea]}
        />
      </View>

      {/* Information / Guidelines Card to fill the empty space */}
      <View style={styles.infoCard}>
        <View style={styles.infoTitleRow}>
          <Ionicons name="information-circle" size={18} color={colors.warning} />
          <Text style={styles.infoTitle}>Panduan Pelaporan Darurat</Text>
        </View>
        <View style={styles.infoBody}>
          <Text style={styles.infoItem}>• Detail yang lengkap membantu tim respons.</Text>
          <Text style={styles.infoItem}>• Tuliskan korban atau jalanan yang terpengaruh bila ada.</Text>
          <Text style={styles.infoItem}>• Abaikan bagian ini jika situasi mendesak.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.lg,
  },
  inputContainer: {
    gap: spacing.xs,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  iconLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  labelText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  charCounter: {
    fontSize: 11,
    color: colors.textSoft,
  },
  charWarning: {
    color: colors.danger,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    ...shadow.card,
  },
  textArea: {
    minHeight: 100,
    lineHeight: 20,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "600",
  },
  infoCard: {
    backgroundColor: colors.warningSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    gap: 6,
    marginTop: 4,
  },
  infoTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.warningDark,
  },
  infoBody: {
    gap: 2,
  },
  infoItem: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
    paddingLeft: 4,
  },
});
