import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import type { AppIconName } from "../../constants/incident";
import { colors } from "../../theme/colors";
import AppCard from "../ui/AppCard";
import IconBadge from "../ui/IconBadge";
import { verifyIncidentModalStyles as styles } from "./verifyIncidentModalStyles";

export function SelectableOptionCard({
  label,
  description,
  icon,
  color,
  active,
  disabled,
  onPress,
}: {
  label: string;
  description: string;
  icon: AppIconName;
  color: string;
  active: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <AppCard
      onPress={disabled ? undefined : onPress}
      style={[
        styles.optionCard,
        active && {
          borderColor: color,
          backgroundColor: withAlpha(color, "12"),
          shadowColor: color,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        },
      ]}
    >
      <IconBadge
        variant="neutral"
        size="md"
        rounded={false}
        style={{
          backgroundColor: active ? color : colors.surfaceMuted,
        }}
      >
        <Ionicons
          name={icon}
          size={22}
          color={active ? colors.textInverse : color}
        />
      </IconBadge>

      <View style={styles.optionContent}>
        <Text
          style={[
            styles.optionTitle,
            active && {
              color,
            },
          ]}
        >
          {label}
        </Text>

        <Text style={styles.optionDescription}>{description}</Text>
      </View>
    </AppCard>
  );
}

function withAlpha(hexColor: string, alpha: string) {
  if (!hexColor.startsWith("#") || hexColor.length !== 7) {
    return hexColor;
  }

  return `${hexColor}${alpha}`;
}
