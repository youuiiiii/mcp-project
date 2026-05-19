import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

import AppButton from "../../components/ui/AppButton";
import AppCard from "../../components/ui/AppCard";
import AppScreen from "../../components/ui/AppScreen";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";
import SectionHeader from "../../components/ui/SectionHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { useAuth } from "../../contexts/AuthContext";
import {
  dismissIncidentContentReport,
  hideIncidentReport,
  markIncidentContentReportReviewed,
  subscribeToIncidents,
  subscribeToOpenContentReports,
} from "../../services/incidentService";
import { colors } from "../../theme/colors";
import { radius, shadow, spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";
import type {
  IncidentContentReport,
  IncidentContentReportReason,
  IncidentReport,
} from "../../types/incident";

const HOME_ROUTE = "/(tabs)" as Href;

export default function ModerationScreen() {
  const router = useRouter();
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

  if (checkingAccess) {
    return (
      <AppScreen scroll={false} contentContainerStyle={styles.centerContent}>
        <LoadingState message="Checking moderator access..." />
      </AppScreen>
    );
  }

  if (!user || !isModerator) {
    return (
      <AppScreen contentContainerStyle={styles.content}>
        <AppCard style={styles.accessCard}>
          <Ionicons name="lock-closed" size={32} color={colors.danger} />

          <Text style={styles.accessTitle}>Moderator Access Required</Text>

          <Text style={styles.accessDescription}>
            This page is only for moderators who review community content.
          </Text>

          <AppButton
            title="Back to Home"
            variant="secondary"
            size="md"
            onPress={() => router.replace(HOME_ROUTE)}
          />
        </AppCard>
      </AppScreen>
    );
  }

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <StatusBadge label="Moderator" variant="info" size="sm" />

        <Text style={styles.title}>Moderation Queue</Text>

        <Text style={styles.subtitle}>
          Review community content reports. Hide only content that is clearly
          problematic.
        </Text>
      </View>

      {errorMessage ? (
        <AppCard variant="muted" style={styles.errorCard}>
          <Ionicons name="warning" size={18} color={colors.danger} />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </AppCard>
      ) : null}

      <View style={styles.section}>
        <SectionHeader
          title="Open Tickets"
          subtitle={`${contentReports.length} content reports need review.`}
        />

        {loading ? (
          <AppCard style={styles.loadingCard}>
            <LoadingState message="Loading moderation queue..." />
          </AppCard>
        ) : null}

        {!loading && contentReports.length === 0 ? (
          <EmptyState
            iconName="shield-checkmark-outline"
            title="Queue empty"
            message="No content reports need review right now."
          />
        ) : null}

        {!loading && contentReports.length > 0 ? (
          <View style={styles.ticketList}>
            {contentReports.map((ticket) => {
              const incident = incidentById[ticket.reportId];

              return (
                <ModerationTicketCard
                  key={ticket.id}
                  ticket={ticket}
                  incident={incident}
                  busy={selectedTicketId === ticket.id}
                  reasonValue={moderationReason}
                  onChangeReason={setModerationReason}
                  onDismiss={() => handleDismiss(ticket)}
                  onHide={() => handleHide(ticket)}
                />
              );
            })}
          </View>
        ) : null}
      </View>
    </AppScreen>
  );
}

function ModerationTicketCard({
  ticket,
  incident,
  busy,
  reasonValue,
  onChangeReason,
  onDismiss,
  onHide,
}: {
  ticket: IncidentContentReport;
  incident?: IncidentReport;
  busy: boolean;
  reasonValue: string;
  onChangeReason: (value: string) => void;
  onDismiss: () => void;
  onHide: () => void;
}) {
  return (
    <AppCard style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <View style={styles.reasonIcon}>
          <Ionicons
            name={getReasonIcon(ticket.reason)}
            size={20}
            color={colors.danger}
          />
        </View>

        <View style={styles.ticketTitleGroup}>
          <Text style={styles.ticketTitle}>{getReasonLabel(ticket.reason)}</Text>

          <Text style={styles.ticketMeta} numberOfLines={1}>
            Reported by {ticket.userName || ticket.userEmail || "Anonymous"}
          </Text>
        </View>

        <StatusBadge label="Open" variant="warning" size="sm" />
      </View>

      {ticket.note ? (
        <View style={styles.noteBox}>
          <Text style={styles.noteLabel}>Reporter note</Text>
          <Text style={styles.noteText}>{ticket.note}</Text>
        </View>
      ) : null}

      <View style={styles.previewBox}>
        <Text style={styles.previewLabel}>Reported content</Text>

        {incident ? (
          <>
            <Text style={styles.previewTitle} numberOfLines={2}>
              {incident.title}
            </Text>

            <Text style={styles.previewDescription} numberOfLines={3}>
              {incident.description || "No description provided."}
            </Text>

            <View style={styles.previewMetaRow}>
              <StatusBadge
                label={incident.status}
                variant={incident.status === "active" ? "active" : "resolved"}
                size="sm"
              />

              <StatusBadge
                label={`Urgency ${incident.urgencyScore ?? incident.urgencyLevel ?? incident.severity}`}
                variant={
                  (incident.urgencyLevel ?? incident.severity) === "high"
                    ? "danger"
                    : (incident.urgencyLevel ?? incident.severity) === "medium"
                      ? "warning"
                      : "success"
                }
                size="sm"
              />
            </View>
          </>
        ) : (
          <Text style={styles.previewMissing}>
            Content was not found or has already been hidden.
          </Text>
        )}
      </View>

      <TextInput
        value={reasonValue}
        onChangeText={onChangeReason}
        editable={!busy}
        placeholder="Moderator reason, optional..."
        placeholderTextColor={colors.textSoft}
        multiline
        style={styles.reasonInput}
      />

      <View style={styles.actionRow}>
        <AppButton
          title="Dismiss"
          variant="secondary"
          size="md"
          disabled={busy}
          onPress={onDismiss}
          style={styles.actionButton}
        />

        <AppButton
          title="Hide"
          variant="danger"
          size="md"
          loading={busy}
          disabled={busy || !incident}
          onPress={onHide}
          style={styles.actionButton}
        />
      </View>
    </AppCard>
  );
}

function getReasonLabel(reason: IncidentContentReportReason) {
  const labels: Record<IncidentContentReportReason, string> = {
    false_information: "False information",
    harmful_content: "Harmful content",
    spam: "Spam",
    privacy_issue: "Privacy issue",
    inappropriate_image: "Inappropriate photo",
    other: "Other",
  };

  return labels[reason];
}

function getReasonIcon(reason: IncidentContentReportReason) {
  const icons: Record<
    IncidentContentReportReason,
    keyof typeof Ionicons.glyphMap
  > = {
    false_information: "alert-circle-outline",
    harmful_content: "warning-outline",
    spam: "ban-outline",
    privacy_issue: "lock-closed-outline",
    inappropriate_image: "image-outline",
    other: "ellipsis-horizontal-circle-outline",
  };

  return icons[reason];
}

const styles = StyleSheet.create({
  centerContent: {
    justifyContent: "center",
  },
  content: {
    gap: spacing["2xl"],
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  section: {
    gap: spacing.md,
  },
  loadingCard: {
    minHeight: 120,
    justifyContent: "center",
  },
  accessCard: {
    alignItems: "center",
    gap: spacing.md,
  },
  accessTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },
  accessDescription: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.dangerSoft,
    borderColor: "#FECACA",
  },
  errorText: {
    flex: 1,
    ...typography.caption,
    color: colors.primaryDark,
  },
  ticketList: {
    gap: spacing.md,
  },
  ticketCard: {
    gap: spacing.md,
  },
  ticketHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  reasonIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.lg,
    backgroundColor: colors.dangerSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  ticketTitleGroup: {
    flex: 1,
  },
  ticketTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  ticketMeta: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
  },
  noteBox: {
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
  },
  noteLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
  },
  noteText: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
    color: "#475569",
  },
  previewBox: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
  },
  previewTitle: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  previewDescription: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
    color: "#475569",
  },
  previewMetaRow: {
    marginTop: spacing.sm,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  previewMissing: {
    marginTop: 6,
    ...typography.caption,
    color: colors.textMuted,
  },
  reasonInput: {
    minHeight: 76,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
    color: colors.text,
    textAlignVertical: "top",
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  logoutButton: {
    ...shadow.floating,
  },
});
