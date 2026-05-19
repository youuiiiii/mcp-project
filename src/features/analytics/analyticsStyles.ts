import { StyleSheet } from "react-native";

import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";

export const analyticsStyles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
  },
  screenContent: {
    gap: spacing["2xl"],
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    ...typography.hero,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
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
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  summaryCard: {
    width: "48%",
    minHeight: 132,
  },
  summaryValue: {
    marginTop: spacing.md,
    fontSize: 28,
    fontWeight: "900",
    color: colors.text,
  },
  summaryLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "800",
    color: colors.textMuted,
  },
  metricList: {
    gap: spacing.md,
  },
  metricCard: {
    backgroundColor: colors.dark,
    borderColor: colors.dark,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  metricLabel: {
    ...typography.label,
    color: colors.textSoft,
  },
  metricValue: {
    fontSize: 25,
    fontWeight: "900",
    color: colors.textInverse,
  },
  metricText: {
    marginTop: 5,
    ...typography.caption,
    color: colors.textSoft,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    marginBottom: 0,
  },
  distributionCard: {
    paddingBottom: 0,
  },
  distributionRow: {
    marginBottom: spacing.lg,
  },
  distributionRowLast: {
    marginBottom: 0,
  },
  distributionTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  distributionLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  distributionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  distributionCount: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.textMuted,
  },
  progressTrack: {
    height: 9,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: radius.full,
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityLabel: {
    ...typography.label,
    color: colors.infoDark,
    marginBottom: 5,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.text,
  },
  activityText: {
    marginTop: spacing.sm,
    ...typography.caption,
    color: colors.textMuted,
  },
  latestList: {
    gap: spacing.sm,
  },
  latestCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  latestInfo: {
    flex: 1,
  },
  latestTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  latestSubtitle: {
    marginTop: 4,
    ...typography.caption,
    color: colors.textMuted,
  },
  emptyText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  emptyStateCard: {
    alignItems: "center",
    paddingVertical: spacing["3xl"],
  },
  emptyStateTitle: {
    marginTop: spacing.md,
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
  },
  emptyStateText: {
    marginTop: spacing.sm,
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
  },
});
