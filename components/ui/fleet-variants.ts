import { cva } from 'class-variance-authority';

export const statusBadgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      status: {
        operational: 'bg-fleet-status-operational/10 text-fleet-status-operational',
        warning: 'bg-fleet-status-warning/10 text-fleet-status-warning',
        critical: 'bg-fleet-status-critical/10 text-fleet-status-critical animate-pulse',
        offline: 'bg-fleet-status-offline/10 text-fleet-status-offline'
      }
    },
    defaultVariants: {
      status: 'operational'
    }
  }
);

export const telemetryCardVariants = cva(
  'rounded-lg border p-4 transition-all hover:shadow-lg',
  {
    variants: {
      alert: {
        none: '',
        warning: 'border-fleet-status-warning shadow-fleet-status-warning/20',
        critical: 'border-fleet-status-critical shadow-fleet-status-critical/20 animate-pulse-critical'
      },
      size: {
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6'
      }
    },
    defaultVariants: {
      alert: 'none',
      size: 'md'
    }
  }
);

export const gaugeVariants = cva(
  'relative flex flex-col items-center justify-center',
  {
    variants: {
      size: {
        sm: 'w-24 h-24',
        md: 'w-32 h-32',
        lg: 'w-48 h-48'
      },
      status: {
        normal: '',
        warning: '[&_canvas]:filter [&_canvas]:drop-shadow-[0_0_8px_rgb(var(--fleet-status-warning))]',
        critical: '[&_canvas]:filter [&_canvas]:drop-shadow-[0_0_12px_rgb(var(--fleet-status-critical))]'
      }
    },
    defaultVariants: {
      size: 'md',
      status: 'normal'
    }
  }
);

export const alertVariants = cva(
  'relative overflow-hidden rounded-lg border p-4',
  {
    variants: {
      severity: {
        low: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100',
        medium: 'border-fleet-status-warning/50 bg-fleet-status-warning/5 text-fleet-status-warning',
        high: 'border-fleet-status-warning bg-fleet-status-warning/10 text-fleet-status-warning',
        critical: 'border-fleet-status-critical bg-fleet-status-critical/10 text-fleet-status-critical animate-pulse-critical'
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-md',
        false: ''
      }
    },
    defaultVariants: {
      severity: 'low',
      interactive: false
    }
  }
);

export const connectionIndicatorVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
  {
    variants: {
      status: {
        connected: 'bg-fleet-status-operational/10 text-fleet-status-operational',
        connecting: 'bg-fleet-status-warning/10 text-fleet-status-warning animate-pulse',
        disconnected: 'bg-fleet-status-offline/10 text-fleet-status-offline',
        error: 'bg-fleet-status-critical/10 text-fleet-status-critical'
      }
    },
    defaultVariants: {
      status: 'disconnected'
    }
  }
);

export const metricTrendVariants = cva(
  'rounded-lg border bg-card',
  {
    variants: {
      trend: {
        up: 'border-green-200 dark:border-green-800',
        down: 'border-red-200 dark:border-red-800',
        stable: 'border-gray-200 dark:border-gray-800'
      },
      size: {
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6'
      }
    },
    defaultVariants: {
      trend: 'stable',
      size: 'md'
    }
  }
);