import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import IncidentModalShell from "../features/incident/components/IncidentModalShell";
import IncidentAccuracyPanel from "../features/incident/thread/IncidentAccuracyPanel";
import IncidentDiscussionList from "../features/incident/thread/IncidentDiscussionList";
import IncidentOverviewCard from "../features/incident/thread/IncidentOverviewCard";
import IncidentReplyComposer from "../features/incident/thread/IncidentReplyComposer";
import IncidentTimeline from "../features/incident/thread/IncidentTimeline";
import IncidentVoteFeedbackModal from "../features/incident/thread/IncidentVoteFeedbackModal";
import ReportContentModal from "../features/incident/thread/ReportContentModal";
import { useIncidentThread } from "../features/incident/thread/useIncidentThread";
import { createIncidentContentReport } from "../services/incidentService";
import { shareIncident } from "../utils/shareIncident";
import type {
  IncidentContentReportReason,
  IncidentReport,
} from "../types/incident";

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
}: IncidentThreadModalProps) {
  const { user } = useAuth();

  const thread = useIncidentThread({
    visible,
    incident,
    onClose,
  });

  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] =
    useState<IncidentContentReportReason | null>(null);
  const [reportNote, setReportNote] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  if (!incident) {
    return null;
  }

  const handleShare = () => {
    shareIncident({
      type: incident.title,
      description: incident.description,
      location: {
        lat: incident.latitude,
        lng: incident.longitude,
      },
      createdAt: incident.createdAt,
    });
  };

  const openReportContentModal = () => {
    setSelectedReason(null);
    setReportNote("");
    setReportModalVisible(true);
  };

  const closeReportContentModal = () => {
    if (reportSubmitting) return;
    setReportModalVisible(false);
    setSelectedReason(null);
    setReportNote("");
  };

  const submitContentReport = async () => {
    try {
      if (!user) {
        Alert.alert("Login Required", "Please log in to report content.");
        return;
      }

      if (!selectedReason) {
        Alert.alert("Reason Required", "Choose a content report reason.");
        return;
      }

      const actorKey = user.uid || user.email;

      if (!actorKey) {
        Alert.alert("Invalid Identity", "Your account is invalid.");
        return;
      }

      setReportSubmitting(true);

      await createIncidentContentReport({
        targetType: "incident_report",
        targetId: incident.id,
        reportId: incident.id,
        reason: selectedReason,
        note: reportNote,
        actorKey,
        userName: user.displayName ?? user.email ?? "Anonymous",
        userEmail: user.email ?? null,
      });

      setReportModalVisible(false);
      setSelectedReason(null);
      setReportNote("");

      Alert.alert("Content Reported", "Thank you. This report will be reviewed.");
    } catch (error) {
      Alert.alert(
        "Could Not Report Content",
        error instanceof Error
          ? error.message
          : "Something went wrong while sending the content report."
      );
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <>
      <IncidentModalShell
        visible={visible}
        title="Report Details"
        subtitle="Incident information and community updates."
        onClose={thread.closeThread}
        submitting={thread.replySubmitting}
        headerRight={
          <TouchableOpacity onPress={handleShare} style={{ padding: 8 }}>
            <Ionicons name="share-social-outline" size={22} color="#64748B" />
          </TouchableOpacity>
        }
      >
        <IncidentOverviewCard
          incident={incident}
          onReportContent={openReportContentModal}
        />

        <IncidentTimeline
          incident={incident}
          verifications={thread.verifications}
          replies={thread.replies}
        />

        <IncidentAccuracyPanel
          accurateCount={thread.accuracySummary.accurateCount}
          inaccurateCount={thread.accuracySummary.inaccurateCount}
          currentUserVote={thread.accuracySummary.currentUserVote}
          label={thread.accuracySummary.label}
          tone={thread.accuracySummary.tone}
          submitting={thread.accuracySubmitting}
          onVote={thread.submitAccuracy}
        />

        <IncidentDiscussionList
          replies={thread.replies}
          loading={thread.loadingThread}
          onReplyTo={thread.startReplyTo}
        />

        <IncidentReplyComposer
          replyText={thread.replyText}
          replyImageUri={thread.replyImageUri}
          replyingTo={thread.replyingTo}
          selectedUpdateType={thread.selectedUpdateType}
          replySubmitting={thread.replySubmitting}
          replyIsValid={thread.replyIsValid}
          repliesCount={thread.replies.length}
          onChangeReplyText={thread.setReplyText}
          onChangeUpdateType={thread.setSelectedUpdateType}
          onTakePhoto={thread.takeReplyPhoto}
          onPickImage={thread.pickReplyImage}
          onRemoveImage={thread.removeReplyImage}
          onCancelReplyTo={thread.cancelReplyTo}
          onSubmitReply={thread.submitReply}
        />
      </IncidentModalShell>

      <ReportContentModal
        visible={reportModalVisible}
        selectedReason={selectedReason}
        note={reportNote}
        submitting={reportSubmitting}
        onSelectReason={setSelectedReason}
        onChangeNote={setReportNote}
        onSubmit={submitContentReport}
        onClose={closeReportContentModal}
      />

      <IncidentVoteFeedbackModal
        visible={thread.voteFeedbackStatus !== "idle"}
        status={thread.voteFeedbackStatus}
        message={thread.voteFeedbackMessage}
        onClose={thread.closeVoteFeedback}
        onOpenSettings={thread.openLocationSettings}
      />
    </>
  );
}
