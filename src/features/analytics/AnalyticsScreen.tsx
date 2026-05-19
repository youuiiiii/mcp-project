import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import AppCard from "../../components/ui/AppCard";
import AppScreen from "../../components/ui/AppScreen";
import IconBadge from "../../components/ui/IconBadge";
import LoadingState from "../../components/ui/LoadingState";
import SectionHeader from "../../components/ui/SectionHeader";
import StatusBadge, {
  type StatusBadgeVariant,
} from "../../components/ui/StatusBadge";
import { getIncidentDisplayMeta } from "../../constants/incident";
import { colors } from "../../theme/colors";
import type { IncidentReport } from "../../types/incident";
import { SEVERITY_LABEL_BY_VALUE } from "./analyticsData";
import { analyticsStyles as styles } from "./analyticsStyles";
import { useAnalyticsScreen } from "./hooks/useAnalyticsScreen";
import type { DistributionItem, MetricItem, SummaryItem } from "./types";

export default function AnalyticsScreen() {
  const {
    reports,
    loading,
    errorMessage,
    summaryItems,
    metricItems,
    categoryDistribution,
    severityDistribution,
    statusDistribution,
    trustDistribution,
    totalEvidence,
    totalReplies,
    latestReports,
  } = useAnalyticsScreen();

  if (loading) {
    return (
      <AppScreen scroll={false} contentContainerStyle={styles.loadingContainer}>
        <LoadingState message="Loading analytics..." />
      </AppScreen>
    );
  }

  return (
    <AppScreen contentContainerStyle={styles.screenContent}>
      <View style={styles.header}>
        <StatusBadge label="Realtime Analytics" variant="info" size="sm" />

        <Text style={styles.title}>Incident Insights</Text>

        <Text style={styles.subtitle}>
          Monitor category distribution, urgency, status, community validation,
          and report activity in real time.
        </Text>
      </View>

      {errorMessage ? (
        <AppCard variant="muted" style={styles.errorCard}>
          <IconBadge variant="danger" size="md" rounded={false}>
            <Ionicons name="warning" size={22} color={colors.danger} />
          </IconBadge>

          <View style={styles.errorContent}>
            <Text style={styles.errorTitle}>Could not load data</Text>
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
            title="Category Distribution"
            subtitle="Report composition by main category"
            emptyText="No category data yet."
            items={categoryDistribution}
          />

          <DistributionSection
            title="Urgency Distribution"
            subtitle="Report composition by computed urgency level"
            emptyText="No urgency data yet."
            items={severityDistribution}
          />

          <DistributionSection
            title="Status Distribution"
            subtitle="Active versus resolved reports"
            emptyText="No status data yet."
            items={statusDistribution}
          />

          <DistributionSection
            title="Community Validation"
            subtitle="Trust summary based on confirmations and disputes"
            emptyText="No validation data yet."
            items={trustDistribution}
          />

          <AppCard variant="muted" style={styles.activityCard}>
            <IconBadge variant="info" size="md" rounded={false}>
              <Ionicons name="chatbubbles" size={24} color={colors.info} />
            </IconBadge>

            <View style={styles.activityContent}>
              <Text style={styles.activityLabel}>Aktivitas Komunitas</Text>

              <Text style={styles.activityTitle}>
                {totalEvidence} evidence - {totalReplies} discussions
              </Text>

              <Text style={styles.activityText}>
                Evidence photos and discussions help people understand report conditions.
              </Text>
            </View>
          </AppCard>

          <View style={styles.section}>
            <SectionHeader
              title="Latest Activity"
              subtitle="Latest reports by recent activity"
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
          {meta.label} -{" "}
          {SEVERITY_LABEL_BY_VALUE[report.urgencyLevel ?? report.severity]}
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

      <Text style={styles.emptyStateTitle}>No analytics data yet</Text>

      <Text style={styles.emptyStateText}>
        Analytics will appear after incident reports are submitted.
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
      return "Active";

    case "resolved":
      return "Resolved";

    default:
      return "Unknown";
  }
}

function withAlpha(hexColor: string, alpha: string) {
  if (!hexColor.startsWith("#") || hexColor.length !== 7) {
    return hexColor;
  }

  return `${hexColor}${alpha}`;
}
