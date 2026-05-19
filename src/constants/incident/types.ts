import type { Ionicons } from "@expo/vector-icons";

import type {
  IncidentCategory,
  IncidentSeverity,
  IncidentSubcategory,
} from "../../types/incident";

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

