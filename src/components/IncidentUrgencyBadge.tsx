import { StyleSheet, Text, View } from "react-native";
import { Coordinate, IncidentReport } from "../types/incident";
import { getIncidentUrgencyMeta } from "../utils/incidentUrgency";

type IncidentUrgencyBadgeProps = {
  incident: IncidentReport;
  userLocation?: Coordinate | null;
  variant?: "compact" | "full";
};

export default function IncidentUrgencyBadge({
  incident,
  userLocation,
  variant = "compact",
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
            ]}
          >
            {urgency.label}
          </Text>

          <Text style={styles.fullDescription}>{urgency.description}</Text>

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
      ]}
    >
      <Text
        style={[
          styles.compactText,
          {
            color: urgency.color,
          },
        ]}
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
  scoreBox: {
    width: 46,
    height: 46,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: {
    fontSize: 17,
    fontWeight: "900",
    color: "#FFFFFF",
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