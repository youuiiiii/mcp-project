import { StyleSheet, TextInput, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import SectionHeader from "../../../components/ui/SectionHeader";
import { useI18n } from "../../../i18n";
import { colors } from "../../../theme/colors";
import { radius, shadow, spacing } from "../../../theme/layout";

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

  const QUICK_TITLES = [
    "Banjir Bandang",
    "Pohon Tumbang",
    "Kebakaran Ruko",
    "Tanah Longsor",
    "Kecelakaan Lalu Lintas",
  ];

  return (
    <View style={styles.section}>
      <SectionHeader
        title={t("report.details.title")}
        subtitle={t("report.details.subtitle")}
      />

      {/* Title Field */}
      <View style={styles.inputContainer}>
        <View style={styles.labelRow}>
          <View style={styles.iconLabel}>
            <Ionicons name="document-text-outline" size={16} color={colors.primary} />
            <Text style={styles.labelText}>Judul Laporan</Text>
          </View>
          <Text style={[styles.charCounter, title.length > 50 && styles.charWarning]}>
            {title.length}/50
          </Text>
        </View>
        <TextInput
          value={title}
          onChangeText={onChangeTitle}
          editable={!disabled}
          placeholder={t("report.details.titlePlaceholder")}
          placeholderTextColor={colors.textSoft}
          maxLength={50}
          style={styles.input}
        />
        
        {/* Quick Suggestion Chips */}
        <View style={styles.chipsContainer}>
          {QUICK_TITLES.map((suggestion) => (
            <TouchableOpacity
              key={suggestion}
              disabled={disabled}
              onPress={() => onChangeTitle(suggestion)}
              style={styles.chip}
            >
              <Text style={styles.chipText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Description Field */}
      <View style={styles.inputContainer}>
        <View style={styles.labelRow}>
          <View style={styles.iconLabel}>
            <Ionicons name="chatbox-ellipses-outline" size={16} color={colors.primary} />
            <Text style={styles.labelText}>Deskripsi Kejadian</Text>
          </View>
          <Text style={[styles.charCounter, description.length > 500 && styles.charWarning]}>
            {description.length}/500
          </Text>
        </View>
        <TextInput
          value={description}
          onChangeText={onChangeDescription}
          editable={!disabled}
          placeholder={t("report.details.descriptionPlaceholder")}
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
          <Text style={styles.infoItem}>• Berikan informasi keadaan sejelas mungkin.</Text>
          <Text style={styles.infoItem}>• Tuliskan korban atau dampak jalanan bila ada.</Text>
          <Text style={styles.infoItem}>• Lampirkan foto asli dari lokasi kejadian.</Text>
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
