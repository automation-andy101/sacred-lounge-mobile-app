// Sacred Lounge — Official Brand Colours from Brand Guidelines
export const Colors = {
  // Backgrounds
  background:     '#070302',   // near-black (primary background)
  backgroundCard: '#1A0F08',   // slightly lighter card bg
  backgroundDeep: '#3A291D',   // dark brown accent

  // Brand gold — primary font/accent colour
  gold:           '#BD8950',   // primary brand gold
  goldLight:      '#D4A06A',   // lighter gold for highlights
  goldMuted:      '#8B6235',   // muted gold for borders/dividers
  goldDim:        '#4A3220',   // very subtle tints

  // Text
  textPrimary:    '#E8DDCF',   // light cream — main text on dark
  textSecondary:  '#9C7D5E',   // muted warm tone
  textDisabled:   '#4A3220',   // disabled / placeholder

  // Semantic
  success:        '#5E9E6A',
  error:          '#C0514A',

  // Overlay
  overlay:        'rgba(7,3,2,0.6)',
  overlayHeavy:   'rgba(7,3,2,0.85)',
} as const;

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 6,
  md: 12,
  lg: 20,
  xl: 32,
  full: 9999,
} as const;
