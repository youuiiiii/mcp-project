import { StyleSheet } from "react-native";

import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";

export const incidentOverviewStyles = StyleSheet.create({
  post: {
    flexDirection: "row",
    gap: spacing.md,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  authorName: {
    maxWidth: "54%",
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  dot: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMuted,
  },
  timeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
  },
  metaRow: {
    marginTop: spacing.sm,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  categoryPill: {
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "800",
  },

  title: {
    marginTop: spacing.md,
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "800",
    color: colors.text,
  },
  description: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
    color: "#475569",
  },
  disclaimer: {
    marginTop: spacing.md,
    ...typography.caption,
    color: colors.textMuted,
  },
  actionRow: {
    marginTop: spacing.md,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  actionButton: {
    flexGrow: 1,
  },
  reportContentButton: {
    marginTop: spacing.md,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.dangerSoft,
  },
  reportContentPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  reportContentText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.primaryDark,
  },
});
