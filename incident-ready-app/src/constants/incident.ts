import type {
  IncidentCategory,
  IncidentSeverity,
  IncidentSubcategory,
  IncidentType,
} from "../types/incident";

export type IncidentCategoryMeta = {
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  lightColor: string;
  description: string;
};

export type IncidentMeta = {
  category: IncidentCategory;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  lightColor: string;
  radius: number;
};

export type IncidentCategoryOption = {
  value: IncidentCategory;
  label: string;
  icon: string;
  color: string;
  lightColor: string;
  description: string;
};

export type IncidentTypeOption = {
  value: IncidentSubcategory;
  category: IncidentCategory;
  label: string;
  icon: string;
  color: string;
  lightColor: string;
};

export type SeverityOption = {
  value: IncidentSeverity;
  label: string;
  color: string;
  description: string;
};

export const INCIDENT_RADIUS = {
  MIN: 80,
  MAX: 1500,
  DEFAULT: 300,
};

export const REPORT_ALLOWED_DISTANCE_METERS = 20;

export const WARNING_DISTANCE_METERS = 700;

export const VERIFICATION_DISTANCE_METERS = 80;

export const INCIDENT_CATEGORIES: Record<
  IncidentCategory,
  IncidentCategoryMeta
> = {
  natural_disaster: {
    label: "Bencana Alam",
    shortLabel: "Alam",
    icon: "🌋",
    color: "#2563EB",
    lightColor: "#DBEAFE",
    description: "Kejadian alam yang dapat mengganggu atau membahayakan sekitar.",
  },
  fire_emergency: {
    label: "Kebakaran",
    shortLabel: "Api",
    icon: "🔥",
    color: "#DC2626",
    lightColor: "#FEE2E2",
    description: "Kebakaran bangunan, kendaraan, lahan, atau listrik.",
  },
  accident_infrastructure: {
    label: "Kecelakaan & Infrastruktur",
    shortLabel: "Jalan",
    icon: "🚧",
    color: "#EA580C",
    lightColor: "#FFEDD5",
    description: "Kecelakaan, jalan terhalang, pohon tumbang, atau fasilitas rusak.",
  },
  security_public_order: {
    label: "Keamanan & Ketertiban",
    shortLabel: "Aman",
    icon: "🚨",
    color: "#BE123C",
    lightColor: "#FFE4E6",
    description: "Kriminalitas, kerumunan berisiko, tawuran, atau gangguan publik.",
  },
  medical_rescue: {
    label: "Medis & Penyelamatan",
    shortLabel: "Medis",
    icon: "🚑",
    color: "#0891B2",
    lightColor: "#CFFAFE",
    description: "Kondisi medis darurat, korban, atau kebutuhan evakuasi.",
  },
};

export const INCIDENT_TYPES: Record<IncidentSubcategory, IncidentMeta> = {
  flood: {
    category: "natural_disaster",
    label: "Banjir",
    shortLabel: "Flood",
    icon: "🌊",
    color: "#2563EB",
    lightColor: "#DBEAFE",
    radius: 700,
  },
  earthquake: {
    category: "natural_disaster",
    label: "Gempa",
    shortLabel: "Quake",
    icon: "🌍",
    color: "#7C2D12",
    lightColor: "#FFEDD5",
    radius: 900,
  },
  landslide: {
    category: "natural_disaster",
    label: "Longsor",
    shortLabel: "Slide",
    icon: "⛰️",
    color: "#92400E",
    lightColor: "#FEF3C7",
    radius: 600,
  },
  volcanic_eruption: {
    category: "natural_disaster",
    label: "Gunung Meletus",
    shortLabel: "Volcano",
    icon: "🌋",
    color: "#991B1B",
    lightColor: "#FEE2E2",
    radius: 1500,
  },
  strong_wind: {
    category: "natural_disaster",
    label: "Angin Kencang",
    shortLabel: "Wind",
    icon: "🌪️",
    color: "#475569",
    lightColor: "#E2E8F0",
    radius: 700,
  },
  tsunami: {
    category: "natural_disaster",
    label: "Tsunami",
    shortLabel: "Tsunami",
    icon: "🌊",
    color: "#1D4ED8",
    lightColor: "#DBEAFE",
    radius: 1500,
  },

  fire: {
    category: "fire_emergency",
    label: "Kebakaran Umum",
    shortLabel: "Fire",
    icon: "🔥",
    color: "#DC2626",
    lightColor: "#FEE2E2",
    radius: 500,
  },
  building_fire: {
    category: "fire_emergency",
    label: "Kebakaran Rumah / Bangunan",
    shortLabel: "Building",
    icon: "🏠",
    color: "#DC2626",
    lightColor: "#FEE2E2",
    radius: 600,
  },
  vehicle_fire: {
    category: "fire_emergency",
    label: "Kebakaran Kendaraan",
    shortLabel: "Vehicle",
    icon: "🚗",
    color: "#B91C1C",
    lightColor: "#FEE2E2",
    radius: 350,
  },
  land_fire: {
    category: "fire_emergency",
    label: "Kebakaran Lahan",
    shortLabel: "Land",
    icon: "🔥",
    color: "#C2410C",
    lightColor: "#FFEDD5",
    radius: 900,
  },
  electrical_fire: {
    category: "fire_emergency",
    label: "Korsleting / Kebakaran Listrik",
    shortLabel: "Electric",
    icon: "⚡",
    color: "#CA8A04",
    lightColor: "#FEF9C3",
    radius: 450,
  },

  traffic_accident: {
    category: "accident_infrastructure",
    label: "Kecelakaan Lalu Lintas",
    shortLabel: "Accident",
    icon: "🚗",
    color: "#EA580C",
    lightColor: "#FFEDD5",
    radius: 350,
  },
  fallen_tree: {
    category: "accident_infrastructure",
    label: "Pohon Tumbang",
    shortLabel: "Tree",
    icon: "🌳",
    color: "#15803D",
    lightColor: "#DCFCE7",
    radius: 300,
  },
  road_block: {
    category: "accident_infrastructure",
    label: "Jalan Terhalang",
    shortLabel: "Blocked",
    icon: "🚧",
    color: "#CA8A04",
    lightColor: "#FEF9C3",
    radius: 300,
  },
  damaged_road: {
    category: "accident_infrastructure",
    label: "Jalan Rusak / Ambles",
    shortLabel: "Road",
    icon: "🕳️",
    color: "#854D0E",
    lightColor: "#FEF3C7",
    radius: 300,
  },
  fallen_power_line: {
    category: "accident_infrastructure",
    label: "Kabel Listrik Jatuh",
    shortLabel: "Cable",
    icon: "⚡",
    color: "#A16207",
    lightColor: "#FEF9C3",
    radius: 450,
  },
  collapsed_building: {
    category: "accident_infrastructure",
    label: "Bangunan Roboh",
    shortLabel: "Collapse",
    icon: "🏚️",
    color: "#7C2D12",
    lightColor: "#FFEDD5",
    radius: 600,
  },

  crime: {
    category: "security_public_order",
    label: "Kriminalitas",
    shortLabel: "Crime",
    icon: "🚨",
    color: "#BE123C",
    lightColor: "#FFE4E6",
    radius: 450,
  },
  theft: {
    category: "security_public_order",
    label: "Pencurian",
    shortLabel: "Theft",
    icon: "🕵️",
    color: "#9F1239",
    lightColor: "#FFE4E6",
    radius: 350,
  },
  brawl: {
    category: "security_public_order",
    label: "Tawuran / Perkelahian",
    shortLabel: "Brawl",
    icon: "⚠️",
    color: "#BE123C",
    lightColor: "#FFE4E6",
    radius: 500,
  },
  risky_crowd: {
    category: "security_public_order",
    label: "Kerumunan Berisiko",
    shortLabel: "Crowd",
    icon: "👥",
    color: "#9333EA",
    lightColor: "#F3E8FF",
    radius: 450,
  },
  mob_violence: {
    category: "security_public_order",
    label: "Orang Diamuk Massa",
    shortLabel: "Mob",
    icon: "🚨",
    color: "#881337",
    lightColor: "#FFE4E6",
    radius: 500,
  },
  public_disturbance: {
    category: "security_public_order",
    label: "Gangguan Publik",
    shortLabel: "Disturb",
    icon: "⚠️",
    color: "#9333EA",
    lightColor: "#F3E8FF",
    radius: 400,
  },

  medical: {
    category: "medical_rescue",
    label: "Darurat Medis",
    shortLabel: "Medical",
    icon: "🚑",
    color: "#0891B2",
    lightColor: "#CFFAFE",
    radius: 350,
  },
  fainted_person: {
    category: "medical_rescue",
    label: "Orang Pingsan",
    shortLabel: "Faint",
    icon: "🧍",
    color: "#0E7490",
    lightColor: "#CFFAFE",
    radius: 250,
  },
  work_accident: {
    category: "medical_rescue",
    label: "Kecelakaan Kerja",
    shortLabel: "Work",
    icon: "⛑️",
    color: "#0369A1",
    lightColor: "#E0F2FE",
    radius: 350,
  },
  drowning: {
    category: "medical_rescue",
    label: "Orang Tenggelam",
    shortLabel: "Drown",
    icon: "🛟",
    color: "#0284C7",
    lightColor: "#E0F2FE",
    radius: 450,
  },
  evacuation_needed: {
    category: "medical_rescue",
    label: "Butuh Evakuasi",
    shortLabel: "Evacuate",
    icon: "🆘",
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
      icon: meta.icon,
      color: meta.color,
      lightColor: meta.lightColor,
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
    icon: meta.icon,
    color: meta.color,
    lightColor: meta.lightColor,
  };
});

export const SEVERITY_OPTIONS: SeverityOption[] = [
  {
    value: "low",
    label: "Low",
    color: "#16A34A",
    description:
      "Tidak terlalu berbahaya, tetapi tetap perlu diketahui sekitar.",
  },
  {
    value: "medium",
    label: "Medium",
    color: "#F59E0B",
    description: "Mengganggu aktivitas sekitar dan perlu diwaspadai.",
  },
  {
    value: "high",
    label: "High",
    color: "#DC2626",
    description: "Berbahaya, mendesak, dan butuh perhatian cepat.",
  },
];

export const isIncidentCategory = (
  value: string
): value is IncidentCategory => {
  return Object.keys(INCIDENT_CATEGORIES).includes(value);
};

export const isIncidentType = (value: string): value is IncidentType => {
  return Object.keys(INCIDENT_TYPES).includes(value);
};

export const getIncidentCategoryMeta = (
  category?: IncidentCategory | null
): IncidentCategoryMeta => {
  if (!category) {
    return INCIDENT_CATEGORIES.security_public_order;
  }

  return INCIDENT_CATEGORIES[category] ?? INCIDENT_CATEGORIES.security_public_order;
};

export const getIncidentMeta = (
  type?: IncidentType | IncidentSubcategory | null
): IncidentMeta => {
  if (!type) {
    return INCIDENT_TYPES.public_disturbance;
  }

  return INCIDENT_TYPES[type] ?? INCIDENT_TYPES.public_disturbance;
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