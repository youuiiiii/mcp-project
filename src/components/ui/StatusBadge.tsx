import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { colors } from "../../theme/colors";
import { radius } from "../../theme/layout";

export type StatusBadgeVariant =
  | "active"
  | "resolved"
  | "verified"
  | "pending"
  | "disputed"
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "neutral";

type StatusBadgeSize = "sm" | "md";

type StatusBadgeProps = {
  label: string;
  variant?: StatusBadgeVariant;
  size?: StatusBadgeSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

/**
 * Terra Design System — Status Badge
 *
 * Pill-shaped badges using Terra's earthy color palette.
 * Verified/success uses primarySoft/primary (green).
 * Warning uses warningSoft/warningDark (warm amber).
 * Danger/active uses dangerSoft/dangerDark (deep red).
 */
export default function StatusBadge({
  label,
  variant = "neutral",
  size = "md",
  style,
  textStyle,
}: StatusBadgeProps) {
  return (
    <View
      style={[
        styles.base,
        sizeStyles[size].container,
        variantStyles[variant].container,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          sizeStyles[size].text,
          variantStyles[variant].text,
          textStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const variantStyles: Record<
  StatusBadgeVariant,
  {
    container: ViewStyle;
    text: TextStyle;
  }
> = {
  active: {
    container: {
      backgroundColor: colors.dangerSoft,
    },
    text: {
      color: colors.dangerDark,
    },
  },
  resolved: {
    container: {
      backgroundColor: colors.successSoft,
    },
    text: {
      color: colors.successDark,
    },
  },
  verified: {
    container: {
      backgroundColor: colors.primarySoft,     // Light green accent
    },
    text: {
      color: colors.primaryDark,               // Dark forest green text
    },
  },
  pending: {
    container: {
      backgroundColor: colors.warningSoft,     // Warm amber
    },
    text: {
      color: colors.warningDark,
    },
  },
  disputed: {
    container: {
      backgroundColor: colors.dangerSoft,
    },
    text: {
      color: colors.dangerDark,
    },
  },
  danger: {
    container: {
      backgroundColor: colors.dangerSoft,
    },
    text: {
      color: colors.dangerDark,
    },
  },
  success: {
    container: {
      backgroundColor: colors.successSoft,
    },
    text: {
      color: colors.successDark,
    },
  },
  warning: {
    container: {
      backgroundColor: colors.warningSoft,     // Warm amber
    },
    text: {
      color: colors.warningDark,
    },
  },
  info: {
    container: {
      backgroundColor: colors.infoSoft,        // Light green-teal
    },
    text: {
      color: colors.infoDark,
    },
  },
  neutral: {
    container: {
      backgroundColor: colors.surfaceMuted,    // Warm cream
    },
    text: {
      color: colors.textMuted,
    },
  },
};

const sizeStyles: Record<
  StatusBadgeSize,
  {
    container: ViewStyle;
    text: TextStyle;
  }
> = {
  sm: {
    container: {
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    text: {
      fontSize: 10,
    },
  },
  md: {
    container: {
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    text: {
      fontSize: 11,
    },
  },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.full,                  // Pill shape
    alignSelf: "flex-start",
    maxWidth: "100%",
  },
  text: {
    fontWeight: "700",                          // Terra bold labels
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
});