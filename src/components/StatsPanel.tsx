import { StyleSheet, Text, View } from "react-native";
import { INCIDENT_TYPE_OPTIONS } from "../constants/incident";
import { IncidentReport, IncidentType } from "../types/incident";

type StatsPanelProps = {
  reports: IncidentReport[];
};

type StatCardProps = {
  label: string;
  value: number;
  icon: string;
  color: string;
  lightColor: string;
};

function StatCard({ label, value, icon, color, lightColor }: StatCardProps) {
  return (
    <View style={[styles.statCard, { backgroundColor: lightColor }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

export default function StatsPanel({ reports }: StatsPanelProps) {
  const activeReports = reports.filter((report) => report.status === "active");
  const resolvedReports = reports.filter((report) => report.status === "resolved");

  const countByType = (type: IncidentType) => {
    return reports.filter((report) => report.type === type).length;
  };

  const topIncidentTypes = [...INCIDENT_TYPE_OPTIONS]
    .map((option) => ({
      ...option,
      count: countByType(option.value),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return (
    <View style={styles.container}>
      <View style={styles.summaryRow}>
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
      </View>

      <Text style={styles.sectionTitle}>Top Incident Types</Text>

      <View style={styles.grid}>
        {topIncidentTypes.map((item) => (
          <StatCard
            key={item.value}
            label={item.label}
            value={item.count}
            icon={item.icon}
            color={item.color}
            lightColor={item.lightColor}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
  },
  summaryValue: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: "900",
    color: "#0F172A",
  },
  activeValue: {
    color: "#DC2626",
  },
  resolvedValue: {
    color: "#16A34A",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    width: "48%",
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statIcon: {
    fontSize: 26,
  },
  statValue: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "900",
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    lineHeight: 16,
  },
});