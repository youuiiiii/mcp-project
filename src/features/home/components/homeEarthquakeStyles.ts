import { StyleSheet } from "react-native";

import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";

export const homeEarthquakeStyles = StyleSheet.create({
  wrapper: {
    gap: spacing.md,
  },
  sectionHeader: {
    marginBottom: 0,
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
    fontSize: 15,
    fontWeight: "900",
    color: colors.danger,
    marginBottom: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: colors.textMuted,
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
  },
  featuredCard: {
    borderRadius: radius["3xl"],
  },
  featuredTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  featuredInfo: {
    flex: 1,
  },
  featuredBadge: {
    marginBottom: spacing.sm,
  },
  featuredLocation: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    lineHeight: 24,
  },
  magnitudeBadge: {
    minWidth: 74,
    height: 74,
    borderRadius: radius["2xl"],
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
  },
  magnitudeLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.textInverse,
    opacity: 0.82,
  },
  magnitudeValue: {
    fontSize: 25,
    fontWeight: "900",
    color: colors.textInverse,
    marginTop: 2,
  },
  featuredMetaRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metaItem: {
    flex: 1,
    gap: spacing.xs,
  },
  metaLabel: {
    ...typography.label,
    color: colors.textMuted,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  timeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
    marginBottom: spacing.md,
  },
  timeText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    color: colors.danger,
  },
  openDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  openDetailText: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.danger,
  },
  miniList: {
    gap: spacing.sm,
  },
  miniCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  miniMagnitude: {
    minWidth: 62,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  miniMagnitudeText: {
    fontSize: 13,
    fontWeight: "900",
  },
  miniInfo: {
    flex: 1,
  },
  miniTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
    lineHeight: 19,
  },
  miniSubtitle: {
    marginTop: spacing.xs,
    ...typography.caption,
    color: colors.textMuted,
  },
});
