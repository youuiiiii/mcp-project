import { StyleSheet } from "react-native";

import { colors } from "../../theme/colors";
import { radius, spacing } from "../../theme/layout";
import { typography } from "../../theme/typography";

export const verifyIncidentModalStyles = StyleSheet.create({
  section: {
    marginTop: spacing["2xl"],
    gap: spacing.md,
  },
  optionList: {
    gap: spacing.sm,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  optionDescription: {
    marginTop: 3,
    ...typography.caption,
    color: colors.textMuted,
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
