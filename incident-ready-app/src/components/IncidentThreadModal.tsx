import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getIncidentMeta } from "../constants/incident";
import { useAuth } from "../contexts/AuthContext";
import {
  createIncidentReply,
  reopenIncidentReport,
  subscribeToIncidentReplies,
  subscribeToIncidentVerifications,
} from "../services/incidentService";
import {
  IncidentReply,
  IncidentReport,
  IncidentVerification,
} from "../types/incident";

type IncidentThreadModalProps = {
  visible: boolean;
  incident: IncidentReport | null;
  onClose: () => void;
  onOpenVerify: (incident: IncidentReport) => void;
  onOpenResolve: (incident: IncidentReport) => void;
};

const formatDate = (date?: Date) => {
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
};

const getVerificationLabel = (type: IncidentVerification["verificationType"]) => {
  if (type === "valid") {
    return "Benar terjadi";
  }

  if (type === "invalid") {
    return "Tidak sesuai";
  }

  return "Update kondisi";
};

const getVerificationColor = (type: IncidentVerification["verificationType"]) => {
  if (type === "valid") {
    return "#16A34A";
  }

  if (type === "invalid") {
    return "#DC2626";
  }

  return "#F59E0B";
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

  const meta = incident ? getIncidentMeta(incident.type) : null;

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
  }, [visible, incident?.id]);

  const isOwnIncident = useMemo(() => {
    if (!incident || !actorKey) {
      return false;
    }

    return incident.reporterEmail === actorKey || incident.reportedBy === actorKey;
  }, [incident, actorKey]);

  const hasUserVerified = useMemo(() => {
    if (!actorKey) {
      return false;
    }

    return verifications.some((item) => item.actorKey === actorKey);
  }, [verifications, actorKey]);

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

      if (!replyText.trim()) {
        Alert.alert("Pesan Kosong", "Tulis pesan diskusi terlebih dahulu.");
        return;
      }

      if (replyText.trim().length < 3) {
        Alert.alert("Pesan Terlalu Pendek", "Pesan minimal 3 karakter.");
        return;
      }

      setReplySubmitting(true);

      await createIncidentReply({
        reportId: incident.id,
        message: replyText,
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

  if (!incident || !meta) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
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
                  Detail laporan, bukti verifikasi, dan diskusi warga sekitar.
                </Text>
              </View>

              <Pressable
                onPress={handleClose}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
            >
              <View style={styles.originalCard}>
                <View style={styles.originalHeader}>
                  <View
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor: meta.lightColor,
                      },
                    ]}
                  >
                    <Text style={styles.icon}>{meta.icon}</Text>
                  </View>

                  <View style={styles.originalInfo}>
                    <Text style={styles.incidentTitle}>{incident.title}</Text>
                    <Text style={styles.incidentType}>{meta.label}</Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      incident.status === "active"
                        ? styles.activePill
                        : styles.resolvedPill,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        incident.status === "active"
                          ? styles.activeText
                          : styles.resolvedText,
                      ]}
                    >
                      {incident.status === "active" ? "Active" : "Resolved"}
                    </Text>
                  </View>
                </View>

                <Text style={styles.description}>{incident.description}</Text>

                {incident.imageUri ? (
                  <Image
                    source={{ uri: incident.imageUri }}
                    style={styles.mainImage}
                  />
                ) : null}

                <View style={styles.metaBox}>
                  <Text style={styles.metaText}>
                    Pelapor: {incident.reportedBy || "Anonymous"}
                  </Text>
                  <Text style={styles.metaText}>
                    Dibuat: {formatDate(incident.createdAt)}
                  </Text>
                </View>
              </View>

              <View style={styles.summaryGrid}>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryValue}>
                    {incident.verificationCount ?? 0}
                  </Text>
                  <Text style={styles.summaryLabel}>Benar</Text>
                </View>

                <View style={styles.summaryCard}>
                  <Text style={styles.summaryValue}>
                    {incident.disputeCount ?? 0}
                  </Text>
                  <Text style={styles.summaryLabel}>Tidak Sesuai</Text>
                </View>

                <View style={styles.summaryCard}>
                  <Text style={styles.summaryValue}>
                    {incident.evidenceCount ?? 0}
                  </Text>
                  <Text style={styles.summaryLabel}>Bukti</Text>
                </View>

                <View style={styles.summaryCard}>
                  <Text style={styles.summaryValue}>
                    {incident.replyCount ?? 0}
                  </Text>
                  <Text style={styles.summaryLabel}>Diskusi</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <Pressable
                  disabled={isOwnIncident || hasUserVerified}
                  onPress={() => onOpenVerify(incident)}
                  style={({ pressed }) => [
                    styles.primaryAction,
                    pressed && styles.pressed,
                    (isOwnIncident || hasUserVerified) && styles.disabled,
                  ]}
                >
                  <Text style={styles.primaryActionText}>
                    {isOwnIncident
                      ? "Laporan Sendiri"
                      : hasUserVerified
                        ? "Sudah Verifikasi"
                        : "Verifikasi dengan Foto"}
                  </Text>
                </Pressable>

                {incident.status === "active" ? (
                  <Pressable
                    onPress={() => onOpenResolve(incident)}
                    style={({ pressed }) => [
                      styles.secondaryAction,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={styles.secondaryActionText}>
                      Tandai Selesai
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={handleReopen}
                    style={({ pressed }) => [
                      styles.secondaryAction,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={styles.secondaryActionText}>
                      Aktifkan Lagi
                    </Text>
                  </Pressable>
                )}
              </View>

              {incident.status === "resolved" && incident.resolvedImageUri ? (
                <View style={styles.resolvedBox}>
                  <Text style={styles.sectionTitle}>Bukti Selesai</Text>

                  <Image
                    source={{ uri: incident.resolvedImageUri }}
                    style={styles.mainImage}
                  />

                  <Text style={styles.description}>
                    {incident.resolutionNote || "-"}
                  </Text>
                </View>
              ) : null}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Verification Evidence</Text>

                {loadingThread ? (
                  <View style={styles.loadingBox}>
                    <ActivityIndicator color="#0F766E" />
                  </View>
                ) : null}

                {verifications.length === 0 && !loadingThread ? (
                  <View style={styles.emptyBox}>
                    <Text style={styles.emptyTitle}>Belum ada verifikasi</Text>
                    <Text style={styles.emptyText}>
                      User sekitar bisa menambahkan foto bukti dan catatan
                      kondisi di sini.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.threadList}>
                    {verifications.map((item) => (
                      <View key={item.id} style={styles.threadItem}>
                        <View style={styles.threadHeader}>
                          <View
                            style={[
                              styles.verificationBadge,
                              {
                                backgroundColor: getVerificationColor(
                                  item.verificationType
                                ),
                              },
                            ]}
                          >
                            <Text style={styles.verificationBadgeText}>
                              {getVerificationLabel(item.verificationType)}
                            </Text>
                          </View>

                          <Text style={styles.threadDate}>
                            {formatDate(item.createdAt)}
                          </Text>
                        </View>

                        <Text style={styles.threadAuthor}>
                          {item.userName || item.userEmail || "Anonymous"}
                        </Text>

                        <Text style={styles.threadMessage}>{item.note}</Text>

                        {item.imageUri ? (
                          <Image
                            source={{ uri: item.imageUri }}
                            style={styles.threadImage}
                          />
                        ) : null}
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Discussion</Text>

                <View style={styles.replyInputBox}>
                  <TextInput
                    value={replyText}
                    onChangeText={setReplyText}
                    placeholder="Tulis update atau diskusi tentang incident..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    textAlignVertical="top"
                    style={styles.replyInput}
                  />

                  <Pressable
                    disabled={replySubmitting}
                    onPress={handleSubmitReply}
                    style={({ pressed }) => [
                      styles.replyButton,
                      pressed && styles.pressed,
                      replySubmitting && styles.disabled,
                    ]}
                  >
                    {replySubmitting ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.replyButtonText}>Kirim Reply</Text>
                    )}
                  </Pressable>
                </View>

                {replies.length === 0 ? (
                  <View style={styles.emptyBox}>
                    <Text style={styles.emptyTitle}>Belum ada diskusi</Text>
                    <Text style={styles.emptyText}>
                      Tambahkan update kondisi, rute alternatif, atau informasi
                      lapangan.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.threadList}>
                    {replies.map((item) => (
                      <View key={item.id} style={styles.replyItem}>
                        <Text style={styles.threadAuthor}>
                          {item.userName || item.userEmail || "Anonymous"}
                        </Text>

                        <Text style={styles.threadMessage}>{item.message}</Text>

                        <Text style={styles.threadDate}>
                          {formatDate(item.createdAt)}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
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
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    lineHeight: 19,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  originalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  originalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 24,
  },
  originalInfo: {
    flex: 1,
  },
  incidentTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
  },
  incidentType: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  activePill: {
    backgroundColor: "#FEE2E2",
  },
  resolvedPill: {
    backgroundColor: "#DCFCE7",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "900",
  },
  activeText: {
    color: "#DC2626",
  },
  resolvedText: {
    color: "#16A34A",
  },
  description: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    lineHeight: 20,
  },
  mainImage: {
    marginTop: 12,
    width: "100%",
    height: 210,
    borderRadius: 20,
    backgroundColor: "#E2E8F0",
  },
  metaBox: {
    marginTop: 12,
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
  },
  summaryGrid: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },
  summaryLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: "800",
    color: "#64748B",
  },
  actions: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
  },
  primaryAction: {
    flex: 1.5,
    backgroundColor: "#0F766E",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryActionText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0F172A",
  },
  resolvedBox: {
    marginTop: 18,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 24,
    padding: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 12,
  },
  loadingBox: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
  },
  emptyText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    lineHeight: 18,
  },
  threadList: {
    gap: 12,
  },
  threadItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  threadHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
  },
  verificationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  verificationBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  threadDate: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
  },
  threadAuthor: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "900",
    color: "#0F172A",
  },
  threadMessage: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    lineHeight: 19,
  },
  threadImage: {
    marginTop: 10,
    width: "100%",
    height: 170,
    borderRadius: 18,
    backgroundColor: "#E2E8F0",
  },
  replyInputBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  replyInput: {
    minHeight: 84,
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    textAlignVertical: "top",
  },
  replyButton: {
    marginTop: 10,
    backgroundColor: "#0F766E",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  replyButtonText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  replyItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.5,
  },
});