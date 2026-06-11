import { Ionicons } from "@expo/vector-icons";
import { Text, View , StyleSheet , TextInput } from "react-native";

import EvidencePicker from "../features/incident/components/EvidencePicker";
import IncidentModalShell from "../features/incident/components/IncidentModalShell";
import IncidentCard from "./IncidentCard";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/layout";
import { useResolveIncidentModal } from "./resolveIncident/useResolveIncidentModal";
import { resolveIncidentModalStyles as styles } from "./resolveIncident/resolveIncidentModalStyles";
import type { ResolveIncidentModalProps } from "./resolveIncident/types";
import AppButton from "./ui/AppButton";
import SectionHeader from "./ui/SectionHeader";
import StatusBadge from "./ui/StatusBadge";
import { useI18n } from "../i18n";

export default function ResolveIncidentModal(props: ResolveIncidentModalProps) {
  const { visible, incident } = props;
  const {
    resolutionNote,
    setResolutionNote,
    imageUri,
    setImageUri,
    submitting,
    canSubmit,
    handleClose,
    handleTakePhoto,
    handlePickFromGallery,
    handleSubmit,
  } = useResolveIncidentModal(props);
  const { t } = useI18n();

  return (
    <IncidentModalShell
      visible={visible}
      title={t("incident.resolve.title")}
      subtitle={t("incident.resolve.subtitle")}
      submitting={submitting}
      onClose={handleClose}
      footer={
        <>
          <AppButton
            title={t("common.cancel")}
            variant="secondary"
            size="lg"
            disabled={submitting}
            onPress={handleClose}
            style={styles.footerCancelButton}
          />

          <AppButton
            title={t("incident.resolve.submit")}
            variant="primary"
            size="lg"
            loading={submitting}
            disabled={!canSubmit}
            onPress={handleSubmit}
            leftIcon={
              <Ionicons
                name="checkmark-done"
                size={18}
                color={colors.textInverse}
              />
            }
            style={styles.footerSubmitButton}
          />
        </>
      }
    >
      {incident ? <IncidentCard incident={incident} compact /> : null}

      {/* Notice / validation warning */}
      <View style={localStyles.noticeCard}>
        <Ionicons name="information-circle" size={18} color={colors.warningDark} />
        <Text style={localStyles.noticeText}>
          {t("incident.resolve.notice")}
        </Text>
      </View>

      <EvidencePicker
        title={t("incident.resolve.photoTitle")}
        subtitle={t("incident.resolve.photoSubtitle")}
        emptyTitle={t("incident.resolve.photoEmpty")}
        emptyMessage={t("incident.resolve.photoEmptyDesc")}
        imageUri={imageUri}
        disabled={submitting}
        onTakePhoto={handleTakePhoto}
        onPickFromGallery={handlePickFromGallery}
        onRemoveImage={() => setImageUri(null)}
      />

      <View style={styles.section}>
        <SectionHeader
          title={t("incident.resolve.notesTitle")}
          subtitle={t("incident.resolve.notesSubtitle")}
        />

        <TextInput
          value={resolutionNote}
          onChangeText={setResolutionNote}
          placeholder={t("incident.resolve.notesPlaceholder")}
          placeholderTextColor={colors.textSoft}
          style={styles.input}
          multiline
          textAlignVertical="top"
          editable={!submitting}
        />

        <StatusBadge
          label={resolutionNote.trim().length >= 10 ? t("incident.resolve.notesSufficient") : t("incident.resolve.notesMin")}
          variant={resolutionNote.trim().length >= 10 ? "success" : "neutral"}
          size="sm"
        />
      </View>
    </IncidentModalShell>
  );
}

const localStyles = StyleSheet.create({
  noticeCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    backgroundColor: colors.warningSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    color: colors.warningDark,
  },
});
