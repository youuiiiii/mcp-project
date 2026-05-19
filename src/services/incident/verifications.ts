import {
  arrayUnion,
  collection,
  doc,
  DocumentData,
  runTransaction,
  serverTimestamp,
  UpdateData,
} from "firebase/firestore";

import { db } from "../firebase";
import {
  REPORTS_COLLECTION,
  VERIFICATIONS_COLLECTION,
} from "./collections";
import {
  getNextVerificationStatus,
  normalizeCount,
  normalizeNullableString,
  normalizeStringArray,
} from "./normalizers";
import { CreateIncidentVerificationPayload } from "../../types/incident";

export const createIncidentVerification = async (
  payload: CreateIncidentVerificationPayload
): Promise<string> => {
  if (!payload.reportId) {
    throw new Error("Invalid report ID.");
  }

  if (!payload.actorKey.trim()) {
    throw new Error("Invalid verifier.");
  }

  if (!payload.imageUri) {
    throw new Error("A verification photo is required.");
  }

  if (payload.note.trim().length < 8) {
    throw new Error("Verification notes must be at least 8 characters.");
  }

  const actorKey = payload.actorKey.trim();
  const isCountedVerification =
    payload.verificationType === "valid" ||
    payload.verificationType === "invalid";
  const reportRef = doc(db, REPORTS_COLLECTION, payload.reportId);
  const verificationsCollectionRef = collection(
    db,
    REPORTS_COLLECTION,
    payload.reportId,
    VERIFICATIONS_COLLECTION
  );

  const verificationRef = isCountedVerification
    ? doc(verificationsCollectionRef, actorKey)
    : doc(verificationsCollectionRef);

  await runTransaction(db, async (transaction) => {
    const reportSnapshot = await transaction.get(reportRef);
    const existingVerificationSnapshot = isCountedVerification
      ? await transaction.get(verificationRef)
      : null;

    if (!reportSnapshot.exists()) {
      throw new Error("Incident not found.");
    }

    const reportData = reportSnapshot.data();
    const reporterUid = normalizeNullableString(reportData.reporterUid);
    const alreadyVerified =
      normalizeStringArray(reportData.verifiedBy).includes(actorKey) ||
      normalizeStringArray(reportData.disputedBy).includes(actorKey);

    if (isCountedVerification && reporterUid === actorKey) {
      throw new Error(
        "Your original report is already counted. Ask another nearby user to confirm it."
      );
    }

    if (
      isCountedVerification &&
      (existingVerificationSnapshot?.exists() || alreadyVerified)
    ) {
      throw new Error("You have already verified this incident.");
    }

    const currentVerificationCount = normalizeCount(
      reportData.verificationCount
    );
    const currentDisputeCount = normalizeCount(reportData.disputeCount);
    const currentEvidenceCount = normalizeCount(reportData.evidenceCount);

    const nextVerificationCount =
      payload.verificationType === "valid"
        ? currentVerificationCount + 1
        : currentVerificationCount;

    const nextDisputeCount =
      payload.verificationType === "invalid"
        ? currentDisputeCount + 1
        : currentDisputeCount;

    const nextVerificationStatus = getNextVerificationStatus(
      nextVerificationCount,
      nextDisputeCount
    );

    transaction.set(verificationRef, {
      verificationType: payload.verificationType,
      conditionStatus: payload.conditionStatus,
      note: payload.note.trim(),
      imageUri: payload.imageUri,
      latitude: payload.latitude,
      longitude: payload.longitude,
      userName: normalizeNullableString(payload.userName) ?? "Anonymous",
      userEmail: normalizeNullableString(payload.userEmail),
      actorKey,
      createdAt: serverTimestamp(),
    });

    const updateData: UpdateData<DocumentData> = {
      verificationStatus: nextVerificationStatus,
      verificationCount: nextVerificationCount,
      disputeCount: nextDisputeCount,
      evidenceCount: currentEvidenceCount + 1,
      latestActivityAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (payload.verificationType === "valid") {
      updateData.verifiedBy = arrayUnion(actorKey);
    }

    if (payload.verificationType === "invalid") {
      updateData.disputedBy = arrayUnion(actorKey);
    }

    transaction.update(reportRef, updateData);
  });

  return verificationRef.id;
};

