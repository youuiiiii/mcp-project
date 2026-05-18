import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../../theme/colors";
import type {
  CommunityUpdateType,
  IncidentConditionStatus,
  IncidentReport,
  IncidentVerification,
} from "../../../types/incident";
import type { StatusBadgeVariant } from "../../../components/ui/StatusBadge";
import type { TimelineKind } from "./types";

export type AppIconName = keyof typeof Ionicons.glyphMap;

export type CommunityUpdateMeta = {
  label: string;
  shortLabel: string;
  description: string;
  iconName: AppIconName;
  color: string;
};

export const COMMUNITY_UPDATE_META = {
  still_happening: {
    label: "Still Happening",
    shortLabel: "Active",
    description: "The condition is still happening at the location.",
    iconName: "radio",
    color: colors.danger,
  },
  getting_worse: {
    label: "Getting Worse",
    shortLabel: "Worse",
    description: "The condition appears to be getting worse or more risky.",
    iconName: "trending-up",
    color: colors.primaryDark,
  },
  improving: {
    label: "Improving",
    shortLabel: "Better",
    description: "The condition is improving but not fully resolved yet.",
    iconName: "trending-down",
    color: colors.info,
  },
  safe_now: {
    label: "Safe Now",
    shortLabel: "Safe",
    description: "The location appears safe or the incident has calmed down.",
    iconName: "checkmark-circle",
    color: colors.success,
  },
  not_found: {
    label: "Not Found",
    shortLabel: "Not Found",
    description: "The incident is not visible at the reported location.",
    iconName: "help-circle",
    color: colors.warningDark,
  },
  additional_info: {
    label: "Additional Info",
    shortLabel: "Info",
    description: "Extra context, photos, or notes from the community.",
    iconName: "chatbubble-ellipses",
    color: colors.textMuted,
  },
} as const satisfies Record<CommunityUpdateType, CommunityUpdateMeta>;

export const COMMUNITY_UPDATE_OPTIONS: CommunityUpdateType[] = [
  "still_happening",
  "getting_worse",
  "improving",
  "safe_now",
  "not_found",
  "additional_info",
];

export function getCommunityUpdateMeta(
  updateType?: CommunityUpdateType | null
): CommunityUpdateMeta {
  return COMMUNITY_UPDATE_META[updateType ?? "additional_info"];
}

export function formatIncidentDate(date?: Date) {
  if (!date) {
    return "Time unavailable";
  }

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusLabel(status: IncidentReport["status"]) {
  if (status === "active") {
    return "Active";
  }

  if (status === "resolved") {
    return "Resolved";
  }

  return String(status);
}

export function getStatusVariant(
  status: IncidentReport["status"]
): StatusBadgeVariant {
  if (status === "active") {
    return "active";
  }

  if (status === "resolved") {
    return "resolved";
  }

  return "neutral";
}

export function getVerificationLabel(
  type: IncidentVerification["verificationType"]
) {
  if (type === "valid") {
    return "Confirmed";
  }

  if (type === "invalid") {
    return "Not Accurate";
  }

  return "Condition Update";
}

export function getVerificationColor(
  type: IncidentVerification["verificationType"]
) {
  if (type === "valid") {
    return colors.success;
  }

  if (type === "invalid") {
    return colors.danger;
  }

  return colors.warning;
}

export function getConditionLabel(conditionStatus?: IncidentConditionStatus) {
  if (conditionStatus === "still_happening") {
    return "Still happening";
  }

  if (conditionStatus === "getting_worse") {
    return "Getting worse";
  }

  if (conditionStatus === "partially_resolved") {
    return "Improving";
  }

  if (conditionStatus === "resolved_but_not_closed") {
    return "Appears resolved";
  }

  if (conditionStatus === "not_found") {
    return "Not found";
  }

  return "Condition not specified";
}

export function getTimelineIcon(kind: TimelineKind): AppIconName {
  if (kind === "report") {
    return "document-text";
  }

  if (kind === "verification") {
    return "shield-checkmark";
  }

  if (kind === "reply") {
    return "chatbubble-ellipses";
  }

  return "checkmark-done-circle";
}
