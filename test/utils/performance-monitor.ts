import * as fs from 'fs';
import * as path from 'path';

interface MeasureResult {
  name: string;
  average: number;
  min: number;
  max: number;
  p95: number;
  regression: number;
  pass: boolean;
  avgTimePerOp?: number;
}

export class PerformanceMonitor {
  private baselines: Map<string, number>;
  private results: Map<string, number[]> = new Map();

  constructor() {
    this.baselines = this.loadBaselines();
  }

  private loadBaselines(): Map<string, number> {
    const baselinePath = path.join(__dirname, '../fixtures/performance-baselines.json');
    try {
      const data = JSON.parse(fs.readFileSync(baselinePath, 'utf-8'));
      const map = new Map<string, number>();
      
      // Flatten nested structure
      Object.entries(data).forEach(([category, metrics]) => {
        Object.entries(metrics as any).forEach(([metric, spec]: [string, any]) => {
          map.set(`${category}.${metric}`, spec.max);
        });
      });
      
      return map;
    } catch (error) {
      console.warn('Could not load baselines:', error);
      return new Map();
    }
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
    
    const avg = this.average(measurements);
    const baseline = this.baselines.get(name);
    const regression = baseline ? ((avg - baseline) / baseline) * 100 : 0;
    
    return {
      name,
      average: avg,
      min: Math.min(...measurements),
      max: Math.max(...measurements),
      p95: this.percentile(measurements, 95),
      regression,
      pass: !baseline || regression < 5, // 5% tolerance
      avgTimePerOp: avg
    };
  }

  private average(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  private percentile(arr: number[], p: number): number {
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index];
  }

  generateReport(): void {
    console.log('\n=== Performance Report ===\n');
    
    this.results.forEach((measurements, name) => {
      const baseline = this.baselines.get(name);
      const current = this.average(measurements);
      const regression = baseline ? ((current - baseline) / baseline) * 100 : 0;
      
      console.log(`${name}:`);
      console.log(`  Baseline: ${baseline?.toFixed(3)}ms`);
      console.log(`  Current:  ${current.toFixed(3)}ms`);
      console.log(`  Change:   ${regression > 0 ? '+' : ''}${regression.toFixed(1)}%`);
      console.log(`  Status:   ${regression < 5 ? '✅ PASS' : '❌ FAIL'}\n`);
    });
  }
}

// Export helper functions for tests
export function average(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function percentile(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[index];
}