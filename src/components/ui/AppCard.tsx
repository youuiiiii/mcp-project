import { ReactNode } from "react";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { colors } from "../../theme/colors";
import { radius, shadow, spacing } from "../../theme/layout";

type AppCardProps = {
  children: ReactNode;
  onPress?: () => void;
  variant?: "default" | "muted" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
  style?: StyleProp<ViewStyle>;
};

export default function AppCard({
  children,
  onPress,
  variant = "default",
  padding = "md",
  style,
}: AppCardProps) {
  const cardStyle = [
    styles.base,
    variantStyles[variant],
    paddingStyles[padding],
    variant === "default" && shadow.card,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const variantStyles: Record<NonNullable<AppCardProps["variant"]>, ViewStyle> = {
  default: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  muted: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
  },
  outlined: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
};

const paddingStyles: Record<NonNullable<AppCardProps["padding"]>, ViewStyle> = {
  none: {
    padding: 0,
  },
  sm: {
    padding: spacing.sm,
  },
  md: {
    padding: spacing.lg,
  },
  lg: {
    padding: spacing.xl,
  },
};

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: radius["2xl"],
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});