import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "../../../components/ui/AppButton";
import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import LoadingState from "../../../components/ui/LoadingState";
import SectionHeader from "../../../components/ui/SectionHeader";
import StatusBadge, {
  type StatusBadgeVariant,
} from "../../../components/ui/StatusBadge";
import type { BmkgEarthquake } from "../../../services/bmkgService";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";

type HomeEarthquakeSectionProps = {
  mainEarthquake: BmkgEarthquake | null;
  latestEarthquakes: BmkgEarthquake[];
  loading: boolean;
  errorMessage: string | null;
  onRefresh: () => void;
  onOpenEarthquake: (item: BmkgEarthquake) => void;
};

export default function HomeEarthquakeSection({
  mainEarthquake,
  latestEarthquakes,
  loading,
  errorMessage,
  onRefresh,
  onOpenEarthquake,
}: HomeEarthquakeSectionProps) {
  return (
    <View style={styles.wrapper}>
      <SectionHeader
        title="BMKG Earthquake Updates"
        subtitle="Data resmi gempa terkini"
        style={styles.sectionHeader}
        right={
          <AppButton
            title="Refresh"
            variant="secondary"
            size="sm"
            loading={loading}
            disabled={loading}
            onPress={onRefresh}
            leftIcon={
              <Ionicons name="refresh" size={15} color={colors.text} />
            }
          />
        }
      />

      {loading ? (
        <AppCard style={styles.loadingCard}>
          <LoadingState message="Loading official BMKG data..." />
        </AppCard>
      ) : errorMessage ? (
        <AppCard variant="muted" style={styles.errorCard}>
          <IconBadge variant="danger" size="md" rounded={false}>
            <Ionicons name="warning" size={22} color={colors.danger} />
          </IconBadge>

          <View style={styles.errorContent}>
            <Text style={styles.errorTitle}>BMKG unavailable</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        </AppCard>
      ) : !mainEarthquake ? (
        <AppCard style={styles.emptyCard}>
          <IconBadge variant="info" size="lg" rounded={false}>
            <Ionicons name="earth" size={30} color={colors.info} />
          </IconBadge>

          <Text style={styles.emptyTitle}>No earthquake updates yet</Text>
          <Text style={styles.emptyText}>
            Data gempa resmi akan tampil di sini saat tersedia.
          </Text>
        </AppCard>
      ) : (
        <>
          <FeaturedEarthquakeCard
            earthquake={mainEarthquake}
            onPress={() => onOpenEarthquake(mainEarthquake)}
          />

          {latestEarthquakes.length > 1 ? (
            <View style={styles.miniList}>
              {latestEarthquakes.slice(1).map((item, index) => (
                <MiniEarthquakeCard
                  key={`${item.DateTime ?? index}-${item.Magnitude ?? ""}`}
                  earthquake={item}
                  onPress={() => onOpenEarthquake(item)}
                />
              ))}
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

function FeaturedEarthquakeCard({
  earthquake,
  onPress,
}: {
  earthquake: BmkgEarthquake;
  onPress: () => void;
}) {
  const magnitudeColor = getMagnitudeColor(earthquake.Magnitude);

  return (
    <AppCard onPress={onPress} style={styles.featuredCard}>
      <View style={styles.featuredTop}>
        <View style={styles.featuredInfo}>
          <StatusBadge
            label="Latest Earthquake"
            variant={getMagnitudeVariant(earthquake.Magnitude)}
            size="sm"
            style={styles.featuredBadge}
          />

          <Text style={styles.featuredLocation}>
            {earthquake.Wilayah ?? "Unknown location"}
          </Text>
        </View>

        <View
          style={[
            styles.magnitudeBadge,
            {
              backgroundColor: magnitudeColor,
            },
          ]}
        >
          <Text style={styles.magnitudeLabel}>M</Text>
          <Text style={styles.magnitudeValue}>
            {earthquake.Magnitude ?? "-"}
          </Text>
        </View>
      </View>

      <View style={styles.featuredMetaRow}>
        <MetaItem
          label="Status"
          value={getMagnitudeLabel(earthquake.Magnitude)}
          iconName="pulse"
        />

        <MetaItem
          label="Depth"
          value={earthquake.Kedalaman ?? "-"}
          iconName="navigate"
        />
      </View>

      <AppCard variant="muted" padding="sm" style={styles.timeCard}>
        <Ionicons name="time" size={17} color={colors.danger} />
        <Text style={styles.timeText}>
          {earthquake.Jam ?? "-"}, {earthquake.Tanggal ?? "-"}
        </Text>
      </AppCard>

      <View style={styles.openDetailRow}>
        <Text style={styles.openDetailText}>Open earthquake detail</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.danger} />
      </View>
    </AppCard>
  );
}

function MiniEarthquakeCard({
  earthquake,
  onPress,
}: {
  earthquake: BmkgEarthquake;
  onPress: () => void;
}) {
  const magnitudeColor = getMagnitudeColor(earthquake.Magnitude);

  return (
    <AppCard onPress={onPress} style={styles.miniCard}>
      <View
        style={[
          styles.miniMagnitude,
          {
            backgroundColor: withAlpha(magnitudeColor, "18"),
          },
        ]}
      >
        <Text
          style={[
            styles.miniMagnitudeText,
            {
              color: magnitudeColor,
            },
          ]}
        >
          M {earthquake.Magnitude ?? "-"}
        </Text>
      </View>

      <View style={styles.miniInfo}>
        <Text style={styles.miniTitle} numberOfLines={2}>
          {earthquake.Wilayah ?? "Unknown location"}
        </Text>

        <Text style={styles.miniSubtitle}>
          {earthquake.Jam ?? "-"} - {earthquake.Kedalaman ?? "-"}
        </Text>
      </View>
    </AppCard>
  );
}

function MetaItem({
  label,
  value,
  iconName,
}: {
  label: string;
  value: string;
  iconName: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <AppCard variant="muted" padding="sm" style={styles.metaItem}>
      <Ionicons name={iconName} size={18} color={colors.textMuted} />
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue} numberOfLines={1}>
        {value}
      </Text>
    </AppCard>
  );
}

function getMagnitudeNumber(value?: string): number {
  const magnitude = Number(value);

  return Number.isNaN(magnitude) ? 0 : magnitude;
}

function getMagnitudeColor(value?: string): string {
  const magnitude = getMagnitudeNumber(value);

  if (magnitude >= 7) {
    return colors.dangerDark;
  }

  if (magnitude >= 5) {
    return colors.danger;
  }

  if (magnitude >= 3) {
    return colors.warning;
  }

  return colors.success;
}

function getMagnitudeLabel(value?: string): string {
  const magnitude = getMagnitudeNumber(value);

  if (magnitude >= 7) {
    return "Major";
  }

  if (magnitude >= 5) {
    return "Strong";
  }

  if (magnitude >= 3) {
    return "Moderate";
  }

  return "Light";
}

function getMagnitudeVariant(value?: string): StatusBadgeVariant {
  const magnitude = getMagnitudeNumber(value);

  if (magnitude >= 5) {
    return "danger";
  }

  if (magnitude >= 3) {
    return "warning";
  }

  return "success";
}

function withAlpha(hexColor: string, alpha: string): string {
  if (!hexColor.startsWith("#") || hexColor.length !== 7) {
    return hexColor;
  }

  return `${hexColor}${alpha}`;
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.md,
  },
  sectionHeader: {
    marginBottom: 0,
  },
  loadingCard: {
    minHeight: 110,
    justifyContent: "center",
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.danger,
    marginBottom: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: spacing["2xl"],
  },
  emptyTitle: {
    marginTop: spacing.md,
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
  },
  emptyText: {
    marginTop: spacing.sm,
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
  },
  featuredCard: {
    borderRadius: radius["3xl"],
  },
  featuredTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  featuredInfo: {
    flex: 1,
  },
  featuredBadge: {
    marginBottom: spacing.sm,
  },
  featuredLocation: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    lineHeight: 24,
  },
  magnitudeBadge: {
    minWidth: 74,
    height: 74,
    borderRadius: radius["2xl"],
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  magnitudeLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.textInverse,
    opacity: 0.82,
  },
  magnitudeValue: {
    fontSize: 25,
    fontWeight: "900",
    color: colors.textInverse,
    marginTop: 2,
  },
  featuredMetaRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metaItem: {
    flex: 1,
    gap: spacing.xs,
  },
  metaLabel: {
    ...typography.label,
    color: colors.textMuted,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  timeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
    marginBottom: spacing.md,
  },
  timeText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    color: colors.danger,
  },
  openDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  openDetailText: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.danger,
  },
  miniList: {
    gap: spacing.sm,
  },
  miniCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  miniMagnitude: {
    minWidth: 62,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  miniMagnitudeText: {
    fontSize: 13,
    fontWeight: "900",
  },
  miniInfo: {
    flex: 1,
  },
  miniTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
    lineHeight: 19,
  },
  miniSubtitle: {
    marginTop: spacing.xs,
    ...typography.caption,
    color: colors.textMuted,
  },
});
