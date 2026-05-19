import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { colors } from "../../theme/colors";
import { spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";

type LoadingStateProps = {
  message?: string;
  style?: StyleProp<ViewStyle>;
};

export default function LoadingState({
  message = "Loading data...",
  style,
}: LoadingStateProps) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color={colors.danger} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing["3xl"],
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: spacing.md,
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
  },
});
