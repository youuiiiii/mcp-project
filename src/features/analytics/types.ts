import type { AppIconName } from "../../constants/incident";

export type IconBadgeVariant = "danger" | "success" | "warning" | "info" | "neutral";

export type SummaryItem = {
  label: string;
  value: number;
  iconName: AppIconName;
  color: string;
  variant: IconBadgeVariant;
};

export type MetricItem = {
  label: string;
  value: number | string;
  text: string;
  iconName: AppIconName;
};

export type DistributionItem = {
  label: string;
  count: number;
  percentage: number;
  iconName?: AppIconName;
  color?: string;
};
