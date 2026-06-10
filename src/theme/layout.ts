/**
 * Terra Design System — Layout Tokens
 *
 * 8px base rhythm with 4px sub-step.
 * Soft shadows only. Prefer tonal separation over aggressive shadows.
 * Shapes: buttons/inputs 12px, cards 12px, sheets 24px.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
} as const;

export const radius = {
  sm: 8,       // Small elements (chips, mini badges)
  md: 12,      // Buttons, inputs, cards — Terra default
  lg: 12,      // Cards match buttons for visual harmony
  xl: 16,      // Larger containers
  "2xl": 20,   // Prominent sections
  "3xl": 24,   // Bottom sheets, modals (top corners)
  full: 999,   // Pill shapes
} as const;

export const shadow = {
  /** Very soft card shadow — Terra "tonal separation" philosophy */
  card: {
    shadowColor: "#2E3230",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 2,
  },
  /** Floating elements — slightly more visible but still restrained */
  floating: {
    shadowColor: "#2E3230",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
  },
} as const;