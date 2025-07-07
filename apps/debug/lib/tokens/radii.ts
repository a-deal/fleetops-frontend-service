// Border radius tokens for consistent corner rounding
// Based on a geometric progression for visual harmony

export const radii = {
  none: '0px',
  sm: '0.125rem',   // 2px - subtle rounding
  DEFAULT: '0.25rem', // 4px - default for inputs
  md: '0.375rem',    // 6px - cards and containers
  lg: '0.5rem',      // 8px - buttons and badges
  xl: '0.75rem',     // 12px - large cards
  '2xl': '1rem',     // 16px - modals
  '3xl': '1.5rem',   // 24px - hero sections
  full: '9999px',    // Pills and circular elements
} as const

export type RadiusToken = typeof radii