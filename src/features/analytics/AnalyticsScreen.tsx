import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "../../components/ui/AppCard";
import AppScreen from "../../components/ui/AppScreen";
import IconBadge from "../../components/ui/IconBadge";
import LoadingState from "../../components/ui/LoadingState";
import SectionHeader from "../../components/ui/SectionHeader";
import StatusBadge, {
  type StatusBadgeVariant,
} from "../../components/ui/StatusBadge";
import {
  INCIDENT_CATEGORY_OPTIONS,
  SEVERITY_OPTIONS,
  getIncidentDisplayMeta,
  type AppIconName,
} from "../../constants/incident";
import { subscribeToIncidents } from "../../services/incidentService";
import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";
import type {
  IncidentReport,
  IncidentSeverity,
  IncidentStatus,
} from "../../types/incident";
import {
  getIncidentTrustLevel,
  type IncidentTrustLevel,
} from "../../utils/incidentTrust";

type IconBadgeVariant = "danger" | "success" | "warning" | "info" | "neutral";

type SummaryItem = {
  label: string;
  value: number;
  iconName: AppIconName;
  color: string;
  variant: IconBadgeVariant;
};

type MetricItem = {
  label: string;
  value: number | string;
  text: string;
  iconName: AppIconName;
};

type DistributionItem = {
  label: string;
  count: number;
  percentage: number;
  iconName?: AppIconName;
  color?: string;
};

const STATUS_DISTRIBUTION_OPTIONS = [
  {
    value: "active",
    label: "Aktif",
    iconName: "radio",
    color: colors.danger,
  },
  {
    value: "resolved",
    label: "Selesai",
    iconName: "checkmark-circle",
    color: colors.success,
  },
] as const satisfies readonly {
  value: IncidentStatus;
  label: string;
  iconName: AppIconName;
  color: string;
}[];

const TRUST_DISTRIBUTION_OPTIONS = [
  {
    value: "pending",
    label: "Menunggu Verifikasi",
    iconName: "time-outline",
    color: colors.warning,
  },
  {
    value: "verified",
    label: "Terverifikasi",
    iconName: "shield-checkmark-outline",
    color: colors.success,
  },
  {
    value: "disputed",
    label: "Dipertanyakan",
    iconName: "alert-circle-outline",
    color: colors.danger,
  },
  {
    value: "resolved",
    label: "Selesai",
    iconName: "checkmark-done-circle-outline",
    color: colors.textSoft,
  },
] as const satisfies readonly {
  value: IncidentTrustLevel;
  label: string;
  iconName: AppIconName;
  color: string;
}[];

const SEVERITY_LABEL_BY_VALUE = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
} as const satisfies Record<IncidentSeverity, string>;

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

    return unsubscribe;
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

  const trustCounts = useMemo(() => {
    return reports.reduce<Record<IncidentTrustLevel, number>>(
      (acc, report) => {
        const level = getIncidentTrustLevel(report);

        acc[level] += 1;

        return acc;
      },
      {
        pending: 0,
        verified: 0,
        disputed: 0,
        resolved: 0,
      }
    );
  }, [reports]);

  const totalEvidence = useMemo(() => {
    return reports.reduce((total, report) => {
      return total + getSafeCount(report.evidenceCount);
    }, 0);
  }, [reports]);

  const totalReplies = useMemo(() => {
    return reports.reduce((total, report) => {
      return total + getSafeCount(report.replyCount);
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

    return `${Math.round(totalHours / resolvedWithTime.length)} jam`;
  }, [resolvedReports]);

  const summaryItems = useMemo<SummaryItem[]>(() => {
    return [
      {
        label: "Total Laporan",
        value: reports.length,
        iconName: "location",
        color: colors.info,
        variant: "info",
      },
      {
        label: "Aktif",
        value: activeReports.length,
        iconName: "radio",
        color: colors.danger,
        variant: "danger",
      },
      {
        label: "Selesai",
        value: resolvedReports.length,
        iconName: "checkmark-circle",
        color: colors.success,
        variant: "success",
      },
      {
        label: "Severity Tinggi",
        value: highSeverityReports.length,
        iconName: "alert-circle",
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
        label: "Terverifikasi",
        value: trustCounts.verified,
        text: "laporan dipercaya komunitas",
        iconName: "shield-checkmark",
      },
      {
        label: "Dipertanyakan",
        value: trustCounts.disputed,
        text: "laporan perlu ditinjau",
        iconName: "help-circle",
      },
      {
        label: "Rata-rata Selesai",
        value: averageResolutionHours,
        text: "durasi penyelesaian",
        iconName: "time",
      },
    ];
  }, [trustCounts.verified, trustCounts.disputed, averageResolutionHours]);

  const severityDistribution = useMemo<DistributionItem[]>(() => {
    return buildSeverityDistribution(reports);
  }, [reports]);

  const statusDistribution = useMemo<DistributionItem[]>(() => {
    return buildStatusDistribution(reports);
  }, [reports]);

  const categoryDistribution = useMemo<DistributionItem[]>(() => {
    return buildCategoryDistribution(reports);
  }, [reports]);

  const trustDistribution = useMemo<DistributionItem[]>(() => {
    return buildTrustDistribution(reports);
  }, [reports]);

  const latestReports = useMemo(() => {
    return [...reports]
      .sort((a, b) => getReportTimestamp(b) - getReportTimestamp(a))
      .slice(0, 4);
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
          Pantau distribusi kategori, severity, status, validasi komunitas, dan
          aktivitas laporan secara realtime.
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

          <DistributionSection
            title="Distribusi Kategori"
            subtitle="Komposisi laporan berdasarkan kategori utama"
            emptyText="Belum ada kategori laporan."
            items={categoryDistribution}
          />

          <DistributionSection
            title="Distribusi Severity"
            subtitle="Komposisi tingkat dampak laporan"
            emptyText="Belum ada data severity."
            items={severityDistribution}
          />

          <DistributionSection
            title="Distribusi Status"
            subtitle="Perbandingan laporan aktif dan selesai"
            emptyText="Belum ada data status."
            items={statusDistribution}
          />

          <DistributionSection
            title="Validasi Komunitas"
            subtitle="Ringkasan tingkat kepercayaan berdasarkan verifikasi dan dispute"
            emptyText="Belum ada data validasi."
            items={trustDistribution}
          />

          <AppCard variant="muted" style={styles.activityCard}>
            <IconBadge variant="info" size="md" rounded={false}>
              <Ionicons name="chatbubbles" size={24} color={colors.info} />
            </IconBadge>

            <View style={styles.activityContent}>
              <Text style={styles.activityLabel}>Aktivitas Komunitas</Text>

              <Text style={styles.activityTitle}>
                {totalEvidence} bukti - {totalReplies} diskusi
              </Text>

              <Text style={styles.activityText}>
                Bukti foto dan diskusi membantu warga memahami kondisi laporan.
              </Text>
            </View>
          </AppCard>

          <View style={styles.section}>
            <SectionHeader
              title="Aktivitas Terbaru"
              subtitle="Laporan terbaru berdasarkan aktivitas terakhir"
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

function buildCategoryDistribution(reports: IncidentReport[]): DistributionItem[] {
  const total = reports.length || 1;

  return INCIDENT_CATEGORY_OPTIONS.map((option) => {
    const count = reports.filter((report) => {
      return report.category === option.value;
    }).length;

    return {
      label: option.label,
      count,
      percentage: Math.round((count / total) * 100),
      iconName: option.iconName,
      color: option.color,
    };
  })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);
}

function buildSeverityDistribution(reports: IncidentReport[]): DistributionItem[] {
  const total = reports.length || 1;

  return SEVERITY_OPTIONS.map((option) => {
    const count = reports.filter((report) => {
      return report.severity === option.value;
    }).length;

    return {
      label: option.label,
      count,
      percentage: Math.round((count / total) * 100),
      iconName: option.iconName,
      color: option.color,
    };
  });
}

function buildStatusDistribution(reports: IncidentReport[]): DistributionItem[] {
  const total = reports.length || 1;

  return STATUS_DISTRIBUTION_OPTIONS.map((option) => {
    const count = reports.filter((report) => {
      return report.status === option.value;
    }).length;

    return {
      label: option.label,
      count,
      percentage: Math.round((count / total) * 100),
      iconName: option.iconName,
      color: option.color,
    };
  });
}

function buildTrustDistribution(reports: IncidentReport[]): DistributionItem[] {
  const total = reports.length || 1;

  return TRUST_DISTRIBUTION_OPTIONS.map((option) => {
    const count = reports.filter((report) => {
      return getIncidentTrustLevel(report) === option.value;
    }).length;

    return {
      label: option.label,
      count,
      percentage: Math.round((count / total) * 100),
      iconName: option.iconName,
      color: option.color,
    };
  }).filter((item) => item.count > 0);
}

function SummaryCard({ item }: { item: SummaryItem }) {
  return (
    <AppCard style={styles.summaryCard}>
      <IconBadge variant={item.variant} size="md" rounded={false}>
        <Ionicons name={item.iconName} size={23} color={item.color} />
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
        <Ionicons name={item.iconName} size={22} color={colors.textInverse} />
        <Text style={styles.metricLabel}>{item.label}</Text>
      </View>

      <Text style={styles.metricValue}>{item.value}</Text>
      <Text style={styles.metricText}>{item.text}</Text>
    </AppCard>
  );
}

function DistributionSection({
  title,
  subtitle,
  emptyText,
  items,
}: {
  title: string;
  subtitle: string;
  emptyText: string;
  items: DistributionItem[];
}) {
  return (
    <View style={styles.section}>
      <SectionHeader title={title} subtitle={subtitle} style={styles.sectionHeader} />

      <AppCard style={styles.distributionCard}>
        {items.length === 0 ? (
          <Text style={styles.emptyText}>{emptyText}</Text>
        ) : (
          items.map((item, index) => (
            <DistributionRow
              key={item.label}
              item={item}
              isLast={index === items.length - 1}
            />
          ))
        )}
      </AppCard>
    </View>
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
          {item.iconName ? (
            <Ionicons name={item.iconName} size={18} color={itemColor} />
          ) : null}

          <Text style={styles.distributionLabel} numberOfLines={1}>
            {item.label}
          </Text>
        </View>

        <Text style={styles.distributionCount}>
          {item.count} - {item.percentage}%
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
  const meta = getIncidentDisplayMeta({
    category: report.category,
    subcategory: report.subcategory ?? report.type,
  });

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
        <Ionicons name={meta.iconName} size={22} color={meta.color} />
      </IconBadge>

      <View style={styles.latestInfo}>
        <Text style={styles.latestTitle} numberOfLines={1}>
          {report.title}
        </Text>

        <Text style={styles.latestSubtitle} numberOfLines={1}>
          {meta.label} - {SEVERITY_LABEL_BY_VALUE[report.severity]}
        </Text>
      </View>

      <StatusBadge
        label={getStatusLabel(report.status)}
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

function getStatusLabel(status: IncidentReport["status"]): string {
  switch (status) {
    case "active":
      return "Aktif";

    case "resolved":
      return "Selesai";

    default:
      return "Tidak dikenal";
  }
}

function getReportTimestamp(report: IncidentReport): number {
  return (
    report.latestActivityAt?.getTime() ??
    report.updatedAt?.getTime() ??
    report.createdAt?.getTime() ??
    0
  );
}

function getSafeCount(value?: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, value);
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
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.danger,
    marginBottom: 4,
  },
  errorMessage: {
    ...typography.caption,
    color: colors.textMuted,
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
    color: colors.textSoft,
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
    color: colors.text,
  },
  activityText: {
    marginTop: spacing.sm,
    ...typography.caption,
    color: colors.textMuted,
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
