import { Ionicons } from "@expo/vector-icons";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";
import IconBadge from "./IconBadge";

type EmptyStateProps = {
  title: string;
  message?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
};

export default function EmptyState({
  title,
  message,
  iconName = "information-circle-outline",
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <IconBadge variant="neutral" size="lg" rounded={false}>
        <Ionicons name={iconName} size={28} color={colors.textMuted} />
      </IconBadge>

      <Text style={styles.title}>{title}</Text>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing["2xl"],
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius["2xl"],
  },
  title: {
    marginTop: spacing.xs,
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
  },
  message: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
  },
});