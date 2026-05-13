import { useEffect, useMemo, useState } from "react";

import type { MapFilterValue } from "../../../components/FilterBar";
import { isIncidentCategory } from "../../../constants/incident";
import { subscribeToIncidents } from "../../../services/incidentService";
import type { IncidentReport } from "../../../types/incident";
import { getNearestIncident, isValidCoordinate } from "../../../utils/geo";
import type { UserMapPosition } from "../types";
import { createClusters } from "../utils/createClusters";

type UseMapIncidentsParams = {
  selectedFilter: MapFilterValue;
  userLocation: UserMapPosition | null;
};

export const useMapIncidents = ({
  selectedFilter,
  userLocation,
}: UseMapIncidentsParams) => {
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
        console.error("Map reports error:", error);
        setReportsErrorMessage(error.message || "Gagal memuat data laporan.");
        setLoadingReports(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const filteredReports = useMemo(() => {
    const validReports = reports.filter((report) => {
      return isValidCoordinate(report.latitude, report.longitude);
    });

    if (selectedFilter === "all") {
      return validReports;
    }

    if (selectedFilter === "active") {
      return validReports.filter((report) => report.status === "active");
    }

    if (selectedFilter === "resolved") {
      return validReports.filter((report) => report.status === "resolved");
    }

    if (isIncidentCategory(selectedFilter)) {
      return validReports.filter((report) => {
        return report.category === selectedFilter;
      });
    }

    return validReports;
  }, [reports, selectedFilter]);

  const activeReports = useMemo(() => {
    return reports.filter((report) => {
      return (
        report.status === "active" &&
        isValidCoordinate(report.latitude, report.longitude)
      );
    });
  }, [reports]);

  const clusters = useMemo(() => {
    return createClusters(filteredReports);
  }, [filteredReports]);

  const nearestIncident = useMemo(() => {
    if (!userLocation) {
      return {
        incident: null,
        distance: null,
      };
    }

    return getNearestIncident(userLocation, activeReports);
  }, [userLocation, activeReports]);

  return {
    reports,
    filteredReports,
    activeReports,
    clusters,
    nearestIncident,
    loadingReports,
    reportsErrorMessage,
  };
};