export const colors = {
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceMuted: "#F1F5F9",

  text: "#0F172A",
  textMuted: "#64748B",
  textSoft: "#94A3B8",
  textInverse: "#FFFFFF",

  border: "#E2E8F0",

  primary: "#DC2626",
  primaryDark: "#B91C1C",
  primarySoft: "#FEE2E2",

  success: "#16A34A",
  successDark: "#166534",
  successSoft: "#DCFCE7",

  warning: "#F59E0B",
  warningDark: "#D97706",
  warningSoft: "#FEF3C7",

  info: "#2563EB",
  infoDark: "#1D4ED8",
  infoSoft: "#DBEAFE",

  dark: "#0F172A",
  darkSoft: "#1E293B",

  danger: "#DC2626",
  dangerSoft: "#FEE2E2",

  shadow: "#0F172A",
} as const;

export type AppColor = keyof typeof colors;