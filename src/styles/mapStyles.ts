import { StyleSheet } from "react-native";

import { colors } from "../theme/colors";
import { radius, shadow, spacing } from "../theme/layout";
import { typography } from "../theme/typography";

const MAP_TOP_OFFSET = 52;
const MAP_HORIZONTAL_PADDING = spacing.lg;
const MAP_BOTTOM_OFFSET = 28;
const SOS_BOTTOM_OFFSET = 210;

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

  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius["2xl"],
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
  },

  headerSubtitle: {
    marginTop: spacing.xs,
    ...typography.caption,
    color: colors.textMuted,
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.successSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: radius.full,
    backgroundColor: colors.success,
  },

  liveText: {
    fontSize: 10,
    fontWeight: "900",
    color: colors.success,
  },

  filterWrapper: {
    marginHorizontal: -MAP_HORIZONTAL_PADDING,
  },

  errorBanner: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  errorText: {
    ...typography.caption,
    color: colors.primaryDark,
  },

  sosWrapper: {
    position: "absolute",
    right: spacing.lg,
    bottom: SOS_BOTTOM_OFFSET,
    zIndex: 20,
  },

  bottomOverlay: {
    position: "absolute",
    left: MAP_HORIZONTAL_PADDING,
    right: MAP_HORIZONTAL_PADDING,
    bottom: MAP_BOTTOM_OFFSET,
  },

  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius["2xl"],
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
  },

  infoDescription: {
    marginTop: 6,
    ...typography.caption,
    color: colors.textMuted,
  },

  warningCard: {
    marginTop: spacing.sm,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  warningTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#991B1B",
  },

  warningText: {
    flex: 1,
    ...typography.caption,
    color: colors.textMuted,
  },

    warningContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  focusLocationAction: {
    marginTop: 10,
    ...typography.caption,
    color: colors.primary,
    fontWeight: "900",
  },
});