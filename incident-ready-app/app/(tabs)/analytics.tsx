import { useEffect, useMemo, useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import EmptyState from "../../src/components/ui/EmptyState";
import LoadingState from "../../src/components/ui/LoadingState";
import {
  getIncidentMeta,
  INCIDENT_TYPE_OPTIONS,
} from "../../src/constants/incident";
import { subscribeToIncidents } from "../../src/services/incidentService";
import { analyticsStyles as styles } from "../../src/styles/analyticsStyles";
import {
  IncidentReport,
  IncidentSeverity,
  IncidentType,
} from "../../src/types/incident";

const screenWidth = Dimensions.get("window").width;

type SeverityStat = {
  value: IncidentSeverity;
  label: string;
  count: number;
  color: string;
};

type TypeStat = {
  type: IncidentType;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  lightColor: string;
  count: number;
};

const chartConfig = {
  backgroundGradientFrom: "#FFFFFF",
  backgroundGradientTo: "#FFFFFF",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(15, 118, 110, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(71, 85, 105, ${opacity})`,
  propsForBackgroundLines: {
    strokeDasharray: "",
    stroke: "#E2E8F0",
  },
  propsForLabels: {
    fontSize: 10,
    fontWeight: "700",
  },
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
        console.error("Analytics realtime error:", error);
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

  const typeStats = useMemo<TypeStat[]>(() => {
    return INCIDENT_TYPE_OPTIONS.map((item) => {
      const meta = getIncidentMeta(item.value);

      return {
        type: item.value,
        label: meta.label,
        shortLabel: meta.shortLabel,
        icon: meta.icon,
        color: meta.color,
        lightColor: meta.lightColor,
        count: reports.filter((report) => report.type === item.value).length,
      };
    }).sort((a, b) => b.count - a.count);
  }, [reports]);

  const chartTypeStats = useMemo<TypeStat[]>(() => {
    return typeStats.filter((item) => item.count > 0).slice(0, 6);
  }, [typeStats]);

  const chartData = useMemo(() => {
    const emptyStat: TypeStat = {
      type: "public_disturbance",
      label: "Belum Ada",
      shortLabel: "Empty",
      icon: "📍",
      color: "#94A3B8",
      lightColor: "#F1F5F9",
      count: 0,
    };

    const safeStats = chartTypeStats.length > 0 ? chartTypeStats : [emptyStat];

    return {
      labels: safeStats.map((item) => item.shortLabel),
      datasets: [
        {
          data: safeStats.map((item) => item.count),
        },
      ],
    };
  }, [chartTypeStats]);

  const severityStats = useMemo<SeverityStat[]>(() => {
    const getCount = (severity: IncidentSeverity): number => {
      return reports.filter((report) => report.severity === severity).length;
    };

    const stats: SeverityStat[] = [
      {
        value: "low",
        label: "Low",
        count: getCount("low"),
        color: "#16A34A",
      },
      {
        value: "medium",
        label: "Medium",
        count: getCount("medium"),
        color: "#F59E0B",
      },
      {
        value: "high",
        label: "High",
        count: getCount("high"),
        color: "#DC2626",
      },
    ];

    return stats;
  }, [reports]);

  const getSeverityPercentage = (count: number): number => {
    if (reports.length === 0) {
      return 0;
    }

    return Math.round((count / reports.length) * 100);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingState message="Memuat analytics realtime..." />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>REALTIME ANALYTICS</Text>
        </View>

        <Text style={styles.title}>Incident Analytics</Text>

        <Text style={styles.subtitle}>
          Pantau ringkasan kejadian berdasarkan jumlah laporan, status, kategori,
          dan tingkat urgensi.
        </Text>
      </View>

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Gagal memuat data</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      ) : null}

      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Reports</Text>
          <Text style={styles.summaryValue}>{reports.length}</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Active</Text>
          <Text style={[styles.summaryValue, styles.activeValue]}>
            {activeReports.length}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Resolved</Text>
          <Text style={[styles.summaryValue, styles.resolvedValue]}>
            {resolvedReports.length}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>High Severity</Text>
          <Text style={[styles.summaryValue, styles.highValue]}>
            {highSeverityReports.length}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Reports by Type</Text>
          <Text style={styles.sectionSubtitle}>
            Top kategori berdasarkan jumlah laporan masuk.
          </Text>
        </View>

        {reports.length === 0 ? (
          <EmptyState
            icon="📊"
            title="Belum ada data analytics"
            message="Data analytics akan muncul setelah laporan pertama dikirim."
          />
        ) : (
          <View style={styles.chartCard}>
            <BarChart
              data={chartData}
              width={screenWidth - 56}
              height={240}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              fromZero
              showValuesOnTopOfBars
              style={styles.chart}
            />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Incident Category Detail</Text>
          <Text style={styles.sectionSubtitle}>
            Distribusi semua kategori kejadian yang tersedia.
          </Text>
        </View>

        {reports.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🗂️</Text>
            <Text style={styles.emptyTitle}>Belum ada kategori aktif</Text>
            <Text style={styles.emptyText}>
              Kategori akan terisi otomatis dari laporan warga secara realtime.
            </Text>
          </View>
        ) : (
          <View style={styles.listCard}>
            {typeStats.map((item, index) => (
              <View
                key={item.type}
                style={[
                  styles.row,
                  index === typeStats.length - 1 && styles.rowLast,
                ]}
              >
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: item.lightColor,
                    },
                  ]}
                >
                  <Text style={styles.icon}>{item.icon}</Text>
                </View>

                <View style={styles.rowContent}>
                  <Text style={styles.rowTitle}>{item.label}</Text>
                  <Text style={styles.rowSubtitle}>{item.shortLabel}</Text>
                </View>

                <Text style={[styles.rowValue, { color: item.color }]}>
                  {item.count}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Severity Distribution</Text>
          <Text style={styles.sectionSubtitle}>
            Perbandingan tingkat urgensi laporan yang masuk.
          </Text>
        </View>

        <View style={styles.severityContainer}>
          {severityStats.map((item) => {
            const percentage = getSeverityPercentage(item.count);

            return (
              <View key={item.value} style={styles.severityCard}>
                <View style={styles.severityHeader}>
                  <Text style={styles.severityLabel}>{item.label}</Text>
                  <Text style={[styles.severityValue, { color: item.color }]}>
                    {item.count} laporan • {percentage}%
                  </Text>
                </View>

                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${percentage}%` as `${number}%`,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}