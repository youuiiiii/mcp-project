import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import AppCard from "../../components/ui/AppCard";
import AppScreen from "../../components/ui/AppScreen";
import IconBadge from "../../components/ui/IconBadge";
import LoadingState from "../../components/ui/LoadingState";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";
import type { IncidentReport } from "../../types/incident";
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
    sortMode,
    toggleSortMode,
  } = useIncidentsScreen();

  const handleOpenIncident = (incident: IncidentReport) => {
    router.push({
      pathname: "/(tabs)/incident/[id]",
      params: { id: incident.id },
    });
  };

  if (loading) {
    return (
      <AppScreen scroll={false} contentContainerStyle={styles.loadingContainer}>
        <LoadingState message="Loading incidents..." />
      </AppScreen>
    );
  }

  return (
    <AppScreen withPadding={false} contentContainerStyle={styles.screenContent}>
      <IncidentsHeader
        summary={summary}
        searchQuery={searchQuery}
        selectedFilter={selectedFilter}
        sortMode={sortMode}
        resultCount={filteredIncidents.length}
        onSearchChange={setSearchQuery}
        onFilterChange={setSelectedFilter}
        onToggleSort={toggleSortMode}
      />

      <View style={styles.body}>
        {errorMessage ? (
          <AppCard variant="muted" style={styles.errorCard}>
            <IconBadge variant="danger" size="md" rounded={false}>
              <Ionicons name="warning" size={22} color={colors.danger} />
            </IconBadge>

            <View style={styles.errorContent}>
              <Text style={styles.errorTitle}>Failed to load data</Text>
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            </View>
          </AppCard>
        ) : null}

        <IncidentList
          incidents={filteredIncidents}
          onOpenIncident={handleOpenIncident}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
  },
  screenContent: {
    paddingBottom: 108,
    backgroundColor: colors.background,
  },
  body: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: "800",
    color: colors.danger,
  },
  errorMessage: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
