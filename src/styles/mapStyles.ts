import { StyleSheet } from "react-native";

import { colors } from "../theme/colors";
import { radius, shadow, spacing } from "../theme/layout";
import { typography } from "../theme/typography";

const MAP_TOP_OFFSET = 52;
const MAP_HORIZONTAL_PADDING = spacing.lg;
const MAP_BOTTOM_OFFSET = 24;

export const mapStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  map: {
    flex: 1,
  },

  topOverlay: {
    position: "absolute",
    top: MAP_TOP_OFFSET,
    left: MAP_HORIZONTAL_PADDING,
    right: MAP_HORIZONTAL_PADDING,
    gap: spacing.sm,
  },

  compactHeader: {
    minHeight: 62,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(196, 200, 188, 0.3)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    ...shadow.card,
  },

  headerTitleGroup: {
    flex: 1,
  },

  headerEyebrow: {
    fontSize: 11,
    fontWeight: "700", // Terra label weight
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  headerTitle: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.successSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.full,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: radius.full,
    backgroundColor: colors.success,
  },

  liveText: {
    fontSize: 11,
    fontWeight: "700", // Terra label weight
    color: colors.successDark,
  },

  filterWrapper: {
    marginHorizontal: -MAP_HORIZONTAL_PADDING,
  },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.dangerSoft,
  },

  errorText: {
    flex: 1,
    ...typography.caption,
    color: colors.dangerDark,
  },

  mapActions: {
    position: "absolute",
    right: spacing.lg,
    bottom: 122,
    zIndex: 20,
    alignItems: "flex-end",
    gap: spacing.sm,
  },

  locateButton: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(196, 200, 188, 0.3)",
    ...shadow.card,
  },

  locateButtonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.96 }],
  },

  reportButton: {
    ...shadow.floating,
    shadowColor: colors.primary,
  },

  bottomOverlay: {
    position: "absolute",
    left: MAP_HORIZONTAL_PADDING,
    right: MAP_HORIZONTAL_PADDING,
    bottom: MAP_BOTTOM_OFFSET,
  },

  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(196, 200, 188, 0.3)",
    ...shadow.card,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  infoTextGroup: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },

  infoDescription: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: "500", // Terra body weight
    color: colors.textMuted,
  },

  nearestRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "rgba(196, 200, 188, 0.3)",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  nearestText: {
    flex: 1,
    fontSize: 11,
    fontWeight: "500",
    color: colors.textMuted,
  },

  sosButton: {
    minWidth: 74,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: spacing.md,
    borderWidth: 3,
    borderColor: colors.dangerSoft,
    ...shadow.floating,
    shadowColor: colors.dangerDark,
  },

  sosButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },

  sosButtonText: {
    fontSize: 12,
    fontWeight: "700", // Terra label weight
    color: colors.textInverse,
  },

  activeFilterRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xs,
  },

  activeFilterBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: "rgba(196, 200, 188, 0.3)",
    ...shadow.card,
  },

  activeFilterText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
  },

  clearFilterButton: {
    padding: 2,
    marginLeft: spacing.xs,
  },
});