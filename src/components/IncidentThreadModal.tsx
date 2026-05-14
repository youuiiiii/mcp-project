import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import IncidentModalShell from "../features/incident/components/IncidentModalShell";
import IncidentDiscussionList from "../features/incident/thread/IncidentDiscussionList";
import IncidentOverviewCard from "../features/incident/thread/IncidentOverviewCard";
import IncidentReplyComposer from "../features/incident/thread/IncidentReplyComposer";
import { useIncidentThread } from "../features/incident/thread/useIncidentThread";
import { colors } from "../theme/colors";
import { spacing } from "../theme/layout";
import type { IncidentReport } from "../types/incident";
import AppButton from "./ui/AppButton";

type IncidentThreadModalProps = {
  visible: boolean;
  incident: IncidentReport | null;
  onClose: () => void;
  showActions?: boolean;
  onOpenVerify?: (incident: IncidentReport) => void;
  onOpenResolve?: (incident: IncidentReport) => void;
};

export default function IncidentThreadModal({
  visible,
  incident,
  onClose,
  showActions = false,
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

  const canShowResolveAction =
    showActions && incident.status === "active" && Boolean(onOpenResolve);

  const canShowReopenAction = showActions && incident.status === "resolved";

  const canShowVerifyAction = showActions && Boolean(onOpenVerify);

  const shouldShowActions =
    canShowVerifyAction || canShowResolveAction || canShowReopenAction;

  return (
    <IncidentModalShell
      visible={visible}
      title="Incident Detail"
      subtitle="Detail laporan dan diskusi warga."
      onClose={thread.closeThread}
      submitting={thread.replySubmitting}
    >
      <IncidentOverviewCard incident={incident} />

      {shouldShowActions ? (
        <View style={styles.actions}>
          {canShowVerifyAction ? (
            <AppButton
              title={
                thread.isOwnIncident
                  ? "Update Kondisi"
                  : thread.hasUserVerified
                    ? "Update Kondisi"
                    : "Verifikasi"
              }
              variant="primary"
              size="md"
              onPress={() => onOpenVerify?.(incident)}
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
          ) : null}

          {canShowResolveAction ? (
            <AppButton
              title="Selesai"
              variant="secondary"
              size="md"
              onPress={() => onOpenResolve?.(incident)}
              fullWidth
              leftIcon={
                <Ionicons
                  name="checkmark-done"
                  size={18}
                  color={colors.text}
                />
              }
              style={styles.secondaryAction}
            />
          ) : null}

          {canShowReopenAction ? (
            <AppButton
              title="Aktifkan Lagi"
              variant="secondary"
              size="md"
              onPress={thread.reopenIncident}
              fullWidth
              leftIcon={
                <Ionicons name="refresh" size={18} color={colors.text} />
              }
              style={styles.secondaryAction}
            />
          ) : null}
        </View>
      ) : null}

      <IncidentDiscussionList
        replies={thread.replies}
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