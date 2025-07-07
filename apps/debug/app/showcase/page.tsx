'use client';

import { Monitor,Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import React from 'react';

import { PatternShowcase } from '@/components/patterns/pattern-showcase';
import { ThemeComparison } from '@/components/patterns/theme-comparison';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ShowcasePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Theme Switcher Header */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Fleet Industrial Patterns</h1>
            <p className="text-sm text-muted-foreground">UI Component Showcase</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border p-1">
              <Button
                variant={theme === 'light' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTheme('light')}
                className="relative"
              >
                <Sun className="h-4 w-4" />
                <span className="sr-only">Light mode</span>
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTheme('dark')}
                className="relative"
              >
                <Moon className="h-4 w-4" />
                <span className="sr-only">Dark mode</span>
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTheme('system')}
                className="relative"
              >
                <Monitor className="h-4 w-4" />
                <span className="sr-only">System theme</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Info Banner */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Current Theme: {theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light'}</CardTitle>
            <CardDescription>
              Toggle between light and dark themes to see how industrial patterns adapt to different viewing conditions.
              All colors maintain WCAG AA compliance in both modes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Light Mode</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Optimized for office environments</li>
                  <li>• High contrast for data clarity</li>
                  <li>• Reduced eye strain indoors</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Dark Mode</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Extended monitoring sessions</li>
                  <li>• Reduced blue light exposure</li>
                  <li>• Enhanced focus on critical data</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">High Contrast (Coming Soon)</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Field conditions optimization</li>
                  <li>• Maximum visibility outdoors</li>
                  <li>• Glove-friendly touch targets</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pattern Showcase with Tabs */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="patterns" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patterns">Component Patterns</TabsTrigger>
            <TabsTrigger value="comparison">Theme Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="patterns" className="mt-6">
            <PatternShowcase />
          </TabsContent>
          
          <TabsContent value="comparison" className="mt-6">
            <ThemeComparison />
          </TabsContent>
        </Tabs>
      </div>

      {/* Usage Examples */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Implementation Guide</CardTitle>
            <CardDescription>How to use these patterns in your fleet management application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Import Components</h4>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`import {
  StatusBadge,
  EquipmentState,
  AlertPriorityIndicator,
  TelemetryValue,
  ConnectionQuality,
  DataAgeIndicator
} from '@/components/patterns/industrial-patterns'`}</code>
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Example Usage</h4>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`// Equipment status indicator
<StatusBadge status="operational" label="Online" />

// Telemetry display with thresholds
<TelemetryValue
  value={2150}
  unit="psi"
  label="Hydraulic Pressure"
  threshold={{ warning: 2400, critical: 2800 }}
  trend="stable"
/>

// Alert counter with click handler
<AlertPriorityIndicator 
  priority="critical" 
  count={3}
  onClick={() => navigateToAlerts('critical')}
/>`}</code>
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Theme-Aware Styling</h4>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`// Components automatically adapt to theme changes
// No additional configuration required

// Access theme colors directly if needed
<div className="text-fleet-status-operational">
  System running normally
</div>

// Use with Tailwind variants
<div className="bg-fleet-status-warning/10 
            border-fleet-status-warning 
            text-fleet-status-warning">
  Warning state
</div>`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}