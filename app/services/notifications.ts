import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function checkAndNotifyNearbyDisaster(gempaList: any[]) {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const location = await Location.getCurrentPositionAsync({});
    const userLat = location.coords.latitude;
    const userLon = location.coords.longitude;

    for (const gempa of gempaList) {
      const gempaLat = parseFloat(gempa.Lintang);
      const gempaLon = parseFloat(gempa.Bujur);
      const distance = getDistance(userLat, userLon, gempaLat, gempaLon);

      if (distance <= 500) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `⚠️ Gempa M${gempa.Magnitude} Terdeteksi!`,
            body: `${gempa.Wilayah} — ${gempa.Jam} WIB. Jarak ~${Math.round(distance)} km dari kamu.`,
            sound: true,
          },
          trigger: null,
        });
        break;
      }
    }
  } catch (error) {
    console.error('Notification error:', error);
  }
}
export default {};