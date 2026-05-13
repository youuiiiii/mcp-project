import { useMemo, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useEffect } from "react";
import IncidentCard from "../../src/components/IncidentCard";
import IncidentThreadModal from "../../src/components/IncidentThreadModal";
import ResolveIncidentModal from "../../src/components/ResolveIncidentModal";
import VerifyIncidentModal from "../../src/components/VerifyIncidentModal";
import EmptyState from "../../src/components/ui/EmptyState";
import LoadingState from "../../src/components/ui/LoadingState";
import { getIncidentMeta } from "../../src/constants/incident";
import { subscribeToIncidents } from "../../src/services/incidentService";
import { IncidentReport } from "../../src/types/incident";

type ReportFilter = "all" | "active" | "resolved" | "high";

const FILTERS: {
  value: ReportFilter;
  label: string;
}[] = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "resolved",
    label: "Resolved",
  },
  {
    value: "high",
    label: "High",
  },
];

export default function ReportsScreen() {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<ReportFilter>("all");

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

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToIncidents(
      (items) => {
        setReports(items);
        setErrorMessage(null);
        setLoading(false);
        setRefreshing(false);
      },
      (error) => {
        console.error("Reports screen error:", error);
        setErrorMessage(error.message || "Gagal memuat laporan.");
        setLoading(false);
        setRefreshing(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const selectedIncident = useMemo(() => {
    if (!selectedIncidentId) {
      return null;
    }

    return reports.find((item) => item.id === selectedIncidentId) ?? null;
  }, [reports, selectedIncidentId]);

  const filteredReports = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return reports.filter((report) => {
      if (selectedFilter === "active" && report.status !== "active") {
        return false;
      }

      if (selectedFilter === "resolved" && report.status !== "resolved") {
        return false;
      }

      if (selectedFilter === "high" && report.severity !== "high") {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const meta = getIncidentMeta(report.subcategory ?? report.type);

      const searchableText = [
        report.title,
        report.description,
        report.status,
        report.severity,
        report.verificationStatus,
        meta.label,
        report.reportedBy,
        report.reporterEmail,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [reports, searchQuery, selectedFilter]);

  const activeCount = useMemo(() => {
    return reports.filter((item) => item.status === "active").length;
  }, [reports]);

  const resolvedCount = useMemo(() => {
    return reports.filter((item) => item.status === "resolved").length;
  }, [reports]);

  const highCount = useMemo(() => {
    return reports.filter((item) => item.severity === "high").length;
  }, [reports]);

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 700);
  };

  const handleOpenIncident = (incident: IncidentReport) => {
    setSelectedIncidentId(incident.id);
    setIsThreadModalVisible(true);
  };

  const handleCloseThreadModal = () => {
    setIsThreadModalVisible(false);
    setSelectedIncidentId(null);
  };

  const handleOpenVerifyModal = (incident: IncidentReport) => {
    setSelectedVerifyIncident(incident);
    setIsVerifyModalVisible(true);
  };

  const handleCloseVerifyModal = () => {
    setIsVerifyModalVisible(false);
    setSelectedVerifyIncident(null);
  };

  const handleOpenResolveModal = (incident: IncidentReport) => {
    setSelectedResolveIncident(incident);
    setIsResolveModalVisible(true);
  };

  const handleCloseResolveModal = () => {
    setIsResolveModalVisible(false);
    setSelectedResolveIncident(null);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingState message="Memuat laporan..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>COMMUNITY INCIDENTS</Text>
          </View>

          <Text style={styles.title}>Reports</Text>

          <Text style={styles.subtitle}>
            Pantau semua laporan warga, buka thread, kirim verifikasi, dan
            tandai incident selesai jika kondisi sudah aman.
          </Text>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{reports.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{activeCount}</Text>
            <Text style={styles.summaryLabel}>Active</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{resolvedCount}</Text>
            <Text style={styles.summaryLabel}>Resolved</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{highCount}</Text>
            <Text style={styles.summaryLabel}>High</Text>
          </View>
        </View>

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Gagal memuat data</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.searchCard}>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search reports..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((filter) => {
            const active = selectedFilter === filter.value;

            return (
              <Pressable
                key={filter.value}
                onPress={() => setSelectedFilter(filter.value)}
                style={({ pressed }) => [
                  styles.filterChip,
                  active && styles.filterChipActive,
                  pressed && styles.filterChipPressed,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    active && styles.filterChipTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Incident List</Text>
          <Text style={styles.sectionSubtitle}>
            {filteredReports.length} laporan ditampilkan
          </Text>
        </View>

        {filteredReports.length === 0 ? (
          <EmptyState
            icon="📋"
            title="Tidak ada laporan"
            message="Belum ada laporan yang cocok dengan filter atau pencarian."
          />
        ) : (
          <View style={styles.list}>
            {filteredReports.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onPress={handleOpenIncident}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <IncidentThreadModal
        visible={isThreadModalVisible}
        incident={selectedIncident}
        onClose={handleCloseThreadModal}
        onOpenVerify={handleOpenVerifyModal}
        onOpenResolve={handleOpenResolveModal}
      />

      <VerifyIncidentModal
        visible={isVerifyModalVisible}
        incident={selectedVerifyIncident}
        userLocation={null}
        onClose={handleCloseVerifyModal}
        onSuccess={handleCloseVerifyModal}
      />

      <ResolveIncidentModal
        visible={isResolveModalVisible}
        incident={selectedResolveIncident}
        onClose={handleCloseResolveModal}
        onSuccess={handleCloseResolveModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 58,
    paddingBottom: 36,
  },
  header: {
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
  summaryGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
  },
  summaryLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 16,
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
  searchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  searchInput: {
    paddingVertical: 13,
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  filterRow: {
    gap: 10,
    paddingBottom: 18,
  },
  filterChip: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterChipActive: {
    backgroundColor: "#0F172A",
    borderColor: "#0F172A",
  },
  filterChipPressed: {
    opacity: 0.82,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#64748B",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },
  list: {
    gap: 12,
  },
});