import { StyleSheet, Text, View } from "react-native";
import { IncidentReport } from "../types/incident";
import {
  getIncidentTrustMeta,
  getIncidentTrustSummary,
} from "../utils/incidentTrust";

type IncidentTrustBadgeProps = {
  incident: IncidentReport;
  variant?: "compact" | "full";
};

export default function IncidentTrustBadge({
  incident,
  variant = "compact",
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
            ]}
          >
            {trust.label}
          </Text>

          <Text style={styles.fullDescription}>{trust.description}</Text>

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
      ]}
    >
      <Text
        style={[
          styles.compactText,
          {
            color: trust.color,
          },
        ]}
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
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  compactText: {
    fontSize: 11,
    fontWeight: "900",
  },
  fullContainer: {
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderRadius: 22,
    padding: 14,
  },
  fullIconBox: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    lineHeight: 18,
  },
  fullMeta: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    lineHeight: 17,
  },
});