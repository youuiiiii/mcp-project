import { useEffect, useMemo, useState } from "react";

import { subscribeToIncidents } from "../../../services/incidentService";
import type { IncidentReport } from "../../../types/incident";

export const useHomeReports = () => {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportsErrorMessage, setReportsErrorMessage] = useState<string | null>(
    null
  );

  useEffect(() => {
    setLoadingReports(true);

    const unsubscribe = subscribeToIncidents(
      (items) => {
        setReports(items);
        setReportsErrorMessage(null);
        setLoadingReports(false);
      },
      (error) => {
        console.error("Home reports error:", error);
        setReportsErrorMessage(error.message || "Could not load reports.");
        setLoadingReports(false);
      }
    );

    return unsubscribe;
  }, []);

  const activeReports = useMemo(() => {
    return reports.filter((report) => report.status === "active");
  }, [reports]);

  const highSeverityReports = useMemo(() => {
    return reports.filter((report) => report.severity === "high");
  }, [reports]);

  const latestReports = useMemo(() => {
    return [...reports]
      .sort((a, b) => {
        const bTime =
          b.latestActivityAt?.getTime() ??
          b.updatedAt?.getTime() ??
          b.createdAt?.getTime() ??
          0;

        const aTime =
          a.latestActivityAt?.getTime() ??
          a.updatedAt?.getTime() ??
          a.createdAt?.getTime() ??
          0;

        return bTime - aTime;
      })
      .slice(0, 3);
  }, [reports]);

  return {
    reports,
    activeReports,
    highSeverityReports,
    latestReports,
    loadingReports,
    reportsErrorMessage,
  };
};
