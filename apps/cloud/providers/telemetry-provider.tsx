'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useIotConnection } from '@/hooks/use-iot-connection';
import type { TelemetryReading } from '@repo/telemetry';

interface TelemetryContextValue {
  readings: TelemetryReading[];
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  subscribeToEquipment: (equipmentId: string) => Promise<void>;
}

const TelemetryContext = createContext<TelemetryContextValue | undefined>(undefined);

export interface TelemetryProviderProps {
  children: React.ReactNode;
  autoConnect?: boolean;
  maxReadings?: number;
}

export function TelemetryProvider({ 
  children, 
  autoConnect = false,
  maxReadings = 1000 
}: TelemetryProviderProps) {
  const [readings, setReadings] = useState<TelemetryReading[]>([]);
  const [subscribedSensors, setSubscribedSensors] = useState<Set<string>>(new Set());

  const {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    subscribe,
  } = useIotConnection({
    autoConnect,
    onMessage: (topic, message) => {
      // Parse topic to extract equipment ID
      // Expected format: fleetops/telemetry/{equipmentId}
      const match = topic.match(/^fleetops\/telemetry\/(.+)$/);
      if (match && match[1]) {
        // Type guard for the message
        const messageData = message as { timestamp?: number; metrics?: Record<string, number> };
        const reading: TelemetryReading = {
          equipmentId: match[1],
          timestamp: messageData.timestamp || Date.now(),
          metrics: messageData.metrics || {},
        };

        setReadings((prev) => {
          const updated = [...prev, reading];
          // Keep only the most recent readings
          return updated.slice(-maxReadings);
        });
      }
    },
  });

  const subscribeToEquipment = async (equipmentId: string) => {
    if (subscribedSensors.has(equipmentId)) {
      return;
    }

    const topic = `fleetops/telemetry/${equipmentId}`;
    await subscribe(topic);
    setSubscribedSensors((prev) => new Set([...prev, equipmentId]));
  };

  // Subscribe to all sensors when connected
  useEffect(() => {
    if (isConnected && subscribedSensors.size === 0) {
      // Subscribe to wildcard topic for all telemetry
      subscribe('fleetops/telemetry/+').catch(console.error);
    }
  }, [isConnected, subscribe, subscribedSensors.size]);

  return (
    <TelemetryContext.Provider
      value={{
        readings,
        isConnected,
        isConnecting,
        error,
        connect,
        disconnect,
        subscribeToEquipment,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
}