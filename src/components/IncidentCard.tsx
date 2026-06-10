import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type PublicTrustStatus =
  | "unverified"
  | "gainingTrust"
  | "communityVerified"
  | "moderatorConfirmed"
  | "resolved";

type PublicTrustMeta = {
  labelKey: TranslationKey;
  variant: StatusBadgeVariant;
  iconName: IoniconName;
};

const TRUST_META: Record<PublicTrustStatus, PublicTrustMeta> = {
  unverified: {
    labelKey: "incident.trust.unverified",
    variant: "neutral",
    iconName: "time-outline",
  },
  gainingTrust: {
    labelKey: "incident.trust.gainingTrust",
    variant: "info",
    iconName: "sparkles-outline",
  },
  communityVerified: {
    labelKey: "incident.trust.communityVerified",
    variant: "verified",
    iconName: "shield-checkmark-outline",
  },
  moderatorConfirmed: {
    labelKey: "incident.trust.moderatorConfirmed",
    variant: "verified",
    iconName: "checkmark-circle-outline",
  },
  resolved: {
    labelKey: "incident.trust.resolved",
    variant: "resolved",
    iconName: "checkmark-done-circle-outline",
  },
};

export default function IncidentCard({
  incident,
  onPress,
  showImage = true,
  compact = false,
  variant = "default",
}: IncidentCardProps) {
  const { language, t } = useI18n();
  const isHomeVariant = compact || variant === "home";
  const meta = getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });
  const subcategory = incident.subcategory ?? incident.type ?? null;
  const categoryLabel = subcategory
    ? getIncidentSubcategoryLabel(t, subcategory)
    : getIncidentCategoryLabel(t, incident.category);
  const trust = getPublicTrustMeta(incident);
  const confirmationCount = getCommunityConfirmationCount(incident);
  const title = incident.title?.trim() || t("incident.card.untitled");
  const description = incident.description?.trim();
  const dateLabel = formatDate(
    incident.createdAt,
    language,
    t("incident.card.timeUnavailable")
  );
  const metaItems = [categoryLabel, incident.address, dateLabel].filter(
    (item): item is string => Boolean(item)
  );

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

  const isHighSeverity = (incident.urgencyLevel ?? incident.severity) === "high";

  return (
    <AppCard
      onPress={onPress ? () => onPress(incident) : undefined}
      style={[
        styles.card,
        isHomeVariant && styles.homeCard,
        isHighSeverity && styles.highSeverityCard,
      ]}
    >
      <View style={[styles.header, isHomeVariant && styles.homeHeader]}>
        <IconBadge
          variant="neutral"
          size={isHomeVariant ? "md" : "lg"}
          rounded={true}
          style={{
            backgroundColor: meta.lightColor,
            borderColor: meta.lightColor,
          }}
        >
          <Ionicons
            name={meta.iconName}
            size={isHomeVariant ? 19 : 24}
            color={meta.color}
          />
        </IconBadge>

        <View style={styles.headerContent}>
          <Text
            style={[styles.title, isHomeVariant && styles.homeTitle]}
            numberOfLines={1}
          >
            {title}
          </Text>

          <Text
            style={[styles.metaText, isHomeVariant && styles.homeMetaText]}
            numberOfLines={1}
          >
            {metaItems.join(" - ")}
          </Text>
        </View>
      </View>

      <View style={[styles.trustRow, isHomeVariant && styles.homeTrustRow]}>
        <View style={styles.trustLabelGroup}>
          <Ionicons
            name={trust.iconName}
            size={isHomeVariant ? 14 : 16}
            color={getTrustIconColor(trust.variant)}
          />
          <StatusBadge label={t(trust.labelKey)} variant={trust.variant} size="sm" />
        </View>

        {confirmationCount > 0 ? (
          <Text style={styles.confirmationText} numberOfLines={1}>
            {t(getConfirmationKey(confirmationCount), {
              count: confirmationCount,
            })}
          </Text>
        ) : null}
      </View>

      {description ? (
        <Text
          style={[styles.description, isHomeVariant && styles.homeDescription]}
          numberOfLines={2}
        >
          {description}
        </Text>
      ) : null}

      {showImage ? (
        <View style={isHomeVariant ? styles.homeMediaRow : styles.mediaRow}>
          <View style={styles.imageCol}>
            <IncidentImageGallery
              imageUri={incident.imageUri}
              imageUris={incident.imageUris}
              variant="compact"
              style={isHomeVariant ? styles.homeImageOverride : styles.galleryImageOverride}
            />
          </View>

          <View style={isHomeVariant ? styles.homeMapCol : styles.mapCol}>
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
              rotateEnabled={false}
              pitchEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: incident.latitude,
                  longitude: incident.longitude,
                }}
                pinColor={colors.danger}
              />
            </MapView>
          </View>
        </View>
      ) : null}

      <View style={[styles.footer, isHomeVariant && styles.homeFooter]}>
        <View style={styles.dateWrap}>
          <Ionicons name="time-outline" size={14} color={colors.textSoft} />
          <Text style={styles.date} numberOfLines={1}>
            {dateLabel}
          </Text>
        </View>

        <TouchableOpacity
          accessibilityLabel={t("incident.card.share")}
          accessibilityRole="button"
          hitSlop={8}
          onPress={handleShare}
          style={styles.shareBtn}
        >
          <Ionicons name="share-social-outline" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </AppCard>
  );
}

function formatDate(
  date: Date | undefined,
  language: string,
  fallback: string
): string {
  if (!date) {
    return fallback;
  }

  return date.toLocaleString(language === "id" ? "id-ID" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getPublicTrustMeta(incident: IncidentReport): PublicTrustMeta {
  if (incident.status === "resolved" || incident.resolvedAt) {
    return TRUST_META.resolved;
  }

  if (incident.moderationStatus === "visible" && incident.moderatedBy) {
    return TRUST_META.moderatorConfirmed;
  }

  const verificationCount = getSafeCount(incident.verificationCount);
  const disputeCount = getSafeCount(incident.disputeCount);

  if (
    incident.verificationStatus === "verified" ||
    incident.trustStatus === "community_confirmed" ||
    (verificationCount >= 2 && verificationCount > disputeCount)
  ) {
    return TRUST_META.communityVerified;
  }

  const hasPositiveCommunitySignals =
    verificationCount +
      getSafeCount(incident.accurateCount) +
      getSafeCount(incident.evidenceCount) >
    disputeCount + getSafeCount(incident.inaccurateCount);

  if (hasPositiveCommunitySignals) {
    return TRUST_META.gainingTrust;
  }

  return TRUST_META.unverified;
}

function getSafeCount(value?: number | null): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, value);
}

function getCommunityConfirmationCount(incident: IncidentReport) {
  return getSafeCount(incident.verificationCount) + getSafeCount(incident.accurateCount);
}

function getConfirmationKey(count: number): TranslationKey {
  return count === 1
    ? "incident.card.confirmationCount.one"
    : "incident.card.confirmationCount.other";
}

function getTrustIconColor(variant: StatusBadgeVariant) {
  if (variant === "verified" || variant === "resolved" || variant === "success") {
    return colors.success;
  }

  if (variant === "info") {
    return colors.info;
  }

  if (variant === "warning" || variant === "pending") {
    return colors.warning;
  }

  if (variant === "danger" || variant === "disputed") {
    return colors.danger;
  }

  return colors.textSoft;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,                         // 12px Terra card radius
    gap: spacing.md,
  },
  homeCard: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  homeHeader: {
    gap: spacing.sm,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    ...typography.cardTitle,
    fontWeight: "700",                              // Terra headline weight
    color: colors.text,
  },
  homeTitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",                              // Terra headline weight
  },
  metaText: {
    marginTop: 3,
    ...typography.caption,
    fontWeight: "700",                              // Terra label weight for metadata
    color: colors.textMuted,
  },
  homeMetaText: {
    fontSize: 11,
    lineHeight: 15,
  },
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  homeTrustRow: {
    gap: spacing.sm,
  },
  trustLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  confirmationText: {
    flex: 1,
    textAlign: "right",
    ...typography.caption,
    fontWeight: "700",                              // Terra label weight
    color: colors.textMuted,
  },
  description: {
    ...typography.caption,
    fontWeight: "500",                              // Terra body weight
    color: colors.textMuted,
  },
  homeDescription: {
    fontSize: 11,
    lineHeight: 16,
  },
  homeImage: {
    marginTop: spacing.xs,
    height: 132,
    borderRadius: radius.md,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "rgba(196, 200, 188, 0.3)",     // outline-variant at 30%
  },
  homeFooter: {
    paddingTop: spacing.xs,
  },
  dateWrap: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 5,
  },
  date: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "700",                              // Terra label weight
    color: colors.textSoft,
  },
  shareBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  highSeverityCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  mediaRow: {
    flexDirection: "row",
    gap: spacing.sm,
    height: 120,
    width: "100%",
    marginTop: spacing.xs,
  },
  homeMediaRow: {
    flexDirection: "row",
    gap: spacing.xs,
    height: 90,
    width: "100%",
    marginTop: spacing.xs,
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
  homeImageOverride: {
    marginTop: 0,
    height: "100%",
    borderRadius: radius.md,
  },
  mapCol: {
    width: 120,
    height: "100%",
    borderRadius: radius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(196, 200, 188, 0.3)",
  },
  homeMapCol: {
    width: 90,
    height: "100%",
    borderRadius: radius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(196, 200, 188, 0.3)",
  },
  miniMap: {
    flex: 1,
  },
});
