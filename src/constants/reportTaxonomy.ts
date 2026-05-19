import type { Ionicons } from "@expo/vector-icons";

import type {
  IncidentCategory,
  IncidentDomain,
  IncidentImpactAnswers,
  IncidentImpactKey,
  IncidentKind,
  IncidentSeverity,
  IncidentSubcategory,
  IncidentUrgencyLevel,
} from "../types/incident";
import type { TranslationKey } from "../i18n";

type AppIconName = keyof typeof Ionicons.glyphMap;

export type ReportKindOption = {
  value: IncidentKind;
  domain: IncidentDomain;
  labelKey: TranslationKey;
  shortLabelKey: TranslationKey;
  helperKey: TranslationKey;
  defaultTitle: string;
  iconName: AppIconName;
  color: string;
  lightColor: string;
  baseUrgency: number;
  legacyCategory: IncidentCategory;
  legacySubcategory: IncidentSubcategory;
};

export type ImpactQuestionOption = {
  value: IncidentImpactKey;
  labelKey: TranslationKey;
  helperKey: TranslationKey;
  iconName: AppIconName;
  weight: number;
};

export const DEFAULT_IMPACT_ANSWERS: IncidentImpactAnswers = {
  people_in_danger: false,
  access_blocked: false,
  needs_emergency_help: false,
  still_happening: true,
  location_is_exact: false,
};

export const REPORT_KIND_OPTIONS: ReportKindOption[] = [
  {
    value: "road_blocked_or_crash",
    domain: "traffic_access",
    labelKey: "report.kind.roadBlockedOrCrash.label",
    shortLabelKey: "report.kind.roadBlockedOrCrash.short",
    helperKey: "report.kind.roadBlockedOrCrash.helper",
    defaultTitle: "Road issue reported nearby",
    iconName: "car-sport",
    color: "#EA580C",
    lightColor: "#FFEDD5",
    baseUrgency: 30,
    legacyCategory: "accident_infrastructure",
    legacySubcategory: "traffic_accident",
  },
  {
    value: "flood_or_weather",
    domain: "weather_disaster",
    labelKey: "report.kind.floodOrWeather.label",
    shortLabelKey: "report.kind.floodOrWeather.short",
    helperKey: "report.kind.floodOrWeather.helper",
    defaultTitle: "Weather hazard reported nearby",
    iconName: "rainy",
    color: "#2563EB",
    lightColor: "#DBEAFE",
    baseUrgency: 32,
    legacyCategory: "natural_disaster",
    legacySubcategory: "flood",
  },
  {
    value: "fire_or_smoke",
    domain: "fire_smoke",
    labelKey: "report.kind.fireOrSmoke.label",
    shortLabelKey: "report.kind.fireOrSmoke.short",
    helperKey: "report.kind.fireOrSmoke.helper",
    defaultTitle: "Fire or smoke reported nearby",
    iconName: "flame",
    color: "#DC2626",
    lightColor: "#FEE2E2",
    baseUrgency: 45,
    legacyCategory: "fire_emergency",
    legacySubcategory: "fire",
  },
  {
    value: "public_safety",
    domain: "public_safety",
    labelKey: "report.kind.publicSafety.label",
    shortLabelKey: "report.kind.publicSafety.short",
    helperKey: "report.kind.publicSafety.helper",
    defaultTitle: "Public safety issue reported nearby",
    iconName: "shield",
    color: "#BE123C",
    lightColor: "#FFE4E6",
    baseUrgency: 34,
    legacyCategory: "security_public_order",
    legacySubcategory: "public_disturbance",
  },
  {
    value: "medical_or_rescue",
    domain: "medical_rescue",
    labelKey: "report.kind.medicalOrRescue.label",
    shortLabelKey: "report.kind.medicalOrRescue.short",
    helperKey: "report.kind.medicalOrRescue.helper",
    defaultTitle: "Medical or rescue help reported nearby",
    iconName: "medkit",
    color: "#0891B2",
    lightColor: "#CFFAFE",
    baseUrgency: 46,
    legacyCategory: "medical_rescue",
    legacySubcategory: "medical",
  },
  {
    value: "missing_person",
    domain: "lost_found",
    labelKey: "report.kind.missingPerson.label",
    shortLabelKey: "report.kind.missingPerson.short",
    helperKey: "report.kind.missingPerson.helper",
    defaultTitle: "Missing person report nearby",
    iconName: "person",
    color: "#7C3AED",
    lightColor: "#EDE9FE",
    baseUrgency: 38,
    legacyCategory: "missing_lost",
    legacySubcategory: "missing_person",
  },
  {
    value: "lost_item_or_vehicle",
    domain: "lost_found",
    labelKey: "report.kind.lostItemOrVehicle.label",
    shortLabelKey: "report.kind.lostItemOrVehicle.short",
    helperKey: "report.kind.lostItemOrVehicle.helper",
    defaultTitle: "Lost item or vehicle report nearby",
    iconName: "bag-handle",
    color: "#6D28D9",
    lightColor: "#EDE9FE",
    baseUrgency: 14,
    legacyCategory: "missing_lost",
    legacySubcategory: "missing_item",
  },
  {
    value: "other_incident",
    domain: "other",
    labelKey: "report.kind.otherIncident.label",
    shortLabelKey: "report.kind.otherIncident.short",
    helperKey: "report.kind.otherIncident.helper",
    defaultTitle: "Incident reported nearby",
    iconName: "help-circle",
    color: "#475569",
    lightColor: "#F1F5F9",
    baseUrgency: 20,
    legacyCategory: "other",
    legacySubcategory: "other_incident",
  },
];

export const IMPACT_QUESTION_OPTIONS: ImpactQuestionOption[] = [
  {
    value: "people_in_danger",
    labelKey: "report.impact.peopleInDanger.label",
    helperKey: "report.impact.peopleInDanger.helper",
    iconName: "people",
    weight: 30,
  },
  {
    value: "access_blocked",
    labelKey: "report.impact.accessBlocked.label",
    helperKey: "report.impact.accessBlocked.helper",
    iconName: "trail-sign",
    weight: 18,
  },
  {
    value: "needs_emergency_help",
    labelKey: "report.impact.needsEmergencyHelp.label",
    helperKey: "report.impact.needsEmergencyHelp.helper",
    iconName: "alert-circle",
    weight: 28,
  },
  {
    value: "still_happening",
    labelKey: "report.impact.stillHappening.label",
    helperKey: "report.impact.stillHappening.helper",
    iconName: "radio-button-on",
    weight: 12,
  },
  {
    value: "location_is_exact",
    labelKey: "report.impact.locationIsExact.label",
    helperKey: "report.impact.locationIsExact.helper",
    iconName: "locate",
    weight: 6,
  },
];

export function getReportKindOption(kind: IncidentKind) {
  return REPORT_KIND_OPTIONS.find((item) => item.value === kind) ?? null;
}

export function isIncidentDomain(value: unknown): value is IncidentDomain {
  return REPORT_KIND_OPTIONS.some((item) => item.domain === value);
}

export function isIncidentKind(value: unknown): value is IncidentKind {
  return REPORT_KIND_OPTIONS.some((item) => item.value === value);
}

export function isIncidentImpactKey(
  value: unknown
): value is IncidentImpactKey {
  return IMPACT_QUESTION_OPTIONS.some((item) => item.value === value);
}

export function calculateIncidentUrgency(input: {
  kind: IncidentKind;
  impactAnswers: IncidentImpactAnswers;
}): {
  score: number;
  level: IncidentUrgencyLevel;
  severity: IncidentSeverity;
} {
  const kindOption = getReportKindOption(input.kind);
  const baseScore = kindOption?.baseUrgency ?? 20;
  const impactScore = IMPACT_QUESTION_OPTIONS.reduce((total, item) => {
    if (input.impactAnswers[item.value] !== true) {
      return total;
    }

    return total + item.weight;
  }, 0);

  const score = Math.min(100, Math.max(0, baseScore + impactScore));
  const level = getUrgencyLevelFromScore(score);

  return {
    score,
    level,
    severity: level,
  };
}

export function getUrgencyLevelFromScore(score: number): IncidentUrgencyLevel {
  if (score >= 70) {
    return "high";
  }

  if (score >= 38) {
    return "medium";
  }

  return "low";
}
