import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import { useRef, useState } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Pressable, Text, View } from "react-native";
import SosInfoModal from "../sos/SosInfoModal";

import FilterBar, { type MapFilterValue } from "../../components/FilterBar";
import IncidentThreadModal from "../../components/IncidentThreadModal";
import ResolveIncidentModal from "../../components/ResolveIncidentModal";
import VerifyIncidentModal from "../../components/VerifyIncidentModal";
import AppButton from "../../components/ui/AppButton";
import LoadingState from "../../components/ui/LoadingState";
import { getFilterLabel } from "../../constants/incident";
import { mapStyles as styles } from "../../styles/mapStyles";
import { colors } from "../../theme/colors";
import { formatDistance } from "../../utils/geo";
import IncidentMapMarker from "./components/IncidentMapMarker";
import { useMapIncidents } from "./hooks/useMapIncidents";
import { useMapModalState } from "./hooks/useMapModalState";
import { useStableUserLocation } from "./hooks/useStableUserLocation";
import { getReportDisplayMeta } from "./utils/reportDisplayMeta";

const REPORT_ROUTE = "/(tabs)/report" as Href;

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView | null>(null);
  const [sosVisible, setSosVisible] = useState(false);

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

  const nearestIncidentMeta = nearestIncident.incident
    ? getReportDisplayMeta(nearestIncident.incident)
    : null;

  const activeCount = reports.filter((report) => report.status === "active").length;

  const handleOpenReport = () => {
    router.push(REPORT_ROUTE);
  };

  if (loadingLocation && loadingReports) {
    return (
      <View style={styles.container}>
        <LoadingState message="Preparing crisis map..." />
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
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass
        showsScale
      >
        {filteredReports.map((incident) => (
          <IncidentMapMarker
            key={incident.id}
            incident={incident}
            onPress={modalState.openThreadModal}
          />
        ))}
      </MapView>

      <View style={styles.topOverlay}>
        <View style={styles.compactHeader}>
          <View style={styles.headerTitleGroup}>
            <Text style={styles.headerEyebrow}>Live monitoring</Text>
            <Text style={styles.headerTitle}>Crisis Map</Text>
          </View>

          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{activeCount} active</Text>
          </View>
        </View>

        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Ionicons name="warning" size={16} color={colors.dangerDark} />
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

      <View style={styles.mapActions}>

        <Pressable
          onPress={() => setSosVisible(true)}
          style={({ pressed }) => [
            styles.sosButton,
            pressed && styles.sosButtonPressed,
          ]}
        >
          <Ionicons name="alert" size={22} color={colors.textInverse} />
          <Text style={styles.sosButtonText}>SOS Info</Text>
        </Pressable>
        <Pressable
          onPress={focusUserLocation}
          style={({ pressed }) => [
            styles.locateButton,
            pressed && styles.locateButtonPressed,
          ]}
        >
          <Ionicons name="locate" size={23} color={colors.primary} />
        </Pressable>

        <AppButton
          title="Report"
          variant="primary"
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
          <View style={styles.infoRow}>
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoTitle}>
                {filteredReports.length} reports shown
              </Text>

              <Text style={styles.infoDescription}>
                Filter: {getFilterLabel(selectedFilter)}
              </Text>
            </View>

            <Ionicons name="map" size={20} color={colors.textMuted} />
          </View>

          {nearestIncident.incident &&
          nearestIncidentMeta &&
          nearestIncident.distance !== null ? (
            <View style={styles.nearestRow}>
              <Ionicons
                name={nearestIncidentMeta.iconName}
                size={17}
                color={nearestIncidentMeta.color}
              />

              <Text style={styles.nearestText} numberOfLines={1}>
                Nearest: {nearestIncidentMeta.label} -{" "}
                {formatDistance(nearestIncident.distance)}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      

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

      <SosInfoModal
        visible={sosVisible}
        userLocation={userLocation}
        nearestIncidentId={nearestIncident.incident?.id ?? null}
        nearestIncidentDistance={nearestIncident.distance}
        onClose={() => setSosVisible(false)}
      />
    </View>
    
  );
  
}
