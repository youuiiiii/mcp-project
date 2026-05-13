import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Circle, Marker } from "react-native-maps";

import type { UserMapPosition } from "../types";

type UserLocationMarkerProps = {
  userLocation: UserMapPosition | null;
};

export default function UserLocationMarker({
  userLocation,
}: UserLocationMarkerProps) {
  if (!userLocation) {
    return null;
  }

  const accuracyRadius = Math.max(userLocation.accuracy ?? 18, 8);
  const heading = userLocation.heading ?? 0;

  return (
    <>
      <Circle
        center={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        }}
        radius={accuracyRadius}
        strokeWidth={1}
        strokeColor="#2563EB66"
        fillColor="#2563EB18"
      />

      <Marker
        coordinate={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        }}
        anchor={{
          x: 0.5,
          y: 0.5,
        }}
        tracksViewChanges={false}
        flat
        rotation={heading}
      >
        <View style={styles.userMarkerWrapper}>
          <View style={styles.headingPointer} />

          <View style={styles.userMarkerOuter}>
            <View style={styles.userMarkerInner}>
              <Ionicons name="navigate" size={18} color="#FFFFFF" />
            </View>
          </View>
        </View>
      </Marker>
    </>
  );
}

const styles = StyleSheet.create({
  userMarkerWrapper: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
  },
  headingPointer: {
    position: "absolute",
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 18,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#2563EB",
    opacity: 0.9,
  },
  userMarkerOuter: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
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
  userMarkerInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#DBEAFE",
  },
});