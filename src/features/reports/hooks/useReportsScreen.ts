import { useEffect, useMemo, useState } from "react";

import { getIncidentDisplayMeta } from "../../../constants/incident";
import { subscribeToIncidents } from "../../../services/incidentService";
import type { IncidentReport } from "../../../types/incident";

export type ReportFilter = "all" | "active" | "resolved" | "high";

export const REPORT_FILTER_OPTIONS: readonly {
  value: ReportFilter;
  label: string;
}[] = [
  {
    value: "all",
    label: "Semua",
  },
  {
    value: "active",
    label: "Aktif",
  },
  {
    value: "resolved",
    label: "Selesai",
  },
  {
    value: "high",
    label: "Severity Tinggi",
  },
];

export type ReportsSummary = {
  total: number;
  active: number;
  resolved: number;
  highSeverity: number;
};

export const useReportsScreen = () => {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<ReportFilter>("all");

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
        setReports(items);
        setErrorMessage(null);
        setLoading(false);
      },
      (error) => {
        console.error("Reports screen error:", error);
        setErrorMessage(error.message || "Gagal memuat laporan.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const selectedIncident = useMemo(() => {
    if (!selectedIncidentId) {
      return null;
    }

    return reports.find((item) => item.id === selectedIncidentId) ?? null;
  }, [reports, selectedIncidentId]);

  const filteredReports = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return reports.filter((report) => {
      if (selectedFilter === "active" && report.status !== "active") {
        return false;
      }

      if (selectedFilter === "resolved" && report.status !== "resolved") {
        return false;
      }

      if (selectedFilter === "high" && report.severity !== "high") {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const meta = getIncidentDisplayMeta({
        category: report.category,
        subcategory: report.subcategory ?? report.type,
      });

      const searchableText = [
        report.title,
        report.description,
        report.category,
        report.status,
        report.severity,
        report.verificationStatus,
        report.latestCommunityUpdateType,
        meta.label,
        report.reportedBy,
        report.reporterEmail,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [reports, searchQuery, selectedFilter]);

  const summary = useMemo<ReportsSummary>(() => {
    return {
      total: reports.length,
      active: reports.filter((item) => item.status === "active").length,
      resolved: reports.filter((item) => item.status === "resolved").length,
      highSeverity: reports.filter((item) => item.severity === "high").length,
    };
  }, [reports]);

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

    reports,
    filteredReports,
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
