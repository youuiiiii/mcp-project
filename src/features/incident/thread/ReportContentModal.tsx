import { Ionicons } from "@expo/vector-icons";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import AppButton from "../../../components/ui/AppButton";
import { colors } from "../../../theme/colors";
import { radius, shadow, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";
import type { IncidentContentReportReason } from "../../../types/incident";

type ReportReasonOption = {
  value: IncidentContentReportReason;
  label: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
};

const REASON_OPTIONS: ReportReasonOption[] = [
  {
    value: "false_information",
    label: "False Information",
    description: "The report looks fake, mislocated, or misleading.",
    iconName: "alert-circle-outline",
  },
  {
    value: "harmful_content",
    label: "Harmful Content",
    description: "This content may cause panic, violence, or other negative impacts.",
    iconName: "warning-outline",
  },
  {
    value: "spam",
    label: "Spam",
    description: "Repeated, irrelevant, or promotional content.",
    iconName: "ban-outline",
  },
  {
    value: "privacy_issue",
    label: "Privacy Issue",
    description: "Contains personal data, sensitive addresses, or someone's identity.",
    iconName: "lock-closed-outline",
  },
  {
    value: "inappropriate_image",
    label: "Inappropriate Image",
    description: "The photo contains sensitive or inappropriate content.",
    iconName: "image-outline",
  },
  {
    value: "other",
    label: "Other",
    description: "Other reasons that need to be reviewed.",
    iconName: "ellipsis-horizontal-circle-outline",
  },
];

type ReportContentModalProps = {
  visible: boolean;
  selectedReason: IncidentContentReportReason | null;
  note: string;
  submitting: boolean;
  onSelectReason: (reason: IncidentContentReportReason) => void;
  onChangeNote: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

export default function ReportContentModal({
  visible,
  selectedReason,
  note,
  submitting,
  onSelectReason,
  onChangeNote,
  onSubmit,
  onClose,
}: ReportContentModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable
          style={styles.backdropPressArea}
          disabled={submitting}
          onPress={onClose}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalWrapper}
        >
          <View style={styles.sheet}>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.title}>Report Content</Text>
                <Text style={styles.subtitle}>
                  Help keep community reports accurate and relevant.
                </Text>
              </View>

              <Pressable
                disabled={submitting}
                onPress={onClose}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.closePressed,
                ]}
              >
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>

            <View style={styles.reasonList}>
              {REASON_OPTIONS.map((item) => {
                const active = selectedReason === item.value;

                return (
                  <Pressable
                    key={item.value}
                    disabled={submitting}
                    onPress={() => onSelectReason(item.value)}
                    style={({ pressed }) => [
                      styles.reasonRow,
                      active && styles.reasonRowActive,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.reasonIcon,
                        active && styles.reasonIconActive,
                      ]}
                    >
                      <Ionicons
                        name={item.iconName}
                        size={19}
                        color={active ? colors.textInverse : colors.textMuted}
                      />
                    </View>

                    <View style={styles.reasonText}>
                      <Text style={styles.reasonLabel}>{item.label}</Text>
                      <Text style={styles.reasonDescription}>
                        {item.description}
                      </Text>
                    </View>

                    <Ionicons
                      name={active ? "checkmark-circle" : "ellipse-outline"}
                      size={21}
                      color={active ? colors.primary : colors.textSoft}
                    />
                  </Pressable>
                );
              })}
            </View>

            <TextInput
              value={note}
              onChangeText={onChangeNote}
              editable={!submitting}
              placeholder="Add a brief note, optional..."
              placeholderTextColor={colors.textSoft}
              multiline
              maxLength={280}
              style={styles.noteInput}
            />

            <View style={styles.footer}>
              <AppButton
                title="Cancel"
                variant="secondary"
                size="md"
                disabled={submitting}
                onPress={onClose}
                style={styles.footerButton}
              />

              <AppButton
                title="Submit"
                variant="danger"
                size="md"
                loading={submitting}
                disabled={!selectedReason || submitting}
                onPress={onSubmit}
                style={styles.footerButton}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.45)",
  },
  backdropPressArea: {
    flex: 1,
  },
  modalWrapper: {
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius["3xl"],
    borderTopRightRadius: radius["3xl"],
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow.floating,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    marginTop: 3,
    ...typography.caption,
    color: colors.textMuted,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  closePressed: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },
  reasonList: {
    gap: spacing.sm,
  },
  reasonRow: {
    minHeight: 64,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  reasonRowActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  reasonIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  reasonIconActive: {
    backgroundColor: colors.primary,
  },
  reasonText: {
    flex: 1,
  },
  reasonLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
  },
  reasonDescription: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "500",
    color: colors.textMuted,
  },
  noteInput: {
    minHeight: 88,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    color: colors.text,
    textAlignVertical: "top",
  },
  footer: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  footerButton: {
    flex: 1,
  },
});
