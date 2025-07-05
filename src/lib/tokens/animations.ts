// Animation timing tokens for consistent motion
// Follows Material Design principles for natural movement

export const animations = {
  // Durations
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '400ms',
    slowest: '500ms',
  },
  
  // Easing functions
  easing: {
    linear: 'linear',
    // Ease in - accelerating from zero velocity
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    // Ease out - decelerating to zero velocity
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    // Ease in-out - acceleration until halfway, then deceleration
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Anticipation - slight backup before forward movement
    anticipate: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    // Bounce - overshoots then settles
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Common animation presets
  transition: {
    // Base transitions
    colors: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms cubic-bezier(0.4, 0, 0.2, 1), border-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    // Common combinations
    all: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    none: 'none',
  },
} as const

export type AnimationToken = typeof animations