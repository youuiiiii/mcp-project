import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import AppButton from "../../../components/ui/AppButton";
import StatusBadge from "../../../components/ui/StatusBadge";
import { getIncidentDisplayMeta } from "../../../constants/incident";
import { colors } from "../../../theme/colors";
import type { IncidentReport } from "../../../types/incident";
import { getIncidentConfidenceMeta } from "../../../utils/incidentConfidence";
import { getIncidentFreshnessMeta } from "../../../utils/incidentFreshness";
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

  const author = incident.reportedBy || incident.reporterEmail || "Anonymous";
  const confidence = getIncidentConfidenceMeta(incident);
  const freshness = getIncidentFreshnessMeta(incident);
  const urgencyLevel = incident.urgencyLevel ?? incident.severity;
  const urgencyLabel =
    typeof incident.urgencyScore === "number"
      ? `Urgency ${incident.urgencyScore}`
      : `${getUrgencyLevelLabel(urgencyLevel)} urgency`;
  const latestUpdate = incident.latestCommunityUpdateType
    ? getCommunityUpdateMeta(incident.latestCommunityUpdateType)
    : null;

  return (
    <View style={styles.post}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={18} color={colors.textInverse} />
      </View>

      <View style={styles.body}>
        <View style={styles.authorRow}>
          <Text style={styles.authorName} numberOfLines={1}>
            {author}
          </Text>

          <Text style={styles.dot}>-</Text>

          <Text style={styles.timeText} numberOfLines={1}>
            {formatIncidentDate(incident.createdAt)}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <View
            style={[
              styles.categoryPill,
              {
                backgroundColor: meta.lightColor,
              },
            ]}
          >
            <Ionicons name={meta.iconName} size={14} color={meta.color} />
            <Text
              style={[
                styles.categoryText,
                {
                  color: meta.color,
                },
              ]}
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

          <StatusBadge
            label={urgencyLabel}
            variant={getUrgencyVariant(urgencyLevel)}
            size="sm"
          />
        </View>

        <Text style={styles.title}>{incident.title}</Text>

        <Text style={styles.description}>
          {incident.description || "No description provided."}
        </Text>

        <IncidentImpactSummary impactAnswers={incident.impactAnswers} />

        <IncidentImageGallery
          imageUri={incident.imageUri}
          imageUris={incident.imageUris}
          variant="detail"
        />

        <View
          style={[
            styles.signalNotice,
            {
              backgroundColor: confidence.backgroundColor,
              borderColor: confidence.borderColor,
            },
          ]}
        >
          <View style={styles.scoreDial}>
            <Text style={[styles.scoreText, { color: confidence.color }]}>
              {confidence.score}
            </Text>
          </View>

          <View style={styles.signalTextGroup}>
            <Text
              style={[
                styles.signalTitle,
                {
                  color: confidence.color,
                },
              ]}
            >
              {confidence.label}
            </Text>

            <Text style={styles.signalDescription}>
              {confidence.description}
            </Text>

            <Text style={styles.freshnessText}>{freshness.message}</Text>

            {latestUpdate ? (
              <View style={styles.latestUpdateRow}>
                <Ionicons
                  name={latestUpdate.iconName}
                  size={14}
                  color={latestUpdate.color}
                />
                <Text style={styles.latestUpdateText} numberOfLines={2}>
                  Latest community update: {latestUpdate.label}
                </Text>
              </View>
            ) : null}

            <View style={styles.signalGrid}>
              {confidence.signals.map((signal) => (
                <View key={signal.label} style={styles.signalItem}>
                  <Text style={styles.signalValue}>{signal.value}</Text>
                  <Text style={styles.signalLabel}>{signal.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Text style={styles.disclaimer}>
          This report comes from the community and may not be official
          information. Treat it as an early signal and stay careful on site.
        </Text>

        {showActions && incident.status === "active" ? (
          <View style={styles.actionRow}>
            {onOpenVerify ? (
              <AppButton
                title="Verify / Update"
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
                title="Resolve"
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
          <Text style={styles.reportContentText}>Report Content</Text>
        </Pressable>
      </View>
    </View>
  );
}
