// Design Token System
// Central export for all design tokens used throughout the application

export { colors } from './colors'
export { spacing } from './spacing'
export { typography } from './typography'
export { shadows } from './shadows'
export { radii } from './radii'
export { animations } from './animations'

// Re-export types
export type { ColorToken, SemanticColors } from './colors'
export type { SpacingToken } from './spacing'
export type { TypographyToken } from './typography'
export type { ShadowToken } from './shadows'
export type { RadiusToken } from './radii'
export type { AnimationToken } from './animations'

// Aggregate token type
export interface DesignTokens {
  colors: ColorToken
  spacing: SpacingToken
  typography: TypographyToken
  shadows: ShadowToken
  radii: RadiusToken
  animations: AnimationToken
}

// Helper to get CSS variable from token path
export function getTokenVar(path: string): string {
  return `var(--${path.replace(/\./g, '-')})`
}