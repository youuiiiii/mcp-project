import type { Ionicons } from "@expo/vector-icons";

import type { IncidentContentReportReason } from "../../types/incident";

export function getReasonLabel(reason: IncidentContentReportReason) {
  const labels: Record<IncidentContentReportReason, string> = {
    false_information: "False information",
    harmful_content: "Harmful content",
    spam: "Spam",
    privacy_issue: "Privacy issue",
    inappropriate_image: "Inappropriate photo",
    other: "Other",
  };

  return labels[reason];
}

export function getReasonIcon(reason: IncidentContentReportReason) {
  const icons: Record<
    IncidentContentReportReason,
    keyof typeof Ionicons.glyphMap
  > = {
    false_information: "alert-circle-outline",
    harmful_content: "warning-outline",
    spam: "ban-outline",
    privacy_issue: "lock-closed-outline",
    inappropriate_image: "image-outline",
    other: "ellipsis-horizontal-circle-outline",
  };

  return icons[reason];
}
