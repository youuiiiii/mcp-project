import {
  Coordinate,
  IncidentReport,
  IncidentSeverity,
  IncidentSubcategory,
} from "../types/incident";
import { getDistanceInMeters } from "./geo";
import { getIncidentInactiveHours } from "./incidentExpiry";
import { getIncidentTrustLevel } from "./incidentTrust";

export type IncidentUrgencyLevel = "low" | "medium" | "high" | "critical";

export type IncidentUrgencyMeta = {
  level: IncidentUrgencyLevel;
  score: number;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  lightColor: string;
};

const SEVERITY_SCORE: Record<IncidentSeverity, number> = {
  low: 10,
  medium: 25,
  high: 40,
};

const SUBCATEGORY_RISK_SCORE: Record<IncidentSubcategory, number> = {
  flood: 20,
  earthquake: 30,
  landslide: 25,
  volcanic_eruption: 35,
  strong_wind: 18,
  tsunami: 40,

  fire: 30,
  building_fire: 35,
  vehicle_fire: 25,
  land_fire: 30,
  electrical_fire: 28,

  traffic_accident: 25,
  fallen_tree: 18,
  road_block: 15,
  damaged_road: 12,
  fallen_power_line: 30,
  collapsed_building: 35,

  crime: 25,
  theft: 18,
  brawl: 28,
  risky_crowd: 22,
  mob_violence: 32,
  public_disturbance: 18,

  medical: 35,
  fainted_person: 30,
  work_accident: 28,
  drowning: 40,
  evacuation_needed: 35,
};

export const INCIDENT_URGENCY_META: Record<
  IncidentUrgencyLevel,
  Omit<IncidentUrgencyMeta, "score">
> = {
  low: {
    level: "low",
    label: "Urgency Rendah",
    shortLabel: "LOW",
    description: "Incident perlu diketahui, tetapi tidak terlalu mendesak.",
    color: "#16A34A",
    lightColor: "#DCFCE7",
  },
  medium: {
    level: "medium",
    label: "Urgency Sedang",
    shortLabel: "MED",
    description: "Incident mengganggu aktivitas sekitar dan perlu diwaspadai.",
    color: "#F59E0B",
    lightColor: "#FEF3C7",
  },
  high: {
    level: "high",
    label: "Urgency Tinggi",
    shortLabel: "HIGH",
    description: "Incident berisiko tinggi dan membutuhkan perhatian cepat.",
    color: "#EA580C",
    lightColor: "#FFEDD5",
  },
  critical: {
    level: "critical",
    label: "Urgency Kritis",
    shortLabel: "CRT",
    description:
      "Incident sangat mendesak, berbahaya, dan perlu perhatian segera.",
    color: "#DC2626",
    lightColor: "#FEE2E2",
  },
};

const clampScore = (score: number): number => {
  return Math.max(0, Math.min(100, Math.round(score)));
};

const getUrgencyLevelByScore = (score: number): IncidentUrgencyLevel => {
  if (score >= 75) {
    return "critical";
  }

  if (score >= 55) {
    return "high";
  }

  if (score >= 30) {
    return "medium";
  }

  return "low";
};

export const getIncidentUrgencyScore = (
  incident: IncidentReport,
  userLocation?: Coordinate | null
): number => {
  if (incident.status === "resolved") {
    return 0;
  }

  let score = 0;

  score += SEVERITY_SCORE[incident.severity] ?? 20;
  score += SUBCATEGORY_RISK_SCORE[incident.subcategory ?? incident.type] ?? 15;

  const trustLevel = getIncidentTrustLevel(incident);

  if (trustLevel === "verified") {
    score += 18;
  }

  if (trustLevel === "pending") {
    score += 5;
  }

  if (trustLevel === "needs_update") {
    score -= 10;
  }

  if (trustLevel === "disputed") {
    score -= 25;
  }

  const verificationCount = incident.verificationCount ?? 0;
  const disputeCount = incident.disputeCount ?? 0;
  const evidenceCount = incident.evidenceCount ?? 0;

  score += Math.min(verificationCount * 4, 12);
  score += Math.min(evidenceCount * 2, 10);
  score -= Math.min(disputeCount * 8, 24);

  const inactiveHours = getIncidentInactiveHours(incident);

  if (inactiveHours !== null) {
    if (inactiveHours <= 1) {
      score += 6;
    } else if (inactiveHours >= 6) {
      score -= 8;
    }
  }

  if (userLocation) {
    const distance = getDistanceInMeters(userLocation, {
      latitude: incident.latitude,
      longitude: incident.longitude,
    });

    if (distance <= 100) {
      score += 12;
    } else if (distance <= 300) {
      score += 8;
    } else if (distance <= 700) {
      score += 4;
    }
  }

  return clampScore(score);
};

export const getIncidentUrgencyMeta = (
  incident: IncidentReport,
  userLocation?: Coordinate | null
): IncidentUrgencyMeta => {
  const score = getIncidentUrgencyScore(incident, userLocation);
  const level = getUrgencyLevelByScore(score);
  const meta = INCIDENT_URGENCY_META[level];

  return {
    ...meta,
    score,
  };
};