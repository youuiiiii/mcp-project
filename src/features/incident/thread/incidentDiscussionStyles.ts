import { StyleSheet } from "react-native";

import { colors } from "../../../theme/colors";
import { radius, spacing } from "../../../theme/layout";
import { typography } from "../../../theme/typography";

export const incidentDiscussionStyles = StyleSheet.create({
  section: {
    marginTop: spacing["2xl"],
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },
  sectionSubtitle: {
    marginTop: 2,
    ...typography.caption,
    color: colors.textMuted,
  },
  emptyState: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  emptyTextGroup: {
    flex: 1,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  emptyText: {
    marginTop: 2,
    ...typography.caption,
    color: colors.textMuted,
  },
  thread: {
    gap: 0,
  },
  replyRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  replyRail: {
    width: 34,
    alignItems: "center",
  },
  avatar: {
    backgroundColor: colors.info,
    alignItems: "center",
    justifyContent: "center",
  },
  replyLine: {
    flex: 1,
    width: 2,
    marginVertical: 5,
    backgroundColor: colors.border,
  },
  replyBody: {
    flex: 1,
    paddingBottom: spacing.lg,
  },
  replyHeader: {
    minHeight: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  replyAuthor: {
    maxWidth: "46%",
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
  },
  replyDot: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
  },
  replyTime: {
    flex: 1,
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
  },
  replyingToText: {
    marginTop: 1,
    fontSize: 11,
    fontWeight: "700",
    color: colors.info,
  },
  updateBadge: {
    marginTop: 2,
  },
  replyMessage: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
    color: "#475569",
  },
  compactMessage: {
    fontSize: 13,
    lineHeight: 19,
  },
  replyImageFrame: {
    marginTop: spacing.sm,
    width: "100%",
    borderRadius: radius.xl,
    overflow: "hidden",
    backgroundColor: colors.border,
    borderWidth: 1,
    borderColor: colors.border,
  },
  replyImage: {
    width: "100%",
    height: "100%",
  },
  imageHint: {
    position: "absolute",
    right: spacing.sm,
    bottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: radius.full,
    backgroundColor: "rgba(15, 23, 42, 0.72)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  imageHintText: {
    fontSize: 10,
    fontWeight: "900",
    color: colors.textInverse,
  },
  replyAction: {
    alignSelf: "flex-start",
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
  },
  pressed: {
    opacity: 0.75,
  },
  replyActionText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textMuted,
  },
  childList: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  childRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingLeft: spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: colors.border,
  },
  childBody: {
    flex: 1,
  },
  previewBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.94)",
    alignItems: "center",
    justifyContent: "center",
  },
  previewCloseArea: {
    ...StyleSheet.absoluteFillObject,
  },
  previewHeader: {
    position: "absolute",
    top: 48,
    right: 18,
    zIndex: 2,
  },
  previewCloseButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: "rgba(15, 23, 42, 0.72)",
    alignItems: "center",
    justifyContent: "center",
  },
  previewImage: {
    width: "100%",
    height: "82%",
  },
});
