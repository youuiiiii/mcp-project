import { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../theme/colors";
import { spacing } from "../../theme/layout";

type AppScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  withPadding?: boolean;
  keyboardAvoiding?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

export default function AppScreen({
  children,
  scroll = true,
  withPadding = true,
  keyboardAvoiding = false,
  contentContainerStyle,
  style,
}: AppScreenProps) {
  const contentStyle = [
    styles.content,
    withPadding && styles.padding,
    contentContainerStyle,
  ];

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={contentStyle}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.container, style]} edges={["top", "left", "right"]}>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {body}
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: spacing["3xl"],
  },
  padding: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
});