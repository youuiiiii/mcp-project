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

/**
 * Dispatch Terminal Design System — Button
 *
 * Sharp, high-contrast, operational.
 */
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
          color={variant === "primary" || variant === "danger" ? colors.textInverse : colors.primary}
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
            {title.toUpperCase()}
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
      backgroundColor: colors.primary,      
      borderColor: colors.primary,
    },
    text: {
      color: colors.textInverse,
    },
  },
  secondary: {
    container: {
      backgroundColor: colors.surface,
      borderColor: colors.borderStrong,
    },
    text: {
      color: colors.text,                  
    },
  },
  danger: {
    container: {
      backgroundColor: colors.danger,         
      borderColor: colors.danger,
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
      color: colors.primary,
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
      minHeight: 48,                          
      paddingHorizontal: spacing.lg,
    },
    text: {
      fontSize: 13,
    },
  },
  lg: {
    container: {
      minHeight: 56,
      paddingHorizontal: spacing.xl,
    },
    text: {
      fontSize: 14,
    },
  },
};

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: radius.sm,                  // Sharp, rigid corners
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
    fontWeight: "900",                        // Extremely bold
    letterSpacing: 1,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
});