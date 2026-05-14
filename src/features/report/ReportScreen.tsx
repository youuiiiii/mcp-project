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
import { useReportForm } from "./hooks/useReportForm";

export default function ReportScreen() {
  const form = useReportForm();

  return (
    <AppScreen keyboardAvoiding contentContainerStyle={styles.screenContent}>
      <View style={styles.header}>
        <StatusBadge
          label="Community Report"
          variant="danger"
          size="sm"
          style={styles.headerBadge}
        />

        <Text style={styles.title}>Report Incident</Text>

        <Text style={styles.subtitle}>
          Laporkan kejadian sekitar dengan lokasi realtime dan bukti foto agar
          warga lain dapat ikut memantau.
        </Text>
      </View>

      <CategorySelector value={form.category} onChange={form.setCategory} />

      <ReportDetailsFields
        title={form.title}
        description={form.description}
        disabled={form.loading}
        onTitleChange={form.setTitle}
        onDescriptionChange={form.setDescription}
      />

      <SeveritySelector value={form.severity} onChange={form.setSeverity} />

      <ReportEvidenceSection
        photoUri={form.photoUri}
        disabled={form.loading}
        onTakePhoto={form.takePhoto}
        onPickFromGallery={form.pickFromGallery}
        onRemovePhoto={() => form.setPhotoUri(null)}
      />

      <ReportLocationNotice />

      <AppButton
        title={form.loading ? "Uploading Report..." : "Submit Report"}
        variant="danger"
        size="lg"
        fullWidth
        loading={form.loading}
        disabled={!form.canSubmit}
        onPress={form.handleSubmit}
        leftIcon={
          <Ionicons name="send" size={18} color={colors.textInverse} />
        }
        style={styles.submitButton}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    gap: spacing["2xl"],
  },
  header: {
    gap: spacing.sm,
  },
  headerBadge: {
    marginBottom: spacing.xs,
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