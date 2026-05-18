import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import AppButton from "../../components/ui/AppButton";
import { colors } from "../../theme/colors";
import { radius, shadow, spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";

type SosInfoModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function SosInfoModal({ visible, onClose }: SosInfoModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPressArea} onPress={onClose} />

        <View style={styles.card}>
          <View style={styles.iconBox}>
            <Ionicons name="alert" size={30} color={colors.textInverse} />
          </View>

          <Text style={styles.title}>SOS</Text>

          <Text style={styles.description}>
            SOS is available as an entry point. Emergency sending can be built
            next after the flow and safety policy are defined.
          </Text>

          <AppButton
            title="Close"
            variant="secondary"
            size="md"
            fullWidth
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  backdropPressArea: {
    ...StyleSheet.absoluteFillObject,
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
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
  },
});
