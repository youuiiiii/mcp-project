import { Ionicons } from "@expo/vector-icons";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../../../theme/colors";
import { radius, shadow, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";

type IncidentModalShellProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  submitting?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  headerRight?: React.ReactNode;
  onClose: () => void;
};

export default function IncidentModalShell({
  visible,
  title,
  subtitle,
  submitting = false,
  children,
  footer,
  headerRight,
  onClose,
}: IncidentModalShellProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
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
          style={styles.sheetWrapper}
        >
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.title}>{title.toUpperCase()}</Text>

                {subtitle ? (
                  <Text style={styles.subtitle}>{subtitle}</Text>
                ) : null}
              </View>

              {headerRight ? headerRight : null}

              <Pressable
                disabled={submitting}
                onPress={onClose}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.closeButtonPressed,
                ]}
              >
                <Ionicons name="close" size={24} color={colors.textInverse} />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={[
                styles.content,
                footer ? styles.contentWithFooter : null,
              ]}
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
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0, 0.6)", // Darker, more serious backdrop
  },
  backdropPressArea: {
    flex: 1,
  },
  sheetWrapper: {
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "90%",
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl, // Sharper than 3xl
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.sm,
    ...shadow.floating,
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: colors.surfaceContainerHigh,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.text, // Solid contrast block
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonPressed: {
    opacity: 0.8,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing["3xl"],
  },
  contentWithFooter: {
    paddingBottom: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});