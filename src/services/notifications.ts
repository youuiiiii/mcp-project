import Constants from "expo-constants";
import * as Location from "expo-location";
import { Alert, Platform } from "react-native";

import type { IncidentReport, SOSLog } from "../types/incident";
import { formatDistance, getNearestIncident } from "../utils/geo";

type BmkgEarthquake = {
  Tanggal?: string;
  Jam?: string;
  DateTime?: string;
  Coordinates?: string;
  Lintang?: string;
  Bujur?: string;
  Magnitude?: string;
  Kedalaman?: string;
  Wilayah?: string;
  Potensi?: string;
  Dirasakan?: string;
};

const NOTIFICATION_DISTANCE_KM = 500;
const NEARBY_INCIDENT_DISTANCE_METERS = 5000;

function isRunningInExpoGo() {
  return Constants.appOwnership === "expo";
}

async function getNotificationsModule() {
  if (isRunningInExpoGo()) {
    return null;
  }

  const Notifications = await import("expo-notifications");

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  return Notifications;
}

export async function requestNotificationPermission() {
  try {
    const Notifications = await getNotificationsModule();

    if (!Notifications) {
      return true;
    }

    const currentPermission = await Notifications.getPermissionsAsync();

    let finalStatus = currentPermission.status;

    if (currentPermission.status !== "granted") {
      const requestedPermission = await Notifications.requestPermissionsAsync();
      finalStatus = requestedPermission.status;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    return finalStatus === "granted";
  } catch (error) {
    console.log("Notification permission error:", error);
    return false;
  }
}

function parseBmkgCoordinate(value?: string) {
  if (!value) {
    return null;
  }

  const number = Number.parseFloat(value);

  if (Number.isNaN(number)) {
    return null;
  }

  const upperValue = value.toUpperCase();

  if (upperValue.includes("LS") || upperValue.includes("BB")) {
    return -Math.abs(number);
  }

  return Math.abs(number);
}

function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const earthRadiusKm = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function checkAndNotifyNearbyDisaster(
  earthquakeList: BmkgEarthquake[]
) {
  try {
    if (!Array.isArray(earthquakeList) || earthquakeList.length === 0) {
      return;
    }

    const locationPermission =
      await Location.requestForegroundPermissionsAsync();

    if (locationPermission.status !== "granted") {
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const userLat = location.coords.latitude;
    const userLon = location.coords.longitude;

    for (const earthquake of earthquakeList) {
      const earthquakeLat = parseBmkgCoordinate(earthquake.Lintang);
      const earthquakeLon = parseBmkgCoordinate(earthquake.Bujur);

      if (earthquakeLat === null || earthquakeLon === null) {
        continue;
      }

      const distance = getDistanceKm(
        userLat,
        userLon,
        earthquakeLat,
        earthquakeLon
      );

      if (distance <= NOTIFICATION_DISTANCE_KM) {
        const magnitude = earthquake.Magnitude ?? "-";

        const title = `M${magnitude} Earthquake Detected`;
        const body = `${earthquake.Wilayah ?? "Unknown location"} - ${
          earthquake.Jam ?? "-"
        }. About ${Math.round(distance)} km from your location.`;

        const Notifications = await getNotificationsModule();

        if (!Notifications) {
          Alert.alert(title, body);
          return;
        }

        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            sound: true,
            data: {
              type: "nearby_earthquake",
              earthquake,
              distanceKm: Math.round(distance),
            },
          },
          trigger: null,
        });

        return;
      }
    }
  } catch (error) {
    console.log("Nearby disaster check error:", error);
  }
}

export async function checkAndNotifyNearbyIncidents(
  incidents: IncidentReport[]
) {
  try {
    const activeIncidents = incidents.filter((incident) => {
      return incident.status === "active";
    });

    if (activeIncidents.length === 0) {
      return {
        notified: false,
        message: "No active incidents are available right now.",
      };
    }

    const notificationAllowed = await requestNotificationPermission();

    if (!notificationAllowed) {
      return {
        notified: false,
        message: "Notification permission was not granted.",
      };
    }

    const locationPermission =
      await Location.requestForegroundPermissionsAsync();

    if (locationPermission.status !== "granted") {
      return {
        notified: false,
        message: "Location permission was not granted.",
      };
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const nearest = getNearestIncident(
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      activeIncidents
    );

    if (!nearest.incident || nearest.distance === null) {
      return {
        notified: false,
        message: "No nearby active incidents were found.",
      };
    }

    if (nearest.distance > NEARBY_INCIDENT_DISTANCE_METERS) {
      return {
        notified: false,
        message: `Nearest active incident is ${formatDistance(
          nearest.distance
        )} away.`,
      };
    }

    const title = "Nearby incident alert";
    const body = `${nearest.incident.title} is ${formatDistance(
      nearest.distance
    )} from your location.`;

    const Notifications = await getNotificationsModule();

    if (!Notifications) {
      Alert.alert(title, body);
      return {
        notified: true,
        message: body,
      };
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        data: {
          type: "nearby_incident",
          incidentId: nearest.incident.id,
          distanceMeters: Math.round(nearest.distance),
        },
      },
      trigger: null,
    });

    return {
      notified: true,
      message: body,
    };
  } catch (error) {
    console.log("Nearby incident notification error:", error);
    return {
      notified: false,
      message:
        error instanceof Error
          ? error.message
          : "Could not check nearby incidents.",
    };
  }
}

export async function checkAndNotifyNearbySos(
  sosLogs: SOSLog[]
) {
  try {
    // Only care about SOS logs from the last 15 minutes to avoid stale notifications
    const recentLogs = sosLogs.filter((log) => {
      if (!log.createdAt) return false;
      const ageMs = Date.now() - log.createdAt.getTime();
      return ageMs < 15 * 60 * 1000;
    });

    if (recentLogs.length === 0) return;

    const notificationAllowed = await requestNotificationPermission();
    if (!notificationAllowed) return;

    const locationPermission = await Location.requestForegroundPermissionsAsync();
    if (locationPermission.status !== "granted") return;

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const userLat = location.coords.latitude;
    const userLon = location.coords.longitude;

    for (const log of recentLogs) {
      const distance = getDistanceKm(
        userLat,
        userLon,
        log.latitude,
        log.longitude
      );

      // Notify if within 5km
      if (distance <= 5) {
        const title = "⚠️ EMERGENCY SOS ALERT ⚠️";
        const body = `Someone activated an SOS ${formatDistance(
          distance * 1000
        )} away from your location.`;

        const Notifications = await getNotificationsModule();

        if (!Notifications) {
          Alert.alert(title, body);
          return;
        }

        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            sound: true,
            data: {
              type: "nearby_sos",
              sosLogId: log.id,
              distanceMeters: Math.round(distance * 1000),
            },
          },
          trigger: null,
        });

        // Break after finding the first one to avoid spamming multiple notifications
        return;
      }
    }
  } catch (error) {
    console.log("Nearby SOS notification error:", error);
  }
}
