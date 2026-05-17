import { StyleSheet, View } from "react-native";

import IncidentCard from "../../../components/IncidentCard";
import { spacing } from "../../../theme/layout";
import type { IncidentReport } from "../../../types/incident";
import ReportsEmptyState from "./ReportsEmptyState";

type ReportListProps = {
  reports: IncidentReport[];
  onOpenIncident: (incident: IncidentReport) => void;
};

export default function ReportList({
  reports,
  onOpenIncident,
}: ReportListProps) {
  if (reports.length === 0) {
    return <ReportsEmptyState />;
  }

  return (
    <View style={styles.list}>
      {reports.map((incident) => (
        <IncidentCard
          key={incident.id}
          incident={incident}
          onPress={onOpenIncident}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
});