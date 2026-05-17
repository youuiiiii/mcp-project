import { type Href, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../../../contexts/AuthContext";
import { subscribeToIncidents } from "../../../services/incidentService";
import type { IncidentReport } from "../../../types/incident";

const MAP_ROUTE = "/(tabs)/map" as Href;
const REPORT_ROUTE = "/(tabs)/report" as Href;
const REPORTS_ROUTE = "/(tabs)/reports" as Href;
const ANALYTICS_ROUTE = "/(tabs)/analytics" as Href;
const PROFILE_ROUTE = "/(tabs)/profile" as Href;
const EDUCATION_ROUTE = "/(tabs)/education" as Href;
const EARTHQUAKE_ROUTE = "/(tabs)/detail" as Href;

export function useHomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "Community Reporter";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((item) => item.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    setLoadingReports(true);

    const unsubscribe = subscribeToIncidents(
      (items) => {
        setReports(items);
        setErrorMessage(null);
        setLoadingReports(false);
      },
      (error) => {
        console.error("Home reports error:", error);
        setErrorMessage(error.message || "Gagal memuat laporan terbaru.");
        setLoadingReports(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const activeReports = useMemo(() => {
    return reports.filter((report) => report.status === "active");
  }, [reports]);

  const highSeverityReports = useMemo(() => {
    return reports.filter((report) => {
      return report.status === "active" && report.severity === "high";
    });
  }, [reports]);

  const latestReports = useMemo(() => {
    return [...reports]
      .sort((a, b) => {
        const timeA = a.createdAt?.getTime() ?? 0;
        const timeB = b.createdAt?.getTime() ?? 0;

        return timeB - timeA;
      })
      .slice(0, 3);
  }, [reports]);

  const openMap = () => {
    router.push(MAP_ROUTE);
  };

  const openReport = () => {
    router.push(REPORT_ROUTE);
  };

  const openReports = () => {
    router.push(REPORTS_ROUTE);
  };

  const openAnalytics = () => {
    router.push(ANALYTICS_ROUTE);
  };

  const openProfile = () => {
    router.push(PROFILE_ROUTE);
  };

  const openEducation = () => {
    router.push(EDUCATION_ROUTE);
  };

  const openEarthquake = () => {
    router.push(EARTHQUAKE_ROUTE);
  };

  return {
    displayName,
    initials,

    reports,
    activeReports,
    highSeverityReports,
    latestReports,

    loadingReports,
    errorMessage,

    openMap,
    openReport,
    openReports,
    openAnalytics,
    openProfile,
    openEducation,
    openEarthquake,
  };
}