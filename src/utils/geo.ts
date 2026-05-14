import type { Coordinate, IncidentReport } from "../types/incident";

const EARTH_RADIUS_METERS = 6_371_000;

const toRadians = (value: number): number => {
  return (value * Math.PI) / 180;
};

export const isValidCoordinate = (
  latitude?: number,
  longitude?: number
): boolean => {
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return false;
  }

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return false;
  }

  return (
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

export const getDistanceInMeters = (
  pointA: Coordinate,
  pointB: Coordinate
): number => {
  if (
    !isValidCoordinate(pointA.latitude, pointA.longitude) ||
    !isValidCoordinate(pointB.latitude, pointB.longitude)
  ) {
    return Number.MAX_SAFE_INTEGER;
  }

  const lat1 = toRadians(pointA.latitude);
  const lat2 = toRadians(pointB.latitude);
  const deltaLat = toRadians(pointB.latitude - pointA.latitude);
  const deltaLon = toRadians(pointB.longitude - pointA.longitude);

  const haversineValue =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const centralAngle =
    2 * Math.atan2(Math.sqrt(haversineValue), Math.sqrt(1 - haversineValue));

  return EARTH_RADIUS_METERS * centralAngle;
};

export const getNearestIncident = (
  userLocation: Coordinate,
  incidents: IncidentReport[]
): {
  incident: IncidentReport | null;
  distance: number | null;
} => {
  const activeIncidents = incidents.filter((incident) => {
    return (
      incident.status === "active" &&
      isValidCoordinate(incident.latitude, incident.longitude)
    );
  });

  if (activeIncidents.length === 0) {
    return {
      incident: null,
      distance: null,
    };
  }

  let nearestIncident: IncidentReport | null = null;
  let nearestDistance = Number.MAX_SAFE_INTEGER;

  activeIncidents.forEach((incident) => {
    const distance = getDistanceInMeters(userLocation, {
      latitude: incident.latitude,
      longitude: incident.longitude,
    });

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIncident = incident;
    }
  });

  return {
    incident: nearestIncident,
    distance: nearestDistance,
  };
};

export const isUserNearIncident = (
  userLocation: Coordinate,
  incident: IncidentReport,
  warningDistance: number
): boolean => {
  if (!isValidCoordinate(incident.latitude, incident.longitude)) {
    return false;
  }

  const distance = getDistanceInMeters(userLocation, {
    latitude: incident.latitude,
    longitude: incident.longitude,
  });

  return distance <= warningDistance;
};

export const formatDistance = (distanceInMeters?: number | null): string => {
  if (distanceInMeters === null || distanceInMeters === undefined) {
    return "-";
  }

  if (!Number.isFinite(distanceInMeters)) {
    return "-";
  }

  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)} m`;
  }

  return `${(distanceInMeters / 1000).toFixed(1)} km`;
};