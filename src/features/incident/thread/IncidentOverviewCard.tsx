import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View, StyleSheet } from "react-native";
import AppButton from "../../../components/ui/AppButton";
import { getIncidentDisplayMeta } from "../../../constants/incident";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import type { IncidentReport } from "../../../types/incident";
import IncidentImageGallery from "../components/IncidentImageGallery";
import { formatIncidentDate } from "./threadLabels";

type IncidentOverviewCardProps = {
  incident: IncidentReport;
  onReportContent: () => void;
  showActions?: boolean;
  onOpenVerify?: (incident: IncidentReport) => void;
  onOpenResolve?: (incident: IncidentReport) => void;
};

export default function IncidentOverviewCard({
  incident,
  onReportContent,
  showActions = true,
  onOpenVerify,
  onOpenResolve,
}: IncidentOverviewCardProps) {
  const meta = getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });

  const author = incident.reportedBy || incident.reporterEmail || "User";
  const urgencyScore = incident.urgencyScore ?? 20;
  
  let urgencyColor: string = colors.info;
  let severityLabel = "Low Severity";
  if (urgencyScore >= 70) {
    urgencyColor = colors.danger;
    severityLabel = "High Severity";
  } else if (urgencyScore >= 38) {
    urgencyColor = colors.warning;
    severityLabel = "Medium Severity";
  }

  const verifications = incident.verificationCount ?? 0;
  const disputes = incident.disputeCount ?? 0;
  const accurate = incident.accurateCount ?? 0; // if used
  const totalConfirmations = verifications + accurate;

  const address = incident.address || `${incident.latitude.toFixed(4)}, ${incident.longitude.toFixed(4)}`;

  return (
    <View style={styles.container}>
      {/* MASSIVE URGENCY HEADER */}
      <View style={[styles.urgencyHeader, { backgroundColor: urgencyColor }]}>
        <Ionicons name="warning" size={24} color={colors.textInverse} />
        <Text style={styles.urgencyHeaderText}>{severityLabel}</Text>
      </View>

      <View style={styles.contentPadding}>
        <View style={styles.topMeta}>
          <View style={[styles.categoryBadge, { backgroundColor: meta.lightColor }]}>
            <Ionicons name={meta.iconName} size={14} color={meta.color} />
            <Text style={[styles.categoryText, { color: meta.color }]}>{meta.label}</Text>
          </View>
          <Text style={styles.timeText}>{formatIncidentDate(incident.createdAt)}</Text>
        </View>

        <Text style={styles.title}>{incident.title || "Incident Report"}</Text>

        <View style={styles.locationBox}>
          <Ionicons name="location" size={18} color={colors.textMuted} />
          <Text style={styles.locationBoxText}>{address}</Text>
        </View>

        {incident.description && !incident.description.includes("reported near the selected map pin") && (
          <Text style={styles.description}>{incident.description}</Text>
        )}

        <IncidentImageGallery
          imageUri={incident.imageUri}
          imageUris={incident.imageUris}
          variant="detail"
          style={styles.gallery}
        />

        {/* TRUST STATE MODULE */}
        <View style={styles.trustModule}>
          <Text style={styles.trustModuleTitle}>Community Trust State</Text>
          <View style={styles.trustRow}>
            <View style={styles.trustStat}>
              <Ionicons name="shield-checkmark" size={20} color={colors.success} />
              <Text style={styles.trustStatNumber}>{totalConfirmations}</Text>
              <Text style={styles.trustStatLabel}>Confirmations</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustStat}>
              <Ionicons name="warning-outline" size={20} color={colors.danger} />
              <Text style={styles.trustStatNumber}>{disputes}</Text>
              <Text style={styles.trustStatLabel}>Disputes</Text>
            </View>
          </View>
        </View>

        {/* ACTIONS */}
        {showActions && incident.status === "active" && (
          <View style={styles.actionBlock}>
            {onOpenVerify && (
              <AppButton
                title="Verify / Dispute"
                variant="primary"
                size="lg"
                fullWidth
                onPress={() => onOpenVerify(incident)}
                leftIcon={<Ionicons name="shield-checkmark" size={20} color={colors.textInverse} />}
                style={styles.primaryAction}
              />
            )}
            {onOpenResolve && (
              <AppButton
                title="Resolve Incident"
                variant="secondary"
                size="lg"
                fullWidth
                onPress={() => onOpenResolve(incident)}
                leftIcon={<Ionicons name="checkmark-done" size={20} color={colors.text} />}
                style={styles.secondaryAction}
              />
            )}
          </View>
        )}

        <Pressable onPress={onReportContent} style={styles.reportContentRow}>
          <Ionicons name="flag-outline" size={16} color={colors.textSoft} />
          <Text style={styles.reportContentText}>Report inappropriate content</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
  },
  urgencyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  urgencyHeaderText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  contentPadding: {
    padding: spacing.lg,
  },
  topMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "700",
  },
  timeText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    lineHeight: 28,
    marginBottom: spacing.md,
  },
  locationBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
  },
  locationBoxText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
    lineHeight: 20,
  },
  description: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  gallery: {
    marginBottom: spacing.md,
  },
  trustModule: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  trustModuleTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    marginBottom: spacing.md,
    textAlign: "center",
  },
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  trustStat: {
    alignItems: "center",
    flex: 1,
    gap: 4,
  },
  trustDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  trustStatNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  trustStatLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSoft,
  },
  actionBlock: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  primaryAction: {
    backgroundColor: "#00A3C4", // Teal reference color
    height: 52, // massive operational button
  },
  secondaryAction: {
    height: 52,
  },
  reportContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: spacing.md,
  },
  reportContentText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSoft,
  },
});
