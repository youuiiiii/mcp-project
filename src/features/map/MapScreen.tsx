import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Text, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

import FilterBar, { type MapFilterValue } from "../../components/FilterBar";
import IncidentThreadModal from "../../components/IncidentThreadModal";
import AppButton from "../../components/ui/AppButton";
import LoadingState from "../../components/ui/LoadingState";
import { getFilterLabel } from "../../constants/incident";
import { colors } from "../../theme/colors";
import { mapStyles as styles } from "../../styles/mapStyles";
import { formatDistance } from "../../utils/geo";
import ClusterMarker from "./components/ClusterMarker";
import IncidentMapMarker from "./components/IncidentMapMarker";
import UserLocationMarker from "./components/UserLocationMarker";
import { useMapIncidents } from "./hooks/useMapIncidents";
import { useMapModalState } from "./hooks/useMapModalState";
import { useStableUserLocation } from "./hooks/useStableUserLocation";
import { getReportDisplayMeta } from "./utils/reportDisplayMeta";

const REPORT_ROUTE = "/(tabs)/report" as Href;

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
    clusters,
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

  const nearestIncidentMeta = nearestIncident.incident
    ? getReportDisplayMeta(nearestIncident.incident)
    : null;

  const handleOpenReport = () => {
    router.push(REPORT_ROUTE);
  };

  if (loadingLocation && loadingReports) {
    return (
      <View style={styles.container}>
        <LoadingState message="Menyiapkan crisis map..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass
        showsScale
      >
        <UserLocationMarker userLocation={userLocation} />

        {clusters.map((cluster) => {
          if (cluster.incidents.length === 1) {
            return (
              <IncidentMapMarker
                key={cluster.incidents[0].id}
                incident={cluster.incidents[0]}
                onPress={modalState.openThreadModal}
              />
            );
          }

          return <ClusterMarker key={cluster.id} cluster={cluster} />;
        })}
      </MapView>

      <View style={styles.topOverlay}>
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Crisis Map</Text>

            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          <Text style={styles.headerSubtitle}>
            Pin menunjukkan lokasi laporan warga. Tap pin untuk melihat detail
            kejadian.
          </Text>
        </View>

        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.filterWrapper}>
          <FilterBar
            selectedFilter={selectedFilter}
            onChange={setSelectedFilter}
          />
        </View>
      </View>

      <View style={styles.reportButtonWrapper}>
        <AppButton
          title="Report"
          variant="danger"
          size="md"
          onPress={handleOpenReport}
          leftIcon={
            <Ionicons name="add-circle" size={19} color={colors.textInverse} />
          }
          style={styles.reportButton}
        />
      </View>

      <View style={styles.bottomOverlay}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            {filteredReports.length} laporan ditampilkan
          </Text>

          <Text style={styles.infoDescription}>
            Filter aktif: {getFilterLabel(selectedFilter)}
          </Text>

          <Text style={styles.infoDescription}>
            Pin = laporan warga • Cluster = banyak laporan berdekatan • Report =
            buat laporan dari lokasi Anda
          </Text>

          {nearestIncident.incident &&
          nearestIncidentMeta &&
          nearestIncident.distance !== null ? (
            <View style={styles.warningCard}>
              <Text style={styles.warningTitle}>Kejadian Terdekat</Text>

              <View style={styles.warningContent}>
                <Ionicons
                  name={nearestIncidentMeta.iconName}
                  size={18}
                  color={nearestIncidentMeta.color}
                />

                <Text style={styles.warningText}>
                  {nearestIncidentMeta.label} sekitar{" "}
                  {formatDistance(nearestIncident.distance)} dari posisi Anda.
                </Text>
              </View>
            </View>
          ) : null}

          <Text onPress={focusUserLocation} style={styles.focusLocationAction}>
            Fokus ke lokasi saya
          </Text>
        </View>
      </View>

      <IncidentThreadModal
        visible={modalState.isThreadModalVisible}
        incident={modalState.selectedIncident}
        onClose={modalState.closeThreadModal}
        showActions={false}
      />
    </View>
  );
}