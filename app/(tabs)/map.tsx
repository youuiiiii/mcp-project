import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";
import MapView, {
  Circle,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
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
  isIncidentCategory,
} from "../../src/constants/incident";
import { useAuth } from "../../src/contexts/AuthContext";
import {
  createSOSLog,
  subscribeToIncidents,
} from "../../src/services/incidentService";
import { mapStyles as styles } from "../../src/styles/mapStyles";
import { Coordinate, IncidentReport } from "../../src/types/incident";
import {
  formatDistance,
  getDistanceInMeters,
  getNearestIncident,
  isValidCoordinate,
} from "../../src/utils/geo";
import { getIncidentTrustMeta } from "../../src/utils/incidentTrust";
import { getIncidentUrgencyMeta } from "../../src/utils/incidentUrgency";

type UserMapPosition = Coordinate & {
  accuracy?: number | null;
  heading?: number | null;
};

type MapCluster = {
  id: string;
  latitude: number;
  longitude: number;
  incidents: IncidentReport[];
};

type NearbyIncidentNotification = {
  incident: IncidentReport;
  distance: number;
};

const DEFAULT_REGION: Region = {
  latitude: -6.2,
  longitude: 106.816666,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const CLUSTER_DISTANCE_METERS = 120;

const USER_LOCATION_MIN_MOVE_METERS = 2;
const USER_LOCATION_MAX_ACCURACY_METERS = 60;
const USER_LOCATION_MAX_JUMP_METERS = 80;

const createClusters = (incidents: IncidentReport[]): MapCluster[] => {
  const clusters: MapCluster[] = [];

  incidents.forEach((incident) => {
    if (!isValidCoordinate(incident.latitude, incident.longitude)) {
      return;
    }

    const incidentCoordinate: Coordinate = {
      latitude: incident.latitude,
      longitude: incident.longitude,
    };

    const existingCluster = clusters.find((cluster) => {
      const distance = getDistanceInMeters(incidentCoordinate, {
        latitude: cluster.latitude,
        longitude: cluster.longitude,
      });

      return distance <= CLUSTER_DISTANCE_METERS;
    });

    if (existingCluster) {
      existingCluster.incidents.push(incident);

      const total = existingCluster.incidents.length;

      existingCluster.latitude =
        existingCluster.incidents.reduce((sum, item) => {
          return sum + item.latitude;
        }, 0) / total;

      existingCluster.longitude =
        existingCluster.incidents.reduce((sum, item) => {
          return sum + item.longitude;
        }, 0) / total;

      return;
    }

    clusters.push({
      id: incident.id,
      latitude: incident.latitude,
      longitude: incident.longitude,
      incidents: [incident],
    });
  });

  return clusters;
};

const getReportDisplayMeta = (incident: IncidentReport) => {
  return getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });
};

const getEmergencyGuidance = (incident: IncidentReport | null): string => {
  if (!incident) {
    return "Lokasi SOS Anda sudah dicatat. Tetap tenang, cari tempat aman terdekat, dan hubungi pihak berwenang jika kondisi mendesak.";
  }

  const incidentKind = incident.subcategory ?? incident.type;

  switch (incidentKind) {
    case "flood":
      return "Hindari arus air, pindah ke tempat lebih tinggi, dan jangan memaksa melewati jalan tergenang.";

    case "earthquake":
      return "Lindungi kepala, jauhi kaca atau bangunan rapuh, lalu keluar ke area terbuka saat aman.";

    case "landslide":
      return "Jauhi lereng, tebing, dan area tanah retak. Bergerak ke area yang lebih stabil.";

    case "volcanic_eruption":
      return "Gunakan masker, jauhi area abu tebal, ikuti arahan evakuasi, dan hindari daerah aliran lahar.";

    case "strong_wind":
      return "Jauhi pohon besar, tiang listrik, baliho, dan bangunan rapuh. Cari tempat berlindung yang aman.";

    case "tsunami":
      return "Segera menjauh dari pantai dan bergerak ke tempat tinggi. Ikuti jalur evakuasi resmi.";

    case "fire":
    case "building_fire":
    case "vehicle_fire":
    case "land_fire":
    case "electrical_fire":
      return "Jauhi sumber api, hindari asap, jangan gunakan lift, dan cari jalur evakuasi terdekat.";

    case "traffic_accident":
      return "Jauhi badan jalan, beri ruang untuk petugas, dan hindari kerumunan di sekitar lokasi.";

    case "fallen_tree":
      return "Jauhi pohon, kabel listrik, dan area tertutup. Gunakan jalur alternatif.";

    case "road_block":
      return "Cari jalur alternatif dan hindari memaksakan kendaraan melewati area terhalang.";

    case "damaged_road":
      return "Kurangi kecepatan, hindari lubang atau retakan besar, dan gunakan jalur lain bila memungkinkan.";

    case "fallen_power_line":
      return "Jangan menyentuh kabel, jauhi area sekitar kabel, dan segera laporkan ke petugas terkait.";

    case "collapsed_building":
      return "Jauhi reruntuhan, hindari masuk ke area bangunan, dan beri ruang untuk petugas penyelamat.";

    case "crime":
    case "theft":
      return "Jaga jarak aman, jangan mengejar pelaku sendirian, dan segera hubungi pihak keamanan atau kepolisian.";

    case "brawl":
    case "risky_crowd":
    case "mob_violence":
    case "public_disturbance":
      return "Hindari kerumunan, jangan ikut terlibat, tetap waspada, dan menjauh dari area yang tidak kondusif.";

    case "medical":
    case "fainted_person":
    case "work_accident":
    case "drowning":
    case "evacuation_needed":
      return "Beri ruang kepada korban, hubungi bantuan medis, dan jangan memindahkan korban tanpa kebutuhan darurat.";

    default:
      return "Tetap tenang, jauhi area kejadian, dan hubungi pihak berwenang jika dibutuhkan.";
  }
};

export default function MapScreen() {
  const { user } = useAuth();

  const mapRef = useRef<MapView | null>(null);
  const warnedIncidentIdRef = useRef<string | null>(null);
  const verificationPromptedIncidentIdRef = useRef<string | null>(null);
  const lastStableUserLocationRef = useRef<UserMapPosition | null>(null);

  const knownIncidentIdsRef = useRef<Set<string>>(new Set());
  const notifiedIncidentIdsRef = useRef<Set<string>>(new Set());
  const initialIncidentSnapshotLoadedRef = useRef(false);

  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [userLocation, setUserLocation] = useState<UserMapPosition | null>(
    null
  );
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
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);

  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [sosLoading, setSosLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [nearbyIncidentNotification, setNearbyIncidentNotification] =
    useState<NearbyIncidentNotification | null>(null);

  const actorKey = user?.email ?? user?.uid ?? null;

  const shouldUpdateUserLocation = (nextLocation: UserMapPosition): boolean => {
    const lastLocation = lastStableUserLocationRef.current;

    const nextAccuracy =
      nextLocation.accuracy ?? USER_LOCATION_MAX_ACCURACY_METERS;

    if (nextAccuracy > USER_LOCATION_MAX_ACCURACY_METERS) {
      return false;
    }

    if (!lastLocation) {
      return true;
    }

    const distance = getDistanceInMeters(lastLocation, nextLocation);

    if (distance > USER_LOCATION_MAX_JUMP_METERS) {
      return false;
    }

    const lastAccuracy =
      lastLocation.accuracy ?? USER_LOCATION_MAX_ACCURACY_METERS;

    const accuracyImproved = nextAccuracy + 5 < lastAccuracy;

    if (distance < USER_LOCATION_MIN_MOVE_METERS && !accuracyImproved) {
      return false;
    }

    return true;
  };

  const updateStableUserLocation = (nextLocation: UserMapPosition) => {
    if (!shouldUpdateUserLocation(nextLocation)) {
      return;
    }

    lastStableUserLocationRef.current = nextLocation;
    setUserLocation(nextLocation);
  };

  const selectedIncident = useMemo(() => {
    if (!selectedIncidentId) {
      return null;
    }

    return reports.find((item) => item.id === selectedIncidentId) ?? null;
  }, [reports, selectedIncidentId]);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let mounted = true;

    const setupLocation = async () => {
      try {
        setLoadingLocation(true);

        const permission = await Location.requestForegroundPermissionsAsync();

        if (permission.status !== "granted") {
          setErrorMessage(
            "Izin lokasi ditolak. Map tetap dapat digunakan, tetapi posisi Anda tidak bisa ditampilkan."
          );
          setLoadingLocation(false);
          return;
        }

        const currentPosition = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });

        if (!mounted) {
          return;
        }

        const coordinate: UserMapPosition = {
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
          accuracy: currentPosition.coords.accuracy,
          heading: currentPosition.coords.heading,
        };

        const nextRegion: Region = {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };

        lastStableUserLocationRef.current = coordinate;
        setUserLocation(coordinate);
        setRegion(nextRegion);
        setLoadingLocation(false);

        setTimeout(() => {
          mapRef.current?.animateToRegion(nextRegion, 700);
        }, 300);

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 2,
            timeInterval: 1500,
          },
          (position) => {
            const nextCoordinate: UserMapPosition = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              heading: position.coords.heading,
            };

            updateStableUserLocation(nextCoordinate);
          }
        );
      } catch (error) {
        console.error("Location error:", error);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Gagal mengambil lokasi perangkat."
        );

        setLoadingLocation(false);
      }
    };

    setupLocation();

    return () => {
      mounted = false;

      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    setLoadingReports(true);

    const unsubscribe = subscribeToIncidents(
      (items) => {
        setReports(items);
        setLoadingReports(false);
      },
      (error) => {
        console.error("Map reports error:", error);
        setErrorMessage(error.message || "Gagal memuat data laporan.");
        setLoadingReports(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const filteredReports = useMemo(() => {
    const validReports = reports.filter((report) => {
      return isValidCoordinate(report.latitude, report.longitude);
    });

    if (selectedFilter === "all") {
      return validReports;
    }

    if (selectedFilter === "active") {
      return validReports.filter((report) => report.status === "active");
    }

    if (selectedFilter === "resolved") {
      return validReports.filter((report) => report.status === "resolved");
    }

    if (isIncidentCategory(selectedFilter)) {
      return validReports.filter((report) => {
        return report.category === selectedFilter;
      });
    }

    return validReports;
  }, [reports, selectedFilter]);

  const activeReports = useMemo(() => {
    return reports.filter((report) => {
      return (
        report.status === "active" &&
        isValidCoordinate(report.latitude, report.longitude)
      );
    });
  }, [reports]);

  // const visibleActiveReports = useMemo(() => {
  //   return filteredReports.filter((report) => {
  //     return (
  //       report.status === "active" &&
  //       isValidCoordinate(report.latitude, report.longitude)
  //     );
  //   });
  // }, [filteredReports]);

  const clusters = useMemo(() => {
    return createClusters(filteredReports);
  }, [filteredReports]);

  // const heatmapPoints = useMemo(() => {
  //   return visibleActiveReports.map((report) => {
  //     return {
  //       latitude: report.latitude,
  //       longitude: report.longitude,
  //       weight:
  //         report.severity === "high"
  //           ? 3
  //           : report.severity === "medium"
  //             ? 2
  //             : 1,
  //     };
  //   });
  // }, [visibleActiveReports]);

  const nearestIncident = useMemo(() => {
    if (!userLocation) {
      return {
        incident: null,
        distance: null,
      };
    }

    return getNearestIncident(userLocation, activeReports);
  }, [userLocation, activeReports]);

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

  const focusUserLocation = () => {
    if (!userLocation) {
      Alert.alert(
        "Lokasi Tidak Tersedia",
        "Izinkan akses lokasi untuk menampilkan posisi Anda."
      );
      return;
    }

    const nextRegion: Region = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setRegion(nextRegion);
    mapRef.current?.animateToRegion(nextRegion, 700);
  };

  const renderUserLocationMarker = () => {
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
          tracksViewChanges
          flat
          rotation={heading}
        >
          <View style={localStyles.userMarkerWrapper}>
            <View style={localStyles.headingPointer} />

            <View style={localStyles.userMarkerOuter}>
              <View style={localStyles.userMarkerInner}>
                <Text style={localStyles.userIcon}>🧍</Text>
              </View>
            </View>
          </View>
        </Marker>
      </>
    );
  };

  const renderIncidentMarker = (incident: IncidentReport) => {
    const meta = getReportDisplayMeta(incident);
    const trust = getIncidentTrustMeta(incident);
    const urgency = getIncidentUrgencyMeta(incident, userLocation);

    return (
      <Marker
        key={incident.id}
        coordinate={{
          latitude: incident.latitude,
          longitude: incident.longitude,
        }}
        tracksViewChanges={false}
        onPress={() => handleOpenIncidentThread(incident)}
      >
        <View style={styles.markerContainer}>
          <View
            style={[
              localStyles.markerTrustRing,
              {
                borderColor: urgency.color,
                backgroundColor: urgency.lightColor,
              },
            ]}
          >
            <View style={[styles.markerBubble, { backgroundColor: meta.color }]}>
              <Text style={styles.markerIcon}>{meta.icon}</Text>
            </View>

            <View
              style={[
                localStyles.markerTrustBadge,
                {
                  backgroundColor: trust.color,
                },
              ]}
            >
              <Text style={localStyles.markerTrustBadgeText}>
                {trust.shortIcon}
              </Text>
            </View>

            <View
              style={[
                localStyles.markerUrgencyBadge,
                {
                  backgroundColor: urgency.color,
                },
              ]}
            >
              <Text style={localStyles.markerUrgencyBadgeText}>
                {urgency.shortLabel}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.markerPointer,
              {
                backgroundColor: urgency.color,
              },
            ]}
          />
        </View>
      </Marker>
    );
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
        {renderUserLocationMarker()}

        {draftCoordinate ? (
          <Marker coordinate={draftCoordinate} tracksViewChanges={false}>
            <View style={styles.draftMarker}>
              <View style={styles.draftBubble}>
                <Text style={styles.draftIcon}>📌</Text>
              </View>
            </View>
          </Marker>
        ) : null}

        {clusters.map((cluster) => {
          if (cluster.incidents.length === 1) {
            return renderIncidentMarker(cluster.incidents[0]);
          }

          return (
            <Marker
              key={`cluster-${cluster.id}-${cluster.incidents.length}`}
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
                <Text style={styles.clusterText}>
                  {cluster.incidents.length}
                </Text>
              </View>
            </Marker>
          );
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
            Pin menunjukkan lokasi laporan warga. Tap pin untuk detail. Long press
            dekat posisi Anda untuk membuat laporan baru.
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

const localStyles = StyleSheet.create({
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
  userIcon: {
    fontSize: 18,
  },
  markerTrustRing: {
    borderWidth: 3,
    borderRadius: 999,
    padding: 3,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  markerTrustBadge: {
    position: "absolute",
    top: -7,
    right: -7,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  markerTrustBadgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  markerUrgencyBadge: {
    position: "absolute",
    bottom: -8,
    left: -12,
    borderRadius: 999,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  markerUrgencyBadgeText: {
    fontSize: 8,
    fontWeight: "900",
    color: "#FFFFFF",
  },
});