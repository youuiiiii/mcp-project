import { useState } from "react";
import { Alert } from "react-native";

import IncidentModalShell from "../features/incident/components/IncidentModalShell";
import IncidentDiscussionList from "../features/incident/thread/IncidentDiscussionList";
import IncidentOverviewCard from "../features/incident/thread/IncidentOverviewCard";
import IncidentReplyComposer from "../features/incident/thread/IncidentReplyComposer";
import ReportContentModal from "../features/incident/thread/ReportContentModal";
import { useIncidentThread } from "../features/incident/thread/useIncidentThread";
import { useAuth } from "../contexts/AuthContext";
import { createIncidentContentReport } from "../services/incidentService";
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

  const openReportContentModal = () => {
    setSelectedReason(null);
    setReportNote("");
    setReportModalVisible(true);
  };

  const closeReportContentModal = () => {
    if (reportSubmitting) {
      return;
    }

    setReportModalVisible(false);
    setSelectedReason(null);
    setReportNote("");
  };

  const submitContentReport = async () => {
    try {
      if (!user) {
        Alert.alert(
          "Belum Login",
          "Silakan login untuk melaporkan konten."
        );
        return;
      }

      if (!selectedReason) {
        Alert.alert("Alasan Belum Dipilih", "Pilih alasan laporan konten.");
        return;
      }

      const actorKey = user.uid || user.email;

      if (!actorKey) {
        Alert.alert("Identitas Tidak Valid", "Akun Anda tidak valid.");
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

      Alert.alert(
        "Konten Dilaporkan",
        "Terima kasih. Laporan ini akan ditinjau."
      );
    } catch (error) {
      Alert.alert(
        "Gagal Melaporkan Konten",
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengirim laporan konten."
      );
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <>
      <IncidentModalShell
        visible={visible}
        title="Detail Laporan"
        subtitle="Informasi kejadian dan update warga."
        onClose={thread.closeThread}
        submitting={thread.replySubmitting}
      >
        <IncidentOverviewCard
          incident={incident}
          onReportContent={openReportContentModal}
        />

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
    </>
  );
}