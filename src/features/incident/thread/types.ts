import type { IncidentReport } from "../../../types/incident";

export type IncidentThreadAction = {
  incident: IncidentReport;
};

export type TimelineKind = "report" | "verification" | "reply" | "resolved";

export type TimelineItem = {
  id: string;
  kind: TimelineKind;
  date?: Date;
  title: string;
  message: string;
  imageUri?: string | null;
  author?: string | null;
  color: string;
  badgeLabel: string;
  conditionLabel?: string;
};