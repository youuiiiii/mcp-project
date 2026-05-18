import type { Ionicons } from "@expo/vector-icons";

import type {
  IncidentCategory,
  IncidentSeverity,
  IncidentSubcategory,
  IncidentType,
} from "../types/incident";

export type AppIconName = keyof typeof Ionicons.glyphMap;

type IncidentBaseMeta = {
  label: string;
  shortLabel: string;
  iconName: AppIconName;
  color: string;
  lightColor: string;
  description?: string;
};

export type IncidentCategoryMeta = IncidentBaseMeta & {
  description: string;
};

export type IncidentMeta = IncidentBaseMeta & {
  category: IncidentCategory;
};

export type IncidentDisplayMeta = IncidentCategoryMeta | IncidentMeta;

export type IncidentCategoryOption = {
  value: IncidentCategory;
  label: string;
  shortLabel: string;
  iconName: AppIconName;
  color: string;
  lightColor: string;
  description: string;
};

export type IncidentTypeOption = {
  value: IncidentSubcategory;
  category: IncidentCategory;
  label: string;
  shortLabel: string;
  iconName: AppIconName;
  color: string;
  lightColor: string;
};

export type SeverityOption = {
  value: IncidentSeverity;
  label: string;
  color: string;
  lightColor: string;
  iconName: AppIconName;
  description: string;
};

export const REPORT_ALLOWED_DISTANCE_METERS = 20;
export const VERIFICATION_DISTANCE_METERS = 80;
export const WARNING_DISTANCE_METERS = 700;
export const LOCAL_INCIDENT_NOTIFICATION_DISTANCE_METERS = 300;

const UNKNOWN_INCIDENT_META: IncidentCategoryMeta = {
  label: "Unknown Category",
  shortLabel: "Unknown",
  iconName: "help-circle",
  color: "#64748B",
  lightColor: "#F1F5F9",
  description: "The report category is missing or not recognized by the system.",
};

export const INCIDENT_CATEGORIES = {
  natural_disaster: {
    label: "Natural Disaster",
    shortLabel: "Disaster",
    iconName: "earth",
    color: "#2563EB",
    lightColor: "#DBEAFE",
    description: "Floods, earthquakes, landslides, tsunamis, strong winds, or other natural hazards.",
  },
  fire_emergency: {
    label: "Fire Emergency",
    shortLabel: "Fire",
    iconName: "flame",
    color: "#DC2626",
    lightColor: "#FEE2E2",
    description: "Fire, heavy smoke, building fires, vehicle fires, land fires, or electrical fires.",
  },
  accident_infrastructure: {
    label: "Accident & Infrastructure",
    shortLabel: "Road",
    iconName: "construct",
    color: "#EA580C",
    lightColor: "#FFEDD5",
    description: "Accidents, blocked or damaged roads, fallen trees, downed cables, or damaged facilities.",
  },
  security_public_order: {
    label: "Security & Public Order",
    shortLabel: "Security",
    iconName: "shield",
    color: "#BE123C",
    lightColor: "#FFE4E6",
    description: "Crime, theft, fights, risky crowds, public disturbance, or safety concerns.",
  },
  medical_rescue: {
    label: "Medical & Rescue",
    shortLabel: "Medical",
    iconName: "medkit",
    color: "#0891B2",
    lightColor: "#CFFAFE",
    description: "Medical emergencies, fainting, workplace accidents, drowning, or evacuation needs.",
  },
  missing_lost: {
    label: "Missing / Lost",
    shortLabel: "Missing",
    iconName: "search",
    color: "#7C3AED",
    lightColor: "#EDE9FE",
    description: "Missing people, lost items, or missing vehicles.",
  },
} as const satisfies Record<IncidentCategory, IncidentCategoryMeta>;

export const INCIDENT_TYPES = {
  flood: {
    category: "natural_disaster",
    label: "Flood",
    shortLabel: "Flood",
    iconName: "water",
    color: "#2563EB",
    lightColor: "#DBEAFE",
  },
  earthquake: {
    category: "natural_disaster",
    label: "Earthquake",
    shortLabel: "Quake",
    iconName: "pulse",
    color: "#7C2D12",
    lightColor: "#FFEDD5",
  },
  landslide: {
    category: "natural_disaster",
    label: "Landslide",
    shortLabel: "Slide",
    iconName: "trail-sign",
    color: "#92400E",
    lightColor: "#FEF3C7",
  },
  volcanic_eruption: {
    category: "natural_disaster",
    label: "Volcanic Eruption",
    shortLabel: "Volcano",
    iconName: "flame",
    color: "#991B1B",
    lightColor: "#FEE2E2",
  },
  strong_wind: {
    category: "natural_disaster",
    label: "Strong Wind",
    shortLabel: "Wind",
    iconName: "cloudy",
    color: "#475569",
    lightColor: "#E2E8F0",
  },
  tsunami: {
    category: "natural_disaster",
    label: "Tsunami",
    shortLabel: "Tsunami",
    iconName: "radio",
    color: "#1D4ED8",
    lightColor: "#DBEAFE",
  },
  fire: {
    category: "fire_emergency",
    label: "General Fire",
    shortLabel: "Fire",
    iconName: "flame",
    color: "#DC2626",
    lightColor: "#FEE2E2",
  },
  building_fire: {
    category: "fire_emergency",
    label: "House / Building Fire",
    shortLabel: "Building",
    iconName: "home",
    color: "#DC2626",
    lightColor: "#FEE2E2",
  },
  vehicle_fire: {
    category: "fire_emergency",
    label: "Vehicle Fire",
    shortLabel: "Vehicle",
    iconName: "car-sport",
    color: "#B91C1C",
    lightColor: "#FEE2E2",
  },
  land_fire: {
    category: "fire_emergency",
    label: "Land Fire",
    shortLabel: "Land",
    iconName: "flame",
    color: "#C2410C",
    lightColor: "#FFEDD5",
  },
  electrical_fire: {
    category: "fire_emergency",
    label: "Electrical Fire",
    shortLabel: "Electric",
    iconName: "flash",
    color: "#CA8A04",
    lightColor: "#FEF9C3",
  },
  traffic_accident: {
    category: "accident_infrastructure",
    label: "Traffic Accident",
    shortLabel: "Accident",
    iconName: "car-sport",
    color: "#EA580C",
    lightColor: "#FFEDD5",
  },
  fallen_tree: {
    category: "accident_infrastructure",
    label: "Fallen Tree",
    shortLabel: "Tree",
    iconName: "leaf",
    color: "#15803D",
    lightColor: "#DCFCE7",
  },
  road_block: {
    category: "accident_infrastructure",
    label: "Road Block",
    shortLabel: "Blocked",
    iconName: "trail-sign",
    color: "#CA8A04",
    lightColor: "#FEF9C3",
  },
  damaged_road: {
    category: "accident_infrastructure",
    label: "Damaged Road",
    shortLabel: "Road",
    iconName: "construct",
    color: "#854D0E",
    lightColor: "#FEF3C7",
  },
  fallen_power_line: {
    category: "accident_infrastructure",
    label: "Downed Power Line",
    shortLabel: "Cable",
    iconName: "flash",
    color: "#A16207",
    lightColor: "#FEF9C3",
  },
  collapsed_building: {
    category: "accident_infrastructure",
    label: "Collapsed Building",
    shortLabel: "Collapse",
    iconName: "business",
    color: "#7C2D12",
    lightColor: "#FFEDD5",
  },
  crime: {
    category: "security_public_order",
    label: "Crime",
    shortLabel: "Crime",
    iconName: "shield",
    color: "#BE123C",
    lightColor: "#FFE4E6",
  },
  theft: {
    category: "security_public_order",
    label: "Theft",
    shortLabel: "Theft",
    iconName: "lock-closed",
    color: "#9F1239",
    lightColor: "#FFE4E6",
  },
  brawl: {
    category: "security_public_order",
    label: "Fight / Brawl",
    shortLabel: "Brawl",
    iconName: "people",
    color: "#BE123C",
    lightColor: "#FFE4E6",
  },
  risky_crowd: {
    category: "security_public_order",
    label: "Risky Crowd",
    shortLabel: "Crowd",
    iconName: "people",
    color: "#9333EA",
    lightColor: "#F3E8FF",
  },
  mob_violence: {
    category: "security_public_order",
    label: "Mob Violence",
    shortLabel: "Mob",
    iconName: "people-circle",
    color: "#881337",
    lightColor: "#FFE4E6",
  },
  public_disturbance: {
    category: "security_public_order",
    label: "Public Disturbance",
    shortLabel: "Disturb",
    iconName: "megaphone",
    color: "#9333EA",
    lightColor: "#F3E8FF",
  },
  medical: {
    category: "medical_rescue",
    label: "Medical Emergency",
    shortLabel: "Medical",
    iconName: "medkit",
    color: "#0891B2",
    lightColor: "#CFFAFE",
  },
  fainted_person: {
    category: "medical_rescue",
    label: "Fainted Person",
    shortLabel: "Faint",
    iconName: "person",
    color: "#0E7490",
    lightColor: "#CFFAFE",
  },
  work_accident: {
    category: "medical_rescue",
    label: "Workplace Accident",
    shortLabel: "Work",
    iconName: "hammer",
    color: "#0369A1",
    lightColor: "#E0F2FE",
  },
  drowning: {
    category: "medical_rescue",
    label: "Drowning",
    shortLabel: "Drown",
    iconName: "water",
    color: "#0284C7",
    lightColor: "#E0F2FE",
  },
  evacuation_needed: {
    category: "medical_rescue",
    label: "Evacuation Needed",
    shortLabel: "Evacuate",
    iconName: "alert-circle",
    color: "#DC2626",
    lightColor: "#FEE2E2",
  },
  missing_person: {
    category: "missing_lost",
    label: "Missing Person",
    shortLabel: "Missing",
    iconName: "person-outline",
    color: "#7C3AED",
    lightColor: "#EDE9FE",
  },
  missing_item: {
    category: "missing_lost",
    label: "Lost Item",
    shortLabel: "Item",
    iconName: "bag-handle-outline",
    color: "#7C3AED",
    lightColor: "#EDE9FE",
  },
  missing_vehicle: {
    category: "missing_lost",
    label: "Missing Vehicle",
    shortLabel: "Vehicle",
    iconName: "car-outline",
    color: "#6D28D9",
    lightColor: "#EDE9FE",
  },
} as const satisfies Record<IncidentSubcategory, IncidentMeta>;

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
