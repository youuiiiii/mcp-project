import { StyleSheet } from "react-native";

import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";

export const resolveIncidentModalStyles = StyleSheet.create({
  noticeCard: {
    marginTop: spacing["2xl"],
    gap: spacing.md,
    backgroundColor: colors.warningSoft,
    borderColor: "#FDE68A",
  },
  noticeTextGroup: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  noticeText: {
    flex: 1,
    padding: 0,
    margin: 0,
    ...typography.caption,
    color: "#92400E",
  },
  section: {
    marginTop: spacing["2xl"],
    gap: spacing.md,
  },
  input: {
    minHeight: 112,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: 13,
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    lineHeight: 20,
  },
  footerCancelButton: {
    flex: 1,
  },
  footerSubmitButton: {
    flex: 1.45,
  },
});
