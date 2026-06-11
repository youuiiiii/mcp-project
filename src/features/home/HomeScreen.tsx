import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import HomeEarthquakeSection from "./components/HomeEarthquakeSection";
import { useBmkgEarthquakes } from "./hooks/useBmkgEarthquakes";
import EarthquakeAlertModal from "../../components/EarthquakeAlertModal";
import IncidentThreadModal from "../../components/IncidentThreadModal";
import ResolveIncidentModal from "../../components/ResolveIncidentModal";
import VerifyIncidentModal from "../../components/VerifyIncidentModal";
import AppCard from "../../components/ui/AppCard";
import AppScreen from "../../components/ui/AppScreen";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";
import SectionHeader from "../../components/ui/SectionHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { getIncidentDisplayMeta } from "../../constants/incident";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";
import type { IncidentReport } from "../../types/incident";
import HomeHero from "./components/HomeHero";
import { useHomeScreen } from "./hooks/useHomeScreen";
import { useI18n } from "../../i18n";
import SosInfoModal from "../sos/SosInfoModal";

function getReportTrustStatus(report: IncidentReport) {
  if (report.status === "resolved" || report.resolvedAt) {
    return { labelKey: "incident.trust.resolved", variant: "resolved" as const };
  }
  if (report.moderationStatus === "visible" && report.moderatedBy) {
    return { labelKey: "incident.trust.moderatorConfirmed", variant: "verified" as const };
  }
  const verifications = report.verificationCount ?? 0;
  const disputes = report.disputeCount ?? 0;
  if (verifications >= 2 && verifications > disputes) {
    return { labelKey: "incident.trust.communityVerified", variant: "verified" as const };
  }
  if (verifications > disputes) {
    return { labelKey: "incident.trust.gainingTrust", variant: "info" as const };
  }
  return { labelKey: "incident.trust.unverified", variant: "neutral" as const };
}


const ALERT_MAGNITUDE_THRESHOLD = 5.0;

export default function HomeScreen() {
  const home = useHomeScreen();
  const earthquake = useBmkgEarthquakes();

  const [selectedIncident, setSelectedIncident] =
    useState<IncidentReport | null>(null);
  const [selectedVerifyIncident, setSelectedVerifyIncident] =
    useState<IncidentReport | null>(null);
  const [selectedResolveIncident, setSelectedResolveIncident] =
    useState<IncidentReport | null>(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [sosVisible, setSosVisible] = useState(false);

  useEffect(() => {
    const magnitude = Number.parseFloat(
      earthquake.mainEarthquake?.Magnitude ?? "0"
    );

    if (magnitude >= ALERT_MAGNITUDE_THRESHOLD) {
      setAlertVisible(true);
    }
  }, [earthquake.mainEarthquake]);

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

  const normalReports = home.reports
    .filter((r) => r.status === "active" && (r.urgencyLevel ?? r.severity) !== "high")
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
        onOpenAnalytics={home.openAnalytics}
        onOpenEarthquake={home.openEarthquake}
        onOpenEducation={home.openEducation}
      />

      <HomeEarthquakeSection
        mainEarthquake={earthquake.mainEarthquake}
        latestEarthquakes={earthquake.latestEarthquakes}
        loading={earthquake.loadingEarthquakes}
        errorMessage={earthquake.earthquakeErrorMessage}
        onRefresh={earthquake.refreshEarthquakes}
        onOpenEarthquake={home.openEarthquake}
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
        {home.highSeverityReports.length > 0 && (
          <View style={styles.criticalSection}>
            <SectionHeader
              title="Kondisi Darurat Sekitar"
              subtitle="Laporan dengan prioritas tinggi."
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.criticalCarousel}
            >
              {home.highSeverityReports.map((report) => (
                <View key={report.id} style={styles.criticalCardWrapper}>
                  <LatestReportCard
                    report={report}
                    onPress={() => openIncidentThread(report)}
                    isCritical
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <SectionHeader
          title="Linimasa Laporan"
          subtitle="Aktivitas laporan komunitas terbaru."
        />

        {home.loadingReports ? (
          <AppCard style={styles.loadingCard}>
            <LoadingState message="Memuat laporan..." />
          </AppCard>
        ) : null}

        {!home.loadingReports && home.reports.length === 0 ? (
          <EmptyState
            iconName="map-outline"
            title="Belum ada laporan"
            message="Laporan dari komunitas akan muncul di sini."
          />
        ) : null}

        {!home.loadingReports && normalReports.length > 0 ? (
          <View style={styles.reportList}>
            {normalReports.map((report) => (
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

      <EarthquakeAlertModal
        visible={alertVisible}
        earthquake={earthquake.mainEarthquake}
        onClose={() => setAlertVisible(false)}
      />

      <SosInfoModal
        visible={sosVisible}
        userLocation={null}
        onClose={() => setSosVisible(false)}
      />
    </AppScreen>
  );
}

function LatestReportCard({
  report,
  onPress,
  isCritical = false,
}: {
  report: IncidentReport;
  onPress: () => void;
  isCritical?: boolean;
}) {
  const { t } = useI18n();
  const meta = getIncidentDisplayMeta({
    category: report.category,
    subcategory: report.subcategory ?? report.type,
  });
  const trust = getReportTrustStatus(report);

  return (
    <AppCard onPress={onPress} style={[styles.reportCard, isCritical && styles.criticalReportCard]}>
      <View style={[styles.reportIconCircle, { backgroundColor: meta.lightColor }]}>
        <Ionicons name={meta.iconName} size={20} color={meta.color} />
      </View>

      <View style={styles.reportContent}>
        <View style={styles.reportHeader}>
          <Text style={styles.reportTitle} numberOfLines={1}>
            {report.title}
          </Text>
          <StatusBadge
            label={t(trust.labelKey as any)}
            variant={trust.variant}
            size="sm"
          />
        </View>

        <Text style={styles.reportMeta} numberOfLines={1}>
          {meta.label} - {getUrgencyLabel(report)}
        </Text>

        {/* Only show description if it's user-written, not an auto-generated technical string */}
        {report.description && !report.description.includes("reported near the selected map pin") && !report.description.includes("No additional impact") ? (
          <Text style={styles.reportDescription} numberOfLines={2}>
            {report.description}
          </Text>
        ) : null}
      </View>
    </AppCard>
  );
}

function getUrgencyLabel(incident: IncidentReport) {
  const urgency = incident.urgencyLevel ?? incident.severity;

  if (urgency === "high") {
    return "Urgensi Tinggi";
  }

  if (urgency === "medium") {
    return "Urgensi Sedang";
  }

  return "Urgensi Rendah";
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
    ...typography.caption,
    color: colors.dangerDark,
  },
  loadingCard: {
    minHeight: 100,
    justifyContent: "center",
  },
  criticalSection: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  criticalCarousel: {
    paddingRight: spacing.lg,
    gap: spacing.md,
  },
  criticalCardWrapper: {
    width: 300,
  },
  criticalReportCard: {
    borderColor: colors.danger,
    borderWidth: 1,
    backgroundColor: colors.dangerSoft,
  },
  reportList: {
    gap: spacing.md,
  },
  reportCard: {
    flexDirection: "row",
    alignItems: "center", // Align items vertically center matching Wecare feed
    gap: spacing.md,
  },
  reportIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
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
    fontWeight: "700", // Terra headline weight
    color: colors.text,
  },
  reportMeta: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "700", // Terra label/metadata weight
    color: colors.textMuted,
  },
  reportDescription: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500", // Terra body weight
    color: colors.textMuted,
  },
});
