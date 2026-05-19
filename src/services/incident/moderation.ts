import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../firebase";
import {
  INCIDENT_CONTENT_REPORTS_COLLECTION,
  REPORTS_COLLECTION,
} from "./collections";
import { mapIncidentContentReportDocument } from "./mappers";
import { normalizeNullableString } from "./normalizers";
import {
  CreateIncidentContentReportPayload,
  IncidentContentReport,
} from "../../types/incident";

export const createIncidentContentReport = async (
  payload: CreateIncidentContentReportPayload
) => {
  if (!payload.reportId.trim()) {
    throw new Error("Invalid report ID.");
  }

  if (!payload.targetId.trim()) {
    throw new Error("Invalid content target.");
  }

  if (!payload.actorKey.trim()) {
    throw new Error("Invalid content reporter identity.");
  }

  await addDoc(collection(db, INCIDENT_CONTENT_REPORTS_COLLECTION), {
    targetType: payload.targetType,
    targetId: payload.targetId,
    reportId: payload.reportId,
    reason: payload.reason,
    note: payload.note?.trim() || null,
    actorKey: payload.actorKey,
    userName: normalizeNullableString(payload.userName),
    userEmail: normalizeNullableString(payload.userEmail),
    status: "open",
    reviewedBy: null,
    reviewedAt: null,
    createdAt: serverTimestamp(),
  });
};

export const subscribeToOpenContentReports = (
  onSuccess: (reports: IncidentContentReport[]) => void,
  onError?: (error: Error) => void
) => {
  const reportsQuery = query(
    collection(db, INCIDENT_CONTENT_REPORTS_COLLECTION),
    where("status", "==", "open"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    reportsQuery,
    (snapshot) => {
      const reports = snapshot.docs.map(mapIncidentContentReportDocument);
      onSuccess(reports);
    },
    (error) => {
      onError?.(error);
    }
  );
};

export const hideIncidentReport = async ({
  reportId,
  reason,
  moderatedBy,
}: {
  reportId: string;
  reason: string;
  moderatedBy: string;
}) => {
  if (!reportId.trim()) {
    throw new Error("Invalid report ID.");
  }

  await updateDoc(doc(db, REPORTS_COLLECTION, reportId), {
    moderationStatus: "hidden",
    moderationReason: reason.trim() || null,
    moderatedBy,
    moderatedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const dismissIncidentContentReport = async ({
  contentReportId,
  reviewedBy,
}: {
  contentReportId: string;
  reviewedBy: string;
}) => {
  if (!contentReportId.trim()) {
    throw new Error("Invalid content report ID.");
  }

  await updateDoc(
    doc(db, INCIDENT_CONTENT_REPORTS_COLLECTION, contentReportId),
    {
      status: "dismissed",
      reviewedBy,
      reviewedAt: serverTimestamp(),
    }
  );
};

export const markIncidentContentReportReviewed = async ({
  contentReportId,
  reviewedBy,
}: {
  contentReportId: string;
  reviewedBy: string;
}) => {
  if (!contentReportId.trim()) {
    throw new Error("Invalid content report ID.");
  }

  await updateDoc(
    doc(db, INCIDENT_CONTENT_REPORTS_COLLECTION, contentReportId),
    {
      status: "reviewed",
      reviewedBy,
      reviewedAt: serverTimestamp(),
    }
  );
};

