'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { iot } from 'aws-iot-device-sdk-v2';
import { IotConnection } from '@/lib/aws/iot-connection';
import { awsConfig } from '@/lib/aws/config';
import { createCredentialsProvider } from '@/lib/aws/credentials';

export interface UseIotConnectionOptions {
  autoConnect?: boolean;
  clientId?: string;
  onMessage?: (topic: string, message: unknown) => void;
}

export interface UseIotConnectionReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  subscribe: (topic: string) => Promise<void>;
  publish: (topic: string, message: unknown) => Promise<void>;
}

export function useIotConnection(
  options: UseIotConnectionOptions = {}
): UseIotConnectionReturn {
  const { autoConnect = false, clientId, onMessage } = options;
  
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const connectionRef = useRef<IotConnection | null>(null);

  const connect = useCallback(async () => {
    if (connectionRef.current?.getConnectionStatus() || isConnecting) {
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      // Create connection configuration
      // Note: In production, credentials should come from Cognito
      const builder = iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets({
        region: awsConfig.region,
        credentials_provider: createCredentialsProvider(),
      });

      builder.with_endpoint(awsConfig.iot.endpoint);
      builder.with_client_id(clientId || `fleetops-cloud-${Date.now()}`);

      // Create connection instance
      const connection = new IotConnection({
        clientId: clientId || `fleetops-cloud-${Date.now()}`,
        onConnect: () => setIsConnected(true),
        onDisconnect: () => setIsConnected(false),
        onError: (err) => setError(err),
      });

      // Set up message handler
      if (onMessage) {
        connection.onMessage((topic, payload) => {
          try {
            const decoder = new TextDecoder();
            const message = decoder.decode(payload);
            const parsed = JSON.parse(message);
            onMessage(topic, parsed);
          } catch (err) {
            // Failed to parse message
          }
        });
      }

      await connection.connect(builder);
      connectionRef.current = connection;
    } catch (err) {
      setError(err as Error);
      // Connection failed
    } finally {
      setIsConnecting(false);
    }
  }, [clientId, onMessage, isConnecting]);

  const disconnect = useCallback(async () => {
    if (connectionRef.current) {
      await connectionRef.current.disconnect();
      connectionRef.current = null;
    }
  }, []);

  const subscribe = useCallback(async (topic: string) => {
    if (!connectionRef.current) {
      throw new Error('Not connected to AWS IoT');
    }
    await connectionRef.current.subscribe(topic);
  }, []);

  const publish = useCallback(async (topic: string, message: unknown) => {
    if (!connectionRef.current) {
      throw new Error('Not connected to AWS IoT');
    }
    await connectionRef.current.publish(topic, message);
  }, []);

  // Auto-connect on mount if requested
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    subscribe,
    publish,
  };
}