import { colors } from "../theme/colors";
import type { IncidentReport, ModerationStatus } from "../types/incident";
import {
  getIncidentFreshnessMeta,
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

export type IncidentConfidenceMeta = {
  level: IncidentConfidenceLevel;
  score: number;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  freshnessState: IncidentFreshnessState;
  signals: {
    label: string;
    value: string;
  }[];
};

const clampScore = (score: number) => {
  return Math.max(0, Math.min(100, Math.round(score)));
};

const getModerationPenalty = (status?: ModerationStatus): number => {
  if (status === "hidden") {
    return 70;
  }

  if (status === "under_review") {
    return 25;
  }

  return 0;
};

const getFreshnessScoreDelta = (state: IncidentFreshnessState): number => {
  if (state === "fresh") {
    return 12;
  }

  if (state === "stale") {
    return -18;
  }

  if (state === "unknown") {
    return -6;
  }

  return 0;
};

const getConfidencePresentation = (
  incident: IncidentReport,
  score: number,
  freshnessState: IncidentFreshnessState
): Omit<IncidentConfidenceMeta, "score" | "freshnessState" | "signals"> => {
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
        "There are conflicting signals. Treat this report as early information.",
      color: colors.primaryDark,
      backgroundColor: colors.dangerSoft,
      borderColor: "#FECACA",
    };
  }

  if (freshnessState === "stale") {
    return {
      level: "stale",
      label: "Butuh Update",
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
        "This report has enough evidence or confirmation to be trusted by the community.",
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
      "This report is still new or does not have enough nearby community signals yet.",
    color: colors.warningDark,
    backgroundColor: colors.warningSoft,
    borderColor: "#FDE68A",
  };
};

export const getIncidentConfidenceMeta = (
  incident: IncidentReport
): IncidentConfidenceMeta => {
  const summary = getIncidentTrustSummaryData(incident);
  const freshness = getIncidentFreshnessMeta(incident);
  const trustLevel = getIncidentTrustLevel(incident);

  const verificationScore = Math.min(summary.verificationCount, 3) * 16;
  const disputePenalty = Math.min(summary.disputeCount, 3) * 18;
  const evidenceScore = Math.min(summary.evidenceCount, 4) * 6;
  const activityScore = Math.min(summary.replyCount, 5) * 3;
  const accuracyScore = Math.min(incident.accurateCount ?? 0, 4) * 5;
  const inaccuracyPenalty = Math.min(incident.inaccurateCount ?? 0, 4) * 8;
  const trustScore =
    trustLevel === "verified" ? 16 : trustLevel === "disputed" ? -22 : 0;
  const conditionUpdateScore = Math.min(incident.conditionUpdateCount ?? 0, 3) * 5;
  const latestConditionScore = getLatestConditionScore(
    incident.latestCommunityUpdateType
  );

  const score = clampScore(
    34 +
      verificationScore +
      evidenceScore +
      activityScore +
      accuracyScore +
      conditionUpdateScore +
      latestConditionScore +
      trustScore +
      getFreshnessScoreDelta(freshness.state) -
      inaccuracyPenalty -
      disputePenalty -
      getModerationPenalty(incident.moderationStatus)
  );

  const presentation = getConfidencePresentation(
    incident,
    score,
    freshness.state
  );

  return {
    ...presentation,
    score,
    freshnessState: freshness.state,
    signals: [
      {
        label: "Score",
        value: `${score}/100`,
      },
      {
        label: "Evidence",
        value: String(summary.evidenceCount),
      },
      {
        label: "Valid",
        value: String(summary.verificationCount),
      },
      {
        label: "Disputes",
        value: String(summary.disputeCount),
      },
      {
        label: "Updates",
        value: String(incident.conditionUpdateCount ?? 0),
      },
      {
        label: "Accurate",
        value: String(incident.accurateCount ?? 0),
      },
    ],
  };
};

function getLatestConditionScore(
  updateType: IncidentReport["latestCommunityUpdateType"]
) {
  if (updateType === "still_happening" || updateType === "getting_worse") {
    return 8;
  }

  if (updateType === "improving") {
    return 3;
  }

  if (updateType === "safe_now") {
    return -4;
  }

  if (updateType === "not_found") {
    return -16;
  }

  return 0;
}
