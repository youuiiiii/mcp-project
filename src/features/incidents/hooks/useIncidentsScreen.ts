import { useEffect, useMemo, useState } from "react";

import { getIncidentDisplayMeta } from "../../../constants/incident";
import { subscribeToIncidents } from "../../../services/incidentService";
import type { IncidentReport } from "../../../types/incident";

export type IncidentFilter =
  | "all"
  | "active"
  | "monitoring"
  | "resolved";

export type IncidentSortMode = "latest" | "severity";

export const INCIDENT_FILTER_OPTIONS: readonly {
  value: IncidentFilter;
  label: string;
}[] = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "monitoring",
    label: "Monitoring",
  },
  {
    value: "resolved",
    label: "Resolved",
  },
];

export type IncidentsSummary = {
  total: number;
  active: number;
  resolved: number;
  highSeverity: number;
};

export const useIncidentsScreen = () => {
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<IncidentFilter>("all");
  const [sortMode, setSortMode] = useState<IncidentSortMode>("latest");

  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToIncidents(
      (items) => {
        setIncidents(items);
        setErrorMessage(null);
        setLoading(false);
      },
      (error) => {
        console.error("Incidents screen error:", error);
        setErrorMessage(error.message || "Could not load incidents.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const filteredIncidents = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filtered = incidents.filter((incident) => {
      if (selectedFilter === "active" && incident.status !== "active") {
        return false;
      }

      if (selectedFilter === "monitoring" && !isMonitoringIncident(incident)) {
        return false;
      }

      if (selectedFilter === "resolved" && incident.status !== "resolved") {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const meta = getIncidentDisplayMeta({
        category: incident.category,
        subcategory: incident.subcategory ?? incident.type,
      });

      const searchableText = [
        incident.title,
        incident.description,
        incident.address,
        incident.category,
        incident.domain,
        incident.kind,
        incident.status,
        incident.severity,
        incident.urgencyLevel,
        incident.urgencyScore,
        incident.verificationStatus,
        incident.latestCommunityUpdateType,
        meta.label,
        incident.reportedBy,
        incident.reporterEmail,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });

    return [...filtered].sort((a, b) => {
      if (sortMode === "severity") {
        return getIncidentUrgencyScore(b) - getIncidentUrgencyScore(a);
      }

      return getIncidentTime(b) - getIncidentTime(a);
    });
  }, [incidents, searchQuery, selectedFilter, sortMode]);

  const summary = useMemo<IncidentsSummary>(() => {
    return {
      total: incidents.length,
      active: incidents.filter((item) => item.status === "active").length,
      resolved: incidents.filter((item) => item.status === "resolved").length,
      highSeverity: incidents.filter((item) => {
        return (item.urgencyLevel ?? item.severity) === "high";
      }).length,
    };
  }, [incidents]);

  const toggleSortMode = () => {
    setSortMode((current) => (current === "latest" ? "severity" : "latest"));
  };

  return {
    loading,
    errorMessage,

    incidents,
    filteredIncidents,
    summary,

    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    sortMode,
    toggleSortMode,
  };
};

function isMonitoringIncident(incident: IncidentReport) {
  return (
    incident.status === "active" &&
    (incident.verificationStatus === "pending" ||
      incident.trustStatus === "questioned" ||
      (incident.conditionUpdateCount ?? 0) > 0)
  );
}

function getIncidentUrgencyScore(incident: IncidentReport) {
  if (typeof incident.urgencyScore === "number") {
    return incident.urgencyScore;
  }

  const level = incident.urgencyLevel ?? incident.severity;

  if (level === "high") return 90;
  if (level === "medium") return 55;
  return 20;
}

function getIncidentTime(incident: IncidentReport) {
  return incident.createdAt?.getTime() ?? 0;
}
