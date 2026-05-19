import type {
  IncidentCategory,
  IncidentSubcategory,
} from "../../types/incident";
import { INCIDENT_CATEGORIES } from "./categoryMeta";
import { INCIDENT_TYPES } from "./typeMeta";
import type {
  IncidentCategoryOption,
  IncidentTypeOption,
  SeverityOption,
} from "./types";

export const INCIDENT_CATEGORY_OPTIONS: IncidentCategoryOption[] =
  Object.entries(INCIDENT_CATEGORIES).map(([value, meta]) => ({
    value: value as IncidentCategory,
    label: meta.label,
    shortLabel: meta.shortLabel,
    iconName: meta.iconName,
    color: meta.color,
    lightColor: meta.lightColor,
    description: meta.description,
  }));

export const INCIDENT_TYPE_OPTIONS: IncidentTypeOption[] = Object.entries(
  INCIDENT_TYPES
).map(([value, meta]) => ({
  value: value as IncidentSubcategory,
  category: meta.category,
  label: meta.label,
  shortLabel: meta.shortLabel,
  iconName: meta.iconName,
  color: meta.color,
  lightColor: meta.lightColor,
}));

export const SEVERITY_OPTIONS: SeverityOption[] = [
  {
    value: "low",
    label: "Low",
    color: "#16A34A",
    lightColor: "#DCFCE7",
    iconName: "checkmark-circle",
    description: "Not immediately dangerous, but still useful for nearby people to know.",
  },
  {
    value: "medium",
    label: "Medium",
    color: "#F59E0B",
    lightColor: "#FEF3C7",
    iconName: "warning",
    description: "Disrupts nearby activity and needs caution.",
  },
  {
    value: "high",
    label: "High",
    color: "#DC2626",
    lightColor: "#FEE2E2",
    iconName: "alert-circle",
    description: "Dangerous, urgent, and needs quick attention.",
  },
];
