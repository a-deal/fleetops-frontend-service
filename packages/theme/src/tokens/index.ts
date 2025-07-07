// Design tokens for FleetOps theme
// These tokens are shared between cloud service and debug tool

export const colors = {
  // Fleet Status Colors
  fleet: {
    status: {
      operational: 'hsl(142.1 70.6% 45.3%)',
      warning: 'hsl(45.4 92.9% 47.4%)',
      critical: 'hsl(0 72.2% 50.6%)',
      offline: 'hsl(0 0% 63.9%)',
    },
    equipment: {
      active: 'hsl(142.1 70.6% 45.3%)',
      idle: 'hsl(201.3 96.3% 32.2%)',
      maintenance: 'hsl(45.4 92.9% 47.4%)',
      fault: 'hsl(0 72.2% 50.6%)',
    },
    alert: {
      info: 'hsl(201.3 96.3% 32.2%)',
      warning: 'hsl(45.4 92.9% 47.4%)',
      error: 'hsl(24.6 94.7% 53.1%)',
      critical: 'hsl(0 72.2% 50.6%)',
    },
    telemetry: {
      pressure: 'hsl(201.3 96.3% 32.2%)',
      temperature: 'hsl(0 72.2% 50.6%)',
      flow: 'hsl(142.1 70.6% 45.3%)',
      vibration: 'hsl(280.1 87.0% 50.3%)',
    },
  },
} as const;

export const radius = {
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const;