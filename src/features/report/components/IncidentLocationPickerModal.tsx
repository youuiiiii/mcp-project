import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { WebView } from "react-native-webview";

import AppButton from "../../../components/ui/AppButton";
import { googleMapsAndroidApiKey } from "../../../config/env";
import { useI18n } from "../../../i18n";
import { colors } from "../../../theme/colors";
import { radius, shadow, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";
import type { Coordinate, ReportLocationDraft } from "../../../types/incident";

type IncidentLocationPickerModalProps = {
  visible: boolean;
  incidentLocation: ReportLocationDraft | null;
  onClose: () => void;
  onConfirm: (coordinate: Coordinate) => void;
};

export default function IncidentLocationPickerModal({
  visible,
  incidentLocation,
  onClose,
  onConfirm,
}: IncidentLocationPickerModalProps) {
  const { t } = useI18n();
  const [draftCoordinate, setDraftCoordinate] = useState<Coordinate | null>(
    incidentLocation
  );

  useEffect(() => {
    if (visible) {
      setDraftCoordinate(incidentLocation);
    }
  }, [incidentLocation, visible]);

  const handleSave = () => {
    if (!draftCoordinate) return;

    onConfirm(draftCoordinate);
    onClose();
  };

  if (!incidentLocation || !draftCoordinate) {
    return null;
  }

  if (Platform.OS === "android" && !googleMapsAndroidApiKey) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.titleGroup}>
              <Text style={styles.title}>{t("report.location.picker.title")}</Text>
              <Text style={styles.subtitle}>
                {t("report.location.picker.subtitle")}
              </Text>
            </View>

            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          <WebView
            originWhitelist={["*"]}
            source={{ html: buildPickerHtml(draftCoordinate) }}
            javaScriptEnabled
            domStorageEnabled
            onMessage={(event) => {
              try {
                const coordinate = JSON.parse(event.nativeEvent.data);

                if (
                  typeof coordinate.latitude === "number" &&
                  typeof coordinate.longitude === "number"
                ) {
                  setDraftCoordinate(coordinate);
                }
              } catch {
                // Ignore malformed map messages.
              }
            }}
            style={styles.map}
          />

          <View style={styles.footer}>
            <Text style={styles.coordinateText}>
              {draftCoordinate.latitude.toFixed(6)}, {draftCoordinate.longitude.toFixed(6)}
            </Text>

            <View style={styles.actions}>
              <AppButton
                title={t("common.cancel")}
                variant="secondary"
                size="md"
                onPress={onClose}
                style={styles.actionButton}
              />
              <AppButton
                title={t("report.location.picker.save")}
                variant="danger"
                size="md"
                onPress={handleSave}
                style={styles.actionButton}
                leftIcon={
                  <Ionicons name="checkmark" size={17} color={colors.textInverse} />
                }
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>{t("report.location.picker.title")}</Text>
            <Text style={styles.subtitle}>
              {t("report.location.picker.subtitle")}
            </Text>
          </View>

          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
        </View>

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: draftCoordinate.latitude,
            longitude: draftCoordinate.longitude,
            latitudeDelta: 0.006,
            longitudeDelta: 0.006,
          }}
          onPress={(event) => {
            setDraftCoordinate(event.nativeEvent.coordinate);
          }}
          showsUserLocation
          showsCompass
          showsScale
        >
          <Marker
            coordinate={draftCoordinate}
            draggable
            pinColor={colors.primary}
            title={t("report.location.title")}
            onDragEnd={(event) => {
              setDraftCoordinate(event.nativeEvent.coordinate);
            }}
          />
        </MapView>

        <View style={styles.footer}>
          <Text style={styles.coordinateText}>
            {draftCoordinate.latitude.toFixed(6)}, {draftCoordinate.longitude.toFixed(6)}
          </Text>

          <View style={styles.actions}>
            <AppButton
              title={t("common.cancel")}
              variant="secondary"
              size="md"
              onPress={onClose}
              style={styles.actionButton}
            />
            <AppButton
              title={t("report.location.picker.save")}
              variant="danger"
              size="md"
              onPress={handleSave}
              style={styles.actionButton}
              leftIcon={
                <Ionicons name="checkmark" size={17} color={colors.textInverse} />
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function buildPickerHtml(coordinate: Coordinate) {
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

      .pin {
        width: 30px;
        height: 30px;
        border-radius: 999px;
        background: #0C7186;
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(15, 23, 42, 0.28);
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const coordinate = ${JSON.stringify(coordinate)};
      const map = L.map("map").setView([coordinate.latitude, coordinate.longitude], 16);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
      }).addTo(map);

      const marker = L.marker([coordinate.latitude, coordinate.longitude], {
        draggable: true,
        icon: L.divIcon({
          className: "",
          html: '<div class="pin"></div>',
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        }),
      }).addTo(map);

      function send(latlng) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          latitude: latlng.lat,
          longitude: latlng.lng
        }));
      }

      map.on("click", (event) => {
        marker.setLatLng(event.latlng);
        send(event.latlng);
      });

      marker.on("dragend", () => {
        send(marker.getLatLng());
      });
    </script>
  </body>
</html>`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing["3xl"],
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleGroup: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  map: {
    flex: 1,
  },
  footer: {
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadow.floating,
  },
  coordinateText: {
    ...typography.caption,
    textAlign: "center",
    color: colors.textMuted,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  unavailableContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    paddingHorizontal: spacing["2xl"],
  },
  unavailableTitle: {
    ...typography.sectionTitle,
    color: colors.text,
    textAlign: "center",
  },
  unavailableMessage: {
    ...typography.body,
    maxWidth: 360,
    color: colors.textMuted,
    textAlign: "center",
  },
});
