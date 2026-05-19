import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import IncidentThreadModal from "../../components/IncidentThreadModal";
import AppCard from "../../components/ui/AppCard";
import AppScreen from "../../components/ui/AppScreen";
import IconBadge from "../../components/ui/IconBadge";
import LoadingState from "../../components/ui/LoadingState";
import SectionHeader from "../../components/ui/SectionHeader";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";
import IncidentsHeader from "./components/IncidentsHeader";
import ReportList from "../reports/components/ReportList";
import { useReportsScreen } from "../reports/hooks/useReportsScreen";

export default function IncidentsScreen() {
  const {
    loading,
    errorMessage,

    filteredReports,
    summary,

    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,

    selectedIncident,

    isThreadModalVisible,

    handleOpenIncident,
    handleCloseThreadModal,
  } = useReportsScreen();

  if (loading) {
    return (
      <AppScreen scroll={false} contentContainerStyle={styles.loadingContainer}>
        <LoadingState message="Memuat incidents..." />
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
              <Text style={styles.errorTitle}>Gagal memuat incident</Text>
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            </View>
          </AppCard>
        ) : null}

        <View style={styles.section}>
          <SectionHeader
            title="Semua Incident"
            subtitle={`${filteredReports.length} incident ditampilkan`}
            style={styles.sectionHeader}
          />

          <ReportList
            reports={filteredReports}
            onOpenIncident={handleOpenIncident}
          />
        </View>
      </AppScreen>

      <IncidentThreadModal
        visible={isThreadModalVisible}
        incident={selectedIncident}
        onClose={handleCloseThreadModal}
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
