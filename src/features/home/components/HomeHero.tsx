import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "../../../components/ui/AppButton";
import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import StatusBadge from "../../../components/ui/StatusBadge";
import { colors } from "../../../theme/colors";
import { radius, shadow, spacing } from "../../../theme/layout";
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
  const hasActiveReports = activeCount > 0;

  return (
    <View style={styles.hero}>
      <View style={styles.heroTop}>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName} numberOfLines={1}>
            {displayName}
          </Text>
        </View>

        <AppCard
          onPress={onOpenProfile}
          padding="none"
          style={styles.avatarButton}
        >
          <Text style={styles.avatarText}>{initials}</Text>
        </AppCard>
      </View>

      <StatusBadge
        label={hasActiveReports ? "Active monitoring" : "Area stable"}
        variant={hasActiveReports ? "active" : "success"}
        size="sm"
        style={styles.heroBadge}
      />

      <Text style={styles.heroTitle}>Community Safety Overview</Text>

      <Text style={styles.heroSubtitle}>
        {hasActiveReports
          ? `${activeCount} laporan aktif sedang dipantau. ${highSeverityCount} laporan memiliki severity tinggi.`
          : "Belum ada laporan aktif. Tetap pantau kondisi sekitar dan laporkan jika ada kejadian."}
      </Text>

      <View style={styles.heroActions}>
        <AppButton
          title="Open Map"
          variant="secondary"
          size="md"
          onPress={onOpenMap}
          leftIcon={<Ionicons name="map" size={18} color={colors.text} />}
          style={styles.heroActionButton}
        />

        <AppButton
          title="Report"
          variant="danger"
          size="md"
          onPress={onOpenReport}
          leftIcon={
            <Ionicons
              name="add-circle"
              size={18}
              color={colors.textInverse}
            />
          }
          style={styles.heroActionButton}
        />
      </View>

      <AppCard variant="muted" style={styles.monitoringCard}>
        <IconBadge
          variant={highSeverityCount > 0 ? "danger" : "success"}
          size="md"
          rounded={false}
        >
          <Ionicons
            name={highSeverityCount > 0 ? "alert-circle" : "radio"}
            size={22}
            color={highSeverityCount > 0 ? colors.danger : colors.success}
          />
        </IconBadge>

        <View style={styles.monitoringContent}>
          <Text style={styles.monitoringTitle}>
            {highSeverityCount > 0
              ? "High severity attention needed"
              : "Monitoring active"}
          </Text>
          <Text style={styles.monitoringText}>
            {highSeverityCount > 0
              ? "Cek peta untuk melihat laporan yang membutuhkan perhatian lebih cepat."
              : "Laporan komunitas dan update resmi akan tampil saat tersedia."}
          </Text>
        </View>
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.dark,
    borderRadius: radius["3xl"],
    padding: spacing.xl,
    ...shadow.floating,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    ...typography.caption,
    color: colors.textSoft,
  },
  userName: {
    marginTop: spacing.xs,
    fontSize: 19,
    fontWeight: "900",
    color: colors.textInverse,
  },
  avatarButton: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 0,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
  },
  heroBadge: {
    marginBottom: spacing.md,
  },
  heroTitle: {
    ...typography.hero,
    color: colors.textInverse,
  },
  heroSubtitle: {
    marginTop: spacing.sm,
    ...typography.body,
    color: colors.textOnDarkMuted,
  },
  heroActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  heroActionButton: {
    flex: 1,
  },
  monitoringCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.darkSoft,
    borderColor: colors.darkSoft,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  monitoringContent: {
    flex: 1,
  },
  monitoringTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.textInverse,
  },
  monitoringText: {
    marginTop: spacing.xs,
    ...typography.caption,
    color: colors.textOnDarkMuted,
  },
});