import type { Ionicons } from "@expo/vector-icons";

import type {
  IncidentCategory,
  IncidentSeverity,
  IncidentSubcategory,
  IncidentType,
} from "../types/incident";

export type AppIconName = keyof typeof Ionicons.glyphMap;

export type IncidentCategoryMeta = {
  label: string;
  shortLabel: string;
  icon: string;
  iconName: AppIconName;
  color: string;
  lightColor: string;
  radius: number;
  description: string;
};

export type IncidentMeta = {
  category: IncidentCategory;
  label: string;
  shortLabel: string;
  icon: string;
  iconName: AppIconName;
  color: string;
  lightColor: string;
  radius: number;
};

export type IncidentCategoryOption = {
  value: IncidentCategory;
  label: string;
  shortLabel: string;
  icon: string;
  iconName: AppIconName;
  color: string;
  lightColor: string;
  radius: number;
  description: string;
};

export type IncidentTypeOption = {
  value: IncidentSubcategory;
  category: IncidentCategory;
  label: string;
  shortLabel: string;
  icon: string;
  iconName: AppIconName;
  color: string;
  lightColor: string;
  radius: number;
};

export type SeverityOption = {
  value: IncidentSeverity;
  label: string;
  color: string;
  lightColor: string;
  iconName: AppIconName;
  description: string;
};

export const INCIDENT_RADIUS = {
  MIN: 80,
  MAX: 1500,
  DEFAULT: 300,
} as const;

export const REPORT_ALLOWED_DISTANCE_METERS = 20;

export const WARNING_DISTANCE_METERS = 700;

export const VERIFICATION_DISTANCE_METERS = 80;

export const LOCAL_INCIDENT_NOTIFICATION_DISTANCE_METERS = 300;

export const INCIDENT_CATEGORIES: Record<
  IncidentCategory,
  IncidentCategoryMeta
> = {
  natural_disaster: {
    label: "Bencana Alam",
    shortLabel: "Alam",
    icon: "🌋",
    iconName: "earth",
    color: "#2563EB",
    lightColor: "#DBEAFE",
    radius: 900,
    description:
      "Banjir, gempa, longsor, tsunami, angin kencang, atau kejadian alam lain.",
  },
  fire_emergency: {
    label: "Kebakaran",
    shortLabel: "Api",
    icon: "🔥",
    iconName: "flame",
    color: "#DC2626",
    lightColor: "#FEE2E2",
    radius: 600,
    description:
      "Api, asap tebal, kebakaran bangunan, kendaraan, lahan, atau listrik.",
  },
  accident_infrastructure: {
    label: "Kecelakaan & Infrastruktur",
    shortLabel: "Jalan",
    icon: "🚧",
    iconName: "construct",
    color: "#EA580C",
    lightColor: "#FFEDD5",
    radius: 450,
    description:
      "Kecelakaan, jalan rusak/terhalang, pohon tumbang, kabel jatuh, atau fasilitas rusak.",
  },
  security_public_order: {
    label: "Keamanan & Ketertiban",
    shortLabel: "Aman",
    icon: "🚨",
    iconName: "shield",
    color: "#BE123C",
    lightColor: "#FFE4E6",
    radius: 500,
    description:
      "Kriminalitas, pencurian, tawuran, kerumunan berisiko, atau gangguan publik.",
  },
  medical_rescue: {
    label: "Medis & Penyelamatan",
    shortLabel: "Medis",
    icon: "🚑",
    iconName: "medkit",
    color: "#0891B2",
    lightColor: "#CFFAFE",
    radius: 400,
    description:
      "Darurat medis, orang pingsan, kecelakaan kerja, tenggelam, atau butuh evakuasi.",
  },
};

/**
 * Legacy / advanced taxonomy.
 *
 * Tidak dipakai sebagai input wajib report form.
 * Dipertahankan untuk data lama, advanced filtering, dan kemungkinan auto-classification nanti.
 */
export const INCIDENT_TYPES: Record<IncidentSubcategory, IncidentMeta> = {
  flood: {
    category: "natural_disaster",
    label: "Banjir",
    shortLabel: "Flood",
    icon: "🌊",
    iconName: "water",
    color: "#2563EB",
    lightColor: "#DBEAFE",
    radius: 700,
  },
  earthquake: {
    category: "natural_disaster",
    label: "Gempa",
    shortLabel: "Quake",
    icon: "🌍",
    iconName: "pulse",
    color: "#7C2D12",
    lightColor: "#FFEDD5",
    radius: 900,
  },
  landslide: {
    category: "natural_disaster",
    label: "Longsor",
    shortLabel: "Slide",
    icon: "⛰️",
    iconName: "trail-sign",
    color: "#92400E",
    lightColor: "#FEF3C7",
    radius: 600,
  },
  volcanic_eruption: {
    category: "natural_disaster",
    label: "Gunung Meletus",
    shortLabel: "Volcano",
    icon: "🌋",
    iconName: "flame",
    color: "#991B1B",
    lightColor: "#FEE2E2",
    radius: 1500,
  },
  strong_wind: {
    category: "natural_disaster",
    label: "Angin Kencang",
    shortLabel: "Wind",
    icon: "🌪️",
    iconName: "cloudy",
    color: "#475569",
    lightColor: "#E2E8F0",
    radius: 700,
  },
  tsunami: {
    category: "natural_disaster",
    label: "Tsunami",
    shortLabel: "Tsunami",
    icon: "🌊",
    iconName: "radio",
    color: "#1D4ED8",
    lightColor: "#DBEAFE",
    radius: 1500,
  },

  fire: {
    category: "fire_emergency",
    label: "Kebakaran Umum",
    shortLabel: "Fire",
    icon: "🔥",
    iconName: "flame",
    color: "#DC2626",
    lightColor: "#FEE2E2",
    radius: 500,
  },
  building_fire: {
    category: "fire_emergency",
    label: "Kebakaran Rumah / Bangunan",
    shortLabel: "Building",
    icon: "🏠",
    iconName: "home",
    color: "#DC2626",
    lightColor: "#FEE2E2",
    radius: 600,
  },
  vehicle_fire: {
    category: "fire_emergency",
    label: "Kebakaran Kendaraan",
    shortLabel: "Vehicle",
    icon: "🚗",
    iconName: "car-sport",
    color: "#B91C1C",
    lightColor: "#FEE2E2",
    radius: 350,
  },
  land_fire: {
    category: "fire_emergency",
    label: "Kebakaran Lahan",
    shortLabel: "Land",
    icon: "🔥",
    iconName: "flame",
    color: "#C2410C",
    lightColor: "#FFEDD5",
    radius: 900,
  },
  electrical_fire: {
    category: "fire_emergency",
    label: "Korsleting / Kebakaran Listrik",
    shortLabel: "Electric",
    icon: "⚡",
    iconName: "flash",
    color: "#CA8A04",
    lightColor: "#FEF9C3",
    radius: 450,
  },

  traffic_accident: {
    category: "accident_infrastructure",
    label: "Kecelakaan Lalu Lintas",
    shortLabel: "Accident",
    icon: "🚗",
    iconName: "car-sport",
    color: "#EA580C",
    lightColor: "#FFEDD5",
    radius: 350,
  },
  fallen_tree: {
    category: "accident_infrastructure",
    label: "Pohon Tumbang",
    shortLabel: "Tree",
    icon: "🌳",
    iconName: "leaf",
    color: "#15803D",
    lightColor: "#DCFCE7",
    radius: 300,
  },
  road_block: {
    category: "accident_infrastructure",
    label: "Jalan Terhalang",
    shortLabel: "Blocked",
    icon: "🚧",
    iconName: "trail-sign",
    color: "#CA8A04",
    lightColor: "#FEF9C3",
    radius: 300,
  },
  damaged_road: {
    category: "accident_infrastructure",
    label: "Jalan Rusak / Ambles",
    shortLabel: "Road",
    icon: "🕳️",
    iconName: "construct",
    color: "#854D0E",
    lightColor: "#FEF3C7",
    radius: 300,
  },
  fallen_power_line: {
    category: "accident_infrastructure",
    label: "Kabel Listrik Jatuh",
    shortLabel: "Cable",
    icon: "⚡",
    iconName: "flash",
    color: "#A16207",
    lightColor: "#FEF9C3",
    radius: 450,
  },
  collapsed_building: {
    category: "accident_infrastructure",
    label: "Bangunan Roboh",
    shortLabel: "Collapse",
    icon: "🏚️",
    iconName: "business",
    color: "#7C2D12",
    lightColor: "#FFEDD5",
    radius: 600,
  },

  crime: {
    category: "security_public_order",
    label: "Kriminalitas",
    shortLabel: "Crime",
    icon: "🚨",
    iconName: "shield",
    color: "#BE123C",
    lightColor: "#FFE4E6",
    radius: 450,
  },
  theft: {
    category: "security_public_order",
    label: "Pencurian",
    shortLabel: "Theft",
    icon: "🕵️",
    iconName: "lock-closed",
    color: "#9F1239",
    lightColor: "#FFE4E6",
    radius: 350,
  },
  brawl: {
    category: "security_public_order",
    label: "Tawuran / Perkelahian",
    shortLabel: "Brawl",
    icon: "⚠️",
    iconName: "people",
    color: "#BE123C",
    lightColor: "#FFE4E6",
    radius: 500,
  },
  risky_crowd: {
    category: "security_public_order",
    label: "Kerumunan Berisiko",
    shortLabel: "Crowd",
    icon: "👥",
    iconName: "people",
    color: "#9333EA",
    lightColor: "#F3E8FF",
    radius: 450,
  },
  mob_violence: {
    category: "security_public_order",
    label: "Orang Diamuk Massa",
    shortLabel: "Mob",
    icon: "🚨",
    iconName: "people-circle",
    color: "#881337",
    lightColor: "#FFE4E6",
    radius: 500,
  },
  public_disturbance: {
    category: "security_public_order",
    label: "Gangguan Publik",
    shortLabel: "Disturb",
    icon: "⚠️",
    iconName: "megaphone",
    color: "#9333EA",
    lightColor: "#F3E8FF",
    radius: 400,
  },

  medical: {
    category: "medical_rescue",
    label: "Darurat Medis",
    shortLabel: "Medical",
    icon: "🚑",
    iconName: "medkit",
    color: "#0891B2",
    lightColor: "#CFFAFE",
    radius: 350,
  },
  fainted_person: {
    category: "medical_rescue",
    label: "Orang Pingsan",
    shortLabel: "Faint",
    icon: "🧍",
    iconName: "person",
    color: "#0E7490",
    lightColor: "#CFFAFE",
    radius: 250,
  },
  work_accident: {
    category: "medical_rescue",
    label: "Kecelakaan Kerja",
    shortLabel: "Work",
    icon: "⛑️",
    iconName: "hammer",
    color: "#0369A1",
    lightColor: "#E0F2FE",
    radius: 350,
  },
  drowning: {
    category: "medical_rescue",
    label: "Orang Tenggelam",
    shortLabel: "Drown",
    icon: "🛟",
    iconName: "water",
    color: "#0284C7",
    lightColor: "#E0F2FE",
    radius: 450,
  },
  evacuation_needed: {
    category: "medical_rescue",
    label: "Butuh Evakuasi",
    shortLabel: "Evacuate",
    icon: "🆘",
    iconName: "alert-circle",
    color: "#DC2626",
    lightColor: "#FEE2E2",
    radius: 500,
  },
};

export const INCIDENT_CATEGORY_OPTIONS: IncidentCategoryOption[] =
  Object.entries(INCIDENT_CATEGORIES).map(([value, meta]) => {
    return {
      value: value as IncidentCategory,
      label: meta.label,
      shortLabel: meta.shortLabel,
      icon: meta.icon,
      iconName: meta.iconName,
      color: meta.color,
      lightColor: meta.lightColor,
      radius: meta.radius,
      description: meta.description,
    };
  });

export const INCIDENT_TYPE_OPTIONS: IncidentTypeOption[] = Object.entries(
  INCIDENT_TYPES
).map(([value, meta]) => {
  return {
    value: value as IncidentSubcategory,
    category: meta.category,
    label: meta.label,
    shortLabel: meta.shortLabel,
    icon: meta.icon,
    iconName: meta.iconName,
    color: meta.color,
    lightColor: meta.lightColor,
    radius: meta.radius,
  };
});

export const SEVERITY_OPTIONS: SeverityOption[] = [
  {
    value: "low",
    label: "Low",
    color: "#16A34A",
    lightColor: "#DCFCE7",
    iconName: "checkmark-circle",
    description:
      "Tidak terlalu berbahaya, tetapi tetap perlu diketahui sekitar.",
  },
  {
    value: "medium",
    label: "Medium",
    color: "#F59E0B",
    lightColor: "#FEF3C7",
    iconName: "warning",
    description: "Mengganggu aktivitas sekitar dan perlu diwaspadai.",
  },
  {
    value: "high",
    label: "High",
    color: "#DC2626",
    lightColor: "#FEE2E2",
    iconName: "alert-circle",
    description: "Berbahaya, mendesak, dan butuh perhatian cepat.",
  },
];

export const isIncidentCategory = (
  value: string
): value is IncidentCategory => {
  return Object.prototype.hasOwnProperty.call(INCIDENT_CATEGORIES, value);
};

export const isIncidentType = (value: string): value is IncidentType => {
  return Object.prototype.hasOwnProperty.call(INCIDENT_TYPES, value);
};

export const getIncidentCategoryMeta = (
  category?: IncidentCategory | null
): IncidentCategoryMeta => {
  if (!category) {
    return INCIDENT_CATEGORIES.security_public_order;
  }

  return (
    INCIDENT_CATEGORIES[category] ?? INCIDENT_CATEGORIES.security_public_order
  );
};

export const getIncidentMeta = (
  type?: IncidentType | IncidentSubcategory | null
): IncidentMeta => {
  if (!type) {
    return INCIDENT_TYPES.public_disturbance;
  }

  return INCIDENT_TYPES[type] ?? INCIDENT_TYPES.public_disturbance;
};

export const getIncidentDisplayMeta = (input: {
  category?: IncidentCategory | null;
  subcategory?: IncidentSubcategory | IncidentType | null;
}): IncidentCategoryMeta | IncidentMeta => {
  if (input.subcategory && isIncidentType(input.subcategory)) {
    return getIncidentMeta(input.subcategory);
  }

  return getIncidentCategoryMeta(input.category);
};

export const getIncidentRadius = (input: {
  category?: IncidentCategory | null;
  subcategory?: IncidentSubcategory | IncidentType | null;
}): number => {
  const meta = getIncidentDisplayMeta(input);

  return clampIncidentRadius(meta.radius);
};

export const getCategoryBySubcategory = (
  subcategory?: IncidentSubcategory | IncidentType | null
): IncidentCategory => {
  if (!subcategory) {
    return "security_public_order";
  }

  return getIncidentMeta(subcategory).category;
};

export const getSubcategoriesByCategory = (
  category: IncidentCategory
): IncidentTypeOption[] => {
  return INCIDENT_TYPE_OPTIONS.filter((item) => item.category === category);
};

export const getFilterLabel = (value: string): string => {
  if (value === "all") {
    return "Semua kejadian";
  }

  if (value === "active") {
    return "Laporan aktif";
  }

  if (value === "resolved") {
    return "Laporan selesai";
  }

  if (isIncidentCategory(value)) {
    return getIncidentCategoryMeta(value).label;
  }

  if (isIncidentType(value)) {
    return getIncidentMeta(value).label;
  }

  return "Filter tidak dikenal";
};

export const clampIncidentRadius = (radius: number): number => {
  return Math.min(Math.max(radius, INCIDENT_RADIUS.MIN), INCIDENT_RADIUS.MAX);
};