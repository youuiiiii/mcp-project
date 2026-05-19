import {
  IncidentCategory,
  IncidentReport,
  IncidentStatus,
  IncidentSubcategory,
} from "../../types/incident";

export type NearbyIncidentCandidate = {
  incident: IncidentReport;
  distanceMeters: number;
};

export type FindNearbyActiveIncidentCandidatesInput = {
  category: IncidentCategory;
  subcategory?: IncidentSubcategory | null;
  latitude: number;
  longitude: number;
  radiusMeters?: number;
  limit?: number;
};

export type SubscribeToIncidentsOptions = {
  category?: IncidentCategory;
  limitCount?: number;
  status?: IncidentStatus;
};
