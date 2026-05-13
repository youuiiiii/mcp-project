import { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppButton from "../../../components/ui/AppButton";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";

type IncidentModalShellProps = {
  visible: boolean;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  submitting?: boolean;
  onClose: () => void;
};

export default function IncidentModalShell({
  visible,
  title,
  subtitle,
  children,
  footer,
  submitting = false,
  onClose,
}: IncidentModalShellProps) {
  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

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
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
              </View>

              <AppButton
                title="×"
                variant="secondary"
                size="sm"
                disabled={submitting}
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
              {children}
            </ScrollView>

            {footer ? <View style={styles.footer}>{footer}</View> : null}
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
    maxHeight: "92%",
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
    paddingBottom: spacing["2xl"],
  },
  footer: {
    padding: spacing.lg,
    flexDirection: "row",
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});