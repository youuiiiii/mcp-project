import {
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import {
  IncidentAccuracyVote,
  IncidentContentReport,
  IncidentReply,
  IncidentReport,
  IncidentVerification,
} from "../../types/incident";
import {
  isSubcategoryCompatibleWithCategory,
  normalizeAccuracyVoteType,
  normalizeCategory,
  normalizeCommunityUpdateType,
  normalizeConditionStatus,
  normalizeCount,
  normalizeImpactAnswers,
  normalizeIncidentDomain,
  normalizeIncidentKind,
  normalizeLatitude,
  normalizeLongitude,
  normalizeModerationStatus,
  normalizeNullableNumber,
  normalizeNullableString,
  normalizeProximityStatus,
  normalizeReportLocationSource,
  normalizeSeverity,
  normalizeStatus,
  normalizeStringArray,
  normalizeSubcategory,
  normalizeTrustStatus,
  normalizeType,
  normalizeUrgencyLevel,
  normalizeUrgencyScore,
  normalizeVerificationStatus,
  normalizeVerificationType,
  toDate,
} from "./normalizers";

export const mapIncidentDocument = (
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
  const urgencyScore = normalizeUrgencyScore(data.urgencyScore);

  return {
    id: snapshot.id,

    category,
    subcategory,
    type,
    domain: normalizeIncidentDomain(data.domain),
    kind: normalizeIncidentKind(data.kind),
    impactAnswers: normalizeImpactAnswers(data.impactAnswers),
    urgencyScore,
    urgencyLevel: normalizeUrgencyLevel(data.urgencyLevel, urgencyScore),

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
    reporterUid: normalizeNullableString(data.reporterUid),
    reporterEmail: normalizeNullableString(data.reporterEmail),
    locationAccuracyMeters: normalizeNullableNumber(
      data.locationAccuracyMeters
    ),
    locationSource: normalizeReportLocationSource(data.locationSource),
    reportedFromLatitude: normalizeNullableNumber(data.reportedFromLatitude),
    reportedFromLongitude: normalizeNullableNumber(data.reportedFromLongitude),

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
    resolvedByActorKey: normalizeNullableString(data.resolvedByActorKey),
    resolvedAt: toDate(data.resolvedAt),

    trustStatus: normalizeTrustStatus(data.trustStatus),
    moderationStatus: normalizeModerationStatus(data.moderationStatus),
    moderationReason: normalizeNullableString(data.moderationReason),
    moderatedBy: normalizeNullableString(data.moderatedBy),
    moderatedAt: toDate(data.moderatedAt),
  };
};

export const mapVerificationDocument = (
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

export const mapReplyDocument = (
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
export const mapIncidentContentReportDocument = (
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

export const mapAccuracyVoteDocument = (
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

