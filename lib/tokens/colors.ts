// Color tokens using oklch format for perceptual uniformity
// These are the source of truth for all colors in the application

export const colors = {
  // Raw Palette - Gym brand colors
  slate: {
    50: 'oklch(98.74% 0.008 253.13)',
    100: 'oklch(97.51% 0.008 253.13)',
    200: 'oklch(93.60% 0.009 253.13)',
    300: 'oklch(88.49% 0.014 253.13)',
    400: 'oklch(70.64% 0.027 257.42)',
    500: 'oklch(55.43% 0.046 257.42)',
    600: 'oklch(45.37% 0.046 257.42)',
    700: 'oklch(37.80% 0.042 264.70)',
    800: 'oklch(31.42% 0.042 264.70)',
    900: 'oklch(26.46% 0.042 264.70)',
    950: 'oklch(20.37% 0.024 253.13)',
  },
  
  blue: {
    50: 'oklch(97.78% 0.014 237.70)',
    100: 'oklch(95.38% 0.032 241.49)',
    200: 'oklch(91.30% 0.063 243.66)',
    300: 'oklch(84.12% 0.116 244.53)',
    400: 'oklch(73.51% 0.172 254.62)',
    500: 'oklch(63.31% 0.177 264.38)', // Primary brand blue
    600: 'oklch(54.98% 0.196 268.02)',
    700: 'oklch(48.84% 0.188 269.36)',
    800: 'oklch(41.42% 0.153 268.16)',
    900: 'oklch(35.85% 0.119 266.66)',
    950: 'oklch(26.46% 0.084 267.42)',
  },

  // Semantic colors for success, warning, error states
  green: {
    50: 'oklch(97.14% 0.027 154.60)',
    500: 'oklch(60.14% 0.145 162.48)', // Success
    600: 'oklch(52.46% 0.145 164.15)',
  },

  amber: {
    50: 'oklch(98.74% 0.022 95.68)',
    500: 'oklch(79.48% 0.154 86.05)', // Warning
    600: 'oklch(71.76% 0.154 82.89)',
  },

  red: {
    50: 'oklch(97.14% 0.025 25.65)',
    500: 'oklch(63.31% 0.220 27.32)', // Error
    600: 'oklch(57.75% 0.227 27.10)',
  },

  // Semantic token mapping for light/dark themes
  semantic: {
    light: {
      // Backgrounds
      background: 'oklch(100% 0 0)', // Pure white
      'background-subtle': 'oklch(98.74% 0.008 253.13)', // slate-50
      'background-muted': 'oklch(97.51% 0.008 253.13)', // slate-100
      
      // Foregrounds
      foreground: 'oklch(20.37% 0.024 253.13)', // slate-950
      'foreground-subtle': 'oklch(45.37% 0.046 257.42)', // slate-600
      'foreground-muted': 'oklch(55.43% 0.046 257.42)', // slate-500
      
      // Brand
      primary: 'oklch(63.31% 0.177 264.38)', // blue-500
      'primary-foreground': 'oklch(100% 0 0)', // white
      
      // Secondary
      secondary: 'oklch(97.51% 0.008 253.13)', // slate-100
      'secondary-foreground': 'oklch(20.37% 0.024 253.13)', // slate-950
      
      // Accent
      accent: 'oklch(97.51% 0.008 253.13)', // slate-100
      'accent-foreground': 'oklch(20.37% 0.024 253.13)', // slate-950
      
      // Functional
      success: 'oklch(60.14% 0.145 162.48)', // green-500
      warning: 'oklch(79.48% 0.154 86.05)', // amber-500
      error: 'oklch(63.31% 0.220 27.32)', // red-500
      
      // Borders & UI
      border: 'oklch(93.60% 0.009 253.13)', // slate-200
      input: 'oklch(93.60% 0.009 253.13)', // slate-200
      ring: 'oklch(63.31% 0.177 264.38)', // blue-500
      
      // Cards
      card: 'oklch(100% 0 0)', // white
      'card-foreground': 'oklch(20.37% 0.024 253.13)', // slate-950
    },
    
    dark: {
      // Backgrounds
      background: 'oklch(20.37% 0.024 253.13)', // slate-950
      'background-subtle': 'oklch(26.46% 0.042 264.70)', // slate-900
      'background-muted': 'oklch(31.42% 0.042 264.70)', // slate-800
      
      // Foregrounds
      foreground: 'oklch(98.74% 0.008 253.13)', // slate-50
      'foreground-subtle': 'oklch(88.49% 0.014 253.13)', // slate-300
      'foreground-muted': 'oklch(70.64% 0.027 257.42)', // slate-400
      
      // Brand
      primary: 'oklch(63.31% 0.177 264.38)', // blue-500 (same as light)
      'primary-foreground': 'oklch(20.37% 0.024 253.13)', // slate-950
      
      // Secondary
      secondary: 'oklch(31.42% 0.042 264.70)', // slate-800
      'secondary-foreground': 'oklch(98.74% 0.008 253.13)', // slate-50
      
      // Accent
      accent: 'oklch(31.42% 0.042 264.70)', // slate-800
      'accent-foreground': 'oklch(98.74% 0.008 253.13)', // slate-50
      
      // Functional
      success: 'oklch(60.14% 0.145 162.48)', // green-500
      warning: 'oklch(79.48% 0.154 86.05)', // amber-500
      error: 'oklch(63.31% 0.220 27.32)', // red-500
      
      // Borders & UI
      border: 'oklch(31.42% 0.042 264.70)', // slate-800
      input: 'oklch(31.42% 0.042 264.70)', // slate-800
      ring: 'oklch(63.31% 0.177 264.38)', // blue-500
      
      // Cards
      card: 'oklch(26.46% 0.042 264.70)', // slate-900
      'card-foreground': 'oklch(98.74% 0.008 253.13)', // slate-50
    },
  },
} as const

export type ColorToken = typeof colors
export type SemanticColors = typeof colors.semantic.light