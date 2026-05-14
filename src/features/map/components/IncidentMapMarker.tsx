import { Ionicons } from "@expo/vector-icons";
import { memo, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";

import { getIncidentDisplayMeta } from "../../../constants/incident";
import { colors } from "../../../theme/colors";
import { radius, shadow } from "../../../theme/layout";
import type { IncidentReport } from "../../../types/incident";

type IncidentMapMarkerProps = {
  incident: IncidentReport;
  onPress: (incident: IncidentReport) => void;
};

function IncidentMapMarker({ incident, onPress }: IncidentMapMarkerProps) {
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  const meta = getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });

  const isResolved = incident.status === "resolved";
  const markerColor = isResolved ? colors.textMuted : meta.color;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTracksViewChanges(false);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [incident.id, markerColor, meta.iconName]);

  return (
    <Marker
      coordinate={{
        latitude: incident.latitude,
        longitude: incident.longitude,
      }}
      tracksViewChanges={tracksViewChanges}
      onPress={() => onPress(incident)}
      anchor={{ x: 0.5, y: 1 }}
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
          <Ionicons name={meta.iconName} size={22} color={colors.textInverse} />
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

export default memo(IncidentMapMarker);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.surface,
    ...shadow.floating,
  },
  pointer: {
    width: 12,
    height: 12,
    marginTop: -6,
    transform: [{ rotate: "45deg" }],
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.surface,
  },
});