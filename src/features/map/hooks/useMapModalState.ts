import { useMemo, useState } from "react";

import type { Coordinate, IncidentReport } from "../../../types/incident";

type UseMapModalStateParams = {
  reports: IncidentReport[];
};

export const useMapModalState = ({ reports }: UseMapModalStateParams) => {
  const [draftCoordinate, setDraftCoordinate] = useState<Coordinate | null>(
    null
  );

  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    null
  );

  const [selectedResolveIncident, setSelectedResolveIncident] =
    useState<IncidentReport | null>(null);

  const [selectedVerifyIncident, setSelectedVerifyIncident] =
    useState<IncidentReport | null>(null);

  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [isThreadModalVisible, setIsThreadModalVisible] = useState(false);
  const [isResolveModalVisible, setIsResolveModalVisible] = useState(false);
  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false);

  const selectedIncident = useMemo(() => {
    if (!selectedIncidentId) {
      return null;
    }

    return reports.find((item) => item.id === selectedIncidentId) ?? null;
  }, [reports, selectedIncidentId]);

  const openReportModal = (coordinate: Coordinate) => {
    setDraftCoordinate(coordinate);
    setIsReportModalVisible(true);
  };

  const closeReportModal = () => {
    setIsReportModalVisible(false);
    setDraftCoordinate(null);
  };

  const handleReportSuccess = () => {
    setDraftCoordinate(null);
  };

  const openThreadModal = (incident: IncidentReport) => {
    setSelectedIncidentId(incident.id);
    setIsThreadModalVisible(true);
  };

  const closeThreadModal = () => {
    setIsThreadModalVisible(false);
    setSelectedIncidentId(null);
  };

  const openVerifyModal = (incident: IncidentReport) => {
    setSelectedVerifyIncident(incident);
    setIsVerifyModalVisible(true);
  };

  const closeVerifyModal = () => {
    setIsVerifyModalVisible(false);
    setSelectedVerifyIncident(null);
  };

  const openResolveModal = (incident: IncidentReport) => {
    setSelectedResolveIncident(incident);
    setIsResolveModalVisible(true);
  };

  const closeResolveModal = () => {
    setIsResolveModalVisible(false);
    setSelectedResolveIncident(null);
  };

  return {
    draftCoordinate,
    selectedIncident,
    selectedResolveIncident,
    selectedVerifyIncident,

    isReportModalVisible,
    isThreadModalVisible,
    isResolveModalVisible,
    isVerifyModalVisible,

    openReportModal,
    closeReportModal,
    handleReportSuccess,

    openThreadModal,
    closeThreadModal,

    openVerifyModal,
    closeVerifyModal,

    openResolveModal,
    closeResolveModal,
  };
};