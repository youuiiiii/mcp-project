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
    label: "Menunggu Verifikasi",
    shortLabel: "Pending",
    description:
      "Laporan masih membutuhkan verifikasi atau bukti tambahan dari warga sekitar.",
  },
  verified: {
    level: "verified",
    label: "Terverifikasi Komunitas",
    shortLabel: "Verified",
    description:
      "Laporan sudah mendapat verifikasi valid yang cukup dari warga sekitar.",
  },
  disputed: {
    level: "disputed",
    label: "Dipertanyakan",
    shortLabel: "Disputed",
    description:
      "Ada cukup laporan balik yang menyatakan kondisi tidak sesuai atau tidak ditemukan.",
  },
  resolved: {
    level: "resolved",
    label: "Selesai",
    shortLabel: "Resolved",
    description:
      "Laporan sudah ditandai selesai dengan bukti dan catatan penyelesaian.",
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
    `Verifikasi valid: ${summary.verificationCount}`,
    `Tidak sesuai: ${summary.disputeCount}`,
    `Bukti foto: ${summary.evidenceCount}`,
    `Diskusi: ${summary.replyCount}`,
  ].join("\n");
};

export const getIncidentTrustSummary = (incident: IncidentReport): string => {
  return formatIncidentTrustSummary(getIncidentTrustSummaryData(incident));
};