import {
  collection,
  doc,
  DocumentData,
  increment,
  runTransaction,
  serverTimestamp,
  UpdateData,
} from "firebase/firestore";

import { db } from "../firebase";
import {
  ACCURACY_VOTES_COLLECTION,
  REPLIES_COLLECTION,
  REPORTS_COLLECTION,
} from "./collections";
import {
  normalizeAccuracyVoteType,
  normalizeCommunityUpdateType,
  normalizeNullableString,
} from "./normalizers";
import {
  CreateIncidentAccuracyVotePayload,
  CreateIncidentReplyPayload,
} from "../../types/incident";

export const createIncidentReply = async (
  payload: CreateIncidentReplyPayload
): Promise<string> => {
  if (!payload.reportId) {
    throw new Error("Invalid report ID.");
  }

  if (!payload.actorKey.trim()) {
    throw new Error("Invalid user.");
  }

  if (payload.message.trim().length < 3) {
    throw new Error("Discussion messages must be at least 3 characters.");
  }

  const reportRef = doc(db, REPORTS_COLLECTION, payload.reportId);
  const replyRef = doc(
    collection(db, REPORTS_COLLECTION, payload.reportId, REPLIES_COLLECTION)
  );
  const updateType = normalizeCommunityUpdateType(payload.updateType);
  const parentReplyId = normalizeNullableString(payload.parentReplyId);

  await runTransaction(db, async (transaction) => {
    const reportSnapshot = await transaction.get(reportRef);

    if (!reportSnapshot.exists()) {
      throw new Error("Incident not found.");
    }

    transaction.set(replyRef, {
      message: payload.message.trim(),
      imageUri: normalizeNullableString(payload.imageUri),
      parentReplyId,
      replyToUserName: normalizeNullableString(payload.replyToUserName),
      updateType,
      moderationStatus: "visible",
      userName: normalizeNullableString(payload.userName) ?? "Anonymous",
      userEmail: normalizeNullableString(payload.userEmail),
      actorKey: payload.actorKey,
      createdAt: serverTimestamp(),
    });

    const reportData = reportSnapshot.data();
    const currentConditionUpdateCount = reportData.conditionUpdateCount || 0;

    const reportUpdate: UpdateData<DocumentData> = {
      replyCount: increment(1),
      latestActivityAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (!parentReplyId && updateType !== "additional_info") {
      reportUpdate.latestCommunityUpdateType = updateType;
      reportUpdate.latestCommunityUpdateAt = serverTimestamp();
      reportUpdate.conditionUpdateCount = increment(1);

      // Auto-Resolution: If there are 3 condition updates (including this one), resolve it.
      if (currentConditionUpdateCount + 1 >= 3 && reportData.status === "active") {
        reportUpdate.status = "resolved";
        reportUpdate.resolutionNote = "Auto-resolved by community (3+ updates).";
        reportUpdate.resolvedBy = "System";
        reportUpdate.resolvedAt = serverTimestamp();
      }
    }

    transaction.update(reportRef, reportUpdate);
  });

  return replyRef.id;
};

export const submitIncidentAccuracyVote = async (
  payload: CreateIncidentAccuracyVotePayload
): Promise<void> => {
  if (!payload.reportId.trim()) {
    throw new Error("Invalid report ID.");
  }

  if (!payload.actorKey.trim()) {
    throw new Error("Invalid user.");
  }

  if (payload.proximityStatus !== "near_incident") {
    throw new Error("You need to be near the incident to rate its accuracy.");
  }

  const voteRef = doc(
    db,
    REPORTS_COLLECTION,
    payload.reportId,
    ACCURACY_VOTES_COLLECTION,
    payload.actorKey
  );
  const reportRef = doc(db, REPORTS_COLLECTION, payload.reportId);

  await runTransaction(db, async (transaction) => {
    const reportSnapshot = await transaction.get(reportRef);
    const voteSnapshot = await transaction.get(voteRef);

    if (!reportSnapshot.exists()) {
      throw new Error("Incident not found.");
    }

    const reporterUid = normalizeNullableString(reportSnapshot.data().reporterUid);

    if (reporterUid === payload.actorKey) {
      throw new Error(
        "Your original report is already counted. Ask another nearby user to confirm it."
      );
    }

    const previousVoteType = voteSnapshot.exists()
      ? normalizeAccuracyVoteType(voteSnapshot.data().voteType)
      : null;

    const accurateDelta =
      (payload.voteType === "accurate" ? 1 : 0) -
      (previousVoteType === "accurate" ? 1 : 0);
    const inaccurateDelta =
      (payload.voteType === "inaccurate" ? 1 : 0) -
      (previousVoteType === "inaccurate" ? 1 : 0);

    if (voteSnapshot.exists()) {
      transaction.update(voteRef, {
        voteType: payload.voteType,
        proximityStatus: payload.proximityStatus,
        distanceFromIncidentMeters: payload.distanceFromIncidentMeters,
        locationAccuracyMeters: payload.locationAccuracyMeters,
        updatedAt: serverTimestamp(),
      });
    } else {
      transaction.set(voteRef, {
        voteType: payload.voteType,
        proximityStatus: payload.proximityStatus,
        distanceFromIncidentMeters: payload.distanceFromIncidentMeters,
        locationAccuracyMeters: payload.locationAccuracyMeters,
        actorKey: payload.actorKey,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    const reportData = reportSnapshot.data();
    const currentAccurate = reportData.accurateCount || 0;
    const currentInaccurate = reportData.inaccurateCount || 0;
    const nextAccurate = currentAccurate + accurateDelta;
    const nextInaccurate = currentInaccurate + inaccurateDelta;
    const totalVotes = nextAccurate + nextInaccurate;

    const reportUpdate: UpdateData<DocumentData> = {
      accurateCount: increment(accurateDelta),
      inaccurateCount: increment(inaccurateDelta),
      latestAccuracyVoteAt: serverTimestamp(),
      latestActivityAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Auto-Moderation: If total votes > 5 and > 50% inaccurate, flag it.
    if (totalVotes >= 5 && nextInaccurate / totalVotes > 0.5 && reportData.moderationStatus === "visible") {
      reportUpdate.moderationStatus = "under_review";
      reportUpdate.moderationReason = "Auto-flagged by community accuracy votes.";
    }

    transaction.update(reportRef, reportUpdate);
  });
};

