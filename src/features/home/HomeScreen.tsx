import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import HomeEarthquakeSection from "./components/HomeEarthquakeSection";
import { useBmkgEarthquakes } from "./hooks/useBmkgEarthquakes";
import EarthquakeAlertModal from "../../components/EarthquakeAlertModal";
import IncidentThreadModal from "../../components/IncidentThreadModal";
import ResolveIncidentModal from "../../components/ResolveIncidentModal";
import VerifyIncidentModal from "../../components/VerifyIncidentModal";
import AppCard from "../../components/ui/AppCard";
import AppScreen from "../../components/ui/AppScreen";
import EmptyState from "../../components/ui/EmptyState";
import IconBadge from "../../components/ui/IconBadge";
import LoadingState from "../../components/ui/LoadingState";
import SectionHeader from "../../components/ui/SectionHeader";
import StatusBadge, { type StatusBadgeVariant } from "../../components/ui/StatusBadge";
import { getIncidentDisplayMeta } from "../../constants/incident";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";
import type { IncidentReport } from "../../types/incident";
import { getIncidentConfidenceMeta } from "../../utils/incidentConfidence";
import HomeHero from "./components/HomeHero";
import { useHomeScreen } from "./hooks/useHomeScreen";

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
        <SectionHeader
          title="Latest Incidents"
          subtitle="Latest community reports."
        />

        {home.loadingReports ? (
          <AppCard style={styles.loadingCard}>
            <LoadingState message="Loading latest reports..." />
          </AppCard>
        ) : null}

        {!home.loadingReports && home.latestReports.length === 0 ? (
          <EmptyState
            iconName="map-outline"
            title="No reports yet"
            message="Community reports will appear after an incident is submitted."
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
  const confidence = getIncidentConfidenceMeta(report);

  return (
    <AppCard onPress={onPress} style={styles.reportCard}>
      <IconBadge
        variant="neutral"
        size="md"
        rounded={false}
        style={{ backgroundColor: meta.lightColor }}
      >
        <Ionicons name={meta.iconName} size={21} color={meta.color} />
      </IconBadge>

      <View style={styles.reportContent}>
        <View style={styles.reportHeader}>
          <Text style={styles.reportTitle} numberOfLines={1}>
            {report.title}
          </Text>
          <StatusBadge
            label={`Confidence ${confidence.score}`}
            variant={getConfidenceVariant(confidence.level)}
            size="sm"
          />
        </View>

        <Text style={styles.reportMeta} numberOfLines={1}>
          {meta.label} - {getUrgencyLabel(report)}
        </Text>

        <Text style={styles.reportDescription} numberOfLines={2}>
          {report.description || "No description provided."}
        </Text>
      </View>
    </AppCard>
  );
}

function getUrgencyLabel(incident: IncidentReport) {
  const urgency = incident.urgencyLevel ?? incident.severity;

  if (typeof incident.urgencyScore === "number") {
    return `Urgency ${incident.urgencyScore}`;
  }

  if (urgency === "high") {
    return "High urgency";
  }

  if (urgency === "medium") {
    return "Medium urgency";
  }

  return "Low urgency";
}

function getConfidenceVariant(
  level: ReturnType<typeof getIncidentConfidenceMeta>["level"]
): StatusBadgeVariant {
  if (level === "confirmed" || level === "resolved") {
    return "success";
  }

  if (level === "questioned") {
    return "danger";
  }

  if (level === "credible") {
    return "info";
  }

  return "warning";
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
    fontWeight: "800",
    color: colors.primaryDark,
  },
  errorMessage: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  loadingCard: {
    minHeight: 100,
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
    fontWeight: "800",
    color: colors.text,
  },
  reportMeta: {
    marginTop: 4,
    ...typography.caption,
    color: colors.textMuted,
  },
  reportDescription: {
    marginTop: spacing.sm,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
    color: "#475569",
  },
});
