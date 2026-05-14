import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRef, useState } from "react";
import { Alert, Text, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

import FilterBar, { MapFilterValue } from "../../src/components/FilterBar";
import IncidentThreadModal from "../../src/components/IncidentThreadModal";
import LocalIncidentBanner from "../../src/components/LocalIncidentBanner";
import ReportIncidentModal from "../../src/components/ReportIncidentModal";
import ResolveIncidentModal from "../../src/components/ResolveIncidentModal";
import SOSButton from "../../src/components/SOSButton";
import VerifyIncidentModal from "../../src/components/VerifyIncidentModal";
import LoadingState from "../../src/components/ui/LoadingState";
import {
  REPORT_ALLOWED_DISTANCE_METERS,
  getFilterLabel,
} from "../../src/constants/incident";
import { useAuth } from "../../src/contexts/AuthContext";
import ClusterMarker from "../../src/features/map/components/ClusterMarker";
import DraftReportMarker from "../../src/features/map/components/DraftReportMarker";
import IncidentMapMarker from "../../src/features/map/components/IncidentMapMarker";
import UserLocationMarker from "../../src/features/map/components/UserLocationMarker";
import { useMapAlerts } from "../../src/features/map/hooks/useMapAlerts";
import { useMapIncidents } from "../../src/features/map/hooks/useMapIncidents";
import { useMapModalState } from "../../src/features/map/hooks/useMapModalState";
import { useSOSHandler } from "../../src/features/map/hooks/useSOSHandler";
import { useStableUserLocation } from "../../src/features/map/hooks/useStableUserLocation";
import { getReportDisplayMeta } from "../../src/features/map/utils/reportDisplayMeta";
import { mapStyles as styles } from "../../src/styles/mapStyles";
import type { Coordinate } from "../../src/types/incident";
import { formatDistance, getDistanceInMeters } from "../../src/utils/geo";

export default function MapScreen() {
  const { user } = useAuth();

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
    activeReports,
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

  const actorKey = user?.email ?? user?.uid ?? null;
  const errorMessage = locationErrorMessage ?? reportsErrorMessage;

  const {
    nearbyIncidentNotification,
    openNearbyIncidentNotification,
    closeNearbyIncidentNotification,
  } = useMapAlerts({
    actorKey,
    userLocation,
    reports,
    activeReports,
    nearestIncident,
    onOpenIncidentThread: modalState.openThreadModal,
  });

  const { sosLoading, handleSOSPress } = useSOSHandler({
    userLocation,
    activeReports,
  });

  const nearestIncidentMeta = nearestIncident.incident
  ? getReportDisplayMeta(nearestIncident.incident)
  : null;

  const handleLongPress = (coordinate: Coordinate) => {
    if (!userLocation) {
      Alert.alert(
        "Lokasi Belum Tersedia",
        "Aplikasi belum mendapatkan lokasi realtime Anda. Pastikan izin lokasi aktif dan tunggu beberapa saat."
      );
      return;
    }

    const distance = getDistanceInMeters(userLocation, coordinate);

    if (distance > REPORT_ALLOWED_DISTANCE_METERS) {
      Alert.alert(
        "Lokasi Laporan Terlalu Jauh",
        `Anda hanya dapat membuat laporan maksimal ${REPORT_ALLOWED_DISTANCE_METERS} meter dari lokasi realtime Anda.\n\nJarak titik yang dipilih saat ini sekitar ${formatDistance(
          distance
        )}. Silakan pilih titik yang lebih dekat dengan posisi Anda agar laporan tetap valid.`
      );
      return;
    }

    modalState.openReportModal(coordinate);

    Haptics.selectionAsync().catch(() => {});
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
        onLongPress={(event) => {
          handleLongPress(event.nativeEvent.coordinate);
        }}
      >
        <UserLocationMarker userLocation={userLocation} />

        <DraftReportMarker coordinate={modalState.draftCoordinate} />

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
            Pin menunjukkan lokasi laporan warga. Tap pin untuk detail. Long
            press dekat posisi Anda untuk membuat laporan baru.
          </Text>
        </View>

        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <LocalIncidentBanner
          visible={!!nearbyIncidentNotification}
          incident={nearbyIncidentNotification?.incident ?? null}
          distance={nearbyIncidentNotification?.distance ?? null}
          onOpen={openNearbyIncidentNotification}
          onClose={closeNearbyIncidentNotification}
        />

        <View style={styles.filterWrapper}>
          <FilterBar
            selectedFilter={selectedFilter}
            onChange={setSelectedFilter}
          />
        </View>
      </View>

      <View style={styles.sosWrapper}>
        <SOSButton onPress={handleSOSPress} disabled={sosLoading} />
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
            Pin = laporan warga • Cluster = banyak laporan berdekatan • SOS =
            catat posisi darurat
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

      <ReportIncidentModal
        visible={modalState.isReportModalVisible}
        coordinate={modalState.draftCoordinate}
        onClose={modalState.closeReportModal}
        onSuccess={modalState.handleReportSuccess}
      />

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
        onSuccess={modalState.closeVerifyModal}
      />

      <ResolveIncidentModal
        visible={modalState.isResolveModalVisible}
        incident={modalState.selectedResolveIncident}
        onClose={modalState.closeResolveModal}
        onSuccess={modalState.closeResolveModal}
      />
    </View>
  );
}