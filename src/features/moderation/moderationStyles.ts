import { StyleSheet } from "react-native";

import { colors } from "../../theme/colors";
import { radius, shadow, spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";

export const moderationStyles = StyleSheet.create({
  centerContent: {
    justifyContent: "center",
  },
  content: {
    gap: spacing["2xl"],
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  section: {
    gap: spacing.md,
  },
  loadingCard: {
    minHeight: 120,
    justifyContent: "center",
  },
  accessCard: {
    alignItems: "center",
    gap: spacing.md,
  },
  accessTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },
  accessDescription: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.dangerSoft,
    borderColor: "#FECACA",
  },
  errorText: {
    flex: 1,
    ...typography.caption,
    color: colors.primaryDark,
  },
  ticketList: {
    gap: spacing.md,
  },
  ticketCard: {
    gap: spacing.md,
  },
  ticketHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  reasonIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.lg,
    backgroundColor: colors.dangerSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  ticketTitleGroup: {
    flex: 1,
  },
  ticketTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  ticketMeta: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
  },
  noteBox: {
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
  },
  noteLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
  },
  noteText: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
    color: "#475569",
  },
  previewBox: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
  },
  previewTitle: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  previewDescription: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
    color: "#475569",
  },
  previewMetaRow: {
    marginTop: spacing.sm,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  previewMissing: {
    marginTop: 6,
    ...typography.caption,
    color: colors.textMuted,
  },
  confidenceBox: {
    marginTop: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.sm,
    gap: 3,
  },
  confidenceLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.text,
  },
  confidenceText: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600",
    color: colors.textMuted,
  },
  reasonInput: {
    minHeight: 76,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "500",
    color: colors.text,
    textAlignVertical: "top",
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  logoutButton: {
    ...shadow.floating,
  },
});
