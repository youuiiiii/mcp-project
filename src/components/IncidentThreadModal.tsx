import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import IncidentModalShell from "../features/incident/components/IncidentModalShell";
import IncidentOverviewCard from "../features/incident/thread/IncidentOverviewCard";
import IncidentReplyComposer from "../features/incident/thread/IncidentReplyComposer";
import IncidentThreadStats from "../features/incident/thread/IncidentThreadStats";
import IncidentTimeline from "../features/incident/thread/IncidentTimeline";
import { useIncidentThread } from "../features/incident/thread/useIncidentThread";
import { colors } from "../theme/colors";
import { spacing } from "../theme/layout";
import type { IncidentReport } from "../types/incident";
import AppButton from "./ui/AppButton";

type IncidentThreadModalProps = {
  visible: boolean;
  incident: IncidentReport | null;
  onClose: () => void;
  onOpenVerify: (incident: IncidentReport) => void;
  onOpenResolve: (incident: IncidentReport) => void;
};

export default function IncidentThreadModal({
  visible,
  incident,
  onClose,
  onOpenVerify,
  onOpenResolve,
}: IncidentThreadModalProps) {
  const thread = useIncidentThread({
    visible,
    incident,
    onClose,
  });

  if (!incident) {
    return null;
  }

  return (
    <IncidentModalShell
      visible={visible}
      title="Incident Thread"
      subtitle="Kronologi laporan, bukti verifikasi, update kondisi, dan diskusi warga sekitar."
      onClose={thread.closeThread}
      submitting={thread.replySubmitting}
    >
      <IncidentOverviewCard incident={incident} />

      <IncidentThreadStats incident={incident} />

      <View style={styles.actions}>
        <AppButton
          title={
            thread.isOwnIncident
              ? "Update Kondisi"
              : thread.hasUserVerified
                ? "Update Kondisi"
                : "Verifikasi / Update"
          }
          variant="primary"
          size="md"
          onPress={() => onOpenVerify(incident)}
          fullWidth
          leftIcon={
            <Ionicons
              name="shield-checkmark"
              size={18}
              color={colors.textInverse}
            />
          }
          style={styles.primaryAction}
        />

        <AppButton
          title={
            incident.status === "active" ? "Tandai Selesai" : "Aktifkan Lagi"
          }
          variant="secondary"
          size="md"
          onPress={
            incident.status === "active"
              ? () => onOpenResolve(incident)
              : thread.reopenIncident
          }
          fullWidth
          leftIcon={
            <Ionicons
              name={incident.status === "active" ? "checkmark-done" : "refresh"}
              size={18}
              color={colors.text}
            />
          }
          style={styles.secondaryAction}
        />
      </View>

      <IncidentTimeline
        items={thread.timelineItems}
        loading={thread.loadingThread}
      />

      <IncidentReplyComposer
        replyText={thread.replyText}
        replySubmitting={thread.replySubmitting}
        replyIsValid={thread.replyIsValid}
        repliesCount={thread.replies.length}
        onChangeReplyText={thread.setReplyText}
        onSubmitReply={thread.submitReply}
      />
    </IncidentModalShell>
  );
}

const styles = StyleSheet.create({
  actions: {
    marginTop: spacing.md,
    flexDirection: "row",
    gap: spacing.sm,
  },
  primaryAction: {
    flex: 1.4,
  },
  secondaryAction: {
    flex: 1,
  },
});