import { colors } from "../theme/colors";
import type { IncidentReport, ModerationStatus } from "../types/incident";
import {
  getHoursSinceDate,
  getIncidentFreshnessMeta,
  getIncidentLastActivityAt,
  getIncidentStaleAfterHours,
  type IncidentFreshnessState,
} from "./incidentFreshness";
import { getIncidentTrustLevel, getIncidentTrustSummaryData } from "./incidentTrust";

export type IncidentConfidenceLevel =
  | "emerging"
  | "credible"
  | "confirmed"
  | "questioned"
  | "stale"
  | "resolved";

export type IncidentConfidenceComponent = {
  score: number;
  label: string;
  description: string;
};

export type IncidentConfidenceMeta = {
  level: IncidentConfidenceLevel;
  score: number;
  reviewPriorityScore: number;
  reportedDistanceMeters: number | null;
  label: string;
  shortLabel: string;
  description: string;
  reviewLabel: string;
  reviewDescription: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  freshnessState: IncidentFreshnessState;
  components: {
    location: IncidentConfidenceComponent;
    community: IncidentConfidenceComponent;
    evidence: IncidentConfidenceComponent;
    freshness: IncidentConfidenceComponent;
  };
  signals: {
    label: string;
    value: string;
  }[];
};

const SCORE_MIN = 0;
const SCORE_MAX = 100;
const RATIO_MIN = 0;
const RATIO_MAX = 1;
const DEFAULT_LOCATION_CONFIDENCE = 0.5;
const DEFAULT_GPS_ACCURACY_METERS = 50;
const MANUAL_PIN_UNCERTAINTY_MULTIPLIER = 10;
const CURRENT_LOCATION_UNCERTAINTY_MULTIPLIER = 5;
const COMMUNITY_PRIOR = 2;
const EARTH_RADIUS_METERS = 6371000;

const clamp = (value: number, min: number, max: number) => {
  if (Number.isNaN(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
};

const clampScore = (score: number) => {
  return Math.round(clamp(score, SCORE_MIN, SCORE_MAX));
};

const clampRatio = (score: number) => {
  return clamp(score, RATIO_MIN, RATIO_MAX);
};

const toPercent = (value: number) => {
  return clampScore(value * SCORE_MAX);
};

const getSafeCount = (value?: number | null): number => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, value);
};

const toRadians = (value: number) => {
  return (value * Math.PI) / 180;
};

const getDistanceMeters = (
  first: { latitude: number; longitude: number },
  second: { latitude: number; longitude: number }
): number => {
  const lat1 = toRadians(first.latitude);
  const lat2 = toRadians(second.latitude);
  const deltaLat = toRadians(second.latitude - first.latitude);
  const deltaLon = toRadians(second.longitude - first.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(EARTH_RADIUS_METERS * c);
};

const exponentialDecay = (value: number, scale: number) => {
  if (scale <= 0) {
    return 0;
  }

  return clampRatio(Math.exp(-value / scale));
};

const growthCurve = (value: number, scale: number) => {
  if (value <= 0 || scale <= 0) {
    return 0;
  }

  return clampRatio(1 - Math.exp(-value / scale));
};

const bayesianRatio = (positive: number, negative: number, prior = COMMUNITY_PRIOR) => {
  return clampRatio((positive + prior) / (positive + negative + prior * 2));
};

const formatDistance = (meters: number | null) => {
  if (meters === null) {
    return "Unknown";
  }

  if (meters < 1000) {
    return `${meters} m`;
  }

  return `${(meters / 1000).toFixed(1)} km`;
};

const getModerationPenalty = (status?: ModerationStatus): number => {
  if (status === "hidden") {
    return 0.7;
  }

  if (status === "under_review") {
    return 0.25;
  }

  return 0;
};

const getLatestConditionSignal = (
  updateType: IncidentReport["latestCommunityUpdateType"]
) => {
  if (updateType === "still_happening" || updateType === "getting_worse") {
    return {
      positive: 0.8,
      negative: 0,
    };
  }

  if (updateType === "improving") {
    return {
      positive: 0.3,
      negative: 0,
    };
  }

  if (updateType === "safe_now") {
    return {
      positive: 0,
      negative: 0.4,
    };
  }

  if (updateType === "not_found") {
    return {
      positive: 0,
      negative: 1.2,
    };
  }

  return {
    positive: 0,
    negative: 0,
  };
};

const getUrgencyRatio = (incident: IncidentReport) => {
  if (typeof incident.urgencyScore === "number") {
    return clampRatio(incident.urgencyScore / SCORE_MAX);
  }

  if (incident.urgencyLevel === "high" || incident.severity === "high") {
    return 0.85;
  }

  if (incident.urgencyLevel === "medium" || incident.severity === "medium") {
    return 0.55;
  }

  return 0.3;
};

const getLocationConfidence = (
  incident: IncidentReport
): {
  confidence: number;
  distanceMeters: number | null;
  label: string;
  description: string;
} => {
  const hasReporterLocation =
    typeof incident.reportedFromLatitude === "number" &&
    typeof incident.reportedFromLongitude === "number";

  if (!hasReporterLocation) {
    return {
      confidence: DEFAULT_LOCATION_CONFIDENCE,
      distanceMeters: null,
      label: "Location signal unknown",
      description:
        "Reporter submit location is unavailable, so location confidence stays neutral.",
    };
  }

  const distanceMeters = getDistanceMeters(
    {
      latitude: incident.latitude,
      longitude: incident.longitude,
    },
    {
      latitude: incident.reportedFromLatitude as number,
      longitude: incident.reportedFromLongitude as number,
    }
  );

  const gpsAccuracy = Math.max(
    incident.locationAccuracyMeters ?? DEFAULT_GPS_ACCURACY_METERS,
    1
  );

  const uncertaintyMultiplier =
    incident.locationSource === "manual_pin"
      ? MANUAL_PIN_UNCERTAINTY_MULTIPLIER
      : CURRENT_LOCATION_UNCERTAINTY_MULTIPLIER;

  const uncertaintyRadius = gpsAccuracy * uncertaintyMultiplier;
  const confidence = exponentialDecay(distanceMeters, uncertaintyRadius);
  const formattedDistance = formatDistance(distanceMeters);

  if (confidence >= 0.75) {
    return {
      confidence,
      distanceMeters,
      label: "Nearby location signal",
      description: `Reporter submitted close to the incident pin (${formattedDistance}).`,
    };
  }

  if (confidence >= 0.4) {
    return {
      confidence,
      distanceMeters,
      label: "Moderate location signal",
      description: `Reporter was not exactly at the pin, but the distance is still explainable (${formattedDistance}).`,
    };
  }

  return {
    confidence,
    distanceMeters,
    label: "Weak location signal",
    description: `Reporter submitted away from the incident pin (${formattedDistance}). Nearby confirmation matters more.`,
  };
};

const getFreshnessConfidence = (incident: IncidentReport) => {
  if (incident.status === "resolved") {
    return {
      confidence: 0.9,
      label: "Resolved",
      description: "Resolved reports keep a stable historical confidence signal.",
    };
  }

  const inactiveHours = getHoursSinceDate(getIncidentLastActivityAt(incident));

  if (inactiveHours === null) {
    return {
      confidence: DEFAULT_LOCATION_CONFIDENCE,
      label: "Freshness unknown",
      description: "No recent activity timestamp is available.",
    };
  }

  const staleAfterHours = getIncidentStaleAfterHours(incident);
  const confidence = exponentialDecay(inactiveHours, staleAfterHours * 2);

  if (confidence >= 0.7) {
    return {
      confidence,
      label: "Fresh report",
      description: "This report has recent activity.",
    };
  }

  if (confidence >= 0.4) {
    return {
      confidence,
      label: "Aging report",
      description: "This report is getting older and may need a condition update.",
    };
  }

  return {
    confidence,
    label: "Stale report",
    description: "This report needs a fresh update from nearby users.",
  };
};

const getConfidencePresentation = (
  incident: IncidentReport,
  score: number,
  freshnessState: IncidentFreshnessState
): Omit<
  IncidentConfidenceMeta,
  | "score"
  | "reviewPriorityScore"
  | "reportedDistanceMeters"
  | "reviewLabel"
  | "reviewDescription"
  | "freshnessState"
  | "components"
  | "signals"
> => {
  const trustLevel = getIncidentTrustLevel(incident);

  if (incident.status === "resolved") {
    return {
      level: "resolved",
      label: "Resolved",
      shortLabel: "Done",
      description: "The incident has been marked resolved with resolution notes.",
      color: colors.successDark,
      backgroundColor: colors.successSoft,
      borderColor: "#BBF7D0",
    };
  }

  if (trustLevel === "disputed" || score < 35) {
    return {
      level: "questioned",
      label: "Needs Review",
      shortLabel: "Review",
      description:
        "There are conflicting or weak signals. Treat this report as early information.",
      color: colors.primaryDark,
      backgroundColor: colors.dangerSoft,
      borderColor: "#FECACA",
    };
  }

  if (freshnessState === "stale") {
    return {
      level: "stale",
      label: "Needs Update",
      shortLabel: "Stale",
      description:
        "This report has not been updated recently and needs a fresh condition check.",
      color: colors.warningDark,
      backgroundColor: colors.warningSoft,
      borderColor: "#FDE68A",
    };
  }

  if (score >= 78 || trustLevel === "verified") {
    return {
      level: "confirmed",
      label: "Strong Signal",
      shortLabel: "Strong",
      description:
        "This report has strong supporting evidence or community confirmation.",
      color: colors.successDark,
      backgroundColor: colors.successSoft,
      borderColor: "#BBF7D0",
    };
  }

  if (score >= 55) {
    return {
      level: "credible",
      label: "Supported",
      shortLabel: "Supported",
      description:
        "This report has some supporting signals, but it can still be strengthened.",
      color: colors.infoDark,
      backgroundColor: colors.infoSoft,
      borderColor: "#BFDBFE",
    };
  }

  return {
    level: "emerging",
    label: "New Signal",
    shortLabel: "New",
    description:
      "This report is still new or does not have enough community signals yet.",
    color: colors.warningDark,
    backgroundColor: colors.warningSoft,
    borderColor: "#FDE68A",
  };
};

const getReviewPresentation = (reviewPriorityScore: number) => {
  if (reviewPriorityScore >= 70) {
    return {
      reviewLabel: "High Review Priority",
      reviewDescription:
        "This report should be checked first because risk signals are high.",
    };
  }

  if (reviewPriorityScore >= 40) {
    return {
      reviewLabel: "Watch",
      reviewDescription:
        "This report is not critical yet, but it has signals worth monitoring.",
    };
  }

  return {
    reviewLabel: "Normal",
    reviewDescription: "No strong moderation risk signal is detected right now.",
  };
};

export const getIncidentConfidenceMeta = (
  incident: IncidentReport
): IncidentConfidenceMeta => {
  const summary = getIncidentTrustSummaryData(incident);
  const freshness = getIncidentFreshnessMeta(incident);
  const location = getLocationConfidence(incident);
  const freshnessConfidence = getFreshnessConfidence(incident);
  const conditionSignal = getLatestConditionSignal(
    incident.latestCommunityUpdateType
  );

  const validSignals = getSafeCount(summary.verificationCount);
  const disputeSignals = getSafeCount(summary.disputeCount);
  const replySignals = getSafeCount(summary.replyCount);
  const evidenceSignals = getSafeCount(summary.evidenceCount);
  const accurateSignals = getSafeCount(incident.accurateCount);
  const inaccurateSignals = getSafeCount(incident.inaccurateCount);
  const conditionUpdateSignals = getSafeCount(incident.conditionUpdateCount);

  const positiveCommunitySignals =
    validSignals * 1.2 +
    accurateSignals * 0.9 +
    replySignals * 0.2 +
    conditionUpdateSignals * 0.4 +
    conditionSignal.positive;

  const negativeCommunitySignals =
    disputeSignals * 1.3 + inaccurateSignals * 1.1 + conditionSignal.negative;

  const communityConfidence = bayesianRatio(
    positiveCommunitySignals,
    negativeCommunitySignals
  );

  const hasOriginalEvidence =
    Boolean(incident.imageUri) || Boolean(incident.imageUris?.length);
  const evidenceConfidence = growthCurve(
    evidenceSignals + (hasOriginalEvidence ? 0.8 : 0),
    2
  );

  const moderationPenalty = getModerationPenalty(incident.moderationStatus);

  const weightedConfidence =
    location.confidence * 0.25 +
    communityConfidence * 0.35 +
    evidenceConfidence * 0.2 +
    freshnessConfidence.confidence * 0.2;

  const confidenceRatio = clampRatio(weightedConfidence - moderationPenalty);
  const score = clampScore(confidenceRatio * SCORE_MAX);

  const contradictionRisk = clampRatio(
    negativeCommunitySignals /
      Math.max(1, positiveCommunitySignals + negativeCommunitySignals)
  );
  const locationRisk = 1 - location.confidence;
  const lowConfidenceRisk = 1 - confidenceRatio;
  const staleRisk = 1 - freshnessConfidence.confidence;
  const urgencyRatio = getUrgencyRatio(incident);

  const reviewPriorityRatio = clampRatio(
    (locationRisk * 0.25 +
      contradictionRisk * 0.35 +
      lowConfidenceRisk * 0.25 +
      staleRisk * 0.15) *
      (0.85 + urgencyRatio * 0.3) +
      moderationPenalty
  );

  const reviewPriorityScore = clampScore(reviewPriorityRatio * SCORE_MAX);
  const presentation = getConfidencePresentation(
    incident,
    score,
    freshness.state
  );
  const reviewPresentation = getReviewPresentation(reviewPriorityScore);

  return {
    ...presentation,
    ...reviewPresentation,
    score,
    reviewPriorityScore,
    reportedDistanceMeters: location.distanceMeters,
    freshnessState: freshness.state,
    components: {
      location: {
        score: toPercent(location.confidence),
        label: location.label,
        description: location.description,
      },
      community: {
        score: toPercent(communityConfidence),
        label: "Community signal",
        description:
          "Calculated from valid confirmations, disputes, accuracy votes, replies, and condition updates.",
      },
      evidence: {
        score: toPercent(evidenceConfidence),
        label: "Evidence signal",
        description:
          "Calculated from the original report photo and additional verification evidence.",
      },
      freshness: {
        score: toPercent(freshnessConfidence.confidence),
        label: freshnessConfidence.label,
        description: freshnessConfidence.description,
      },
    },
    signals: [
      {
        label: "Score",
        value: `${score}/100`,
      },
      {
        label: "Review",
        value: `${reviewPriorityScore}/100`,
      },
      {
        label: "Reporter distance",
        value: formatDistance(location.distanceMeters),
      },
      {
        label: "Location",
        value: `${toPercent(location.confidence)}/100`,
      },
      {
        label: "Community",
        value: `${toPercent(communityConfidence)}/100`,
      },
      {
        label: "Evidence",
        value: `${toPercent(evidenceConfidence)}/100`,
      },
      {
        label: "Freshness",
        value: `${toPercent(freshnessConfidence.confidence)}/100`,
      },
    ],
  };
};

export const getIncidentReviewPriorityScore = (incident: IncidentReport) => {
  return getIncidentConfidenceMeta(incident).reviewPriorityScore;
};
