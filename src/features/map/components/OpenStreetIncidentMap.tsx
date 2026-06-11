import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

import type { IncidentReport } from "../../../types/incident";
import type { UserMapPosition } from "../types";

type OpenStreetIncidentMapProps = {
  incidents: IncidentReport[];
  userLocation: UserMapPosition | null;
  onIncidentPress: (incident: IncidentReport) => void;
};

const DEFAULT_CENTER = {
  latitude: -6.2,
  longitude: 106.816666,
};

export default function OpenStreetIncidentMap({
  incidents,
  userLocation,
  onIncidentPress,
}: OpenStreetIncidentMapProps) {
  const incidentById = useMemo(() => {
    return new Map(incidents.map((incident) => [incident.id, incident]));
  }, [incidents]);

  const html = useMemo(() => {
    return buildMapHtml({
      incidents,
      center: userLocation ?? DEFAULT_CENTER,
      userLocation,
    });
  }, [incidents, userLocation]);

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
        onMessage={(event) => {
          const incident = incidentById.get(event.nativeEvent.data);

          if (incident) {
            onIncidentPress(incident);
          }
        }}
      />
    </View>
  );
}

function buildMapHtml({
  incidents,
  center,
  userLocation,
}: {
  incidents: IncidentReport[];
  center: { latitude: number; longitude: number };
  userLocation: UserMapPosition | null;
}) {
  const markers = incidents.map((incident) => ({
    id: incident.id,
    title: incident.title,
    latitude: incident.latitude,
    longitude: incident.longitude,
    color: getMarkerColor(incident),
  }));

  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      html, body, #map {
        height: 100%;
        margin: 0;
        padding: 0;
      }

      .marker {
        width: 30px;
        height: 30px;
        border-radius: 999px;
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(15, 23, 42, 0.28);
      }

      .user-marker {
        width: 16px;
        height: 16px;
        border-radius: 999px;
        background: #2563EB;
        border: 4px solid white;
        box-shadow: 0 0 0 8px rgba(37, 99, 235, 0.18);
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const center = ${JSON.stringify(center)};
      const userLocation = ${JSON.stringify(userLocation)};
      const markers = ${JSON.stringify(markers)};

      const map = L.map("map", {
        zoomControl: false,
      }).setView([center.latitude, center.longitude], userLocation ? 14 : 12);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
      }).addTo(map);

      if (userLocation) {
        L.marker([userLocation.latitude, userLocation.longitude], {
          icon: L.divIcon({
            className: "",
            html: '<div class="user-marker"></div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          }),
        }).addTo(map);
      }

      markers.forEach((incident) => {
        const marker = L.marker([incident.latitude, incident.longitude], {
          icon: L.divIcon({
            className: "",
            html: '<div class="marker" style="background:' + incident.color + '"></div>',
            iconSize: [36, 36],
            iconAnchor: [18, 36],
          }),
        }).addTo(map);

        marker.bindTooltip(incident.title);
        marker.on("click", () => {
          window.ReactNativeWebView.postMessage(incident.id);
        });
      });
    </script>
  </body>
</html>`;
}

function getMarkerColor(incident: IncidentReport) {
  if (incident.status === "resolved") {
    return "#10B981";
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
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#EEF4F2",
  },
});
