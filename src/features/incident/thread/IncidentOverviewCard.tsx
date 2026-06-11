import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import AppButton from "../../../components/ui/AppButton";
import StatusBadge from "../../../components/ui/StatusBadge";
import { getIncidentDisplayMeta } from "../../../constants/incident";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import type { IncidentReport } from "../../../types/incident";
import { getIncidentConfidenceMeta } from "../../../utils/incidentConfidence";
import IncidentImpactSummary from "../components/IncidentImpactSummary";
import IncidentImageGallery from "../components/IncidentImageGallery";
import {
  getUrgencyLevelLabel,
  getUrgencyVariant,
} from "./incidentOverviewMeta";
import { incidentOverviewStyles as styles } from "./incidentOverviewStyles";
import {
  formatIncidentDate,
  getCommunityUpdateMeta,
  getStatusLabel,
  getStatusVariant,
} from "./threadLabels";
import { StyleSheet } from "react-native";

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

  const author = incident.reportedBy || incident.reporterEmail || "Pengguna";
  const confidence = getIncidentConfidenceMeta(incident);
  const urgencyLevel = incident.urgencyLevel ?? incident.severity;
  const latestUpdate = incident.latestCommunityUpdateType
    ? getCommunityUpdateMeta(incident.latestCommunityUpdateType)
    : null;

  // Determine community trust indicator — human language only, no raw numbers
  const getCommunitySignalText = () => {
    const verif = incident.verificationCount ?? 0;
    const dispute = incident.disputeCount ?? 0;
    const accurate = incident.accurateCount ?? 0;
    const total = verif + dispute + accurate;

    if (total === 0) return "Belum ada konfirmasi komunitas.";
    if (verif + accurate > dispute) return `${verif + accurate} orang mengonfirmasi laporan ini.`;
    if (dispute > verif + accurate) return "Ada beberapa pengguna yang mempertanyakan laporan ini.";
    return "Respons komunitas masih berimbang.";
  };

  return (
    <View style={styles.post}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={18} color={colors.textInverse} />
      </View>

      <View style={styles.body}>
        {/* Author + time */}
        <View style={styles.authorRow}>
          <Text style={styles.authorName} numberOfLines={1}>
            {author}
          </Text>
          <Text style={styles.dot}>-</Text>
          <Text style={styles.timeText} numberOfLines={1}>
            {formatIncidentDate(incident.createdAt)}
          </Text>
        </View>

        {/* Category + Status pills */}
        <View style={styles.metaRow}>
          <View
            style={[
              styles.categoryPill,
              { backgroundColor: meta.lightColor },
            ]}
          >
            <Ionicons name={meta.iconName} size={14} color={meta.color} />
            <Text
              style={[styles.categoryText, { color: meta.color }]}
              numberOfLines={1}
            >
              {meta.label}
            </Text>
          </View>

          <StatusBadge
            label={getStatusLabel(incident.status)}
            variant={getStatusVariant(incident.status)}
            size="sm"
          />

          {/* Only show urgency as a text label, never a number */}
          {urgencyLevel === "high" && (
            <StatusBadge
              label="Urgensi Tinggi"
              variant="danger"
              size="sm"
            />
          )}
          {urgencyLevel === "medium" && (
            <StatusBadge
              label="Urgensi Sedang"
              variant="warning"
              size="sm"
            />
          )}
        </View>

        {/* Title */}
        <Text style={styles.title}>{incident.title}</Text>

        {/* Description — only show if it exists and isn't auto-generated nonsense */}
        {incident.description && !incident.description.includes("reported near the selected map pin") && (
          <Text style={styles.description}>{incident.description}</Text>
        )}

        {/* Impact flags */}
        <IncidentImpactSummary impactAnswers={incident.impactAnswers} />

        {/* Evidence photo */}
        <IncidentImageGallery
          imageUri={incident.imageUri}
          imageUris={incident.imageUris}
          variant="detail"
        />

        {/* Confidence card — NO raw scores, only human descriptions */}
        <View
          style={[
            localStyles.confidenceCard,
            {
              backgroundColor: confidence.backgroundColor,
              borderColor: confidence.borderColor,
            },
          ]}
        >
          {/* Status icon + label */}
          <View style={localStyles.confidenceHeader}>
            <View style={[localStyles.confidenceIconCircle, { backgroundColor: confidence.color + "20" }]}>
              <Ionicons
                name={
                  confidence.level === "confirmed" ? "shield-checkmark" :
                  confidence.level === "resolved" ? "checkmark-circle" :
                  confidence.level === "questioned" ? "warning" :
                  confidence.level === "stale" ? "time" :
                  "radio-button-on"
                }
                size={20}
                color={confidence.color}
              />
            </View>
            <View style={localStyles.confidenceTitleGroup}>
              <Text style={[localStyles.confidenceLabel, { color: confidence.color }]}>
                {confidence.label}
              </Text>
              <Text style={localStyles.confidenceDesc}>
                {confidence.description}
              </Text>
            </View>
          </View>

          {/* Community signal in plain language */}
          <View style={localStyles.communitySignalRow}>
            <Ionicons name="people-outline" size={14} color={colors.textSoft} />
            <Text style={localStyles.communitySignalText}>
              {getCommunitySignalText()}
            </Text>
          </View>

          {/* Latest condition update (if any) */}
          {latestUpdate && (
            <View style={localStyles.latestUpdateRow}>
              <Ionicons
                name={latestUpdate.iconName}
                size={14}
                color={latestUpdate.color}
              />
              <Text style={localStyles.latestUpdateText} numberOfLines={2}>
                Update terbaru: {latestUpdate.label}
              </Text>
            </View>
          )}
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Laporan ini berasal dari komunitas dan bukan informasi resmi. Gunakan sebagai sinyal awal dan tetap waspada.
        </Text>

        {/* Action buttons */}
        {showActions && incident.status === "active" ? (
          <View style={styles.actionRow}>
            {onOpenVerify ? (
              <AppButton
                title="Konfirmasi / Update"
                variant="primary"
                size="md"
                onPress={() => onOpenVerify(incident)}
                leftIcon={
                  <Ionicons
                    name="shield-checkmark"
                    size={17}
                    color={colors.textInverse}
                  />
                }
                style={styles.actionButton}
              />
            ) : null}

            {onOpenResolve ? (
              <AppButton
                title="Selesai"
                variant="secondary"
                size="md"
                onPress={() => onOpenResolve(incident)}
                leftIcon={
                  <Ionicons
                    name="checkmark-done"
                    size={17}
                    color={colors.text}
                  />
                }
                style={styles.actionButton}
              />
            ) : null}
          </View>
        ) : null}

        {/* Report content button */}
        <Pressable
          onPress={onReportContent}
          style={({ pressed }) => [
            styles.reportContentButton,
            pressed && styles.reportContentPressed,
          ]}
        >
          <Ionicons
            name="flag-outline"
            size={16}
            color={colors.primaryDark}
          />
          <Text style={styles.reportContentText}>Laporkan Konten</Text>
        </Pressable>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  confidenceCard: {
    marginTop: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  confidenceHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  confidenceIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  confidenceTitleGroup: {
    flex: 1,
  },
  confidenceLabel: {
    fontSize: 13,
    fontWeight: "800",
  },
  confidenceDesc: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "500",
    color: colors.textMuted,
  },
  communitySignalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  communitySignalText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
  },
  latestUpdateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  latestUpdateText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
    color: colors.text,
  },
});
