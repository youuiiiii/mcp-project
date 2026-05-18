import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useEffect, useMemo, useRef, useState } from "react";
import { Linking, Platform } from "react-native";

import { getIncidentDisplayMeta } from "../../../constants/incident";
import { useAuth } from "../../../contexts/AuthContext";
import { uploadImageAsync } from "../../../services/cloudinaryService";
import {
  createIncidentReply,
  submitIncidentAccuracyVote,
  subscribeToIncidentAccuracyVotes,
  subscribeToIncidentReplies,
  subscribeToIncidentVerifications,
} from "../../../services/incidentService";
import type {
  CommunityUpdateType,
  IncidentAccuracyVote,
  IncidentAccuracyVoteType,
  IncidentReply,
  IncidentReport,
  IncidentVerification,
} from "../../../types/incident";
import { getIncidentProximity } from "../../../utils/proximity";
import type { VoteFeedbackStatus } from "./IncidentVoteFeedbackModal";

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
  const [replyImageUri, setReplyImageUri] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<IncidentReply | null>(null);
  const [selectedUpdateType, setSelectedUpdateType] =
    useState<CommunityUpdateType>("additional_info");

  const [replySubmitting, setReplySubmitting] = useState(false);
  const [accuracySubmitting, setAccuracySubmitting] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);

  const [voteFeedbackStatus, setVoteFeedbackStatus] =
    useState<VoteFeedbackStatus>("idle");
  const [voteFeedbackMessage, setVoteFeedbackMessage] = useState<
    string | undefined
  >();

  const voteCooldownRef = useRef(0);

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
      setReplyImageUri(null);
      setReplyingTo(null);
      setSelectedUpdateType("additional_info");
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
    setReplyImageUri(null);
    setReplyingTo(null);
    setSelectedUpdateType("additional_info");
    onClose();
  };

  const pickReplyImage = async () => {
    if (replySubmitting) {
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.75,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.canceled) {
      return;
    }

    const assetUri = result.assets?.[0]?.uri;

    if (assetUri) {
      setReplyImageUri(assetUri);
    }
  };

  const removeReplyImage = () => {
    setReplyImageUri(null);
  };

  const startReplyTo = (reply: IncidentReply) => {
    setReplyingTo(reply);
    setSelectedUpdateType("additional_info");
  };

  const cancelReplyTo = () => {
    setReplyingTo(null);
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
        return;
      }

      const cleanReply = replyText.trim();

      if (cleanReply.length < 3) {
        return;
      }

      setReplySubmitting(true);

      const uploadedImageUrl = replyImageUri
        ? await uploadImageAsync(replyImageUri, "incident-images")
        : null;

      const parentReplyId = replyingTo?.parentReplyId
        ? replyingTo.parentReplyId
        : replyingTo?.id ?? null;

      await createIncidentReply({
        reportId: incident.id,
        message: cleanReply,
        imageUri: uploadedImageUrl,
        parentReplyId,
        replyToUserName: replyingTo?.userName ?? replyingTo?.userEmail ?? null,
        updateType: replyingTo ? "additional_info" : selectedUpdateType,
        userName: user.displayName ?? user.email ?? "Anonymous",
        userEmail: user.email ?? null,
        actorKey: user.uid,
      });

      setReplyText("");
      setReplyImageUri(null);
      setReplyingTo(null);
      setSelectedUpdateType("additional_info");

      Haptics.selectionAsync().catch(() => {});
    } catch (error) {
      console.error("Submit reply error:", error);
    } finally {
      setReplySubmitting(false);
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
    replyImageUri,
    replyingTo,
    selectedUpdateType,
    setSelectedUpdateType,
    replySubmitting,
    replyIsValid,

    accuracySubmitting,
    loadingThread,
    isOwnIncident,
    hasUserVerified,

    voteFeedbackStatus,
    voteFeedbackMessage,

    closeThread,
    submitReply,
    submitAccuracy,

    pickReplyImage,
    removeReplyImage,
    startReplyTo,
    cancelReplyTo,

    closeVoteFeedback,
    openLocationSettings,
  };
}
