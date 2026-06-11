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
  disabledReason?: string | null;
  label: string;
  tone: AccuracyTone;
  submitting: boolean;
  onVote: (voteType: IncidentAccuracyVoteType) => void;
};

export default function IncidentAccuracyPanel({
  accurateCount,
  inaccurateCount,
  currentUserVote,
  disabledReason,
  label,
  tone,
  submitting,
  onVote,
}: IncidentAccuracyPanelProps) {
  const toneColor = getToneColor(tone);
  const disabled = Boolean(disabledReason) || submitting;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>FIELD VERIFICATION</Text>
          <Text style={styles.subtitle}>
            {disabledReason ??
              "Is this incident still ongoing at this location? Only confirm if you are nearby."}
          </Text>
        </View>

        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: toneColor,
            },
          ]}
        >
          <Text style={styles.statusText}>{label}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <AccuracyButton
          label="STILL ACTIVE"
          count={accurateCount}
          iconName="warning"
          active={currentUserVote === "accurate"}
          disabled={disabled}
          color={colors.danger}
          onPress={() => onVote("accurate")}
        />

        <AccuracyButton
          label="CLEAR / SAFE"
          count={inaccurateCount}
          iconName="checkmark-circle"
          active={currentUserVote === "inaccurate"}
          disabled={disabled}
          color={colors.success}
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
          backgroundColor: color,
        },
        pressed && styles.pressed,
        disabled && !active && styles.disabled,
      ]}
    >
      <Ionicons
        name={iconName}
        size={18}
        color={active ? colors.textInverse : colors.textSoft}
      />

      <Text
        style={[
          styles.voteLabel,
          active && { color: colors.textInverse },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.voteCount,
          active && { color: colors.textInverse },
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
    marginTop: spacing.xl,
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
    fontSize: 13,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    color: colors.textMuted,
  },
  statusPill: {
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "900",
    color: colors.textInverse,
    textTransform: "uppercase",
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  voteButton: {
    flex: 1,
    height: 48,
    borderRadius: radius.sm,
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
  },
  disabled: {
    opacity: 0.6,
  },
  voteLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
  },
  voteCount: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.textSoft,
  },
});
