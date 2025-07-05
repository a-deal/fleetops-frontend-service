// Design Token System
// Central export for all design tokens used throughout the application

export { animations } from './animations'
export { colors } from './colors'
export { radii } from './radii'
export { shadows } from './shadows'
export { spacing } from './spacing'
export { typography } from './typography'

// Re-export types
export type { AnimationToken } from './animations'
export type { ColorToken, SemanticColors } from './colors'
export type { RadiusToken } from './radii'
export type { ShadowToken } from './shadows'
export type { SpacingToken } from './spacing'
export type { TypographyToken } from './typography'

// Import types for use in aggregate interface
import type { AnimationToken } from './animations'
import type { ColorToken } from './colors'
import type { RadiusToken } from './radii'
import type { ShadowToken } from './shadows'
import type { SpacingToken } from './spacing'
import type { TypographyToken } from './typography'

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