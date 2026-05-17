import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colors } from "../theme/colors";
import { spacing } from "../theme/layout";
import type { IncidentReport } from "../types/incident";
import {
  getIncidentTrustMeta,
  type IncidentTrustLevel,
} from "../utils/incidentTrust";
import StatusBadge from "./ui/StatusBadge";

type StatusBadgeVariant = ComponentProps<typeof StatusBadge>["variant"];
type IoniconName = ComponentProps<typeof Ionicons>["name"];

type IncidentTrustBadgeVariant = "default" | "compact";

type IncidentTrustBadgeProps = {
  incident: IncidentReport;
  variant?: IncidentTrustBadgeVariant;
  style?: StyleProp<ViewStyle>;
};

type TrustBadgeUiMeta = {
  iconName: IoniconName;
  badgeVariant: StatusBadgeVariant;
};

const TRUST_BADGE_UI_META = {
  pending: {
    iconName: "time-outline",
    badgeVariant: "warning",
  },
  verified: {
    iconName: "shield-checkmark-outline",
    badgeVariant: "success",
  },
  disputed: {
    iconName: "alert-circle-outline",
    badgeVariant: "danger",
  },
  resolved: {
    iconName: "checkmark-done-circle-outline",
    badgeVariant: "success",
  },
} as const satisfies Record<IncidentTrustLevel, TrustBadgeUiMeta>;

export default function IncidentTrustBadge({
  incident,
  variant = "default",
  style,
}: IncidentTrustBadgeProps) {
  const trustMeta = getIncidentTrustMeta(incident);
  const uiMeta = TRUST_BADGE_UI_META[trustMeta.level];
  const isCompact = variant === "compact";

  return (
    <View
      style={[styles.container, style]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${trustMeta.label}. ${trustMeta.description}`}
    >
      <Ionicons
        name={uiMeta.iconName}
        size={isCompact ? 14 : 16}
        color={colors.textSoft}
      />

      <StatusBadge
        label={isCompact ? trustMeta.shortLabel : trustMeta.label}
        variant={uiMeta.badgeVariant}
        size={isCompact ? "sm" : "md"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
});