import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppButton from "../../../components/ui/AppButton";
import { colors } from "../../../theme/colors";
import { radius, shadow, spacing } from "../../../theme/layout";

export type VoteFeedbackStatus =
  | "idle"
  | "checking"
  | "location_denied"
  | "location_off"
  | "too_far"
  | "error"
  | "success";

type IncidentVoteFeedbackModalProps = {
  visible: boolean;
  status: VoteFeedbackStatus;
  message?: string;
  onClose: () => void;
  onOpenSettings: () => void;
};

export default function IncidentVoteFeedbackModal({
  visible,
  status,
  message,
  onClose,
  onOpenSettings,
}: IncidentVoteFeedbackModalProps) {
  const meta = getStatusMeta(status, message);

  const isLoading = status === "checking";
  const canOpenSettings =
    status === "location_denied" || status === "location_off";

  return (
    <Modal
      visible={visible && status !== "idle"}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={isLoading ? undefined : onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: meta.backgroundColor,
              },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color={meta.color} />
            ) : (
              <Ionicons name={meta.iconName} size={28} color={meta.color} />
            )}
          </View>

          <Text style={styles.title}>{meta.title}</Text>
          <Text style={styles.description}>{meta.description}</Text>

          {!isLoading ? (
            <View style={styles.actions}>
              {canOpenSettings ? (
                <AppButton
                  title="Buka Pengaturan"
                  variant="primary"
                  size="md"
                  fullWidth
                  onPress={onOpenSettings}
                />
              ) : null}

              <AppButton
                title={status === "success" ? "Oke" : "Tutup"}
                variant={canOpenSettings ? "secondary" : "primary"}
                size="md"
                fullWidth
                onPress={onClose}
              />
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

function getStatusMeta(status: VoteFeedbackStatus, message?: string) {
  if (status === "checking") {
    return {
      title: "Mengecek lokasi",
      description: "Sebentar, kami memastikan posisi Anda dekat laporan.",
      iconName: "locate" as const,
      color: colors.info,
      backgroundColor: colors.infoSoft,
    };
  }

  if (status === "success") {
    return {
      title: "Penilaian tersimpan",
      description: "Terima kasih, sinyal akurasi laporan sudah diperbarui.",
      iconName: "checkmark-circle" as const,
      color: colors.success,
      backgroundColor: colors.successSoft,
    };
  }

  if (status === "location_denied") {
    return {
      title: "Lokasi belum diizinkan",
      description: "Aktifkan izin lokasi untuk menilai akurasi laporan.",
      iconName: "location-outline" as const,
      color: colors.warningDark,
      backgroundColor: colors.warningSoft,
    };
  }

  if (status === "location_off") {
    return {
      title: "Lokasi tidak aktif",
      description: "Nyalakan lokasi perangkat untuk menilai laporan.",
      iconName: "navigate-outline" as const,
      color: colors.warningDark,
      backgroundColor: colors.warningSoft,
    };
  }

  if (status === "too_far") {
    return {
      title: "Terlalu jauh",
      description: "Anda terlalu jauh dari lokasi laporan untuk menilai akurasi.",
      iconName: "alert-circle-outline" as const,
      color: colors.danger,
      backgroundColor: colors.dangerSoft,
    };
  }

  return {
    title: "Gagal menilai",
    description: message || "Terjadi kesalahan. Coba lagi nanti.",
    iconName: "close-circle-outline" as const,
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
  };
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.38)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  card: {
    width: "100%",
    borderRadius: radius["3xl"],
    backgroundColor: colors.background,
    padding: spacing["2xl"],
    alignItems: "center",
    gap: spacing.md,
    ...shadow.floating,
  },
  iconBox: {
    width: 62,
    height: 62,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: spacing.xs,
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
    color: colors.textMuted,
    textAlign: "center",
  },
  actions: {
    width: "100%",
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
});