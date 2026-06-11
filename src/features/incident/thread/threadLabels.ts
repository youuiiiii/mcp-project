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
    label: "thread.update.still_happening.label",
    shortLabel: "thread.update.still_happening.short",
    description: "thread.update.still_happening.desc",
    iconName: "radio",
    color: colors.danger,
  },
  getting_worse: {
    label: "thread.update.getting_worse.label",
    shortLabel: "thread.update.getting_worse.short",
    description: "thread.update.getting_worse.desc",
    iconName: "trending-up",
    color: colors.primaryDark,
  },
  improving: {
    label: "thread.update.improving.label",
    shortLabel: "thread.update.improving.short",
    description: "thread.update.improving.desc",
    iconName: "trending-down",
    color: colors.info,
  },
  safe_now: {
    label: "thread.update.safe_now.label",
    shortLabel: "thread.update.safe_now.short",
    description: "thread.update.safe_now.desc",
    iconName: "checkmark-circle",
    color: colors.success,
  },
  not_found: {
    label: "thread.update.not_found.label",
    shortLabel: "thread.update.not_found.short",
    description: "thread.update.not_found.desc",
    iconName: "help-circle",
    color: colors.warningDark,
  },
  additional_info: {
    label: "thread.update.additional_info.label",
    shortLabel: "thread.update.additional_info.short",
    description: "thread.update.additional_info.desc",
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

export function formatIncidentDate(date: Date | undefined, t: any, language: "en" | "id") {
  if (!date) {
    return t("common.time.unavailable");
  }

  return date.toLocaleString(language === "id" ? "id-ID" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusLabel(status: IncidentReport["status"], t: any) {
  if (status === "active") {
    return t("thread.status.active");
  }

  if (status === "resolved") {
    return t("thread.status.resolved");
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
  type: IncidentVerification["verificationType"],
  t: any
) {
  if (type === "valid") {
    return t("thread.verification.valid");
  }

  if (type === "invalid") {
    return t("thread.verification.invalid");
  }

  return t("thread.verification.update");
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

export function getConditionLabel(conditionStatus: IncidentConditionStatus | undefined, t: any) {
  if (conditionStatus === "still_happening") {
    return t("thread.condition.still_happening");
  }

  if (conditionStatus === "getting_worse") {
    return t("thread.condition.getting_worse");
  }

  if (conditionStatus === "partially_resolved") {
    return t("thread.condition.partially_resolved");
  }

  if (conditionStatus === "resolved_but_not_closed") {
    return t("thread.condition.resolved_but_not_closed");
  }

  if (conditionStatus === "not_found") {
    return t("thread.condition.not_found");
  }

  return t("thread.condition.unknown");
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
