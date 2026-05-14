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
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: radius["2xl"],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(226,232,240,0.9)",
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
    fontWeight: "900",
    color: colors.textMuted,
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },

  headerTitle: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: "900",
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
    fontWeight: "900",
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
    borderColor: "#FECACA",
  },

  errorText: {
    flex: 1,
    ...typography.caption,
    color: colors.primaryDark,
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
    backgroundColor: "rgba(255,255,255,0.96)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(226,232,240,0.92)",
    ...shadow.card,
  },

  locateButtonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.96 }],
  },

  reportButton: {
    ...shadow.floating,
    shadowColor: colors.primaryDark,
  },

  bottomOverlay: {
    position: "absolute",
    left: MAP_HORIZONTAL_PADDING,
    right: MAP_HORIZONTAL_PADDING,
    bottom: MAP_BOTTOM_OFFSET,
  },

  infoCard: {
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: radius["2xl"],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(226,232,240,0.92)",
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
    fontWeight: "900",
    color: colors.text,
  },

  infoDescription: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
  },

  nearestRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  nearestText: {
    flex: 1,
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
  },
});