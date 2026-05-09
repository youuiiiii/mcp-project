import Constants from "expo-constants";
import * as Location from "expo-location";
import { Alert, Platform } from "react-native";

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
  if (!value) return null;

  const number = Number.parseFloat(value);

  if (Number.isNaN(number)) return null;

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
  gempaList: BmkgEarthquake[]
) {
  try {
    if (!Array.isArray(gempaList) || gempaList.length === 0) {
      return;
    }

    const locationPermission = await Location.requestForegroundPermissionsAsync();

    if (locationPermission.status !== "granted") {
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const userLat = location.coords.latitude;
    const userLon = location.coords.longitude;

    for (const gempa of gempaList) {
      const gempaLat = parseBmkgCoordinate(gempa.Lintang);
      const gempaLon = parseBmkgCoordinate(gempa.Bujur);

      if (gempaLat === null || gempaLon === null) {
        continue;
      }

      const distance = getDistanceKm(userLat, userLon, gempaLat, gempaLon);

      if (distance <= NOTIFICATION_DISTANCE_KM) {
        const title = `⚠️ Gempa M${gempa.Magnitude ?? "-"} Terdeteksi`;
        const body = `${gempa.Wilayah ?? "Lokasi tidak diketahui"} - ${
          gempa.Jam ?? "-"
        }. Jarak sekitar ${Math.round(distance)} km dari kamu.`;

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
              earthquake: gempa,
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