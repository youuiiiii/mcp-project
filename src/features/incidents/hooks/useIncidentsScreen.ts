import { useEffect, useMemo, useState } from "react";

import { getIncidentDisplayMeta } from "../../../constants/incident";
import { subscribeToIncidents } from "../../../services/incidentService";
import type { IncidentReport } from "../../../types/incident";

export type IncidentFilter =
  | "all"
  | "active"
  | "resolved"
  | "high"
  | "medium"
  | "low";

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
    value: "resolved",
    label: "Resolved",
  },
  {
    value: "high",
    label: "High Urgency",
  },
  {
    value: "medium",
    label: "Medium Urgency",
  },
  {
    value: "low",
    label: "Low Urgency",
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

  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    null
  );

  const [selectedVerifyIncident, setSelectedVerifyIncident] =
    useState<IncidentReport | null>(null);

  const [selectedResolveIncident, setSelectedResolveIncident] =
    useState<IncidentReport | null>(null);

  const [isThreadModalVisible, setIsThreadModalVisible] = useState(false);
  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false);
  const [isResolveModalVisible, setIsResolveModalVisible] = useState(false);

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

  const selectedIncident = useMemo(() => {
    if (!selectedIncidentId) {
      return null;
    }

    return incidents.find((item) => item.id === selectedIncidentId) ?? null;
  }, [incidents, selectedIncidentId]);

  const filteredIncidents = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return incidents.filter((incident) => {
      if (selectedFilter === "active" && incident.status !== "active") {
        return false;
      }

      if (selectedFilter === "resolved" && incident.status !== "resolved") {
        return false;
      }

      const urgencyLevel = incident.urgencyLevel ?? incident.severity;

      if (selectedFilter === "high" && urgencyLevel !== "high") {
        return false;
      }

      if (selectedFilter === "medium" && urgencyLevel !== "medium") {
        return false;
      }

      if (selectedFilter === "low" && urgencyLevel !== "low") {
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
  }, [incidents, searchQuery, selectedFilter]);

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

  const handleOpenIncident = (incident: IncidentReport) => {
    setSelectedIncidentId(incident.id);
    setIsThreadModalVisible(true);
  };

  const handleCloseThreadModal = () => {
    setIsThreadModalVisible(false);
    setSelectedIncidentId(null);
  };

  const handleOpenVerifyModal = (incident: IncidentReport) => {
    setSelectedVerifyIncident(incident);
    setIsVerifyModalVisible(true);
  };

  const handleCloseVerifyModal = () => {
    setIsVerifyModalVisible(false);
    setSelectedVerifyIncident(null);
  };

  const handleOpenResolveModal = (incident: IncidentReport) => {
    setSelectedResolveIncident(incident);
    setIsResolveModalVisible(true);
  };

  const handleCloseResolveModal = () => {
    setIsResolveModalVisible(false);
    setSelectedResolveIncident(null);
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

    selectedIncident,
    selectedVerifyIncident,
    selectedResolveIncident,

    isThreadModalVisible,
    isVerifyModalVisible,
    isResolveModalVisible,

    handleOpenIncident,
    handleCloseThreadModal,
    handleOpenVerifyModal,
    handleCloseVerifyModal,
    handleOpenResolveModal,
    handleCloseResolveModal,
  };
};