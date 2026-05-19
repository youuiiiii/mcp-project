import {
  INCIDENT_CATEGORY_OPTIONS,
  SEVERITY_OPTIONS,
  type AppIconName,
} from "../../constants/incident";
import { colors } from "../../theme/colors";
import type {
  IncidentReport,
  IncidentSeverity,
  IncidentStatus,
} from "../../types/incident";
import {
  getIncidentTrustLevel,
  type IncidentTrustLevel,
} from "../../utils/incidentTrust";
import type { DistributionItem } from "./types";

const STATUS_DISTRIBUTION_OPTIONS = [
  {
    value: "active",
    label: "Active",
    iconName: "radio",
    color: colors.danger,
  },
  {
    value: "resolved",
    label: "Resolved",
    iconName: "checkmark-circle",
    color: colors.success,
  },
] as const satisfies readonly {
  value: IncidentStatus;
  label: string;
  iconName: AppIconName;
  color: string;
}[];

const TRUST_DISTRIBUTION_OPTIONS = [
  {
    value: "pending",
    label: "Needs Verification",
    iconName: "time-outline",
    color: colors.warning,
  },
  {
    value: "verified",
    label: "Verified",
    iconName: "shield-checkmark-outline",
    color: colors.success,
  },
  {
    value: "disputed",
    label: "Questioned",
    iconName: "alert-circle-outline",
    color: colors.danger,
  },
  {
    value: "resolved",
    label: "Resolved",
    iconName: "checkmark-done-circle-outline",
    color: colors.textSoft,
  },
] as const satisfies readonly {
  value: IncidentTrustLevel;
  label: string;
  iconName: AppIconName;
  color: string;
}[];

export const SEVERITY_LABEL_BY_VALUE = {
  low: "Low",
  medium: "Medium",
  high: "High",
} as const satisfies Record<IncidentSeverity, string>;

export function buildCategoryDistribution(
  reports: IncidentReport[]
): DistributionItem[] {
  const total = reports.length || 1;

  return INCIDENT_CATEGORY_OPTIONS.map((option) => {
    const count = reports.filter((report) => {
      return report.category === option.value;
    }).length;

    return {
      label: option.label,
      count,
      percentage: Math.round((count / total) * 100),
      iconName: option.iconName,
      color: option.color,
    };
  })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);
}

export function buildSeverityDistribution(
  reports: IncidentReport[]
): DistributionItem[] {
  const total = reports.length || 1;

  return SEVERITY_OPTIONS.map((option) => {
    const count = reports.filter((report) => {
      return (report.urgencyLevel ?? report.severity) === option.value;
    }).length;

    return {
      label: option.label,
      count,
      percentage: Math.round((count / total) * 100),
      iconName: option.iconName,
      color: option.color,
    };
  });
}

export function buildStatusDistribution(
  reports: IncidentReport[]
): DistributionItem[] {
  const total = reports.length || 1;

  return STATUS_DISTRIBUTION_OPTIONS.map((option) => {
    const count = reports.filter((report) => {
      return report.status === option.value;
    }).length;

    return {
      label: option.label,
      count,
      percentage: Math.round((count / total) * 100),
      iconName: option.iconName,
      color: option.color,
    };
  });
}

export function buildTrustDistribution(
  reports: IncidentReport[]
): DistributionItem[] {
  const total = reports.length || 1;

  return TRUST_DISTRIBUTION_OPTIONS.map((option) => {
    const count = reports.filter((report) => {
      return getIncidentTrustLevel(report) === option.value;
    }).length;

    return {
      label: option.label,
      count,
      percentage: Math.round((count / total) * 100),
      iconName: option.iconName,
      color: option.color,
    };
  }).filter((item) => item.count > 0);
}

export function getReportTimestamp(report: IncidentReport): number {
  return (
    report.latestActivityAt?.getTime() ??
    report.updatedAt?.getTime() ??
    report.createdAt?.getTime() ??
    0
  );
}

export function getSafeCount(value?: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, value);
}
