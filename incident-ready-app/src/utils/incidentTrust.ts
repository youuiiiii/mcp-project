import { IncidentReport } from "../types/incident";

export type IncidentTrustLevel =
  | "pending"
  | "verified"
  | "disputed"
  | "needs_update"
  | "resolved";

export type IncidentTrustMeta = {
  level: IncidentTrustLevel;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  shortIcon: string;
  color: string;
  lightColor: string;
};

const VERIFIED_THRESHOLD = 2;
const DISPUTED_THRESHOLD = 2;
const NEEDS_UPDATE_AFTER_HOURS = 3;

const getHoursSince = (date?: Date): number | null => {
  if (!date) {
    return null;
  }

  const time = date.getTime();

  if (Number.isNaN(time)) {
    return null;
  }

  return (Date.now() - time) / (1000 * 60 * 60);
};

export const INCIDENT_TRUST_META: Record<IncidentTrustLevel, IncidentTrustMeta> =
  {
    pending: {
      level: "pending",
      label: "Menunggu Verifikasi",
      shortLabel: "Pending",
      description:
        "Laporan baru dibuat dan masih membutuhkan bukti/verifikasi dari user sekitar.",
      icon: "🕒",
      shortIcon: "?",
      color: "#F59E0B",
      lightColor: "#FEF3C7",
    },
    verified: {
      level: "verified",
      label: "Terverifikasi Komunitas",
      shortLabel: "Verified",
      description:
        "Incident sudah mendapat cukup bukti valid dari user lain di sekitar lokasi.",
      icon: "✅",
      shortIcon: "✓",
      color: "#16A34A",
      lightColor: "#DCFCE7",
    },
    disputed: {
      level: "disputed",
      label: "Dipertanyakan",
      shortLabel: "Disputed",
      description:
        "Ada beberapa verifikasi yang menyatakan laporan tidak sesuai atau tidak ditemukan.",
      icon: "⚠️",
      shortIcon: "!",
      color: "#DC2626",
      lightColor: "#FEE2E2",
    },
    needs_update: {
      level: "needs_update",
      label: "Perlu Update",
      shortLabel: "Update",
      description:
        "Laporan aktif sudah cukup lama tanpa aktivitas terbaru. User sekitar disarankan memberi update kondisi.",
      icon: "🔄",
      shortIcon: "↻",
      color: "#9333EA",
      lightColor: "#F3E8FF",
    },
    resolved: {
      level: "resolved",
      label: "Selesai",
      shortLabel: "Resolved",
      description:
        "Incident sudah ditandai selesai dengan bukti foto dan catatan penyelesaian.",
      icon: "🏁",
      shortIcon: "✓",
      color: "#64748B",
      lightColor: "#F1F5F9",
    },
  };

export const getIncidentTrustLevel = (
  incident: IncidentReport
): IncidentTrustLevel => {
  if (incident.status === "resolved") {
    return "resolved";
  }

  const verificationCount = incident.verificationCount ?? 0;
  const disputeCount = incident.disputeCount ?? 0;

  if (
    disputeCount >= DISPUTED_THRESHOLD &&
    disputeCount >= verificationCount
  ) {
    return "disputed";
  }

  if (
    verificationCount >= VERIFIED_THRESHOLD &&
    verificationCount > disputeCount
  ) {
    return "verified";
  }

  const lastActivity =
    incident.latestActivityAt ?? incident.updatedAt ?? incident.createdAt;

  const hoursSinceLastActivity = getHoursSince(lastActivity);

  if (
    hoursSinceLastActivity !== null &&
    hoursSinceLastActivity >= NEEDS_UPDATE_AFTER_HOURS
  ) {
    return "needs_update";
  }

  return "pending";
};

export const getIncidentTrustMeta = (
  incident: IncidentReport
): IncidentTrustMeta => {
  const level = getIncidentTrustLevel(incident);

  return INCIDENT_TRUST_META[level];
};

export const getIncidentTrustSummary = (incident: IncidentReport): string => {
  const verificationCount = incident.verificationCount ?? 0;
  const disputeCount = incident.disputeCount ?? 0;
  const evidenceCount = incident.evidenceCount ?? 0;
  const replyCount = incident.replyCount ?? 0;

  return `Valid: ${verificationCount}\nTidak sesuai: ${disputeCount}\nBukti foto: ${evidenceCount}\nDiskusi: ${replyCount}`;
};