import type { Coordinate, ProximityStatus } from "../types/incident";

export const ACCURACY_VOTE_NEAR_DISTANCE_METERS = 500;

type ProximityResult = {
  proximityStatus: ProximityStatus;
  distanceFromIncidentMeters: number;
};

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function getDistanceMeters(from: Coordinate, to: Coordinate) {
  const earthRadiusMeters = 6371000;

  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);

  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getIncidentProximity(params: {
  userLocation: Coordinate;
  incidentLocation: Coordinate;
}): ProximityResult {
  const distance = Math.round(
    getDistanceMeters(params.userLocation, params.incidentLocation)
  );

  return {
    proximityStatus:
      distance <= ACCURACY_VOTE_NEAR_DISTANCE_METERS
        ? "near_incident"
        : "not_near_incident",
    distanceFromIncidentMeters: distance,
  };
}