/**
 * Terra Design System — "Rooted Warmth" Color Palette
 *
 * Earthy, desaturated tones. No neon or pure-hue colors.
 * Every gray has a warm yellow/green undertone.
 * Derived from the Stitch terra/DESIGN.md specification.
 */
export const colors = {
  // Core surfaces — warm cream foundation, never sterile white
  background: "#FAF6F0",
  surface: "#FFFFFF",
  surfaceMuted: "#F5F1EA",        // surface-container-low
  surfaceContainer: "#F0ECE4",    // surface-container
  surfaceContainerHigh: "#EAE6DE", // surface-container-high

  // Text — warm dark grays
  text: "#2E3230",                // on-surface
  textPrimary: "#2E3230",
  textMuted: "#4A4E4A",           // on-surface-variant
  textSecondary: "#4A4E4A",
  textSoft: "#74796E",            // outline (lighter descriptive text)
  textInverse: "#FFFFFF",
  textOnDarkMuted: "#C4C8BC",

  // Lines & borders — warm neutral with green undertone
  border: "#C4C8BC",              // outline-variant
  borderStrong: "#74796E",        // outline

  // Primary — Forest Green actions, navigation, interactive states
  primary: "#4A7C59",
  primaryDark: "#2A6038",
  primarySoft: "#C8E8D0",         // primary-fixed (light green accent)
  primaryContainer: "#78A886",    // primary-container

  // Success — warm green
  success: "#4A7C59",
  successDark: "#2A6038",
  successSoft: "#C8E8D0",

  // Warning/Tertiary — warm amber highlights, accents, badges
  warning: "#705C30",
  warningDark: "#554020",
  warningSoft: "#F8E0A8",         // tertiary-fixed

  // Info — muted teal (warm-shifted from pure blue)
  info: "#3F6653",
  infoDark: "#274E3D",
  infoSoft: "#C1ECD4",

  // Dark — warm charcoal
  dark: "#2E3230",
  darkSoft: "#4A4E4A",

  // Danger/Emergency — deep warm red, never neon
  danger: "#B83230",
  dangerSoft: "#FFDAD8",
  dangerDark: "#690005",

  // Shadow base
  shadow: "#2E3230",
} as const;

export type AppColor = keyof typeof colors;
