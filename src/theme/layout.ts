/**
 * Dispatch layout tokens.
 *
 * Compact radii keep operational screens tidy, while subtle shadows help the
 * mobile dashboard cards read closer to the provided reference.
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
  sm: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 4,
  },
  card: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  floating: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;
