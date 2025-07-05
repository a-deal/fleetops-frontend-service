'use client';

import React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import {
  AlertPriorityIndicator,
  ConnectionQuality,
  DataAgeIndicator,
  EquipmentState,
  StatusBadge,
  TelemetryValue} from './industrial-patterns';

interface ThemeComparisonProps {
  showLabels?: boolean;
}

export function ThemeComparison({ showLabels = true }: ThemeComparisonProps) {
  
  return (
    <div className="space-y-8">
      {/* Side by Side Theme Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Light Theme Preview */}
        <div className="rounded-lg border-2 overflow-hidden">
          <div className="bg-white p-6" data-theme="light">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Light Theme</h3>
            <ThemeContent />
          </div>
        </div>

        {/* Dark Theme Preview */}
        <div className="rounded-lg border-2 overflow-hidden">
          <div className="bg-gray-950 p-6" data-theme="dark">
            <h3 className="text-xl font-bold mb-4 text-white">Dark Theme</h3>
            <div className="dark">
              <ThemeContent />
            </div>
          </div>
        </div>
      </div>

      {/* Color Palette Comparison */}
      {showLabels && (
        <Card>
          <CardHeader>
            <CardTitle>Color Palette Comparison</CardTitle>
            <CardDescription>How status colors adapt between themes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Status Colors */}
              <div>
                <h4 className="font-semibold mb-3">Status Colors</h4>
                <div className="grid grid-cols-2 gap-4">
                  <ColorSwatchComparison
                    label="Operational"
                    lightColor="hsl(142.1 70.6% 45.3%)"
                    darkColor="hsl(142.1 70.6% 55.3%)"
                  />
                  <ColorSwatchComparison
                    label="Warning"
                    lightColor="hsl(45.4 92.9% 47.4%)"
                    darkColor="hsl(45.4 92.9% 57.4%)"
                  />
                  <ColorSwatchComparison
                    label="Critical"
                    lightColor="hsl(0 72.2% 50.6%)"
                    darkColor="hsl(0 72.2% 60.6%)"
                  />
                  <ColorSwatchComparison
                    label="Offline"
                    lightColor="hsl(0 0% 63.9%)"
                    darkColor="hsl(0 0% 73.9%)"
                  />
                </div>
              </div>

              {/* Alert Severity Colors */}
              <div>
                <h4 className="font-semibold mb-3">Alert Severity Levels</h4>
                <div className="grid grid-cols-2 gap-4">
                  <ColorSwatchComparison
                    label="Low"
                    lightColor="hsl(217 91% 60%)"
                    darkColor="hsl(217 91% 70%)"
                  />
                  <ColorSwatchComparison
                    label="Medium"
                    lightColor="hsl(45 93% 47%)"
                    darkColor="hsl(45 93% 57%)"
                  />
                  <ColorSwatchComparison
                    label="High"
                    lightColor="hsl(25 95% 53%)"
                    darkColor="hsl(25 95% 63%)"
                  />
                  <ColorSwatchComparison
                    label="Critical"
                    lightColor="hsl(0 72% 51%)"
                    darkColor="hsl(0 72% 61%)"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Reusable theme content component
function ThemeContent() {
  const currentTimestamp = Date.now();
  
  return (
    <div className="space-y-6">
      {/* Status Badges */}
      <div>
        <h4 className="text-sm font-semibold mb-3 opacity-70">Status Indicators</h4>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status="operational" />
          <StatusBadge status="warning" />
          <StatusBadge status="critical" />
          <StatusBadge status="offline" />
        </div>
      </div>

      {/* Equipment States */}
      <div>
        <h4 className="text-sm font-semibold mb-3 opacity-70">Equipment States</h4>
        <div className="grid grid-cols-2 gap-2">
          <EquipmentState state="active" size="sm" />
          <EquipmentState state="idle" size="sm" />
          <EquipmentState state="maintenance" size="sm" />
          <EquipmentState state="fault" size="sm" />
        </div>
      </div>

      {/* Alert Priorities */}
      <div>
        <h4 className="text-sm font-semibold mb-3 opacity-70">Alert Priorities</h4>
        <div className="grid grid-cols-4 gap-2">
          <AlertPriorityIndicator priority="low" count={2} />
          <AlertPriorityIndicator priority="medium" count={5} />
          <AlertPriorityIndicator priority="high" count={1} />
          <AlertPriorityIndicator priority="critical" count={1} />
        </div>
      </div>

      {/* Telemetry Values */}
      <div>
        <h4 className="text-sm font-semibold mb-3 opacity-70">Telemetry Displays</h4>
        <div className="grid grid-cols-1 gap-2">
          <TelemetryValue
            value={2150}
            unit="psi"
            label="Pressure"
            threshold={{ warning: 2400, critical: 2800 }}
            trend="stable"
          />
          <TelemetryValue
            value={92.5}
            unit="°C"
            label="Temperature"
            threshold={{ warning: 90, critical: 100 }}
            trend="up"
          />
        </div>
      </div>

      {/* Connection & Data Age */}
      <div>
        <h4 className="text-sm font-semibold mb-3 opacity-70">System Status</h4>
        <div className="flex items-center justify-between">
          <ConnectionQuality quality="good" latency={45} showDetails />
          <DataAgeIndicator timestamp={currentTimestamp - 5000} />
        </div>
      </div>
    </div>
  );
}

// Color swatch comparison component
interface ColorSwatchComparisonProps {
  label: string;
  lightColor: string;
  darkColor: string;
}

function ColorSwatchComparison({ label, lightColor, darkColor }: ColorSwatchComparisonProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex gap-2">
        <div className="flex-1">
          <div 
            className="h-10 rounded border"
            style={{ backgroundColor: lightColor }}
          />
          <p className="text-xs text-muted-foreground mt-1">Light</p>
        </div>
        <div className="flex-1">
          <div 
            className="h-10 rounded border"
            style={{ backgroundColor: darkColor }}
          />
          <p className="text-xs text-muted-foreground mt-1">Dark</p>
        </div>
      </div>
    </div>
  );
}