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
      label: "Selesai",
      shortLabel: "Selesai",
      description: "Kejadian sudah ditandai selesai dengan catatan penyelesaian.",
      color: colors.successDark,
      backgroundColor: colors.successSoft,
      borderColor: "#BBF7D0",
    };
  }

  if (trustLevel === "disputed" || score < 35) {
    return {
      level: "questioned",
      label: "Perlu Ditinjau",
      shortLabel: "Ditinjau",
      description:
        "Ada sinyal yang bertentangan. Gunakan laporan ini sebagai informasi awal.",
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
        "Laporan ini sudah lama tidak diperbarui dan perlu konfirmasi kondisi terbaru.",
      color: colors.warningDark,
      backgroundColor: colors.warningSoft,
      borderColor: "#FDE68A",
    };
  }

  if (score >= 78 || trustLevel === "verified") {
    return {
      level: "confirmed",
      label: "Kuat",
      shortLabel: "Kuat",
      description:
        "Laporan punya cukup bukti atau konfirmasi untuk dipercaya komunitas.",
      color: colors.successDark,
      backgroundColor: colors.successSoft,
      borderColor: "#BBF7D0",
    };
  }

  if (score >= 55) {
    return {
      level: "credible",
      label: "Cukup Kuat",
      shortLabel: "Cukup",
      description:
        "Laporan punya beberapa sinyal pendukung, tetapi masih bisa diperkuat.",
      color: colors.infoDark,
      backgroundColor: colors.infoSoft,
      borderColor: "#BFDBFE",
    };
  }

  return {
    level: "emerging",
    label: "Baru Muncul",
    shortLabel: "Baru",
    description:
      "Laporan masih baru atau belum memiliki cukup sinyal dari warga sekitar.",
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
        label: "Skor",
        value: `${score}/100`,
      },
      {
        label: "Bukti",
        value: String(summary.evidenceCount),
      },
      {
        label: "Valid",
        value: String(summary.verificationCount),
      },
      {
        label: "Bantahan",
        value: String(summary.disputeCount),
      },
      {
        label: "Update",
        value: String(incident.conditionUpdateCount ?? 0),
      },
      {
        label: "Akurat",
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
