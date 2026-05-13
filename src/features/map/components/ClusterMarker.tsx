import { Alert, StyleSheet, Text, View } from "react-native";
import { Marker } from "react-native-maps";

import type { MapCluster } from "../types";

type ClusterMarkerProps = {
  cluster: MapCluster;
};

export default function ClusterMarker({ cluster }: ClusterMarkerProps) {
  return (
    <Marker
      coordinate={{
        latitude: cluster.latitude,
        longitude: cluster.longitude,
      }}
      tracksViewChanges={false}
      onPress={() => {
        Alert.alert(
          "Cluster Kejadian",
          `Ada ${cluster.incidents.length} laporan di area ini. Zoom in untuk melihat detail.`
        );
      }}
    >
      <View style={styles.clusterMarker}>
        <Text style={styles.clusterText}>{cluster.incidents.length}</Text>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  clusterMarker: {
    width: 46,
    height: 46,
    borderRadius: 23,
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
  clusterText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
  },
});