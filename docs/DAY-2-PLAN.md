# Day 2 Detailed Plan: Fleet-Aware Foundation Systems

## Consensus Decision: Hybrid Approach
Based on unanimous agreement from GPT-4o, Claude Opus 4, and DeepSeek (all 8/10 confidence), Day 2 will implement a **hybrid approach** that modifies all foundations to be fleet-aware from the start. This decision is driven by:

- **Industry Best Practice**: Successful fleet platforms (Samsara, Geotab) embed real-time capabilities in core architecture
- **Cost Efficiency**: 20% more effort now prevents 40-50% rework later
- **Timeline Protection**: Retrofitting generic foundations typically causes 2-3x delays
- **Technical Alignment**: Zustand and TanStack Query natively support real-time patterns needed for telemetry

## Overview
Day 2 establishes fleet-aware architectural foundations that prevent technical debt while accelerating the 10-week MVP timeline. Every foundation decision considers industrial IoT requirements: real-time telemetry, offline resilience, and operator-focused UX.

## Critical Path Items
1. **Fleet-Aware Theme System** - Industrial UI patterns, alert states, equipment status indicators
2. **Real-Time State Architecture** - WebSocket-ready patterns for telemetry streams
3. **Telemetry Mock Infrastructure** - Realistic sensor data simulation
4. **Industrial Reference Components** - Gauges, status cards, alert systems

## Schedule & Tasks

### 9:00-10:30: Fleet-Aware Theme System
**Goal**: Create an industrial-focused theme provider that unifies UI libraries for fleet management

**Tasks**:
1. Define industrial color palette
   - Status colors: operational (green), warning (amber), critical (red), offline (gray)
   - Equipment states: active, idle, maintenance, fault
   - Alert severity levels
   - Dark mode optimized for field use

2. Create fleet namespace strategy
   ```
   --fleet-* (fleet-specific variables)
   --status-* (equipment status colors)
   --telemetry-* (data visualization)
   --ui-* (shadcn variables)
   --tremor-* (Tremor variables)
   ```

3. Build FleetThemeProvider component
   - `/lib/theme/fleet-provider.tsx` with industrial defaults
   - High contrast mode for outdoor use
   - Alert state animations
   - Status indicator patterns

4. Industrial UI tokens
   - Gauge gradients and thresholds
   - Alert pulse animations
   - Connection status indicators
   - Equipment state transitions

**Deliverable**: Fleet-aware theme system with industrial design tokens

### 10:30-12:00: Industrial Design System & Documentation
**Goal**: Establish fleet management design system with industrial UI patterns

**Tasks**:
1. Define fleet-specific design tokens
   - Equipment status palette (operational, warning, critical, maintenance)
   - Telemetry visualization colors (pressure, temperature, flow rate)
   - Alert severity scale (info, warning, error, critical)
   - Industrial typography (high readability, condensed for dashboards)
   - Spacing for dense information display

2. Create industrial component patterns
   - Status badge variants
   - Gauge component specifications
   - Alert notification patterns
   - Equipment card layouts
   - Telemetry chart color schemes

3. Document fleet theme system
   - `/docs/FLEET-THEME.md` with industrial tokens
   - Equipment status guidelines
   - Alert design patterns
   - Accessibility for field conditions
   - Dark/light/high-contrast modes

**Key Decision**: Use CSS Layers for industrial overrides
- Fleet-specific layers override base theme where needed

### 12:00-13:00: Lunch Break & Review

### 13:00-14:30: Real-Time State Management Architecture
**Goal**: Set up Zustand and TanStack Query with WebSocket support for telemetry streams

**Tasks**:
1. Install real-time dependencies
   ```bash
   pnpm add zustand @tanstack/react-query @tanstack/react-query-devtools
   pnpm add socket.io-client @types/ws
   ```

2. Create fleet-specific store structure
   - `/stores/telemetry-store.ts` - Real-time sensor data
   - `/stores/equipment-store.ts` - Equipment status, locations
   - `/stores/alert-store.ts` - Active alerts, acknowledgments
   - `/stores/connection-store.ts` - WebSocket status, offline queue

3. Configure TanStack Query for time-series
   - `/lib/api/query-client.ts` with telemetry defaults
   - Stale time: 1 second (real-time data)
   - Cache time: 5 minutes (historical data)
   - WebSocket subscriptions for live updates
   - Optimistic updates for action items

4. Create telemetry hooks
   ```typescript
   useTelemetryStream(equipmentId: string)
   useEquipmentStatus(fleetId: string)
   useAlertSubscription(severity: AlertLevel)
   useOfflineSync()
   ```

5. WebSocket middleware for Zustand
   - Auto-reconnection logic
   - Message queuing for offline
   - State synchronization

**Decision**: WebSocket-first approach
- Zustand handles real-time state updates
- TanStack Query for historical data and caching

### 14:30-16:00: Telemetry Mock Infrastructure
**Goal**: Simulate realistic industrial sensor data streams for fleet management

**Tasks**:
1. Install MSW with telemetry utilities
   ```bash
   pnpm add -D msw @mswjs/data @faker-js/faker
   pnpm add -D @influxdata/influxdb-client-js # For time-series patterns
   ```

2. Create fleet mock handlers
   - `/mocks/handlers/telemetry.ts` - WebSocket stream endpoints
   - `/mocks/factories/equipment.ts` - Equipment status factory
   - `/mocks/factories/sensors.ts` - Sensor data generators
   - `/mocks/factories/alerts.ts` - Alert pattern generation

3. Build realistic telemetry generators
   - Pressure patterns (normal operation, spikes, degradation)
   - Temperature cycles (startup, operating, cooldown)
   - Flow rate variations
   - Contamination level progression
   - Equipment state transitions
   - Failure mode simulations

4. WebSocket mock scenarios
   - Real-time sensor streams (100ms intervals)
   - Alert triggering patterns
   - Connection loss/recovery
   - Data burst scenarios
   - Offline queue simulation

5. Industrial data patterns
   ```typescript
   // Hydraulic pressure with realistic noise
   generatePressureData({
     baseline: 2000, // psi
     noise: 50,
     spikeProbability: 0.02,
     degradationRate: 0.001
   })
   ```

**Decision**: MSW with WebSocket support for real-time simulation

### 16:00-17:00: Industrial Reference Components
**Goal**: Build fleet-specific components that establish industrial UI patterns

**Components to Build**:
1. **EquipmentStatusCard** (`/components/fleet/EquipmentStatusCard.tsx`)
   - Real-time status indicator with WebSocket updates
   - Operational/Warning/Critical states
   - Last update timestamp
   - Mini telemetry sparkline

2. **TelemetryGauge** (`/components/telemetry/TelemetryGauge.tsx`)
   - Circular gauge for pressure/temperature
   - Threshold indicators (normal/warning/critical zones)
   - Real-time value updates
   - Historical min/max markers

3. **AlertNotification** (`/components/alerts/AlertNotification.tsx`)
   - Priority-based styling (critical = red pulse)
   - Acknowledgment actions
   - Time since alert triggered
   - Equipment reference link

4. **MetricTrend** (`/components/telemetry/MetricTrend.tsx`)
   - Tremor AreaChart for time-series
   - 24-hour rolling window
   - Threshold line overlays
   - Zoom/pan for analysis

5. **OfflineIndicator** (`/components/system/OfflineIndicator.tsx`)
   - Connection status badge
   - Queue size when offline
   - Last sync timestamp
   - Retry connection action

**Each component must demonstrate**:
- Real-time data binding
- Industrial design patterns
- Offline resilience
- Alert state handling

### 17:00-17:30: Documentation & Handoff
**Goal**: Enable team to work independently on fleet features

**Create documentation**:
1. `/docs/FLEET-STATE.md` - Real-time state management patterns
2. `/docs/TELEMETRY-MOCKS.md` - How to simulate sensor data
3. `/docs/INDUSTRIAL-COMPONENTS.md` - Fleet UI patterns
4. `/docs/OFFLINE-FIRST.md` - PWA setup guide for Day 3

**Final checklist**:
- [ ] WebSocket connection tested
- [ ] Telemetry mock streams working
- [ ] Industrial theme applied
- [ ] Real-time components updating
- [ ] Offline queue implemented

## Critical Decisions Log

### Fleet-Aware Foundation Strategy
**Consensus Decision**: Hybrid approach - modify all foundations to be fleet-aware (8/10 confidence)
**Models**: GPT-4o, Claude Opus 4, DeepSeek all agreed
**Rationale**: 
- Prevents 40-50% rework vs generic approach
- Industry best practice (Samsara, Geotab examples)
- 20% more effort now saves 50% refactoring later

### Industrial Theme Architecture
**Decision**: Fleet-specific CSS layers and namespaces
- `--fleet-*` for industrial variables
- `--status-*` for equipment states
- `--telemetry-*` for data visualization
**Rationale**: Clear separation, industrial overrides, maintains compatibility

### Real-Time State Management
**Decision**: WebSocket-first with Zustand middleware
- **Zustand**: Real-time telemetry, equipment status, alerts
- **TanStack Query**: Historical data, time-series caching
- **IndexedDB**: Offline queue (via Zustand persist)
**Rationale**: Native WebSocket support, simpler than MQTT for MVP

### Telemetry Mock Strategy
**Decision**: MSW with industrial data generators
- Realistic sensor patterns (pressure, temperature, flow)
- Equipment state transitions
- Failure mode simulations
**Rationale**: Enables realistic development without backend

## Success Metrics

### Morning (12:00)
- [ ] Fleet theme with industrial colors applied
- [ ] Equipment status design tokens working
- [ ] Alert animations functional
- [ ] High contrast mode tested

### Afternoon (15:00)  
- [ ] WebSocket connection established
- [ ] Real-time telemetry in Zustand
- [ ] Offline queue persisting to IndexedDB
- [ ] TanStack Query handling time-series

### End of Day (17:30)
- [ ] Telemetry mock streams active
- [ ] 5 industrial components working
- [ ] Real-time updates visible
- [ ] PWA foundation ready for Day 3

## Risk Mitigation

### If Behind Schedule
- **10:30**: Focus on status colors only
- **14:00**: Basic WebSocket without offline queue
- **16:00**: Build 3 critical components (Status, Gauge, Alert)
- **17:00**: Document patterns over implementation

### Technical Risks
1. **WebSocket complexity**
   - Mitigation: Start with polling, upgrade to WebSocket
   - Fallback: Server-Sent Events (SSE)
   
2. **Real-time performance**
   - Mitigation: Throttle updates to 1Hz
   - Use React.memo aggressively

3. **Offline sync complexity**
   - Mitigation: Simple last-write-wins for MVP
   - Defer conflict resolution UI

### Fleet-Specific Risks
1. **Industrial UI learning curve**
   - Mitigation: Reference Samsara/Geotab UIs
   - Use existing gauge libraries (react-gauge-chart)

2. **Telemetry data volume**
   - Mitigation: Limit mock data to 100 sensors
   - Implement data windowing early

## Team Coordination

### Required Skills
- WebSocket implementation
- Real-time state management
- Industrial UI patterns
- Time-series data handling

### Handoff Materials
- Fleet component examples
- Telemetry mock patterns
- WebSocket connection guide
- Industrial design tokens

## Dependencies for Day 3

Day 2 must deliver for fleet management MVP:
1. Fleet-aware theme system with industrial tokens
2. Real-time state management with WebSocket setup
3. Telemetry mock infrastructure
4. 5 industrial reference components
5. Basic offline queue in IndexedDB

This enables Day 3 fleet development:
- Team A: PWA service worker setup
- Team B: Fleet dashboard ("God view")
- Team C: Equipment detail pages

## PWA Foundation (Critical for Day 3)

**Why PWA is Critical**: Field operators often work in areas with poor connectivity. DeepSeek emphasized that "PWA requires service worker setup in Week 1-2" to avoid timeline risks.

**Day 2 PWA Prep**:
```bash
# Install PWA dependencies
pnpm add -D next-pwa workbox-webpack-plugin
pnpm add idb # For IndexedDB wrapper
```

**Basic Offline Queue Setup**:
```typescript
// /lib/offline/queue.ts
import { openDB } from 'idb';

export const offlineQueue = {
  async addToQueue(action: any) {
    const db = await openDB('fleetops-offline', 1);
    await db.add('queue', { ...action, timestamp: Date.now() });
  },
  
  async syncQueue() {
    // Day 3 will implement full sync
  }
};
```

## Detailed Implementation Guide

### 9:00-10:30: Fleet-Aware Theme System Implementation

#### 1. Create Theme Context and Provider
```tsx
// lib/theme/fleet-theme-context.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type FleetTheme = 'light' | 'dark' | 'high-contrast';
type StatusLevel = 'operational' | 'warning' | 'critical' | 'offline';

interface FleetThemeContext {
  theme: FleetTheme;
  setTheme: (theme: FleetTheme) => void;
  statusColors: Record<StatusLevel, string>;
}

const ThemeContext = createContext<FleetThemeContext | null>(null);

export const FleetThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<FleetTheme>('light');
  
  const statusColors: Record<StatusLevel, string> = {
    operational: 'hsl(var(--fleet-status-operational))',
    warning: 'hsl(var(--fleet-status-warning))',
    critical: 'hsl(var(--fleet-status-critical))',
    offline: 'hsl(var(--fleet-status-offline))'
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(theme);
    
    // Update CSS variables for industrial theme
    if (theme === 'high-contrast') {
      root.style.setProperty('--fleet-contrast-ratio', '7:1');
    } else {
      root.style.setProperty('--fleet-contrast-ratio', '4.5:1');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, statusColors }}>
      <div className={`fleet-theme ${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useFleetTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useFleetTheme must be used within FleetThemeProvider');
  return context;
};
```

#### 2. Tailwind Configuration for Fleet Theme
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        fleet: {
          // Status colors
          'status-operational': 'hsl(var(--fleet-status-operational) / <alpha-value>)',
          'status-warning': 'hsl(var(--fleet-status-warning) / <alpha-value>)',
          'status-critical': 'hsl(var(--fleet-status-critical) / <alpha-value>)',
          'status-offline': 'hsl(var(--fleet-status-offline) / <alpha-value>)',
          
          // Telemetry colors
          'telemetry-pressure': 'hsl(var(--fleet-telemetry-pressure) / <alpha-value>)',
          'telemetry-temperature': 'hsl(var(--fleet-telemetry-temperature) / <alpha-value>)',
          'telemetry-flow': 'hsl(var(--fleet-telemetry-flow) / <alpha-value>)',
        }
      },
      animation: {
        'pulse-critical': 'pulse-critical 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'status-transition': 'status-transition 0.3s ease-in-out',
      },
      keyframes: {
        'pulse-critical': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5, transform: 'scale(1.05)' }
        }
      }
    },
  },
  plugins: [
    function({ addBase }) {
      addBase({
        ':root': {
          '--fleet-status-operational': '142 71% 45%',
          '--fleet-status-warning': '38 92% 50%',
          '--fleet-status-critical': '0 84% 60%',
          '--fleet-status-offline': '0 0% 45%',
          '--fleet-telemetry-pressure': '217 91% 60%',
          '--fleet-telemetry-temperature': '12 76% 61%',
          '--fleet-telemetry-flow': '173 58% 39%',
        },
        '.dark': {
          '--fleet-status-operational': '142 71% 55%',
          '--fleet-status-warning': '38 92% 65%',
          '--fleet-status-critical': '0 84% 70%',
          '--fleet-status-offline': '0 0% 60%',
        }
      });
    }
  ],
};
```

#### 3. Global Styles for Fleet Theme
```css
/* styles/fleet-theme.css */
@layer fleet {
  .fleet-theme {
    @apply transition-colors duration-300;
  }
  
  /* Status indicators */
  .status-indicator {
    @apply relative inline-flex h-3 w-3 rounded-full;
  }
  
  .status-indicator.operational {
    @apply bg-fleet-status-operational;
  }
  
  .status-indicator.critical {
    @apply bg-fleet-status-critical animate-pulse-critical;
  }
  
  /* Alert states */
  .alert-critical {
    @apply border-fleet-status-critical bg-fleet-status-critical/10;
    @apply shadow-lg shadow-fleet-status-critical/20;
  }
  
  /* High contrast mode */
  .high-contrast {
    @apply font-medium;
    
    button, .card {
      @apply border-2;
    }
  }
}
```

### 10:30-12:00: Industrial Design System Implementation

#### 1. Create Design Token Documentation
```typescript
// lib/design-tokens/fleet-tokens.ts
export const fleetTokens = {
  colors: {
    status: {
      operational: { light: '#16a34a', dark: '#22c55e' },
      warning: { light: '#f59e0b', dark: '#fbbf24' },
      critical: { light: '#dc2626', dark: '#ef4444' },
      offline: { light: '#6b7280', dark: '#9ca3af' }
    },
    telemetry: {
      pressure: { primary: '#3b82f6', secondary: '#60a5fa' },
      temperature: { primary: '#f97316', secondary: '#fb923c' },
      flow: { primary: '#10b981', secondary: '#34d399' }
    }
  },
  spacing: {
    dashboard: {
      cardGap: '1rem',
      sectionGap: '2rem',
      compact: '0.5rem'
    }
  },
  typography: {
    telemetry: {
      value: 'font-mono text-2xl font-bold',
      unit: 'text-sm text-muted-foreground',
      label: 'text-xs uppercase tracking-wider'
    }
  }
};
```

#### 2. Create Fleet Component Variants
```tsx
// components/ui/fleet-variants.ts
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
```

### 13:00-14:30: Real-Time State Management Implementation

#### 1. Create Telemetry Store with WebSocket
```typescript
// stores/telemetry-store.ts
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface SensorData {
  id: string;
  value: number;
  unit: string;
  timestamp: number;
  status: 'normal' | 'warning' | 'critical';
}

interface TelemetryState {
  sensors: Record<string, SensorData>;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  ws: WebSocket | null;
  
  // Actions
  connect: (url: string) => void;
  disconnect: () => void;
  updateSensor: (data: SensorData) => void;
  setConnectionStatus: (status: TelemetryState['connectionStatus']) => void;
}

export const useTelemetryStore = create<TelemetryState>()(
  subscribeWithSelector((set, get) => ({
    sensors: {},
    connectionStatus: 'disconnected',
    ws: null,
    
    connect: (url: string) => {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        set({ connectionStatus: 'connected', ws });
        console.log('WebSocket connected');
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        get().updateSensor(data);
      };
      
      ws.onerror = () => {
        set({ connectionStatus: 'error' });
      };
      
      ws.onclose = () => {
        set({ connectionStatus: 'disconnected', ws: null });
        // Implement reconnection logic
        setTimeout(() => get().connect(url), 5000);
      };
      
      set({ ws, connectionStatus: 'connecting' });
    },
    
    disconnect: () => {
      const { ws } = get();
      if (ws) {
        ws.close();
        set({ ws: null, connectionStatus: 'disconnected' });
      }
    },
    
    updateSensor: (data: SensorData) => {
      set((state) => ({
        sensors: {
          ...state.sensors,
          [data.id]: data
        }
      }));
    },
    
    setConnectionStatus: (status) => set({ connectionStatus: status })
  }))
);
```

#### 2. Create Alert Store
```typescript
// stores/alert-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Alert {
  id: string;
  equipmentId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  acknowledged: boolean;
}

interface AlertState {
  alerts: Alert[];
  unreadCount: number;
  
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>) => void;
  acknowledgeAlert: (id: string) => void;
  clearAlert: (id: string) => void;
  clearAllAlerts: () => void;
}

export const useAlertStore = create<AlertState>()(
  persist(
    (set) => ({
      alerts: [],
      unreadCount: 0,
      
      addAlert: (alertData) => {
        const alert: Alert = {
          ...alertData,
          id: `alert-${Date.now()}`,
          timestamp: Date.now(),
          acknowledged: false
        };
        
        set((state) => ({
          alerts: [alert, ...state.alerts],
          unreadCount: state.unreadCount + 1
        }));
      },
      
      acknowledgeAlert: (id) => {
        set((state) => ({
          alerts: state.alerts.map(alert =>
            alert.id === id ? { ...alert, acknowledged: true } : alert
          ),
          unreadCount: Math.max(0, state.unreadCount - 1)
        }));
      },
      
      clearAlert: (id) => {
        set((state) => ({
          alerts: state.alerts.filter(alert => alert.id !== id)
        }));
      },
      
      clearAllAlerts: () => {
        set({ alerts: [], unreadCount: 0 });
      }
    }),
    {
      name: 'fleet-alerts'
    }
  )
);
```

#### 3. Create TanStack Query Configuration
```typescript
// lib/api/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000, // 1 second for real-time data
      cacheTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 3;
      }
    }
  }
});

// Telemetry hooks
export const telemetryKeys = {
  all: ['telemetry'] as const,
  equipment: (id: string) => [...telemetryKeys.all, 'equipment', id] as const,
  historical: (id: string, range: string) => 
    [...telemetryKeys.equipment(id), 'historical', range] as const
};
```

### 14:30-16:00: Telemetry Mock Infrastructure Implementation

#### 1. Create Mock Data Generators
```typescript
// mocks/generators/telemetry-generator.ts
export class TelemetryGenerator {
  private baseValues: Record<string, number> = {};
  
  generatePressureData(sensorId: string, baseline = 2000) {
    if (!this.baseValues[sensorId]) {
      this.baseValues[sensorId] = baseline;
    }
    
    // Simulate realistic pressure variations
    const noise = (Math.random() - 0.5) * 50;
    const drift = (Math.random() - 0.5) * 2;
    const spike = Math.random() < 0.02 ? (Math.random() * 200) : 0;
    
    this.baseValues[sensorId] += drift;
    const value = Math.max(0, this.baseValues[sensorId] + noise + spike);
    
    return {
      id: sensorId,
      value: Math.round(value),
      unit: 'psi',
      timestamp: Date.now(),
      status: this.getStatus(value, { normal: [1800, 2200], warning: [1600, 2400] })
    };
  }
  
  generateTemperatureData(sensorId: string, baseline = 75) {
    if (!this.baseValues[sensorId]) {
      this.baseValues[sensorId] = baseline;
    }
    
    // Temperature follows a sine wave pattern (daily cycle)
    const hour = new Date().getHours();
    const dailyCycle = Math.sin((hour / 24) * 2 * Math.PI) * 10;
    const noise = (Math.random() - 0.5) * 5;
    
    const value = this.baseValues[sensorId] + dailyCycle + noise;
    
    return {
      id: sensorId,
      value: Math.round(value * 10) / 10,
      unit: '°C',
      timestamp: Date.now(),
      status: this.getStatus(value, { normal: [60, 90], warning: [50, 100] })
    };
  }
  
  private getStatus(
    value: number, 
    thresholds: { normal: [number, number], warning: [number, number] }
  ): 'normal' | 'warning' | 'critical' {
    if (value >= thresholds.normal[0] && value <= thresholds.normal[1]) {
      return 'normal';
    } else if (value >= thresholds.warning[0] && value <= thresholds.warning[1]) {
      return 'warning';
    }
    return 'critical';
  }
}
```

#### 2. Create MSW Handlers
```typescript
// mocks/handlers/telemetry-handlers.ts
import { rest } from 'msw';
import { TelemetryGenerator } from '../generators/telemetry-generator';

const generator = new TelemetryGenerator();

export const telemetryHandlers = [
  // REST endpoint for historical data
  rest.get('/api/telemetry/:equipmentId/historical', (req, res, ctx) => {
    const { equipmentId } = req.params;
    const range = req.url.searchParams.get('range') || '24h';
    
    // Generate historical data points
    const dataPoints = [];
    const now = Date.now();
    const interval = 60000; // 1 minute intervals
    const points = range === '24h' ? 1440 : 168; // 24h or 7d
    
    for (let i = points; i >= 0; i--) {
      dataPoints.push({
        timestamp: now - (i * interval),
        pressure: generator.generatePressureData(`${equipmentId}-pressure`).value,
        temperature: generator.generateTemperatureData(`${equipmentId}-temp`).value
      });
    }
    
    return res(ctx.json({ data: dataPoints }));
  }),
  
  // REST endpoint for current values
  rest.get('/api/telemetry/:equipmentId/current', (req, res, ctx) => {
    const { equipmentId } = req.params;
    
    return res(ctx.json({
      pressure: generator.generatePressureData(`${equipmentId}-pressure`),
      temperature: generator.generateTemperatureData(`${equipmentId}-temp`),
      flow: generator.generateFlowData(`${equipmentId}-flow`)
    }));
  })
];

// WebSocket mock server (separate file)
// mocks/websocket-server.ts
import { Server } from 'mock-socket';
import { TelemetryGenerator } from '../generators/telemetry-generator';

export function createMockWebSocketServer() {
  const mockServer = new Server('ws://localhost:3001/telemetry');
  const generator = new TelemetryGenerator();
  
  mockServer.on('connection', socket => {
    console.log('Client connected to mock WebSocket');
    
    // Send telemetry data every 100ms
    const interval = setInterval(() => {
      const data = {
        type: 'telemetry',
        equipmentId: 'excavator-001',
        sensors: {
          pressure: generator.generatePressureData('pressure-001'),
          temperature: generator.generateTemperatureData('temp-001')
        }
      };
      
      socket.send(JSON.stringify(data));
    }, 100);
    
    socket.on('close', () => {
      clearInterval(interval);
    });
  });
  
  return mockServer;
}
```

### 16:00-17:00: Industrial Reference Components Implementation

#### 1. Equipment Status Card
```tsx
// components/fleet/EquipmentStatusCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { statusBadgeVariants } from '@/components/ui/fleet-variants';
import { useTelemetryStore } from '@/stores/telemetry-store';
import { Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EquipmentStatusCardProps {
  equipmentId: string;
  name: string;
  type: string;
}

export function EquipmentStatusCard({ equipmentId, name, type }: EquipmentStatusCardProps) {
  const sensors = useTelemetryStore(state => 
    Object.values(state.sensors).filter(s => s.id.includes(equipmentId))
  );
  
  const overallStatus = sensors.reduce((acc, sensor) => {
    if (sensor.status === 'critical') return 'critical';
    if (sensor.status === 'warning' && acc !== 'critical') return 'warning';
    return acc;
  }, 'operational' as any);
  
  const StatusIcon = {
    operational: CheckCircle,
    warning: AlertTriangle,
    critical: XCircle,
    offline: XCircle
  }[overallStatus];
  
  return (
    <Card className={cn(
      'transition-all hover:shadow-lg',
      overallStatus === 'critical' && 'border-fleet-status-critical animate-pulse-critical'
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg">{name}</CardTitle>
          <p className="text-sm text-muted-foreground">{type}</p>
        </div>
        <div className={cn(statusBadgeVariants({ status: overallStatus }))}>
          <StatusIcon className="mr-1 h-3 w-3" />
          {overallStatus}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sensors.map(sensor => (
            <div key={sensor.id} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{sensor.id.split('-')[1]}</span>
              <span className="font-mono font-medium">
                {sensor.value} {sensor.unit}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center text-xs text-muted-foreground">
          <Activity className="mr-1 h-3 w-3" />
          Last update: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}
```

#### 2. Telemetry Gauge Component
```tsx
// components/telemetry/TelemetryGauge.tsx
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TelemetryGaugeProps {
  value: number;
  min: number;
  max: number;
  unit: string;
  label: string;
  thresholds?: {
    warning: number;
    critical: number;
  };
  className?: string;
}

export function TelemetryGauge({
  value,
  min,
  max,
  unit,
  label,
  thresholds,
  className
}: TelemetryGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    // Draw background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.75, Math.PI * 2.25);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 20;
    ctx.stroke();
    
    // Calculate value position
    const percentage = (value - min) / (max - min);
    const angle = Math.PI * 0.75 + (Math.PI * 1.5 * percentage);
    
    // Determine color based on thresholds
    let color = '#10b981'; // green
    if (thresholds) {
      if (value >= thresholds.critical) {
        color = '#ef4444'; // red
      } else if (value >= thresholds.warning) {
        color = '#f59e0b'; // yellow
      }
    }
    
    // Draw value arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.75, angle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 20;
    ctx.stroke();
    
    // Draw value text
    ctx.font = 'bold 32px monospace';
    ctx.fillStyle = '#1f2937';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(value.toString(), centerX, centerY - 10);
    
    // Draw unit text
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText(unit, centerX, centerY + 20);
    
    // Draw label
    ctx.font = '14px sans-serif';
    ctx.fillText(label, centerX, centerY + 50);
  }, [value, min, max, unit, label, thresholds]);
  
  return (
    <div className={cn('relative', className)}>
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        className="w-full h-full"
      />
    </div>
  );
}
```

#### 3. Alert Notification Component
```tsx
// components/alerts/AlertNotification.tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAlertStore } from '@/stores/alert-store';
import { AlertTriangle, Bell, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AlertNotification() {
  const { alerts, acknowledgeAlert, clearAlert } = useAlertStore();
  const activeAlerts = alerts.filter(a => !a.acknowledged).slice(0, 3);
  
  if (activeAlerts.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 w-96 space-y-2 z-50">
      {activeAlerts.map(alert => (
        <Alert
          key={alert.id}
          className={cn(
            'relative',
            alert.severity === 'critical' && 'border-fleet-status-critical bg-fleet-status-critical/5',
            alert.severity === 'high' && 'border-fleet-status-warning bg-fleet-status-warning/5'
          )}
        >
          <div className="flex items-start">
            <AlertTriangle className={cn(
              'h-4 w-4 mr-2',
              alert.severity === 'critical' && 'text-fleet-status-critical animate-pulse',
              alert.severity === 'high' && 'text-fleet-status-warning'
            )} />
            <div className="flex-1">
              <AlertTitle className="text-sm font-medium">
                Equipment Alert - {alert.severity.toUpperCase()}
              </AlertTitle>
              <AlertDescription className="text-xs mt-1">
                {alert.message}
              </AlertDescription>
              <div className="mt-2 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="text-xs"
                >
                  Acknowledge
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => clearAlert(alert.id)}
                  className="text-xs"
                >
                  Dismiss
                </Button>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={() => clearAlert(alert.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </Alert>
      ))}
    </div>
  );
}
```

#### 4. Offline Indicator Component
```tsx
// components/system/OfflineIndicator.tsx
import { Badge } from '@/components/ui/badge';
import { useTelemetryStore } from '@/stores/telemetry-store';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Cloud, CloudOff, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const connectionStatus = useTelemetryStore(state => state.connectionStatus);
  const connect = useTelemetryStore(state => state.connect);
  
  const getStatusConfig = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        text: 'Offline',
        color: 'bg-fleet-status-offline',
        pulse: false
      };
    }
    
    switch (connectionStatus) {
      case 'connecting':
        return {
          icon: RefreshCw,
          text: 'Connecting...',
          color: 'bg-fleet-status-warning',
          pulse: true
        };
      case 'connected':
        return {
          icon: Cloud,
          text: 'Connected',
          color: 'bg-fleet-status-operational',
          pulse: false
        };
      case 'error':
        return {
          icon: CloudOff,
          text: 'Connection Error',
          color: 'bg-fleet-status-critical',
          pulse: true
        };
      default:
        return {
          icon: CloudOff,
          text: 'Disconnected',
          color: 'bg-fleet-status-offline',
          pulse: false
        };
    }
  };
  
  const config = getStatusConfig();
  const Icon = config.icon;
  
  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className={cn(
          'flex items-center gap-1.5 px-2 py-1',
          config.pulse && 'animate-pulse'
        )}
      >
        <div className={cn('h-2 w-2 rounded-full', config.color)} />
        <Icon className="h-3 w-3" />
        <span className="text-xs">{config.text}</span>
      </Badge>
      
      {connectionStatus === 'error' && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => connect(process.env.NEXT_PUBLIC_WS_URL!)}
          className="h-7 text-xs"
        >
          Retry
        </Button>
      )}
    </div>
  );
}
```

### Testing Approach

#### 1. Theme Testing
```typescript
// __tests__/theme/fleet-theme.test.tsx
import { render, screen } from '@testing-library/react';
import { FleetThemeProvider, useFleetTheme } from '@/lib/theme/fleet-theme-context';

describe('FleetThemeProvider', () => {
  it('provides theme context', () => {
    const TestComponent = () => {
      const { theme, statusColors } = useFleetTheme();
      return (
        <div>
          <span data-testid="theme">{theme}</span>
          <span data-testid="operational">{statusColors.operational}</span>
        </div>
      );
    };
    
    render(
      <FleetThemeProvider>
        <TestComponent />
      </FleetThemeProvider>
    );
    
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(screen.getByTestId('operational')).toBeTruthy();
  });
});
```

#### 2. WebSocket Testing
```typescript
// __tests__/stores/telemetry-store.test.ts
import { renderHook, act } from '@testing-library/react';
import { useTelemetryStore } from '@/stores/telemetry-store';
import WS from 'jest-websocket-mock';

describe('TelemetryStore', () => {
  let server: WS;
  
  beforeEach(() => {
    server = new WS('ws://localhost:3001/telemetry');
  });
  
  afterEach(() => {
    WS.clean();
  });
  
  it('connects to WebSocket and receives data', async () => {
    const { result } = renderHook(() => useTelemetryStore());
    
    act(() => {
      result.current.connect('ws://localhost:3001/telemetry');
    });
    
    await server.connected;
    expect(result.current.connectionStatus).toBe('connected');
    
    // Send mock telemetry data
    server.send(JSON.stringify({
      id: 'sensor-1',
      value: 100,
      unit: 'psi',
      timestamp: Date.now(),
      status: 'normal'
    }));
    
    expect(result.current.sensors['sensor-1']).toBeTruthy();
    expect(result.current.sensors['sensor-1'].value).toBe(100);
  });
});
```

### Integration Points

#### 1. App-level Integration
```tsx
// app/layout.tsx
import { FleetThemeProvider } from '@/lib/theme/fleet-theme-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlertNotification } from '@/components/alerts/AlertNotification';
import { OfflineIndicator } from '@/components/system/OfflineIndicator';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <FleetThemeProvider>
            <div className="min-h-screen">
              <header className="border-b">
                <div className="container flex items-center justify-between py-4">
                  <h1 className="text-xl font-bold">FleetOps</h1>
                  <OfflineIndicator />
                </div>
              </header>
              <main>{children}</main>
              <AlertNotification />
            </div>
          </FleetThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

#### 2. Dashboard Integration
```tsx
// app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useTelemetryStore } from '@/stores/telemetry-store';
import { EquipmentStatusCard } from '@/components/fleet/EquipmentStatusCard';
import { TelemetryGauge } from '@/components/telemetry/TelemetryGauge';

export default function Dashboard() {
  const connect = useTelemetryStore(state => state.connect);
  const sensors = useTelemetryStore(state => state.sensors);
  
  useEffect(() => {
    connect(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/telemetry');
  }, [connect]);
  
  return (
    <div className="container py-8">
      <h2 className="text-2xl font-bold mb-6">Fleet Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EquipmentStatusCard
          equipmentId="excavator-001"
          name="Excavator 001"
          type="Hydraulic Excavator"
        />
        
        {/* Add more equipment cards */}
      </div>
      
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.values(sensors).map(sensor => (
          <TelemetryGauge
            key={sensor.id}
            value={sensor.value}
            min={0}
            max={sensor.unit === 'psi' ? 3000 : 150}
            unit={sensor.unit}
            label={sensor.id}
            thresholds={{
              warning: sensor.unit === 'psi' ? 2400 : 90,
              critical: sensor.unit === 'psi' ? 2800 : 110
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

---
*Created: 2025-07-05*  
*Updated: Post-consensus with fleet-aware modifications and detailed implementation*
*Status: Ready for fleet management implementation with concrete code examples*