import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import IncidentCard from "../../../components/IncidentCard";
import AppButton from "../../../components/ui/AppButton";
import AppCard from "../../../components/ui/AppCard";
import IconBadge from "../../../components/ui/IconBadge";
import LoadingState from "../../../components/ui/LoadingState";
import SectionHeader from "../../../components/ui/SectionHeader";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";
import type { IncidentReport } from "../../../types/incident";

type HomeLatestReportsSectionProps = {
  reports: IncidentReport[];
  loading: boolean;
  errorMessage: string | null;
  onOpenMap: () => void;
};

export default function HomeLatestReportsSection({
  reports,
  loading,
  errorMessage,
  onOpenMap,
}: HomeLatestReportsSectionProps) {
  if (loading) {
    return (
      <AppCard style={styles.loadingCard}>
        <LoadingState message="Loading latest reports..." />
      </AppCard>
    );
  }

  return (
    <View style={styles.wrapper}>
      {errorMessage ? (
        <AppCard variant="muted" style={styles.errorCard}>
          <IconBadge variant="danger" size="md" rounded={false}>
            <Ionicons name="warning" size={22} color={colors.danger} />
          </IconBadge>

          <View style={styles.errorContent}>
            <Text style={styles.errorTitle}>Could not load reports</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </View>
        </AppCard>
      ) : null}

      <SectionHeader
        title="Latest Reports"
        subtitle="Update komunitas terakhir"
        style={styles.sectionHeader}
        right={
          <AppButton
            title="Map"
            variant="ghost"
            size="sm"
            onPress={onOpenMap}
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
              name="document-text-outline"
              size={28}
              color={colors.textMuted}
            />
          </IconBadge>

          <Text style={styles.emptyTitle}>No reports yet</Text>

          <Text style={styles.emptyText}>
            Community reports will appear here after they are submitted.
          </Text>

          <AppButton
            title="Open Map"
            variant="secondary"
            size="md"
            onPress={onOpenMap}
            style={styles.emptyButton}
          />
        </AppCard>
      ) : (
        <View style={styles.latestList}>
          {reports.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onPress={onOpenMap}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.md,
  },
  loadingCard: {
    minHeight: 110,
    justifyContent: "center",
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.danger,
    marginBottom: spacing.xs,
  },
  errorMessage: {
    ...typography.caption,
    color: colors.textMuted,
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
