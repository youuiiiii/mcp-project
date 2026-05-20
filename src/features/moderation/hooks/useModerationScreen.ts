import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

import { useAuth } from "../../../contexts/AuthContext";
import {
  dismissIncidentContentReport,
  hideIncidentReport,
  markIncidentContentReportReviewed,
  subscribeToIncidents,
  subscribeToOpenContentReports,
} from "../../../services/incidentService";
import type {
  IncidentContentReport,
  IncidentReport,
} from "../../../types/incident";
import { getIncidentReviewPriorityScore } from "../../../utils/incidentConfidence";
import { getReasonLabel } from "../moderationLabels";

export function useModerationScreen() {
  const { user, loading: authLoading, roleLoading, isModerator } = useAuth();

  const [contentReports, setContentReports] = useState<
    IncidentContentReport[]
  >([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingIncidents, setLoadingIncidents] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [moderationReason, setModerationReason] = useState("");

  useEffect(() => {
    if (!user || !isModerator) {
      return;
    }

    setLoadingReports(true);
    setLoadingIncidents(true);

    const unsubscribeContentReports = subscribeToOpenContentReports(
      (items) => {
        setContentReports(items);
        setLoadingReports(false);
        setErrorMessage(null);
      },
      (error) => {
        setErrorMessage(error.message || "Could not load moderation queue.");
        setLoadingReports(false);
      }
    );

    const unsubscribeIncidents = subscribeToIncidents(
      (items) => {
        setIncidents(items);
        setLoadingIncidents(false);
      },
      (error) => {
        setErrorMessage(error.message || "Could not load incident data.");
        setLoadingIncidents(false);
      }
    );

    return () => {
      unsubscribeContentReports();
      unsubscribeIncidents();
    };
  }, [user, isModerator]);

  const incidentById = useMemo(() => {
    return incidents.reduce<Record<string, IncidentReport>>((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  }, [incidents]);

  const sortedContentReports = useMemo(() => {
    return [...contentReports].sort((first, second) => {
      const firstIncident = incidentById[first.reportId];
      const secondIncident = incidentById[second.reportId];

      const firstPriority = firstIncident
        ? getIncidentReviewPriorityScore(firstIncident)
        : 100;
      const secondPriority = secondIncident
        ? getIncidentReviewPriorityScore(secondIncident)
        : 100;

      if (secondPriority !== firstPriority) {
        return secondPriority - firstPriority;
      }

      const firstCreatedAt = first.createdAt?.getTime() ?? 0;
      const secondCreatedAt = second.createdAt?.getTime() ?? 0;

      return secondCreatedAt - firstCreatedAt;
    });
  }, [contentReports, incidentById]);

  const checkingAccess = authLoading || roleLoading;
  const loading = checkingAccess || loadingReports || loadingIncidents;

  const reviewer = user?.email ?? user?.uid ?? "moderator";

  const handleDismiss = (ticket: IncidentContentReport) => {
    Alert.alert(
      "Dismiss Content Report",
      "This ticket will be marked as no action needed. The content remains public.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Dismiss",
          style: "destructive",
          onPress: async () => {
            try {
              setSelectedTicketId(ticket.id);

              await dismissIncidentContentReport({
                contentReportId: ticket.id,
                reviewedBy: reviewer,
              });

              Alert.alert("Done", "Ticket dismissed successfully.");
            } catch (error) {
              Alert.alert(
                "Could Not Dismiss",
                error instanceof Error
                  ? error.message
                  : "Something went wrong while dismissing the ticket."
              );
            } finally {
              setSelectedTicketId(null);
            }
          },
        },
      ]
    );
  };

  const handleHide = (ticket: IncidentContentReport) => {
    const incident = incidentById[ticket.reportId];

    if (!incident) {
      Alert.alert(
        "Incident Not Found",
        "The target content was not found or is no longer visible."
      );
      return;
    }

    const finalReason =
      moderationReason.trim() ||
      `${getReasonLabel(ticket.reason)}${
        ticket.note ? ` - ${ticket.note.trim()}` : ""
      }`;

    Alert.alert(
      "Hide Report",
      "This report will be hidden from Map and Home. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Hide",
          style: "destructive",
          onPress: async () => {
            try {
              setSelectedTicketId(ticket.id);

              await hideIncidentReport({
                reportId: ticket.reportId,
                reason: finalReason,
                moderatedBy: reviewer,
              });

              await markIncidentContentReportReviewed({
                contentReportId: ticket.id,
                reviewedBy: reviewer,
              });

              setModerationReason("");

              Alert.alert("Hidden", "The report was hidden successfully.");
            } catch (error) {
              Alert.alert(
                "Could Not Hide",
                error instanceof Error
                  ? error.message
                  : "Something went wrong while hiding the report."
              );
            } finally {
              setSelectedTicketId(null);
            }
          },
        },
      ]
    );
  };

  return {
    user,
    isModerator,
    checkingAccess,
    loading,
    errorMessage,
    contentReports: sortedContentReports,
    incidentById,
    selectedTicketId,
    moderationReason,
    setModerationReason,
    handleDismiss,
    handleHide,
  };
}
