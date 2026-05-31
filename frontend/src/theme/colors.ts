// src/theme/colors.ts
// Sacred Lounge design system — dark amber/gold on near-black

export const Colors = {
  // Base palette
  background:     '#0D0A07',   // near-black warm
  backgroundCard: '#1A1410',   // slightly lighter card bg
  backgroundInput:'#221C15',   // input fields

  // Gold / amber hierarchy
  gold:           '#C8922A',   // primary brand gold
  goldLight:      '#E8B84B',   // headings / highlights
  goldMuted:      '#8B6420',   // subtle borders, dividers
  goldDim:        '#5C4215',   // very subtle tints

  // Text
  textPrimary:    '#F0DDB0',   // warm off-white
  textSecondary:  '#A8896A',   // muted body copy
  textDisabled:   '#5A4832',   // disabled / placeholder

  // Accent
  amber:          '#D4722A',   // warm amber for CTA
  amberLight:     '#F08040',   // hover / pressed states

  // Semantic
  success:        '#5E9E6A',
  error:          '#C0514A',
  warning:        '#D49B3A',

  // Overlay
  overlay:        'rgba(13,10,7,0.7)',
  overlayHeavy:   'rgba(13,10,7,0.9)',
} as const;

export const Typography = {
  fontDisplay:  'CinzelDecorative_400Regular',
  fontSerifReg: 'CormorantGaramond_400Regular',
  fontSerifIt:  'CormorantGaramond_400Italic',
  fontSerifMed: 'CormorantGaramond_500Medium',
  fontSerifBold:'CormorantGaramond_700Bold',
  fontSans:     'System',
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
