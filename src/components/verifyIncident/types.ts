import type { AppIconName } from "../../constants/incident";
import type {
  Coordinate,
  IncidentConditionStatus,
  IncidentReport,
  VerificationType,
} from "../../types/incident";

export type VerifyIncidentModalProps = {
  visible: boolean;
  incident: IncidentReport | null;
  userLocation?: Coordinate | null;
  onClose: () => void;
  onSuccess?: () => void;
};

export type VerificationOption = {
  value: VerificationType;
  label: string;
  description: string;
  color: string;
  icon: AppIconName;
};

export type ConditionOption = {
  value: IncidentConditionStatus;
  label: string;
  description: string;
  color: string;
  icon: AppIconName;
};
