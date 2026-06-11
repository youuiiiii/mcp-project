import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { type Href, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import FilterBar, { type MapFilterValue } from "../../components/FilterBar";
import IncidentThreadModal from "../../components/IncidentThreadModal";
import ResolveIncidentModal from "../../components/ResolveIncidentModal";
import VerifyIncidentModal from "../../components/VerifyIncidentModal";
import LoadingState from "../../components/ui/LoadingState";
import { googleMapsAndroidApiKey } from "../../config/env";
import { mapStyles as styles } from "../../styles/mapStyles";
import { colors } from "../../theme/colors";
import IncidentMapMarker from "./components/IncidentMapMarker";
import OpenStreetIncidentMap from "./components/OpenStreetIncidentMap";
import { useMapIncidents } from "./hooks/useMapIncidents";
import { useMapModalState } from "./hooks/useMapModalState";
import { useStableUserLocation } from "./hooks/useStableUserLocation";

const ACTIVITY_ROUTE = "/(tabs)/activity" as Href;
const canRenderNativeMap =
  Platform.OS !== "android" || Boolean(googleMapsAndroidApiKey);

const CLEAN_MAP_STYLE = [
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#DCE7EC" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#B8D9E5" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#EEF4F2" }],
  },
];

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<MapFilterValue>("all");

  const {
    userLocation,
    region,
    loadingLocation,
    locationErrorMessage,
    focusUserLocation,
  } = useStableUserLocation(mapRef);

  const {
    reports,
    filteredReports,
    nearestIncident,
    loadingReports,
    reportsErrorMessage,
  } = useMapIncidents({
    selectedFilter,
    userLocation,
  });

  const modalState = useMapModalState({
    reports,
  });

  const errorMessage = locationErrorMessage ?? reportsErrorMessage;
  const activeCount = reports.filter((report) => report.status === "active").length;
  const showLoadingOverlay = loadingLocation || loadingReports;

  return (
    <>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.container}>
          <LinearGradient
            colors={["#0C7186", "#11B7D2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.headerTextGroup}>
              <Text style={styles.headerTitle}>Incident Map</Text>
              <Text style={styles.headerSubtitle}>
                Monitor incidents across all areas
              </Text>
            </View>

            <Pressable
              onPress={() => setSelectedFilter("all")}
              style={({ pressed }) => [
                styles.filterIconButton,
                pressed && styles.iconButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Clear map filters"
            >
              <Ionicons name="filter-outline" size={22} color={colors.textInverse} />
            </Pressable>
          </LinearGradient>

          <View style={styles.filterShell}>
            <FilterBar
              selectedFilter={selectedFilter}
              onChange={setSelectedFilter}
            />
          </View>

          <View style={styles.mapPanel}>
            {canRenderNativeMap ? (
              <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={region}
                customMapStyle={CLEAN_MAP_STYLE}
                showsUserLocation
                showsMyLocationButton={false}
                showsCompass={false}
                showsScale={false}
                toolbarEnabled={false}
              >
                {filteredReports.map((incident) => (
                  <IncidentMapMarker
                    key={incident.id}
                    incident={incident}
                    onPress={modalState.openThreadModal}
                  />
                ))}
              </MapView>
            ) : (
              <OpenStreetIncidentMap
                incidents={filteredReports}
                userLocation={userLocation}
                onIncidentPress={modalState.openThreadModal}
              />
            )}

            {showLoadingOverlay ? (
              <View style={styles.loadingOverlay}>
                <LoadingState message="Preparing map..." />
              </View>
            ) : null}

            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Ionicons name="warning" size={16} color={colors.dangerDark} />
                <Text style={styles.errorText} numberOfLines={2}>
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            <View style={styles.mapActions}>
              <Pressable
                onPress={() => {
                  if (canRenderNativeMap) {
                    focusUserLocation();
                    return;
                  }

                  router.push(ACTIVITY_ROUTE);
                }}
                style={({ pressed }) => [
                  styles.roundActionButton,
                  pressed && styles.iconButtonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Focus on my location"
              >
                <Ionicons
                  name={canRenderNativeMap ? "navigate" : "list-outline"}
                  size={24}
                  color={colors.primaryContainer}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.legendBar}>
            <View style={styles.legendGroup}>
              <LegendDot color="#EF4444" label="High" />
              <LegendDot color="#F59E0B" label="Moderate" />
              <LegendDot color="#10B981" label="Low" />
            </View>

            <View style={styles.visibleCount}>
              <Ionicons
                name="location-outline"
                size={14}
                color={colors.textSoft}
              />
              <Text style={styles.visibleCountText}>
                {filteredReports.length} incidents visible
              </Text>
            </View>
          </View>

          <View style={styles.statusStrip}>
            <View style={styles.liveDot} />
            <Text style={styles.statusStripText}>
              {activeCount} active incidents
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <IncidentThreadModal
        visible={modalState.isThreadModalVisible}
        incident={modalState.selectedIncident}
        onClose={modalState.closeThreadModal}
        onOpenVerify={modalState.openVerifyModal}
        onOpenResolve={modalState.openResolveModal}
      />

      <VerifyIncidentModal
        visible={modalState.isVerifyModalVisible}
        incident={modalState.selectedVerifyIncident}
        userLocation={userLocation}
        onClose={modalState.closeVerifyModal}
      />

      <ResolveIncidentModal
        visible={modalState.isResolveModalVisible}
        incident={modalState.selectedResolveIncident}
        onClose={modalState.closeResolveModal}
      />
    </>
  );
}

type LegendDotProps = {
  color: string;
  label: string;
};

function LegendDot({ color, label }: LegendDotProps) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}
