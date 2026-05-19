import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import {
  getCategoryBySubcategory,
  isIncidentCategory,
} from "../../constants/incident";
import { CreateIncidentPayload, IncidentReport } from "../../types/incident";
import { getDistanceInMeters } from "../../utils/geo";
import { db } from "../firebase";
import { MAX_REPORT_IMAGES, REPORTS_COLLECTION } from "./collections";
import { mapIncidentDocument } from "./mappers";
import {
  isIncidentSeverity,
  normalizeImpactAnswers,
  normalizeIncidentDomain,
  normalizeIncidentKind,
  normalizeLatitude,
  normalizeLongitude,
  normalizeNullableNumber,
  normalizeNullableString,
  normalizeReportLocationSource,
  normalizeSubcategory,
  normalizeUrgencyLevel,
  normalizeUrgencyScore,
} from "./normalizers";
import {
  FindNearbyActiveIncidentCandidatesInput,
  NearbyIncidentCandidate,
} from "./serviceTypes";

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

  const rawLocationAccuracyMeters = normalizeNullableNumber(
    payload.locationAccuracyMeters
  );
  const locationAccuracyMeters =
    rawLocationAccuracyMeters === null
      ? null
      : Math.max(0, Math.round(rawLocationAccuracyMeters));

  const locationSource = normalizeReportLocationSource(payload.locationSource);
  const reportedFromLatitude =
    payload.reportedFromLatitude === undefined ||
    payload.reportedFromLatitude === null
      ? null
      : normalizeLatitude(payload.reportedFromLatitude);
  const reportedFromLongitude =
    payload.reportedFromLongitude === undefined ||
    payload.reportedFromLongitude === null
      ? null
      : normalizeLongitude(payload.reportedFromLongitude);

  if (payload.reportedFromLatitude != null && reportedFromLatitude === null) {
    throw new Error("Invalid reporter latitude.");
  }

  if (payload.reportedFromLongitude != null && reportedFromLongitude === null) {
    throw new Error("Invalid reporter longitude.");
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

  const domain = normalizeIncidentDomain(payload.domain);
  const kind = normalizeIncidentKind(payload.kind);

  if (payload.domain && !domain) {
    throw new Error("Invalid report domain.");
  }

  if (payload.kind && !kind) {
    throw new Error("Invalid report type.");
  }

  const urgencyScore = normalizeUrgencyScore(payload.urgencyScore);
  const urgencyLevel = normalizeUrgencyLevel(payload.urgencyLevel, urgencyScore);
  const impactAnswers = normalizeImpactAnswers(payload.impactAnswers);

  const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
    category: payload.category,

    /**
     * Category-first write model.
     * subcategory remains optional.
     * type is deprecated and must not be written as a new taxonomy.
     */
    subcategory,
    type: null,
    domain,
    kind,
    impactAnswers,
    urgencyScore: urgencyScore ?? null,
    urgencyLevel: urgencyLevel ?? null,

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
    reporterUid: normalizeNullableString(payload.reporterUid),
    reporterEmail: normalizeNullableString(payload.reporterEmail),
    locationAccuracyMeters,
    locationSource,
    reportedFromLatitude,
    reportedFromLongitude,

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
    resolvedByActorKey: null,
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

