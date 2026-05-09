import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

type SOSButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
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
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        style,
      ]}
    >
      <Text style={styles.title}>SOS</Text>
      <Text style={styles.subtitle}>Emergency</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#991B1B",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: "#FEE2E2",
  },
  buttonPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 1,
    fontSize: 10,
    fontWeight: "700",
    color: "#FEE2E2",
  },
});