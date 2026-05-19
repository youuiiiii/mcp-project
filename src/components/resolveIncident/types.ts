import type { IncidentReport } from "../../types/incident";

export type ResolveIncidentModalProps = {
  visible: boolean;
  incident: IncidentReport | null;
  onClose: () => void;
  onSuccess?: () => void;
};
