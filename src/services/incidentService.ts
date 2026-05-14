import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  DocumentData,
  increment,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  runTransaction,
  serverTimestamp,
  Timestamp,
  updateDoc,
  UpdateData,
} from "firebase/firestore";

import {
  getCategoryBySubcategory,
  isIncidentCategory,
  isIncidentType,
} from "../constants/incident";
import { db } from "../services/firebase";
import {
  CreateIncidentPayload,
  CreateIncidentReplyPayload,
  CreateIncidentVerificationPayload,
  CreateSOSLogPayload,
  IncidentCategory,
  IncidentConditionStatus,
  IncidentReply,
  IncidentReport,
  IncidentSeverity,
  IncidentStatus,
  IncidentSubcategory,
  IncidentType,
  IncidentVerification,
  ResolveIncidentPayload,
  SOSLog,
  VerificationStatus,
  VerificationType,
} from "../types/incident";

const REPORTS_COLLECTION = "reports";
const SOS_LOGS_COLLECTION = "sos_logs";
const VERIFICATIONS_COLLECTION = "verifications";
const REPLIES_COLLECTION = "replies";

const toDate = (value: unknown): Date | undefined => {
  if (!value) {
    return undefined;
  }

  if (value instanceof Timestamp) {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  return undefined;
};

const normalizeNullableString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
};

const normalizeSubcategory = (
  value: unknown
): IncidentSubcategory | null => {
  if (typeof value === "string" && isIncidentType(value)) {
    return value;
  }

  return null;
};

const normalizeType = (value: unknown): IncidentType | null => {
  if (typeof value === "string" && isIncidentType(value)) {
    return value;
  }

  return null;
};

const normalizeCategory = (input: {
  category: unknown;
  subcategory?: IncidentSubcategory | null;
  type?: IncidentType | null;
}): IncidentCategory | null => {
  if (
    typeof input.category === "string" &&
    isIncidentCategory(input.category)
  ) {
    return input.category;
  }

  if (input.subcategory) {
    return getCategoryBySubcategory(input.subcategory);
  }

  if (input.type) {
    return getCategoryBySubcategory(input.type);
  }

  return null;
};

const isSubcategoryCompatibleWithCategory = (
  subcategory: IncidentSubcategory | IncidentType | null,
  category: IncidentCategory
): boolean => {
  if (!subcategory) {
    return false;
  }

  return getCategoryBySubcategory(subcategory) === category;
};

const normalizeStatus = (value: unknown): IncidentStatus => {
  if (value === "active" || value === "resolved") {
    return value;
  }

  return "active";
};

const normalizeSeverity = (value: unknown): IncidentSeverity => {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }

  return "medium";
};

const isIncidentSeverity = (value: unknown): value is IncidentSeverity => {
  return value === "low" || value === "medium" || value === "high";
};

const normalizeVerificationStatus = (value: unknown): VerificationStatus => {
  if (value === "pending" || value === "verified" || value === "disputed") {
    return value;
  }

  return "pending";
};

const normalizeVerificationType = (value: unknown): VerificationType => {
  if (
    value === "valid" ||
    value === "invalid" ||
    value === "condition_update"
  ) {
    return value;
  }

  return "condition_update";
};

const normalizeConditionStatus = (value: unknown): IncidentConditionStatus => {
  if (
    value === "still_happening" ||
    value === "getting_worse" ||
    value === "partially_resolved" ||
    value === "resolved_but_not_closed" ||
    value === "not_found"
  ) {
    return value;
  }

  return "still_happening";
};

const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
};

const normalizeCount = (value: unknown): number => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, value);
};

const normalizeLatitude = (value: unknown): number | null => {
  if (
    typeof value !== "number" ||
    Number.isNaN(value) ||
    value < -90 ||
    value > 90
  ) {
    return null;
  }

  return value;
};

const normalizeLongitude = (value: unknown): number | null => {
  if (
    typeof value !== "number" ||
    Number.isNaN(value) ||
    value < -180 ||
    value > 180
  ) {
    return null;
  }

  return value;
};

const getNextVerificationStatus = (
  verificationCount: number,
  disputeCount: number
): VerificationStatus => {
  if (disputeCount >= 2 && disputeCount >= verificationCount) {
    return "disputed";
  }

  if (verificationCount >= 2 && verificationCount > disputeCount) {
    return "verified";
  }

  return "pending";
};

const mapIncidentDocument = (
  snapshot: QueryDocumentSnapshot<DocumentData>
): IncidentReport | null => {
  const data = snapshot.data();

  const rawSubcategory = normalizeSubcategory(data.subcategory);
  const rawType = normalizeType(data.type);

  const category = normalizeCategory({
    category: data.category,
    subcategory: rawSubcategory,
    type: rawType,
  });

  if (!category) {
    console.warn("Skipping invalid incident document:", snapshot.id, {
      category: data.category,
      subcategory: data.subcategory,
      type: data.type,
    });

    return null;
  }

  const latitude = normalizeLatitude(data.latitude);
  const longitude = normalizeLongitude(data.longitude);

  if (latitude === null || longitude === null) {
    console.warn("Skipping incident with invalid coordinate:", snapshot.id, {
      latitude: data.latitude,
      longitude: data.longitude,
    });

    return null;
  }

  const subcategory = isSubcategoryCompatibleWithCategory(
    rawSubcategory,
    category
  )
    ? rawSubcategory
    : null;

  const type = isSubcategoryCompatibleWithCategory(rawType, category)
    ? rawType
    : null;

  return {
    id: snapshot.id,

    category,
    subcategory,
    type,

    title: normalizeNullableString(data.title) ?? "Laporan tanpa judul",
    description: normalizeNullableString(data.description) ?? "",
    latitude,
    longitude,
    status: normalizeStatus(data.status),
    severity: normalizeSeverity(data.severity),

    imageUri: normalizeNullableString(data.imageUri),
    address: normalizeNullableString(data.address),
    reportedBy: normalizeNullableString(data.reportedBy),
    reporterEmail: normalizeNullableString(data.reporterEmail),

    verificationStatus: normalizeVerificationStatus(data.verificationStatus),
    verificationCount: normalizeCount(data.verificationCount),
    disputeCount: normalizeCount(data.disputeCount),
    evidenceCount: normalizeCount(data.evidenceCount),
    replyCount: normalizeCount(data.replyCount),
    verifiedBy: normalizeStringArray(data.verifiedBy),
    disputedBy: normalizeStringArray(data.disputedBy),

    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    latestActivityAt: toDate(data.latestActivityAt),

    resolvedImageUri: normalizeNullableString(data.resolvedImageUri),
    resolutionNote: normalizeNullableString(data.resolutionNote),
    resolvedBy: normalizeNullableString(data.resolvedBy),
    resolvedAt: toDate(data.resolvedAt),
  };
};

const mapVerificationDocument = (
  snapshot: QueryDocumentSnapshot<DocumentData>,
  reportId: string
): IncidentVerification => {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    reportId,
    verificationType: normalizeVerificationType(data.verificationType),
    conditionStatus: normalizeConditionStatus(data.conditionStatus),
    note: normalizeNullableString(data.note) ?? "",
    imageUri: normalizeNullableString(data.imageUri) ?? "",
    latitude: normalizeLatitude(data.latitude) ?? 0,
    longitude: normalizeLongitude(data.longitude) ?? 0,
    userName: normalizeNullableString(data.userName),
    userEmail: normalizeNullableString(data.userEmail),
    actorKey: normalizeNullableString(data.actorKey) ?? "",
    createdAt: toDate(data.createdAt),
  };
};

const mapReplyDocument = (
  snapshot: QueryDocumentSnapshot<DocumentData>,
  reportId: string
): IncidentReply => {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    reportId,
    message: normalizeNullableString(data.message) ?? "",
    userName: normalizeNullableString(data.userName),
    userEmail: normalizeNullableString(data.userEmail),
    actorKey: normalizeNullableString(data.actorKey) ?? "",
    createdAt: toDate(data.createdAt),
  };
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
    nearestIncidentDistance:
      typeof data.nearestIncidentDistance === "number" &&
      !Number.isNaN(data.nearestIncidentDistance)
        ? Math.max(0, data.nearestIncidentDistance)
        : null,
    createdAt: toDate(data.createdAt),
  };
};

export const subscribeToIncidents = (
  onSuccess: (reports: IncidentReport[]) => void,
  onError?: (error: Error) => void
) => {
  const reportsQuery = query(
    collection(db, REPORTS_COLLECTION),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    reportsQuery,
    (snapshot) => {
      const reports = snapshot.docs
        .map(mapIncidentDocument)
        .filter((report): report is IncidentReport => report !== null);

      onSuccess(reports);
    },
    (error) => {
      onError?.(error);
    }
  );
};

export const subscribeToIncidentVerifications = (
  reportId: string,
  onSuccess: (items: IncidentVerification[]) => void,
  onError?: (error: Error) => void
) => {
  const verificationsQuery = query(
    collection(db, REPORTS_COLLECTION, reportId, VERIFICATIONS_COLLECTION),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    verificationsQuery,
    (snapshot) => {
      const items = snapshot.docs.map((item) => {
        return mapVerificationDocument(item, reportId);
      });

      onSuccess(items);
    },
    (error) => {
      onError?.(error);
    }
  );
};

export const subscribeToIncidentReplies = (
  reportId: string,
  onSuccess: (items: IncidentReply[]) => void,
  onError?: (error: Error) => void
) => {
  const repliesQuery = query(
    collection(db, REPORTS_COLLECTION, reportId, REPLIES_COLLECTION),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(
    repliesQuery,
    (snapshot) => {
      const items = snapshot.docs.map((item) => {
        return mapReplyDocument(item, reportId);
      });

      onSuccess(items);
    },
    (error) => {
      onError?.(error);
    }
  );
};

export const createIncidentReport = async (
  payload: CreateIncidentPayload
): Promise<string> => {
  if (!payload.category || !isIncidentCategory(payload.category)) {
    throw new Error("Kategori kejadian tidak valid.");
  }

  const title = payload.title.trim();
  const description = payload.description.trim();
  const imageUri = payload.imageUri.trim();

  if (title.length < 5) {
    throw new Error("Judul laporan minimal 5 karakter.");
  }

  if (description.length < 10) {
    throw new Error("Deskripsi laporan minimal 10 karakter.");
  }

  if (!isIncidentSeverity(payload.severity)) {
    throw new Error("Tingkat severity laporan tidak valid.");
  }

  const latitude = normalizeLatitude(payload.latitude);
  const longitude = normalizeLongitude(payload.longitude);

  if (latitude === null || longitude === null) {
    throw new Error("Lokasi laporan tidak valid.");
  }

  if (!imageUri) {
    throw new Error("Bukti foto laporan wajib diisi.");
  }

  const subcategory = normalizeSubcategory(payload.subcategory ?? null);

  if (payload.subcategory && !subcategory) {
    throw new Error("Subkategori laporan tidak valid.");
  }

  if (
    subcategory &&
    getCategoryBySubcategory(subcategory) !== payload.category
  ) {
    throw new Error("Subkategori tidak sesuai dengan kategori utama laporan.");
  }

  const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
    category: payload.category,

    /**
     * Category-first write model.
     * subcategory remains optional.
     * type is deprecated and must not be written as a new taxonomy.
     */
    subcategory,
    type: null,

    title,
    description,
    latitude,
    longitude,
    status: "active",
    severity: payload.severity,
    imageUri,
    address: normalizeNullableString(payload.address),
    reportedBy: normalizeNullableString(payload.reportedBy) ?? "Anonymous",
    reporterEmail: normalizeNullableString(payload.reporterEmail),

    verificationStatus: "pending",
    verificationCount: 0,
    disputeCount: 0,
    evidenceCount: 0,
    replyCount: 0,
    verifiedBy: [],
    disputedBy: [],

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    latestActivityAt: serverTimestamp(),

    resolvedImageUri: null,
    resolutionNote: null,
    resolvedBy: null,
    resolvedAt: null,
  });

  return docRef.id;
};

export const createIncidentVerification = async (
  payload: CreateIncidentVerificationPayload
): Promise<string> => {
  if (!payload.reportId) {
    throw new Error("Report ID tidak valid.");
  }

  if (!payload.actorKey.trim()) {
    throw new Error("User verifikator tidak valid.");
  }

  if (!payload.imageUri) {
    throw new Error("Bukti foto verifikasi wajib diisi.");
  }

  if (payload.note.trim().length < 8) {
    throw new Error("Catatan verifikasi minimal 8 karakter.");
  }

  const reportRef = doc(db, REPORTS_COLLECTION, payload.reportId);

  const verificationRef = doc(
    collection(
      db,
      REPORTS_COLLECTION,
      payload.reportId,
      VERIFICATIONS_COLLECTION
    )
  );

  await runTransaction(db, async (transaction) => {
    const reportSnapshot = await transaction.get(reportRef);

    if (!reportSnapshot.exists()) {
      throw new Error("Incident tidak ditemukan.");
    }

    const reportData = reportSnapshot.data();

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
      actorKey: payload.actorKey,
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
      updateData.verifiedBy = arrayUnion(payload.actorKey);
    }

    if (payload.verificationType === "invalid") {
      updateData.disputedBy = arrayUnion(payload.actorKey);
    }

    transaction.update(reportRef, updateData);
  });

  return verificationRef.id;
};

export const createIncidentReply = async (
  payload: CreateIncidentReplyPayload
): Promise<string> => {
  if (!payload.reportId) {
    throw new Error("Report ID tidak valid.");
  }

  if (!payload.actorKey.trim()) {
    throw new Error("User tidak valid.");
  }

  if (payload.message.trim().length < 3) {
    throw new Error("Pesan diskusi minimal 3 karakter.");
  }

  const repliesRef = collection(
    db,
    REPORTS_COLLECTION,
    payload.reportId,
    REPLIES_COLLECTION
  );

  const docRef = await addDoc(repliesRef, {
    message: payload.message.trim(),
    userName: normalizeNullableString(payload.userName) ?? "Anonymous",
    userEmail: normalizeNullableString(payload.userEmail),
    actorKey: payload.actorKey,
    createdAt: serverTimestamp(),
  });

  const reportRef = doc(db, REPORTS_COLLECTION, payload.reportId);

  await updateDoc(reportRef, {
    replyCount: increment(1),
    latestActivityAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};

export const resolveIncidentReport = async (
  payload: ResolveIncidentPayload
): Promise<void> => {
  if (!payload.reportId) {
    throw new Error("Report ID tidak valid.");
  }

  if (!payload.resolvedImageUri) {
    throw new Error("Bukti gambar selesai wajib diisi.");
  }

  if (payload.resolutionNote.trim().length < 10) {
    throw new Error("Catatan penyelesaian minimal 10 karakter.");
  }

  const reportRef = doc(db, REPORTS_COLLECTION, payload.reportId);

  await updateDoc(reportRef, {
    status: "resolved",
    resolvedImageUri: payload.resolvedImageUri,
    resolutionNote: payload.resolutionNote.trim(),
    resolvedBy: normalizeNullableString(payload.resolvedBy) ?? "Anonymous",
    resolvedAt: serverTimestamp(),
    latestActivityAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const reopenIncidentReport = async (
  reportId: string
): Promise<void> => {
  if (!reportId) {
    throw new Error("Report ID tidak valid.");
  }

  const reportRef = doc(db, REPORTS_COLLECTION, reportId);

  await updateDoc(reportRef, {
    status: "active",
    resolvedImageUri: null,
    resolutionNote: null,
    resolvedBy: null,
    resolvedAt: null,
    latestActivityAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const createSOSLog = async (
  payload: CreateSOSLogPayload
): Promise<string> => {
  const latitude = normalizeLatitude(payload.latitude);
  const longitude = normalizeLongitude(payload.longitude);

  if (latitude === null || longitude === null) {
    throw new Error("Lokasi SOS tidak valid.");
  }

  const docRef = await addDoc(collection(db, SOS_LOGS_COLLECTION), {
    latitude,
    longitude,
    nearestIncidentId: payload.nearestIncidentId ?? null,
    nearestIncidentDistance:
      typeof payload.nearestIncidentDistance === "number" &&
      !Number.isNaN(payload.nearestIncidentDistance)
        ? Math.max(0, payload.nearestIncidentDistance)
        : null,
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