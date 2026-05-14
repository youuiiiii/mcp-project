import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/layout";
import { typography } from "../theme/typography";
import { IncidentReport } from "../types/incident";

type IncidentTrustBadgeVariant = "compact" | "full";

type IncidentTrustLevel = "verified" | "disputed" | "pending";

type IncidentTrustBadgeProps = {
  incident: IncidentReport;
  variant?: IncidentTrustBadgeVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function IncidentTrustBadge({
  incident,
  variant = "compact",
  style,
  textStyle,
}: IncidentTrustBadgeProps) {
  const trust = getTrustMeta(incident);

  if (variant === "full") {
    return (
      <View
        style={[
          styles.fullContainer,
          {
            backgroundColor: trust.backgroundColor,
            borderColor: trust.color,
          },
          style,
        ]}
      >
        <View
          style={[
            styles.fullIconBox,
            {
              backgroundColor: trust.color,
            },
          ]}
        >
          <Text style={styles.fullIcon}>{trust.icon}</Text>
        </View>

        <View style={styles.fullContent}>
          <Text
            style={[
              styles.fullTitle,
              {
                color: trust.color,
              },
              textStyle,
            ]}
            numberOfLines={1}
          >
            {trust.label}
          </Text>

          <Text style={styles.fullDescription}>{trust.description}</Text>

          <Text style={styles.fullMeta}>{getTrustSummary(incident)}</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.compactContainer,
        {
          backgroundColor: trust.backgroundColor,
          borderColor: trust.color,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.compactText,
          {
            color: trust.color,
          },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {trust.icon} {trust.shortLabel}
      </Text>
    </View>
  );
}

function getTrustMeta(incident: IncidentReport): {
  level: IncidentTrustLevel;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  color: string;
  backgroundColor: string;
} {
  const verificationCount = incident.verificationCount ?? 0;
  const disputeCount = incident.disputeCount ?? 0;

  if (
    incident.verificationStatus === "verified" ||
    (verificationCount >= 2 && verificationCount > disputeCount)
  ) {
    return {
      level: "verified",
      label: "Community Verified",
      shortLabel: "Verified",
      description:
        "Laporan ini sudah mendapatkan dukungan verifikasi dari warga sekitar.",
      icon: "✓",
      color: colors.success,
      backgroundColor: colors.successSoft,
    };
  }

  if (
    incident.verificationStatus === "disputed" ||
    (disputeCount >= 2 && disputeCount >= verificationCount)
  ) {
    return {
      level: "disputed",
      label: "Needs Review",
      shortLabel: "Disputed",
      description:
        "Ada bantahan atau laporan tidak sesuai dari warga. Perlu dicek lagi di timeline.",
      icon: "!",
      color: colors.danger,
      backgroundColor: colors.dangerSoft,
    };
  }

  return {
    level: "pending",
    label: "Pending Verification",
    shortLabel: "Pending",
    description:
      "Laporan belum punya cukup verifikasi komunitas. Buka timeline untuk melihat bukti dan update.",
    icon: "?",
    color: colors.warningDark,
    backgroundColor: colors.warningSoft,
  };
}

function getTrustSummary(incident: IncidentReport) {
  const verificationCount = incident.verificationCount ?? 0;
  const disputeCount = incident.disputeCount ?? 0;
  const evidenceCount = incident.evidenceCount ?? 0;

  return `${verificationCount} verifikasi benar · ${disputeCount} bantahan · ${evidenceCount} bukti tambahan`;
}

const styles = StyleSheet.create({
  compactContainer: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    maxWidth: "100%",
  },
  compactText: {
    ...typography.label,
  },
  fullContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius["2xl"],
    padding: spacing.md,
  },
  fullIconBox: {
    width: 42,
    height: 42,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  fullIcon: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.textInverse,
  },
  fullContent: {
    flex: 1,
  },
  fullTitle: {
    fontSize: 14,
    fontWeight: "900",
  },
  fullDescription: {
    marginTop: 5,
    ...typography.caption,
    color: "#475569",
  },
  fullMeta: {
    marginTop: spacing.sm,
    fontSize: 11,
    fontWeight: "700",
    color: colors.textMuted,
    lineHeight: 17,
  },
});