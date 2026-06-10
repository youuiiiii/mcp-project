/**
 * Terra Design System — Typography Tokens
 *
 * Headlines: 700 weight — bold and commanding.
 * Body: 500 weight — medium for comfortable reading.
 * Labels/Captions: 700 weight, uppercase for metadata.
 * Generous line-height (1.6+) for unhurried reading.
 */
export const typography = {
  hero: {
    fontSize: 32,
    fontWeight: "700" as const,
    lineHeight: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    lineHeight: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    lineHeight: 28,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    fontWeight: "500" as const,
    lineHeight: 22,
  },
  caption: {
    fontSize: 12,
    fontWeight: "700" as const,
    lineHeight: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: "700" as const,
    letterSpacing: 0.5,
  },
  tiny: {
    fontSize: 10,
    fontWeight: "700" as const,
    lineHeight: 16,
  },
} as const;