import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "../../components/ui/AppButton";
import AppScreen from "../../components/ui/AppScreen";
import StatusBadge from "../../components/ui/StatusBadge";
import { colors } from "../../theme/colors";
import { shadow, spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";
import CategorySelector from "./components/CategorySelector";
import ReportDetailsFields from "./components/ReportDetailsFields";
import ReportEvidenceSection from "./components/ReportEvidenceSection";
import ReportLocationNotice from "./components/ReportLocationNotice";
import SeveritySelector from "./components/SeveritySelector";
import SubcategorySelector from "./components/SubcategorySelector";
import { useReportForm } from "./hooks/useReportForm";

export default function ReportScreen() {
  const form = useReportForm();

  return (
    <AppScreen keyboardAvoiding contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <StatusBadge label="Community Report" variant="danger" size="sm" />
        <Text style={styles.title}>Report Incident</Text>
        <Text style={styles.subtitle}>
          Laporkan kejadian dari lokasi Anda saat ini. Setelah terkirim,
          laporan akan muncul sebagai pin di Map.
        </Text>
      </View>

      <ReportLocationNotice />

      <CategorySelector
        selectedCategory={form.category}
        disabled={form.loading}
        onSelectCategory={form.setCategory}
      />

      {form.category === "missing_lost" && (
        <SubcategorySelector
          category={form.category}
          selectedSubcategory={form.subcategory}
          disabled={form.loading}
          onSelectSubcategory={form.setSubcategory}
        />
      )}

      <ReportDetailsFields
        title={form.title}
        description={form.description}
        disabled={form.loading}
        onChangeTitle={form.setTitle}
        onChangeDescription={form.setDescription}
      />

      <SeveritySelector
        selectedSeverity={form.severity}
        disabled={form.loading}
        onSelectSeverity={form.setSeverity}
      />

      <ReportEvidenceSection
        photoUris={form.photoUris}
        disabled={form.loading}
        onTakePhoto={form.takePhoto}
        onPickFromGallery={form.pickFromGallery}
        onRemovePhoto={form.removePhoto}
      />

      <AppButton
        title={form.loading ? "Mengirim..." : "Submit Report"}
        variant="danger"
        size="lg"
        fullWidth
        loading={form.loading}
        disabled={form.loading}
        onPress={form.handleSubmit}
        style={styles.submitButton}
        leftIcon={
          form.loading ? null : (
            <Ionicons name="send" size={18} color={colors.textInverse} />
          )
        }
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing["2xl"],
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    ...typography.hero,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  submitButton: {
    ...shadow.floating,
    shadowColor: colors.primaryDark,
  },
});