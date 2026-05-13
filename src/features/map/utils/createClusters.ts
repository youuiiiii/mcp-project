import type { IncidentReport } from "../../../types/incident";
import { getDistanceInMeters, isValidCoordinate } from "../../../utils/geo";
import type { MapCluster } from "../types";

const CLUSTER_DISTANCE_METERS = 120;

export const createClusters = (incidents: IncidentReport[]): MapCluster[] => {
  const clusters: MapCluster[] = [];

  incidents.forEach((incident) => {
    if (!isValidCoordinate(incident.latitude, incident.longitude)) {
      return;
    }

    const existingCluster = clusters.find((cluster) => {
      const distance = getDistanceInMeters(
        {
          latitude: incident.latitude,
          longitude: incident.longitude,
        },
        {
          latitude: cluster.latitude,
          longitude: cluster.longitude,
        }
      );

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