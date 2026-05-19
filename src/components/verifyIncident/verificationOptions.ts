import { colors } from "../../theme/colors";
import type { ConditionOption, VerificationOption } from "./types";

export const VERIFICATION_OPTIONS: VerificationOption[] = [
  {
    value: "valid",
    label: "Confirmed",
    description: "I saw that this incident is real.",
    color: colors.success,
    icon: "checkmark-circle",
  },
  {
    value: "condition_update",
    label: "Condition Update",
    description: "The incident exists, but the condition needs an update.",
    color: colors.warning,
    icon: "sync-circle",
  },
  {
    value: "invalid",
    label: "Not Accurate",
    description: "I could not find an incident matching this report.",
    color: colors.danger,
    icon: "close-circle",
  },
];

export const CONDITION_OPTIONS: ConditionOption[] = [
  {
    value: "still_happening",
    label: "Still Happening",
    description: "The incident is still happening at the location.",
    color: colors.warning,
    icon: "radio",
  },
  {
    value: "getting_worse",
    label: "Getting Worse",
    description: "The condition appears to be getting worse.",
    color: colors.danger,
    icon: "trending-up",
  },
  {
    value: "partially_resolved",
    label: "Improving",
    description: "The condition is improving, but not resolved yet.",
    color: colors.info,
    icon: "construct",
  },
  {
    value: "resolved_but_not_closed",
    label: "Appears Resolved",
    description: "The incident appears resolved, but still needs confirmation.",
    color: colors.success,
    icon: "checkmark-done",
  },
  {
    value: "not_found",
    label: "Not Found",
    description: "The incident was not found around the location.",
    color: colors.textMuted,
    icon: "search",
  },
];
