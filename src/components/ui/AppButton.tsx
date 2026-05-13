import { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/layout";

type AppButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type AppButtonSize = "sm" | "md" | "lg";

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  textStyle,
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size].container,
        variantStyles[variant].container,
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" || variant === "danger" ? colors.textInverse : colors.text}
        />
      ) : (
        <View style={styles.content}>
          {leftIcon}
          <Text
            style={[
              styles.text,
              sizeStyles[size].text,
              variantStyles[variant].text,
              textStyle,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {rightIcon}
        </View>
      )}
    </Pressable>
  );
}

const variantStyles: Record<
  AppButtonVariant,
  {
    container: ViewStyle;
    text: TextStyle;
  }
> = {
  primary: {
    container: {
      backgroundColor: colors.dark,
      borderColor: colors.dark,
    },
    text: {
      color: colors.textInverse,
    },
  },
  secondary: {
    container: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    text: {
      color: colors.text,
    },
  },
  danger: {
    container: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    text: {
      color: colors.textInverse,
    },
  },
  ghost: {
    container: {
      backgroundColor: "transparent",
      borderColor: "transparent",
    },
    text: {
      color: colors.text,
    },
  },
};

const sizeStyles: Record<
  AppButtonSize,
  {
    container: ViewStyle;
    text: TextStyle;
  }
> = {
  sm: {
    container: {
      minHeight: 36,
      paddingHorizontal: spacing.md,
    },
    text: {
      fontSize: 12,
    },
  },
  md: {
    container: {
      minHeight: 44,
      paddingHorizontal: spacing.lg,
    },
    text: {
      fontSize: 14,
    },
  },
  lg: {
    container: {
      minHeight: 52,
      paddingHorizontal: spacing.xl,
    },
    text: {
      fontSize: 15,
    },
  },
};

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    width: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  text: {
    fontWeight: "900",
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.55,
  },
});