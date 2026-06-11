/**
 * Dispatch Terminal Layout Tokens
 * 
 * Hard flat design. No soft drop shadows. 
 * Minimal border radii. 
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
  sm: 4,       // Very sharp, rigid elements
  md: 6,       // Standard operational elements
  lg: 8,       // Slightly larger cards
  xl: 12,      // Containers
  "2xl": 16,   // Prominent sections
  "3xl": 20,   // Bottom sheets, modals
  full: 999,   // Pill shapes only where absolutely necessary
} as const;

export const shadow = {
  /** Flat operational "shadow" which is just a solid 1px border visually, or hard offset */
  card: {
    // In a flat dispatch design, shadows are avoided in favor of crisp borders
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  /** Used for critical floating elements (e.g. command buttons) */
  floating: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;