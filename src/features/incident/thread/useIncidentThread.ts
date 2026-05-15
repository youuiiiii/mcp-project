import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";
import { Linking } from "react-native";
import type { VoteFeedbackStatus } from "./IncidentVoteFeedbackModal";
import { Platform } from "react-native";

import { getIncidentDisplayMeta } from "../../../constants/incident";
import { useAuth } from "../../../contexts/AuthContext";
import {
  createIncidentReply,
  reopenIncidentReport,
  submitIncidentAccuracyVote,
  subscribeToIncidentAccuracyVotes,
  subscribeToIncidentReplies,
  subscribeToIncidentVerifications,
} from "../../../services/incidentService";
import type {
  IncidentAccuracyVote,
  IncidentAccuracyVoteType,
  IncidentReply,
  IncidentReport,
  IncidentVerification,
} from "../../../types/incident";
import { getIncidentProximity } from "../../../utils/proximity";

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
  const [accuracyVotes, setAccuracyVotes] = useState<IncidentAccuracyVote[]>(
    []
  );
  const [replyText, setReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [accuracySubmitting, setAccuracySubmitting] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);
  const lastAccuracyActionAtRef = useRef(0);

  const [voteFeedbackStatus, setVoteFeedbackStatus] =
  useState<VoteFeedbackStatus>("idle");
  const [voteFeedbackMessage, setVoteFeedbackMessage] = useState<string | undefined>();

  const voteCooldownRef = useRef(0);

  const proximityCacheRef = useRef<{
    incidentId: string;
    createdAtMs: number;
    proximityStatus: "near_incident" | "not_near_incident" | "unknown";
    distanceFromIncidentMeters: number;
    locationAccuracyMeters: number;
  } | null>(null);

  const actorKey = user?.uid ?? null;
  

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
      setAccuracyVotes([]);
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

    const unsubscribeAccuracyVotes = subscribeToIncidentAccuracyVotes(
      incident.id,
      (items) => {
        setAccuracyVotes(items);
      },
      (error) => {
        console.error("Thread accuracy votes error:", error);
      }
    );

    return () => {
      unsubscribeVerifications();
      unsubscribeReplies();
      unsubscribeAccuracyVotes();
    };
  }, [visible, incident]);

  const isOwnIncident = useMemo(() => {
    if (!incident || !user) {
      return false;
    }

    return (
      incident.reporterEmail === user.email ||
      incident.reportedBy === user.displayName ||
      incident.reportedBy === user.email
    );
  }, [incident, user]);

  const hasUserVerified = useMemo(() => {
    if (!user?.uid && !user?.email) {
      return false;
    }

    return verifications.some((item) => {
      return (
        (item.actorKey === user.uid || item.actorKey === user.email) &&
        (item.verificationType === "valid" ||
          item.verificationType === "invalid")
      );
    });
  }, [verifications, user]);

  const accuracySummary = useMemo(() => {
    const accurateCount = accuracyVotes.filter((item) => {
      return item.voteType === "accurate";
    }).length;

    const inaccurateCount = accuracyVotes.filter((item) => {
      return item.voteType === "inaccurate";
    }).length;

    const currentUserVote =
      accuracyVotes.find((item) => item.actorKey === actorKey)?.voteType ??
      null;

    let label = "Belum diverifikasi";
    let tone: "neutral" | "success" | "warning" | "danger" = "neutral";

    if (accurateCount >= 2 && accurateCount > inaccurateCount) {
      label = "Dikonfirmasi warga";
      tone = "success";
    } else if (inaccurateCount >= 2 && inaccurateCount > accurateCount) {
      label = "Dipertanyakan";
      tone = "danger";
    } else if (accurateCount > 0 || inaccurateCount > 0) {
      label = "Menunggu lebih banyak sinyal";
      tone = "warning";
    }

    return {
      accurateCount,
      inaccurateCount,
      currentUserVote,
      label,
      tone,
    };
  }, [accuracyVotes, actorKey]);

  const replyIsValid = replyText.trim().length >= 3;

  const closeThread = () => {
    setReplyText("");
    onClose();
  };

  const submitAccuracy = async (voteType: IncidentAccuracyVoteType) => {
    try {
      if (!incident) {
        return;
      }

      if (accuracySubmitting) {
        return;
      }

      if (accuracySummary.currentUserVote === voteType) {
        return;
      }

      const now = Date.now();

      if (now - voteCooldownRef.current < 1000) {
        return;
      }

      voteCooldownRef.current = now;

      if (!user?.uid) {
        setVoteFeedbackStatus("error");
        setVoteFeedbackMessage("Silakan login untuk menilai laporan.");
        return;
      }

      setAccuracySubmitting(true);
      setVoteFeedbackMessage(undefined);
      setVoteFeedbackStatus("checking");

      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setVoteFeedbackStatus("location_denied");
        return;
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync();

      if (!servicesEnabled) {
        if (Platform.OS === "android") {
          try {
            await Location.enableNetworkProviderAsync();
          } catch {
            setVoteFeedbackStatus("location_off");
            return;
          }

          const enabledAfterPrompt = await Location.hasServicesEnabledAsync();

          if (!enabledAfterPrompt) {
            setVoteFeedbackStatus("location_off");
            return;
          }
        } else {
          setVoteFeedbackStatus("location_off");
          return;
        }
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const proximity = getIncidentProximity({
        userLocation: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
        incidentLocation: {
          latitude: incident.latitude,
          longitude: incident.longitude,
        },
      });

      if (proximity.proximityStatus !== "near_incident") {
        setVoteFeedbackStatus("too_far");
        return;
      }

      await submitIncidentAccuracyVote({
        reportId: incident.id,
        voteType,
        proximityStatus: proximity.proximityStatus,
        distanceFromIncidentMeters: proximity.distanceFromIncidentMeters,
        locationAccuracyMeters:
          typeof currentLocation.coords.accuracy === "number"
            ? Math.round(currentLocation.coords.accuracy)
            : 0,
        actorKey: user.uid,
      });

      setVoteFeedbackStatus("success");

      setTimeout(() => {
        setVoteFeedbackStatus("idle");
      }, 650);

      Haptics.selectionAsync().catch(() => {});
    } catch (error) {
      setVoteFeedbackStatus("error");
      setVoteFeedbackMessage(
        error instanceof Error ? error.message : "Gagal menyimpan penilaian."
      );
    } finally {
      setAccuracySubmitting(false);
    }
  };
  const submitReply = async () => {
    try {
      if (!incident) {
        return;
      }

      if (!user?.uid) {
        Alert.alert("Belum Login", "Silakan login untuk ikut komentar.");
        return;
      }

      const cleanReply = replyText.trim();

      if (cleanReply.length < 3) {
        Alert.alert("Komentar Terlalu Pendek", "Komentar minimal 3 karakter.");
        return;
      }

      setReplySubmitting(true);

      await createIncidentReply({
        reportId: incident.id,
        message: cleanReply,
        updateType: "additional_info",
        userName: user.displayName ?? user.email ?? "Anonymous",
        userEmail: user.email ?? null,
        actorKey: user.uid,
      });

      setReplyText("");
      Haptics.selectionAsync().catch(() => {});
    } catch (error) {
      Alert.alert(
        "Gagal Mengirim Komentar",
        error instanceof Error ? error.message : "Gagal menyimpan komentar."
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

  const closeVoteFeedback = () => {
    if (voteFeedbackStatus === "checking") {
      return;
    }

    setVoteFeedbackStatus("idle");
    setVoteFeedbackMessage(undefined);
  };

  const openLocationSettings = () => {
    Linking.openSettings().catch(() => {
      setVoteFeedbackStatus("error");
      setVoteFeedbackMessage("Gagal membuka pengaturan lokasi.");
    });
  };

  return {
    meta,
    verifications,
    replies,
    accuracyVotes,
    accuracySummary,
    replyText,
    setReplyText,
    replySubmitting,
    replyIsValid,
    accuracySubmitting,
    loadingThread,
    isOwnIncident,
    hasUserVerified,
    closeThread,
    submitReply,
    submitAccuracy,
    reopenIncident,
    voteFeedbackStatus,
    voteFeedbackMessage,
    closeVoteFeedback,
    openLocationSettings,
  };
}