import { useEffect, useMemo, useState } from "react";

import type { MapFilterValue } from "../../../components/FilterBar";
import { subscribeToIncidents } from "../../../services/incidentService";
import type { IncidentReport } from "../../../types/incident";
import { getNearestIncident, isValidCoordinate } from "../../../utils/geo";
import type { UserMapPosition } from "../types";

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
        setReportsErrorMessage(error.message || "Could not load report data.");
        setLoadingReports(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const validReports = useMemo(() => {
    return reports.filter((report) => {
      return isValidCoordinate(report.latitude, report.longitude);
    });
  }, [reports]);

  const filteredReports = useMemo(() => {
    if (selectedFilter === "all") {
      return validReports;
    }

    return validReports.filter((report) => report.category === selectedFilter);
  }, [validReports, selectedFilter]);

  const activeReports = useMemo(() => {
    return validReports.filter((report) => {
      return report.status === "active";
    });
  }, [validReports]);

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
    validReports,
    filteredReports,
    activeReports,
    nearestIncident,
    loadingReports,
    reportsErrorMessage,
  };
};
