import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import IncidentThreadModal from "../../components/IncidentThreadModal";
import AppCard from "../../components/ui/AppCard";
import AppScreen from "../../components/ui/AppScreen";
import EmptyState from "../../components/ui/EmptyState";
import IconBadge from "../../components/ui/IconBadge";
import LoadingState from "../../components/ui/LoadingState";
import SectionHeader from "../../components/ui/SectionHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { getIncidentDisplayMeta } from "../../constants/incident";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";
import type { IncidentReport } from "../../types/incident";
import HomeHero from "./components/HomeHero";
import QuickActionsGrid from "./components/QuickActionsGrid";
import { useHomeScreen } from "./hooks/useHomeScreen";

export default function HomeScreen() {
  const home = useHomeScreen();

  const [selectedIncident, setSelectedIncident] =
    useState<IncidentReport | null>(null);

  const openIncidentThread = (incident: IncidentReport) => {
    setSelectedIncident(incident);
  };

  const closeIncidentThread = () => {
    setSelectedIncident(null);
  };

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <HomeHero
        displayName={home.displayName}
        initials={home.initials}
        activeCount={home.activeReports.length}
        highSeverityCount={home.highSeverityReports.length}
        onOpenProfile={home.openProfile}
        onOpenMap={home.openMap}
        onOpenReport={home.openReport}
      />

      <QuickActionsGrid
        onOpenMap={home.openMap}
        onOpenReport={home.openReport}
      />

      {home.errorMessage ? (
        <AppCard variant="muted" style={styles.errorCard}>
          <View style={styles.errorHeader}>
            <Ionicons name="warning" size={20} color={colors.danger} />
            <Text style={styles.errorTitle}>Sebagian data gagal dimuat</Text>
          </View>

          <Text style={styles.errorMessage}>{home.errorMessage}</Text>
        </AppCard>
      ) : null}

      <View style={styles.section}>
        <SectionHeader
          title="Latest Incidents"
          subtitle="Laporan terbaru dari komunitas. Tap kartu untuk melihat detail."
        />

        {home.loadingReports ? (
          <AppCard style={styles.loadingCard}>
            <LoadingState message="Memuat laporan terbaru..." />
          </AppCard>
        ) : null}

        {!home.loadingReports && home.latestReports.length === 0 ? (
          <EmptyState
            iconName="map-outline"
            title="Belum ada laporan"
            message="Laporan warga akan muncul di sini setelah ada incident yang dikirim."
          />
        ) : null}

        {!home.loadingReports && home.latestReports.length > 0 ? (
          <View style={styles.reportList}>
            {home.latestReports.map((report) => (
              <LatestReportCard
                key={report.id}
                report={report}
                onPress={() => openIncidentThread(report)}
              />
            ))}
          </View>
        ) : null}
      </View>

      <IncidentThreadModal
        visible={!!selectedIncident}
        incident={selectedIncident}
        onClose={closeIncidentThread}
        showActions={false}
      />
    </AppScreen>
  );
}

function LatestReportCard({
  report,
  onPress,
}: {
  report: IncidentReport;
  onPress: () => void;
}) {
  const meta = getIncidentDisplayMeta({
    category: report.category,
    subcategory: report.subcategory ?? report.type,
  });

  return (
    <AppCard onPress={onPress} style={styles.reportCard}>
      <IconBadge
        variant="neutral"
        size="lg"
        rounded={false}
        style={{
          backgroundColor: meta.lightColor,
        }}
      >
        <Ionicons name={meta.iconName} size={24} color={meta.color} />
      </IconBadge>

      <View style={styles.reportContent}>
        <View style={styles.reportHeader}>
          <Text style={styles.reportTitle} numberOfLines={1}>
            {report.title}
          </Text>

          <StatusBadge
            label={report.status}
            variant={report.status === "active" ? "active" : "resolved"}
            size="sm"
          />
        </View>

        <Text style={styles.reportMeta} numberOfLines={1}>
          {meta.label} • {getSeverityLabel(report.severity)}
        </Text>

        <Text style={styles.reportDescription} numberOfLines={2}>
          {report.description || "Tidak ada deskripsi."}
        </Text>
      </View>
    </AppCard>
  );
}

function getSeverityLabel(severity: IncidentReport["severity"]) {
  if (severity === "high") {
    return "High severity";
  }

  if (severity === "medium") {
    return "Medium severity";
  }

  return "Low severity";
}

const styles = StyleSheet.create({
  content: {
    gap: spacing["2xl"],
  },
  section: {
    gap: spacing.md,
  },
  errorCard: {
    gap: spacing.sm,
    backgroundColor: colors.dangerSoft,
    borderColor: "#FECACA",
  },
  errorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.primaryDark,
  },
  errorMessage: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  loadingCard: {
    minHeight: 120,
    justifyContent: "center",
  },
  reportList: {
    gap: spacing.md,
  },
  reportCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  reportContent: {
    flex: 1,
  },
  reportHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  reportTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
  },
  reportMeta: {
    marginTop: 4,
    ...typography.caption,
    color: colors.textMuted,
  },
  reportDescription: {
    marginTop: spacing.sm,
    ...typography.caption,
    color: "#475569",
  },
});