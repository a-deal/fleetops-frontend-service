import { CircularBuffer } from '../../circular-buffer';
import { TelemetryReading } from '../../../types';

describe('CircularBuffer', () => {
  describe('basic operations', () => {
    test('starts empty', () => {
      const buffer = new CircularBuffer<number>(5);
      expect(buffer.size).toBe(0);
      expect(buffer.isFull).toBe(false);
      expect(buffer.capacity).toBe(5);
    });

    test('adds items correctly', () => {
      const buffer = new CircularBuffer<number>(3);
      buffer.push(1);
      buffer.push(2);
      expect(buffer.getAll()).toEqual([1, 2]);
      expect(buffer.size).toBe(2);
    });

    test('overwrites oldest when full', () => {
      const buffer = new CircularBuffer<number>(3);
      buffer.push(1);
      buffer.push(2);
      buffer.push(3);
      buffer.push(4); // Should overwrite 1
      expect(buffer.getAll()).toEqual([2, 3, 4]);
      expect(buffer.isFull).toBe(true);
    });

    test('maintains order after multiple overwrites', () => {
      const buffer = new CircularBuffer<number>(3);
      for (let i = 1; i <= 10; i++) {
        buffer.push(i);
      }
      expect(buffer.getAll()).toEqual([8, 9, 10]);
    });
  });

  describe('getLast functionality', () => {
    test('returns last n items in correct order', () => {
      const buffer = new CircularBuffer<number>(5);
      buffer.push(1);
      buffer.push(2);
      buffer.push(3);
      expect(buffer.getLast(2)).toEqual([2, 3]);
    });

    test('handles n greater than size', () => {
      const buffer = new CircularBuffer<number>(5);
      buffer.push(1);
      buffer.push(2);
      expect(buffer.getLast(10)).toEqual([1, 2]);
    });

    test('works correctly after overflow', () => {
      const buffer = new CircularBuffer<number>(3);
      for (let i = 1; i <= 5; i++) {
        buffer.push(i);
      }
      expect(buffer.getLast(2)).toEqual([4, 5]);
    });

    test('returns empty array when buffer is empty', () => {
      const buffer = new CircularBuffer<number>(5);
      expect(buffer.getLast(3)).toEqual([]);
    });

    test('returns all items when n equals size', () => {
      const buffer = new CircularBuffer<number>(3);
      buffer.push(1);
      buffer.push(2);
      buffer.push(3);
      expect(buffer.getLast(3)).toEqual([1, 2, 3]);
    });
  });

  describe('edge cases', () => {
    test('handles zero capacity', () => {
      expect(() => new CircularBuffer(0)).toThrow('Capacity must be positive');
    });

    test('handles negative capacity', () => {
      expect(() => new CircularBuffer(-1)).toThrow('Capacity must be positive');
    });

    test('clear resets buffer state', () => {
      const buffer = new CircularBuffer<number>(3);
      buffer.push(1);
      buffer.push(2);
      buffer.clear();
      expect(buffer.size).toBe(0);
      expect(buffer.getAll()).toEqual([]);
      expect(buffer.isFull).toBe(false);
    });

    test('handles single capacity buffer', () => {
      const buffer = new CircularBuffer<number>(1);
      buffer.push(1);
      expect(buffer.getAll()).toEqual([1]);
      expect(buffer.isFull).toBe(true);
      
      buffer.push(2);
      expect(buffer.getAll()).toEqual([2]);
    });

    test('handles large capacity', () => {
      const buffer = new CircularBuffer<number>(10000);
      for (let i = 0; i < 10000; i++) {
        buffer.push(i);
      }
      expect(buffer.size).toBe(10000);
      expect(buffer.isFull).toBe(true);
      expect(buffer.getLast(1)[0]).toBe(9999);
    });
  });

  describe('telemetry-specific usage', () => {
    test('handles telemetry readings efficiently', () => {
      const buffer = new CircularBuffer<TelemetryReading>(300); // 5 minutes at 1Hz
      
      const reading: TelemetryReading = {
        equipmentId: 'eq-001',
        sensorType: 'temperature',
        value: 75.5,
        unit: '°F',
        timestamp: Date.now()
      };
      
      buffer.push(reading);
      expect(buffer.getLast(1)[0]).toEqual(reading);
    });

    test('maintains telemetry data integrity during overflow', () => {
      const buffer = new CircularBuffer<TelemetryReading>(2);
      
      const reading1: TelemetryReading = {
        equipmentId: 'eq-001',
        sensorType: 'temperature',
        value: 75.5,
        unit: '°F',
        timestamp: Date.now()
      };
      
      const reading2: TelemetryReading = {
        equipmentId: 'eq-001',
        sensorType: 'temperature',
        value: 76.0,
        unit: '°F',
        timestamp: Date.now() + 1000
      };
      
      const reading3: TelemetryReading = {
        equipmentId: 'eq-001',
        sensorType: 'temperature',
        value: 76.5,
        unit: '°F',
        timestamp: Date.now() + 2000
      };
      
      buffer.push(reading1);
      buffer.push(reading2);
      buffer.push(reading3); // Should overwrite reading1
      
      const all = buffer.getAll();
      expect(all).toHaveLength(2);
      expect(all[0]).toEqual(reading2);
      expect(all[1]).toEqual(reading3);
    });

    test('handles rapid sensor updates', () => {
      const buffer = new CircularBuffer<TelemetryReading>(100);
      const startTime = Date.now();
      
      // Simulate 1Hz updates for 200 readings (should overflow)
      for (let i = 0; i < 200; i++) {
        buffer.push({
          equipmentId: 'eq-001',
          sensorType: 'pressure',
          value: 100 + Math.random() * 50,
          unit: 'PSI',
          timestamp: startTime + i * 1000
        });
      }
      
      expect(buffer.size).toBe(100);
      expect(buffer.isFull).toBe(true);
      
      const lastReading = buffer.getLast(1)[0];
      expect(lastReading.timestamp).toBe(startTime + 199 * 1000);
    });
  });

  describe('memory characteristics', () => {
    test('maintains constant memory footprint', () => {
      const buffer = new CircularBuffer<number>(1000);
      
      // Fill buffer completely
      for (let i = 0; i < 1000; i++) {
        buffer.push(i);
      }
      
      const fullSize = buffer.size;
      
      // Continue pushing (overwriting)
      for (let i = 1000; i < 2000; i++) {
        buffer.push(i);
      }
      
      expect(buffer.size).toBe(fullSize); // Size doesn't grow
      expect(buffer.capacity).toBe(1000); // Capacity is constant
    });
  });
});