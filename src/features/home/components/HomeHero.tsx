import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import AppButton from "../../../components/ui/AppButton";
import AppCard from "../../../components/ui/AppCard";
import StatusBadge from "../../../components/ui/StatusBadge";
import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";

type HomeHeroProps = {
  displayName: string;
  initials: string;
  activeCount: number;
  highSeverityCount: number;
  onOpenProfile: () => void;
  onOpenMap: () => void;
  onOpenReport: () => void;
  onOpenReports: () => void;
  onOpenAnalytics: () => void;
  onOpenEarthquake: () => void;
  onOpenEducation: () => void;
};

export default function HomeHero({
  displayName,
  initials,
  activeCount,
  highSeverityCount,
  onOpenProfile,
  onOpenMap,
  onOpenReport,
  onOpenReports,
  onOpenAnalytics,
  onOpenEarthquake,
  onOpenEducation,
}: HomeHeroProps) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.identity}>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.name} numberOfLines={1}>
            {displayName}
          </Text>
        </View>

        <Pressable
          onPress={onOpenProfile}
          style={({ pressed }) => [
            styles.avatar,
            pressed && styles.avatarPressed,
          ]}
        >
          <Text style={styles.avatarText}>{initials}</Text>
        </Pressable>
      </View>

      <View style={styles.messageBlock}>
        <StatusBadge label="Live Monitoring" variant="success" size="sm" />

        <Text style={styles.title}>Monitor community reports around you</Text>

        <Text style={styles.subtitle}>
          Open the map to see incident pins, or create a report from your
          current location.
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <SummaryItem
          iconName="map"
          value={activeCount}
          label="Active"
          color={colors.info}
        />

        <SummaryItem
          iconName="warning"
          value={highSeverityCount}
          label="High urgency"
          color={colors.danger}
        />
      </View>

      <View style={styles.actionGrid}>
        <AppButton
          title="Report"
          variant="danger"
          size="md"
          onPress={onOpenReport}
          leftIcon={
            <Ionicons name="add-circle" size={18} color={colors.textInverse} />
          }
          style={styles.gridAction}
        />

        <AppButton
          title="Map"
          variant="secondary"
          size="md"
          onPress={onOpenMap}
          leftIcon={<Ionicons name="map" size={18} color={colors.text} />}
          style={styles.gridAction}
        />

        <AppButton
          title="Reports"
          variant="secondary"
          size="md"
          onPress={onOpenReports}
          leftIcon={
            <Ionicons name="list-circle" size={18} color={colors.text} />
          }
          style={styles.gridAction}
        />

        <AppButton
          title="Analytics"
          variant="secondary"
          size="md"
          onPress={onOpenAnalytics}
          leftIcon={<Ionicons name="stats-chart" size={18} color={colors.text} />}
          style={styles.gridAction}
        />

        <AppButton
          title="BMKG"
          variant="secondary"
          size="md"
          onPress={onOpenEarthquake}
          leftIcon={<Ionicons name="earth" size={18} color={colors.text} />}
          style={styles.gridAction}
        />

        <AppButton
          title="Education"
          variant="secondary"
          size="md"
          onPress={onOpenEducation}
          leftIcon={<Ionicons name="book" size={18} color={colors.text} />}
          style={styles.gridAction}
        />
      </View>
    </AppCard>
  );
}

function SummaryItem({
  iconName,
  value,
  label,
  color,
}: {
  iconName: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <View style={styles.summaryItem}>
      <View style={[styles.summaryIcon, { backgroundColor: `${color}18` }]}>
        <Ionicons name={iconName} size={18} color={color} />
      </View>

      <View style={styles.summaryText}>
        <Text style={styles.summaryValue}>{value}</Text>
        <Text style={styles.summaryLabel}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  identity: {
    flex: 1,
  },
  greeting: {
    ...typography.caption,
    color: colors.textMuted,
  },
  name: {
    marginTop: 2,
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  avatarText: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textInverse,
  },
  messageBlock: {
    gap: spacing.sm,
  },
  title: {
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "500",
    color: colors.textMuted,
  },
  summaryRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  summaryItem: {
    flex: 1,
    minHeight: 68,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryText: {
    flex: 1,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  summaryLabel: {
    marginTop: 1,
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  gridAction: {
    width: "48.5%",
  },
});
