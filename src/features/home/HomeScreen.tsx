import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import IncidentThreadModal from "../../components/IncidentThreadModal";
import ResolveIncidentModal from "../../components/ResolveIncidentModal";
import VerifyIncidentModal from "../../components/VerifyIncidentModal";
import AppCard from "../../components/ui/AppCard";
import AppScreen from "../../components/ui/AppScreen";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";
import SectionHeader from "../../components/ui/SectionHeader";
import IncidentCard from "../../components/IncidentCard";

import { colors } from "../../theme/colors";
import { spacing } from "../../theme/layout";
import type { IncidentReport } from "../../types/incident";
import HomeHero from "./components/HomeHero";
import { useHomeScreen } from "./hooks/useHomeScreen";
import SosInfoModal from "../sos/SosInfoModal";

export default function HomeScreen() {
  const home = useHomeScreen();

  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [selectedVerifyIncident, setSelectedVerifyIncident] = useState<IncidentReport | null>(null);
  const [selectedResolveIncident, setSelectedResolveIncident] = useState<IncidentReport | null>(null);
  const [sosVisible, setSosVisible] = useState(false);

  const openIncidentThread = (incident: IncidentReport) => {
    setSelectedIncident(incident);
  };

  const closeIncidentThread = () => {
    setSelectedIncident(null);
  };

  const openVerifyModal = (incident: IncidentReport) => {
    setSelectedVerifyIncident(incident);
  };

  const closeVerifyModal = () => {
    setSelectedVerifyIncident(null);
  };

  const openResolveModal = (incident: IncidentReport) => {
    setSelectedResolveIncident(incident);
  };

  const closeResolveModal = () => {
    setSelectedResolveIncident(null);
  };

  const activeReports = home.reports
    .filter((r) => r.status === "active")
    .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));

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
        onOpenSos={() => setSosVisible(true)}
      />

      {home.errorMessage ? (
        <AppCard variant="muted" style={styles.errorCard}>
          <View style={styles.errorHeader}>
            <Ionicons name="warning" size={18} color={colors.danger} />
            <Text style={styles.errorTitle}>Data incomplete</Text>
          </View>
          <Text style={styles.errorMessage}>{home.errorMessage}</Text>
        </AppCard>
      ) : null}

      <View style={styles.section}>
        <SectionHeader
          title="Laporan Sekitar Anda"
          subtitle="Aktivitas laporan dari komunitas terbaru."
        />

        {home.loadingReports ? (
          <AppCard style={styles.loadingCard}>
            <LoadingState message="Memuat laporan..." />
          </AppCard>
        ) : null}

        {!home.loadingReports && activeReports.length === 0 ? (
          <EmptyState
            iconName="checkmark-circle-outline"
            title="Kondisi Aman"
            message="Belum ada laporan bencana di sekitar Anda."
          />
        ) : null}

        {!home.loadingReports && activeReports.length > 0 ? (
          <View style={styles.reportList}>
            {activeReports.map((report) => (
              <IncidentCard
                key={report.id}
                incident={report}
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
        onOpenVerify={openVerifyModal}
        onOpenResolve={openResolveModal}
      />

      <VerifyIncidentModal
        visible={!!selectedVerifyIncident}
        incident={selectedVerifyIncident}
        onClose={closeVerifyModal}
      />

      <ResolveIncidentModal
        visible={!!selectedResolveIncident}
        incident={selectedResolveIncident}
        onClose={closeResolveModal}
      />

      <SosInfoModal
        visible={sosVisible}
        userLocation={null}
        onClose={() => setSosVisible(false)}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing["2xl"], // padding for FAB
  },
  section: {
    gap: spacing.md,
  },
  errorCard: {
    gap: spacing.sm,
    backgroundColor: colors.dangerSoft,
    borderColor: colors.dangerSoft,
    borderWidth: 1,
  },
  errorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.dangerDark,
  },
  errorMessage: {
    fontSize: 12,
    color: colors.dangerDark,
  },
  loadingCard: {
    minHeight: 100,
    justifyContent: "center",
  },
  reportList: {
    gap: spacing.md,
  },
});
