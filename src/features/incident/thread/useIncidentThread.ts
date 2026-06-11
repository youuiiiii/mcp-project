import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Linking, Platform } from "react-native";

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
  IncidentAccuracyVote,
  IncidentAccuracyVoteType,
  IncidentReply,
  IncidentReport,
  IncidentVerification,
} from "../../../types/incident";
import { getIncidentProximity } from "../../../utils/proximity";
import {
  buildAccuracySummary,
  getAccuracyErrorMessage,
} from "./incidentThreadHelpers";
import {
  pickReplyImageFromGallery,
  takeReplyImagePhoto,
} from "./incidentThreadMedia";
export type VoteFeedbackStatus =
  | "idle"
  | "verifying"
  | "error_no_permission"
  | "error_location_off"
  | "error_too_far"
  | "error"
  | "success";
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

  useEffect(() => {
    if (!visible || !incident) {
      setVerifications([]);
      setReplies([]);
      setAccuracyVotes([]);
      setReplyText("");
      setReplyImageUri(null);
      setReplyingTo(null);
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
      incident.reporterUid === user.uid ||
      incident.reporterEmail === user.email ||
      incident.reportedBy === user.displayName ||
      incident.reportedBy === user.email
    );
  }, [incident, user]);

  const accuracySummary = useMemo(() => {
    return buildAccuracySummary(accuracyVotes, actorKey);
  }, [accuracyVotes, actorKey]);

  const replyIsValid =
    replyText.trim().length >= 3 || Boolean(replyImageUri);

  const closeThread = () => {
    setReplyText("");
    setReplyImageUri(null);
    setReplyingTo(null);
    onClose();
  };

  const pickReplyImage = async () => {
    if (replySubmitting) {
      return;
    }

    const assetUri = await pickReplyImageFromGallery();

    if (assetUri) {
      setReplyImageUri(assetUri);
    }
  };

  const takeReplyPhoto = async () => {
    if (replySubmitting) {
      return;
    }

    const assetUri = await takeReplyImagePhoto();

    if (assetUri) {
      setReplyImageUri(assetUri);
    }
  };

  const removeReplyImage = () => {
    setReplyImageUri(null);
  };

  const startReplyTo = (reply: IncidentReply) => {
    setReplyingTo(reply);
  };

  const cancelReplyTo = () => {
    setReplyingTo(null);
  };

  const submitAccuracy = async (voteType: IncidentAccuracyVoteType) => {
    try {
      if (!incident) {
        return;
      }

      if (isOwnIncident) {
        setVoteFeedbackStatus("error");
        setVoteFeedbackMessage(
          "Your original report is already counted. Ask another nearby user to confirm it."
        );
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
        setVoteFeedbackMessage("Please log in to rate this report.");
        return;
      }

      setAccuracySubmitting(true);
      setVoteFeedbackMessage(undefined);
      setVoteFeedbackStatus("verifying");

      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setVoteFeedbackStatus("error_no_permission");
        return;
      }

      const servicesEnabled = await Location.hasServicesEnabledAsync();

      if (!servicesEnabled) {
        if (Platform.OS === "android") {
          try {
            await Location.enableNetworkProviderAsync();
          } catch {
            setVoteFeedbackStatus("error_location_off");
            return;
          }

          const enabledAfterPrompt = await Location.hasServicesEnabledAsync();

          if (!enabledAfterPrompt) {
            setVoteFeedbackStatus("error_location_off");
            return;
          }
        } else {
          setVoteFeedbackStatus("error_location_off");
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
        setVoteFeedbackStatus("error_too_far");
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
        getAccuracyErrorMessage(error)
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
      const fallbackReply = replyingTo
        ? "Shared an image."
        : "Shared an image.";
      const replyMessage =
        cleanReply.length >= 3 ? cleanReply : replyImageUri ? fallbackReply : "";

      if (replyMessage.length < 3) {
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
        message: replyMessage,
        imageUri: uploadedImageUrl,
        parentReplyId,
        replyToUserName: replyingTo?.userName ?? replyingTo?.userEmail ?? null,
        updateType: "additional_info",
        userName: user.displayName ?? user.email ?? "Anonymous",
        userEmail: user.email ?? null,
        actorKey: user.uid,
      });

      setReplyText("");
      setReplyImageUri(null);
      setReplyingTo(null);

      Haptics.selectionAsync().catch(() => {});
    } catch (error) {
      console.error("Submit reply error:", error);
      Alert.alert(
        "Could Not Send Update",
        error instanceof Error
          ? error.message
          : "Something went wrong while sending the update."
      );
    } finally {
      setReplySubmitting(false);
    }
  };

  const closeVoteFeedback = () => {
    if (voteFeedbackStatus === "verifying") {
      return;
    }

    setVoteFeedbackStatus("idle");
    setVoteFeedbackMessage(undefined);
  };

  const openLocationSettings = () => {
    Linking.openSettings().catch(() => {
      setVoteFeedbackStatus("error");
      setVoteFeedbackMessage("Could not open location settings.");
    });
  };

  return {
    verifications,
    replies,
    accuracyVotes,
    accuracySummary,

    replyText,
    setReplyText,
    replyImageUri,
    replyingTo,
    replySubmitting,
    replyIsValid,

    accuracySubmitting,
    loadingThread,
    isOwnIncident,

    voteFeedbackStatus,
    voteFeedbackMessage,

    closeThread,
    submitReply,
    submitAccuracy,

    pickReplyImage,
    takeReplyPhoto,
    removeReplyImage,
    startReplyTo,
    cancelReplyTo,

    closeVoteFeedback,
    openLocationSettings,
  };
}
