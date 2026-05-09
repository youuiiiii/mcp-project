export type IncidentCategory =
  | "natural_disaster"
  | "fire_emergency"
  | "accident_infrastructure"
  | "security_public_order"
  | "medical_rescue";

export type IncidentSubcategory =
  | "flood"
  | "earthquake"
  | "landslide"
  | "volcanic_eruption"
  | "strong_wind"
  | "tsunami"
  | "fire"
  | "building_fire"
  | "vehicle_fire"
  | "land_fire"
  | "electrical_fire"
  | "traffic_accident"
  | "fallen_tree"
  | "road_block"
  | "damaged_road"
  | "fallen_power_line"
  | "collapsed_building"
  | "crime"
  | "theft"
  | "brawl"
  | "risky_crowd"
  | "mob_violence"
  | "public_disturbance"
  | "medical"
  | "fainted_person"
  | "work_accident"
  | "drowning"
  | "evacuation_needed";

export type IncidentType = IncidentSubcategory;

export type IncidentStatus = "active" | "resolved";

export type IncidentSeverity = "low" | "medium" | "high";

export type VerificationStatus = "pending" | "verified" | "disputed";

export type VerificationType = "valid" | "invalid" | "condition_update";

export type IncidentConditionStatus =
  | "still_happening"
  | "getting_worse"
  | "partially_resolved"
  | "resolved_but_not_closed"
  | "not_found";

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type IncidentReport = {
  id: string;

  category: IncidentCategory;
  subcategory: IncidentSubcategory;
  type: IncidentType;

  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: IncidentStatus;
  severity: IncidentSeverity;

  imageUri?: string | null;
  address?: string | null;
  reportedBy?: string | null;
  reporterEmail?: string | null;

  verificationStatus?: VerificationStatus;
  verificationCount?: number;
  disputeCount?: number;
  evidenceCount?: number;
  replyCount?: number;
  verifiedBy?: string[];
  disputedBy?: string[];

  createdAt?: Date;
  updatedAt?: Date;
  latestActivityAt?: Date;

  resolvedImageUri?: string | null;
  resolutionNote?: string | null;
  resolvedBy?: string | null;
  resolvedAt?: Date;
};

export type IncidentVerification = {
  id: string;
  reportId: string;
  verificationType: VerificationType;
  conditionStatus: IncidentConditionStatus;
  note: string;
  imageUri: string;
  latitude: number;
  longitude: number;
  userName?: string | null;
  userEmail?: string | null;
  actorKey: string;
  createdAt?: Date;
};

export type IncidentReply = {
  id: string;
  reportId: string;
  message: string;
  userName?: string | null;
  userEmail?: string | null;
  actorKey: string;
  createdAt?: Date;
};

export type CreateIncidentPayload = {
  category: IncidentCategory;
  subcategory: IncidentSubcategory;
  type?: IncidentType;

  title: string;
  description: string;
  latitude: number;
  longitude: number;
  severity: IncidentSeverity;

  imageUri: string;
  address?: string | null;
  reportedBy?: string | null;
  reporterEmail?: string | null;
};

export type CreateIncidentVerificationPayload = {
  reportId: string;
  verificationType: VerificationType;
  conditionStatus: IncidentConditionStatus;
  note: string;
  imageUri: string;
  latitude: number;
  longitude: number;
  userName?: string | null;
  userEmail?: string | null;
  actorKey: string;
};

export type CreateIncidentReplyPayload = {
  reportId: string;
  message: string;
  userName?: string | null;
  userEmail?: string | null;
  actorKey: string;
};

export type ResolveIncidentPayload = {
  reportId: string;
  resolvedImageUri: string;
  resolutionNote: string;
  resolvedBy?: string | null;
};

export type SOSLog = {
  id: string;
  latitude: number;
  longitude: number;
  nearestIncidentId?: string | null;
  nearestIncidentDistance?: number | null;
  createdAt?: Date;
};

export type CreateSOSLogPayload = {
  latitude: number;
  longitude: number;
  nearestIncidentId?: string | null;
  nearestIncidentDistance?: number | null;
};