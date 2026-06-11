/**
 * Dispatch Terminal Design System
 * Based on reference: https://mower-filled-64016353.figma.site/
 * 
 * Crisp, high-contrast, zero-slop operational aesthetics.
 * Hard borders, vibrant operational colors, and flat structure.
 */
export const colors = {
  // Core surfaces
  background: "#F8FAFC",          // Slate 50
  surface: "#FFFFFF",
  surfaceMuted: "#F1F5F9",        // Slate 100
  surfaceContainer: "#E2E8F0",    // Slate 200
  surfaceContainerHigh: "#CBD5E1",// Slate 300

  // Text — high contrast
  text: "#0F172A",                // Slate 900
  textPrimary: "#0F172A",
  textMuted: "#475569",           // Slate 600
  textSecondary: "#475569",
  textSoft: "#64748B",            // Slate 500
  textInverse: "#FFFFFF",
  textOnDarkMuted: "#CBD5E1",

  // Lines & borders — crisp
  border: "#CBD5E1",              // Slate 300
  borderStrong: "#94A3B8",        // Slate 400

  // Primary — vibrant operational Teal
  primary: "#00A3C4",             // Exact Figma teal
  primaryDark: "#00839E",
  primarySoft: "#E0F7FA",
  primaryContainer: "#00A3C4",

  // Success
  success: "#10B981",             // Emerald 500
  successDark: "#059669",         // Emerald 600
  successSoft: "#D1FAE5",

  // Warning
  warning: "#F59E0B",             // Amber 500
  warningDark: "#D97706",         // Amber 600
  warningSoft: "#FEF3C7",

  // Info
  info: "#3B82F6",                // Blue 500
  infoDark: "#2563EB",
  infoSoft: "#DBEAFE",

  // Dark — solid slate command background
  dark: "#0F172A",                // Slate 900
  darkSoft: "#1E293B",            // Slate 800

  // Danger/Emergency — sharp operational red
  danger: "#EF4444",              // Red 500
  dangerSoft: "#FEE2E2",
  dangerDark: "#B91C1C",

  // Shadow base
  shadow: "#0F172A",
} as const;

export type AppColor = keyof typeof colors;
