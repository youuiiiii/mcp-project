import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "../../components/ui/AppCard";
import AppScreen from "../../components/ui/AppScreen";
import SectionHeader from "../../components/ui/SectionHeader";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";

const EDUCATION_ITEMS = [
  {
    title: "Safety while reporting",
    description:
      "Report incidents from a safe distance. Do not take photos while driving or approaching dangerous areas.",
    iconName: "shield-checkmark-outline" as const,
  },
  {
    title: "Reading community reports",
    description:
      "Community reports are early signals. Check accuracy status and latest comments before making decisions.",
    iconName: "information-circle-outline" as const,
  },
  {
    title: "When you see an accident",
    description:
      "Prioritize your own safety. Avoid crowds, give responders space, and report only when safe.",
    iconName: "warning-outline" as const,
  },
  {
    title: "During a fire",
    description:
      "Stay away from fire sources, avoid smoke, and follow responder or local guidance.",
    iconName: "flame-outline" as const,
  },
];

export default function EducationScreen() {
  return (
    <AppScreen contentContainerStyle={styles.content}>
      <SectionHeader
        title="Education"
        subtitle="A quick guide for safety and using community reports."
      />

      <View style={styles.list}>
        {EDUCATION_ITEMS.map((item) => (
          <AppCard key={item.title} style={styles.card}>
            <View style={styles.iconBox}>
              <Ionicons name={item.iconName} size={22} color={colors.info} />
            </View>

            <View style={styles.textGroup}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </AppCard>
        ))}
      </View>

      <AppCard variant="muted" style={styles.noteCard}>
        <Ionicons name="construct-outline" size={22} color={colors.textMuted} />
        <View style={styles.textGroup}>
          <Text style={styles.noteTitle}>More guidance can be added later</Text>
          <Text style={styles.noteText}>
            This screen is back in the UI so the education feature can keep
            growing without disrupting the core incident flow.
          </Text>
        </View>
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing["2xl"],
  },
  list: {
    gap: spacing.md,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.infoSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  textGroup: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
  },
  description: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
    color: colors.textMuted,
  },
  noteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  noteText: {
    marginTop: 3,
    ...typography.caption,
    color: colors.textMuted,
  },
});
