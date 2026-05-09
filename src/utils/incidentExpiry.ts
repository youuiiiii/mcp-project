import { IncidentReport, IncidentSubcategory } from "../types/incident";

const DEFAULT_EXPIRE_HOURS = 3;

export const INCIDENT_EXPIRE_HOURS: Record<IncidentSubcategory, number> = {
  flood: 12,
  earthquake: 24,
  landslide: 12,
  volcanic_eruption: 24,
  strong_wind: 6,
  tsunami: 24,

  fire: 3,
  building_fire: 3,
  vehicle_fire: 2,
  land_fire: 6,
  electrical_fire: 3,

  traffic_accident: 2,
  fallen_tree: 6,
  road_block: 4,
  damaged_road: 12,
  fallen_power_line: 3,
  collapsed_building: 12,

  crime: 2,
  theft: 2,
  brawl: 1,
  risky_crowd: 1,
  mob_violence: 1,
  public_disturbance: 2,

  medical: 1,
  fainted_person: 1,
  work_accident: 2,
  drowning: 1,
  evacuation_needed: 2,
};

export const getIncidentExpireHours = (
  subcategory?: IncidentSubcategory | null
): number => {
  if (!subcategory) {
    return DEFAULT_EXPIRE_HOURS;
  }

  return INCIDENT_EXPIRE_HOURS[subcategory] ?? DEFAULT_EXPIRE_HOURS;
};

export const getIncidentLastActivityAt = (
  incident: IncidentReport
): Date | undefined => {
  return incident.latestActivityAt ?? incident.updatedAt ?? incident.createdAt;
};

export const getHoursSinceDate = (date?: Date): number | null => {
  if (!date) {
    return null;
  }

  const time = date.getTime();

  if (Number.isNaN(time)) {
    return null;
  }

  return (Date.now() - time) / (1000 * 60 * 60);
};

export const getIncidentInactiveHours = (
  incident: IncidentReport
): number | null => {
  return getHoursSinceDate(getIncidentLastActivityAt(incident));
};

export const getIncidentNeedsUpdate = (incident: IncidentReport): boolean => {
  if (incident.status === "resolved") {
    return false;
  }

  const inactiveHours = getIncidentInactiveHours(incident);

  if (inactiveHours === null) {
    return false;
  }

  const expireHours = getIncidentExpireHours(
    incident.subcategory ?? incident.type
  );

  return inactiveHours >= expireHours;
};

export const getIncidentExpiryMessage = (incident: IncidentReport): string => {
  const inactiveHours = getIncidentInactiveHours(incident);
  const expireHours = getIncidentExpireHours(
    incident.subcategory ?? incident.type
  );

  if (inactiveHours === null) {
    return "Belum ada informasi aktivitas terbaru.";
  }

  if (inactiveHours < expireHours) {
    return `Laporan masih dalam periode aktif. Batas update sekitar ${expireHours} jam.`;
  }

  return `Laporan ini belum diperbarui selama sekitar ${inactiveHours.toFixed(
    1
  )} jam. User sekitar disarankan mengirim update kondisi terbaru.`;
};