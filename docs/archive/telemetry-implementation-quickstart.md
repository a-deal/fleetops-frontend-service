> ⚠️ **ARCHIVED**: This quickstart has been integrated into the comprehensive guide.
> See [telemetry-comprehensive-guide.md](../telemetry-comprehensive-guide.md) for current implementation.

# Telemetry Implementation Quick Start Guide

> **Start Here**: Actionable steps to begin Phase 1 implementation TODAY

## Day 1: Project Setup (Morning)

### 1. Create Project Structure
```bash
mkdir -p lib/telemetry/{stores,workers,utils,types}
mkdir -p lib/telemetry/__tests__/{unit,integration,performance}
mkdir -p test/fixtures
```

### 2. Install Testing Dependencies
```bash
pnpm add -D jest @types/jest ts-jest
pnpm add -D fast-check  # Property-based testing
pnpm add -D @testing-library/react @testing-library/jest-dom
pnpm add -D mock-socket  # WebSocket mocking
```

### 3. Configure Jest for Performance Testing
```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/**/__tests__/unit/**/*.test.ts']
    },
    {
      displayName: 'performance',
      testMatch: ['<rootDir>/**/__tests__/performance/**/*.test.ts'],
      globals: {
        'ts-jest': {
          isolatedModules: true // Faster for perf tests
        }
      }
    }
  ],
  collectCoverageFrom: [
    'lib/telemetry/**/*.ts',
    '!lib/telemetry/**/*.d.ts',
    '!lib/telemetry/**/__tests__/**'
  ]
};
```

### 4. Create Performance Baseline Tracker
```typescript
// test/fixtures/performance-baselines.json
{
  "circularBuffer": {
    "push": { "max": 0.001, "unit": "ms" },
    "getAll": { "max": 0.1, "unit": "ms" },
    "memory": { "max": 1024, "unit": "bytes per item" }
  },
  "aggregation": {
    "1second": { "max": 0.5, "unit": "ms per 100 sensors" },
    "memory": { "max": 256, "unit": "bytes per aggregate" }
  }
}
```

## Day 1: CircularBuffer Implementation (Afternoon)

### 1. Start with the Interface
```typescript
// lib/telemetry/types/index.ts
export interface ICircularBuffer<T> {
  push(item: T): void;
  getAll(): T[];
  getLast(n: number): T[];
  clear(): void;
  get size(): number;
  get capacity(): number;
  get isFull(): boolean;
}
```

### 2. Write Tests FIRST (TDD)
```typescript
// lib/telemetry/stores/__tests__/unit/circular-buffer.test.ts
import { CircularBuffer } from '../../circular-buffer';

describe('CircularBuffer', () => {
  describe('basic operations', () => {
    test('starts empty', () => {
      const buffer = new CircularBuffer<number>(5);
      expect(buffer.size).toBe(0);
      expect(buffer.isFull).toBe(false);
    });

    test('adds items correctly', () => {
      const buffer = new CircularBuffer<number>(3);
      buffer.push(1);
      buffer.push(2);
      expect(buffer.getAll()).toEqual([1, 2]);
    });

    test('overwrites oldest when full', () => {
      const buffer = new CircularBuffer<number>(3);
      buffer.push(1);
      buffer.push(2);
      buffer.push(3);
      buffer.push(4); // Should overwrite 1
      expect(buffer.getAll()).toEqual([2, 3, 4]);
    });
  });

  describe('edge cases', () => {
    test('handles zero capacity', () => {
      expect(() => new CircularBuffer(0)).toThrow();
    });

    test('getLast with n > size returns all', () => {
      const buffer = new CircularBuffer<number>(5);
      buffer.push(1);
      buffer.push(2);
      expect(buffer.getLast(10)).toEqual([1, 2]);
    });
  });
});
```

### 3. Property-Based Tests
```typescript
// lib/telemetry/stores/__tests__/unit/circular-buffer.property.test.ts
import fc from 'fast-check';
import { CircularBuffer } from '../../circular-buffer';

describe('CircularBuffer properties', () => {
  test('never exceeds capacity', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        fc.integer({ min: 1, max: 1000 }),
        (items, capacity) => {
          const buffer = new CircularBuffer(capacity);
          items.forEach(item => buffer.push(item));
          expect(buffer.size).toBeLessThanOrEqual(capacity);
        }
      )
    );
  });

  test('maintains insertion order within capacity', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer(), { minLength: 1, maxLength: 100 }),
        (items) => {
          const buffer = new CircularBuffer(items.length);
          items.forEach(item => buffer.push(item));
          expect(buffer.getAll()).toEqual(items);
        }
      )
    );
  });
});
```

### 4. Performance Tests
```typescript
// lib/telemetry/stores/__tests__/performance/circular-buffer.perf.test.ts
import { CircularBuffer } from '../../circular-buffer';
import { PerformanceMonitor } from '../../../../test/utils/performance-monitor';

const monitor = new PerformanceMonitor();

describe('CircularBuffer performance', () => {
  test('push operation stays under 1μs', () => {
    const buffer = new CircularBuffer(1000);
    
    const result = monitor.measure('push', () => {
      for (let i = 0; i < 10000; i++) {
        buffer.push(i);
      }
    });
    
    expect(result.avgTimePerOp).toBeLessThan(0.001); // 1μs
  });

  test('no memory leaks over time', () => {
    const iterations = 100;
    const measurements: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      if (global.gc) global.gc();
      
      const before = process.memoryUsage().heapUsed;
      const buffer = new CircularBuffer(1000);
      
      for (let j = 0; j < 10000; j++) {
        buffer.push({ value: Math.random(), timestamp: Date.now() });
      }
      
      const after = process.memoryUsage().heapUsed;
      measurements.push(after - before);
    }
    
    // Memory usage should stabilize
    const firstHalf = average(measurements.slice(0, 50));
    const secondHalf = average(measurements.slice(50));
    expect(secondHalf / firstHalf).toBeLessThan(1.1); // <10% growth
  });
});
```

### 5. Implement CircularBuffer
```typescript
// lib/telemetry/stores/circular-buffer.ts
export class CircularBuffer<T> implements ICircularBuffer<T> {
  private buffer: (T | undefined)[];
  private writeIndex = 0;
  private itemCount = 0;
  private readonly _capacity: number;

  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new Error('Capacity must be positive');
    }
    this._capacity = capacity;
    this.buffer = new Array(capacity);
  }

  push(item: T): void {
    this.buffer[this.writeIndex] = item;
    this.writeIndex = (this.writeIndex + 1) % this._capacity;
    if (this.itemCount < this._capacity) {
      this.itemCount++;
    }
  }

  getAll(): T[] {
    if (this.itemCount < this._capacity) {
      return this.buffer.slice(0, this.itemCount) as T[];
    }
    
    // Buffer is full, need to reorder
    const result: T[] = [];
    for (let i = 0; i < this._capacity; i++) {
      const index = (this.writeIndex + i) % this._capacity;
      result.push(this.buffer[index] as T);
    }
    return result;
  }

  getLast(n: number): T[] {
    const count = Math.min(n, this.itemCount);
    const result: T[] = [];
    
    for (let i = count - 1; i >= 0; i--) {
      const index = (this.writeIndex - 1 - i + this._capacity) % this._capacity;
      result.push(this.buffer[index] as T);
    }
    
    return result;
  }

  clear(): void {
    this.buffer = new Array(this._capacity);
    this.writeIndex = 0;
    this.itemCount = 0;
  }

  get size(): number {
    return this.itemCount;
  }

  get capacity(): number {
    return this._capacity;
  }

  get isFull(): boolean {
    return this.itemCount === this._capacity;
  }
}
```

## Day 2: Telemetry Aggregation

### 1. Test First - Aggregation Logic
```typescript
// lib/telemetry/utils/__tests__/unit/aggregation.test.ts
import { aggregateTelemetry } from '../../aggregation';

describe('Telemetry Aggregation', () => {
  test('aggregates 1 second of data correctly', () => {
    const readings = [
      { value: 10, timestamp: 1000, equipmentId: 'eq1', sensorType: 'temp' },
      { value: 20, timestamp: 1200, equipmentId: 'eq1', sensorType: 'temp' },
      { value: 30, timestamp: 1400, equipmentId: 'eq1', sensorType: 'temp' },
      { value: 15, timestamp: 1800, equipmentId: 'eq1', sensorType: 'temp' }
    ];
    
    const aggregate = aggregateTelemetry(readings);
    
    expect(aggregate).toEqual({
      equipmentId: 'eq1',
      sensorType: 'temp',
      timestamp: 1000, // Start of second
      min: 10,
      max: 30,
      avg: 18.75,
      count: 4
    });
  });

  test('handles single reading', () => {
    const readings = [
      { value: 42, timestamp: 5500, equipmentId: 'eq2', sensorType: 'pressure' }
    ];
    
    const aggregate = aggregateTelemetry(readings);
    
    expect(aggregate.min).toBe(42);
    expect(aggregate.max).toBe(42);
    expect(aggregate.avg).toBe(42);
    expect(aggregate.count).toBe(1);
  });
});
```

### 2. Performance Testing for Aggregation
```typescript
// lib/telemetry/utils/__tests__/performance/aggregation.perf.test.ts
test('aggregates 100 sensors in <0.5ms', () => {
  const readings = generateReadings(100); // 100 sensors, 1 reading each
  
  const start = performance.now();
  const aggregates = readings.map(sensorReadings => 
    aggregateTelemetry(sensorReadings)
  );
  const duration = performance.now() - start;
  
  expect(duration).toBeLessThan(0.5);
  expect(aggregates).toHaveLength(100);
});
```

### 3. Implement Aggregation
```typescript
// lib/telemetry/utils/aggregation.ts
export interface TelemetryReading {
  equipmentId: string;
  sensorType: string;
  value: number;
  timestamp: number;
}

export interface TelemetryAggregate {
  equipmentId: string;
  sensorType: string;
  timestamp: number;
  min: number;
  max: number;
  avg: number;
  count: number;
}

export function aggregateTelemetry(readings: TelemetryReading[]): TelemetryAggregate {
  if (readings.length === 0) {
    throw new Error('Cannot aggregate empty readings');
  }

  const values = readings.map(r => r.value);
  const first = readings[0];
  
  return {
    equipmentId: first.equipmentId,
    sensorType: first.sensorType,
    timestamp: Math.floor(first.timestamp / 1000) * 1000, // Round to second
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((a, b) => a + b, 0) / values.length,
    count: readings.length
  };
}
```

## Day 3: Performance Monitoring Setup

### 1. Create Performance Monitor
```typescript
// test/utils/performance-monitor.ts
import * as fs from 'fs';
import * as path from 'path';

export class PerformanceMonitor {
  private baselines: Map<string, number>;
  private results: Map<string, number[]> = new Map();

  constructor() {
    this.baselines = this.loadBaselines();
  }

  private loadBaselines(): Map<string, number> {
    const baselinePath = path.join(__dirname, '../fixtures/performance-baselines.json');
    const data = JSON.parse(fs.readFileSync(baselinePath, 'utf-8'));
    const map = new Map<string, number>();
    
    // Flatten nested structure
    Object.entries(data).forEach(([category, metrics]) => {
      Object.entries(metrics as any).forEach(([metric, spec]: [string, any]) => {
        map.set(`${category}.${metric}`, spec.max);
      });
    });
    
    return map;
  }

  measure(name: string, fn: () => void): MeasureResult {
    const iterations = 1000;
    const measurements: number[] = [];
    
    // Warmup
    for (let i = 0; i < 100; i++) fn();
    
    // Measure
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      fn();
      const duration = performance.now() - start;
      measurements.push(duration);
    }
    
    const avg = average(measurements);
    const baseline = this.baselines.get(name);
    const regression = baseline ? ((avg - baseline) / baseline) * 100 : 0;
    
    return {
      name,
      average: avg,
      min: Math.min(...measurements),
      max: Math.max(...measurements),
      p95: percentile(measurements, 95),
      regression,
      pass: !baseline || regression < 5 // 5% tolerance
    };
  }

  generateReport(): void {
    console.log('\n=== Performance Report ===\n');
    
    this.results.forEach((measurements, name) => {
      const baseline = this.baselines.get(name);
      const current = average(measurements);
      const regression = baseline ? ((current - baseline) / baseline) * 100 : 0;
      
      console.log(`${name}:`);
      console.log(`  Baseline: ${baseline?.toFixed(3)}ms`);
      console.log(`  Current:  ${current.toFixed(3)}ms`);
      console.log(`  Change:   ${regression > 0 ? '+' : ''}${regression.toFixed(1)}%`);
      console.log(`  Status:   ${regression < 5 ? '✅ PASS' : '❌ FAIL'}\n`);
    });
  }
}
```

### 2. Create Test Data Generator
```typescript
// test/fixtures/sensor-data-generator.ts
export class SensorDataGenerator {
  static realistic(options: {
    equipmentId: string;
    sensorType: 'temperature' | 'pressure' | 'vibration';
    pattern: 'stable' | 'trending' | 'erratic' | 'failing';
    duration: number; // seconds
    frequency: number; // Hz
  }): TelemetryReading[] {
    const readings: TelemetryReading[] = [];
    const samples = options.duration * options.frequency;
    
    for (let i = 0; i < samples; i++) {
      const timestamp = Date.now() - (samples - i) * (1000 / options.frequency);
      const value = this.generateValue(options.pattern, i, samples);
      
      readings.push({
        equipmentId: options.equipmentId,
        sensorType: options.sensorType,
        value: this.addNoise(value, options.pattern),
        timestamp
      });
    }
    
    return readings;
  }

  private static generateValue(pattern: string, index: number, total: number): number {
    const progress = index / total;
    
    switch (pattern) {
      case 'stable':
        return 50 + Math.sin(progress * Math.PI * 2) * 5;
      
      case 'trending':
        return 30 + progress * 40;
      
      case 'erratic':
        return 50 + Math.random() * 30 - 15;
      
      case 'failing':
        return progress > 0.7 ? 80 + Math.random() * 20 : 50;
      
      default:
        return 50;
    }
  }

  private static addNoise(value: number, pattern: string): number {
    const noiseLevel = pattern === 'erratic' ? 0.2 : 0.05;
    return value + (Math.random() - 0.5) * value * noiseLevel;
  }
}
```

## Running Tests & Validation

### Quick Commands for Daily Development

```bash
# Run all tests with coverage
pnpm test:all

# Run only unit tests (fast)
pnpm test:unit

# Run performance tests with baseline check
pnpm test:perf

# Run memory leak detection
pnpm test:memory

# Generate performance report
pnpm test:perf:report

# Run specific test file
pnpm test circular-buffer.test.ts
```

### Package.json Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:all": "jest --coverage --detectOpenHandles",
    "test:unit": "jest --selectProjects unit",
    "test:perf": "jest --selectProjects performance --runInBand",
    "test:memory": "node --expose-gc ./node_modules/.bin/jest --selectProjects performance --runInBand",
    "test:watch": "jest --watch",
    "test:perf:report": "jest --selectProjects performance --runInBand --verbose"
  }
}
```

## Next Steps Checklist

### Day 1 ✓
- [ ] Project structure created
- [ ] Dependencies installed
- [ ] Jest configured
- [ ] CircularBuffer implemented
- [ ] All CircularBuffer tests passing
- [ ] Performance baselines established

### Day 2
- [ ] Aggregation logic implemented
- [ ] Aggregation tests passing
- [ ] Performance tests for aggregation
- [ ] Test data generator created

### Day 3
- [ ] Performance monitoring integrated
- [ ] Memory leak tests added
- [ ] CI/CD pipeline configured
- [ ] Documentation updated

### End of Week 1
- [ ] Code review completed
- [ ] Performance report generated
- [ ] Phase 1 retrospective
- [ ] Phase 2 planning session

## Success Metrics

You know Phase 1 is complete when:

1. **CircularBuffer**: 100% test coverage, <1μs per operation
2. **Aggregation**: Handles 100 sensors in <0.5ms
3. **Memory**: Zero growth over 1M operations
4. **Performance**: All operations within baseline ±5%
5. **CI/CD**: All tests automated and passing

---

*Remember: Start simple, test everything, measure performance from day one.*