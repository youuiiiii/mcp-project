import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";

import { getIncidentDisplayMeta } from "../../../constants/incident";
import type { IncidentReport } from "../../../types/incident";

type IncidentMapMarkerProps = {
  incident: IncidentReport;
  onPress: (incident: IncidentReport) => void;
};

export default function IncidentMapMarker({
  incident,
  onPress,
}: IncidentMapMarkerProps) {
  const meta = getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });

  const isResolved = incident.status === "resolved";
  const markerColor = isResolved ? "#64748B" : meta.color;

  return (
    <Marker
      coordinate={{
        latitude: incident.latitude,
        longitude: incident.longitude,
      }}
      tracksViewChanges={false}
      onPress={() => onPress(incident)}
    >
      <View style={styles.container}>
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: markerColor,
              opacity: isResolved ? 0.75 : 1,
            },
          ]}
        >
          <Ionicons name={meta.iconName} size={22} color="#FFFFFF" />
        </View>

        <View
          style={[
            styles.pointer,
            {
              backgroundColor: markerColor,
              opacity: isResolved ? 0.75 : 1,
            },
          ]}
        />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 6,
  },
  pointer: {
    width: 12,
    height: 12,
    marginTop: -6,
    transform: [{ rotate: "45deg" }],
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#FFFFFF",
  },
});