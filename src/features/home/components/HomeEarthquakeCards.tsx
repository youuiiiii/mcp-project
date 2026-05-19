import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import AppCard from "../../../components/ui/AppCard";
import StatusBadge, {
  type StatusBadgeVariant,
} from "../../../components/ui/StatusBadge";
import type { BmkgEarthquake } from "../../../services/bmkgService";
import { colors } from "../../../theme/colors";
import { homeEarthquakeStyles as styles } from "./homeEarthquakeStyles";

export function FeaturedEarthquakeCard({
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

export function MiniEarthquakeCard({
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
