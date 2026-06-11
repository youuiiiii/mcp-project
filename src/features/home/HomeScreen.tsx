import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { type Href, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import IncidentThreadModal from "../../components/IncidentThreadModal";
import ResolveIncidentModal from "../../components/ResolveIncidentModal";
import VerifyIncidentModal from "../../components/VerifyIncidentModal";
import LoadingState from "../../components/ui/LoadingState";
import StatusBadge, {
  type StatusBadgeVariant,
} from "../../components/ui/StatusBadge";
import {
  getIncidentDisplayMeta,
  type AppIconName,
} from "../../constants/incident";
import { useAuth } from "../../contexts/AuthContext";
import { useI18n } from "../../i18n";
import { subscribeToIncidents } from "../../services/incidentService";
import { checkAndNotifyNearbySos } from "../../services/notifications";
import { subscribeToSOSLogs } from "../../services/sosService";
import SosSlideModal from "../sos/SosSlideModal";
import { colors } from "../../theme/colors";
import { radius, shadow, spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";
import type { IncidentReport } from "../../types/incident";

const REPORT_ROUTE = "/(tabs)/report" as Href;
const MAPS_ROUTE = "/(tabs)/maps" as Href;
const INCIDENTS_ROUTE = "/(tabs)/activity" as Href;
const PROFILE_ROUTE = "/(tabs)/profile" as Href;
const EARTHQUAKE_ROUTE = "/earthquake" as Href;
const EDUCATION_ROUTE = "/education" as Href;

type QuickAction = {
  label: string;
  iconName: AppIconName;
  href: Href;
  iconColor: string;
  borderColor: string;
  backgroundColor: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "home.quick.report",
    iconName: "megaphone",
    href: REPORT_ROUTE,
    iconColor: colors.danger,
    borderColor: "#FCA5A5",
    backgroundColor: "#FFF5F5",
  },
  {
    label: "home.quick.earthquake",
    iconName: "earth",
    href: EARTHQUAKE_ROUTE,
    iconColor: "#0EA5E9",
    borderColor: "#7DD3FC",
    backgroundColor: "#F0F9FF",
  },
  {
    label: "home.quick.education",
    iconName: "book",
    href: EDUCATION_ROUTE,
    iconColor: "#10B981",
    borderColor: "#6EE7B7",
    backgroundColor: "#ECFDF5",
  },
  {
    label: "home.quick.maps",
    iconName: "map",
    href: MAPS_ROUTE,
    iconColor: colors.info,
    borderColor: "#93C5FD",
    backgroundColor: "#EFF6FF",
  },
  {
    label: "home.quick.incident",
    iconName: "warning",
    href: INCIDENTS_ROUTE,
    iconColor: colors.warning,
    borderColor: "#FBBF24",
    backgroundColor: "#FFFBEB",
  },
  {
    label: "home.quick.profile",
    iconName: "person",
    href: PROFILE_ROUTE,
    iconColor: "#5B21B6",
    borderColor: "#C4B5FD",
    backgroundColor: "#F5F3FF",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { t, language } = useI18n();
  const [sosVisible, setSosVisible] = useState(false);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    null
  );
  const [selectedVerifyIncident, setSelectedVerifyIncident] =
    useState<IncidentReport | null>(null);
  const [selectedResolveIncident, setSelectedResolveIncident] =
    useState<IncidentReport | null>(null);
  const [isThreadModalVisible, setIsThreadModalVisible] = useState(false);
  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false);
  const [isResolveModalVisible, setIsResolveModalVisible] = useState(false);

  useEffect(() => {
    setLoading(true);

    const unsubscribeReports = subscribeToIncidents(
      (items) => {
        setIncidents(items);
        setErrorMessage(null);
        setLoading(false);
      },
      (error) => {
        console.error("Home reports error:", error);
        setErrorMessage(error.message || "Could not load report data.");
        setLoading(false);
      }
    );

    const unsubscribeSos = subscribeToSOSLogs((logs) => {
      // Check for nearby SOS and notify if needed
      checkAndNotifyNearbySos(logs);
    });

    return () => {
      unsubscribeReports();
      unsubscribeSos();
    };
  }, []);

  const dashboard = useMemo(() => {
    const today = new Date();

    const todaysIncidents = incidents.filter((incident) =>
      isSameLocalDay(incident.createdAt, today)
    ).length;

    const handled = incidents.filter(
      (incident) => incident.status === "resolved"
    ).length;

    const activeContributorKeys = new Set(
      incidents
        .filter((incident) => incident.status === "active")
        .map(getIncidentActorKey)
        .filter(Boolean)
    );

    const recentIncidents = [...incidents]
      .sort((first, second) => {
        return getIncidentActivityTime(second) - getIncidentActivityTime(first);
      })
      .slice(0, 4);

    const activeCount = incidents.filter(
      (incident) => incident.status === "active"
    ).length;

    const highPriorityCount = incidents.filter((incident) => {
      return (incident.urgencyLevel ?? incident.severity) === "high";
    }).length;

    return {
      todaysIncidents,
      handled,
      activeVolunteers: activeContributorKeys.size,
      activeCount,
      highPriorityCount,
      recentIncidents,
    };
  }, [incidents]);

  const selectedIncident = useMemo(() => {
    if (!selectedIncidentId) {
      return null;
    }

    return incidents.find((incident) => incident.id === selectedIncidentId) ?? null;
  }, [incidents, selectedIncidentId]);

  const displayName = user?.displayName?.trim() || "Responder";
  const initial = displayName.charAt(0).toUpperCase();

  const openIncident = (incident: IncidentReport) => {
    setSelectedIncidentId(incident.id);
    setIsThreadModalVisible(true);
  };

  const closeThreadModal = () => {
    setIsThreadModalVisible(false);
    setSelectedIncidentId(null);
  };

  const openVerifyModal = (incident: IncidentReport) => {
    setSelectedVerifyIncident(incident);
    setIsVerifyModalVisible(true);
  };

  const closeVerifyModal = () => {
    setIsVerifyModalVisible(false);
    setSelectedVerifyIncident(null);
  };

  const openResolveModal = (incident: IncidentReport) => {
    setSelectedResolveIncident(incident);
    setIsResolveModalVisible(true);
  };

  const closeResolveModal = () => {
    setIsResolveModalVisible(false);
    setSelectedResolveIncident(null);
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScrollView
          style={styles.scroller}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={["#0C7186", "#11B7D2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroTopRow}>
              <View style={styles.identityRow}>
                <View style={styles.avatar}>
                  {user?.photoURL ? (
                    <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.avatarInitial}>{initial}</Text>
                  )}
                </View>

                <View style={styles.welcomeCopy}>
                  <Text style={styles.welcomeText}>{t("home.hero.welcome")}</Text>
                  <Text style={styles.userName} numberOfLines={1}>
                    {displayName}
                  </Text>
                </View>
              </View>


            </View>

            <View style={styles.statsRow}>
              <DashboardStat
                value={dashboard.todaysIncidents}
                label={t("home.stats.todays")}
              />
              <DashboardStat value={dashboard.handled} label={t("home.stats.handled")} />
              <DashboardStat
                value={dashboard.activeVolunteers}
                label={t("home.stats.activeVolunteers")}
              />
            </View>
          </LinearGradient>

          <View style={styles.body}>
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Ionicons name="warning" size={18} color={colors.dangerDark} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("home.section.quickActions")}</Text>
              <View style={styles.quickActionGrid}>
                {QUICK_ACTIONS.map((action) => (
                  <QuickActionButton
                    key={action.label}
                    action={action}
                    label={t(action.label as any)}
                    onPress={() => router.push(action.href)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>{t("home.section.recentIncidents")}</Text>
                <Pressable
                  onPress={() => router.push(INCIDENTS_ROUTE)}
                  style={({ pressed }) => [
                    styles.seeAllButton,
                    pressed && styles.quickActionCardPressed,
                  ]}
                >
                  <Text style={styles.seeAllText}>{t("home.action.seeAll")}</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.primaryContainer}
                  />
                </Pressable>
              </View>

              {loading ? (
                <View style={styles.loadingCard}>
                  <LoadingState message={t("home.loading.dashboard")} />
                </View>
              ) : dashboard.recentIncidents.length > 0 ? (
                <View style={styles.recentList}>
                  {dashboard.recentIncidents.map((incident) => (
                    <RecentIncidentCard
                      key={incident.id}
                      incident={incident}
                      onPress={() => openIncident(incident)}
                    />
                  ))}
                </View>
              ) : (
                <View style={styles.emptyCard}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={28}
                    color={colors.success}
                  />
                  <View style={styles.emptyCopy}>
                    <Text style={styles.emptyTitle}>{t("home.empty.title")}</Text>
                    <Text style={styles.emptyText}>
                      {t("home.empty.desc")}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* SOS Floating Action Button */}
      <Pressable
        onPress={() => setSosVisible(true)}
        style={({ pressed }) => [
          styles.sosFab,
          pressed && styles.sosFabPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Emergency SOS"
      >
        <View style={styles.sosFabInner}>
          <Ionicons name="warning" size={28} color={colors.textInverse} />
        </View>
      </Pressable>

      <SosSlideModal
        visible={sosVisible}
        onClose={() => setSosVisible(false)}
      />

      <IncidentThreadModal
        visible={isThreadModalVisible}
        incident={selectedIncident}
        onClose={closeThreadModal}
        onOpenVerify={openVerifyModal}
        onOpenResolve={openResolveModal}
      />

      <VerifyIncidentModal
        visible={isVerifyModalVisible}
        incident={selectedVerifyIncident}
        onClose={closeVerifyModal}
      />

      <ResolveIncidentModal
        visible={isResolveModalVisible}
        incident={selectedResolveIncident}
        onClose={closeResolveModal}
      />
    </>
  );
}

type HeaderIconButtonProps = {
  iconName: AppIconName;
  badgeCount?: number;
  onPress: () => void;
};

function HeaderIconButton({
  iconName,
  badgeCount = 0,
  onPress,
}: HeaderIconButtonProps) {
  const visibleBadgeCount = Math.min(badgeCount, 9);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.headerIconButton, pressed && styles.pressed]}
    >
      <Ionicons name={iconName} size={22} color={colors.textInverse} />
      {badgeCount > 0 ? (
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{visibleBadgeCount}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

type DashboardStatProps = {
  value: number;
  label: string;
};

function DashboardStat({ value, label }: DashboardStatProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

type QuickActionButtonProps = {
  action: QuickAction;
  label: string;
  onPress: () => void;
};

function QuickActionButton({ action, label, onPress }: QuickActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickActionCard,
        {
          backgroundColor: action.backgroundColor,
          borderColor: action.borderColor,
        },
        pressed && styles.quickActionCardPressed,
      ]}
    >
      <Ionicons name={action.iconName} size={25} color={action.iconColor} />
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

type RecentIncidentCardProps = {
  incident: IncidentReport;
  onPress: () => void;
};

function RecentIncidentCard({ incident, onPress }: RecentIncidentCardProps) {
  const { t } = useI18n();
  const meta = getIncidentDisplayMeta({
    category: incident.category,
    subcategory: incident.subcategory ?? incident.type,
  });
  const title = incident.title?.trim() || t(meta.label as any);
  const address =
    incident.address?.trim() ||
    `${incident.latitude.toFixed(4)}, ${incident.longitude.toFixed(4)}`;
  const status = getIncidentStatusDisplay(incident, t);
  const reportCount = getIncidentSignalCount(incident);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.recentCard,
        pressed && styles.recentCardPressed,
      ]}
    >
      <View style={[styles.incidentIconWrap, { backgroundColor: meta.lightColor }]}>
        <Ionicons name={meta.iconName} size={22} color={meta.color} />
      </View>

      <View style={styles.incidentContent}>
        <View style={styles.incidentTopRow}>
          <Text style={styles.incidentTitle} numberOfLines={1}>
            {title}
          </Text>
          <StatusBadge
            label={status.label}
            variant={status.variant}
            size="sm"
            style={styles.statusBadge}
            textStyle={styles.statusBadgeText}
          />
        </View>

        <View style={styles.incidentMetaRow}>
          <Ionicons name="location-outline" size={13} color={colors.textSoft} />
          <Text style={styles.incidentMetaText} numberOfLines={1}>
            {address}
          </Text>
        </View>

        <View style={styles.incidentFooterRow}>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={13} color={colors.textSoft} />
            <Text style={styles.incidentTimeText}>
              {formatRelativeTime(incident.createdAt, t)}
            </Text>
          </View>
          <Text style={styles.reportCountText}>
            {t("home.reports.count", { count: reportCount })}
          </Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors.borderStrong}
      />
    </Pressable>
  );
}

function getIncidentStatusDisplay(incident: IncidentReport, t: any): {
  label: string;
  variant: StatusBadgeVariant;
} {
  if (incident.status === "resolved") {
    return {
      label: t("status.resolved"),
      variant: "resolved",
    };
  }

  const urgencyLevel = incident.urgencyLevel ?? incident.severity;

  if (urgencyLevel === "medium") {
    return {
      label: t("status.monitoring"),
      variant: "warning",
    };
  }

  return {
    label: t("status.active"),
    variant: urgencyLevel === "high" ? "active" : "info",
  };
}

function getIncidentSignalCount(incident: IncidentReport) {
  return (
    1 +
    (incident.verificationCount ?? 0) +
    (incident.disputeCount ?? 0) +
    (incident.replyCount ?? 0) +
    (incident.conditionUpdateCount ?? 0)
  );
}

function getIncidentActorKey(incident: IncidentReport) {
  return (
    incident.reporterUid ||
    incident.reporterEmail ||
    incident.reportedBy ||
    null
  );
}

function getIncidentActivityTime(incident: IncidentReport) {
  return (
    incident.latestActivityAt ??
    incident.latestCommunityUpdateAt ??
    incident.updatedAt ??
    incident.createdAt ??
    new Date(0)
  ).getTime();
}

function isSameLocalDay(date: Date | undefined, comparisonDate: Date) {
  if (!date) {
    return false;
  }

  return (
    date.getFullYear() === comparisonDate.getFullYear() &&
    date.getMonth() === comparisonDate.getMonth() &&
    date.getDate() === comparisonDate.getDate()
  );
}

function formatRelativeTime(date: Date | undefined, t: any) {
  if (!date) {
    return t("common.time.unknown");
  }

  const differenceMs = Date.now() - date.getTime();
  const differenceMinutes = Math.max(0, Math.floor(differenceMs / 60000));

  if (differenceMinutes < 1) {
    return t("common.time.justNow");
  }

  if (differenceMinutes < 60) {
    return t("common.time.minutesAgo", { min: differenceMinutes });
  }

  const differenceHours = Math.floor(differenceMinutes / 60);

  if (differenceHours < 24) {
    return t("common.time.hoursAgo", { hour: differenceHours });
  }

  const differenceDays = Math.floor(differenceHours / 24);
  return t("common.time.daysAgo", { day: differenceDays });
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0C7186",
  },
  scroller: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing["3xl"],
  },
  hero: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing["2xl"],
    gap: spacing.xl,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  identityRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minWidth: 0,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.55)",
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textInverse,
  },
  welcomeCopy: {
    flex: 1,
    minWidth: 0,
  },
  welcomeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255,255,255,0.82)",
  },
  userName: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.textInverse,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerBadge: {
    position: "absolute",
    top: -5,
    right: -3,
    minWidth: 17,
    height: 17,
    borderRadius: radius.full,
    backgroundColor: colors.danger,
    borderWidth: 1,
    borderColor: colors.textInverse,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  headerBadgeText: {
    fontSize: 9,
    fontWeight: "900",
    color: colors.textInverse,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minHeight: 70,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.textInverse,
    lineHeight: 30,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255,255,255,0.9)",
  },
  body: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing["2xl"],
    gap: spacing["2xl"],
    backgroundColor: colors.background,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.dangerSoft,
  },
  errorText: {
    flex: 1,
    ...typography.caption,
    color: colors.dangerDark,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },
  quickActionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  quickActionCard: {
    width: "30%",
    minHeight: 82,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  quickActionCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.text,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingVertical: spacing.xs,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primaryContainer,
  },
  loadingCard: {
    minHeight: 150,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  recentList: {
    gap: spacing.md,
  },
  recentCard: {
    minHeight: 96,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadow.floating,
    shadowOpacity: 0.06,
    elevation: 2,
  },
  recentCardPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  incidentIconWrap: {
    width: 42,
    height: 42,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  incidentContent: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  incidentTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  incidentTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  statusBadge: {
    flexShrink: 0,
  },
  statusBadgeText: {
    fontSize: 9,
    textTransform: "none",
    letterSpacing: 0,
  },
  incidentMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  incidentMetaText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#28507A",
  },
  incidentFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minWidth: 0,
  },
  incidentTimeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSoft,
  },
  reportCountText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#7684B0",
  },
  emptyCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  emptyCopy: {
    flex: 1,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  emptyText: {
    marginTop: 2,
    ...typography.caption,
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.78,
  },
  sosFab: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.xl,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(239, 68, 68, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  sosFabInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.floating,
  },
  sosFabPressed: {
    transform: [{ scale: 0.92 }],
  },
});
