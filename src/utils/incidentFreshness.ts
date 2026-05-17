import type { IncidentCategory, IncidentReport } from "../types/incident";

export type IncidentFreshnessState = "unknown" | "fresh" | "stale" | "resolved";

export type IncidentFreshnessMeta = {
  state: IncidentFreshnessState;
  inactiveHours: number | null;
  staleAfterHours: number;
  needsUpdate: boolean;
  message: string;
};

const HOURS_IN_MS = 1000 * 60 * 60;

const DEFAULT_STALE_AFTER_HOURS = 6;

export const INCIDENT_STALE_AFTER_HOURS_BY_CATEGORY = {
  natural_disaster: 12,
  fire_emergency: 3,
  accident_infrastructure: 6,
  security_public_order: 3,
  medical_rescue: 2,
  missing_lost: 4,
} as const satisfies Record<IncidentCategory, number>;

const formatInactiveDuration = (hours: number): string => {
  if (hours < 1) {
    return "kurang dari 1 jam";
  }

  if (hours < 24) {
    return `sekitar ${Math.round(hours)} jam`;
  }

  const days = hours / 24;

  if (days < 10) {
    return `sekitar ${days.toFixed(1)} hari`;
  }

  return `sekitar ${Math.round(days)} hari`;
};

export const getIncidentLastActivityAt = (
  incident: IncidentReport
): Date | undefined => {
  return incident.latestActivityAt ?? incident.updatedAt ?? incident.createdAt;
};

export const getHoursSinceDate = (date?: Date | null): number | null => {
  if (!date) {
    return null;
  }

  if (!(date instanceof Date)) {
    return null;
  }

  const timestamp = date.getTime();

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return Math.max(0, (Date.now() - timestamp) / HOURS_IN_MS);
};

export const getIncidentStaleAfterHours = (
  incident: IncidentReport
): number => {
  return (
    INCIDENT_STALE_AFTER_HOURS_BY_CATEGORY[incident.category] ??
    DEFAULT_STALE_AFTER_HOURS
  );
};

export const getIncidentInactiveHours = (
  incident: IncidentReport
): number | null => {
  return getHoursSinceDate(getIncidentLastActivityAt(incident));
};

export const getIncidentFreshnessMeta = (
  incident: IncidentReport
): IncidentFreshnessMeta => {
  const inactiveHours = getIncidentInactiveHours(incident);
  const staleAfterHours = getIncidentStaleAfterHours(incident);

  if (incident.status === "resolved") {
    return {
      state: "resolved",
      inactiveHours,
      staleAfterHours,
      needsUpdate: false,
      message: "Laporan ini sudah selesai.",
    };
  }

  if (inactiveHours === null) {
    return {
      state: "unknown",
      inactiveHours,
      staleAfterHours,
      needsUpdate: false,
      message: "Belum ada informasi aktivitas terbaru untuk laporan ini.",
    };
  }

  if (inactiveHours < staleAfterHours) {
    return {
      state: "fresh",
      inactiveHours,
      staleAfterHours,
      needsUpdate: false,
      message: "Update laporan ini masih cukup baru.",
    };
  }

  return {
    state: "stale",
    inactiveHours,
    staleAfterHours,
    needsUpdate: true,
    message: `Laporan ini belum diperbarui selama ${formatInactiveDuration(
      inactiveHours
    )}. Warga sekitar dapat mengirim update kondisi terbaru jika aman.`,
  };
};

export const getIncidentNeedsUpdate = (incident: IncidentReport): boolean => {
  return getIncidentFreshnessMeta(incident).needsUpdate;
};

export const getIncidentFreshnessMessage = (
  incident: IncidentReport
): string => {
  return getIncidentFreshnessMeta(incident).message;
};
