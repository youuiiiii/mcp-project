import type {
  IncidentCategory,
  IncidentSubcategory,
  IncidentType,
} from "../../types/incident";
import {
  INCIDENT_CATEGORIES,
  UNKNOWN_INCIDENT_META,
} from "./categoryMeta";
import { INCIDENT_TYPES } from "./typeMeta";
import { INCIDENT_TYPE_OPTIONS } from "./options";
import type {
  IncidentCategoryMeta,
  IncidentDisplayMeta,
  IncidentMeta,
  IncidentTypeOption,
} from "./types";

export const isIncidentCategory = (value: string): value is IncidentCategory => {
  return Object.prototype.hasOwnProperty.call(INCIDENT_CATEGORIES, value);
};

export const isIncidentType = (value: string): value is IncidentType => {
  return Object.prototype.hasOwnProperty.call(INCIDENT_TYPES, value);
};

export const getIncidentCategoryMeta = (
  category?: IncidentCategory | null
): IncidentCategoryMeta => {
  if (!category || !isIncidentCategory(category)) {
    return UNKNOWN_INCIDENT_META;
  }
  return INCIDENT_CATEGORIES[category];
};

export const getIncidentMeta = (
  type?: IncidentType | IncidentSubcategory | null
): IncidentMeta | null => {
  if (!type || !isIncidentType(type)) {
    return null;
  }
  return INCIDENT_TYPES[type];
};

export const getIncidentDisplayMeta = (input: {
  category?: IncidentCategory | null;
  subcategory?: IncidentSubcategory | IncidentType | null;
}): IncidentDisplayMeta => {
  const subcategoryMeta = getIncidentMeta(input.subcategory);
  if (subcategoryMeta) {
    return subcategoryMeta;
  }
  return getIncidentCategoryMeta(input.category);
};

export const getCategoryBySubcategory = (
  subcategory?: IncidentSubcategory | IncidentType | null
): IncidentCategory | null => {
  const subcategoryMeta = getIncidentMeta(subcategory);
  return subcategoryMeta?.category ?? null;
};

export const getSubcategoriesByCategory = (
  category: IncidentCategory
): IncidentTypeOption[] => {
  return INCIDENT_TYPE_OPTIONS.filter((item) => item.category === category);
};

export const getFilterLabel = (value: string): string => {
  if (value === "all") return "All incidents";
  if (value === "active") return "Active reports";
  if (value === "resolved") return "Resolved reports";
  if (isIncidentCategory(value)) return getIncidentCategoryMeta(value).label;
  if (isIncidentType(value)) return getIncidentMeta(value)?.label ?? "Unknown filter";
  return "Unknown filter";
};
