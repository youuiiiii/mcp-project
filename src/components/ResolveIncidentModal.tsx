import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

import EvidencePicker from "../features/incident/components/EvidencePicker";
import IncidentModalShell from "../features/incident/components/IncidentModalShell";
import IncidentPreviewCard from "../features/incident/components/IncidentPreviewCard";
import { colors } from "../theme/colors";
import { useResolveIncidentModal } from "./resolveIncident/useResolveIncidentModal";
import { resolveIncidentModalStyles as styles } from "./resolveIncident/resolveIncidentModalStyles";
import type { ResolveIncidentModalProps } from "./resolveIncident/types";
import AppButton from "./ui/AppButton";
import AppCard from "./ui/AppCard";
import SectionHeader from "./ui/SectionHeader";
import StatusBadge from "./ui/StatusBadge";

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

  return (
    <IncidentModalShell
      visible={visible}
      title="Moderator Resolution"
      subtitle="Upload evidence and notes before closing this report."
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
            title="Mark Resolved"
            variant="danger"
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
      {incident ? <IncidentPreviewCard incident={incident} /> : null}

      <AppCard variant="muted" style={styles.noticeCard}>
        <StatusBadge label="Validation Required" variant="warning" size="sm" />

        <View style={styles.noticeTextGroup}>
          <Ionicons name="warning" size={20} color={colors.warningDark} />
          <TextInput
            editable={false}
            multiline
            value="The photo should match the report and show that the location is safe, cleared, or no longer disrupting nearby activity."
            style={styles.noticeText}
          />
        </View>
      </AppCard>

      <EvidencePicker
        title="Resolution Evidence Photo"
        subtitle="Upload a fresh photo as evidence that the incident is resolved."
        emptyTitle="No resolution evidence yet"
        emptyMessage="Upload a fresh photo as evidence that the incident is resolved."
        imageUri={imageUri}
        disabled={submitting}
        onTakePhoto={handleTakePhoto}
        onPickFromGallery={handlePickFromGallery}
        onRemoveImage={() => setImageUri(null)}
      />

      <View style={styles.section}>
        <SectionHeader
          title="Resolution Notes"
          subtitle="Explain why this report can be marked resolved."
        />

        <TextInput
          value={resolutionNote}
          onChangeText={setResolutionNote}
          placeholder="Example: The road has been cleared and vehicles can pass."
          placeholderTextColor={colors.textSoft}
          style={styles.input}
          multiline
          textAlignVertical="top"
          editable={!submitting}
        />

        <StatusBadge
          label={`${Math.max(
            resolutionNote.trim().length,
            0
          )}/10 minimum characters`}
          variant={resolutionNote.trim().length >= 10 ? "success" : "neutral"}
          size="sm"
        />
      </View>
    </IncidentModalShell>
  );
}
