import { iot, mqtt } from 'aws-iot-device-sdk-v2';

export interface IotConnectionOptions {
  clientId: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export class IotConnection {
  private connection: mqtt.MqttClientConnection | null = null;
  private client: mqtt.MqttClient | null = null;
  private isConnected = false;

  constructor(private options: IotConnectionOptions) {}

  async connect(credentials: iot.AwsIotMqttConnectionConfigBuilder): Promise<void> {
    try {
      // Build the configuration
      const config = credentials.build();
      
      // Create MQTT client
      this.client = new mqtt.MqttClient();
      
      // Create connection
      this.connection = this.client.new_connection(config);

      // Set up event handlers
      this.connection.on('connect', () => {
        this.isConnected = true;
        // Connection established
        this.options.onConnect?.();
      });

      this.connection.on('disconnect', () => {
        this.isConnected = false;
        // Connection closed
        this.options.onDisconnect?.();
      });

      this.connection.on('error', (error) => {
        // Connection error occurred
        this.options.onError?.(error);
      });

      // Connect
      await this.connection.connect();
    } catch (error) {
      // Failed to establish connection
      throw error;
    }
  }

  async subscribe(topic: string, qos: mqtt.QoS = mqtt.QoS.AtLeastOnce): Promise<void> {
    if (!this.connection || !this.isConnected) {
      throw new Error('Not connected to AWS IoT');
    }

    await this.connection.subscribe(topic, qos);
  }

  async publish(
    topic: string,
    payload: unknown,
    qos: mqtt.QoS = mqtt.QoS.AtLeastOnce
  ): Promise<void> {
    if (!this.connection || !this.isConnected) {
      throw new Error('Not connected to AWS IoT');
    }

    const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
    await this.connection.publish(topic, message, qos);
  }

  onMessage(callback: (topic: string, payload: ArrayBuffer) => void): void {
    if (!this.connection) {
      throw new Error('Connection not initialized');
    }

    this.connection.on('message', callback);
  }

  async disconnect(): Promise<void> {
    if (this.connection && this.isConnected) {
      await this.connection.disconnect();
    }
    
    // Clean up resources
    this.connection = null;
    this.client = null;
    this.isConnected = false;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}