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
} from "firebase/firestore";
import {
  getCategoryBySubcategory,
  getIncidentMeta,
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

const normalizeSubcategory = (value: unknown): IncidentSubcategory => {
  if (typeof value === "string" && isIncidentType(value)) {
    return value;
  }

  return "public_disturbance";
};

const normalizeType = (value: unknown): IncidentType => {
  if (typeof value === "string" && isIncidentType(value)) {
    return value;
  }

  return "public_disturbance";
};

const normalizeCategory = (
  value: unknown,
  fallbackSubcategory: IncidentSubcategory
): IncidentCategory => {
  if (typeof value === "string" && isIncidentCategory(value)) {
    return value;
  }

  return getCategoryBySubcategory(fallbackSubcategory);
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

  return value.filter((item) => typeof item === "string");
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
): IncidentReport => {
  const data = snapshot.data();

  const subcategory = normalizeSubcategory(data.subcategory ?? data.type);
  const category = normalizeCategory(data.category, subcategory);
  const type = normalizeType(data.type ?? subcategory);

  return {
    id: snapshot.id,

    category,
    subcategory,
    type,

    title: typeof data.title === "string" ? data.title : "Untitled Incident",
    description: typeof data.description === "string" ? data.description : "",
    latitude: typeof data.latitude === "number" ? data.latitude : 0,
    longitude: typeof data.longitude === "number" ? data.longitude : 0,
    status: normalizeStatus(data.status),
    severity: normalizeSeverity(data.severity),

    imageUri: typeof data.imageUri === "string" ? data.imageUri : null,
    address: typeof data.address === "string" ? data.address : null,
    reportedBy: typeof data.reportedBy === "string" ? data.reportedBy : null,
    reporterEmail:
      typeof data.reporterEmail === "string" ? data.reporterEmail : null,

    verificationStatus: normalizeVerificationStatus(data.verificationStatus),
    verificationCount:
      typeof data.verificationCount === "number" ? data.verificationCount : 0,
    disputeCount: typeof data.disputeCount === "number" ? data.disputeCount : 0,
    evidenceCount:
      typeof data.evidenceCount === "number" ? data.evidenceCount : 0,
    replyCount: typeof data.replyCount === "number" ? data.replyCount : 0,
    verifiedBy: normalizeStringArray(data.verifiedBy),
    disputedBy: normalizeStringArray(data.disputedBy),

    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    latestActivityAt: toDate(data.latestActivityAt),

    resolvedImageUri:
      typeof data.resolvedImageUri === "string"
        ? data.resolvedImageUri
        : null,
    resolutionNote:
      typeof data.resolutionNote === "string" ? data.resolutionNote : null,
    resolvedBy: typeof data.resolvedBy === "string" ? data.resolvedBy : null,
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
    note: typeof data.note === "string" ? data.note : "",
    imageUri: typeof data.imageUri === "string" ? data.imageUri : "",
    latitude: typeof data.latitude === "number" ? data.latitude : 0,
    longitude: typeof data.longitude === "number" ? data.longitude : 0,
    userName: typeof data.userName === "string" ? data.userName : null,
    userEmail: typeof data.userEmail === "string" ? data.userEmail : null,
    actorKey: typeof data.actorKey === "string" ? data.actorKey : "",
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
    message: typeof data.message === "string" ? data.message : "",
    userName: typeof data.userName === "string" ? data.userName : null,
    userEmail: typeof data.userEmail === "string" ? data.userEmail : null,
    actorKey: typeof data.actorKey === "string" ? data.actorKey : "",
    createdAt: toDate(data.createdAt),
  };
};

const mapSOSDocument = (
  snapshot: QueryDocumentSnapshot<DocumentData>
): SOSLog => {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    latitude: typeof data.latitude === "number" ? data.latitude : 0,
    longitude: typeof data.longitude === "number" ? data.longitude : 0,
    nearestIncidentId:
      typeof data.nearestIncidentId === "string"
        ? data.nearestIncidentId
        : null,
    nearestIncidentDistance:
      typeof data.nearestIncidentDistance === "number"
        ? data.nearestIncidentDistance
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
      const reports = snapshot.docs.map(mapIncidentDocument);
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
  if (!payload.category) {
    throw new Error("Kategori kejadian wajib dipilih.");
  }

  if (!payload.subcategory) {
    throw new Error("Subkategori kejadian wajib dipilih.");
  }

  if (!payload.title.trim()) {
    throw new Error("Judul laporan wajib diisi.");
  }

  if (!payload.description.trim()) {
    throw new Error("Deskripsi laporan wajib diisi.");
  }

  if (
    typeof payload.latitude !== "number" ||
    typeof payload.longitude !== "number"
  ) {
    throw new Error("Lokasi laporan tidak valid.");
  }

  if (!payload.imageUri) {
    throw new Error("Bukti foto laporan wajib diisi.");
  }

  const meta = getIncidentMeta(payload.subcategory);

  const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
    category: payload.category,
    subcategory: payload.subcategory,
    type: payload.subcategory,

    categoryLabel: payload.category,
    subcategoryLabel: meta.label,

    title: payload.title.trim(),
    description: payload.description.trim(),
    latitude: payload.latitude,
    longitude: payload.longitude,
    status: "active",
    severity: payload.severity,
    imageUri: payload.imageUri,
    address: payload.address ?? null,
    reportedBy: payload.reportedBy ?? "Anonymous",
    reporterEmail: payload.reporterEmail ?? null,

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

  if (!payload.note.trim()) {
    throw new Error("Catatan verifikasi wajib diisi.");
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

    const currentVerificationCount =
      typeof reportData.verificationCount === "number"
        ? reportData.verificationCount
        : 0;

    const currentDisputeCount =
      typeof reportData.disputeCount === "number" ? reportData.disputeCount : 0;

    const currentEvidenceCount =
      typeof reportData.evidenceCount === "number"
        ? reportData.evidenceCount
        : 0;

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
      userName: payload.userName ?? "Anonymous",
      userEmail: payload.userEmail ?? null,
      actorKey: payload.actorKey,
      createdAt: serverTimestamp(),
    });

    const updateData: Record<string, any> = {
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

  if (!payload.message.trim()) {
    throw new Error("Pesan diskusi tidak boleh kosong.");
  }

  const repliesRef = collection(
    db,
    REPORTS_COLLECTION,
    payload.reportId,
    REPLIES_COLLECTION
  );

  const docRef = await addDoc(repliesRef, {
    message: payload.message.trim(),
    userName: payload.userName ?? "Anonymous",
    userEmail: payload.userEmail ?? null,
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

  if (!payload.resolutionNote.trim()) {
    throw new Error("Catatan penyelesaian wajib diisi.");
  }

  const reportRef = doc(db, REPORTS_COLLECTION, payload.reportId);

  await updateDoc(reportRef, {
    status: "resolved",
    resolvedImageUri: payload.resolvedImageUri,
    resolutionNote: payload.resolutionNote.trim(),
    resolvedBy: payload.resolvedBy ?? "Anonymous",
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
  if (
    typeof payload.latitude !== "number" ||
    typeof payload.longitude !== "number"
  ) {
    throw new Error("Lokasi SOS tidak valid.");
  }

  const docRef = await addDoc(collection(db, SOS_LOGS_COLLECTION), {
    latitude: payload.latitude,
    longitude: payload.longitude,
    nearestIncidentId: payload.nearestIncidentId ?? null,
    nearestIncidentDistance: payload.nearestIncidentDistance ?? null,
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