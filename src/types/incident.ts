export type IncidentCategory =
  | "natural_disaster"
  | "fire_emergency"
  | "accident_infrastructure"
  | "security_public_order"
  | "medical_rescue"
  | "missing_lost";

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
  | "evacuation_needed"
  | "missing_person"
  | "missing_item"
  | "missing_vehicle";

/**
 * Legacy alias.
 *
 * Jangan dipakai untuk flow baru.
 * Field ini dipertahankan sementara supaya data lama / komponen lama tidak crash.
 */
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

export type ModerationStatus = "visible" | "under_review" | "hidden";

export type TrustStatus =
  | "unverified"
  | "community_confirmed"
  | "questioned";

export type CommunityUpdateType =
  | "still_happening"
  | "getting_worse"
  | "improving"
  | "safe_now"
  | "not_found"
  | "additional_info";

export type IncidentContentReportReason =
  | "false_information"
  | "harmful_content"
  | "spam"
  | "privacy_issue"
  | "inappropriate_image"
  | "other";

export type IncidentContentReportStatus =
  | "open"
  | "reviewed"
  | "dismissed";

export type IncidentContentReportTargetType =
  | "incident_report"
  | "incident_reply";

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type ProximityStatus =
  | "near_incident"
  | "not_near_incident"
  | "unknown";

export type IncidentAccuracyVoteType = "accurate" | "inaccurate";

export type IncidentAccuracyVote = {
  id: string;
  reportId: string;
  voteType: IncidentAccuracyVoteType;
  proximityStatus: ProximityStatus;
  distanceFromIncidentMeters: number;
  locationAccuracyMeters: number;
  actorKey: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateIncidentAccuracyVotePayload = {
  reportId: string;
  voteType: IncidentAccuracyVoteType;
  proximityStatus: ProximityStatus;
  distanceFromIncidentMeters: number;
  locationAccuracyMeters: number;
  actorKey: string;
};

export type IncidentReport = {
  id: string;
  category: IncidentCategory;
  subcategory?: IncidentSubcategory | null;
  type?: IncidentType | null;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: IncidentStatus;
  severity: IncidentSeverity;
  imageUri?: string | null;
  imageUris?: string[];
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
  trustStatus?: TrustStatus;
  moderationStatus?: ModerationStatus;
  moderationReason?: string | null;
  moderatedBy?: string | null;
  moderatedAt?: Date | null;
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
  imageUri?: string | null;
  parentReplyId?: string | null;
  replyToUserName?: string | null;
  updateType?: CommunityUpdateType;
  moderationStatus?: ModerationStatus;
  userName?: string | null;
  userEmail?: string | null;
  actorKey: string;
  createdAt?: Date;
};

export type IncidentContentReport = {
  id: string;
  targetType: IncidentContentReportTargetType;
  targetId: string;
  reportId: string;
  reason: IncidentContentReportReason;
  note?: string | null;
  status: IncidentContentReportStatus;
  actorKey: string;
  userName?: string | null;
  userEmail?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: Date;
  createdAt?: Date;
};

export type CreateIncidentPayload = {
  category: IncidentCategory;
  subcategory?: IncidentSubcategory | null;
  type?: IncidentType | null;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  severity: IncidentSeverity;
  imageUri: string;
  imageUris?: string[];
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
  imageUri?: string | null;
  parentReplyId?: string | null;
  replyToUserName?: string | null;
  updateType?: CommunityUpdateType;
  userName?: string | null;
  userEmail?: string | null;
  actorKey: string;
};

export type CreateIncidentContentReportPayload = {
  targetType: IncidentContentReportTargetType;
  targetId: string;
  reportId: string;
  reason: IncidentContentReportReason;
  note?: string | null;
  actorKey: string;
  userName?: string | null;
  userEmail?: string | null;
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