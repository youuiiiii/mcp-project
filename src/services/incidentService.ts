import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  DocumentData,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  runTransaction,
  serverTimestamp,
  Timestamp,
  UpdateData,
  updateDoc,
  where,
} from "firebase/firestore";

import {
  getCategoryBySubcategory,
  isIncidentCategory,
  isIncidentType,
} from "../constants/incident";
import { db } from "../services/firebase";
import {
  CreateIncidentAccuracyVotePayload,
  CreateIncidentContentReportPayload,
  CreateIncidentPayload,
  CreateIncidentReplyPayload,
  CreateIncidentVerificationPayload,
  CreateSOSLogPayload,
  CommunityUpdateType,
  IncidentAccuracyVote,
  IncidentCategory,
  IncidentConditionStatus,
  IncidentContentReport,
  IncidentReply,
  IncidentReport,
  IncidentSeverity,
  IncidentStatus,
  IncidentSubcategory,
  IncidentType,
  IncidentVerification,
  ModerationStatus,
  ProximityStatus,
  ResolveIncidentPayload,
  SOSLog,
  TrustStatus,
  VerificationStatus,
  VerificationType,
} from "../types/incident";
import { getDistanceInMeters } from "../utils/geo";

const REPORTS_COLLECTION = "reports";
const SOS_LOGS_COLLECTION = "sos_logs";
const VERIFICATIONS_COLLECTION = "verifications";
const REPLIES_COLLECTION = "replies";
const INCIDENT_CONTENT_REPORTS_COLLECTION = "incident_content_reports";
const ACCURACY_VOTES_COLLECTION = "accuracy_votes";

const MAX_REPORT_IMAGES = 4;

export type NearbyIncidentCandidate = {
  incident: IncidentReport;
  distanceMeters: number;
};

type FindNearbyActiveIncidentCandidatesInput = {
  category: IncidentCategory;
  subcategory?: IncidentSubcategory | null;
  latitude: number;
  longitude: number;
  radiusMeters?: number;
  limit?: number;
};

const normalizeProximityStatus = (value: unknown): ProximityStatus => {
  if (
    value === "near_incident" ||
    value === "not_near_incident" ||
    value === "unknown"
  ) {
    return value;
  }

  return "unknown";
};

const normalizeNullableNumber = (value: unknown): number | null => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return value;
};

const normalizeAccuracyVoteType = (
  value: unknown
): IncidentAccuracyVote["voteType"] => {
  if (value === "accurate" || value === "inaccurate") {
    return value;
  }

  return "accurate";
};

const normalizeModerationStatus = (value: unknown): ModerationStatus => {
  if (
    value === "visible" ||
    value === "under_review" ||
    value === "hidden"
  ) {
    return value;
  }

  return "visible";
};

const normalizeTrustStatus = (value: unknown): TrustStatus => {
  if (
    value === "unverified" ||
    value === "community_confirmed" ||
    value === "questioned"
  ) {
    return value;
  }

  return "unverified";
};

const normalizeCommunityUpdateType = (value: unknown): CommunityUpdateType => {
  if (
    value === "still_happening" ||
    value === "getting_worse" ||
    value === "improving" ||
    value === "safe_now" ||
    value === "not_found" ||
    value === "additional_info"
  ) {
    return value;
  }

  return "additional_info";
};

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

  return value
    .map((item) => {
      return typeof item === "string" ? item.trim() : "";
    })
    .filter((item) => item.length > 0);
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

  const coverImageUri = normalizeNullableString(data.imageUri);
  const storedImageUris = normalizeStringArray(data.imageUris);

  return {
    id: snapshot.id,

    category,
    subcategory,
    type,

    title: normalizeNullableString(data.title) ?? "Untitled report",
    description: normalizeNullableString(data.description) ?? "",
    latitude,
    longitude,
    status: normalizeStatus(data.status),
    severity: normalizeSeverity(data.severity),

    imageUri: coverImageUri,
    imageUris:
      storedImageUris.length > 0
        ? storedImageUris
        : coverImageUri
          ? [coverImageUri]
          : [],

    address: normalizeNullableString(data.address),
    reportedBy: normalizeNullableString(data.reportedBy),
    reporterEmail: normalizeNullableString(data.reporterEmail),

    verificationStatus: normalizeVerificationStatus(data.verificationStatus),
    verificationCount: normalizeCount(data.verificationCount),
    disputeCount: normalizeCount(data.disputeCount),
    evidenceCount: normalizeCount(data.evidenceCount),
    replyCount: normalizeCount(data.replyCount),
    accurateCount: normalizeCount(data.accurateCount),
    inaccurateCount: normalizeCount(data.inaccurateCount),
    verifiedBy: normalizeStringArray(data.verifiedBy),
    disputedBy: normalizeStringArray(data.disputedBy),

    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    latestActivityAt: toDate(data.latestActivityAt),
    latestCommunityUpdateType: normalizeCommunityUpdateType(
      data.latestCommunityUpdateType
    ),
    latestCommunityUpdateAt: toDate(data.latestCommunityUpdateAt),
    latestAccuracyVoteAt: toDate(data.latestAccuracyVoteAt),
    conditionUpdateCount: normalizeCount(data.conditionUpdateCount),

    resolvedImageUri: normalizeNullableString(data.resolvedImageUri),
    resolutionNote: normalizeNullableString(data.resolutionNote),
    resolvedBy: normalizeNullableString(data.resolvedBy),
    resolvedAt: toDate(data.resolvedAt),

    trustStatus: normalizeTrustStatus(data.trustStatus),
    moderationStatus: normalizeModerationStatus(data.moderationStatus),
    moderationReason: normalizeNullableString(data.moderationReason),
    moderatedBy: normalizeNullableString(data.moderatedBy),
    moderatedAt: toDate(data.moderatedAt),
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
    imageUri: normalizeNullableString(data.imageUri),
    parentReplyId: normalizeNullableString(data.parentReplyId),
    replyToUserName: normalizeNullableString(data.replyToUserName),
    updateType: normalizeCommunityUpdateType(data.updateType),
    moderationStatus: normalizeModerationStatus(data.moderationStatus),
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

const mapIncidentContentReportDocument = (
  snapshot: QueryDocumentSnapshot<DocumentData>
): IncidentContentReport => {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    targetType:
      data.targetType === "incident_reply"
        ? "incident_reply"
        : "incident_report",
    targetId: normalizeNullableString(data.targetId) ?? "",
    reportId: normalizeNullableString(data.reportId) ?? "",
    reason:
      data.reason === "false_information" ||
      data.reason === "harmful_content" ||
      data.reason === "spam" ||
      data.reason === "privacy_issue" ||
      data.reason === "inappropriate_image" ||
      data.reason === "other"
        ? data.reason
        : "other",
    note: normalizeNullableString(data.note),
    status:
      data.status === "reviewed" || data.status === "dismissed"
        ? data.status
        : "open",
    actorKey: normalizeNullableString(data.actorKey) ?? "",
    userName: normalizeNullableString(data.userName),
    userEmail: normalizeNullableString(data.userEmail),
    reviewedBy: normalizeNullableString(data.reviewedBy),
    reviewedAt: toDate(data.reviewedAt),
    createdAt: toDate(data.createdAt),
  };
};

const mapAccuracyVoteDocument = (
  snapshot: QueryDocumentSnapshot<DocumentData>,
  reportId: string
): IncidentAccuracyVote => {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    reportId,
    voteType: normalizeAccuracyVoteType(data.voteType),
    proximityStatus: normalizeProximityStatus(data.proximityStatus),
    distanceFromIncidentMeters:
      normalizeNullableNumber(data.distanceFromIncidentMeters) ?? 0,
    locationAccuracyMeters:
      normalizeNullableNumber(data.locationAccuracyMeters) ?? 0,
    actorKey: normalizeNullableString(data.actorKey) ?? "",
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
};

export const subscribeToIncidents = (
  onSuccess: (reports: IncidentReport[]) => void,
  onError?: (error: Error) => void
) => {
  const reportsQuery = query(
    collection(db, REPORTS_COLLECTION),
    where("moderationStatus", "==", "visible"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    reportsQuery,
    (snapshot) => {
      const reports = snapshot.docs
        .map(mapIncidentDocument)
        .filter((report): report is IncidentReport => {
          return report !== null && report.moderationStatus !== "hidden";
        });

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
    where("moderationStatus", "==", "visible"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(
    repliesQuery,
    (snapshot) => {
      const items = snapshot.docs
        .map((item) => {
          return mapReplyDocument(item, reportId);
        })
        .filter((reply) => reply.moderationStatus !== "hidden");

      onSuccess(items);
    },
    (error) => {
      onError?.(error);
    }
  );
};

export const subscribeToIncidentAccuracyVotes = (
  reportId: string,
  onSuccess: (items: IncidentAccuracyVote[]) => void,
  onError?: (error: Error) => void
) => {
  const votesQuery = query(
    collection(db, REPORTS_COLLECTION, reportId, ACCURACY_VOTES_COLLECTION),
    orderBy("updatedAt", "desc")
  );

  return onSnapshot(
    votesQuery,
    (snapshot) => {
      const items = snapshot.docs.map((item) => {
        return mapAccuracyVoteDocument(item, reportId);
      });

      onSuccess(items);
    },
    (error) => {
      onError?.(error);
    }
  );
};

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
      throw new Error("Incident not found.");
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

export const createIncidentReport = async (
  payload: CreateIncidentPayload
): Promise<string> => {
  if (!payload.category || !isIncidentCategory(payload.category)) {
    throw new Error("Invalid incident category.");
  }

  const title = payload.title.trim();
  const description = payload.description.trim();

  const imageUris = Array.from(
    new Set(
      (payload.imageUris && payload.imageUris.length > 0
        ? payload.imageUris
        : [payload.imageUri]
      )
        .map((item) => item.trim())
        .filter(Boolean)
    )
  ).slice(0, MAX_REPORT_IMAGES);

  const imageUri = imageUris[0] ?? "";

  if (title.length < 5) {
    throw new Error("Report title must be at least 5 characters.");
  }

  if (description.length < 10) {
    throw new Error("Report description must be at least 10 characters.");
  }

  if (!isIncidentSeverity(payload.severity)) {
    throw new Error("Invalid report severity.");
  }

  const latitude = normalizeLatitude(payload.latitude);
  const longitude = normalizeLongitude(payload.longitude);

  if (latitude === null || longitude === null) {
    throw new Error("Invalid report location.");
  }

  if (!imageUri) {
    throw new Error("At least one report photo is required.");
  }

  if (imageUris.length > MAX_REPORT_IMAGES) {
    throw new Error("A report can include up to 4 photos.");
  }

  const subcategory = normalizeSubcategory(payload.subcategory ?? null);

  if (payload.subcategory && !subcategory) {
    throw new Error("Invalid report subcategory.");
  }

  if (
    subcategory &&
    getCategoryBySubcategory(subcategory) !== payload.category
  ) {
    throw new Error("The subcategory does not match the selected category.");
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
    imageUris,

    address: normalizeNullableString(payload.address),
    reportedBy: normalizeNullableString(payload.reportedBy) ?? "Anonymous",
    reporterEmail: normalizeNullableString(payload.reporterEmail),

    verificationStatus: "pending",
    verificationCount: 0,
    disputeCount: 0,
    evidenceCount: 0,
    replyCount: 0,
    accurateCount: 0,
    inaccurateCount: 0,
    verifiedBy: [],
    disputedBy: [],

    trustStatus: "unverified",
    moderationStatus: "visible",
    moderationReason: null,
    moderatedBy: null,
    moderatedAt: null,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    latestActivityAt: serverTimestamp(),
    latestCommunityUpdateType: null,
    latestCommunityUpdateAt: null,
    latestAccuracyVoteAt: null,
    conditionUpdateCount: 0,

    resolvedImageUri: null,
    resolutionNote: null,
    resolvedBy: null,
    resolvedAt: null,
  });

  return docRef.id;
};

export const findNearbyActiveIncidentCandidates = async ({
  category,
  subcategory,
  latitude,
  longitude,
  radiusMeters = 150,
  limit = 3,
}: FindNearbyActiveIncidentCandidatesInput): Promise<
  NearbyIncidentCandidate[]
> => {
  const safeLatitude = normalizeLatitude(latitude);
  const safeLongitude = normalizeLongitude(longitude);

  if (safeLatitude === null || safeLongitude === null) {
    throw new Error("Report location is invalid.");
  }

  const reportsQuery = query(
    collection(db, REPORTS_COLLECTION),
    where("status", "==", "active"),
    where("moderationStatus", "==", "visible"),
    where("category", "==", category)
  );

  const snapshot = await getDocs(reportsQuery);
  const origin = {
    latitude: safeLatitude,
    longitude: safeLongitude,
  };

  return snapshot.docs
    .map(mapIncidentDocument)
    .filter((incident): incident is IncidentReport => {
      if (!incident) {
        return false;
      }

      if (subcategory && incident.subcategory && incident.subcategory !== subcategory) {
        return false;
      }

      return incident.status === "active";
    })
    .map((incident) => ({
      incident,
      distanceMeters: getDistanceInMeters(origin, incident),
    }))
    .filter((candidate) => candidate.distanceMeters <= radiusMeters)
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, limit);
};

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

    const reportUpdate: UpdateData<DocumentData> = {
      replyCount: increment(1),
      latestActivityAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (!parentReplyId && updateType !== "additional_info") {
      reportUpdate.latestCommunityUpdateType = updateType;
      reportUpdate.latestCommunityUpdateAt = serverTimestamp();
      reportUpdate.conditionUpdateCount = increment(1);
    }

    transaction.update(reportRef, reportUpdate);
  });

  return replyRef.id;
};

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
    throw new Error("Invalid report ID.");
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
    throw new Error("Invalid SOS location.");
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

    transaction.update(reportRef, {
      accurateCount: increment(accurateDelta),
      inaccurateCount: increment(inaccurateDelta),
      latestAccuracyVoteAt: serverTimestamp(),
      latestActivityAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
};
