import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/layout";
import { typography } from "../theme/typography";
import { Coordinate, IncidentReport } from "../types/incident";
import { getIncidentUrgencyMeta } from "../utils/incidentUrgency";

type IncidentUrgencyBadgeVariant = "compact" | "full";

type IncidentUrgencyBadgeProps = {
  incident: IncidentReport;
  userLocation?: Coordinate | null;
  variant?: IncidentUrgencyBadgeVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function IncidentUrgencyBadge({
  incident,
  userLocation,
  variant = "compact",
  style,
  textStyle,
}: IncidentUrgencyBadgeProps) {
  const urgency = getIncidentUrgencyMeta(incident, userLocation);

  if (variant === "full") {
    return (
      <View
        style={[
          styles.fullContainer,
          {
            backgroundColor: urgency.lightColor,
            borderColor: urgency.color,
          },
          style,
        ]}
      >
        <View
          style={[
            styles.scoreBox,
            {
              backgroundColor: urgency.color,
            },
          ]}
        >
          <Text style={styles.scoreText}>{urgency.score}</Text>
        </View>

        <View style={styles.fullContent}>
          <Text
            style={[
              styles.fullTitle,
              {
                color: urgency.color,
              },
              textStyle,
            ]}
            numberOfLines={1}
          >
            {urgency.label}
          </Text>

          <Text style={styles.fullDescription}>
            {urgency.description}
          </Text>

          <Text style={styles.fullMeta}>
            Skor otomatis dihitung dari severity, jenis incident, trust level,
            bukti, dispute, umur laporan, dan jarak dari user jika tersedia.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.compactContainer,
        {
          backgroundColor: urgency.lightColor,
          borderColor: urgency.color,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.compactText,
          {
            color: urgency.color,
          },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {urgency.shortLabel} {urgency.score}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  compactContainer: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    maxWidth: "100%",
  },
  compactText: {
    ...typography.label,
  },
  fullContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius["2xl"],
    padding: spacing.md,
  },
  scoreBox: {
    width: 46,
    height: 46,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  scoreText: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.textInverse,
  },
  fullContent: {
    flex: 1,
  },
  fullTitle: {
    fontSize: 14,
    fontWeight: "900",
  },
  fullDescription: {
    marginTop: 5,
    ...typography.caption,
    color: "#475569",
  },
  fullMeta: {
    marginTop: spacing.sm,
    fontSize: 11,
    fontWeight: "700",
    color: colors.textMuted,
    lineHeight: 17,
  },
});