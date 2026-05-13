import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";

import type { Coordinate } from "../../../types/incident";

type DraftReportMarkerProps = {
  coordinate: Coordinate | null;
};

export default function DraftReportMarker({
  coordinate,
}: DraftReportMarkerProps) {
  if (!coordinate) {
    return null;
  }

  return (
    <Marker coordinate={coordinate} tracksViewChanges={false}>
      <View style={styles.container}>
        <View style={styles.bubble}>
          <Ionicons name="pin" size={22} color="#FFFFFF" />
        </View>
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
    backgroundColor: "#0F172A",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});