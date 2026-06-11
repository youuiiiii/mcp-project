import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppButton from "../../../components/ui/AppButton";
import { colors } from "../../../theme/colors";
import { radius, shadow, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";
import { useI18n } from "../../../i18n";
import type { VoteFeedbackStatus } from "./useIncidentThread";

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
  const { t } = useI18n();
  const meta = getStatusMeta(status, message, t);

  const isLoading = status === "verifying";
  const canOpenSettings =
    status === "error_no_permission" || status === "error_location_off";

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
                backgroundColor: meta.color + "20",
              },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color={meta.color} />
            ) : (
              <Ionicons name={meta.icon} size={28} color={meta.color} />
            )}
          </View>

          <Text style={styles.title}>{meta.title}</Text>
          <Text style={styles.description}>{meta.description}</Text>

          {!isLoading ? (
            <View style={styles.actions}>
              {canOpenSettings ? (
                <AppButton
                  title={t("common.settings")}
                  variant="primary"
                  size="md"
                  fullWidth
                  onPress={onOpenSettings}
                />
              ) : null}

              <AppButton
                title={t("common.ok")}
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

function getStatusMeta(status: VoteFeedbackStatus, message: string | undefined, t: any) {
  switch (status) {
    case "verifying":
      return {
        icon: "location-outline" as const,
        color: colors.info,
        title: t("incident.feedback.verifying.title"),
        description: t("incident.feedback.verifying.desc"),
      };
    case "success":
      return {
        icon: "checkmark-circle-outline" as const,
        color: colors.success,
        title: t("incident.feedback.success.title"),
        description: t("incident.feedback.success.desc"),
      };
    case "error_no_permission":
      return {
        icon: "hand-left-outline" as const,
        color: colors.warning,
        title: t("incident.feedback.no_permission.title"),
        description: t("incident.feedback.no_permission.desc"),
      };
    case "error_location_off":
      return {
        icon: "location-outline" as const,
        color: colors.warning,
        title: t("incident.feedback.location_off.title"),
        description: t("incident.feedback.location_off.desc"),
      };
    case "error_too_far":
      return {
        icon: "walk-outline" as const,
        color: colors.danger,
        title: t("incident.feedback.too_far.title"),
        description: t("incident.feedback.too_far.desc"),
      };
    case "error":
    default:
      return {
        icon: "alert-circle-outline" as const,
        color: colors.danger,
        title: t("incident.feedback.error.title"),
        description: message || t("common.error_default"),
      };
  }
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
