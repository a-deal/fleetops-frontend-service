// Telemetry types will be extracted here from apps/debug/lib/telemetry/types
// For now, we'll define basic interfaces that both services will use

export interface TelemetryReading {
  equipmentId: string;
  timestamp: number;
  metrics: Record<string, number>;
}

export interface TelemetryAggregate {
  equipmentId: string;
  metric: string;
  period: string;
  startTime: number;
  endTime: number;
  count: number;
  sum: number;
  min: number;
  max: number;
  avg: number;
}