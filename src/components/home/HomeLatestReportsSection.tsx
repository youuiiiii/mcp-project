import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { subscribeToIncidents } from "../../services/incidentService";
import { colors } from "../../theme/colors";
import { radius, shadow, spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";
import { IncidentReport } from "../../types/incident";
import IncidentCard from "../IncidentCard";
import AppButton from "../ui/AppButton";
import AppCard from "../ui/AppCard";
import IconBadge from "../ui/IconBadge";
import LoadingState from "../ui/LoadingState";
import SectionHeader from "../ui/SectionHeader";
import StatusBadge from "../ui/StatusBadge";

const MAP_ROUTE = "/(tabs)/map" as Href;

export default function HomeLatestReportsSection() {
  const router = useRouter();

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
        console.error("Home latest reports error:", error);
        setErrorMessage(error.message || "Gagal memuat data laporan.");
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const latestReports = useMemo(() => {
    return reports.slice(0, 3);
  }, [reports]);

  const activeReports = useMemo(() => {
    return reports.filter((report) => report.status === "active");
  }, [reports]);

  const highSeverityReports = useMemo(() => {
    return reports.filter((report) => report.severity === "high");
  }, [reports]);

  const handleOpenMap = () => {
    router.push(MAP_ROUTE);
  };

  if (loading) {
    return (
      <AppCard style={styles.loadingCard}>
        <LoadingState message="Memuat laporan terbaru..." />
      </AppCard>
    );
  }

  return (
    <View style={styles.wrapper}>
      <AppCard style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View style={styles.statusTitleGroup}>
            <StatusBadge
              label="Area Status"
              variant={activeReports.length > 0 ? "active" : "success"}
              size="sm"
              style={styles.areaBadge}
            />

            <Text style={styles.statusTitle}>
              {activeReports.length > 0
                ? "Active Monitoring"
                : "No Active Incident"}
            </Text>
          </View>

          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        <Text style={styles.statusDescription}>
          Ada {activeReports.length} laporan aktif dari total {reports.length}{" "}
          laporan komunitas. {highSeverityReports.length} laporan berstatus high
          severity.
        </Text>

        <AppButton
          title="Open Crisis Map"
          variant="secondary"
          size="md"
          fullWidth
          onPress={handleOpenMap}
          leftIcon={<Ionicons name="map" size={18} color={colors.text} />}
        />
      </AppCard>

      {errorMessage ? (
        <AppCard variant="muted" style={styles.errorCard}>
          <IconBadge variant="danger" size="md" rounded={false}>
            <Ionicons name="warning" size={22} color={colors.danger} />
          </IconBadge>

          <View style={styles.errorContent}>
            <Text style={styles.errorTitle}>Gagal memuat laporan</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
        </AppCard>
      ) : null}

      <View style={styles.section}>
        <SectionHeader
          title="Latest Community Reports"
          subtitle="3 laporan terbaru"
          style={styles.sectionHeader}
          right={
            <AppButton
              title="View Map"
              variant="ghost"
              size="sm"
              onPress={handleOpenMap}
              rightIcon={
                <Ionicons
                  name="chevron-forward"
                  size={15}
                  color={colors.danger}
                />
              }
              textStyle={styles.viewMapText}
            />
          }
        />

        {reports.length === 0 ? (
          <AppCard style={styles.emptyCard}>
            <IconBadge variant="neutral" size="lg" rounded={false}>
              <Ionicons
                name="map-outline"
                size={28}
                color={colors.textMuted}
              />
            </IconBadge>

            <Text style={styles.emptyTitle}>Belum ada laporan</Text>

            <Text style={styles.emptyText}>
              Laporan warga akan muncul di sini setelah dikirim.
            </Text>

            <AppButton
              title="Open Map"
              variant="primary"
              size="md"
              onPress={handleOpenMap}
              style={styles.emptyButton}
            />
          </AppCard>
        ) : (
          <View style={styles.latestList}>
            {latestReports.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onPress={handleOpenMap}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing["2xl"],
  },
  loadingCard: {
    minHeight: 110,
    justifyContent: "center",
  },
  statusCard: {
    backgroundColor: colors.dark,
    borderColor: colors.dark,
    borderRadius: radius["3xl"],
    ...shadow.floating,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statusTitleGroup: {
    flex: 1,
  },
  areaBadge: {
    marginBottom: spacing.sm,
    backgroundColor: colors.darkSoft,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.textInverse,
  },
  statusDescription: {
    ...typography.body,
    color: "#CBD5E1",
    marginBottom: spacing.lg,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.successSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  liveText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#166534",
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
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    marginBottom: 0,
  },
  viewMapText: {
    color: colors.danger,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: spacing["2xl"],
  },
  emptyTitle: {
    marginTop: spacing.md,
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
  },
  emptyText: {
    marginTop: spacing.sm,
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  emptyButton: {
    paddingHorizontal: spacing.xl,
  },
  latestList: {
    gap: spacing.sm,
  },
});