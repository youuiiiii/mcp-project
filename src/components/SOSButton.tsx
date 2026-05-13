import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { colors } from "../theme/colors";
import { radius, shadow } from "../theme/layout";

type SOSButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function SOSButton({
  onPress,
  disabled = false,
  style,
}: SOSButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Activate emergency SOS"
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        style,
      ]}
    >
      <View style={styles.iconRing}>
        <Ionicons name="alert" size={22} color={colors.textInverse} />
      </View>

      <Text style={styles.title}>SOS</Text>
      <Text style={styles.subtitle}>Emergency</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 88,
    height: 88,
    borderRadius: radius.full,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: colors.dangerSoft,
    ...shadow.floating,
    shadowColor: colors.primaryDark,
  },
  buttonPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  iconRing: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    backgroundColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.textInverse,
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 1,
    fontSize: 10,
    fontWeight: "800",
    color: colors.dangerSoft,
  },
});