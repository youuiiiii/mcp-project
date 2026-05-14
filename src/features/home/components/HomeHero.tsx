import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import AppButton from "../../../components/ui/AppButton";
import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
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
};

export default function HomeHero({
  displayName,
  initials,
  activeCount,
  highSeverityCount,
  onOpenProfile,
  onOpenMap,
  onOpenReport,
}: HomeHeroProps) {
  return (
    <AppCard style={styles.heroCard}>
      <View style={styles.topRow}>
        <View style={styles.userTextGroup}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.displayName} numberOfLines={1}>
            {displayName}
          </Text>
        </View>

        <Pressable
          onPress={onOpenProfile}
          style={({ pressed }) => [
            styles.avatarButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.avatarText}>{initials}</Text>
        </Pressable>
      </View>

      <View style={styles.titleBlock}>
        <StatusBadge label="Live Monitoring" variant="success" size="sm" />

        <Text style={styles.title}>Monitor incidents around you</Text>

        <Text style={styles.subtitle}>
          Lihat laporan warga di map, laporkan kejadian dari lokasi Anda, dan
          buka detail kejadian dari pin yang tersedia.
        </Text>
      </View>

      <View style={styles.statusRow}>
        <View style={styles.statusItem}>
          <IconBadge variant="info" size="md" rounded={false}>
            <Ionicons name="map" size={20} color={colors.info} />
          </IconBadge>

          <View style={styles.statusTextGroup}>
            <Text style={styles.statusValue}>{activeCount}</Text>
            <Text style={styles.statusLabel}>Active reports</Text>
          </View>
        </View>

        <View style={styles.statusItem}>
          <IconBadge variant="danger" size="md" rounded={false}>
            <Ionicons name="warning" size={20} color={colors.danger} />
          </IconBadge>

          <View style={styles.statusTextGroup}>
            <Text style={styles.statusValue}>{highSeverityCount}</Text>
            <Text style={styles.statusLabel}>High severity</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        <AppButton
          title="Report Incident"
          variant="danger"
          size="md"
          onPress={onOpenReport}
          leftIcon={
            <Ionicons name="add-circle" size={18} color={colors.textInverse} />
          }
          style={styles.primaryAction}
        />

        <AppButton
          title="Open Map"
          variant="secondary"
          size="md"
          onPress={onOpenMap}
          leftIcon={<Ionicons name="map" size={18} color={colors.text} />}
          style={styles.secondaryAction}
        />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    gap: spacing.lg,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  userTextGroup: {
    flex: 1,
  },
  greeting: {
    ...typography.caption,
    color: colors.textMuted,
  },
  displayName: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: "900",
    color: colors.text,
  },
  avatarButton: {
    width: 46,
    height: 46,
    borderRadius: radius.full,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  avatarText: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.textInverse,
  },
  titleBlock: {
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  statusRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  statusItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  statusTextGroup: {
    flex: 1,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
  },
  statusLabel: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  primaryAction: {
    flex: 1.2,
  },
  secondaryAction: {
    flex: 1,
  },
});