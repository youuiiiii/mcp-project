import { getIncidentDisplayMeta } from "../../../constants/incident";
import type { IncidentReport } from "../../../types/incident";

export const getReportDisplayMeta = (incident: IncidentReport) => {
  return getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });
};