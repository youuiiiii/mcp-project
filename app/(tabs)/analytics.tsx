import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "../../src/components/ui/AppCard";
import AppScreen from "../../src/components/ui/AppScreen";
import IconBadge from "../../src/components/ui/IconBadge";
import LoadingState from "../../src/components/ui/LoadingState";
import SectionHeader from "../../src/components/ui/SectionHeader";
import StatusBadge, {
  StatusBadgeVariant,
} from "../../src/components/ui/StatusBadge";
import { getIncidentMeta } from "../../src/constants/incident";
import { subscribeToIncidents } from "../../src/services/incidentService";
import { colors } from "../../src/theme/colors";
import { radius, spacing } from "../../src/theme/layout";
import { typography } from "../../src/theme/typography";
import { IncidentReport } from "../../src/types/incident";

type AppIconName = keyof typeof Ionicons.glyphMap;

type IconBadgeVariant = "danger" | "success" | "warning" | "info" | "neutral";

type SummaryItem = {
  label: string;
  value: number;
  icon: AppIconName;
  color: string;
  variant: IconBadgeVariant;
};

type MetricItem = {
  label: string;
  value: number | string;
  text: string;
  icon: AppIconName;
};

type DistributionItem = {
  label: string;
  count: number;
  percentage: number;
  icon?: AppIconName;
  color?: string;
};

function getIncidentIcon(report: IncidentReport): AppIconName {
  const type = report.subcategory ?? report.type;

  switch (type) {
    case "flood":
      return "water";

    case "earthquake":
      return "pulse";

    case "landslide":
    case "collapsed_building":
      return "trail-sign";

    case "volcanic_eruption":
      return "flame";

    case "strong_wind":
      return "cloudy";

    case "tsunami":
      return "radio";

    case "fire":
    case "building_fire":
    case "vehicle_fire":
    case "land_fire":
    case "electrical_fire":
      return "flame";

    case "traffic_accident":
      return "car-sport";

    case "fallen_tree":
      return "leaf";

    case "road_block":
    case "damaged_road":
      return "construct";

    case "fallen_power_line":
      return "flash";

    case "crime":
    case "theft":
      return "shield";

    case "brawl":
    case "risky_crowd":
    case "mob_violence":
    case "public_disturbance":
      return "people";

    case "medical":
    case "fainted_person":
    case "work_accident":
    case "drowning":
    case "evacuation_needed":
      return "medkit";

    default:
      return "alert-circle";
  }
}

export default function AnalyticsScreen() {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToIncidents(
      (items) => {
        setReports(items);
        setErrorMessage(null);
        setLoading(false);
      },
      (error) => {
        console.error("Analytics error:", error);
        setErrorMessage(error.message || "Gagal memuat analytics.");
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const activeReports = useMemo(() => {
    return reports.filter((report) => report.status === "active");
  }, [reports]);

  const resolvedReports = useMemo(() => {
    return reports.filter((report) => report.status === "resolved");
  }, [reports]);

  const highSeverityReports = useMemo(() => {
    return reports.filter((report) => report.severity === "high");
  }, [reports]);

  const verifiedReports = useMemo(() => {
    return reports.filter((report) => report.verificationStatus === "verified");
  }, [reports]);

  const disputedReports = useMemo(() => {
    return reports.filter((report) => report.verificationStatus === "disputed");
  }, [reports]);

  const totalEvidence = useMemo(() => {
    return reports.reduce((total, report) => {
      return total + (report.evidenceCount ?? 0);
    }, 0);
  }, [reports]);

  const totalReplies = useMemo(() => {
    return reports.reduce((total, report) => {
      return total + (report.replyCount ?? 0);
    }, 0);
  }, [reports]);

  const averageResolutionHours = useMemo(() => {
    const resolvedWithTime = resolvedReports.filter((report) => {
      return report.createdAt && report.resolvedAt;
    });

    if (resolvedWithTime.length === 0) {
      return "-";
    }

    const totalHours = resolvedWithTime.reduce((total, report) => {
      const createdAt = report.createdAt?.getTime() ?? 0;
      const resolvedAt = report.resolvedAt?.getTime() ?? 0;
      const diffHours = Math.max(resolvedAt - createdAt, 0) / 1000 / 60 / 60;

      return total + diffHours;
    }, 0);

    return `${Math.round(totalHours / resolvedWithTime.length)}h`;
  }, [resolvedReports]);

  const summaryItems = useMemo<SummaryItem[]>(() => {
    return [
      {
        label: "Total Reports",
        value: reports.length,
        icon: "location",
        color: colors.info,
        variant: "info",
      },
      {
        label: "Active",
        value: activeReports.length,
        icon: "radio",
        color: colors.danger,
        variant: "danger",
      },
      {
        label: "Resolved",
        value: resolvedReports.length,
        icon: "checkmark-circle",
        color: colors.success,
        variant: "success",
      },
      {
        label: "High Severity",
        value: highSeverityReports.length,
        icon: "alert-circle",
        color: colors.warningDark,
        variant: "warning",
      },
    ];
  }, [
    reports.length,
    activeReports.length,
    resolvedReports.length,
    highSeverityReports.length,
  ]);

  const metricItems = useMemo<MetricItem[]>(() => {
    return [
      {
        label: "Verified",
        value: verifiedReports.length,
        text: "community verified",
        icon: "shield-checkmark",
      },
      {
        label: "Disputed",
        value: disputedReports.length,
        text: "needs review",
        icon: "help-circle",
      },
      {
        label: "Avg Resolve",
        value: averageResolutionHours,
        text: "resolution time",
        icon: "time",
      },
    ];
  }, [verifiedReports.length, disputedReports.length, averageResolutionHours]);

  const severityDistribution = useMemo<DistributionItem[]>(() => {
    const total = reports.length || 1;

    const low = reports.filter((report) => report.severity === "low").length;
    const medium = reports.filter(
      (report) => report.severity === "medium"
    ).length;
    const high = reports.filter((report) => report.severity === "high").length;

    return [
      {
        label: "Low",
        count: low,
        percentage: Math.round((low / total) * 100),
        color: colors.success,
        icon: "checkmark-circle",
      },
      {
        label: "Medium",
        count: medium,
        percentage: Math.round((medium / total) * 100),
        color: colors.warning,
        icon: "warning",
      },
      {
        label: "High",
        count: high,
        percentage: Math.round((high / total) * 100),
        color: colors.danger,
        icon: "alert-circle",
      },
    ];
  }, [reports]);

  const categoryDistribution = useMemo<DistributionItem[]>(() => {
    const counter = new Map<
      string,
      {
        count: number;
        icon: AppIconName;
        color: string;
      }
    >();

    reports.forEach((report) => {
      const meta = getIncidentMeta(report.subcategory ?? report.type);
      const existing = counter.get(meta.label);

      counter.set(meta.label, {
        count: (existing?.count ?? 0) + 1,
        icon: getIncidentIcon(report),
        color: meta.color,
      });
    });

    const total = reports.length || 1;

    return Array.from(counter.entries())
      .map(([label, value]) => ({
        label,
        count: value.count,
        percentage: Math.round((value.count / total) * 100),
        icon: value.icon,
        color: value.color,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [reports]);

  const latestReports = useMemo(() => {
    return reports.slice(0, 4);
  }, [reports]);

  if (loading) {
    return (
      <AppScreen scroll={false} contentContainerStyle={styles.loadingContainer}>
        <LoadingState message="Memuat analytics..." />
      </AppScreen>
    );
  }

  return (
    <AppScreen contentContainerStyle={styles.screenContent}>
      <View style={styles.header}>
        <StatusBadge label="Realtime Analytics" variant="info" size="sm" />

        <Text style={styles.title}>Incident Insights</Text>

        <Text style={styles.subtitle}>
          Pantau distribusi laporan, severity, status verifikasi, dan aktivitas
          komunitas secara realtime.
        </Text>
      </View>

      {errorMessage ? (
        <AppCard variant="muted" style={styles.errorCard}>
          <IconBadge variant="danger" size="md" rounded={false}>
            <Ionicons name="warning" size={22} color={colors.danger} />
          </IconBadge>

          <View style={styles.errorContent}>
            <Text style={styles.errorTitle}>Gagal memuat data</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
        </AppCard>
      ) : null}

      {reports.length === 0 ? (
        <EmptyAnalyticsState />
      ) : (
        <>
          <View style={styles.summaryGrid}>
            {summaryItems.map((item) => (
              <SummaryCard key={item.label} item={item} />
            ))}
          </View>

          <View style={styles.metricList}>
            {metricItems.map((item) => (
              <MetricCard key={item.label} item={item} />
            ))}
          </View>

          <View style={styles.section}>
            <SectionHeader
              title="Severity Distribution"
              subtitle="Komposisi tingkat urgensi laporan"
              style={styles.sectionHeader}
            />

            <AppCard style={styles.distributionCard}>
              {severityDistribution.map((item, index) => (
                <DistributionRow
                  key={item.label}
                  item={item}
                  isLast={index === severityDistribution.length - 1}
                />
              ))}
            </AppCard>
          </View>

          <View style={styles.section}>
            <SectionHeader
              title="Top Incident Types"
              subtitle="Jenis laporan paling sering muncul"
              style={styles.sectionHeader}
            />

            <AppCard style={styles.distributionCard}>
              {categoryDistribution.length === 0 ? (
                <Text style={styles.emptyText}>Belum ada kategori.</Text>
              ) : (
                categoryDistribution.map((item, index) => (
                  <DistributionRow
                    key={item.label}
                    item={item}
                    isLast={index === categoryDistribution.length - 1}
                  />
                ))
              )}
            </AppCard>
          </View>

          <AppCard variant="muted" style={styles.activityCard}>
            <IconBadge variant="info" size="md" rounded={false}>
              <Ionicons name="chatbubbles" size={24} color={colors.info} />
            </IconBadge>

            <View style={styles.activityContent}>
              <Text style={styles.activityLabel}>Community Activity</Text>

              <Text style={styles.activityTitle}>
                {totalEvidence} evidence · {totalReplies} replies
              </Text>

              <Text style={styles.activityText}>
                Bukti foto dan diskusi membantu meningkatkan validitas laporan.
              </Text>
            </View>
          </AppCard>

          <View style={styles.section}>
            <SectionHeader
              title="Latest Activity"
              subtitle="Laporan terbaru"
              style={styles.sectionHeader}
            />

            <View style={styles.latestList}>
              {latestReports.map((report) => (
                <LatestReportCard key={report.id} report={report} />
              ))}
            </View>
          </View>
        </>
      )}
    </AppScreen>
  );
}

function SummaryCard({ item }: { item: SummaryItem }) {
  return (
    <AppCard style={styles.summaryCard}>
      <IconBadge variant={item.variant} size="md" rounded={false}>
        <Ionicons name={item.icon} size={23} color={item.color} />
      </IconBadge>

      <Text style={styles.summaryValue}>{item.value}</Text>
      <Text style={styles.summaryLabel}>{item.label}</Text>
    </AppCard>
  );
}

function MetricCard({ item }: { item: MetricItem }) {
  return (
    <AppCard style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Ionicons name={item.icon} size={22} color={colors.textInverse} />
        <Text style={styles.metricLabel}>{item.label}</Text>
      </View>

      <Text style={styles.metricValue}>{item.value}</Text>
      <Text style={styles.metricText}>{item.text}</Text>
    </AppCard>
  );
}

function DistributionRow({
  item,
  isLast,
}: {
  item: DistributionItem;
  isLast: boolean;
}) {
  const itemColor = item.color ?? colors.text;

  return (
    <View style={[styles.distributionRow, isLast && styles.distributionRowLast]}>
      <View style={styles.distributionTop}>
        <View style={styles.distributionLabelWrap}>
          {item.icon ? (
            <Ionicons name={item.icon} size={18} color={itemColor} />
          ) : null}

          <Text style={styles.distributionLabel} numberOfLines={1}>
            {item.label}
          </Text>
        </View>

        <Text style={styles.distributionCount}>
          {item.count} · {item.percentage}%
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.max(item.percentage, 4)}%`,
              backgroundColor: itemColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

function LatestReportCard({ report }: { report: IncidentReport }) {
  const meta = getIncidentMeta(report.subcategory ?? report.type);
  const icon = getIncidentIcon(report);

  return (
    <AppCard style={styles.latestCard}>
      <IconBadge
        variant="neutral"
        size="md"
        rounded={false}
        style={{
          backgroundColor: withAlpha(meta.color, "18"),
        }}
      >
        <Ionicons name={icon} size={22} color={meta.color} />
      </IconBadge>

      <View style={styles.latestInfo}>
        <Text style={styles.latestTitle} numberOfLines={1}>
          {report.title}
        </Text>

        <Text style={styles.latestSubtitle} numberOfLines={1}>
          {meta.label} · {report.severity}
        </Text>
      </View>

      <StatusBadge
        label={report.status}
        variant={getStatusVariant(report.status)}
        size="sm"
      />
    </AppCard>
  );
}

function EmptyAnalyticsState() {
  return (
    <AppCard style={styles.emptyStateCard}>
      <IconBadge variant="info" size="lg" rounded={false}>
        <Ionicons name="stats-chart" size={28} color={colors.info} />
      </IconBadge>

      <Text style={styles.emptyStateTitle}>Belum ada data analytics</Text>

      <Text style={styles.emptyStateText}>
        Analytics akan muncul setelah ada laporan incident yang masuk.
      </Text>
    </AppCard>
  );
}

function getStatusVariant(status: IncidentReport["status"]): StatusBadgeVariant {
  switch (status) {
    case "active":
      return "active";

    case "resolved":
      return "resolved";

    default:
      return "neutral";
  }
}

function withAlpha(hexColor: string, alpha: string) {
  if (!hexColor.startsWith("#") || hexColor.length !== 7) {
    return hexColor;
  }

  return `${hexColor}${alpha}`;
}

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
  },
  screenContent: {
    gap: spacing["2xl"],
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    ...typography.hero,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#991B1B",
    marginBottom: 4,
  },
  errorMessage: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  summaryCard: {
    width: "48%",
    minHeight: 132,
  },
  summaryValue: {
    marginTop: spacing.md,
    fontSize: 28,
    fontWeight: "900",
    color: colors.text,
  },
  summaryLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "800",
    color: colors.textMuted,
  },
  metricList: {
    gap: spacing.md,
  },
  metricCard: {
    backgroundColor: colors.dark,
    borderColor: colors.dark,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  metricLabel: {
    ...typography.label,
    color: colors.textSoft,
  },
  metricValue: {
    fontSize: 25,
    fontWeight: "900",
    color: colors.textInverse,
  },
  metricText: {
    marginTop: 5,
    ...typography.caption,
    color: "#CBD5E1",
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    marginBottom: 0,
  },
  distributionCard: {
    paddingBottom: 0,
  },
  distributionRow: {
    marginBottom: spacing.lg,
  },
  distributionRowLast: {
    marginBottom: 0,
  },
  distributionTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  distributionLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  distributionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  distributionCount: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.textMuted,
  },
  progressTrack: {
    height: 9,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: radius.full,
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: colors.infoSoft,
    borderColor: "#BFDBFE",
  },
  activityContent: {
    flex: 1,
  },
  activityLabel: {
    ...typography.label,
    color: colors.infoDark,
    marginBottom: 5,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1E3A8A",
  },
  activityText: {
    marginTop: spacing.sm,
    ...typography.caption,
    color: colors.info,
  },
  latestList: {
    gap: spacing.sm,
  },
  latestCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  latestInfo: {
    flex: 1,
  },
  latestTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  latestSubtitle: {
    marginTop: 4,
    ...typography.caption,
    color: colors.textMuted,
  },
  emptyText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  emptyStateCard: {
    alignItems: "center",
    paddingVertical: spacing["3xl"],
  },
  emptyStateTitle: {
    marginTop: spacing.md,
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
  },
  emptyStateText: {
    marginTop: spacing.sm,
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
  },
});