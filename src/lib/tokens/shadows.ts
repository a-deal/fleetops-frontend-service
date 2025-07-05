// Shadow system with 5 elevation levels
// Uses oklch for consistent opacity across themes

export const shadows = {
  // No shadow
  none: 'none',
  
  // Level 1 - Subtle shadow for cards on background
  sm: '0 1px 2px 0 oklch(0% 0 0 / 0.05)',
  
  // Level 2 - Default shadow for raised elements
  DEFAULT: '0 1px 3px 0 oklch(0% 0 0 / 0.1), 0 1px 2px -1px oklch(0% 0 0 / 0.1)',
  
  // Level 3 - Medium shadow for dropdowns and tooltips
  md: '0 4px 6px -1px oklch(0% 0 0 / 0.1), 0 2px 4px -2px oklch(0% 0 0 / 0.1)',
  
  // Level 4 - Large shadow for modals and dialogs
  lg: '0 10px 15px -3px oklch(0% 0 0 / 0.1), 0 4px 6px -4px oklch(0% 0 0 / 0.1)',
  
  // Level 5 - Extra large shadow for high elevation
  xl: '0 20px 25px -5px oklch(0% 0 0 / 0.1), 0 8px 10px -6px oklch(0% 0 0 / 0.1)',
  
  // Special shadows
  inner: 'inset 0 2px 4px 0 oklch(0% 0 0 / 0.05)',
  
  // Colored shadows for brand elements
  primary: '0 4px 6px -1px oklch(63.31% 0.177 264.38 / 0.3), 0 2px 4px -2px oklch(63.31% 0.177 264.38 / 0.2)',
} as const

export type ShadowToken = typeof shadows