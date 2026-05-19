import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import IncidentThreadModal from "../../components/IncidentThreadModal";
import ResolveIncidentModal from "../../components/ResolveIncidentModal";
import VerifyIncidentModal from "../../components/VerifyIncidentModal";
import AppCard from "../../components/ui/AppCard";
import AppScreen from "../../components/ui/AppScreen";
import IconBadge from "../../components/ui/IconBadge";
import LoadingState from "../../components/ui/LoadingState";
import SectionHeader from "../../components/ui/SectionHeader";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";
import IncidentsHeader from "./components/IncidentsHeader";
import IncidentList from "./components/IncidentList";
import { useIncidentsScreen } from "./hooks/useIncidentsScreen";

export default function IncidentsScreen() {
  const {
    loading,
    errorMessage,

    filteredIncidents,
    summary,

    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,

    selectedIncident,
    selectedVerifyIncident,
    selectedResolveIncident,

    isThreadModalVisible,
    isVerifyModalVisible,
    isResolveModalVisible,

    handleOpenIncident,
    handleCloseThreadModal,
    handleOpenVerifyModal,
    handleCloseVerifyModal,
    handleOpenResolveModal,
    handleCloseResolveModal,
  } = useIncidentsScreen();

  if (loading) {
    return (
      <AppScreen scroll={false} contentContainerStyle={styles.loadingContainer}>
        <LoadingState message="Loading incidents..." />
      </AppScreen>
    );
  }

  return (
    <>
      <AppScreen contentContainerStyle={styles.screenContent}>
        <IncidentsHeader
          summary={summary}
          searchQuery={searchQuery}
          selectedFilter={selectedFilter}
          onSearchChange={setSearchQuery}
          onFilterChange={setSelectedFilter}
        />

        {errorMessage ? (
          <AppCard variant="muted" style={styles.errorCard}>
            <IconBadge variant="danger" size="md" rounded={false}>
              <Ionicons name="warning" size={22} color={colors.danger} />
            </IconBadge>

            <View style={styles.errorContent}>
              <Text style={styles.errorTitle}>Could not load incidents</Text>
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            </View>
          </AppCard>
        ) : null}

        <View style={styles.section}>
          <SectionHeader
            title="All Incidents"
            subtitle={`${filteredIncidents.length} incidents shown`}
            style={styles.sectionHeader}
          />

          <IncidentList
            incidents={filteredIncidents}
            onOpenIncident={handleOpenIncident}
          />
        </View>
      </AppScreen>

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
        onClose={handleCloseVerifyModal}
      />

      <ResolveIncidentModal
        visible={isResolveModalVisible}
        incident={selectedResolveIncident}
        onClose={handleCloseResolveModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
  },
  screenContent: {
    gap: spacing["2xl"],
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.danger,
    marginBottom: 4,
  },
  errorMessage: {
    ...typography.caption,
    color: colors.textMuted,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    marginBottom: 0,
  },
});