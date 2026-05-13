import { colors } from "../../../theme/colors";
import type {
  IncidentReply,
  IncidentReport,
  IncidentVerification,
} from "../../../types/incident";
import {
  getConditionLabel,
  getVerificationColor,
  getVerificationLabel,
} from "./threadLabels";
import type { TimelineItem } from "./types";

type BuildIncidentTimelineParams = {
  incident: IncidentReport;
  incidentColor: string;
  verifications: IncidentVerification[];
  replies: IncidentReply[];
};

export function buildIncidentTimeline({
  incident,
  incidentColor,
  verifications,
  replies,
}: BuildIncidentTimelineParams): TimelineItem[] {
  const items: TimelineItem[] = [
    {
      id: `report-${incident.id}`,
      kind: "report",
      date: incident.createdAt,
      title: "Laporan awal dibuat",
      message: incident.description,
      imageUri: incident.imageUri,
      author: incident.reportedBy || incident.reporterEmail || "Anonymous",
      color: incidentColor,
      badgeLabel: "Report",
    },
  ];

  verifications.forEach((item) => {
    const label = getVerificationLabel(item.verificationType);

    items.push({
      id: `verification-${item.id}`,
      kind: "verification",
      date: item.createdAt,
      title: label,
      message: item.note,
      imageUri: item.imageUri,
      author: item.userName || item.userEmail || "Anonymous",
      color: getVerificationColor(item.verificationType),
      badgeLabel: label,
      conditionLabel: getConditionLabel(item.conditionStatus),
    });
  });

  replies.forEach((item) => {
    items.push({
      id: `reply-${item.id}`,
      kind: "reply",
      date: item.createdAt,
      title: "Diskusi / Informasi Tambahan",
      message: item.message,
      author: item.userName || item.userEmail || "Anonymous",
      color: colors.info,
      badgeLabel: "Reply",
    });
  });

  if (incident.status === "resolved" && incident.resolvedAt) {
    items.push({
      id: `resolved-${incident.id}`,
      kind: "resolved",
      date: incident.resolvedAt,
      title: "Incident ditandai selesai",
      message: incident.resolutionNote || "Incident sudah ditandai selesai.",
      imageUri: incident.resolvedImageUri,
      author: incident.resolvedBy || "Anonymous",
      color: colors.textMuted,
      badgeLabel: "Resolved",
    });
  }

  return items.sort((a, b) => {
    const timeA = a.date?.getTime() ?? 0;
    const timeB = b.date?.getTime() ?? 0;

    return timeA - timeB;
  });
}