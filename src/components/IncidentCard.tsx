import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Pressable } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { getIncidentDisplayMeta } from "../constants/incident";
import IncidentImageGallery from "../features/incident/components/IncidentImageGallery";
import {
  getIncidentCategoryLabel,
  getIncidentSubcategoryLabel,
  type TranslationKey,
  useI18n,
} from "../i18n";
import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/layout";
import { typography } from "../theme/typography";
import type { IncidentReport } from "../types/incident";
import { shareIncident } from "../utils/shareIncident";
import AppCard from "./ui/AppCard";
import IconBadge from "./ui/IconBadge";
import StatusBadge, { type StatusBadgeVariant } from "./ui/StatusBadge";

type IncidentCardProps = {
  incident: IncidentReport;
  onPress?: (incident: IncidentReport) => void;
  showImage?: boolean;
  compact?: boolean;
  variant?: "default" | "home";
};

export default function IncidentCard({
  incident,
  onPress,
  showImage = true,
  compact = false,
  variant = "default",
}: IncidentCardProps) {
  const { language, t } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);

  const meta = getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });
  
  const title = incident.title?.trim() || t("incident.card.untitled");
  const description = incident.description?.trim();
  const dateLabel = formatDate(
    incident.createdAt,
    language,
    t("incident.card.timeUnavailable")
  );

  const urgencyScore = incident.urgencyScore ?? 20;
  let urgencySegments = 1;
  let urgencyColor: string = colors.success;
  let urgencyLabel = "Urgensi Rendah";

  if (urgencyScore >= 70) {
    urgencySegments = 3;
    urgencyColor = colors.danger;
    urgencyLabel = "Urgensi Tinggi";
  } else if (urgencyScore >= 38) {
    urgencySegments = 2;
    urgencyColor = colors.warning;
    urgencyLabel = "Urgensi Sedang";
  }

  const handleShare = () => {
    shareIncident({
      type: title,
      description: incident.description,
      location: {
        lat: incident.latitude,
        lng: incident.longitude,
      },
      createdAt: incident.createdAt,
    });
  };

  const verifications = incident.verificationCount ?? 0;
  const disputes = incident.disputeCount ?? 0;
  const totalVotes = verifications + disputes;
  const consensusRatio = totalVotes > 0 ? verifications / totalVotes : 0;
  
  const renderUrgencyBar = () => (
    <View style={styles.urgencyContainer}>
      <View style={styles.urgencySegmentRow}>
        <View style={[styles.urgencySegment, { backgroundColor: urgencySegments >= 1 ? urgencyColor : colors.surfaceContainerHigh }]} />
        <View style={[styles.urgencySegment, { backgroundColor: urgencySegments >= 2 ? urgencyColor : colors.surfaceContainerHigh }]} />
        <View style={[styles.urgencySegment, { backgroundColor: urgencySegments >= 3 ? urgencyColor : colors.surfaceContainerHigh }]} />
      </View>
      <Text style={[styles.urgencyLabel, { color: urgencyColor }]}>Urgensi {urgencyLabel}</Text>
    </View>
  );

  const renderConsensusBar = () => {
    if (totalVotes === 0) {
      return (
        <View style={styles.consensusContainer}>
          <Text style={styles.consensusText}>Belum ada konfirmasi dari komunitas.</Text>
        </View>
      );
    }
    if (verifications > disputes) {
      return (
        <View style={styles.consensusContainer}>
          <Text style={styles.consensusText}>
            {verifications} orang mengonfirmasi laporan ini.
          </Text>
        </View>
      );
    }
    if (disputes > verifications) {
      return (
        <View style={styles.consensusContainer}>
          <Text style={styles.consensusText}>
            Beberapa pengguna mempertanyakan keakuratan laporan ini.
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.consensusContainer}>
        <Text style={styles.consensusText}>Respons komunitas masih berimbang.</Text>
      </View>
    );
  };

  return (
    <AppCard
      onPress={() => setIsExpanded(!isExpanded)}
      style={[
        styles.card,
        urgencySegments === 3 && styles.highSeverityCard,
      ]}
    >
      <View style={styles.header}>
        <IconBadge
          variant="neutral"
          size="md"
          rounded={true}
          style={{
            backgroundColor: meta.lightColor,
            borderColor: meta.lightColor,
          }}
        >
          <Ionicons name={meta.iconName} size={20} color={meta.color} />
        </IconBadge>

        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{meta.label}</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.metaText}>{dateLabel}</Text>
          </View>
        </View>

        {renderUrgencyBar()}
      </View>

      {isExpanded && (
        <View style={styles.expandedContent}>
          {description && !description.includes("reported near the selected map pin") && !description.includes("No additional impact") ? (
            <Text style={styles.description}>{description}</Text>
          ) : null}

          {showImage && (
            <View style={styles.mediaRow}>
              <View style={styles.imageCol}>
                <IncidentImageGallery
                  imageUri={incident.imageUri}
                  imageUris={incident.imageUris}
                  variant="compact"
                  style={styles.galleryImageOverride}
                />
              </View>

              <View style={styles.mapCol}>
                <MapView
                  liteMode
                  style={styles.miniMap}
                  initialRegion={{
                    latitude: incident.latitude,
                    longitude: incident.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                >
                  <Marker coordinate={{ latitude: incident.latitude, longitude: incident.longitude }} pinColor={colors.danger} />
                </MapView>
              </View>
            </View>
          )}

          {renderConsensusBar()}

          <View style={styles.actionRow}>
            <Pressable style={[styles.actionChip, { backgroundColor: `${colors.success}15`, borderColor: colors.success }]} onPress={() => {}}>
              <Text style={[styles.actionChipText, { color: colors.successDark }]}>👍 Sesuai</Text>
            </Pressable>
            <Pressable style={[styles.actionChip, { backgroundColor: `${colors.danger}15`, borderColor: colors.danger }]} onPress={() => {}}>
              <Text style={[styles.actionChipText, { color: colors.dangerDark }]}>👎 Salah</Text>
            </Pressable>
            
            <View style={{ flex: 1 }} />
            
            {onPress && (
              <Pressable style={styles.primaryBtn} onPress={() => onPress(incident)}>
                <Text style={styles.primaryBtnText}>Lihat Detail</Text>
              </Pressable>
            )}
          </View>
        </View>
      )}
    </AppCard>
  );
}

function formatDate(date: Date | undefined, language: string, fallback: string): string {
  if (!date) return fallback;
  return date.toLocaleString(language === "id" ? "id-ID" : "en-US", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  highSeverityCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
  },
  dotSeparator: {
    fontSize: 10,
    color: colors.textSoft,
  },
  urgencyContainer: {
    alignItems: "flex-end",
    gap: 4,
  },
  urgencySegmentRow: {
    flexDirection: "row",
    gap: 3,
  },
  urgencySegment: {
    width: 12,
    height: 4,
    borderRadius: 2,
  },
  urgencyLabel: {
    fontSize: 10,
    fontWeight: "800",
  },
  expandedContent: {
    marginTop: spacing.md,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainer,
    paddingTop: spacing.md,
  },
  description: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textMuted,
    lineHeight: 18,
  },
  mediaRow: {
    flexDirection: "row",
    gap: spacing.sm,
    height: 100,
    width: "100%",
  },
  imageCol: {
    flex: 1,
    height: "100%",
  },
  galleryImageOverride: {
    marginTop: 0,
    height: "100%",
    borderRadius: radius.md,
  },
  mapCol: {
    width: 100,
    height: "100%",
    borderRadius: radius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(196, 200, 188, 0.3)",
  },
  miniMap: {
    flex: 1,
  },
  consensusContainer: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  consensusText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  actionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  actionChipText: {
    fontSize: 12,
    fontWeight: "700",
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.md,
  },
  primaryBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textInverse,
  },
});
