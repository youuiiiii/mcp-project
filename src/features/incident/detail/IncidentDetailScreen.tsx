import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import ResolveIncidentModal from "../../../components/ResolveIncidentModal";
import VerifyIncidentModal from "../../../components/VerifyIncidentModal";
import AppScreen from "../../../components/ui/AppScreen";
import LoadingState from "../../../components/ui/LoadingState";
import { getIncidentDisplayMeta } from "../../../constants/incident";
import { useAuth } from "../../../contexts/AuthContext";
import { useI18n } from "../../../i18n";
import { createIncidentContentReport, subscribeToIncident } from "../../../services/incidentService";
import { colors } from "../../../theme/colors";
import { radius, shadow, spacing } from "../../../theme/layout";
import type {
  IncidentContentReportReason,
  IncidentReport,
} from "../../../types/incident";
import { shareIncident } from "../../../utils/shareIncident";
import IncidentImageGallery from "../components/IncidentImageGallery";
import IncidentAccuracyPanel from "../thread/IncidentAccuracyPanel";
import IncidentDiscussionList from "../thread/IncidentDiscussionList";
import IncidentReplyComposer from "../thread/IncidentReplyComposer";
import IncidentTimeline from "../thread/IncidentTimeline";
import IncidentVoteFeedbackModal from "../thread/IncidentVoteFeedbackModal";
import ReportContentModal from "../thread/ReportContentModal";
import { formatIncidentDate } from "../thread/threadLabels";
import { useIncidentThread } from "../thread/useIncidentThread";

export default function IncidentDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const reportId = Array.isArray(id) ? id[0] : id;
  const { user, isModerator } = useAuth();
  const { t, language } = useI18n();

  const [incident, setIncident] = useState<IncidentReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [verifyVisible, setVerifyVisible] = useState(false);
  const [resolveVisible, setResolveVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] =
    useState<IncidentContentReportReason | null>(null);
  const [reportNote, setReportNote] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  useEffect(() => {
    if (!reportId) {
      setIncident(null);
      setErrorMessage("Incident id was not found.");
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = subscribeToIncident(
      reportId,
      (item) => {
        setIncident(item);
        setErrorMessage(item ? null : "Incident was not found or is hidden.");
        setLoading(false);
      },
      (error) => {
        setErrorMessage(error.message || "Could not load incident detail.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [reportId]);

  const thread = useIncidentThread({
    visible: Boolean(incident),
    incident,
    onClose: () => router.back(),
  });

  const meta = useMemo(() => {
    if (!incident) return null;
    return getIncidentDisplayMeta({
      category: incident.category,
      subcategory: incident.subcategory ?? incident.type,
    });
  }, [incident]);

  const status = incident ? getIncidentStatusMeta(incident) : null;
  const severity = incident ? getSeverityLabel(incident) : "Low";
  const totalReports = incident
    ? Math.max(
        1,
        (incident.verificationCount ?? 0) +
          (incident.replyCount ?? 0) +
          (incident.evidenceCount ?? 0)
      )
    : 0;
  const responders = incident
    ? Math.max(
        0,
        (incident.accurateCount ?? 0) +
          (incident.verificationCount ?? 0) -
          (incident.disputeCount ?? 0)
      )
    : 0;

  const handleShare = () => {
    if (!incident) return;

    shareIncident({
      type: incident.title,
      description: incident.description,
      location: {
        lat: incident.latitude,
        lng: incident.longitude,
      },
      createdAt: incident.createdAt,
    });
  };

  const openReportContentModal = () => {
    setSelectedReason(null);
    setReportNote("");
    setReportModalVisible(true);
  };

  const closeReportContentModal = () => {
    if (reportSubmitting) return;
    setReportModalVisible(false);
    setSelectedReason(null);
    setReportNote("");
  };

  const submitContentReport = async () => {
    try {
      if (!incident) return;

      if (!user) {
        Alert.alert(
          t("incident.alert.loginRequired.title"),
          t("incident.alert.loginRequired.message")
        );
        return;
      }

      if (!selectedReason) {
        Alert.alert(
          t("incident.alert.reasonRequired.title"),
          t("incident.alert.reasonRequired.message")
        );
        return;
      }

      const actorKey = user.uid || user.email;

      if (!actorKey) {
        Alert.alert(
          t("incident.alert.invalidIdentity.title"),
          t("incident.alert.invalidIdentity.message")
        );
        return;
      }

      setReportSubmitting(true);

      await createIncidentContentReport({
        targetType: "incident_report",
        targetId: incident.id,
        reportId: incident.id,
        reason: selectedReason,
        note: reportNote,
        actorKey,
        userName: user.displayName ?? user.email ?? "Anonymous",
        userEmail: user.email ?? null,
      });

      setReportModalVisible(false);
      setSelectedReason(null);
      setReportNote("");

      Alert.alert(
        t("incident.alert.reportSubmitted.title"),
        t("incident.alert.reportSubmitted.message")
      );
    } catch (error) {
      Alert.alert(
        t("incident.alert.reportFailed.title"),
        error instanceof Error
          ? error.message
          : t("incident.alert.reportFailed.message")
      );
    } finally {
      setReportSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppScreen scroll={false} contentContainerStyle={styles.loadingContainer}>
        <LoadingState message={t("incident.loading")} />
      </AppScreen>
    );
  }

  if (!incident || !meta || !status) {
    return (
      <AppScreen withPadding={false} contentContainerStyle={styles.emptyContent}>
        <LinearGradient
          colors={[colors.primaryDark, "#0FB8D0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.emptyHero}
        >
          <BackButton t={t} />
          <Text style={styles.emptyTitle}>{t("incident.unavailable.title")}</Text>
        </LinearGradient>

        <View style={styles.emptyBody}>
          <Text style={styles.emptyMessage}>
            {errorMessage ?? t("incident.unavailable.desc")}
          </Text>
        </View>
      </AppScreen>
    );
  }

  const address =
    incident.address ||
    `${incident.latitude.toFixed(4)}, ${incident.longitude.toFixed(4)}`;

  return (
    <>
      <AppScreen
        withPadding={false}
        keyboardAvoiding
        contentContainerStyle={styles.content}
      >
        <LinearGradient
          colors={[colors.primaryDark, "#0FB8D0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroTopRow}>
            <BackButton t={t} />
            <Pressable onPress={handleShare} style={({ pressed }) => [styles.heroIconButton, pressed && styles.actionPressed]}>
              <Ionicons name="share-social-outline" size={22} color={colors.textInverse} />
            </Pressable>
          </View>

          <View style={styles.heroTitleRow}>
            <View style={[styles.heroIcon, { backgroundColor: meta.lightColor }]}>
              <Ionicons name={meta.iconName} size={31} color={meta.color} />
            </View>

            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle} numberOfLines={2}>
                {incident.title || t(meta.shortLabel as any) || t("incident.defaultTitle")}
              </Text>
              
              <View style={styles.heroLocationRow}>
                <Ionicons name="location" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.heroLocationText} numberOfLines={1}>{address}</Text>
              </View>

              <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
                <Text style={[styles.statusText, { color: status.fg }]}>
                  {status.label}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <IncidentImageGallery
          imageUri={incident.imageUri}
          imageUris={incident.imageUris}
          style={styles.fullBleedGallery}
        />

        <View style={styles.body}>
          <View style={styles.metricsRow}>
            <MetricItem icon="warning-outline" value={t("incident.meta.severity", { severity })} />
            <MetricItem icon="flag-outline" value={t("incident.meta.reports", { count: totalReports })} />
            <MetricItem icon="people-outline" value={t("incident.meta.responders", { count: responders })} />
          </View>

          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={14} color={colors.textSoft} />
            <Text style={styles.timeText}>
              {t("incident.meta.reportedAt", { time: formatRelativeTime(incident.createdAt, t), date: formatIncidentDate(incident.createdAt, t, language as any) })}
            </Text>
          </View>

          <Text style={styles.description}>
            {cleanDescription(incident.description) || t("incident.meta.noDescription")}
          </Text>



          {incident.status === "active" ? (
            <Pressable
              onPress={() => setVerifyVisible(true)}
              style={({ pressed }) => [
                styles.primaryAction,
                pressed && styles.actionPressed,
              ]}
            >
              <Ionicons name="shield-checkmark" size={20} color={colors.textInverse} />
              <Text style={styles.primaryActionText}>
                {t("incident.action.verify")}
              </Text>
              <View style={styles.gamificationBadge}>
                <Text style={styles.gamificationText}>+5 Pts</Text>
              </View>
            </Pressable>
          ) : null}

          {isModerator ? (
            <View style={styles.quickActions}>
              <ActionChip
                icon="checkmark-done-outline"
                label={t("incident.action.markResolved")}
                onPress={() => setResolveVisible(true)}
              />
            </View>
          ) : null}

          <View style={styles.threadBlock}>
            <Text style={styles.sectionTitle}>{t("incident.section.updates")}</Text>

            <IncidentTimeline
              incident={incident}
              verifications={thread.verifications}
              replies={thread.replies}
            />

            <IncidentAccuracyPanel
              accurateCount={thread.accuracySummary.accurateCount}
              inaccurateCount={thread.accuracySummary.inaccurateCount}
              currentUserVote={thread.accuracySummary.currentUserVote}
              disabledReason={
                thread.isOwnIncident
                  ? t("incident.accuracy.disabledReason")
                  : null
              }
              label={thread.accuracySummary.label}
              tone={thread.accuracySummary.tone}
              submitting={thread.accuracySubmitting}
              onVote={thread.submitAccuracy}
            />

            <IncidentDiscussionList
              replies={thread.replies}
              loading={thread.loadingThread}
              onReplyTo={thread.startReplyTo}
            />

            <IncidentReplyComposer
              replyText={thread.replyText}
              replyImageUri={thread.replyImageUri}
              replyingTo={thread.replyingTo}
              replySubmitting={thread.replySubmitting}
              replyIsValid={thread.replyIsValid}
              onChangeReplyText={thread.setReplyText}
              onTakePhoto={thread.takeReplyPhoto}
              onPickImage={thread.pickReplyImage}
              onRemoveImage={thread.removeReplyImage}
              onCancelReplyTo={thread.cancelReplyTo}
              onSubmitReply={thread.submitReply}
            />
          </View>

          <Pressable onPress={openReportContentModal} style={styles.reportFalseButton}>
            <Ionicons name="flag" size={14} color={colors.danger} />
            <Text style={styles.reportFalseText}>{t("incident.action.reportFalse")}</Text>
          </Pressable>
        </View>
      </AppScreen>

      <VerifyIncidentModal
        visible={verifyVisible}
        incident={incident}
        onClose={() => setVerifyVisible(false)}
      />

      <ResolveIncidentModal
        visible={resolveVisible}
        incident={incident}
        onClose={() => setResolveVisible(false)}
      />

      <ReportContentModal
        visible={reportModalVisible}
        selectedReason={selectedReason}
        note={reportNote}
        submitting={reportSubmitting}
        onSelectReason={setSelectedReason}
        onChangeNote={setReportNote}
        onSubmit={submitContentReport}
        onClose={closeReportContentModal}
      />

      <IncidentVoteFeedbackModal
        visible={thread.voteFeedbackStatus !== "idle"}
        status={thread.voteFeedbackStatus}
        message={thread.voteFeedbackMessage}
        onClose={thread.closeVoteFeedback}
        onOpenSettings={thread.openLocationSettings}
      />
    </>
  );
}

function BackButton({ t }: { t: any }) {
  return (
    <Pressable
      onPress={() => router.back()}
      style={({ pressed }) => [styles.backButton, pressed && styles.actionPressed]}
    >
      <Ionicons name="chevron-back" size={22} color={colors.textInverse} />
      <Text style={styles.backText}>{t("common.back")}</Text>
    </Pressable>
  );
}

function MetricItem({ icon, value }: { icon: keyof typeof Ionicons.glyphMap; value: string }) {
  return (
    <View style={styles.metricItem}>
      <Ionicons name={icon} size={14} color={colors.textSoft} />
      <Text style={styles.metricItemValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function ActionChip({
  icon,
  label,
  tone = "default",
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  tone?: "default" | "danger";
  onPress: () => void;
}) {
  const danger = tone === "danger";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionChip,
        danger && styles.actionChipDanger,
        pressed && styles.actionPressed,
      ]}
    >
      <Ionicons
        name={icon}
        size={16}
        color={danger ? colors.danger : colors.primary}
      />
      <Text style={[styles.actionChipText, danger && styles.actionChipTextDanger]}>
        {label}
      </Text>
    </Pressable>
  );
}

function getIncidentStatusMeta(incident: IncidentReport) {
  if (incident.status === "resolved") {
    return {
      label: "Resolved",
      bg: colors.successSoft,
      fg: colors.successDark,
    };
  }

  if (
    incident.verificationStatus === "pending" ||
    incident.trustStatus === "questioned" ||
    (incident.conditionUpdateCount ?? 0) > 0
  ) {
    return {
      label: "Monitoring",
      bg: colors.warningSoft,
      fg: colors.warningDark,
    };
  }

  return {
    label: "Active",
    bg: colors.dangerSoft,
    fg: colors.dangerDark,
  };
}

function getSeverityLabel(incident: IncidentReport) {
  const level = incident.urgencyLevel ?? incident.severity;
  if (level === "high") return "High";
  if (level === "medium") return "Medium";
  return "Low";
}

function cleanDescription(description?: string) {
  if (!description) return "";

  if (
    description.includes("reported near the selected map pin") ||
    description.includes("No additional impact")
  ) {
    return "";
  }

  return description.trim();
}

function formatRelativeTime(date: Date | undefined, t: any): string {
  if (!date) return t("common.time.unknown");

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return t("common.time.minutesAgo", { min: diffMinutes });
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return t("common.time.hoursAgo", { hour: diffHours });
  }

  const diffDays = Math.floor(diffHours / 24);
  return t("common.time.daysAgo", { day: diffDays });
}

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
  },
  content: {
    paddingBottom: 116,
    backgroundColor: colors.surface,
  },
  hero: {
    minHeight: 164,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingVertical: 4,
  },
  backText: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.textInverse,
  },
  heroIconButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  heroCopy: {
    flex: 1,
    minWidth: 0,
    alignItems: "flex-start",
  },
  heroTitle: {
    fontSize: 21,
    lineHeight: 26,
    fontWeight: "900",
    color: colors.textInverse,
  },
  heroLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  heroLocationText: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  statusPill: {
    marginTop: 8,
    borderRadius: radius.full,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },
  body: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  fullBleedGallery: {
    width: "100%",
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "500",
    color: colors.text,
  },
  metricsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricItemValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMuted,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSoft,
  },
  primaryAction: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderRadius: radius["2xl"],
    backgroundColor: "#0EAFC8",
    paddingHorizontal: spacing.md,
  },
  primaryActionText: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.textInverse,
  },
  gamificationBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    marginLeft: 4,
  },
  gamificationText: {
    fontSize: 10,
    fontWeight: "900",
    color: colors.textInverse,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  actionChip: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: "rgba(14,165,233,0.22)",
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  actionChipDanger: {
    borderColor: "rgba(239,68,68,0.22)",
    backgroundColor: colors.dangerSoft,
  },
  actionChipText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primary,
  },
  actionChipTextDanger: {
    color: colors.danger,
  },
  actionPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  threadBlock: {
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
  },
  reportFalseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
  },
  reportFalseText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.danger,
    textDecorationLine: "underline",
  },
  emptyContent: {
    backgroundColor: colors.background,
  },
  emptyHero: {
    minHeight: 150,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    justifyContent: "space-between",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.textInverse,
  },
  emptyBody: {
    padding: spacing.xl,
  },
  emptyMessage: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "600",
    color: colors.textMuted,
  },
});
