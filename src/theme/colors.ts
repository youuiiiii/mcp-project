/**
 * SIGAP Design System
 * Based on reference: https://mower-filled-64016353.figma.site/
 */
export const colors = {
  // Core surfaces
  background: "#F1F5F9",          // Slate 100 for app background
  surface: "#FFFFFF",             // White for cards
  surfaceMuted: "#F8FAFC",        // Slate 50
  surfaceContainer: "#E2E8F0",    // Slate 200
  surfaceContainerHigh: "#CBD5E1",// Slate 300

  // Text
  text: "#1E293B",                // Slate 800
  textPrimary: "#1E293B",
  textMuted: "#475569",           // Slate 600
  textSecondary: "#475569",
  textSoft: "#64748B",            // Slate 500
  textInverse: "#FFFFFF",
  textOnDarkMuted: "#CBD5E1",

  // Lines & borders
  border: "#E2E8F0",              // Slate 200
  borderStrong: "#CBD5E1",        // Slate 300

  // Primary — SIGAP Teal/Cyan
  primary: "#0EA5E9",             // Cyan 500
  primaryDark: "#08627A",         // Deep Teal
  primarySoft: "#E0F2FE",         // Cyan 100
  primaryContainer: "#0284C7",    // Cyan 600

  // Success / Low Severity
  success: "#22C55E",             // Green 500
  successDark: "#15803D",         // Green 700
  successSoft: "#DCFCE7",         // Green 100

  // Warning / Moderate Severity
  warning: "#F97316",             // Orange 500
  warningDark: "#C2410C",         // Orange 700
  warningSoft: "#FFEDD5",         // Orange 100

  // Info
  info: "#3B82F6",                // Blue 500
  infoDark: "#1D4ED8",
  infoSoft: "#DBEAFE",

  // Dark
  dark: "#0F172A",                // Slate 900
  darkSoft: "#1E293B",            // Slate 800

  // Danger/Emergency / High Severity - Red FAB
  danger: "#EF4444",              // Red 500
  dangerSoft: "#FEE2E2",          // Red 100
  dangerDark: "#B91C1C",          // Red 700

  // Shadow base
  shadow: "#0F172A",
} as const;

export type AppColor = keyof typeof colors;
