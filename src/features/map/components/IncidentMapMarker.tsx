import { memo } from "react";
import { Marker } from "react-native-maps";

import { getIncidentDisplayMeta } from "../../../constants/incident";
import { colors } from "../../../theme/colors";
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

  const isResolved = incident.status === "resolved";
  const markerColor = isResolved ? colors.textMuted : meta.color;

  return (
    <Marker
      identifier={incident.id}
      coordinate={{
        latitude: incident.latitude,
        longitude: incident.longitude,
      }}
      pinColor={markerColor}
      title={incident.title}
      description={`${meta.label} - ${getSeverityLabel(incident.severity)}`}
      onPress={() => onPress(incident)}
    />
  );
}

export default memo(IncidentMapMarker);

function getSeverityLabel(severity: IncidentReport["severity"]) {
  if (severity === "high") {
    return "High severity";
  }

  if (severity === "medium") {
    return "Medium severity";
  }

  return "Low severity";
}