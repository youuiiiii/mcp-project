import { Timestamp } from "firebase/firestore";

import {
  getCategoryBySubcategory,
  isIncidentCategory,
  isIncidentType,
} from "../../constants/incident";
import {
  getUrgencyLevelFromScore,
  IMPACT_QUESTION_OPTIONS,
  isIncidentDomain,
  isIncidentImpactKey,
  isIncidentKind,
} from "../../constants/reportTaxonomy";
import {
  CommunityUpdateType,
  IncidentAccuracyVote,
  IncidentCategory,
  IncidentConditionStatus,
  IncidentDomain,
  IncidentImpactAnswers,
  IncidentReport,
  IncidentSeverity,
  IncidentStatus,
  IncidentSubcategory,
  IncidentType,
  IncidentUrgencyLevel,
  ModerationStatus,
  ProximityStatus,
  ReportLocationSource,
  TrustStatus,
  VerificationStatus,
  VerificationType,
} from "../../types/incident";

export const normalizeProximityStatus = (value: unknown): ProximityStatus => {
  if (
    value === "near_incident" ||
    value === "not_near_incident" ||
    value === "unknown"
  ) {
    return value;
  }

  return "unknown";
};

export const normalizeNullableNumber = (value: unknown): number | null => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return value;
};

export const normalizeReportLocationSource = (
  value: unknown
): ReportLocationSource => {
  if (value === "manual_pin" || value === "current_location") {
    return value;
  }

  return "current_location";
};

export const normalizeAccuracyVoteType = (
  value: unknown
): IncidentAccuracyVote["voteType"] => {
  if (value === "accurate" || value === "inaccurate") {
    return value;
  }

  return "accurate";
};

export const normalizeModerationStatus = (value: unknown): ModerationStatus => {
  if (
    value === "visible" ||
    value === "under_review" ||
    value === "hidden"
  ) {
    return value;
  }

  return "visible";
};

export const normalizeTrustStatus = (value: unknown): TrustStatus => {
  if (
    value === "unverified" ||
    value === "community_confirmed" ||
    value === "questioned"
  ) {
    return value;
  }

  return "unverified";
};

export const normalizeCommunityUpdateType = (value: unknown): CommunityUpdateType => {
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

export const normalizeIncidentDomain = (value: unknown): IncidentDomain | null => {
  return isIncidentDomain(value) ? value : null;
};

export const normalizeIncidentKind = (value: unknown): IncidentReport["kind"] => {
  return isIncidentKind(value) ? value : null;
};

export const normalizeImpactAnswers = (value: unknown): IncidentImpactAnswers => {
  if (!value || typeof value !== "object") {
    return {};
  }

  const source = value as Partial<Record<string, unknown>>;

  return IMPACT_QUESTION_OPTIONS.reduce<IncidentImpactAnswers>(
    (answers, item) => {
      const rawAnswer = source[item.value];

      if (isIncidentImpactKey(item.value) && typeof rawAnswer === "boolean") {
        answers[item.value] = rawAnswer;
      }

      return answers;
    },
    {}
  );
};

export const normalizeUrgencyScore = (value: unknown): number | undefined => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return undefined;
  }

  return Math.min(100, Math.max(0, Math.round(value)));
};

export const normalizeUrgencyLevel = (
  value: unknown,
  score?: number
): IncidentUrgencyLevel | undefined => {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }

  if (typeof score === "number") {
    return getUrgencyLevelFromScore(score);
  }

  return undefined;
};

export const toDate = (value: unknown): Date | undefined => {
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

export const normalizeNullableString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
};

export const normalizeSubcategory = (
  value: unknown
): IncidentSubcategory | null => {
  if (typeof value === "string" && isIncidentType(value)) {
    return value;
  }

  return null;
};

export const normalizeType = (value: unknown): IncidentType | null => {
  if (typeof value === "string" && isIncidentType(value)) {
    return value;
  }

  return null;
};

export const normalizeCategory = (input: {
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

export const isSubcategoryCompatibleWithCategory = (
  subcategory: IncidentSubcategory | IncidentType | null,
  category: IncidentCategory
): boolean => {
  if (!subcategory) {
    return false;
  }

  return getCategoryBySubcategory(subcategory) === category;
};

export const normalizeStatus = (value: unknown): IncidentStatus => {
  if (value === "active" || value === "resolved") {
    return value;
  }

  return "active";
};

export const normalizeSeverity = (value: unknown): IncidentSeverity => {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }

  return "medium";
};

export const isIncidentSeverity = (value: unknown): value is IncidentSeverity => {
  return value === "low" || value === "medium" || value === "high";
};

export const normalizeVerificationStatus = (value: unknown): VerificationStatus => {
  if (value === "pending" || value === "verified" || value === "disputed") {
    return value;
  }

  return "pending";
};

export const normalizeVerificationType = (value: unknown): VerificationType => {
  if (
    value === "valid" ||
    value === "invalid" ||
    value === "condition_update"
  ) {
    return value;
  }

  return "condition_update";
};

export const normalizeConditionStatus = (value: unknown): IncidentConditionStatus => {
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

export const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      return typeof item === "string" ? item.trim() : "";
    })
    .filter((item) => item.length > 0);
};

export const normalizeCount = (value: unknown): number => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, value);
};

export const normalizeLatitude = (value: unknown): number | null => {
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

export const normalizeLongitude = (value: unknown): number | null => {
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

export const getNextVerificationStatus = (
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

