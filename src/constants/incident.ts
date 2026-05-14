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

export const WARNING_DISTANCE_METERS  = 700;

export const LOCAL_INCIDENT_NOTIFICATION_DISTANCE_METERS = 300;

const UNKNOWN_INCIDENT_META: IncidentCategoryMeta = {
  label: "Kategori Tidak Dikenal",
  shortLabel: "Tidak Dikenal",
  iconName: "help-circle",
  color: "#64748B",
  lightColor: "#F1F5F9",
  description:
    "Kategori laporan tidak tersedia atau belum dikenali oleh sistem.",
};

export const INCIDENT_CATEGORIES = {
  natural_disaster: {
    label: "Bencana Alam",
    shortLabel: "Alam",
    iconName: "earth",
    color: "#2563EB",
    lightColor: "#DBEAFE",
    description:
      "Banjir, gempa, longsor, tsunami, angin kencang, atau kejadian alam lain.",
  },
  fire_emergency: {
    label: "Kebakaran",
    shortLabel: "Api",
    iconName: "flame",
    color: "#DC2626",
    lightColor: "#FEE2E2",
    description:
      "Api, asap tebal, kebakaran bangunan, kendaraan, lahan, atau listrik.",
  },
  accident_infrastructure: {
    label: "Kecelakaan & Infrastruktur",
    shortLabel: "Jalan",
    iconName: "construct",
    color: "#EA580C",
    lightColor: "#FFEDD5",
    description:
      "Kecelakaan, jalan rusak/terhalang, pohon tumbang, kabel jatuh, atau fasilitas rusak.",
  },
  security_public_order: {
    label: "Keamanan & Ketertiban",
    shortLabel: "Aman",
    iconName: "shield",
    color: "#BE123C",
    lightColor: "#FFE4E6",
    description:
      "Kriminalitas, pencurian, tawuran, kerumunan berisiko, atau gangguan publik.",
  },
  medical_rescue: {
    label: "Medis & Penyelamatan",
    shortLabel: "Medis",
    iconName: "medkit",
    color: "#0891B2",
    lightColor: "#CFFAFE",
    description:
      "Darurat medis, orang pingsan, kecelakaan kerja, tenggelam, atau butuh evakuasi.",
  },
} as const satisfies Record<IncidentCategory, IncidentCategoryMeta>;

/**
 * Legacy / advanced taxonomy.
 *
 * Tidak dipakai sebagai input wajib report form.
 * Dipertahankan hanya untuk:
 * - membaca data lama,
 * - display fallback legacy,
 * - advanced classification nanti kalau benar-benar dibutuhkan.
 */
export const INCIDENT_TYPES = {
  flood: {
    category: "natural_disaster",
    label: "Banjir",
    shortLabel: "Flood",
    iconName: "water",
    color: "#2563EB",
    lightColor: "#DBEAFE",
  },
  earthquake: {
    category: "natural_disaster",
    label: "Gempa",
    shortLabel: "Quake",
    iconName: "pulse",
    color: "#7C2D12",
    lightColor: "#FFEDD5",
  },
  landslide: {
    category: "natural_disaster",
    label: "Longsor",
    shortLabel: "Slide",
    iconName: "trail-sign",
    color: "#92400E",
    lightColor: "#FEF3C7",
  },
  volcanic_eruption: {
    category: "natural_disaster",
    label: "Gunung Meletus",
    shortLabel: "Volcano",
    iconName: "flame",
    color: "#991B1B",
    lightColor: "#FEE2E2",
  },
  strong_wind: {
    category: "natural_disaster",
    label: "Angin Kencang",
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
    label: "Kebakaran Umum",
    shortLabel: "Fire",
    iconName: "flame",
    color: "#DC2626",
    lightColor: "#FEE2E2",
  },
  building_fire: {
    category: "fire_emergency",
    label: "Kebakaran Rumah / Bangunan",
    shortLabel: "Building",
    iconName: "home",
    color: "#DC2626",
    lightColor: "#FEE2E2",
  },
  vehicle_fire: {
    category: "fire_emergency",
    label: "Kebakaran Kendaraan",
    shortLabel: "Vehicle",
    iconName: "car-sport",
    color: "#B91C1C",
    lightColor: "#FEE2E2",
  },
  land_fire: {
    category: "fire_emergency",
    label: "Kebakaran Lahan",
    shortLabel: "Land",
    iconName: "flame",
    color: "#C2410C",
    lightColor: "#FFEDD5",
  },
  electrical_fire: {
    category: "fire_emergency",
    label: "Korsleting / Kebakaran Listrik",
    shortLabel: "Electric",
    iconName: "flash",
    color: "#CA8A04",
    lightColor: "#FEF9C3",
  },

  traffic_accident: {
    category: "accident_infrastructure",
    label: "Kecelakaan Lalu Lintas",
    shortLabel: "Accident",
    iconName: "car-sport",
    color: "#EA580C",
    lightColor: "#FFEDD5",
  },
  fallen_tree: {
    category: "accident_infrastructure",
    label: "Pohon Tumbang",
    shortLabel: "Tree",
    iconName: "leaf",
    color: "#15803D",
    lightColor: "#DCFCE7",
  },
  road_block: {
    category: "accident_infrastructure",
    label: "Jalan Terhalang",
    shortLabel: "Blocked",
    iconName: "trail-sign",
    color: "#CA8A04",
    lightColor: "#FEF9C3",
  },
  damaged_road: {
    category: "accident_infrastructure",
    label: "Jalan Rusak / Ambles",
    shortLabel: "Road",
    iconName: "construct",
    color: "#854D0E",
    lightColor: "#FEF3C7",
  },
  fallen_power_line: {
    category: "accident_infrastructure",
    label: "Kabel Listrik Jatuh",
    shortLabel: "Cable",
    iconName: "flash",
    color: "#A16207",
    lightColor: "#FEF9C3",
  },
  collapsed_building: {
    category: "accident_infrastructure",
    label: "Bangunan Roboh",
    shortLabel: "Collapse",
    iconName: "business",
    color: "#7C2D12",
    lightColor: "#FFEDD5",
  },

  crime: {
    category: "security_public_order",
    label: "Kriminalitas",
    shortLabel: "Crime",
    iconName: "shield",
    color: "#BE123C",
    lightColor: "#FFE4E6",
  },
  theft: {
    category: "security_public_order",
    label: "Pencurian",
    shortLabel: "Theft",
    iconName: "lock-closed",
    color: "#9F1239",
    lightColor: "#FFE4E6",
  },
  brawl: {
    category: "security_public_order",
    label: "Tawuran / Perkelahian",
    shortLabel: "Brawl",
    iconName: "people",
    color: "#BE123C",
    lightColor: "#FFE4E6",
  },
  risky_crowd: {
    category: "security_public_order",
    label: "Kerumunan Berisiko",
    shortLabel: "Crowd",
    iconName: "people",
    color: "#9333EA",
    lightColor: "#F3E8FF",
  },
  mob_violence: {
    category: "security_public_order",
    label: "Orang Diamuk Massa",
    shortLabel: "Mob",
    iconName: "people-circle",
    color: "#881337",
    lightColor: "#FFE4E6",
  },
  public_disturbance: {
    category: "security_public_order",
    label: "Gangguan Publik",
    shortLabel: "Disturb",
    iconName: "megaphone",
    color: "#9333EA",
    lightColor: "#F3E8FF",
  },

  medical: {
    category: "medical_rescue",
    label: "Darurat Medis",
    shortLabel: "Medical",
    iconName: "medkit",
    color: "#0891B2",
    lightColor: "#CFFAFE",
  },
  fainted_person: {
    category: "medical_rescue",
    label: "Orang Pingsan",
    shortLabel: "Faint",
    iconName: "person",
    color: "#0E7490",
    lightColor: "#CFFAFE",
  },
  work_accident: {
    category: "medical_rescue",
    label: "Kecelakaan Kerja",
    shortLabel: "Work",
    iconName: "hammer",
    color: "#0369A1",
    lightColor: "#E0F2FE",
  },
  drowning: {
    category: "medical_rescue",
    label: "Orang Tenggelam",
    shortLabel: "Drown",
    iconName: "water",
    color: "#0284C7",
    lightColor: "#E0F2FE",
  },
  evacuation_needed: {
    category: "medical_rescue",
    label: "Butuh Evakuasi",
    shortLabel: "Evacuate",
    iconName: "alert-circle",
    color: "#DC2626",
    lightColor: "#FEE2E2",
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
    label: "Rendah",
    color: "#16A34A",
    lightColor: "#DCFCE7",
    iconName: "checkmark-circle",
    description:
      "Tidak terlalu berbahaya, tetapi tetap perlu diketahui warga sekitar.",
  },
  {
    value: "medium",
    label: "Sedang",
    color: "#F59E0B",
    lightColor: "#FEF3C7",
    iconName: "warning",
    description: "Mengganggu aktivitas sekitar dan perlu diwaspadai.",
  },
  {
    value: "high",
    label: "Tinggi",
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
  if (!category || !isIncidentCategory(category)) {
    return UNKNOWN_INCIDENT_META;
  }

  return INCIDENT_CATEGORIES[category];
};

/**
 * Legacy-only helper.
 *
 * Jangan dipakai sebagai helper utama display incident baru.
 * Untuk UI incident, gunakan getIncidentDisplayMeta().
 */
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
    return getIncidentMeta(value)?.label ?? "Filter tidak dikenal";
  }

  return "Filter tidak dikenal";
};