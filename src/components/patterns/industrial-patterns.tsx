import React from 'react';

import { statusBadgeVariants } from '@/components/ui/fleet-variants';
import { cn } from '@/lib/utils';

// Status Badge Pattern
export interface StatusBadgeProps {
  status: 'operational' | 'warning' | 'critical' | 'offline';
  label?: string;
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  label, 
  showDot = true,
  className 
}) => {
  return (
    <span className={cn(statusBadgeVariants({ status }), className)}>
      {showDot && (
        <span className={cn(
          'h-2 w-2 rounded-full',
          {
            'bg-fleet-status-operational': status === 'operational',
            'bg-fleet-status-warning': status === 'warning',
            'bg-fleet-status-critical animate-pulse': status === 'critical',
            'bg-fleet-status-offline': status === 'offline'
          }
        )} />
      )}
      {label || status}
    </span>
  );
};

// Equipment State Indicator Pattern
export interface EquipmentStateProps {
  state: 'active' | 'idle' | 'maintenance' | 'fault';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const EquipmentState: React.FC<EquipmentStateProps> = ({ 
  state, 
  size = 'md',
  showLabel = true 
}) => {
  const stateConfig = {
    active: { color: 'bg-green-500', label: 'Active', pulse: false },
    idle: { color: 'bg-yellow-500', label: 'Idle', pulse: false },
    maintenance: { color: 'bg-blue-500', label: 'Maintenance', pulse: true },
    fault: { color: 'bg-red-500', label: 'Fault', pulse: true }
  };

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6'
  };

  const config = stateConfig[state];

  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        'rounded-full',
        sizeClasses[size],
        config.color,
        config.pulse && 'animate-pulse'
      )} />
      {showLabel && (
        <span className="text-sm font-medium">{config.label}</span>
      )}
    </div>
  );
};

// Alert Priority Pattern
export interface AlertPriorityIndicatorProps {
  priority: 'low' | 'medium' | 'high' | 'critical';
  count?: number;
  onClick?: () => void;
}

export const AlertPriorityIndicator: React.FC<AlertPriorityIndicatorProps> = ({ 
  priority, 
  count = 0,
  onClick 
}) => {
  const priorityConfig = {
    low: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
    high: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
    critical: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' }
  };

  const config = priorityConfig[priority];

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative rounded-lg border-2 p-3 transition-all',
        config.bg,
        config.text,
        config.border,
        onClick && 'hover:scale-105 cursor-pointer',
        priority === 'critical' && count > 0 && 'animate-pulse'
      )}
    >
      <div className="text-2xl font-bold">{count}</div>
      <div className="text-xs uppercase tracking-wider">{priority}</div>
      {priority === 'critical' && count > 0 && (
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-ping" />
      )}
    </button>
  );
};

// Telemetry Value Display Pattern
export interface TelemetryValueProps {
  value: number;
  unit: string;
  label: string;
  threshold?: { warning: number; critical: number };
  trend?: 'up' | 'down' | 'stable';
  precision?: number;
}

export const TelemetryValue: React.FC<TelemetryValueProps> = ({ 
  value, 
  unit, 
  label,
  threshold,
  trend,
  precision = 1
}) => {
  const getStatus = () => {
    if (!threshold) return 'normal';
    if (value >= threshold.critical) return 'critical';
    if (value >= threshold.warning) return 'warning';
    return 'normal';
  };

  const status = getStatus();
  const trendIcons = {
    up: '↑',
    down: '↓',
    stable: '→'
  };

  return (
    <div className={cn(
      'rounded-lg border p-4',
      status === 'warning' && 'border-fleet-status-warning bg-fleet-status-warning/5',
      status === 'critical' && 'border-fleet-status-critical bg-fleet-status-critical/5 animate-pulse'
    )}>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <span className={cn(
          'text-3xl font-mono font-bold',
          status === 'warning' && 'text-fleet-status-warning',
          status === 'critical' && 'text-fleet-status-critical'
        )}>
          {value.toFixed(precision)}
        </span>
        <span className="text-sm text-muted-foreground">{unit}</span>
        {trend && (
          <span className={cn(
            'text-lg',
            trend === 'up' && 'text-green-500',
            trend === 'down' && 'text-red-500',
            trend === 'stable' && 'text-gray-500'
          )}>
            {trendIcons[trend]}
          </span>
        )}
      </div>
    </div>
  );
};

// Connection Quality Pattern
export interface ConnectionQualityProps {
  quality: 'excellent' | 'good' | 'poor' | 'offline';
  latency?: number;
  showDetails?: boolean;
}

export const ConnectionQuality: React.FC<ConnectionQualityProps> = ({ 
  quality, 
  latency,
  showDetails = false 
}) => {
  const qualityConfig = {
    excellent: { bars: 4, color: 'text-green-500', label: 'Excellent' },
    good: { bars: 3, color: 'text-yellow-500', label: 'Good' },
    poor: { bars: 1, color: 'text-orange-500', label: 'Poor' },
    offline: { bars: 0, color: 'text-red-500', label: 'Offline' }
  };

  const config = qualityConfig[quality];

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={cn(
              'w-1 transition-all',
              bar <= config.bars ? config.color : 'bg-gray-300',
              bar === 1 && 'h-2',
              bar === 2 && 'h-3',
              bar === 3 && 'h-4',
              bar === 4 && 'h-5'
            )}
          />
        ))}
      </div>
      {showDetails && (
        <div className="text-xs">
          <span className={config.color}>{config.label}</span>
          {latency && <span className="text-muted-foreground ml-1">({latency}ms)</span>}
        </div>
      )}
    </div>
  );
};

// Data Age Indicator Pattern
export interface DataAgeIndicatorProps {
  timestamp: number;
  maxAge?: number; // in milliseconds
  showExact?: boolean;
}

export const DataAgeIndicator: React.FC<DataAgeIndicatorProps> = ({ 
  timestamp, 
  maxAge = 60000, // 1 minute default
  showExact = false 
}) => {
  const [age, setAge] = React.useState(Date.now() - timestamp);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAge(Date.now() - timestamp);
    }, 1000);
    return () => clearInterval(interval);
  }, [timestamp]);

  const isStale = age > maxAge;
  const seconds = Math.floor(age / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const getAgeText = () => {
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  return (
    <div className={cn(
      'inline-flex items-center gap-1 text-xs',
      isStale ? 'text-fleet-status-warning' : 'text-muted-foreground'
    )}>
      <div className={cn(
        'h-2 w-2 rounded-full',
        isStale ? 'bg-fleet-status-warning animate-pulse' : 'bg-green-500'
      )} />
      {showExact ? new Date(timestamp).toLocaleTimeString() : getAgeText()}
    </div>
  );
};