import * as Sharing from 'expo-sharing';
import { Alert, Share } from 'react-native';

export async function shareIncident(incident: {
  type?: string;
  description?: string;
  location?: { lat: number; lng: number };
  createdAt?: any;
}) {
  try {
    const type = incident.type ?? 'Incident';
    const description = incident.description ?? '-';
    const lat = incident.location?.lat?.toFixed(5) ?? '-';
    const lng = incident.location?.lng?.toFixed(5) ?? '-';
    const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;

    const message = `🚨 SIGAP - Incident Report\n\n📍 Type: ${type}\n📝 Description: ${description}\n🗺️ Location: ${mapsUrl}\n\nReported via SIGAP - Disaster Early Warning System`;

    const isAvailable = await Sharing.isAvailableAsync();

    if (isAvailable) {
      await Share.share({
        message,
        title: 'SIGAP Incident Report',
      });
    } else {
      await Share.share({
        message,
        title: 'SIGAP Incident Report',
      });
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to share incident.');
  }
}