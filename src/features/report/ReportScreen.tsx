import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import AppButton from "../../components/ui/AppButton";
import AppScreen from "../../components/ui/AppScreen";
import StatusBadge from "../../components/ui/StatusBadge";
import { useI18n } from "../../i18n";
import { colors } from "../../theme/colors";
import { shadow, spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";
import ImpactQuestionSelector from "./components/ImpactQuestionSelector";
import IncidentKindSelector from "./components/IncidentKindSelector";
import IncidentLocationPickerModal from "./components/IncidentLocationPickerModal";
import ReportDetailsFields from "./components/ReportDetailsFields";
import ReportEvidenceSection from "./components/ReportEvidenceSection";
import ReportLocationNotice from "./components/ReportLocationNotice";
import { useReportForm } from "./hooks/useReportForm";

export default function ReportScreen() {
  const form = useReportForm();
  const { t } = useI18n();
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);

  const handleOpenLocationPicker = async () => {
    const nextLocation =
      form.incidentLocation ?? (await form.useCurrentLocationForIncident());

    if (!nextLocation) {
      Alert.alert(
        t("report.validation.locationPermission.title"),
        t("report.validation.locationPermission.message")
      );
      return;
    }

    setLocationPickerVisible(true);
  };

  return (
    <>
      <AppScreen keyboardAvoiding contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <StatusBadge
            label={t("report.header.badge")}
            variant="danger"
            size="sm"
          />
          <Text style={styles.title}>{t("report.header.title")}</Text>
          <Text style={styles.subtitle}>{t("report.header.subtitle")}</Text>
        </View>

        <ReportLocationNotice
          incidentLocation={form.incidentLocation}
          disabled={form.loading}
          loadingLocation={form.loadingLocation}
          onUseCurrentLocation={form.useCurrentLocationForIncident}
          onAdjustPin={handleOpenLocationPicker}
        />

        <IncidentKindSelector
          selectedKind={form.kind}
          disabled={form.loading}
          onSelectKind={form.setKind}
        />

        <ImpactQuestionSelector
          answers={form.impactAnswers}
          disabled={form.loading}
          onToggleAnswer={form.toggleImpactAnswer}
        />

        <ReportDetailsFields
          title={form.title}
          description={form.description}
          disabled={form.loading}
          onChangeTitle={form.setTitle}
          onChangeDescription={form.setDescription}
        />

        <ReportEvidenceSection
          photoUris={form.photoUris}
          disabled={form.loading}
          onTakePhoto={form.takePhoto}
          onPickFromGallery={form.pickFromGallery}
          onRemovePhoto={form.removePhoto}
        />

        <AppButton
          title={
            form.loading ? t("report.submit.loading") : t("report.submit.idle")
          }
          variant="danger"
          size="lg"
          fullWidth
          loading={form.loading}
          disabled={!form.canSubmit}
          onPress={form.handleSubmit}
          style={styles.submitButton}
          leftIcon={
            form.loading ? null : (
              <Ionicons name="send" size={18} color={colors.textInverse} />
            )
          }
        />
      </AppScreen>

      <IncidentLocationPickerModal
        visible={locationPickerVisible}
        incidentLocation={form.incidentLocation}
        onClose={() => setLocationPickerVisible(false)}
        onConfirm={form.updateManualIncidentLocation}
      />
    </>
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
