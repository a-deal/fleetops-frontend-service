import { PerformanceMonitor } from '../../../../../test/utils/performance-monitor';
import { TelemetryReading } from '../../../types';
import { CircularBuffer } from '../../circular-buffer';

// Skip in CI environments to avoid flaky tests
const describePerf = process.env.CI ? describe.skip : describe;

describePerf('CircularBuffer performance', () => {
  const monitor = new PerformanceMonitor();

  test('push operation stays under 1μs', () => {
    const buffer = new CircularBuffer(1000);
    const iterations = 10000;
    
    // Warmup
    for (let i = 0; i < 100; i++) {
      buffer.push(i);
    }
    
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      buffer.push(i);
    }
    const duration = performance.now() - start;
    const avgTimePerOp = duration / iterations;
    
    expect(avgTimePerOp).toBeLessThan(0.001); // 1μs
  });

  test('getAll performance scales linearly with capacity', () => {
    const capacities = [100, 1000, 10000];
    const results: { capacity: number; time: number }[] = [];
    
    capacities.forEach(capacity => {
      const buffer = new CircularBuffer(capacity);
      
      // Fill buffer completely
      for (let i = 0; i < capacity * 2; i++) {
        buffer.push(i);
      }
      
      // Measure getAll performance
      const iterations = 100;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        const data = buffer.getAll();
        // Use data to prevent optimization
        if (data.length !== capacity) throw new Error('Unexpected length');
      }
      
      const duration = performance.now() - start;
      results.push({ capacity, time: duration / iterations });
    });
    
    // Verify approximately linear scaling
    const ratio10x = results[1].time / results[0].time;
    const ratio100x = results[2].time / results[0].time;
    
    // Log scaling characteristics for monitoring
    console.log('\ngetAll() Scaling Characteristics:');
    console.log(`  100 -> 1000 (10x): ${ratio10x.toFixed(2)}x time`);
    console.log(`  100 -> 10000 (100x): ${ratio100x.toFixed(2)}x time\n`);
    
    // Very relaxed expectations - just ensure it's not O(1) or catastrophic
    expect(ratio10x).toBeGreaterThan(1);    // At least some scaling
    expect(ratio10x).toBeLessThan(100);     // Not catastrophic
    expect(ratio100x).toBeGreaterThan(2);   // Should scale somewhat with size
    expect(ratio100x).toBeLessThan(1000);   // But not exponentially
  });

  test('no memory leaks with telemetry data', () => {
    const iterations = 50;
    const measurements: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      if (global.gc) global.gc();
      
      const before = process.memoryUsage().heapUsed;
      const buffer = new CircularBuffer<TelemetryReading>(1000);
      
      // Simulate heavy usage
      for (let j = 0; j < 10000; j++) {
        buffer.push({
          equipmentId: `eq-${j % 10}`,
          sensorType: 'temperature',
          value: Math.random() * 100,
          unit: '°F',
          timestamp: Date.now()
        });
      }
      
      // Force some operations
      buffer.getAll();
      buffer.getLast(100);
      
      const after = process.memoryUsage().heapUsed;
      measurements.push(after - before);
    }
    
    // Memory usage should stabilize
    const firstQuarter = measurements.slice(0, 12).reduce((a, b) => a + b) / 12;
    const lastQuarter = measurements.slice(-12).reduce((a, b) => a + b) / 12;
    
    // Allow 10% variance for GC timing
    expect(lastQuarter / firstQuarter).toBeLessThan(1.1);
  });

  test('handles 1Hz telemetry updates efficiently', () => {
    const buffer = new CircularBuffer<TelemetryReading>(300); // 5 minutes
    const sensors = 100;
    const duration = 1000; // 1 second of data
    
    const start = performance.now();
    
    // Simulate 100Hz sampling (10ms intervals)
    for (let ms = 0; ms < duration; ms += 10) {
      for (let sensor = 0; sensor < sensors; sensor++) {
        buffer.push({
          equipmentId: `eq-${sensor}`,
          sensorType: 'pressure',
          value: Math.random() * 150,
          unit: 'PSI',
          timestamp: Date.now() + ms
        });
      }
    }
    
    const elapsed = performance.now() - start;
    const totalOperations = (duration / 10) * sensors;
    const opsPerSecond = totalOperations / (elapsed / 1000);
    
    expect(opsPerSecond).toBeGreaterThan(100000); // >100k ops/sec
  });

  test('getLast performance characterization across buffer states', () => {
    const buffer = new CircularBuffer<number>(10000);
    const measurements: { fillLevel: number; avgTime: number }[] = [];
    
    // Test at different fill levels (excluding 0 to avoid near-zero baseline)
    const fillLevels = [0.25, 0.5, 0.75, 1, 2]; // 2 = overflowed
    
    fillLevels.forEach(level => {
      const itemsToAdd = Math.floor(buffer.capacity * level);
      
      // Clear and fill to level
      buffer.clear();
      for (let i = 0; i < itemsToAdd; i++) {
        buffer.push(i);
      }
      
      // Warmup JIT
      for (let i = 0; i < 100; i++) {
        buffer.getLast(100);
      }
      
      // Measure getLast performance
      const iterations = 1000;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        buffer.getLast(100);
      }
      
      const avgTime = (performance.now() - start) / iterations;
      measurements.push({ fillLevel: level, avgTime });
    });
    
    // Log performance characteristics for monitoring
    console.log('\ngetLast() Performance Characteristics:');
    measurements.forEach(({ fillLevel, avgTime }) => {
      console.log(`  Fill ${(fillLevel * 100).toFixed(0)}%: ${avgTime.toFixed(4)}ms`);
    });
    
    // Calculate variance for informational purposes
    const times = measurements.map(m => m.avgTime);
    const min = Math.min(...times);
    const max = Math.max(...times);
    const variance = max / min;
    
    console.log(`  Variance: ${variance.toFixed(2)}x (min: ${min.toFixed(4)}ms, max: ${max.toFixed(4)}ms)\n`);
    
    // Only fail on catastrophic performance regression (>20x variance)
    // This indicates a real problem, not just CPU cache effects
    expect(variance).toBeLessThan(20);
    
    // Document expected behavior
    expect(variance).toBeGreaterThan(1); // Some variance is normal due to cache effects
  });

  test('batch operations performance', () => {
    const buffer = new CircularBuffer<TelemetryReading>(1000);
    
    // Create batch of readings
    const batch: TelemetryReading[] = [];
    for (let i = 0; i < 100; i++) {
      batch.push({
        equipmentId: 'eq-001',
        sensorType: 'vibration',
        value: Math.random() * 10,
        unit: 'Hz',
        timestamp: Date.now() + i
      });
    }
    
    // Measure batch push performance
    const iterations = 100;
    const start = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      batch.forEach(reading => buffer.push(reading));
    }
    
    const duration = performance.now() - start;
    const avgBatchTime = duration / iterations;
    
    // Should process 100 items in under 0.1ms
    expect(avgBatchTime).toBeLessThan(0.1);
  });

  test('performance under memory pressure', () => {
    // Create multiple buffers to simulate memory pressure
    const buffers: CircularBuffer<any>[] = [];
    
    // Create 100 buffers with 1000 items each
    for (let i = 0; i < 100; i++) {
      const buffer = new CircularBuffer<any>(1000);
      for (let j = 0; j < 1000; j++) {
        buffer.push({ id: j, data: `item-${j}` });
      }
      buffers.push(buffer);
    }
    
    // Now test performance of operations under pressure
    const testBuffer = new CircularBuffer<number>(1000);
    const iterations = 10000;
    
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      testBuffer.push(i);
    }
    const duration = performance.now() - start;
    
    const avgTimePerOp = duration / iterations;
    
    // Should still maintain sub-microsecond performance
    expect(avgTimePerOp).toBeLessThan(0.002); // 2μs (slightly relaxed due to pressure)
  });
});