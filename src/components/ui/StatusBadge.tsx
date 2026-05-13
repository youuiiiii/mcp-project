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
      color: colors.primaryDark,
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
      backgroundColor: colors.successSoft,
    },
    text: {
      color: colors.successDark,
    },
  },
  pending: {
    container: {
      backgroundColor: colors.warningSoft,
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
      color: colors.primaryDark,
    },
  },
  danger: {
    container: {
      backgroundColor: colors.dangerSoft,
    },
    text: {
      color: colors.primaryDark,
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
      backgroundColor: colors.warningSoft,
    },
    text: {
      color: colors.warningDark,
    },
  },
  info: {
    container: {
      backgroundColor: colors.infoSoft,
    },
    text: {
      color: colors.infoDark,
    },
  },
  neutral: {
    container: {
      backgroundColor: colors.surfaceMuted,
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
      paddingVertical: 4,
    },
    text: {
      fontSize: 10,
    },
  },
  md: {
    container: {
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    text: {
      fontSize: 11,
    },
  },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.full,
    alignSelf: "flex-start",
    maxWidth: "100%",
  },
  text: {
    fontWeight: "900",
    textTransform: "uppercase",
  },
});