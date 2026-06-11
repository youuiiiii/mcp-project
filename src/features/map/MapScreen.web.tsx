import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import AppScreen from "../../components/ui/AppScreen";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";

const INCIDENTS_ROUTE = "/(tabs)/activity" as Href;

export default function MapScreen() {
  const router = useRouter();

  return (
    <AppScreen scroll={false} contentContainerStyle={styles.content}>
      <View style={styles.iconWrap}>
        <Ionicons name="map-outline" size={34} color={colors.primary} />
      </View>

      <Text style={styles.title}>Map is available on mobile</Text>
      <Text style={styles.message}>
        The live incident map uses native map rendering. On web, you can still
        review incidents from the incident list.
      </Text>

      <Pressable
        onPress={() => router.push(INCIDENTS_ROUTE)}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>Open incidents</Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.textInverse}
        />
      </Pressable>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing["2xl"],
    gap: spacing.md,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...typography.sectionTitle,
    color: colors.text,
    textAlign: "center",
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
    maxWidth: 360,
  },
  button: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textInverse,
  },
});
