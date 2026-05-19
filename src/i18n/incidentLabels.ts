import type {
  IncidentCategory,
  IncidentSeverity,
  IncidentSubcategory,
} from "../types/incident";
import type { TFunction } from "./I18nProvider";
import type { TranslationKey } from "./translations";

const CATEGORY_LABEL_KEYS: Record<IncidentCategory, TranslationKey> = {
  natural_disaster: "incident.category.natural_disaster.label",
  fire_emergency: "incident.category.fire_emergency.label",
  accident_infrastructure: "incident.category.accident_infrastructure.label",
  security_public_order: "incident.category.security_public_order.label",
  medical_rescue: "incident.category.medical_rescue.label",
  missing_lost: "incident.category.missing_lost.label",
  other: "incident.category.other.label",
};

const CATEGORY_SHORT_KEYS: Record<IncidentCategory, TranslationKey> = {
  natural_disaster: "incident.category.natural_disaster.short",
  fire_emergency: "incident.category.fire_emergency.short",
  accident_infrastructure: "incident.category.accident_infrastructure.short",
  security_public_order: "incident.category.security_public_order.short",
  medical_rescue: "incident.category.medical_rescue.short",
  missing_lost: "incident.category.missing_lost.short",
  other: "incident.category.other.short",
};

const CATEGORY_DESCRIPTION_KEYS: Record<IncidentCategory, TranslationKey> = {
  natural_disaster: "incident.category.natural_disaster.description",
  fire_emergency: "incident.category.fire_emergency.description",
  accident_infrastructure:
    "incident.category.accident_infrastructure.description",
  security_public_order: "incident.category.security_public_order.description",
  medical_rescue: "incident.category.medical_rescue.description",
  missing_lost: "incident.category.missing_lost.description",
  other: "incident.category.other.description",
};

const SUBCATEGORY_LABEL_KEYS: Record<IncidentSubcategory, TranslationKey> = {
  flood: "incident.subcategory.flood.label",
  earthquake: "incident.subcategory.earthquake.label",
  landslide: "incident.subcategory.landslide.label",
  volcanic_eruption: "incident.subcategory.volcanic_eruption.label",
  strong_wind: "incident.subcategory.strong_wind.label",
  tsunami: "incident.subcategory.tsunami.label",
  fire: "incident.subcategory.fire.label",
  building_fire: "incident.subcategory.building_fire.label",
  vehicle_fire: "incident.subcategory.vehicle_fire.label",
  land_fire: "incident.subcategory.land_fire.label",
  electrical_fire: "incident.subcategory.electrical_fire.label",
  traffic_accident: "incident.subcategory.traffic_accident.label",
  fallen_tree: "incident.subcategory.fallen_tree.label",
  road_block: "incident.subcategory.road_block.label",
  damaged_road: "incident.subcategory.damaged_road.label",
  fallen_power_line: "incident.subcategory.fallen_power_line.label",
  collapsed_building: "incident.subcategory.collapsed_building.label",
  crime: "incident.subcategory.crime.label",
  theft: "incident.subcategory.theft.label",
  brawl: "incident.subcategory.brawl.label",
  risky_crowd: "incident.subcategory.risky_crowd.label",
  mob_violence: "incident.subcategory.mob_violence.label",
  public_disturbance: "incident.subcategory.public_disturbance.label",
  medical: "incident.subcategory.medical.label",
  fainted_person: "incident.subcategory.fainted_person.label",
  work_accident: "incident.subcategory.work_accident.label",
  drowning: "incident.subcategory.drowning.label",
  evacuation_needed: "incident.subcategory.evacuation_needed.label",
  missing_person: "incident.subcategory.missing_person.label",
  missing_item: "incident.subcategory.missing_item.label",
  missing_vehicle: "incident.subcategory.missing_vehicle.label",
  other_incident: "incident.subcategory.other_incident.label",
};

const SUBCATEGORY_SHORT_KEYS: Record<IncidentSubcategory, TranslationKey> = {
  flood: "incident.subcategory.flood.short",
  earthquake: "incident.subcategory.earthquake.short",
  landslide: "incident.subcategory.landslide.short",
  volcanic_eruption: "incident.subcategory.volcanic_eruption.short",
  strong_wind: "incident.subcategory.strong_wind.short",
  tsunami: "incident.subcategory.tsunami.short",
  fire: "incident.subcategory.fire.short",
  building_fire: "incident.subcategory.building_fire.short",
  vehicle_fire: "incident.subcategory.vehicle_fire.short",
  land_fire: "incident.subcategory.land_fire.short",
  electrical_fire: "incident.subcategory.electrical_fire.short",
  traffic_accident: "incident.subcategory.traffic_accident.short",
  fallen_tree: "incident.subcategory.fallen_tree.short",
  road_block: "incident.subcategory.road_block.short",
  damaged_road: "incident.subcategory.damaged_road.short",
  fallen_power_line: "incident.subcategory.fallen_power_line.short",
  collapsed_building: "incident.subcategory.collapsed_building.short",
  crime: "incident.subcategory.crime.short",
  theft: "incident.subcategory.theft.short",
  brawl: "incident.subcategory.brawl.short",
  risky_crowd: "incident.subcategory.risky_crowd.short",
  mob_violence: "incident.subcategory.mob_violence.short",
  public_disturbance: "incident.subcategory.public_disturbance.short",
  medical: "incident.subcategory.medical.short",
  fainted_person: "incident.subcategory.fainted_person.short",
  work_accident: "incident.subcategory.work_accident.short",
  drowning: "incident.subcategory.drowning.short",
  evacuation_needed: "incident.subcategory.evacuation_needed.short",
  missing_person: "incident.subcategory.missing_person.short",
  missing_item: "incident.subcategory.missing_item.short",
  missing_vehicle: "incident.subcategory.missing_vehicle.short",
  other_incident: "incident.subcategory.other_incident.short",
};

const SEVERITY_LABEL_KEYS: Record<IncidentSeverity, TranslationKey> = {
  low: "incident.severity.low.label",
  medium: "incident.severity.medium.label",
  high: "incident.severity.high.label",
};

const SEVERITY_DESCRIPTION_KEYS: Record<IncidentSeverity, TranslationKey> = {
  low: "incident.severity.low.description",
  medium: "incident.severity.medium.description",
  high: "incident.severity.high.description",
};

export function getIncidentCategoryLabel(
  t: TFunction,
  category: IncidentCategory
) {
  return t(CATEGORY_LABEL_KEYS[category]);
}

export function getIncidentCategoryShortLabel(
  t: TFunction,
  category: IncidentCategory
) {
  return t(CATEGORY_SHORT_KEYS[category]);
}

export function getIncidentCategoryDescription(
  t: TFunction,
  category: IncidentCategory
) {
  return t(CATEGORY_DESCRIPTION_KEYS[category]);
}

export function getIncidentSubcategoryLabel(
  t: TFunction,
  subcategory: IncidentSubcategory
) {
  return t(SUBCATEGORY_LABEL_KEYS[subcategory]);
}

export function getIncidentSubcategoryShortLabel(
  t: TFunction,
  subcategory: IncidentSubcategory
) {
  return t(SUBCATEGORY_SHORT_KEYS[subcategory]);
}

export function getIncidentSeverityLabel(
  t: TFunction,
  severity: IncidentSeverity
) {
  return t(SEVERITY_LABEL_KEYS[severity]);
}

export function getIncidentSeverityDescription(
  t: TFunction,
  severity: IncidentSeverity
) {
  return t(SEVERITY_DESCRIPTION_KEYS[severity]);
}
