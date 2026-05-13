import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  getIncidentCategoryMeta,
  getIncidentDisplayMeta,
  getIncidentMeta,
} from "../constants/incident";
import { useAuth } from "../contexts/AuthContext";
import {
  createIncidentReply,
  reopenIncidentReport,
  subscribeToIncidentReplies,
  subscribeToIncidentVerifications,
} from "../services/incidentService";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/layout";
import { typography } from "../theme/typography";
import {
  IncidentConditionStatus,
  IncidentReply,
  IncidentReport,
  IncidentVerification,
} from "../types/incident";
import { getIncidentExpiryMessage } from "../utils/incidentExpiry";
import IncidentTrustBadge from "./IncidentTrustBadge";
import IncidentUrgencyBadge from "./IncidentUrgencyBadge";
import AppButton from "./ui/AppButton";
import AppCard from "./ui/AppCard";
import IconBadge from "./ui/IconBadge";
import LoadingState from "./ui/LoadingState";
import SectionHeader from "./ui/SectionHeader";
import StatusBadge, { StatusBadgeVariant } from "./ui/StatusBadge";

type AppIconName = keyof typeof Ionicons.glyphMap;

type IncidentThreadModalProps = {
  visible: boolean;
  incident: IncidentReport | null;
  onClose: () => void;
  onOpenVerify: (incident: IncidentReport) => void;
  onOpenResolve: (incident: IncidentReport) => void;
};

type TimelineKind = "report" | "verification" | "reply" | "resolved";

type TimelineItem = {
  id: string;
  kind: TimelineKind;
  date?: Date;
  title: string;
  message: string;
  imageUri?: string | null;
  author?: string | null;
  color: string;
  badgeLabel: string;
  conditionLabel?: string;
};

export default function IncidentThreadModal({
  visible,
  incident,
  onClose,
  onOpenVerify,
  onOpenResolve,
}: IncidentThreadModalProps) {
  const { user } = useAuth();

  const [verifications, setVerifications] = useState<IncidentVerification[]>(
    []
  );
  const [replies, setReplies] = useState<IncidentReply[]>([]);
  const [replyText, setReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);

  const actorKey = user?.email ?? user?.uid ?? null;

  const meta = incident
    ? getIncidentDisplayMeta({
      category: incident.category,
      subcategory: incident.subcategory ?? incident.type,
    })
    : null;

  const categoryMeta = incident
    ? getIncidentCategoryMeta(incident.category)
    : null;

  useEffect(() => {
    if (!visible || !incident) {
      setVerifications([]);
      setReplies([]);
      return;
    }

    setLoadingThread(true);

    const unsubscribeVerifications = subscribeToIncidentVerifications(
      incident.id,
      (items) => {
        setVerifications(items);
        setLoadingThread(false);
      },
      (error) => {
        console.error("Thread verifications error:", error);
        setLoadingThread(false);
      }
    );

    const unsubscribeReplies = subscribeToIncidentReplies(
      incident.id,
      (items) => {
        setReplies(items);
      },
      (error) => {
        console.error("Thread replies error:", error);
      }
    );

    return () => {
      unsubscribeVerifications();
      unsubscribeReplies();
    };
  }, [visible, incident]);

  const isOwnIncident = useMemo(() => {
    if (!incident || !actorKey) {
      return false;
    }

    return (
      incident.reporterEmail === actorKey || incident.reportedBy === actorKey
    );
  }, [incident, actorKey]);

  const hasUserVerified = useMemo(() => {
    if (!actorKey) {
      return false;
    }

    return verifications.some((item) => {
      return (
        item.actorKey === actorKey &&
        (item.verificationType === "valid" ||
          item.verificationType === "invalid")
      );
    });
  }, [verifications, actorKey]);

  const timelineItems = useMemo<TimelineItem[]>(() => {
    if (!incident || !meta) {
      return [];
    }

    const items: TimelineItem[] = [
      {
        id: `report-${incident.id}`,
        kind: "report",
        date: incident.createdAt,
        title: "Laporan awal dibuat",
        message: incident.description,
        imageUri: incident.imageUri,
        author: incident.reportedBy || incident.reporterEmail || "Anonymous",
        color: meta.color,
        badgeLabel: "Report",
      },
    ];

    verifications.forEach((item) => {
      const color = getVerificationColor(item.verificationType);

      items.push({
        id: `verification-${item.id}`,
        kind: "verification",
        date: item.createdAt,
        title: getVerificationLabel(item.verificationType),
        message: item.note,
        imageUri: item.imageUri,
        author: item.userName || item.userEmail || "Anonymous",
        color,
        badgeLabel: getVerificationLabel(item.verificationType),
        conditionLabel: getConditionLabel(item.conditionStatus),
      });
    });

    replies.forEach((item) => {
      items.push({
        id: `reply-${item.id}`,
        kind: "reply",
        date: item.createdAt,
        title: "Diskusi / Informasi Tambahan",
        message: item.message,
        author: item.userName || item.userEmail || "Anonymous",
        color: colors.info,
        badgeLabel: "Reply",
      });
    });

    if (incident.status === "resolved" && incident.resolvedAt) {
      items.push({
        id: `resolved-${incident.id}`,
        kind: "resolved",
        date: incident.resolvedAt,
        title: "Incident ditandai selesai",
        message: incident.resolutionNote || "Incident sudah ditandai selesai.",
        imageUri: incident.resolvedImageUri,
        author: incident.resolvedBy || "Anonymous",
        color: colors.textMuted,
        badgeLabel: "Resolved",
      });
    }

    return items.sort((a, b) => {
      const timeA = a.date?.getTime() ?? 0;
      const timeB = b.date?.getTime() ?? 0;

      return timeA - timeB;
    });
  }, [incident, meta, verifications, replies]);

  const replyIsValid = replyText.trim().length >= 3;

  const handleClose = () => {
    setReplyText("");
    onClose();
  };

  const handleSubmitReply = async () => {
    try {
      if (!incident) {
        return;
      }

      if (!user || !actorKey) {
        Alert.alert("Belum Login", "Silakan login untuk ikut diskusi.");
        return;
      }

      const cleanReply = replyText.trim();

      if (!cleanReply) {
        Alert.alert("Pesan Kosong", "Tulis pesan diskusi terlebih dahulu.");
        return;
      }

      if (cleanReply.length < 3) {
        Alert.alert("Pesan Terlalu Pendek", "Pesan minimal 3 karakter.");
        return;
      }

      setReplySubmitting(true);

      await createIncidentReply({
        reportId: incident.id,
        message: cleanReply,
        userName: user.displayName ?? user.email ?? "Anonymous",
        userEmail: user.email ?? null,
        actorKey,
      });

      setReplyText("");

      Haptics.selectionAsync().catch(() => {});
    } catch (error) {
      Alert.alert(
        "Gagal Mengirim Reply",
        error instanceof Error ? error.message : "Gagal menyimpan diskusi."
      );
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleReopen = async () => {
    if (!incident) {
      return;
    }

    try {
      await reopenIncidentReport(incident.id);
      Alert.alert("Incident Aktif Lagi", "Status incident berhasil diaktifkan.");
    } catch (error) {
      Alert.alert(
        "Gagal Update",
        error instanceof Error
          ? error.message
          : "Gagal mengaktifkan ulang incident."
      );
    }
  };

  if (!incident || !meta || !categoryMeta) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.title}>Incident Thread</Text>
                <Text style={styles.subtitle}>
                  Kronologi laporan, bukti verifikasi, update kondisi, dan
                  diskusi warga sekitar.
                </Text>
              </View>

              <AppButton
                title="×"
                variant="secondary"
                size="sm"
                onPress={handleClose}
                style={styles.closeButton}
                textStyle={styles.closeText}
              />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.content}
            >
              <AppCard style={styles.originalCard}>
                <View style={styles.originalHeader}>
                  <IconBadge
                    variant="neutral"
                    size="lg"
                    rounded={false}
                    style={{
                      backgroundColor: meta.lightColor,
                    }}
                  >
                    <Ionicons
                      name={getIncidentIcon(incident)}
                      size={24}
                      color={meta.color}
                    />
                  </IconBadge>

                  <View style={styles.originalInfo}>
                    <Text style={styles.incidentTitle} numberOfLines={2}>
                      {incident.title}
                    </Text>

                    <Text style={styles.incidentType} numberOfLines={1}>
                      {categoryMeta.label} • {meta.label}
                    </Text>
                  </View>

                  <StatusBadge
                    label={getStatusLabel(incident.status)}
                    variant={getStatusVariant(incident.status)}
                    size="sm"
                  />
                </View>

                <Text style={styles.description}>{incident.description}</Text>

                <View style={styles.badgeStack}>
                  <IncidentTrustBadge incident={incident} variant="full" />
                  <IncidentUrgencyBadge incident={incident} variant="full" />
                </View>

                <AppCard variant="muted" padding="sm" style={styles.expiryBox}>
                  <View style={styles.expiryHeader}>
                    <Ionicons
                      name="sync-circle"
                      size={18}
                      color={colors.info}
                    />
                    <Text style={styles.expiryTitle}>
                      Status Update Otomatis
                    </Text>
                  </View>

                  <Text style={styles.expiryText}>
                    {getIncidentExpiryMessage(incident)}
                  </Text>
                </AppCard>

                {incident.imageUri ? (
                  <Image
                    source={{ uri: incident.imageUri }}
                    style={styles.mainImage}
                  />
                ) : null}

                <View style={styles.metaBox}>
                  <InfoLine
                    icon="person"
                    label={`Pelapor: ${incident.reportedBy || "Anonymous"}`}
                  />
                  <InfoLine
                    icon="time"
                    label={`Dibuat: ${formatDate(incident.createdAt)}`}
                  />
                </View>
              </AppCard>

              <View style={styles.summaryGrid}>
                <SummaryCard
                  value={incident.verificationCount ?? 0}
                  label="Benar"
                  icon="checkmark-circle"
                  color={colors.success}
                />

                <SummaryCard
                  value={incident.disputeCount ?? 0}
                  label="Tidak Sesuai"
                  icon="close-circle"
                  color={colors.danger}
                />

                <SummaryCard
                  value={incident.evidenceCount ?? 0}
                  label="Bukti"
                  icon="image"
                  color={colors.info}
                />

                <SummaryCard
                  value={incident.replyCount ?? 0}
                  label="Diskusi"
                  icon="chatbubbles"
                  color={colors.warningDark}
                />
              </View>

              <View style={styles.actions}>
                <AppButton
                  title={
                    isOwnIncident
                      ? "Update Kondisi"
                      : hasUserVerified
                        ? "Update Kondisi"
                        : "Verifikasi / Update"
                  }
                  variant="primary"
                  size="md"
                  onPress={() => onOpenVerify(incident)}
                  fullWidth
                  leftIcon={
                    <Ionicons
                      name="shield-checkmark"
                      size={18}
                      color={colors.textInverse}
                    />
                  }
                  style={styles.primaryAction}
                />

                <AppButton
                  title={
                    incident.status === "active"
                      ? "Tandai Selesai"
                      : "Aktifkan Lagi"
                  }
                  variant="secondary"
                  size="md"
                  onPress={
                    incident.status === "active"
                      ? () => onOpenResolve(incident)
                      : handleReopen
                  }
                  fullWidth
                  leftIcon={
                    <Ionicons
                      name={
                        incident.status === "active"
                          ? "checkmark-done"
                          : "refresh"
                      }
                      size={18}
                      color={colors.text}
                    />
                  }
                  style={styles.secondaryAction}
                />
              </View>

              <View style={styles.section}>
                <SectionHeader
                  title="Timeline Kejadian"
                  subtitle="Semua laporan awal, verifikasi, update kondisi, diskusi, dan penyelesaian ditampilkan secara kronologis."
                  style={styles.sectionHeader}
                />

                {loadingThread ? (
                  <AppCard style={styles.loadingBox}>
                    <LoadingState message="Memuat timeline..." />
                  </AppCard>
                ) : null}

                {!loadingThread && timelineItems.length === 0 ? (
                  <EmptyThreadCard
                    title="Belum ada timeline"
                    message="Timeline akan muncul setelah ada laporan atau update kondisi."
                  />
                ) : (
                  <View style={styles.timelineList}>
                    {timelineItems.map((item, index) => (
                      <TimelineRow
                        key={item.id}
                        item={item}
                        isLast={index === timelineItems.length - 1}
                      />
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.section}>
                <SectionHeader
                  title="Discussion"
                  subtitle="Tambahkan update kondisi, rute alternatif, atau informasi lapangan."
                  style={styles.sectionHeader}
                />

                <AppCard style={styles.replyInputBox}>
                  <TextInput
                    value={replyText}
                    onChangeText={setReplyText}
                    editable={!replySubmitting}
                    placeholder="Tulis update atau diskusi tentang incident..."
                    placeholderTextColor={colors.textSoft}
                    multiline
                    textAlignVertical="top"
                    style={styles.replyInput}
                  />

                  <AppButton
                    title="Kirim Reply"
                    variant="primary"
                    size="md"
                    loading={replySubmitting}
                    disabled={!replyIsValid || replySubmitting}
                    onPress={handleSubmitReply}
                    leftIcon={
                      <Ionicons
                        name="send"
                        size={17}
                        color={colors.textInverse}
                      />
                    }
                  />
                </AppCard>

                {replies.length === 0 ? (
                  <EmptyThreadCard
                    title="Belum ada diskusi"
                    message="Tambahkan update kondisi, rute alternatif, atau informasi lapangan."
                  />
                ) : null}
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function SummaryCard({
  value,
  label,
  icon,
  color,
}: {
  value: number;
  label: string;
  icon: AppIconName;
  color: string;
}) {
  return (
    <AppCard padding="sm" style={styles.summaryCard}>
      <Ionicons name={icon} size={18} color={color} />
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel} numberOfLines={1}>
        {label}
      </Text>
    </AppCard>
  );
}

function InfoLine({ icon, label }: { icon: AppIconName; label: string }) {
  return (
    <View style={styles.infoLine}>
      <Ionicons name={icon} size={14} color={colors.textSoft} />
      <Text style={styles.metaText} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function TimelineRow({
  item,
  isLast,
}: {
  item: TimelineItem;
  isLast: boolean;
}) {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineRail}>
        <View
          style={[
            styles.timelineDot,
            {
              backgroundColor: item.color,
            },
          ]}
        >
          <Ionicons
            name={getTimelineIcon(item.kind)}
            size={14}
            color={colors.textInverse}
          />
        </View>

        {!isLast ? <View style={styles.timelineLine} /> : null}
      </View>

      <AppCard style={styles.timelineCard}>
        <View style={styles.timelineCardHeader}>
          <View
            style={[
              styles.timelineBadge,
              {
                backgroundColor: item.color,
              },
            ]}
          >
            <Text style={styles.timelineBadgeText} numberOfLines={1}>
              {item.badgeLabel}
            </Text>
          </View>

          <Text style={styles.timelineDate} numberOfLines={1}>
            {formatDate(item.date)}
          </Text>
        </View>

        <Text style={styles.timelineTitle}>{item.title}</Text>

        <Text style={styles.timelineAuthor} numberOfLines={1}>
          Oleh: {item.author || "Anonymous"}
        </Text>

        {item.conditionLabel ? (
          <StatusBadge
            label={`Kondisi: ${item.conditionLabel}`}
            variant="neutral"
            size="sm"
            style={styles.conditionPill}
          />
        ) : null}

        <Text style={styles.timelineMessage}>{item.message}</Text>

        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.timelineImage} />
        ) : null}
      </AppCard>
    </View>
  );
}

function EmptyThreadCard({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <AppCard variant="muted" style={styles.emptyBox}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{message}</Text>
    </AppCard>
  );
}

function formatDate(date?: Date) {
  if (!date) {
    return "Waktu tidak tersedia";
  }

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusLabel(status: IncidentReport["status"]) {
  if (status === "active") {
    return "Active";
  }

  if (status === "resolved") {
    return "Resolved";
  }

  return String(status);
}

function getStatusVariant(status: IncidentReport["status"]): StatusBadgeVariant {
  if (status === "active") {
    return "active";
  }

  if (status === "resolved") {
    return "resolved";
  }

  return "neutral";
}

function getVerificationLabel(
  type: IncidentVerification["verificationType"]
) {
  if (type === "valid") {
    return "Benar terjadi";
  }

  if (type === "invalid") {
    return "Tidak sesuai";
  }

  return "Update kondisi";
}

function getVerificationColor(
  type: IncidentVerification["verificationType"]
) {
  if (type === "valid") {
    return colors.success;
  }

  if (type === "invalid") {
    return colors.danger;
  }

  return colors.warning;
}

function getConditionLabel(conditionStatus?: IncidentConditionStatus) {
  if (conditionStatus === "still_happening") {
    return "Masih terjadi";
  }

  if (conditionStatus === "getting_worse") {
    return "Semakin parah";
  }

  if (conditionStatus === "partially_resolved") {
    return "Mulai terkendali";
  }

  if (conditionStatus === "resolved_but_not_closed") {
    return "Tampak selesai";
  }

  if (conditionStatus === "not_found") {
    return "Tidak ditemukan";
  }

  return "Kondisi belum ditentukan";
}

function getTimelineIcon(kind: TimelineKind): AppIconName {
  if (kind === "report") {
    return "document-text";
  }

  if (kind === "verification") {
    return "shield-checkmark";
  }

  if (kind === "reply") {
    return "chatbubble-ellipses";
  }

  return "flag";
}

function getIncidentIcon(report: IncidentReport): AppIconName {
  const type = report.subcategory ?? report.type;

  switch (type) {
    case "flood":
      return "water";

    case "earthquake":
      return "pulse";

    case "landslide":
    case "collapsed_building":
      return "trail-sign";

    case "volcanic_eruption":
      return "flame";

    case "strong_wind":
      return "cloudy";

    case "tsunami":
      return "radio";

    case "fire":
    case "building_fire":
    case "vehicle_fire":
    case "land_fire":
    case "electrical_fire":
      return "flame";

    case "traffic_accident":
      return "car-sport";

    case "fallen_tree":
      return "leaf";

    case "road_block":
    case "damaged_road":
      return "construct";

    case "fallen_power_line":
      return "flash";

    case "crime":
    case "theft":
      return "shield";

    case "brawl":
    case "risky_crowd":
    case "mob_violence":
    case "public_disturbance":
      return "people";

    case "medical":
    case "fainted_person":
    case "work_accident":
    case "drowning":
    case "evacuation_needed":
      return "medkit";

    default:
      return "alert-circle";
  }
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "94%",
    backgroundColor: colors.background,
    borderTopLeftRadius: radius["3xl"],
    borderTopRightRadius: radius["3xl"],
    overflow: "hidden",
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: radius.full,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    ...typography.caption,
    color: colors.textMuted,
  },
  closeButton: {
    width: 38,
    height: 38,
    minHeight: 38,
    paddingHorizontal: 0,
    borderRadius: radius.full,
  },
  closeText: {
    fontSize: 22,
    lineHeight: 24,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing["3xl"],
  },
  originalCard: {
    gap: spacing.md,
  },
  originalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  originalInfo: {
    flex: 1,
  },
  incidentTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
  },
  incidentType: {
    marginTop: 3,
    ...typography.caption,
    color: colors.textMuted,
  },
  description: {
    ...typography.caption,
    color: "#475569",
  },
  badgeStack: {
    gap: spacing.sm,
  },
  expiryBox: {
    gap: spacing.xs,
  },
  expiryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  expiryTitle: {
    ...typography.label,
    color: colors.text,
  },
  expiryText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  mainImage: {
    width: "100%",
    height: 210,
    borderRadius: radius.xl,
    backgroundColor: colors.border,
  },
  metaBox: {
    gap: spacing.xs,
  },
  infoLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSoft,
  },
  summaryGrid: {
    marginTop: spacing.md,
    flexDirection: "row",
    gap: spacing.sm,
  },
  summaryCard: {
    flex: 1,
    alignItems: "center",
    minHeight: 84,
  },
  summaryValue: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
  },
  summaryLabel: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
    textAlign: "center",
  },
  actions: {
    marginTop: spacing.md,
    flexDirection: "row",
    gap: spacing.sm,
  },
  primaryAction: {
    flex: 1.4,
  },
  secondaryAction: {
    flex: 1,
  },
  section: {
    marginTop: spacing["2xl"],
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  loadingBox: {
    minHeight: 100,
    justifyContent: "center",
  },
  emptyBox: {
    gap: spacing.xs,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  emptyText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  timelineList: {
    gap: 0,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  timelineRail: {
    width: 34,
    alignItems: "center",
  },
  timelineDot: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.surface,
    zIndex: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#CBD5E1",
    marginTop: 2,
    marginBottom: 2,
  },
  timelineCard: {
    flex: 1,
    marginBottom: spacing.md,
  },
  timelineCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
    alignItems: "center",
  },
  timelineBadge: {
    maxWidth: "58%",
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  timelineBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: colors.textInverse,
  },
  timelineDate: {
    flex: 1,
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSoft,
    textAlign: "right",
  },
  timelineTitle: {
    marginTop: spacing.sm,
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  timelineAuthor: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
  },
  conditionPill: {
    marginTop: spacing.sm,
  },
  timelineMessage: {
    marginTop: spacing.sm,
    ...typography.caption,
    color: "#475569",
  },
  timelineImage: {
    marginTop: spacing.sm,
    width: "100%",
    height: 175,
    borderRadius: radius.lg,
    backgroundColor: colors.border,
  },
  replyInputBox: {
    gap: spacing.md,
  },
  replyInput: {
    minHeight: 92,
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    textAlignVertical: "top",
  },
});