import { useEffect, useMemo, useState } from "react";

import { subscribeToIncidents } from "../../../services/incidentService";
import { colors } from "../../../theme/colors";
import type { IncidentReport } from "../../../types/incident";
import {
  getIncidentTrustLevel,
  type IncidentTrustLevel,
} from "../../../utils/incidentTrust";
import {
  buildCategoryDistribution,
  buildSeverityDistribution,
  buildStatusDistribution,
  buildTrustDistribution,
  getReportTimestamp,
  getSafeCount,
} from "../analyticsData";
import type { MetricItem, SummaryItem } from "../types";

export function useAnalyticsScreen() {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToIncidents(
      (items) => {
        setReports(items);
        setErrorMessage(null);
        setLoading(false);
      },
      (error) => {
        console.error("Analytics error:", error);
        setErrorMessage(error.message || "Could not load analytics.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const activeReports = useMemo(() => {
    return reports.filter((report) => report.status === "active");
  }, [reports]);

  const resolvedReports = useMemo(() => {
    return reports.filter((report) => report.status === "resolved");
  }, [reports]);

  const highSeverityReports = useMemo(() => {
    return reports.filter((report) => {
      return (report.urgencyLevel ?? report.severity) === "high";
    });
  }, [reports]);

  const trustCounts = useMemo(() => {
    return reports.reduce<Record<IncidentTrustLevel, number>>(
      (acc, report) => {
        const level = getIncidentTrustLevel(report);

        acc[level] += 1;

        return acc;
      },
      {
        pending: 0,
        verified: 0,
        disputed: 0,
        resolved: 0,
      }
    );
  }, [reports]);

  const totalEvidence = useMemo(() => {
    return reports.reduce((total, report) => {
      return total + getSafeCount(report.evidenceCount);
    }, 0);
  }, [reports]);

  const totalReplies = useMemo(() => {
    return reports.reduce((total, report) => {
      return total + getSafeCount(report.replyCount);
    }, 0);
  }, [reports]);

  const averageResolutionHours = useMemo(() => {
    const resolvedWithTime = resolvedReports.filter((report) => {
      return report.createdAt && report.resolvedAt;
    });

    if (resolvedWithTime.length === 0) {
      return "-";
    }

    const totalHours = resolvedWithTime.reduce((total, report) => {
      const createdAt = report.createdAt?.getTime() ?? 0;
      const resolvedAt = report.resolvedAt?.getTime() ?? 0;
      const diffHours = Math.max(resolvedAt - createdAt, 0) / 1000 / 60 / 60;

      return total + diffHours;
    }, 0);

    return `${Math.round(totalHours / resolvedWithTime.length)} hours`;
  }, [resolvedReports]);

  const summaryItems = useMemo<SummaryItem[]>(() => {
    return [
      {
        label: "Total Reports",
        value: reports.length,
        iconName: "location",
        color: colors.info,
        variant: "info",
      },
      {
        label: "Active",
        value: activeReports.length,
        iconName: "radio",
        color: colors.danger,
        variant: "danger",
      },
      {
        label: "Resolved",
        value: resolvedReports.length,
        iconName: "checkmark-circle",
        color: colors.success,
        variant: "success",
      },
      {
        label: "High Urgency",
        value: highSeverityReports.length,
        iconName: "alert-circle",
        color: colors.warningDark,
        variant: "warning",
      },
    ];
  }, [
    reports.length,
    activeReports.length,
    resolvedReports.length,
    highSeverityReports.length,
  ]);

  const metricItems = useMemo<MetricItem[]>(() => {
    return [
      {
        label: "Verified",
        value: trustCounts.verified,
        text: "community-trusted reports",
        iconName: "shield-checkmark",
      },
      {
        label: "Questioned",
        value: trustCounts.disputed,
        text: "reports that need review",
        iconName: "help-circle",
      },
      {
        label: "Avg. Resolution",
        value: averageResolutionHours,
        text: "resolution duration",
        iconName: "time",
      },
    ];
  }, [trustCounts.verified, trustCounts.disputed, averageResolutionHours]);

  const severityDistribution = useMemo(() => {
    return buildSeverityDistribution(reports);
  }, [reports]);

  const statusDistribution = useMemo(() => {
    return buildStatusDistribution(reports);
  }, [reports]);

  const categoryDistribution = useMemo(() => {
    return buildCategoryDistribution(reports);
  }, [reports]);

  const trustDistribution = useMemo(() => {
    return buildTrustDistribution(reports);
  }, [reports]);

  const latestReports = useMemo(() => {
    return [...reports]
      .sort((a, b) => getReportTimestamp(b) - getReportTimestamp(a))
      .slice(0, 4);
  }, [reports]);

  return {
    reports,
    loading,
    errorMessage,
    summaryItems,
    metricItems,
    categoryDistribution,
    severityDistribution,
    statusDistribution,
    trustDistribution,
    totalEvidence,
    totalReplies,
    latestReports,
  };
}
