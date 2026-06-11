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
      title="Incident Verification"
      subtitle="Help the community by confirming or updating the condition of this incident."
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
            title="Submit Verification"
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
          title="Verification Type"
          subtitle="Choose whether you are confirming, disputing, or updating the incident."
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
          title="Current Condition"
          subtitle="Select the condition that best matches the situation on the ground."
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
        title="Recent Evidence Photo"
        subtitle="A photo is required as evidence of the current condition."
        emptyTitle="No photo added"
        emptyMessage="Add a photo to support your verification."
        imageUri={imageUri}
        disabled={submitting}
        onTakePhoto={handleTakePhoto}
        onPickFromGallery={handlePickFromGallery}
        onRemoveImage={() => setImageUri(null)}
      />

      <View style={styles.section}>
        <SectionHeader
          title="Condition Notes"
          subtitle="Write a brief note about the condition you observe at the location."
        />

        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Example: Road is still blocked, one lane is passable."
          placeholderTextColor={colors.textSoft}
          style={styles.input}
          multiline
          textAlignVertical="top"
          editable={!submitting}
        />

        <StatusBadge
          label={note.trim().length >= 8 ? "Notes are sufficient" : "Minimum 8 characters"}
          variant={note.trim().length >= 8 ? "success" : "neutral"}
          size="sm"
        />
      </View>
    </IncidentModalShell>
  );
}
