/**
 * Telemetry System Type Definitions
 * 
 * CRITICAL: These interfaces define the contracts between all telemetry components.
 * Changes here affect the entire system - update all consumers when modifying.
 */

/**
 * Generic interface for circular buffer operations.
 * Provides memory-safe, fixed-size data storage.
 */
export interface ICircularBuffer<T> {
  /** Add new item to buffer, overwriting oldest if full */
  push(item: T): void;
  
  /** Get all items in chronological order */
  getAll(): T[];
  
  /** Get last n items in chronological order */
  getLast(n: number): T[];
  
  /** Remove all items from buffer */
  clear(): void;
  
  /** Current number of items in buffer */
  get size(): number;
  
  /** Maximum capacity of buffer */
  get capacity(): number;
  
  /** Whether buffer is at maximum capacity */
  get isFull(): boolean;
}

/**
 * Raw telemetry reading from a sensor.
 * Represents a single data point at 1Hz frequency.
 */
export interface TelemetryReading {
  /** Unique identifier for the equipment (e.g., 'excavator-01') */
  equipmentId: string;
  
  /** Type of sensor (e.g., 'temperature', 'pressure', 'vibration') */
  sensorType: string;
  
  /** Numeric sensor reading */
  value: number;
  
  /** Unit of measurement (e.g., 'PSI', '°F', 'Hz') */
  unit: string;
  
  /** Unix timestamp in milliseconds - MUST be milliseconds, not seconds! */
  timestamp: number;
}

/**
 * Aggregated telemetry data for efficient storage and transmission.
 * Reduces 1Hz raw data to 1-second summaries (100x reduction).
 */
export interface TelemetryAggregate {
  /** Equipment identifier matching TelemetryReading */
  equipmentId: string;
  
  /** Sensor type matching TelemetryReading */
  sensorType: string;
  
  /** Start of aggregation window - rounded to second precision */
  timestamp: number;
  
  /** Minimum value in the 1-second window */
  min: number;
  
  /** Maximum value in the 1-second window */
  max: number;
  
  /** Average value in the 1-second window */
  avg: number;
  
  /** Number of readings aggregated in this window */
  count: number;
}

/**
 * Connection status for WebSocket and network state
 */
export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';

/**
 * Equipment status for operational state tracking
 */
export type EquipmentStatus = 'online' | 'offline' | 'maintenance' | 'alert';

/**
 * Sensor priority levels for buffer size allocation
 */
export type SensorPriority = 'critical' | 'standard' | 'auxiliary';

/**
 * Type guard to check if an object is a valid TelemetryReading
 */
export function isTelemetryReading(obj: any): obj is TelemetryReading {
  return (
    typeof obj === 'object' &&
    typeof obj.equipmentId === 'string' &&
    typeof obj.sensorType === 'string' &&
    typeof obj.value === 'number' &&
    typeof obj.unit === 'string' &&
    typeof obj.timestamp === 'number' &&
    obj.timestamp > 0
  );
}

/**
 * Type guard to check if an object is a valid TelemetryAggregate
 */
export function isTelemetryAggregate(obj: any): obj is TelemetryAggregate {
  return (
    typeof obj === 'object' &&
    typeof obj.equipmentId === 'string' &&
    typeof obj.sensorType === 'string' &&
    typeof obj.timestamp === 'number' &&
    typeof obj.min === 'number' &&
    typeof obj.max === 'number' &&
    typeof obj.avg === 'number' &&
    typeof obj.count === 'number' &&
    obj.count > 0
  );
}