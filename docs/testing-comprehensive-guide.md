# FleetOps Comprehensive Testing Guide

> **Purpose**: Single source of truth for all testing practices, patterns, and learnings
> **Last Updated**: 2025-07-06
> **Status**: Living document - update as we learn

## Table of Contents
1. [Testing Philosophy](#testing-philosophy)
2. [Quick Start](#quick-start)
3. [Test Organization](#test-organization)
4. [Configuration Deep Dive](#configuration-deep-dive)
5. [Testing Patterns](#testing-patterns)
6. [Performance Testing](#performance-testing)
7. [Field Testing Requirements](#field-testing-requirements)
8. [Implementation Timeline](#implementation-timeline)
9. [Manual Testing Procedures](#manual-testing-procedures)
10. [Troubleshooting](#troubleshooting)
11. [Best Practices](#best-practices)
12. [Framework Selection History](#framework-selection-history)
13. [Current State and Learnings](#current-state-and-learnings)

## Testing Philosophy

### Core Principles

1. **Performance IS Correctness**: In safety-critical systems, being too slow equals being wrong
2. **Progressive Validation**: Each layer must be bulletproof before building the next
3. **Field Simulation First**: Test on actual hardware with realistic conditions
4. **Characterization Over Pass/Fail**: Performance tests should inform, not block

### Why These Principles Matter

Field technicians rely on this system for safety monitoring. A failure isn't just a bug - it's potential injury or equipment damage. Our testing ensures:
- Zero data loss during 12-hour shifts
- Real-time alerts arrive within 2 seconds on 2G networks
- Stable operation on low-end tablets in harsh conditions

## Quick Start

### Running Tests

```bash
# Run all unit tests (fast, runs on every commit)
pnpm test:unit

# Run performance characterization tests (informational)
pnpm test:perf

# Run all tests with coverage
pnpm test:all

# Watch mode for development
pnpm test:watch
```

### Writing Your First Test

```typescript
// lib/telemetry/stores/__tests__/unit/my-feature.test.ts
import { MyFeature } from '../../my-feature';

describe('MyFeature', () => {
  test('handles normal operation', () => {
    const feature = new MyFeature();
    expect(feature.process(data)).toBe(expected);
  });

  test('handles edge cases', () => {
    const feature = new MyFeature();
    expect(() => feature.process(null)).toThrow('Invalid input');
  });
});
```

## Test Organization

### Directory Structure

```
lib/telemetry/
├── stores/
│   ├── circular-buffer.ts
│   └── __tests__/
│       ├── unit/
│       │   ├── circular-buffer.test.ts      # Basic functionality
│       │   └── circular-buffer.property.test.ts  # Property-based tests
│       └── performance/
│           └── circular-buffer.perf.test.ts # Performance characterization
```

### Test Types

#### 1. Unit Tests
- **Purpose**: Verify individual components work correctly
- **Speed**: <100ms per test
- **Coverage**: Aim for 100% of critical paths
- **Tools**: Jest + Testing Library

#### 2. Property-Based Tests
- **Purpose**: Mathematical guarantees for safety-critical components
- **Tool**: fast-check
- **When to use**: Data structures, algorithms, invariants

#### 3. Performance Tests
- **Purpose**: Track performance characteristics over time
- **Approach**: Log metrics, don't fail on thresholds
- **Execution**: Separate from CI, run on schedule

## Configuration Deep Dive

### Jest Configuration Explained

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  projects: [
    {
      displayName: 'unit',
      preset: 'ts-jest',  // CRITICAL: Must be in each project
      testEnvironment: 'node',
      testMatch: ['<rootDir>/**/__tests__/unit/**/*.test.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1'
      },
      globals: {
        'ts-jest': {
          tsconfig: 'tsconfig.test.json'  // Separate TS config for tests
        }
      }
    },
    {
      displayName: 'performance',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/**/__tests__/performance/**/*.test.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1'
      },
      globals: {
        'ts-jest': {
          tsconfig: 'tsconfig.test.json',
          isolatedModules: true  // Faster for perf tests
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

### TypeScript Configuration for Tests

```json
// tsconfig.test.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",        // Jest requires CommonJS
    "moduleResolution": "node",  // Not "bundler" like Next.js
    "jsx": "react",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "types": ["jest", "node"]
  },
  "include": [
    "**/*.test.ts",
    "**/*.test.tsx",
    "lib/**/*",
    "test/**/*"
  ]
}
```

### Why This Configuration?

1. **Multi-project setup**: Separates concerns, allows different configs
2. **Separate TS config**: Avoids conflicts with Next.js's bundler resolution
3. **Preset in each project**: Jest doesn't inherit from top-level (learned the hard way!)

## Testing Patterns

### Pattern 1: Property-Based Testing for Safety

```typescript
import fc from 'fast-check';

test('CircularBuffer never exceeds capacity', () => {
  fc.assert(
    fc.property(
      fc.array(fc.integer()),
      fc.integer({ min: 1, max: 100 }),
      (items, capacity) => {
        const buffer = new CircularBuffer(capacity);
        items.forEach(item => buffer.push(item));
        expect(buffer.size).toBeLessThanOrEqual(capacity);
      }
    )
  );
});
```

### Pattern 2: Edge Case Testing

```typescript
test('handles JavaScript quirks', () => {
  const buffer = new CircularBuffer(10);
  buffer.push(0);
  
  // slice(-0) returns full array, but getLast(0) should return empty
  expect(buffer.getLast(0)).toEqual([]);  // NOT [0]
});
```

### Pattern 3: Performance Characterization

```typescript
test('getLast performance characterization', () => {
  const measurements: { fillLevel: number; avgTime: number }[] = [];
  
  fillLevels.forEach(level => {
    // ... setup and warmup ...
    
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      buffer.getLast(100);
    }
    const avgTime = (performance.now() - start) / iterations;
    measurements.push({ fillLevel: level, avgTime });
  });
  
  // Log for monitoring, not pass/fail
  console.log('Performance Characteristics:');
  measurements.forEach(({ fillLevel, avgTime }) => {
    console.log(`  Fill ${fillLevel * 100}%: ${avgTime.toFixed(4)}ms`);
  });
  
  // Only fail on catastrophic regression
  expect(variance).toBeLessThan(20);  // 20x is clearly wrong
});
```

## Performance Testing

### Philosophy: Characterization Over Pass/Fail

Traditional performance tests with hard thresholds are brittle:
- Hardware varies between developers and CI
- CPU caching affects results
- JIT compilation causes variance

Instead, we use **characterization tests** that:
1. Log actual performance metrics
2. Track trends over time
3. Only fail on catastrophic regressions (>10-20x)

### Example: Real Performance Test

```typescript
test('getAll() scaling characteristics', () => {
  const results = measureScaling();
  
  // Log actual results
  console.log(`10x data: ${ratio10x.toFixed(2)}x time`);
  console.log(`100x data: ${ratio100x.toFixed(2)}x time`);
  
  // Very loose bounds - just catch O(n²) mistakes
  expect(ratio10x).toBeGreaterThan(1);    // Some scaling expected
  expect(ratio10x).toBeLessThan(100);     // But not quadratic
});
```

### Performance Baselines

```json
// test/fixtures/performance-baselines.json
{
  "circularBuffer": {
    "push": { "max": 0.001, "unit": "ms" },
    "getAll": { "max": 0.1, "unit": "ms" },
    "memory": { "max": 1024, "unit": "bytes per item" }
  }
}
```

Use these for tracking trends, not hard failures.

## Field Testing Requirements

### Network Conditions Testing

Test the application under realistic field network conditions:

| Network Type | Latency | Jitter | Packet Loss | Expected Behavior |
|-------------|---------|--------|-------------|-------------------|
| 4G Good | 50ms | ±10ms | 0.1% | Full functionality |
| 3G Average | 200ms | ±50ms | 1% | <5s sync delay |
| 2G Poor | 800ms | ±200ms | 5% | <30s sync, graceful degradation |
| Tunnel Mode | ∞ | N/A | 100% | Offline mode, queue operations |

### Device Requirements

Minimum device specifications for field tablets:
- **RAM**: 2GB (4GB shared with OS)
- **Storage**: 16GB with 2GB available
- **Battery**: 8-hour operation under continuous use
- **Screen**: Readable in direct sunlight
- **Input**: Works with capacitive gloves

### Chaos Engineering Scenarios

Test system resilience with these scenarios:

1. **Kill Worker Thread**
   - Expected: Auto-restart within 5s
   - Test: `worker.terminate()` during processing

2. **Network Drop**
   - Expected: Queue data, reconnect within 30s
   - Test: Disconnect network for 2 minutes

3. **Memory Pressure**
   - Expected: Maintain last 5 minutes of data
   - Test: Allocate memory until 90% usage

4. **CPU Throttling**
   - Expected: Maintain 1Hz updates
   - Test: Limit to 10% CPU via Chrome DevTools

## Implementation Timeline

### 12-Week Rollout Plan

**Phase 1: Foundation (Weeks 1-2)**
- ✅ Jest configuration
- ✅ CircularBuffer implementation
- ✅ Property-based tests
- ✅ Performance characterization

**Phase 2: Integration (Weeks 3-4)**
- [ ] React component tests
- [ ] Zustand store integration
- [ ] WebSocket mocking with MSW

**Phase 3: E2E Setup (Weeks 5-6)**
- [ ] Playwright configuration
- [ ] Critical user journeys
- [ ] Cross-browser validation

**Phase 4: Performance (Weeks 7-8)**
- [ ] Lighthouse CI integration
- [ ] Bundle size monitoring
- [ ] Core Web Vitals tracking

**Phase 5: Field Testing (Weeks 9-10)**
- [ ] Device lab setup
- [ ] Network simulation
- [ ] Battery impact testing

**Phase 6: Hardening (Weeks 11-12)**
- [ ] Chaos engineering
- [ ] Load testing
- [ ] Documentation finalization

## Manual Testing Procedures

### PWA Installation Test

**Pre-test Setup:**
1. Build production version: `pnpm build`
2. Start server: `pnpm start`
3. Open Chrome Incognito: `http://localhost:3000`

**Test Steps:**
1. Check Application tab in DevTools
2. Verify manifest detected
3. Click install prompt
4. Confirm standalone window
5. Test offline functionality

### Performance Budget Verification

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| FCP | <1.8s | 1.2s | ✅ |
| LCP | <2.5s | 1.8s | ✅ |
| CLS | <0.1 | 0.05 | ✅ |
| TTI | <3.5s | 2.8s | ✅ |
| Bundle Size | <350KB | 312KB | ✅ |

### Testing Schedule

- **Before Deployment**: 30 min full protocol
- **After Features**: 15 min affected areas
- **Weekly**: 5 min Lighthouse audit
- **Monthly**: 2 hour field simulation

## Troubleshooting

### Common Issues and Solutions

#### 1. "Missing initializer in const declaration"
**Cause**: Jest using Babel instead of ts-jest
**Solution**: Ensure `preset: 'ts-jest'` is in EACH project config

#### 2. Performance tests failing on different hardware
**Cause**: Hard performance thresholds
**Solution**: Convert to characterization tests with loose bounds

#### 3. "Cannot find module" in tests
**Cause**: Path aliases not configured
**Solution**: Add moduleNameMapper to match tsconfig paths

#### 4. Tests pass locally but fail in CI
**Cause**: Environment differences (Node version, CPU, memory)
**Solution**: 
- Use Node version from .nvmrc
- Make performance tests informational only
- Add warmup iterations

## Best Practices

### 1. Test Naming
```typescript
// ✅ GOOD: Descriptive, specific
test('CircularBuffer.push overwrites oldest item when at capacity', () => {});

// ❌ BAD: Vague
test('push works', () => {});
```

### 2. Test Structure
```typescript
describe('CircularBuffer', () => {
  describe('when empty', () => {
    test('size returns 0', () => {});
    test('getAll returns empty array', () => {});
  });
  
  describe('when at capacity', () => {
    test('push overwrites oldest item', () => {});
    test('size remains constant', () => {});
  });
});
```

### 3. Avoid Skipping Tests
Instead of skipping flaky tests:
1. Convert to characterization tests
2. Move to separate test suite
3. Fix the root cause
4. Document why if truly necessary

### 4. Memory Testing for Field Devices
```typescript
test('no memory leaks under pressure', () => {
  const iterations = 1000;
  const measurements: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    if (global.gc) global.gc();  // Force GC if available
    
    const before = process.memoryUsage().heapUsed;
    // ... operations ...
    const after = process.memoryUsage().heapUsed;
    
    measurements.push(after - before);
  }
  
  // Memory should stabilize, not grow
  const firstHalf = average(measurements.slice(0, 500));
  const secondHalf = average(measurements.slice(500));
  expect(secondHalf / firstHalf).toBeLessThan(1.1);  // Max 10% growth
});
```

## Framework Selection History

### Why Jest Over Vitest?

**The Decision**: Jest was chosen unanimously (8-9/10 confidence) after comprehensive analysis.

#### Alternatives Considered:
- **Vitest**: 3-5x faster execution but less mature ecosystem
- **Mocha/Chai**: More flexible but requires assembling pieces
- **Jasmine**: Older, less React-focused community

#### Key Decision Factors:
1. **Ecosystem Maturity**: Jest has years of battle-testing in production
2. **All-in-one Solution**: Test runner + assertions + mocking built-in
3. **Zero Configuration**: Works out-of-the-box with Next.js/TypeScript
4. **Industry Standard**: Used by Facebook, Airbnb, Spotify
5. **Documentation**: Extensive guides and community resources

**Trade-off**: We accepted Jest's slower speed for its stability and ecosystem. The speed difference (30s vs 10s for unit tests) was deemed acceptable given our optimization strategies.

### Why Playwright Over Cypress?

**The Decision**: Playwright chosen for its modern architecture and multi-browser support.

#### Alternatives Considered:
- **Cypress**: Great DX but poor multi-tab support, paid parallelization
- **Selenium**: Mature but slower, higher maintenance
- **Puppeteer**: Chrome-only, lacks test runner

#### Key Decision Factors:
1. **Multi-browser Support**: Chromium, Firefox, WebKit (critical for PWA)
2. **Out-of-process Architecture**: More reliable than in-browser tools
3. **Auto-waiting**: Significantly reduces flaky tests
4. **Built-in Features**: Visual regression, accessibility, tracing
5. **Free Parallelization**: No artificial limits on CI

**Trade-off**: We accepted Playwright's newer ecosystem for its superior architecture and features.

### Consensus Process

This decision was reached through multi-model consensus analysis:
- **o4-mini**: Assigned FOR stance, provided speed optimization strategies
- **Gemini Pro**: Assigned AGAINST stance, pushed for newer alternatives
- **DeepSeek**: Assigned NEUTRAL stance, provided balanced analysis

All models converged on Jest + Playwright with 8-9/10 confidence, validating the robustness of this choice.

## Current State and Learnings

### What's Implemented
- ✅ CircularBuffer with full test coverage
- ✅ Property-based tests for mathematical guarantees
- ✅ Performance characterization tests
- ✅ Multi-project Jest configuration
- ✅ TypeScript integration working correctly

### Recent Learnings
1. **Jest projects don't inherit parent config** - Each needs its own preset
2. **Performance varies 2-8x on different hardware** - Use characterization
3. **slice(-0) returns full array** - Watch for JS quirks in tests
4. **Separate tsconfig for tests** - Avoids Next.js conflicts

### Next Steps
1. Implement aggregation logic with same test patterns
2. Add integration tests for React components
3. Set up performance tracking dashboard
4. Create field simulation test environment

## Related Documentation
- [Phase 1 Implementation](./phase-1-telemetry-implementation.md) - Current telemetry progress
- [Real-Time State Architecture](./real-time-state-architecture-v2.md) - System design
- [Telemetry Quickstart](./telemetry-implementation-quickstart.md) - Quick reference

### Archived Documentation
Historical documents preserved for reference:
- [Testing Suite Strategy](./archive/testing-suite-strategy.md) - Original framework selection
- [Telemetry Testing Strategy](./archive/telemetry-testing-strategy.md) - Initial approach
- [PWA Testing Guide](./archive/pwa-testing-guide.md) - Manual testing procedures

---

Remember: In safety-critical systems, the test is as important as the code. When in doubt, add another test.