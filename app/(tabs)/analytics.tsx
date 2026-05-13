import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import EmptyState from "../../src/components/ui/EmptyState";
import LoadingState from "../../src/components/ui/LoadingState";
import { getIncidentMeta } from "../../src/constants/incident";
import { subscribeToIncidents } from "../../src/services/incidentService";
import { IncidentReport } from "../../src/types/incident";

type DistributionItem = {
  label: string;
  count: number;
  percentage: number;
  icon?: string;
  color?: string;
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
        color: "#16A34A",
      },
      {
        label: "Medium",
        count: medium,
        percentage: Math.round((medium / total) * 100),
        color: "#F59E0B",
      },
      {
        label: "High",
        count: high,
        percentage: Math.round((high / total) * 100),
        color: "#DC2626",
      },
    ];
  }, [reports]);

  const categoryDistribution = useMemo<DistributionItem[]>(() => {
    const counter = new Map<
      string,
      {
        count: number;
        icon: string;
        color: string;
      }
    >();

    reports.forEach((report) => {
      const meta = getIncidentMeta(report.subcategory ?? report.type);
      const existing = counter.get(meta.label);

      counter.set(meta.label, {
        count: (existing?.count ?? 0) + 1,
        icon: meta.icon,
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

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingState message="Memuat analytics..." />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>REALTIME ANALYTICS</Text>
        </View>

        <Text style={styles.title}>Incident Insights</Text>

        <Text style={styles.subtitle}>
          Pantau distribusi laporan, severity, status verifikasi, dan aktivitas
          komunitas secara realtime.
        </Text>
      </View>

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Gagal memuat data</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      ) : null}

      {reports.length === 0 ? (
        <EmptyState
          icon="📊"
          title="Belum ada data analytics"
          message="Analytics akan muncul setelah ada laporan masuk."
        />
      ) : (
        <>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>📍</Text>
              <Text style={styles.summaryValue}>{reports.length}</Text>
              <Text style={styles.summaryLabel}>Total Reports</Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>🚨</Text>
              <Text style={styles.summaryValue}>{activeReports.length}</Text>
              <Text style={styles.summaryLabel}>Active</Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>✅</Text>
              <Text style={styles.summaryValue}>{resolvedReports.length}</Text>
              <Text style={styles.summaryLabel}>Resolved</Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>🔥</Text>
              <Text style={styles.summaryValue}>
                {highSeverityReports.length}
              </Text>
              <Text style={styles.summaryLabel}>High Severity</Text>
            </View>
          </View>

          <View style={styles.metricRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Verified</Text>
              <Text style={styles.metricValue}>{verifiedReports.length}</Text>
              <Text style={styles.metricText}>community verified</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Disputed</Text>
              <Text style={styles.metricValue}>{disputedReports.length}</Text>
              <Text style={styles.metricText}>needs review</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Avg Resolve</Text>
              <Text style={styles.metricValue}>{averageResolutionHours}</Text>
              <Text style={styles.metricText}>resolution time</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Severity Distribution</Text>
              <Text style={styles.sectionSubtitle}>
                Komposisi tingkat urgensi laporan
              </Text>
            </View>

            <View style={styles.card}>
              {severityDistribution.map((item) => (
                <DistributionRow key={item.label} item={item} />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Incident Types</Text>
              <Text style={styles.sectionSubtitle}>
                Jenis laporan paling sering muncul
              </Text>
            </View>

            <View style={styles.card}>
              {categoryDistribution.length === 0 ? (
                <Text style={styles.emptyText}>Belum ada kategori.</Text>
              ) : (
                categoryDistribution.map((item) => (
                  <DistributionRow key={item.label} item={item} />
                ))
              )}
            </View>
          </View>

          <View style={styles.activityCard}>
            <View>
              <Text style={styles.activityLabel}>Community Activity</Text>
              <Text style={styles.activityTitle}>
                {totalEvidence} evidence · {totalReplies} replies
              </Text>
            </View>

            <Text style={styles.activityText}>
              Bukti foto dan diskusi membantu meningkatkan validitas laporan.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Latest Activity</Text>
              <Text style={styles.sectionSubtitle}>Laporan terbaru</Text>
            </View>

            <View style={styles.latestList}>
              {latestReports.map((report) => {
                const meta = getIncidentMeta(report.subcategory ?? report.type);

                return (
                  <View key={report.id} style={styles.latestCard}>
                    <View
                      style={[
                        styles.latestIcon,
                        {
                          backgroundColor: `${meta.color}18`,
                        },
                      ]}
                    >
                      <Text style={styles.latestIconText}>{meta.icon}</Text>
                    </View>

                    <View style={styles.latestInfo}>
                      <Text style={styles.latestTitle} numberOfLines={1}>
                        {report.title}
                      </Text>

                      <Text style={styles.latestSubtitle} numberOfLines={1}>
                        {meta.label} · {report.status} · {report.severity}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusPill,
                        report.status === "active"
                          ? styles.statusActive
                          : styles.statusResolved,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          report.status === "active"
                            ? styles.statusActiveText
                            : styles.statusResolvedText,
                        ]}
                      >
                        {report.status}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function DistributionRow({ item }: { item: DistributionItem }) {
  return (
    <View style={styles.distributionRow}>
      <View style={styles.distributionTop}>
        <View style={styles.distributionLabelWrap}>
          {item.icon ? (
            <Text style={styles.distributionIcon}>{item.icon}</Text>
          ) : null}

          <Text style={styles.distributionLabel}>{item.label}</Text>
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
              backgroundColor: item.color ?? "#0F172A",
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 58,
    paddingBottom: 36,
  },
  hero: {
    marginBottom: 22,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#1D4ED8",
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    lineHeight: 22,
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#991B1B",
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 13,
    fontWeight: "600",
    color: "#B91C1C",
    lineHeight: 20,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 18,
  },
  summaryCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    minHeight: 132,
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  summaryIcon: {
    fontSize: 26,
    marginBottom: 12,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0F172A",
  },
  summaryLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
  },
  metricRow: {
    gap: 12,
    marginBottom: 22,
  },
  metricCard: {
    backgroundColor: "#0F172A",
    borderRadius: 24,
    padding: 16,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#94A3B8",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 25,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  metricText: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: "600",
    color: "#CBD5E1",
  },
  section: {
    marginBottom: 22,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#0F172A",
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  emptyText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },
  distributionRow: {
    marginBottom: 16,
  },
  distributionTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
  },
  distributionLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  distributionIcon: {
    fontSize: 18,
  },
  distributionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
  },
  distributionCount: {
    fontSize: 12,
    fontWeight: "900",
    color: "#64748B",
  },
  progressTrack: {
    height: 9,
    borderRadius: 999,
    backgroundColor: "#E2E8F0",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  activityCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginBottom: 22,
  },
  activityLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#1D4ED8",
    marginBottom: 5,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1E3A8A",
  },
  activityText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
    lineHeight: 20,
  },
  latestList: {
    gap: 10,
  },
  latestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  latestIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  latestIconText: {
    fontSize: 22,
  },
  latestInfo: {
    flex: 1,
  },
  latestTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
  },
  latestSubtitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  statusActive: {
    backgroundColor: "#FEE2E2",
  },
  statusResolved: {
    backgroundColor: "#DCFCE7",
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  statusActiveText: {
    color: "#B91C1C",
  },
  statusResolvedText: {
    color: "#166534",
  },
});