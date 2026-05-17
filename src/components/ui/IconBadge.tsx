import { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { colors } from "../../theme/colors";
import { radius } from "../../theme/layout";

type IconBadgeVariant = "primary" | "danger" | "success" | "warning" | "info" | "neutral";
type IconBadgeSize = "sm" | "md" | "lg";

type IconBadgeProps = {
  children: ReactNode;
  variant?: IconBadgeVariant;
  size?: IconBadgeSize;
  rounded?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function IconBadge({
  children,
  variant = "neutral",
  size = "md",
  rounded = true,
  style,
}: IconBadgeProps) {
  return (
    <View
      style={[
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        rounded ? styles.rounded : styles.softRounded,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const variantStyles: Record<IconBadgeVariant, ViewStyle> = {
  primary: {
    backgroundColor: colors.primarySoft,
  },
  danger: {
    backgroundColor: colors.dangerSoft,
  },
  success: {
    backgroundColor: colors.successSoft,
  },
  warning: {
    backgroundColor: colors.warningSoft,
  },
  info: {
    backgroundColor: colors.infoSoft,
  },
  neutral: {
    backgroundColor: colors.surfaceMuted,
  },
};

const sizeStyles: Record<IconBadgeSize, ViewStyle> = {
  sm: {
    width: 32,
    height: 32,
  },
  md: {
    width: 42,
    height: 42,
  },
  lg: {
    width: 52,
    height: 52,
  },
};

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
  rounded: {
    borderRadius: radius.full,
  },
  softRounded: {
    borderRadius: radius.lg,
  },
});