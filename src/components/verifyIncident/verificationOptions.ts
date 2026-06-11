import { colors } from "../../theme/colors";
import type { ConditionOption, VerificationOption } from "./types";

export const VERIFICATION_OPTIONS: VerificationOption[] = [
  {
    value: "valid",
    label: "Confirm",
    description: "I can see this incident is real and accurate.",
    color: colors.success,
    icon: "checkmark-circle",
  },
  {
    value: "condition_update",
    label: "Update Condition",
    description: "The incident exists, but the condition needs updating.",
    color: colors.warning,
    icon: "sync-circle",
  },
  {
    value: "invalid",
    label: "Inaccurate",
    description: "I could not find the incident as reported.",
    color: colors.danger,
    icon: "close-circle",
  },
];

export const CONDITION_OPTIONS: ConditionOption[] = [
  {
    value: "still_happening",
    label: "Still Happening",
    description: "The incident is still ongoing at this location.",
    color: colors.warning,
    icon: "radio",
  },
  {
    value: "getting_worse",
    label: "Getting Worse",
    description: "The condition appears to be worsening.",
    color: colors.danger,
    icon: "trending-up",
  },
  {
    value: "partially_resolved",
    label: "Improving",
    description: "The condition is improving but not fully resolved.",
    color: colors.info,
    icon: "construct",
  },
  {
    value: "resolved_but_not_closed",
    label: "Appears Resolved",
    description: "The incident appears to be fully resolved.",
    color: colors.success,
    icon: "checkmark-done",
  },
  {
    value: "not_found",
    label: "Not Found",
    description: "No incident is visible around this location.",
    color: colors.textMuted,
    icon: "search",
  },
];
