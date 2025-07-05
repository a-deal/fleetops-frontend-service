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

export const PatternShowcase = () => {
  return (
    <div className="space-y-8">
      {/* Status Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Status Badges</CardTitle>
          <CardDescription>Equipment and system status indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <StatusBadge status="operational" />
            <StatusBadge status="warning" />
            <StatusBadge status="critical" />
            <StatusBadge status="offline" />
            <StatusBadge status="operational" label="System Online" showDot={false} />
          </div>
        </CardContent>
      </Card>

      {/* Equipment States */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment States</CardTitle>
          <CardDescription>Machine operational state indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <EquipmentState state="active" />
            <EquipmentState state="idle" />
            <EquipmentState state="maintenance" />
            <EquipmentState state="fault" />
          </div>
          <div className="mt-4 flex gap-4">
            <EquipmentState state="active" size="sm" showLabel={false} />
            <EquipmentState state="idle" size="md" showLabel={false} />
            <EquipmentState state="fault" size="lg" showLabel={false} />
          </div>
        </CardContent>
      </Card>

      {/* Alert Priority Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Priority Indicators</CardTitle>
          <CardDescription>Categorized alert counters with visual hierarchy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AlertPriorityIndicator priority="low" count={3} />
            <AlertPriorityIndicator priority="medium" count={7} />
            <AlertPriorityIndicator priority="high" count={2} />
            <AlertPriorityIndicator priority="critical" count={1} />
          </div>
        </CardContent>
      </Card>

      {/* Telemetry Values */}
      <Card>
        <CardHeader>
          <CardTitle>Telemetry Value Displays</CardTitle>
          <CardDescription>Real-time sensor data visualization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TelemetryValue
              value={2150}
              unit="psi"
              label="Hydraulic Pressure"
              threshold={{ warning: 2400, critical: 2800 }}
              trend="stable"
            />
            <TelemetryValue
              value={85.5}
              unit="°C"
              label="Oil Temperature"
              threshold={{ warning: 90, critical: 100 }}
              trend="up"
            />
            <TelemetryValue
              value={125.3}
              unit="L/min"
              label="Flow Rate"
              trend="down"
              precision={1}
            />
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <TelemetryValue
              value={2450}
              unit="psi"
              label="Warning State"
              threshold={{ warning: 2400, critical: 2800 }}
            />
            <TelemetryValue
              value={2850}
              unit="psi"
              label="Critical State"
              threshold={{ warning: 2400, critical: 2800 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Connection Quality */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Quality Indicators</CardTitle>
          <CardDescription>Network and telemetry connection status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Excellent Connection</span>
              <ConnectionQuality quality="excellent" latency={15} showDetails />
            </div>
            <div className="flex items-center justify-between">
              <span>Good Connection</span>
              <ConnectionQuality quality="good" latency={75} showDetails />
            </div>
            <div className="flex items-center justify-between">
              <span>Poor Connection</span>
              <ConnectionQuality quality="poor" latency={250} showDetails />
            </div>
            <div className="flex items-center justify-between">
              <span>Offline</span>
              <ConnectionQuality quality="offline" showDetails />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Age Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Data Age Indicators</CardTitle>
          <CardDescription>Freshness of telemetry data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Fresh Data (10s ago)</span>
              <DataAgeIndicator timestamp={Date.now() - 10000} />
            </div>
            <div className="flex items-center justify-between">
              <span>Recent Data (45s ago)</span>
              <DataAgeIndicator timestamp={Date.now() - 45000} />
            </div>
            <div className="flex items-center justify-between">
              <span>Stale Data (2m ago)</span>
              <DataAgeIndicator timestamp={Date.now() - 120000} />
            </div>
            <div className="flex items-center justify-between">
              <span>Exact Timestamp</span>
              <DataAgeIndicator timestamp={Date.now() - 30000} showExact />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Combined Pattern Example */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment Overview Card Pattern</CardTitle>
          <CardDescription>Combining multiple patterns for a complete view</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Excavator CAT-320</h3>
                <p className="text-sm text-muted-foreground">Heavy Equipment</p>
              </div>
              <StatusBadge status="warning" />
            </div>
            
            <div className="flex items-center gap-4">
              <EquipmentState state="active" size="sm" />
              <ConnectionQuality quality="good" latency={45} />
              <DataAgeIndicator timestamp={Date.now() - 5000} />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <TelemetryValue
                value={2450}
                unit="psi"
                label="Pressure"
                threshold={{ warning: 2400, critical: 2800 }}
                precision={0}
              />
              <TelemetryValue
                value={78.5}
                unit="°C"
                label="Temp"
                threshold={{ warning: 90, critical: 100 }}
                precision={1}
              />
              <TelemetryValue
                value={98.5}
                unit="L/min"
                label="Flow"
                precision={1}
              />
            </div>

            <div className="flex gap-2">
              <AlertPriorityIndicator priority="low" count={1} />
              <AlertPriorityIndicator priority="medium" count={2} />
              <AlertPriorityIndicator priority="high" count={0} />
              <AlertPriorityIndicator priority="critical" count={0} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};