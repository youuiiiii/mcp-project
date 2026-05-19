import type { IncidentReport } from "../types/incident";

export type IncidentTrustLevel = "pending" | "verified" | "disputed" | "resolved";

export type IncidentTrustMeta = {
  level: IncidentTrustLevel;
  label: string;
  shortLabel: string;
  description: string;
};

export type IncidentTrustSummary = {
  verificationCount: number;
  disputeCount: number;
  evidenceCount: number;
  replyCount: number;
};

const VERIFIED_THRESHOLD = 2;
const DISPUTED_THRESHOLD = 2;

export const INCIDENT_TRUST_META = {
  pending: {
    level: "pending",
    label: "Needs Verification",
    shortLabel: "Pending",
    description:
      "This report still needs verification or additional evidence from nearby users.",
  },
  verified: {
    level: "verified",
    label: "Community Verified",
    shortLabel: "Verified",
    description:
      "This report has enough valid confirmations from nearby users.",
  },
  disputed: {
    level: "disputed",
    label: "Questioned",
    shortLabel: "Disputed",
    description:
      "There are enough counter-signals saying the condition is inaccurate or not found.",
  },
  resolved: {
    level: "resolved",
    label: "Resolved",
    shortLabel: "Resolved",
    description:
      "This report has been marked resolved with evidence and resolution notes.",
  },
} as const satisfies Record<IncidentTrustLevel, IncidentTrustMeta>;

const getSafeCount = (value?: number): number => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, value);
};

export const getIncidentTrustSummaryData = (
  incident: IncidentReport
): IncidentTrustSummary => {
  return {
    verificationCount: getSafeCount(incident.verificationCount),
    disputeCount: getSafeCount(incident.disputeCount),
    evidenceCount: getSafeCount(incident.evidenceCount),
    replyCount: getSafeCount(incident.replyCount),
  };
};

export const getIncidentTrustLevel = (
  incident: IncidentReport
): IncidentTrustLevel => {
  if (incident.status === "resolved") {
    return "resolved";
  }

  const { verificationCount, disputeCount } =
    getIncidentTrustSummaryData(incident);

  if (incident.verificationStatus === "disputed") {
    return "disputed";
  }

  if (incident.verificationStatus === "verified") {
    return "verified";
  }

  const hasEnoughDisputes =
    disputeCount >= DISPUTED_THRESHOLD && disputeCount >= verificationCount;

  if (hasEnoughDisputes) {
    return "disputed";
  }

  const hasEnoughVerifications =
    verificationCount >= VERIFIED_THRESHOLD && verificationCount > disputeCount;

  if (hasEnoughVerifications) {
    return "verified";
  }

  return "pending";
};

export const getIncidentTrustMeta = (
  incident: IncidentReport
): IncidentTrustMeta => {
  return INCIDENT_TRUST_META[getIncidentTrustLevel(incident)];
};

export const formatIncidentTrustSummary = (
  summary: IncidentTrustSummary
): string => {
  return [
    `Valid confirmations: ${summary.verificationCount}`,
    `Disputes: ${summary.disputeCount}`,
    `Evidence photos: ${summary.evidenceCount}`,
    `Discussions: ${summary.replyCount}`,
  ].join("\n");
};

export const getIncidentTrustSummary = (incident: IncidentReport): string => {
  return formatIncidentTrustSummary(getIncidentTrustSummaryData(incident));
};
