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
    label: "Masih Terjadi",
    shortLabel: "Aktif",
    description: "Kondisi masih berlangsung di lokasi.",
    iconName: "radio",
    color: colors.danger,
  },
  getting_worse: {
    label: "Semakin Parah",
    shortLabel: "Memburuk",
    description: "Kondisi tampak semakin memburuk atau semakin berbahaya.",
    iconName: "trending-up",
    color: colors.primaryDark,
  },
  improving: {
    label: "Membaik",
    shortLabel: "Membaik",
    description: "Kondisi membaik tapi belum sepenuhnya selesai.",
    iconName: "trending-down",
    color: colors.info,
  },
  safe_now: {
    label: "Sudah Aman",
    shortLabel: "Aman",
    description: "Lokasi tampak aman atau kejadian sudah mereda.",
    iconName: "checkmark-circle",
    color: colors.success,
  },
  not_found: {
    label: "Tidak Ditemukan",
    shortLabel: "Tidak Ada",
    description: "Kejadian tidak terlihat di lokasi yang dilaporkan.",
    iconName: "help-circle",
    color: colors.warningDark,
  },
  additional_info: {
    label: "Info Tambahan",
    shortLabel: "Info",
    description: "Konteks, foto, atau catatan tambahan dari komunitas.",
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
    return "Aktif";
  }

  if (status === "resolved") {
    return "Selesai";
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
    return "Dikonfirmasi";
  }

  if (type === "invalid") {
    return "Tidak Akurat";
  }

  return "Pembaruan Kondisi";
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
    return "Membaik";
  }

  if (conditionStatus === "resolved_but_not_closed") {
    return "Tampak selesai";
  }

  if (conditionStatus === "not_found") {
    return "Tidak ditemukan";
  }

  return "Kondisi tidak ditentukan";
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
