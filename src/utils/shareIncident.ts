import { Alert, Share } from "react-native";

type ShareIncidentInput = {
  type?: string | null;
  description?: string | null;
  createdAt?: unknown;
  location?: {
    lat?: number | null;
    lng?: number | null;
  } | null;
};

const formatCoordinate = (value?: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return value.toFixed(5);
};

export async function shareIncident(incident: ShareIncidentInput) {
  try {
    const type = incident.type?.trim() || "Incident";
    const description = incident.description?.trim() || "-";
    const lat = formatCoordinate(incident.location?.lat);
    const lng = formatCoordinate(incident.location?.lng);
    const locationText =
      lat && lng ? `https://maps.google.com/?q=${lat},${lng}` : "-";

    const message = [
      "SIGAP - Incident Report",
      "",
      `Type: ${type}`,
      `Description: ${description}`,
      `Location: ${locationText}`,
      "",
      "Reported via SIGAP - Disaster Early Warning System",
    ].join("\n");

    await Share.share({
      message,
      title: "SIGAP Incident Report",
    });
  } catch {
    Alert.alert("Error", "Failed to share incident.");
  }
}
