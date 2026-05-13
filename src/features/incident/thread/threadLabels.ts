import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../../theme/colors";
import type {
  IncidentConditionStatus,
  IncidentReport,
  IncidentVerification,
} from "../../../types/incident";
import type { StatusBadgeVariant } from "../../../components/ui/StatusBadge";
import type { TimelineKind } from "./types";

export type AppIconName = keyof typeof Ionicons.glyphMap;

export function formatIncidentDate(date?: Date) {
  if (!date) {
    return "Waktu tidak tersedia";
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
    return "Benar terjadi";
  }

  if (type === "invalid") {
    return "Tidak sesuai";
  }

  return "Update kondisi";
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
    return "Masih terjadi";
  }

  if (conditionStatus === "getting_worse") {
    return "Semakin parah";
  }

  if (conditionStatus === "partially_resolved") {
    return "Mulai terkendali";
  }

  if (conditionStatus === "resolved_but_not_closed") {
    return "Tampak selesai";
  }

  if (conditionStatus === "not_found") {
    return "Tidak ditemukan";
  }

  return "Kondisi belum ditentukan";
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

  return "flag";
}