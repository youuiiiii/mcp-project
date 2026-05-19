import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

import { ResolveIncidentPayload } from "../../types/incident";
import { db } from "../firebase";
import { REPORTS_COLLECTION } from "./collections";
import { normalizeNullableString } from "./normalizers";

export const resolveIncidentReport = async (
  payload: ResolveIncidentPayload
): Promise<void> => {
  if (!payload.reportId) {
    throw new Error("Invalid report ID.");
  }

  if (!payload.resolvedImageUri) {
    throw new Error("A resolution photo is required.");
  }

  if (payload.resolutionNote.trim().length < 10) {
    throw new Error("Resolution notes must be at least 10 characters.");
  }

  if (!payload.resolvedByActorKey.trim()) {
    throw new Error("Invalid resolver.");
  }

  const reportRef = doc(db, REPORTS_COLLECTION, payload.reportId);

  await updateDoc(reportRef, {
    status: "resolved",
    resolvedImageUri: payload.resolvedImageUri,
    resolutionNote: payload.resolutionNote.trim(),
    resolvedBy: normalizeNullableString(payload.resolvedBy) ?? "Anonymous",
    resolvedByActorKey: payload.resolvedByActorKey.trim(),
    resolvedAt: serverTimestamp(),
    latestActivityAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const reopenIncidentReport = async (
  reportId: string
): Promise<void> => {
  if (!reportId) {
    throw new Error("Invalid report ID.");
  }

  const reportRef = doc(db, REPORTS_COLLECTION, reportId);

  await updateDoc(reportRef, {
    status: "active",
    resolvedImageUri: null,
    resolutionNote: null,
    resolvedBy: null,
    resolvedByActorKey: null,
    resolvedAt: null,
    latestActivityAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

