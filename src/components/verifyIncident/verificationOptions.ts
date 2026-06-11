import { colors } from "../../theme/colors";
import type { ConditionOption, VerificationOption } from "./types";

export const VERIFICATION_OPTIONS: VerificationOption[] = [
  {
    value: "valid",
    label: "thread.verification.opt.valid.label",
    description: "thread.verification.opt.valid.desc",
    color: colors.success,
    icon: "checkmark-circle",
  },
  {
    value: "condition_update",
    label: "thread.verification.opt.update.label",
    description: "thread.verification.opt.update.desc",
    color: colors.warning,
    icon: "sync-circle",
  },
  {
    value: "invalid",
    label: "thread.verification.opt.invalid.label",
    description: "thread.verification.opt.invalid.desc",
    color: colors.danger,
    icon: "close-circle",
  },
];

export const CONDITION_OPTIONS: ConditionOption[] = [
  {
    value: "still_happening",
    label: "thread.condition.opt.still_happening.label",
    description: "thread.condition.opt.still_happening.desc",
    color: colors.warning,
    icon: "radio",
  },
  {
    value: "getting_worse",
    label: "thread.condition.opt.getting_worse.label",
    description: "thread.condition.opt.getting_worse.desc",
    color: colors.danger,
    icon: "trending-up",
  },
  {
    value: "partially_resolved",
    label: "thread.condition.opt.partially_resolved.label",
    description: "thread.condition.opt.partially_resolved.desc",
    color: colors.info,
    icon: "construct",
  },
  {
    value: "resolved_but_not_closed",
    label: "thread.condition.opt.resolved.label",
    description: "thread.condition.opt.resolved.desc",
    color: colors.success,
    icon: "checkmark-done",
  },
  {
    value: "not_found",
    label: "thread.condition.opt.not_found.label",
    description: "thread.condition.opt.not_found.desc",
    color: colors.textMuted,
    icon: "search",
  },
];
