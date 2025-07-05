# Fleet Theme System Documentation

## Overview

The Fleet Theme System provides industrial-grade design tokens and theme management specifically tailored for fleet management and industrial IoT applications. It extends the base theme system with fleet-specific colors, states, and a high-contrast mode for field conditions.

## Theme Architecture

### Provider Hierarchy

```tsx
<QueryProvider>
  <ThemeProvider>           // next-themes for base light/dark
    <FleetThemeProvider>    // Fleet-specific extensions
      {children}
    </FleetThemeProvider>
  </ThemeProvider>
</QueryProvider>
```

### Available Themes

1. **Light Mode** - Default theme for office/indoor use
2. **Dark Mode** - Reduced eye strain for extended monitoring
3. **High-Contrast Mode** - Optimized for outdoor/field conditions with maximum visibility

## Fleet-Specific Design Tokens

### Status Colors

Equipment and system status indicators following industrial standards:

```css
/* Light Mode */
--fleet-status-operational: 142.1 70.6% 45.3%;  /* Green - System running normally */
--fleet-status-warning: 45.4 92.9% 47.4%;       /* Amber - Attention required */
--fleet-status-critical: 0 72.2% 50.6%;         /* Red - Immediate action needed */
--fleet-status-offline: 0 0% 63.9%;             /* Gray - No connection */

/* Dark Mode - Increased brightness for visibility */
--fleet-status-operational: 142.1 70.6% 55.3%;
--fleet-status-warning: 45.4 92.9% 57.4%;
--fleet-status-critical: 0 72.2% 60.6%;
--fleet-status-offline: 0 0% 73.9%;
```

### Equipment States

Specific states for industrial equipment monitoring:

```css
--fleet-equipment-active: /* Green - Equipment running */
--fleet-equipment-idle: /* Blue - Equipment ready but not active */
--fleet-equipment-maintenance: /* Amber - Scheduled maintenance */
--fleet-equipment-fault: /* Red - Equipment failure */
```

### Alert Severity Levels

Progressive severity indicators for alert management:

```css
--fleet-alert-info: /* Blue - Informational */
--fleet-alert-warning: /* Amber - Warning condition */
--fleet-alert-error: /* Orange - Error state */
--fleet-alert-critical: /* Red - Critical failure */
```

### Telemetry Colors

Consistent colors for different sensor types:

```css
--fleet-telemetry-pressure: /* Blue - Pressure readings */
--fleet-telemetry-temperature: /* Red - Temperature data */
--fleet-telemetry-flow: /* Green - Flow rates */
--fleet-telemetry-vibration: /* Purple - Vibration levels */
```

## Using the Fleet Theme System

### Accessing Theme Context

```tsx
import { useFleetTheme } from '@/lib/theme/fleet-theme-context'

function MyComponent() {
  const { 
    theme,
    statusColors,
    equipmentStateColors,
    alertSeverityColors,
    isHighContrast,
    toggleHighContrast
  } = useFleetTheme()
  
  return (
    <div style={{ color: statusColors.operational }}>
      Equipment Status: Operational
    </div>
  )
}
```

### Status Indicators

```tsx
// Using status colors
<div className="flex items-center gap-2">
  <div className="h-3 w-3 rounded-full bg-[hsl(var(--fleet-status-operational))]" />
  <span>System Operational</span>
</div>

// Using Tailwind with CSS variables
<div className="text-[hsl(var(--fleet-status-warning))]">
  Warning: Maintenance Due
</div>
```

### High-Contrast Mode

The high-contrast mode is designed for field technicians working in bright outdoor conditions:

```tsx
function FieldModeToggle() {
  const { isHighContrast, toggleHighContrast } = useFleetTheme()
  
  return (
    <button onClick={toggleHighContrast}>
      {isHighContrast ? 'Standard View' : 'Field Mode'}
    </button>
  )
}
```

High-contrast mode features:
- Pure black background
- Pure white text
- Maximum color saturation for status indicators
- Increased border contrast
- Enhanced input field visibility

## Component Patterns

### Status Badge

```tsx
interface StatusBadgeProps {
  status: 'operational' | 'warning' | 'critical' | 'offline'
  label: string
}

function StatusBadge({ status, label }: StatusBadgeProps) {
  const { statusColors } = useFleetTheme()
  
  return (
    <div 
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-sm font-medium"
      style={{ 
        backgroundColor: `${statusColors[status]}20`,
        color: statusColors[status],
        borderColor: statusColors[status]
      }}
    >
      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: statusColors[status] }} />
      {label}
    </div>
  )
}
```

### Equipment Card

```tsx
function EquipmentCard({ equipment }) {
  const { equipmentStateColors } = useFleetTheme()
  
  return (
    <Card className="border-2" style={{ borderColor: equipmentStateColors[equipment.state] }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{equipment.name}</CardTitle>
          <div 
            className="px-2 py-1 rounded text-xs font-medium"
            style={{ 
              backgroundColor: `${equipmentStateColors[equipment.state]}15`,
              color: equipmentStateColors[equipment.state]
            }}
          >
            {equipment.state}
          </div>
        </div>
      </CardHeader>
      {/* Rest of card content */}
    </Card>
  )
}
```

### Alert Component

```tsx
function FleetAlert({ severity, message }) {
  const { alertSeverityColors } = useFleetTheme()
  
  return (
    <div 
      className="flex items-start gap-3 p-4 rounded-lg border-2"
      style={{ 
        borderColor: alertSeverityColors[severity],
        backgroundColor: `${alertSeverityColors[severity]}10`
      }}
    >
      <AlertIcon severity={severity} />
      <div className="flex-1">
        <p className="font-medium" style={{ color: alertSeverityColors[severity] }}>
          {severity.toUpperCase()}
        </p>
        <p className="text-sm mt-1">{message}</p>
      </div>
    </div>
  )
}
```

## Accessibility Considerations

### Color Contrast

All fleet colors meet WCAG AA standards for contrast ratios:
- Status indicators: Minimum 4.5:1 contrast ratio
- Text on colored backgrounds: Minimum 7:1 contrast ratio
- High-contrast mode: Maximum possible contrast

### Color Blind Considerations

- Status indicators use both color and iconography
- Critical states include additional visual cues (animations, borders)
- Text labels always accompany color-only indicators

### Field Conditions

Design considerations for industrial environments:
- High-contrast mode for bright sunlight
- Large touch targets for gloved hands
- Clear visual hierarchy for quick scanning
- Reduced cognitive load with consistent patterns

## Integration with Existing Libraries

### Tremor Charts

```tsx
// Use fleet colors in Tremor components
<BarChart
  data={telemetryData}
  index="timestamp"
  categories={["pressure", "temperature"]}
  colors={["blue", "red"]} // Maps to fleet telemetry colors
  className="mt-6"
/>
```

### shadcn/ui Components

Fleet theme colors are automatically available to all shadcn/ui components through CSS variables:

```tsx
<Alert className="border-[hsl(var(--fleet-status-warning))]">
  <AlertTriangle className="h-4 w-4 text-[hsl(var(--fleet-status-warning))]" />
  <AlertTitle>Maintenance Required</AlertTitle>
  <AlertDescription>
    Equipment maintenance is scheduled for next week.
  </AlertDescription>
</Alert>
```

## Best Practices

1. **Consistent Status Mapping**
   - Always use the predefined status colors
   - Don't create custom status indicators
   - Maintain consistency across all views

2. **Progressive Disclosure**
   - Use color intensity to indicate severity
   - Combine color with icons and text
   - Provide tooltips for color meanings

3. **Responsive Theming**
   - Test all themes during development
   - Ensure contrast in all lighting conditions
   - Validate with real field users

4. **Performance**
   - Use CSS variables for dynamic theming
   - Avoid inline style calculations
   - Leverage Tailwind's JIT compilation

## Migration Guide

For teams migrating from generic themes:

1. Replace generic status colors with fleet-specific ones
2. Add equipment state indicators to relevant components
3. Implement high-contrast mode toggle for field users
4. Update documentation with fleet terminology

## Future Enhancements

Planned additions to the fleet theme system:

- [ ] Custom theme builder for client branding
- [ ] Industry-specific color presets (maritime, aviation, automotive)
- [ ] Animated status transitions
- [ ] Dark mode telemetry optimizations
- [ ] Color-blind mode variants

---

*Last Updated: 2025-07-05*
*Version: 1.0.0*