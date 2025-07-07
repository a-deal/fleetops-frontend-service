// Typography tokens for consistent text styling
// Uses GT Pressura for body/UI text, GT America for headings

export const typography = {
  // Font families
  fontFamily: {
    sans: 'var(--font-gt-pressura)',
    mono: 'var(--font-gt-pressura-mono)',
    heading: 'var(--font-gt-america)',
  },
  
  // Font sizes with line heights
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],       // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],      // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],   // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
    '5xl': ['3rem', { lineHeight: '1' }],          // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],       // 60px
    '7xl': ['4.5rem', { lineHeight: '1' }],        // 72px
    '8xl': ['6rem', { lineHeight: '1' }],          // 96px
    '9xl': ['8rem', { lineHeight: '1' }],          // 128px
  },
  
  // Font weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  
  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
    3: '.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
  },
  
  // Semantic mappings for better developer experience
  ui: {
    caption: ['0.875rem', { lineHeight: '1.25rem' }],    // 14px - minimum size
    body: ['1rem', { lineHeight: '1.5rem' }],            // 16px - default
    lead: ['1.125rem', { lineHeight: '1.75rem' }],       // 18px - emphasis
  },
  
  heading: {
    h1: ['2.25rem', { lineHeight: '2.5rem' }],           // 36px
    h2: ['1.875rem', { lineHeight: '2.25rem' }],         // 30px
    h3: ['1.5rem', { lineHeight: '2rem' }],              // 24px
    h4: ['1.25rem', { lineHeight: '1.75rem' }],          // 20px
    h5: ['1.125rem', { lineHeight: '1.75rem' }],         // 18px
    h6: ['1rem', { lineHeight: '1.5rem' }],              // 16px
  },
} as const

export type TypographyToken = typeof typography