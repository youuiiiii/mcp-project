import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

import { getIncidentDisplayMeta } from "../../../constants/incident";
import { useAuth } from "../../../contexts/AuthContext";
import {
  createIncidentReply,
  reopenIncidentReport,
  subscribeToIncidentReplies,
  subscribeToIncidentVerifications,
} from "../../../services/incidentService";
import type {
  IncidentReply,
  IncidentReport,
  IncidentVerification,
} from "../../../types/incident";

type UseIncidentThreadParams = {
  visible: boolean;
  incident: IncidentReport | null;
  onClose: () => void;
};

export function useIncidentThread({
  visible,
  incident,
  onClose,
}: UseIncidentThreadParams) {
  const { user } = useAuth();

  const [verifications, setVerifications] = useState<IncidentVerification[]>(
    []
  );
  const [replies, setReplies] = useState<IncidentReply[]>([]);
  const [replyText, setReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);

  const actorKey = user?.email ?? user?.uid ?? null;

  const meta = useMemo(() => {
    if (!incident) {
      return null;
    }

    return getIncidentDisplayMeta({
      category: incident.category,
      subcategory: incident.subcategory ?? incident.type,
    });
  }, [incident]);

  useEffect(() => {
    if (!visible || !incident) {
      setVerifications([]);
      setReplies([]);
      setReplyText("");
      setLoadingThread(false);
      return;
    }

    setLoadingThread(true);

    const unsubscribeVerifications = subscribeToIncidentVerifications(
      incident.id,
      (items) => {
        setVerifications(items);
      },
      (error) => {
        console.error("Thread verifications error:", error);
      }
    );

    const unsubscribeReplies = subscribeToIncidentReplies(
      incident.id,
      (items) => {
        setReplies(items);
        setLoadingThread(false);
      },
      (error) => {
        console.error("Thread replies error:", error);
        setLoadingThread(false);
      }
    );

    return () => {
      unsubscribeVerifications();
      unsubscribeReplies();
    };
  }, [visible, incident]);

  const isOwnIncident = useMemo(() => {
    if (!incident || !actorKey) {
      return false;
    }

    return (
      incident.reporterEmail === actorKey || incident.reportedBy === actorKey
    );
  }, [incident, actorKey]);

  const hasUserVerified = useMemo(() => {
    if (!actorKey) {
      return false;
    }

    return verifications.some((item) => {
      return (
        item.actorKey === actorKey &&
        (item.verificationType === "valid" ||
          item.verificationType === "invalid")
      );
    });
  }, [verifications, actorKey]);

  const replyIsValid = replyText.trim().length >= 3;

  const closeThread = () => {
    setReplyText("");
    onClose();
  };

  const submitReply = async () => {
    try {
      if (!incident) {
        return;
      }

      if (!user || !actorKey) {
        Alert.alert("Belum Login", "Silakan login untuk ikut diskusi.");
        return;
      }

      const cleanReply = replyText.trim();

      if (cleanReply.length < 3) {
        Alert.alert("Pesan Terlalu Pendek", "Pesan minimal 3 karakter.");
        return;
      }

      setReplySubmitting(true);

      await createIncidentReply({
        reportId: incident.id,
        message: cleanReply,
        userName: user.displayName ?? user.email ?? "Anonymous",
        userEmail: user.email ?? null,
        actorKey,
      });

      setReplyText("");
      Haptics.selectionAsync().catch(() => {});
    } catch (error) {
      Alert.alert(
        "Gagal Mengirim Reply",
        error instanceof Error ? error.message : "Gagal menyimpan diskusi."
      );
    } finally {
      setReplySubmitting(false);
    }
  };

  const reopenIncident = async () => {
    if (!incident) {
      return;
    }

    try {
      await reopenIncidentReport(incident.id);
      Alert.alert("Incident Aktif Lagi", "Status incident berhasil diaktifkan.");
    } catch (error) {
      Alert.alert(
        "Gagal Update",
        error instanceof Error
          ? error.message
          : "Gagal mengaktifkan ulang incident."
      );
    }
  };

  return {
    meta,
    verifications,
    replies,
    replyText,
    setReplyText,
    replySubmitting,
    replyIsValid,
    loadingThread,
    isOwnIncident,
    hasUserVerified,
    closeThread,
    submitReply,
    reopenIncident,
  };
}