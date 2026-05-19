import type { IncidentCategory } from "../../types/incident";
import type { IncidentCategoryMeta } from "./types";

export const UNKNOWN_INCIDENT_META: IncidentCategoryMeta = {
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
  other: {
    label: "Other / Not Sure",
    shortLabel: "Other",
    iconName: "help-circle",
    color: "#475569",
    lightColor: "#F1F5F9",
    description: "Reports that do not fit the main incident types yet.",
  },
} as const satisfies Record<IncidentCategory, IncidentCategoryMeta>;
