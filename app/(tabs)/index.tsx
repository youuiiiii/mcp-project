import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import BmkgEarthquakeSection from "../../src/components/home/BmkgEarthquakeSection";
import HomeLatestReportsSection from "../../src/components/home/HomeLatestReportsSection";
import AppButton from "../../src/components/ui/AppButton";
import AppCard from "../../src/components/ui/AppCard";
import AppScreen from "../../src/components/ui/AppScreen";
import IconBadge from "../../src/components/ui/IconBadge";
import SectionHeader from "../../src/components/ui/SectionHeader";
import StatusBadge from "../../src/components/ui/StatusBadge";
import { useAuth } from "../../src/contexts/AuthContext";
import { colors } from "../../src/theme/colors";
import { radius, shadow, spacing } from "../../src/theme/layout";
import { typography } from "../../src/theme/typography";

const MAP_ROUTE = "/(tabs)/map" as Href;
const REPORT_ROUTE = "/(tabs)/report" as Href;
const ANALYTICS_ROUTE = "/(tabs)/analytics" as Href;
const PROFILE_ROUTE = "/(tabs)/profile" as Href;

type QuickAction = {
  title: string;
  description: string;
  route: Href;
  icon: keyof typeof Ionicons.glyphMap;
  variant: "danger" | "info" | "success" | "neutral";
  primary?: boolean;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    title: "Report Incident",
    description: "Buat laporan kejadian baru",
    route: REPORT_ROUTE,
    icon: "add-circle",
    variant: "danger",
    primary: true,
  },
  {
    title: "Open Map",
    description: "Pantau lokasi incident",
    route: MAP_ROUTE,
    icon: "map",
    variant: "info",
  },
  {
    title: "Analytics",
    description: "Lihat ringkasan data",
    route: ANALYTICS_ROUTE,
    icon: "stats-chart",
    variant: "success",
  },
  {
    title: "Profile",
    description: "Akun dan kontribusi",
    route: PROFILE_ROUTE,
    icon: "person",
    variant: "neutral",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const displayName = useMemo(() => {
    return (
      user?.displayName || user?.email?.split("@")[0] || "Community Reporter"
    );
  }, [user]);

  const initials = useMemo(() => {
    return displayName
      .split(" ")
      .map((item) => item.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [displayName]);

  return (
    <AppScreen contentContainerStyle={styles.screenContent}>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName} numberOfLines={1}>
              {displayName}
            </Text>
          </View>

          <AppCard
            onPress={() => router.push(PROFILE_ROUTE)}
            padding="none"
            style={styles.avatarButton}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </AppCard>
        </View>

        <StatusBadge
          label="Monitoring active"
          variant="success"
          size="sm"
          style={styles.heroBadge}
        />

        <Text style={styles.heroTitle}>Stay aware of nearby incidents</Text>

        <Text style={styles.heroSubtitle}>
          Pantau laporan warga, update resmi gempa, dan kondisi sekitar secara
          realtime.
        </Text>

        <View style={styles.heroActions}>
          <AppButton
            title="Open Map"
            variant="secondary"
            size="md"
            onPress={() => router.push(MAP_ROUTE)}
            leftIcon={<Ionicons name="map" size={18} color={colors.text} />}
            style={styles.heroActionButton}
          />

          <AppButton
            title="Report"
            variant="danger"
            size="md"
            onPress={() => router.push(REPORT_ROUTE)}
            leftIcon={
              <Ionicons name="add-circle" size={18} color={colors.textInverse} />
            }
            style={styles.heroActionButton}
          />
        </View>

        <AppCard variant="muted" style={styles.monitoringCard}>
          <IconBadge variant="success" size="md" rounded={false}>
            <Ionicons name="radio" size={22} color={colors.success} />
          </IconBadge>

          <View style={styles.monitoringContent}>
            <Text style={styles.monitoringTitle}>Community monitoring</Text>
            <Text style={styles.monitoringText}>
              Community reports and official earthquake updates are being
              monitored.
            </Text>
          </View>
        </AppCard>
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Quick Actions"
          subtitle="Akses fitur utama"
          style={styles.sectionHeader}
        />

        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((item) => {
            const isPrimary = item.primary === true;

            return (
              <AppCard
                key={item.title}
                onPress={() => router.push(item.route)}
                padding="md"
                style={[styles.quickCard, isPrimary && styles.quickCardPrimary]}
              >
                <IconBadge
                  variant={item.variant}
                  size="lg"
                  rounded={false}
                  style={isPrimary && styles.quickIconPrimary}
                >
                  <Ionicons
                    name={item.icon}
                    size={26}
                    color={isPrimary ? colors.textInverse : getIconColor(item.variant)}
                  />
                </IconBadge>

                <View style={styles.quickTextGroup}>
                  <Text
                    style={[
                      styles.quickTitle,
                      isPrimary && styles.quickTitlePrimary,
                    ]}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={[
                      styles.quickDescription,
                      isPrimary && styles.quickDescriptionPrimary,
                    ]}
                  >
                    {item.description}
                  </Text>
                </View>
              </AppCard>
            );
          })}
        </View>
      </View>

      <BmkgEarthquakeSection />

      <HomeLatestReportsSection />
    </AppScreen>
  );
}

function getIconColor(variant: QuickAction["variant"]) {
  switch (variant) {
    case "danger":
      return colors.danger;

    case "info":
      return colors.info;

    case "success":
      return colors.success;

    case "neutral":
    default:
      return colors.text;
  }
}

const styles = StyleSheet.create({
  screenContent: {
    gap: spacing["2xl"],
  },
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
    marginTop: 3,
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
    color: "#CBD5E1",
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
    marginTop: 4,
    ...typography.caption,
    color: "#CBD5E1",
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    marginBottom: 0,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  quickCard: {
    width: "48%",
    minHeight: 154,
    justifyContent: "space-between",
  },
  quickCardPrimary: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  quickIconPrimary: {
    backgroundColor: colors.primaryDark,
  },
  quickTextGroup: {
    marginTop: spacing.md,
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
  },
  quickTitlePrimary: {
    color: colors.textInverse,
  },
  quickDescription: {
    marginTop: 5,
    ...typography.caption,
    color: colors.textMuted,
  },
  quickDescriptionPrimary: {
    color: colors.primarySoft,
  },
});