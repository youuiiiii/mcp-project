import {
  addDoc,
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import { db } from "./firebase";
import type { CreateSOSLogPayload, SOSLog } from "../types/incident";

const SOS_LOGS_COLLECTION = "sos_logs";

const normalizeLatitude = (value: unknown): number | null => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  if (value < -90 || value > 90) {
    return null;
  }

  return value;
};

const normalizeLongitude = (value: unknown): number | null => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  if (value < -180 || value > 180) {
    return null;
  }

  return value;
};

const normalizeNullableString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized.length > 0 ? normalized : null;
};

const normalizeNullableNumber = (value: unknown): number | null => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return Math.max(0, value);
};

const toDate = (value: unknown): Date | undefined => {
  if (value instanceof Timestamp) {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  return undefined;
};

const mapSOSDocument = (
  snapshot: QueryDocumentSnapshot<DocumentData>
): SOSLog => {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    latitude: normalizeLatitude(data.latitude) ?? 0,
    longitude: normalizeLongitude(data.longitude) ?? 0,
    nearestIncidentId: normalizeNullableString(data.nearestIncidentId),
    nearestIncidentDistance: normalizeNullableNumber(
      data.nearestIncidentDistance
    ),
    userId: normalizeNullableString(data.userId),
    userName: normalizeNullableString(data.userName),
    userEmail: normalizeNullableString(data.userEmail),
    createdAt: toDate(data.createdAt),
  };
};

export const createSOSLog = async (
  payload: CreateSOSLogPayload
): Promise<string> => {
  const latitude = normalizeLatitude(payload.latitude);
  const longitude = normalizeLongitude(payload.longitude);
  const userId = normalizeNullableString(payload.userId);

  if (latitude === null || longitude === null) {
    throw new Error("Invalid SOS location.");
  }

  if (!userId) {
    throw new Error("Invalid SOS user.");
  }

  const docRef = await addDoc(collection(db, SOS_LOGS_COLLECTION), {
    latitude,
    longitude,
    nearestIncidentId: normalizeNullableString(payload.nearestIncidentId),
    nearestIncidentDistance: normalizeNullableNumber(
      payload.nearestIncidentDistance
    ),
    userId,
    userName: normalizeNullableString(payload.userName),
    userEmail: normalizeNullableString(payload.userEmail),
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

export const subscribeToSOSLogs = (
  onSuccess: (logs: SOSLog[]) => void,
  onError?: (error: Error) => void
) => {
  const sosQuery = query(
    collection(db, SOS_LOGS_COLLECTION),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    sosQuery,
    (snapshot) => {
      const logs = snapshot.docs.map(mapSOSDocument);
      onSuccess(logs);
    },
    (error) => {
      onError?.(error);
    }
  );
};
