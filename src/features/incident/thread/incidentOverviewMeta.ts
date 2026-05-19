import type { IncidentReport } from "../../../types/incident";

export function getUrgencyLevelLabel(urgency: NonNullable<IncidentReport["urgencyLevel"]>) {
  if (urgency === "high") {
    return "High";
  }

  if (urgency === "medium") {
    return "Medium";
  }

  return "Low";
}

export function getUrgencyVariant(
  urgency: NonNullable<IncidentReport["urgencyLevel"]>
): "success" | "warning" | "danger" {
  if (urgency === "high") {
    return "danger";
  }

  if (urgency === "medium") {
    return "warning";
  }

  return "success";
}
