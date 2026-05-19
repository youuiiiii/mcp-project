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
  other: 6,
} as const satisfies Record<IncidentCategory, number>;

const formatInactiveDuration = (hours: number): string => {
  if (hours < 1) {
    return "less than 1 hour";
  }

  if (hours < 24) {
    return `about ${Math.round(hours)} hours`;
  }

  const days = hours / 24;

  if (days < 10) {
    return `about ${days.toFixed(1)} days`;
  }

  return `about ${Math.round(days)} days`;
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
      message: "This report is already resolved.",
    };
  }

  if (inactiveHours === null) {
    return {
      state: "unknown",
      inactiveHours,
      staleAfterHours,
      needsUpdate: false,
      message: "No recent activity information is available for this report.",
    };
  }

  if (inactiveHours < staleAfterHours) {
    return {
      state: "fresh",
      inactiveHours,
      staleAfterHours,
      needsUpdate: false,
      message: "This report was updated recently.",
    };
  }

  return {
    state: "stale",
    inactiveHours,
    staleAfterHours,
    needsUpdate: true,
    message: `This report has not been updated for ${formatInactiveDuration(
      inactiveHours
    )}. Nearby users can send a condition update if it is safe.`,
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
