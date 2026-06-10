import type { IncidentCategory } from "../../types/incident";
import type { IncidentCategoryMeta } from "./types";

export const UNKNOWN_INCIDENT_META: IncidentCategoryMeta = {
  label: "Unknown Category",
  shortLabel: "Unknown",
  iconName: "help-circle",
  color: "#74796E",
  lightColor: "#FAF6F0",
  description: "The report category is missing or not recognized by the system.",
};

export const INCIDENT_CATEGORIES = {
  natural_disaster: {
    label: "Natural Disaster",
    shortLabel: "Disaster",
    iconName: "earth",
    color: "#2F5C50",
    lightColor: "#E2ECE9",
    description: "Floods, earthquakes, landslides, tsunamis, strong winds, or other natural hazards.",
  },
  fire_emergency: {
    label: "Fire Emergency",
    shortLabel: "Fire",
    iconName: "flame",
    color: "#B83230",
    lightColor: "#FADCDA",
    description: "Fire, heavy smoke, building fires, vehicle fires, land fires, or electrical fires.",
  },
  accident_infrastructure: {
    label: "Accident & Infrastructure",
    shortLabel: "Road",
    iconName: "construct",
    color: "#705C30",
    lightColor: "#F5ECD7",
    description: "Accidents, blocked or damaged roads, fallen trees, downed cables, or damaged facilities.",
  },
  security_public_order: {
    label: "Security & Public Order",
    shortLabel: "Security",
    iconName: "shield",
    color: "#8D1B1B",
    lightColor: "#FCEAE8",
    description: "Crime, theft, fights, risky crowds, public disturbance, or safety concerns.",
  },
  medical_rescue: {
    label: "Medical & Rescue",
    shortLabel: "Medical",
    iconName: "medkit",
    color: "#4A7C59",
    lightColor: "#E2ECE3",
    description: "Medical emergencies, fainting, workplace accidents, drowning, or evacuation needs.",
  },
  missing_lost: {
    label: "Missing / Lost",
    shortLabel: "Missing",
    iconName: "search",
    color: "#6A5320",
    lightColor: "#F5ECD7",
    description: "Missing people, lost items, or missing vehicles.",
  },
  other: {
    label: "Other / Not Sure",
    shortLabel: "Other",
    iconName: "help-circle",
    color: "#74796E",
    lightColor: "#ECE9E5",
    description: "Reports that do not fit the main incident types yet.",
  },
} as const satisfies Record<IncidentCategory, IncidentCategoryMeta>;
