import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";

import { getIncidentDisplayMeta } from "../../../constants/incident";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/layout";
import type { IncidentReport } from "../../../types/incident";

type IncidentMapMarkerProps = {
  incident: IncidentReport;
  onPress: (incident: IncidentReport) => void;
};

function IncidentMapMarker({ incident, onPress }: IncidentMapMarkerProps) {
  const meta = getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });

  const markerColor = getMarkerColor(incident);

  return (
    <Marker
      identifier={incident.id}
      coordinate={{
        latitude: incident.latitude,
        longitude: incident.longitude,
      }}
      anchor={{ x: 0.5, y: 1 }}
      centerOffset={{ x: 0, y: -18 }}
      title={incident.title}
      description={`${meta.label} - ${getUrgencyLabel(incident)}`}
      onPress={() => onPress(incident)}
    >
      <View style={styles.markerWrap}>
        <View style={[styles.markerBubble, { backgroundColor: markerColor }]}>
          <Ionicons name={meta.iconName} size={19} color={colors.textInverse} />
        </View>
        <View style={[styles.markerStem, { backgroundColor: markerColor }]} />
      </View>
    </Marker>
  );
}

export default memo(IncidentMapMarker);

function getUrgencyLabel(incident: IncidentReport) {
  const urgency = incident.urgencyLevel ?? incident.severity;

  if (typeof incident.urgencyScore === "number") {
    return `Urgency ${incident.urgencyScore}`;
  }

  if (urgency === "high") {
    return "High urgency";
  }

  if (urgency === "medium") {
    return "Medium urgency";
  }

  return "Low urgency";
}

function getMarkerColor(incident: IncidentReport) {
  if (incident.status === "resolved") {
    return colors.success;
  }

  const urgency = incident.urgencyLevel ?? incident.severity;

  if (urgency === "high") {
    return "#EF4444";
  }

  if (urgency === "medium") {
    return "#F59E0B";
  }

  return "#10B981";
}

const styles = StyleSheet.create({
  markerWrap: {
    alignItems: "center",
  },
  markerBubble: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 7,
    elevation: 5,
  },
  markerStem: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    marginTop: -2,
    borderWidth: 1,
    borderColor: colors.surface,
  },
});
