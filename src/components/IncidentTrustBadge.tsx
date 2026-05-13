import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/layout";
import { typography } from "../theme/typography";
import { IncidentReport } from "../types/incident";
import {
  getIncidentTrustMeta,
  getIncidentTrustSummary,
} from "../utils/incidentTrust";

type IncidentTrustBadgeVariant = "compact" | "full";

type IncidentTrustBadgeProps = {
  incident: IncidentReport;
  variant?: IncidentTrustBadgeVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function IncidentTrustBadge({
  incident,
  variant = "compact",
  style,
  textStyle,
}: IncidentTrustBadgeProps) {
  const trust = getIncidentTrustMeta(incident);

  if (variant === "full") {
    return (
      <View
        style={[
          styles.fullContainer,
          {
            backgroundColor: trust.lightColor,
            borderColor: trust.color,
          },
          style,
        ]}
      >
        <View
          style={[
            styles.fullIconBox,
            {
              backgroundColor: trust.color,
            },
          ]}
        >
          <Text style={styles.fullIcon}>{trust.icon}</Text>
        </View>

        <View style={styles.fullContent}>
          <Text
            style={[
              styles.fullTitle,
              {
                color: trust.color,
              },
              textStyle,
            ]}
            numberOfLines={1}
          >
            {trust.label}
          </Text>

          <Text style={styles.fullDescription}>
            {trust.description}
          </Text>

          <Text style={styles.fullMeta}>
            {getIncidentTrustSummary(incident)}
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
          backgroundColor: trust.lightColor,
          borderColor: trust.color,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.compactText,
          {
            color: trust.color,
          },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {trust.icon} {trust.shortLabel}
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
  fullIconBox: {
    width: 42,
    height: 42,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  fullIcon: {
    fontSize: 20,
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