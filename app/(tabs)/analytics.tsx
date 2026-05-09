import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  INCIDENT_CATEGORY_OPTIONS,
  INCIDENT_TYPE_OPTIONS,
  getIncidentCategoryMeta,
  getIncidentMeta,
} from "../../src/constants/incident";
import { subscribeToIncidents } from "../../src/services/incidentService";
import {
  IncidentCategory,
  IncidentReport,
  IncidentSeverity,
  IncidentSubcategory,
} from "../../src/types/incident";
import {
  getIncidentTrustLevel,
  IncidentTrustLevel,
} from "../../src/utils/incidentTrust";
import {
  getIncidentUrgencyMeta,
  IncidentUrgencyLevel,
} from "../../src/utils/incidentUrgency";

type CategoryStat = {
  value: IncidentCategory;
  label: string;
  icon: string;
  color: string;
  total: number;
  active: number;
  resolved: number;
};

type SubcategoryStat = {
  value: IncidentSubcategory;
  category: IncidentCategory;
  label: string;
  icon: string;
  color: string;
  total: number;
  active: number;
  resolved: number;
};

type SeverityStat = {
  value: IncidentSeverity;
  label: string;
  color: string;
  total: number;
};

type TrustStat = {
  value: IncidentTrustLevel;
  label: string;
  color: string;
  total: number;
};

type UrgencyStat = {
  value: IncidentUrgencyLevel;
  label: string;
  color: string;
  total: number;
};

const TRUST_META: Record<
  IncidentTrustLevel,
  {
    label: string;
    color: string;
  }
> = {
  pending: {
    label: "Pending",
    color: "#F59E0B",
  },
  verified: {
    label: "Verified",
    color: "#16A34A",
  },
  disputed: {
    label: "Disputed",
    color: "#DC2626",
  },
  needs_update: {
    label: "Perlu Update",
    color: "#9333EA",
  },
  resolved: {
    label: "Resolved",
    color: "#64748B",
  },
};

const URGENCY_META: Record<
  IncidentUrgencyLevel,
  {
    label: string;
    color: string;
  }
> = {
  low: {
    label: "Low",
    color: "#16A34A",
  },
  medium: {
    label: "Medium",
    color: "#F59E0B",
  },
  high: {
    label: "High",
    color: "#EA580C",
  },
  critical: {
    label: "Critical",
    color: "#DC2626",
  },
};

const SEVERITY_META: Record<
  IncidentSeverity,
  {
    label: string;
    color: string;
  }
> = {
  low: {
    label: "Low",
    color: "#16A34A",
  },
  medium: {
    label: "Medium",
    color: "#F59E0B",
  },
  high: {
    label: "High",
    color: "#DC2626",
  },
};

const formatDurationHours = (hours: number | null) => {
  if (hours === null || Number.isNaN(hours)) {
    return "-";
  }

  if (hours < 1) {
    return `${Math.round(hours * 60)} menit`;
  }

  if (hours < 24) {
    return `${hours.toFixed(1)} jam`;
  }

  return `${(hours / 24).toFixed(1)} hari`;
};

const getAverageResolutionHours = (reports: IncidentReport[]) => {
  const resolvedReports = reports.filter((report) => {
    return report.status === "resolved" && report.createdAt && report.resolvedAt;
  });

  if (resolvedReports.length === 0) {
    return null;
  }

  const totalHours = resolvedReports.reduce((sum, report) => {
    if (!report.createdAt || !report.resolvedAt) {
      return sum;
    }

    const diffMs = report.resolvedAt.getTime() - report.createdAt.getTime();

    return sum + diffMs / (1000 * 60 * 60);
  }, 0);

  return totalHours / resolvedReports.length;
};

const getAverageUrgencyScore = (reports: IncidentReport[]) => {
  if (reports.length === 0) {
    return 0;
  }

  const activeReports = reports.filter((report) => {
    return report.status === "active";
  });

  if (activeReports.length === 0) {
    return 0;
  }

  const totalScore = activeReports.reduce((sum, report) => {
    return sum + getIncidentUrgencyMeta(report).score;
  }, 0);

  return Math.round(totalScore / activeReports.length);
};

const BarRow = ({
  label,
  value,
  max,
  color,
  subtitle,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  subtitle?: string;
}) => {
  const width = max > 0 ? Math.max((value / max) * 100, value > 0 ? 8 : 0) : 0;

  return (
    <View style={styles.barRow}>
      <View style={styles.barHeader}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={styles.barValue}>{value}</Text>
      </View>

      {subtitle ? <Text style={styles.barSubtitle}>{subtitle}</Text> : null}

      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            {
              width: `${width}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
};

export default function AnalyticsScreen() {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToIncidents(
      (items) => {
        setReports(items);
        setLoading(false);
      },
      (error) => {
        setErrorMessage(error.message || "Gagal memuat data analytics.");
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const totalReports = reports.length;

  const activeReports = useMemo(() => {
    return reports.filter((report) => report.status === "active");
  }, [reports]);

  const resolvedReports = useMemo(() => {
    return reports.filter((report) => report.status === "resolved");
  }, [reports]);

  const categoryStats = useMemo<CategoryStat[]>(() => {
    return INCIDENT_CATEGORY_OPTIONS.map((item) => {
      const categoryReports = reports.filter((report) => {
        return report.category === item.value;
      });

      return {
        value: item.value,
        label: item.label,
        icon: item.icon,
        color: item.color,
        total: categoryReports.length,
        active: categoryReports.filter((report) => report.status === "active")
          .length,
        resolved: categoryReports.filter(
          (report) => report.status === "resolved"
        ).length,
      };
    }).sort((a, b) => b.total - a.total);
  }, [reports]);

  const subcategoryStats = useMemo<SubcategoryStat[]>(() => {
    return INCIDENT_TYPE_OPTIONS.map((item) => {
      const subcategoryReports = reports.filter((report) => {
        return report.subcategory === item.value || report.type === item.value;
      });

      return {
        value: item.value,
        category: item.category,
        label: item.label,
        icon: item.icon,
        color: item.color,
        total: subcategoryReports.length,
        active: subcategoryReports.filter((report) => {
          return report.status === "active";
        }).length,
        resolved: subcategoryReports.filter((report) => {
          return report.status === "resolved";
        }).length,
      };
    })
      .filter((item) => item.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [reports]);

  const severityStats = useMemo<SeverityStat[]>(() => {
    return (["low", "medium", "high"] as IncidentSeverity[]).map((severity) => {
      return {
        value: severity,
        label: SEVERITY_META[severity].label,
        color: SEVERITY_META[severity].color,
        total: reports.filter((report) => report.severity === severity).length,
      };
    });
  }, [reports]);

  const trustStats = useMemo<TrustStat[]>(() => {
    return (
      [
        "pending",
        "verified",
        "disputed",
        "needs_update",
        "resolved",
      ] as IncidentTrustLevel[]
    ).map((level) => {
      return {
        value: level,
        label: TRUST_META[level].label,
        color: TRUST_META[level].color,
        total: reports.filter((report) => {
          return getIncidentTrustLevel(report) === level;
        }).length,
      };
    });
  }, [reports]);

  const urgencyStats = useMemo<UrgencyStat[]>(() => {
    return (["low", "medium", "high", "critical"] as IncidentUrgencyLevel[]).map(
      (level) => {
        return {
          value: level,
          label: URGENCY_META[level].label,
          color: URGENCY_META[level].color,
          total: reports.filter((report) => {
            return getIncidentUrgencyMeta(report).level === level;
          }).length,
        };
      }
    );
  }, [reports]);

  const averageResolutionHours = useMemo(() => {
    return getAverageResolutionHours(reports);
  }, [reports]);

  const averageUrgencyScore = useMemo(() => {
    return getAverageUrgencyScore(reports);
  }, [reports]);

  const maxCategory = Math.max(...categoryStats.map((item) => item.total), 0);

  const maxSubcategory = Math.max(
    ...subcategoryStats.map((item) => item.total),
    0
  );

  const maxSeverity = Math.max(...severityStats.map((item) => item.total), 0);

  const maxTrust = Math.max(...trustStats.map((item) => item.total), 0);

  const maxUrgency = Math.max(...urgencyStats.map((item) => item.total), 0);

  const topSubcategory = subcategoryStats[0] ?? null;
  const topCategory = categoryStats[0] ?? null;

  const topUrgencyLevel = urgencyStats
    .slice()
    .sort((a, b) => b.total - a.total)[0];

  const criticalReports = urgencyStats.find((item) => item.value === "critical");

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0F766E" />
        <Text style={styles.loadingText}>Memuat analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Incident Analytics</Text>
      <Text style={styles.pageSubtitle}>
        Ringkasan laporan berdasarkan kategori, subkategori, severity, trust
        level, dan urgency score otomatis.
      </Text>

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{totalReports}</Text>
          <Text style={styles.summaryLabel}>Total Laporan</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{activeReports.length}</Text>
          <Text style={styles.summaryLabel}>Aktif</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{resolvedReports.length}</Text>
          <Text style={styles.summaryLabel}>Selesai</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{averageUrgencyScore}</Text>
          <Text style={styles.summaryLabel}>Avg Urgency</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {criticalReports?.total ?? 0}
          </Text>
          <Text style={styles.summaryLabel}>Critical</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {formatDurationHours(averageResolutionHours)}
          </Text>
          <Text style={styles.summaryLabel}>Rata-rata Resolve</Text>
        </View>
      </View>

      <View style={styles.highlightCard}>
        <Text style={styles.sectionTitle}>Insight Utama</Text>

        <Text style={styles.insightText}>
          Kategori terbanyak:{" "}
          <Text style={styles.insightStrong}>
            {topCategory
              ? `${topCategory.icon} ${topCategory.label} (${topCategory.total})`
              : "-"}
          </Text>
        </Text>

        <Text style={styles.insightText}>
          Subkategori terbanyak:{" "}
          <Text style={styles.insightStrong}>
            {topSubcategory
              ? `${topSubcategory.icon} ${topSubcategory.label} (${topSubcategory.total})`
              : "-"}
          </Text>
        </Text>

        <Text style={styles.insightText}>
          Urgency terbanyak:{" "}
          <Text style={styles.insightStrong}>
            {topUrgencyLevel
              ? `${topUrgencyLevel.label} (${topUrgencyLevel.total})`
              : "-"}
          </Text>
        </Text>

        <Text style={styles.insightText}>
          Tingkat penyelesaian:{" "}
          <Text style={styles.insightStrong}>
            {totalReports > 0
              ? `${Math.round((resolvedReports.length / totalReports) * 100)}%`
              : "0%"}
          </Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kategori Kejadian</Text>

        <View style={styles.card}>
          {categoryStats.map((item) => (
            <BarRow
              key={item.value}
              label={`${item.icon} ${item.label}`}
              value={item.total}
              max={maxCategory}
              color={item.color}
              subtitle={`Aktif: ${item.active} • Selesai: ${item.resolved}`}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subkategori Teratas</Text>

        <View style={styles.card}>
          {subcategoryStats.length === 0 ? (
            <Text style={styles.emptyText}>Belum ada data subkategori.</Text>
          ) : (
            subcategoryStats.slice(0, 10).map((item) => (
              <BarRow
                key={item.value}
                label={`${item.icon} ${item.label}`}
                value={item.total}
                max={maxSubcategory}
                color={item.color}
                subtitle={`${getIncidentCategoryMeta(item.category).label} • Aktif: ${
                  item.active
                } • Selesai: ${item.resolved}`}
              />
            ))
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Severity</Text>

        <View style={styles.card}>
          {severityStats.map((item) => (
            <BarRow
              key={item.value}
              label={item.label}
              value={item.total}
              max={maxSeverity}
              color={item.color}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trust Level</Text>

        <View style={styles.card}>
          {trustStats.map((item) => (
            <BarRow
              key={item.value}
              label={item.label}
              value={item.total}
              max={maxTrust}
              color={item.color}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Urgency Level</Text>

        <View style={styles.card}>
          {urgencyStats.map((item) => (
            <BarRow
              key={item.value}
              label={item.label}
              value={item.total}
              max={maxUrgency}
              color={item.color}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Laporan Terbaru</Text>

        <View style={styles.card}>
          {reports.slice(0, 5).map((report) => {
            const meta = getIncidentMeta(report.subcategory ?? report.type);
            const trustLevel = getIncidentTrustLevel(report);
            const urgency = getIncidentUrgencyMeta(report);

            return (
              <View key={report.id} style={styles.recentItem}>
                <View
                  style={[
                    styles.recentIconBox,
                    {
                      backgroundColor: meta.lightColor,
                    },
                  ]}
                >
                  <Text style={styles.recentIcon}>{meta.icon}</Text>
                </View>

                <View style={styles.recentContent}>
                  <Text style={styles.recentTitle}>{report.title}</Text>
                  <Text style={styles.recentMeta}>
                    {meta.label} • {report.status} • {report.severity}
                  </Text>
                  <Text style={styles.recentMeta}>
                    Trust: {TRUST_META[trustLevel].label} • Urgency:{" "}
                    {urgency.shortLabel} {urgency.score}
                  </Text>
                </View>
              </View>
            );
          })}

          {reports.length === 0 ? (
            <Text style={styles.emptyText}>Belum ada laporan.</Text>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#64748B",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0F172A",
  },
  pageSubtitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    lineHeight: 21,
  },
  errorBox: {
    marginTop: 16,
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    borderRadius: 18,
    padding: 14,
  },
  errorText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#B91C1C",
  },
  summaryGrid: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  summaryCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 22,
    padding: 16,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0F172A",
  },
  summaryLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
  },
  highlightCard: {
    marginTop: 18,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 24,
    padding: 16,
  },
  section: {
    marginTop: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 24,
    padding: 16,
    gap: 14,
  },
  insightText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
    lineHeight: 21,
  },
  insightStrong: {
    color: "#047857",
    fontWeight: "900",
  },
  barRow: {
    gap: 6,
  },
  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  barLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: "900",
    color: "#0F172A",
  },
  barValue: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0F172A",
  },
  barSubtitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
  },
  barTrack: {
    height: 9,
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
  },
  recentItem: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  recentIconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  recentIcon: {
    fontSize: 22,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
  },
  recentMeta: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
  },
  emptyText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },
});