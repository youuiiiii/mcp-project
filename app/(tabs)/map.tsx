import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Platform, Text, Vibration, View } from "react-native";
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
  LOCAL_INCIDENT_NOTIFICATION_DISTANCE_METERS,
  REPORT_ALLOWED_DISTANCE_METERS,
  VERIFICATION_DISTANCE_METERS,
  WARNING_DISTANCE_METERS,
  getFilterLabel,
  getIncidentDisplayMeta,
} from "../../src/constants/incident";
import { useAuth } from "../../src/contexts/AuthContext";
import ClusterMarker from "../../src/features/map/components/ClusterMarker";
import DraftReportMarker from "../../src/features/map/components/DraftReportMarker";
import IncidentMapMarker from "../../src/features/map/components/IncidentMapMarker";
import UserLocationMarker from "../../src/features/map/components/UserLocationMarker";
import { useMapIncidents } from "../../src/features/map/hooks/useMapIncidents";
import { useStableUserLocation } from "../../src/features/map/hooks/useStableUserLocation";
import type { NearbyIncidentNotification } from "../../src/features/map/types";
import { getEmergencyGuidance } from "../../src/features/map/utils/emergencyGuidance";
import { createSOSLog } from "../../src/services/incidentService";
import { mapStyles as styles } from "../../src/styles/mapStyles";
import type { Coordinate, IncidentReport } from "../../src/types/incident";
import {
  formatDistance,
  getDistanceInMeters,
  getNearestIncident,
  isValidCoordinate,
} from "../../src/utils/geo";

const getReportDisplayMeta = (incident: IncidentReport) => {
  return getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });
};

export default function MapScreen() {
  const { user } = useAuth();

  const mapRef = useRef<MapView | null>(null);
  const warnedIncidentIdRef = useRef<string | null>(null);
  const verificationPromptedIncidentIdRef = useRef<string | null>(null);

  const knownIncidentIdsRef = useRef<Set<string>>(new Set());
  const notifiedIncidentIdsRef = useRef<Set<string>>(new Set());
  const initialIncidentSnapshotLoadedRef = useRef(false);

  const [draftCoordinate, setDraftCoordinate] = useState<Coordinate | null>(
    null
  );

  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    null
  );
  const [selectedResolveIncident, setSelectedResolveIncident] =
    useState<IncidentReport | null>(null);
  const [selectedVerifyIncident, setSelectedVerifyIncident] =
    useState<IncidentReport | null>(null);

  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [isThreadModalVisible, setIsThreadModalVisible] = useState(false);
  const [isResolveModalVisible, setIsResolveModalVisible] = useState(false);
  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState<MapFilterValue>("all");
  const [sosLoading, setSosLoading] = useState(false);

  const [nearbyIncidentNotification, setNearbyIncidentNotification] =
    useState<NearbyIncidentNotification | null>(null);

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

  const actorKey = user?.email ?? user?.uid ?? null;
  const errorMessage = locationErrorMessage ?? reportsErrorMessage;

  const selectedIncident = useMemo(() => {
    if (!selectedIncidentId) {
      return null;
    }

    return reports.find((item) => item.id === selectedIncidentId) ?? null;
  }, [reports, selectedIncidentId]);

  const isOwnIncident = (incident: IncidentReport) => {
    if (!actorKey) {
      return false;
    }

    return (
      incident.reporterEmail === actorKey || incident.reportedBy === actorKey
    );
  };

  const hasUserVerifiedIncident = (incident: IncidentReport) => {
    if (!actorKey) {
      return false;
    }

    return (
      incident.verifiedBy?.includes(actorKey) ||
      incident.disputedBy?.includes(actorKey)
    );
  };

  const shouldNotifyNearbyIncident = (
    incident: IncidentReport,
    distance: number
  ) => {
    if (!actorKey) {
      return false;
    }

    if (incident.status !== "active") {
      return false;
    }

    if (!isValidCoordinate(incident.latitude, incident.longitude)) {
      return false;
    }

    if (distance > LOCAL_INCIDENT_NOTIFICATION_DISTANCE_METERS) {
      return false;
    }

    if (isOwnIncident(incident)) {
      return false;
    }

    if (notifiedIncidentIdsRef.current.has(incident.id)) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (!userLocation || !actorKey) {
      return;
    }

    const candidate = activeReports.find((incident) => {
      if (isOwnIncident(incident)) {
        return false;
      }

      if (hasUserVerifiedIncident(incident)) {
        return false;
      }

      const distance = getDistanceInMeters(userLocation, {
        latitude: incident.latitude,
        longitude: incident.longitude,
      });

      return distance <= VERIFICATION_DISTANCE_METERS;
    });

    if (!candidate) {
      verificationPromptedIncidentIdRef.current = null;
      return;
    }

    if (verificationPromptedIncidentIdRef.current === candidate.id) {
      return;
    }

    verificationPromptedIncidentIdRef.current = candidate.id;

    const meta = getReportDisplayMeta(candidate);

    Alert.alert(
      "Incident Perlu Verifikasi",
      `${meta.icon} Ada laporan ${meta.label} di sekitar lokasi Anda.\n\nBuka thread untuk melihat detail dan mengirim foto verifikasi.`,
      [
        {
          text: "Nanti",
          style: "cancel",
        },
        {
          text: "Buka Thread",
          onPress: () => {
            setSelectedIncidentId(candidate.id);
            setIsThreadModalVisible(true);
          },
        },
      ]
    );
  }, [userLocation, activeReports, actorKey]);

  useEffect(() => {
    if (!userLocation || reports.length === 0) {
      return;
    }

    const currentIds = new Set(reports.map((report) => report.id));

    if (!initialIncidentSnapshotLoadedRef.current) {
      knownIncidentIdsRef.current = currentIds;
      initialIncidentSnapshotLoadedRef.current = true;
      return;
    }

    const newReports = reports.filter((report) => {
      return !knownIncidentIdsRef.current.has(report.id);
    });

    knownIncidentIdsRef.current = currentIds;

    if (newReports.length === 0) {
      return;
    }

    const nearbyCandidates = newReports
      .map((incident) => {
        const distance = getDistanceInMeters(userLocation, {
          latitude: incident.latitude,
          longitude: incident.longitude,
        });

        return {
          incident,
          distance,
        };
      })
      .filter((item) => {
        return shouldNotifyNearbyIncident(item.incident, item.distance);
      })
      .sort((a, b) => {
        return a.distance - b.distance;
      });

    const nearestNewIncident = nearbyCandidates[0];

    if (!nearestNewIncident) {
      return;
    }

    notifiedIncidentIdsRef.current.add(nearestNewIncident.incident.id);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
      () => {}
    );

    setNearbyIncidentNotification(nearestNewIncident);
  }, [reports, userLocation, actorKey]);

  useEffect(() => {
    if (
      !userLocation ||
      !nearestIncident.incident ||
      nearestIncident.distance === null
    ) {
      warnedIncidentIdRef.current = null;
      return;
    }

    if (nearestIncident.distance > WARNING_DISTANCE_METERS) {
      warnedIncidentIdRef.current = null;
      return;
    }

    if (warnedIncidentIdRef.current === nearestIncident.incident.id) {
      return;
    }

    warnedIncidentIdRef.current = nearestIncident.incident.id;

    const meta = getReportDisplayMeta(nearestIncident.incident);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
      () => {}
    );

    Vibration.vibrate([0, 350, 180, 350]);

    Alert.alert(
      "Peringatan Kejadian Terdekat",
      `${meta.icon} ${meta.label} terdeteksi sekitar ${formatDistance(
        nearestIncident.distance
      )} dari lokasi Anda.\n\nTetap waspada dan hindari area kejadian.`,
      [{ text: "Mengerti" }]
    );
  }, [userLocation, nearestIncident]);

  const handleSOSPress = async () => {
    try {
      if (!userLocation) {
        Alert.alert(
          "Lokasi Tidak Tersedia",
          "Aplikasi belum mendapatkan lokasi Anda. Pastikan izin lokasi aktif."
        );
        return;
      }

      setSosLoading(true);

      const nearest = getNearestIncident(userLocation, activeReports);

      const nearestMeta = nearest.incident
        ? getReportDisplayMeta(nearest.incident)
        : null;

      const vibrationPattern =
        Platform.OS === "android"
          ? 10000
          : [0, 800, 300, 800, 300, 800, 300, 800, 300, 800];

      Vibration.vibrate(vibrationPattern);

      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      ).catch(() => {});

      await createSOSLog({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        nearestIncidentId: nearest.incident?.id ?? null,
        nearestIncidentDistance: nearest.distance ?? null,
      });

      const nearbyMessage =
        nearest.incident && nearest.distance !== null
          ? `Incident terdekat: ${nearestMeta?.icon} ${
              nearestMeta?.label
            } sekitar ${formatDistance(nearest.distance)} dari lokasi Anda.`
          : "Belum ada incident aktif yang terdeteksi di sekitar lokasi Anda.";

      Alert.alert(
        "SOS Aktif",
        `${nearbyMessage}\n\n${getEmergencyGuidance(nearest.incident)}`,
        [
          {
            text: "Mengerti",
            onPress: () => {
              Vibration.cancel();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "SOS Gagal",
        error instanceof Error
          ? error.message
          : "Gagal mengirim log SOS. Coba lagi beberapa saat."
      );
    } finally {
      setSosLoading(false);
    }
  };

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

    setDraftCoordinate(coordinate);
    setIsReportModalVisible(true);

    Haptics.selectionAsync().catch(() => {});
  };

  const handleOpenIncidentThread = (incident: IncidentReport) => {
    setSelectedIncidentId(incident.id);
    setIsThreadModalVisible(true);
  };

  const handleOpenLocalIncidentNotification = (incident: IncidentReport) => {
    setNearbyIncidentNotification(null);
    handleOpenIncidentThread(incident);
  };

  const handleCloseLocalIncidentNotification = () => {
    setNearbyIncidentNotification(null);
  };

  const handleCloseReportModal = () => {
    setIsReportModalVisible(false);
    setDraftCoordinate(null);
  };

  const handleReportSuccess = () => {
    setDraftCoordinate(null);
  };

  const handleCloseThreadModal = () => {
    setIsThreadModalVisible(false);
    setSelectedIncidentId(null);
  };

  const handleOpenVerifyModal = (incident: IncidentReport) => {
    setSelectedVerifyIncident(incident);
    setIsVerifyModalVisible(true);
  };

  const handleCloseVerifyModal = () => {
    setIsVerifyModalVisible(false);
    setSelectedVerifyIncident(null);
  };

  const handleOpenResolveModal = (incident: IncidentReport) => {
    setSelectedResolveIncident(incident);
    setIsResolveModalVisible(true);
  };

  const handleCloseResolveModal = () => {
    setIsResolveModalVisible(false);
    setSelectedResolveIncident(null);
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

        <DraftReportMarker coordinate={draftCoordinate} />

        {clusters.map((cluster) => {
          if (cluster.incidents.length === 1) {
            return (
              <IncidentMapMarker
                key={cluster.incidents[0].id}
                incident={cluster.incidents[0]}
                onPress={handleOpenIncidentThread}
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
          onOpen={handleOpenLocalIncidentNotification}
          onClose={handleCloseLocalIncidentNotification}
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

          {nearestIncident.incident && nearestIncident.distance !== null ? (
            <View style={styles.warningCard}>
              <Text style={styles.warningTitle}>Kejadian Terdekat</Text>

              <Text style={styles.warningText}>
                {getReportDisplayMeta(nearestIncident.incident).icon}{" "}
                {getReportDisplayMeta(nearestIncident.incident).label} sekitar{" "}
                {formatDistance(nearestIncident.distance)} dari posisi Anda.
              </Text>
            </View>
          ) : null}

          <Text
            onPress={focusUserLocation}
            style={[
              styles.infoDescription,
              {
                marginTop: 10,
                color: "#0F766E",
                fontWeight: "900",
              },
            ]}
          >
            Fokus ke lokasi saya
          </Text>
        </View>
      </View>

      <ReportIncidentModal
        visible={isReportModalVisible}
        coordinate={draftCoordinate}
        onClose={handleCloseReportModal}
        onSuccess={handleReportSuccess}
      />

      <IncidentThreadModal
        visible={isThreadModalVisible}
        incident={selectedIncident}
        onClose={handleCloseThreadModal}
        onOpenVerify={handleOpenVerifyModal}
        onOpenResolve={handleOpenResolveModal}
      />

      <VerifyIncidentModal
        visible={isVerifyModalVisible}
        incident={selectedVerifyIncident}
        userLocation={userLocation}
        onClose={handleCloseVerifyModal}
        onSuccess={handleCloseVerifyModal}
      />

      <ResolveIncidentModal
        visible={isResolveModalVisible}
        incident={selectedResolveIncident}
        onClose={handleCloseResolveModal}
        onSuccess={handleCloseResolveModal}
      />
    </View>
  );
}