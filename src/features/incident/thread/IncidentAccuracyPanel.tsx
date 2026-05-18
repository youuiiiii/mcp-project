import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import type { IncidentAccuracyVoteType } from "../../../types/incident";

type AccuracyTone = "neutral" | "success" | "warning" | "danger";

type IncidentAccuracyPanelProps = {
  accurateCount: number;
  inaccurateCount: number;
  currentUserVote: IncidentAccuracyVoteType | null;
  label: string;
  tone: AccuracyTone;
  submitting: boolean;
  onVote: (voteType: IncidentAccuracyVoteType) => void;
};

export default function IncidentAccuracyPanel({
  accurateCount,
  inaccurateCount,
  currentUserVote,
  label,
  tone,
  submitting,
  onVote,
}: IncidentAccuracyPanelProps) {
  const toneColor = getToneColor(tone);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Report Accuracy</Text>
          <Text style={styles.subtitle}>
            Rated by users who are close enough to the reported location.
          </Text>
        </View>

        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: `${toneColor}18`,
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: toneColor,
              },
            ]}
          >
            {label}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <AccuracyButton
          label="Akurat"
          count={accurateCount}
          iconName="arrow-up-circle"
          active={currentUserVote === "accurate"}
          disabled={submitting}
          color={colors.success}
          onPress={() => onVote("accurate")}
        />

        <AccuracyButton
          label="Inaccurate"
          count={inaccurateCount}
          iconName="arrow-down-circle"
          active={currentUserVote === "inaccurate"}
          disabled={submitting}
          color={colors.danger}
          onPress={() => onVote("inaccurate")}
        />
      </View>
    </View>
  );
}

function AccuracyButton({
  label,
  count,
  iconName,
  active,
  disabled,
  color,
  onPress,
}: {
  label: string;
  count: number;
  iconName: keyof typeof Ionicons.glyphMap;
  active: boolean;
  disabled: boolean;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      disabled={disabled || active}
      onPress={onPress}
      style={({ pressed }) => [
        styles.voteButton,
        active && {
          borderColor: color,
          backgroundColor: `${color}14`,
        },
        pressed && styles.pressed,
        disabled && !active && styles.disabled,
      ]}
    >
      <Ionicons
        name={iconName}
        size={20}
        color={active ? color : colors.textMuted}
      />

      <Text
        style={[
          styles.voteLabel,
          active && {
            color,
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.voteCount,
          active && {
            color,
          },
        ]}
      >
        {count}
      </Text>
    </Pressable>
  );
}

function getToneColor(tone: AccuracyTone) {
  if (tone === "success") {
    return colors.success;
  }

  if (tone === "danger") {
    return colors.danger;
  }

  if (tone === "warning") {
    return colors.warningDark;
  }

  return colors.textMuted;
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing["2xl"],
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  titleGroup: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "500",
    color: colors.textMuted,
  },
  statusPill: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  voteButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: spacing.sm,
  },
  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.6,
  },
  voteLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.text,
  },
  voteCount: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.textMuted,
  },
});
