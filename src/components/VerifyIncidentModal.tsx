import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

import EvidencePicker from "../features/incident/components/EvidencePicker";
import IncidentModalShell from "../features/incident/components/IncidentModalShell";
import IncidentPreviewCard from "../features/incident/components/IncidentPreviewCard";
import { colors } from "../theme/colors";
import AppButton from "./ui/AppButton";
import SectionHeader from "./ui/SectionHeader";
import StatusBadge from "./ui/StatusBadge";
import { SelectableOptionCard } from "./verifyIncident/SelectableOptionCard";
import type { VerifyIncidentModalProps } from "./verifyIncident/types";
import { useVerifyIncidentModal } from "./verifyIncident/useVerifyIncidentModal";
import { verifyIncidentModalStyles as styles } from "./verifyIncident/verifyIncidentModalStyles";
import { VERIFICATION_OPTIONS } from "./verifyIncident/verificationOptions";

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

  return (
    <IncidentModalShell
      visible={visible}
      title="Verification / Condition Update"
      subtitle="Send a fresh evidence photo and condition notes from the location."
      submitting={submitting}
      onClose={handleClose}
      footer={
        <>
          <AppButton
            title="Cancel"
            variant="secondary"
            size="lg"
            disabled={submitting}
            onPress={handleClose}
            style={styles.footerCancelButton}
          />

          <AppButton
            title="Send to Timeline"
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
      {incident ? <IncidentPreviewCard incident={incident} /> : null}

      <View style={styles.section}>
        <SectionHeader
          title="Contribution Type"
          subtitle="Choose whether you are confirming, disputing, or updating the condition."
        />

        <View style={styles.optionList}>
          {VERIFICATION_OPTIONS.map((item) => (
            <SelectableOptionCard
              key={item.value}
              label={item.label}
              description={item.description}
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
          title="Latest Condition"
          subtitle="Choose the condition that best matches the location."
        />

        <View style={styles.optionList}>
          {conditionOptions.map((item) => (
            <SelectableOptionCard
              key={item.value}
              label={item.label}
              description={item.description}
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
        title="Latest Evidence Photo"
        subtitle="A photo is required to prove the latest incident condition."
        emptyTitle="No photo yet"
        emptyMessage="A photo is required to prove the latest incident condition."
        imageUri={imageUri}
        disabled={submitting}
        onTakePhoto={handleTakePhoto}
        onPickFromGallery={handlePickFromGallery}
        onRemoveImage={() => setImageUri(null)}
      />

      <View style={styles.section}>
        <SectionHeader
          title="Condition Notes"
          subtitle="Write short and clear notes based on the on-site condition."
        />

        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Example: The incident is still active, but one lane can be used."
          placeholderTextColor={colors.textSoft}
          style={styles.input}
          multiline
          textAlignVertical="top"
          editable={!submitting}
        />

        <StatusBadge
          label={`${Math.max(note.trim().length, 0)}/8 minimum characters`}
          variant={note.trim().length >= 8 ? "success" : "neutral"}
          size="sm"
        />
      </View>
    </IncidentModalShell>
  );
}
