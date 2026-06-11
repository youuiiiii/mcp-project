import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

import EvidencePicker from "../features/incident/components/EvidencePicker";
import IncidentModalShell from "../features/incident/components/IncidentModalShell";
import IncidentCard from "./IncidentCard";
import { colors } from "../theme/colors";
import AppButton from "./ui/AppButton";
import SectionHeader from "./ui/SectionHeader";
import StatusBadge from "./ui/StatusBadge";
import { SelectableOptionCard } from "./verifyIncident/SelectableOptionCard";
import type { VerifyIncidentModalProps } from "./verifyIncident/types";
import { useVerifyIncidentModal } from "./verifyIncident/useVerifyIncidentModal";
import { verifyIncidentModalStyles as styles } from "./verifyIncident/verifyIncidentModalStyles";
import { VERIFICATION_OPTIONS } from "./verifyIncident/verificationOptions";
import { useI18n } from "../../i18n";

export default function VerifyIncidentModal(props: VerifyIncidentModalProps) {
  const { visible, incident } = props;
  const {
    verificationType,
    setVerificationType,
    conditionStatus,
    setConditionStatus,
    conditionOptions,
    note,
    setNote,
    imageUri,
    setImageUri,
    submitting,
    canSubmit,
    handleClose,
    handleTakePhoto,
    handlePickFromGallery,
    handleSubmit,
  } = useVerifyIncidentModal(props);
  const { t } = useI18n();

  return (
    <IncidentModalShell
      visible={visible}
      title={t("incident.verify.title")}
      subtitle={t("incident.verify.subtitle")}
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
            title={t("incident.verify.submit")}
            variant="primary"
            size="lg"
            loading={submitting}
            disabled={!canSubmit}
            onPress={handleSubmit}
            leftIcon={
              <Ionicons name="send" size={18} color={colors.textInverse} />
            }
            style={styles.footerSubmitButton}
          />
        </>
      }
    >
      {incident ? <IncidentCard incident={incident} compact /> : null}

      <View style={styles.section}>
        <SectionHeader
          title={t("incident.verify.typeTitle")}
          subtitle={t("incident.verify.typeSubtitle")}
        />

        <View style={styles.optionList}>
          {VERIFICATION_OPTIONS.map((item) => (
            <SelectableOptionCard
              key={item.value}
              label={t(item.label as any)}
              description={t(item.description as any)}
              icon={item.icon}
              color={item.color}
              active={verificationType === item.value}
              disabled={submitting}
              onPress={() => setVerificationType(item.value)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          title={t("incident.verify.conditionTitle")}
          subtitle={t("incident.verify.conditionSubtitle")}
        />

        <View style={styles.optionList}>
          {conditionOptions.map((item) => (
            <SelectableOptionCard
              key={item.value}
              label={t(item.label as any)}
              description={t(item.description as any)}
              icon={item.icon}
              color={item.color}
              active={conditionStatus === item.value}
              disabled={submitting}
              onPress={() => setConditionStatus(item.value)}
            />
          ))}
        </View>
      </View>

      <EvidencePicker
        title={t("incident.verify.photoTitle")}
        subtitle={t("incident.verify.photoSubtitle")}
        emptyTitle={t("incident.verify.photoEmpty")}
        emptyMessage={t("incident.verify.photoEmptyDesc")}
        imageUri={imageUri}
        disabled={submitting}
        onTakePhoto={handleTakePhoto}
        onPickFromGallery={handlePickFromGallery}
        onRemoveImage={() => setImageUri(null)}
      />

      <View style={styles.section}>
        <SectionHeader
          title={t("incident.verify.notesTitle")}
          subtitle={t("incident.verify.notesSubtitle")}
        />

        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder={t("incident.verify.notesPlaceholder")}
          placeholderTextColor={colors.textSoft}
          style={styles.input}
          multiline
          textAlignVertical="top"
          editable={!submitting}
        />

        <StatusBadge
          label={note.trim().length >= 8 ? t("incident.verify.notesSufficient") : t("incident.verify.notesMin")}
          variant={note.trim().length >= 8 ? "success" : "neutral"}
          size="sm"
        />
      </View>
    </IncidentModalShell>
  );
}
