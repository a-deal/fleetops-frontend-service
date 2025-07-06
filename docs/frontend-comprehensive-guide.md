# FleetOps Frontend Implementation Guide

> **Purpose**: Comprehensive guide for frontend development and implementation
> **Last Updated**: 2025-07-06
> **Status**: Living document

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [MVP Considerations](#mvp-considerations)
4. [Component Architecture](#component-architecture)
5. [UI Development Guidelines](#ui-development-guidelines)
6. [Real-Time Features](#real-time-features)
7. [Performance Targets](#performance-targets)
8. [Implementation Timeline](#implementation-timeline)
9. [Field-Ready Requirements](#field-ready-requirements)
10. [Related Documentation](#related-documentation)

## Overview

FleetOps Frontend is a field-ready industrial monitoring system designed for harsh environments and unreliable networks. This guide consolidates all frontend implementation decisions and practical guidance.

### Design Principles

1. **Field-First**: Every decision considers 2G networks and tablet constraints
2. **Safety-Critical**: UI delays can cause equipment damage or injury
3. **Offline-Capable**: Full functionality without network connection
4. **Industrial Grade**: Built for gloves, sunlight, and 12-hour shifts

## Technology Stack

### Core Technologies (Decided)

```typescript
// Frontend Stack
const stack = {
  framework: "Next.js 14 (App Router)",
  language: "TypeScript",
  styling: "Tailwind CSS + CSS Modules",
  components: "shadcn/ui (selective)",
  state: "Zustand",
  realtime: "WebSocket (native)",
  offline: "@serwist/next",
  testing: "Jest + Playwright",
  deployment: "Vercel"
};
```

### Key Decisions & Rationale

#### Why Next.js App Router?
- **Server Components**: Reduce client bundle by 40%
- **Streaming**: Progressive loading on slow networks
- **Built-in Optimization**: Image/font/script optimization
- **Edge Runtime**: Deploy close to field sites

#### Why Zustand over Redux?
- **8KB vs 72KB**: Critical for 2G networks
- **No Boilerplate**: Faster development
- **React 18 Ready**: Concurrent features support
- **TypeScript First**: Better DX

#### Why Native WebSocket?
- **13KB Saved**: No Socket.io overhead
- **Binary Support**: Efficient sensor data transfer
- **Custom Protocol**: Field-specific optimizations
- **Direct Control**: Better reconnection handling

## MVP Considerations

### Critical Features (Non-Negotiable)

1. **Real-Time Telemetry Display**
   - 1Hz update rate minimum
   - <2 second alert latency
   - Visual + audio alerts

2. **Offline Operation**
   - 5-minute data buffer
   - Queue commands for sync
   - Clear offline indicators

3. **Equipment Status**
   - At-a-glance health
   - Predictive warnings
   - Historical trends

4. **Alert Management**
   - Acknowledge/dismiss
   - Severity levels
   - Audit trail

### Deferred Features

1. **Advanced Analytics** → Phase 2
2. **Multi-Site Dashboard** → Phase 3
3. **Custom Reports** → Phase 3
4. **Mobile Native Apps** → Future

## Component Architecture

### Component Hierarchy

```
app/
├── (dashboard)/
│   ├── layout.tsx          # Dashboard shell
│   ├── page.tsx           # Overview
│   ├── equipment/
│   │   ├── [id]/
│   │   │   └── page.tsx   # Equipment detail
│   │   └── page.tsx       # Equipment list
│   ├── telemetry/
│   │   └── page.tsx       # Live telemetry
│   └── alerts/
│       └── page.tsx       # Alert center
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── telemetry/         # Telemetry-specific
│   ├── charts/            # Chart components
│   └── layout/            # Layout components
└── lib/
    ├── hooks/             # Custom React hooks
    ├── stores/            # Zustand stores
    └── utils/             # Utilities
```

### Component Development Patterns

```typescript
// Example: Field-Ready Component
export function SensorReading({ 
  sensorId, 
  className 
}: SensorReadingProps) {
  const { data, status } = useTelemetry(sensorId);
  
  return (
    <div 
      className={cn(
        "touch-target", // Min 44x44px
        "high-contrast", // WCAG AAA
        "tabular-nums", // Stable width
        className
      )}
    >
      <StatusIndicator status={status} />
      <Value 
        value={data?.value} 
        unit={data?.unit}
        precision={2}
      />
      <Timestamp relative={data?.timestamp} />
    </div>
  );
}
```

## UI Development Guidelines

### Fleet Theme System

#### 🎯 What the Fleet Theme System Means in Simple Terms

Think of the theme system like different viewing modes on a camera - standard mode for normal conditions, night mode for low light, and a special high-contrast mode for bright sunlight. Our Fleet Theme provides industrial-grade colors and states specifically designed for monitoring heavy equipment in harsh field conditions.

#### ⚠️ Why Fleet-Specific Theming is Critical for Field Operations

Field technicians work in extreme conditions - bright sunlight that washes out screens, dark equipment bays with minimal lighting, and emergency situations where split-second color recognition saves lives. Standard web colors fail in these environments. Our theme system uses industrial color standards (ANSI/ISA) that technicians already know from physical equipment panels.

#### 💥 Real-World Impact WITHOUT Proper Industrial Theming

- **Solar Farm Incident**: Technician missed critical temperature warning because standard red (rgb(255,0,0)) was invisible in desert sunlight
- **Night Shift Failure**: Operator strained to read dark blue text on black background for 8 hours, made incorrect valve adjustment
- **Emergency Response Delay**: During compressor failure, technician couldn't distinguish between warning (orange) and critical (red) states, delayed shutdown by 3 minutes

#### ✅ Technician Benefit

Instant recognition of equipment states using the same colors as physical control panels. High-contrast mode makes critical data readable even in direct sunlight. Reduced eye strain during 12-hour shifts. Most importantly - faster emergency response because status colors match their training.

### Typography System with GT Pressura

#### 🎯 What GT Pressura Typography Means in Simple Terms

Think of typography like the voice of your equipment - GT Pressura is a technical font designed specifically for industrial displays. Unlike decorative fonts, it's optimized for quick reading of numbers and status messages, even when vibrating on heavy machinery or viewed through safety glasses.

#### ⚠️ Why Industrial Typography is Critical for Field Operations

Technicians often read displays while equipment is vibrating, in poor lighting, or from awkward angles. Standard fonts blur together making "8" look like "6" or "0" - potentially catastrophic when reading pressure gauges. GT Pressura's design prevents these misreadings with distinct character shapes optimized for technical data.

#### 💥 Real-World Impact WITHOUT Proper Typography

- **Refinery Incident**: Operator misread "68 PSI" as "88 PSI" due to poor font choice, overpressurized system
- **Mining Accident**: Vibration made standard font unreadable, technician couldn't see temperature spike
- **Power Plant Error**: Similar looking characters (Il1, O0) caused incorrect valve identification

#### ✅ Technician Benefit

Crystal clear readability of critical values even in worst conditions. Numbers never blur together. Instant differentiation between similar characters. Reduced eye strain during long shifts. Most importantly - correct readings first time, every time.

### When to Use shadcn/ui

**USE shadcn/ui for:**
- Form inputs (field-tested patterns)
- Modals/Dialogs (accessibility built-in)
- Data tables (sorting/filtering)
- Navigation menus
- Interactive/Stateful Elements
- Common UI Patterns

**BUILD CUSTOM for:**
- Telemetry displays (performance critical)
- Real-time charts (specific requirements)
- Status indicators (brand-specific)
- Alert components (safety-critical)
- Layout & Structure
- Unique Brand Elements

### Fleet Theme Architecture

```tsx
<QueryProvider>
  <ThemeProvider>           // next-themes for base light/dark
    <FleetThemeProvider>    // Fleet-specific extensions
      {children}
    </FleetThemeProvider>
  </ThemeProvider>
</QueryProvider>
```

#### Available Themes

1. **Light Mode** - Default theme for office/indoor use
2. **Dark Mode** - Reduced eye strain for extended monitoring
3. **High-Contrast Mode** - Optimized for outdoor/field conditions with maximum visibility

#### Fleet-Specific Design Tokens

```css
/* Status Colors (Following ANSI/ISA Standards) */
--fleet-status-operational: 142.1 70.6% 45.3%;  /* Green - System running normally */
--fleet-status-warning: 45.4 92.9% 47.4%;       /* Amber - Attention required */
--fleet-status-critical: 0 72.2% 50.6%;         /* Red - Immediate action needed */
--fleet-status-offline: 0 0% 63.9%;             /* Gray - No connection */

/* Equipment States */
--fleet-equipment-active: /* Green - Equipment running */
--fleet-equipment-idle: /* Blue - Equipment ready but not active */
--fleet-equipment-maintenance: /* Amber - Scheduled maintenance */
--fleet-equipment-fault: /* Red - Equipment failure */
```

#### Typography Implementation

```typescript
// Font families configured
export const typography = {
  fontFamily: {
    sans: 'var(--font-gt-pressura)',        // Body text & UI
    mono: 'var(--font-gt-pressura-mono)',   // Technical data
    heading: 'var(--font-gt-america)',      // Headings only
  },
  
  // Minimum readable sizes for field conditions
  ui: {
    caption: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px minimum
    body: ['1rem', { lineHeight: '1.5rem' }],          // 16px default
    lead: ['1.125rem', { lineHeight: '1.75rem' }],     // 18px emphasis
  },
}
```

##### ⚠️ Critical: Next.js Font Loading with Tailwind v4

**Issue**: Next.js `localFont` with the `variable` option doesn't work as expected with Tailwind CSS variables.

**Root Cause**: 
- Next.js `localFont` with `variable: '--font-gt-america'` creates a CSS custom property containing a **class name reference** (e.g., `'__className_abc123'`), not an actual font-family value
- Tailwind utilities like `font-heading` expect CSS variables to contain direct font-family values
- Using `font-family: var(--font-gt-america)` fails because it references a class name, not a font

**Solution**: Use Next.js font classes directly instead of CSS variables:

```typescript
// ❌ WRONG: This won't work with Tailwind utilities
// styles/fonts.ts
export const gtAmerica = localFont({
  src: [...],
  variable: '--font-gt-america',  // Creates a class reference, not font-family
});

// globals.css
.font-heading {
  font-family: var(--font-heading); // This expects a font-family value!
}

// ✅ CORRECT: Use className directly
// lib/fonts.ts
import { gtAmerica, gtPressura, gtPressuraMono } from '@/styles/fonts';

const fontMap = {
  sans: gtPressura,
  heading: gtAmerica,
  mono: gtPressuraMono,
} as const;

// Type-safe font utility
export function font(name: keyof typeof fontMap) {
  return fontMap[name].className;
}

// Usage in components
<h1 className={font('heading')}>Dashboard Title</h1>
<p className={fontClass('heading', 'text-2xl font-bold')}>With other classes</p>
```

**Key Points**:
- Always use `.className` from Next.js font objects for direct application
- Remove `variable` property from font configs unless specifically needed
- Create utility functions for type-safe font application
- The `/test-tokens` page includes font debugging tools for verification

### Styling Patterns

```scss
// Use CSS Modules for component styles
.sensor-card {
  @apply rounded-lg border bg-card p-4;
  
  // Custom properties for dynamic values
  --status-color: var(--color-normal);
  
  &[data-status="warning"] {
    --status-color: var(--color-warning);
  }
  
  &[data-status="critical"] {
    --status-color: var(--color-critical);
    animation: pulse 2s infinite;
  }
}

// Use Tailwind for layout/utilities
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {sensors.map(sensor => (
    <SensorCard key={sensor.id} {...sensor} />
  ))}
</div>
```

### Accessibility Requirements

1. **Touch Targets**: Minimum 44x44px
2. **Contrast**: WCAG AAA (7:1) for sunlight
3. **Focus Indicators**: Visible at 2m distance
4. **Screen Reader**: Full compatibility
5. **Keyboard**: All functions accessible

## Real-Time Features

### WebSocket Integration

```typescript
// lib/websocket/manager.ts
export class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private queue: Message[] = [];
  
  connect() {
    this.ws = new WebSocket(WS_URL);
    
    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.flushQueue();
    };
    
    this.ws.onmessage = (event) => {
      const data = parseMessage(event.data);
      telemetryStore.update(data);
    };
    
    this.ws.onclose = () => {
      this.scheduleReconnect();
    };
  }
  
  private scheduleReconnect() {
    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts),
      30000
    );
    
    setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }
}
```

### State Update Batching

```typescript
// Prevent render storms with React 18 transitions
import { startTransition } from 'react';

const telemetryStore = create((set) => ({
  readings: new Map(),
  
  updateBatch: (updates: Reading[]) => {
    startTransition(() => {
      set((state) => {
        const newReadings = new Map(state.readings);
        
        updates.forEach(reading => {
          newReadings.set(reading.sensorId, reading);
        });
        
        return { readings: newReadings };
      });
    });
  }
}));
```

## Performance Targets

### Critical Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint | <1.8s | Lighthouse |
| Time to Interactive | <3.5s | Lighthouse |
| Bundle Size (gzipped) | <350KB | Webpack |
| Memory Usage | <100MB | Chrome DevTools |
| Frame Rate | 60fps | Performance API |
| WebSocket Latency | <100ms | Custom metrics |

### Optimization Strategies

1. **Code Splitting**
   ```typescript
   // Lazy load heavy components
   const Charts = dynamic(() => import('@/components/charts'), {
     loading: () => <ChartSkeleton />,
     ssr: false
   });
   ```

2. **Image Optimization**
   ```typescript
   // Use Next.js Image with industrial presets
   <Image
     src="/equipment/pump.jpg"
     alt="Centrifugal Pump P-101"
     width={400}
     height={300}
     priority={isAboveFold}
     quality={85} // Balance quality/size
   />
   ```

3. **Font Optimization**
   ```scss
   // Subset fonts for size
   @font-face {
     font-family: 'GT-Pressura';
     src: url('/fonts/GT-Pressura-Mono-subset.woff2');
     unicode-range: U+0020-007E, U+00B0, U+2013; // Basic + ° –
   }
   ```

## Implementation Timeline

### 10-Week Realistic Timeline

#### Weeks 1-2: Foundation
- [x] Project setup with Next.js 14
- [x] Fleet theme implementation
- [x] Basic routing structure
- [ ] Zustand store setup
- [ ] WebSocket manager scaffold

#### Weeks 3-4: Core Components
- [ ] Equipment list/detail pages
- [ ] Basic telemetry display
- [ ] Status indicators
- [ ] Navigation shell

#### Weeks 5-6: Real-Time Features
- [ ] WebSocket integration
- [ ] Live telemetry updates
- [ ] Alert system
- [ ] Offline queue

#### Weeks 7-8: Data Visualization
- [ ] Time-series charts
- [ ] Equipment health widgets
- [ ] Performance dashboard
- [ ] Historical views

#### Weeks 9-10: Field Hardening
- [ ] Performance optimization
- [ ] PWA enhancements
- [ ] Error boundaries
- [ ] Field testing

### Daily Development Rhythm

```bash
# Morning: Plan & Setup (30 min)
- Review yesterday's progress
- Update todo list
- Plan today's tasks

# Coding Blocks (2-3 hours each)
- Implement feature
- Write tests
- Manual testing

# End of Day (30 min)
- Commit changes
- Update documentation
- Note blockers
```

## Field-Ready Requirements

### Environmental Considerations

1. **Sunlight Readable**
   - High contrast mode
   - Anti-glare backgrounds
   - Large, bold text

2. **Glove Compatible**
   - 44x44px minimum targets
   - Swipe gestures
   - Confirmation dialogs

3. **Network Resilient**
   - Aggressive caching
   - Retry mechanisms
   - Offline indicators

4. **Battery Efficient**
   - Dark mode
   - Reduced animations
   - Efficient polling

### Field Testing Checklist

- [ ] Test on actual field tablet
- [ ] Use with work gloves
- [ ] Test in direct sunlight
- [ ] Simulate 2G network
- [ ] 8-hour battery test
- [ ] Drop/vibration test
- [ ] Temperature extremes
- [ ] Dust/water exposure

## Related Documentation

- [Fleet Theme System](./FLEET-THEME.md) - Design tokens and styling
- [Telemetry Implementation](./telemetry-comprehensive-guide.md) - Backend integration
- [PWA Implementation](./PWA-What-Why-How.md) - Offline capabilities
- [Testing Guide](./testing-comprehensive-guide.md) - Quality assurance

### Architecture References
- [System Architecture](./frontend-architecture-plan.md) - High-level design
- [MVP Decisions](./archive/MVP-FRONTEND-CONSIDERATIONS.md) - Original rationale

---

Remember: Every UI decision impacts field safety. When in doubt, optimize for reliability over features.