'use client';

import React from 'react';

import { useTelemetry } from '@/providers/telemetry-provider';

export function TelemetryDashboard() {
  const { readings, isConnected, isConnecting, error, connect, disconnect } = useTelemetry();

  // Group readings by equipment
  const equipmentData = readings.reduce((acc, reading) => {
    const equipmentId = reading.equipmentId;
    if (!acc[equipmentId]) {
      acc[equipmentId] = [];
    }
    acc[equipmentId]!.push(reading);
    return acc;
  }, {} as Record<string, typeof readings>);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Telemetry Dashboard</h2>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-sm">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <button
            onClick={isConnected ? disconnect : connect}
            disabled={isConnecting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {error.message}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(equipmentData).map(([equipmentId, equipmentReadings]) => {
          const latestReading = equipmentReadings[equipmentReadings.length - 1];
          
          return (
            <div key={equipmentId} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-2">Equipment: {equipmentId}</h3>
              
              {latestReading && (
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Metrics:</span>
                    <div className="pl-4">
                      {Object.entries(latestReading.metrics).map(([key, value]) => (
                        <div key={key}>
                          {key}: {value}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Timestamp:</span>{' '}
                    {new Date(latestReading.timestamp).toLocaleTimeString()}
                  </div>
                  <div>
                    <span className="font-medium">Total Readings:</span>{' '}
                    {equipmentReadings.length}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isConnected && Object.keys(equipmentData).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Waiting for telemetry data...
        </div>
      )}
    </div>
  );
}