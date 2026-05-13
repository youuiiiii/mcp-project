import type { Coordinate, IncidentReport } from "../../types/incident";

export type UserMapPosition = Coordinate & {
  accuracy?: number | null;
  heading?: number | null;
};

export type MapCluster = {
  id: string;
  latitude: number;
  longitude: number;
  incidents: IncidentReport[];
};

export type NearbyIncidentNotification = {
  incident: IncidentReport;
  distance: number;
};