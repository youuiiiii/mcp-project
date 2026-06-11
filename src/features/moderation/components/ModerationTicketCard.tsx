import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, View } from "react-native";

import AppButton from "../../../components/ui/AppButton";
import AppCard from "../../../components/ui/AppCard";
import StatusBadge from "../../../components/ui/StatusBadge";
import { colors } from "../../../theme/colors";
import { getIncidentConfidenceMeta } from "../../../utils/incidentConfidence";
import type {
  IncidentContentReport,
  IncidentReport,
} from "../../../types/incident";
import { getReasonIcon, getReasonLabel } from "../moderationLabels";
import { moderationStyles as styles } from "../moderationStyles";

export function ModerationTicketCard({
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
  const confidence = incident ? getIncidentConfidenceMeta(incident) : null;

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

              {confidence ? (
                <>
                  <StatusBadge
                    label={`Trust ${confidence.score}`}
                    variant={
                      confidence.score >= 70
                        ? "success"
                        : confidence.score >= 40
                          ? "warning"
                          : "danger"
                    }
                    size="sm"
                  />

                  <StatusBadge
                    label={`Review ${confidence.reviewPriorityScore}`}
                    variant={
                      confidence.reviewPriorityScore >= 70
                        ? "danger"
                        : confidence.reviewPriorityScore >= 40
                          ? "warning"
                          : "neutral"
                    }
                    size="sm"
                  />
                </>
              ) : null}
            </View>

            {confidence ? (
              <View style={styles.confidenceBox}>
                <Text style={styles.confidenceLabel}>{confidence.reviewLabel}</Text>
                <Text style={styles.confidenceText}>
                  {confidence.reviewDescription}
                </Text>
                <View style={styles.progressBarRow}>
                  <Text style={styles.progressLabel}>📍 Lokasi</Text>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${confidence.components.location.score}%`, backgroundColor: colors.success }]} />
                  </View>
                  <Text style={styles.progressValue}>{confidence.components.location.score}%</Text>
                </View>
                <View style={styles.progressBarRow}>
                  <Text style={styles.progressLabel}>👥 Komunitas</Text>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${confidence.components.community.score}%`, backgroundColor: colors.info }]} />
                  </View>
                  <Text style={styles.progressValue}>{confidence.components.community.score}%</Text>
                </View>
                <View style={styles.progressBarRow}>
                  <Text style={styles.progressLabel}>📸 Bukti</Text>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${confidence.components.evidence.score}%`, backgroundColor: colors.warning }]} />
                  </View>
                  <Text style={styles.progressValue}>{confidence.components.evidence.score}%</Text>
                </View>
              </View>
            ) : null}
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
