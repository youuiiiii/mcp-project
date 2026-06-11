import { StyleSheet, View } from "react-native";

import IncidentCard from "../../../components/IncidentCard";
import { spacing } from "../../../theme/layout";
import type { IncidentReport } from "../../../types/incident";
import IncidentsEmptyState from "./IncidentsEmptyState";

type IncidentListProps = {
  incidents: IncidentReport[];
  onOpenIncident: (incident: IncidentReport) => void;
};

export default function IncidentList({
  incidents,
  onOpenIncident,
}: IncidentListProps) {
  if (incidents.length === 0) {
    return <IncidentsEmptyState />;
  }

  return (
    <View style={styles.list}>
      {incidents.map((incident) => (
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
    gap: spacing.sm,
  },
});
