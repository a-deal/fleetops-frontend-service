# PWA - What / Why / How

## Overview

Progressive Web App (PWA) implementation is critical for our fleet management platform to enable field operators to work effectively in remote locations with poor connectivity. This plan outlines a comprehensive approach using @serwist/next with minimal technical debt.

## Why PWA for Fleet Management

### Field Operation Requirements
- **Remote Locations**: Operators work in mines, construction sites with no/poor connectivity
- **Safety Critical**: Cannot wait for network to check equipment health
- **Data Integrity**: Maintenance actions must never be lost
- **Cost Efficiency**: Single PWA instead of native apps (60% less development)

### Core PWA Features Needed
1. **Offline Dashboard Access** - Full UI without network
2. **Telemetry Caching** - 24-hour sliding window for 100+ sensors
3. **Background Sync** - Queue and sync maintenance actions
4. **MapBox Tile Caching** - Offline equipment location maps
5. **Conflict Resolution** - Last-Write-Wins for concurrent edits

## Implementation Phases

### Phase 1: Foundation Setup
```
Step 1: Install Dependencies
├── pnpm add @serwist/next serwist
├── pnpm add -D @types/serviceworker
└── Verify installation success

Step 2: Create Service Worker
├── Create /app/sw.ts
├── Import Serwist modules
└── Configure basic caching

Step 3: Configure Next.js
├── Update next.config.js
├── Add Serwist plugin
└── Set development flags

Step 4: Create Manifest
├── Add manifest.json to public/
├── Configure app metadata
└── Add icon files
```

### Phase 2: Caching Strategy Implementation

```
Cache Architecture:
┌─────────────────────────────────────────┐
│         Caching Strategies              │
├─────────────────────────────────────────┤
│ App Shell    │ CacheFirst              │
│              │ HTML, CSS, JS, Fonts    │
├──────────────┼─────────────────────────┤
│ Equipment    │ NetworkFirst (3s)       │
│ Data         │ Falls back to cache     │
├──────────────┼─────────────────────────┤
│ Telemetry    │ StaleWhileRevalidate    │
│              │ Update in background    │
├──────────────┼─────────────────────────┤
│ Map Tiles    │ CacheFirst (7 days)     │
│              │ 500 tile limit          │
└──────────────┴─────────────────────────┘
```

### Phase 3: Telemetry Offline System

```
Data Flow:
Sensors → WebSocket → Service Worker → IndexedDB
                           ↓
                    Background Sync → Server
                           
Key Components:
├── IndexedDB with Dexie.js
├── 24-hour sliding window
├── Batch writes for 1Hz data
└── 5-minute sync intervals
```

### Phase 4: Action Queue System

```
Queue Architecture:
┌─────────────────┐     ┌─────────────────┐
│  User Action    │────▶│  IndexedDB      │
│  (Offline)      │     │  Queue Table    │
└─────────────────┘     └────────┬────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Background Sync       │
                    │   - Retry logic         │
                    │   - Exponential backoff │
                    └────────────┬────────────┘
                                 │
                         ┌───────▼────────┐
                         │    Server      │
                         │  (When Online) │
                         └────────────────┘
```

### Phase 5: Testing & Validation

```
Testing Matrix:
├── Automated Tests (Playwright)
│   ├── SW registration verification
│   ├── Offline mode simulation
│   ├── Cache validation
│   └── Sync queue testing
│
├── Manual Testing Protocol
│   ├── Cross-browser PWA install
│   ├── Offline dashboard access
│   ├── Telemetry sync validation
│   └── Memory usage monitoring
│
└── Performance Benchmarks
    ├── Lighthouse PWA: 95+ score
    ├── Time to Interactive: <3s
    ├── Offline Load: <2s
    └── Cache Size: <50MB
```

## Code Implementation

### 1. Service Worker Setup (/app/sw.ts)
```typescript
import { defaultCache } from "@serwist/next/browser";
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist } from "@serwist/sw";

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (PrecacheEntry | string)[];
};

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: defaultCache,
});
```

### 2. Next.js Configuration
```typescript
// next.config.js
import { withSerwist } from "@serwist/next";

export default withSerwist({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
```

### 3. Cache Strategies (/lib/pwa/cache-strategies.ts)
```typescript
export const fleetCacheStrategies = [
  {
    urlPattern: /^\/api\/equipment/,
    handler: "NetworkFirst",
    options: {
      cacheName: "equipment-data",
      networkTimeoutSeconds: 3,
      expiration: { 
        maxEntries: 50, 
        maxAgeSeconds: 86400 
      }
    }
  },
  {
    urlPattern: /^\/api\/telemetry/,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "telemetry-cache",
      expiration: { 
        maxEntries: 1000, 
        maxAgeSeconds: 86400 
      }
    }
  },
  {
    urlPattern: /^https:\/\/api\.mapbox\.com/,
    handler: "CacheFirst",
    options: {
      cacheName: "mapbox-tiles",
      expiration: { 
        maxEntries: 500, 
        maxAgeSeconds: 604800 // 7 days
      }
    }
  }
];
```

## Critical Decisions & Tech Debt Mitigation

### Architecture Decisions
1. **@serwist/next over alternatives** - Latest, maintained, 41K weekly downloads
2. **Dexie.js for IndexedDB** - Simpler API than raw IndexedDB
3. **Data windowing from start** - Prevent memory issues with telemetry
4. **Isolated PWA module** - All code in /lib/pwa/ for easy updates

### Adaptation Triggers
- Memory >100MB → Reduce cache sizes
- SW registration <90% → Simplify approach  
- Sync failures >5% → Add manual sync
- Field complaints → Immediate iteration

### Gap Identification
1. **Authentication Offline** - JWT refresh strategy needed
2. **Data Schema** - Confirm telemetry structure before IndexedDB
3. **Map Regions** - Which areas to pre-cache
4. **Browser Support** - Verify industrial device compatibility

## Testing Protocol

### Automated Test Example
```typescript
test("PWA installs and caches dashboard", async ({ page }) => {
  await page.goto("/");
  const swReady = await page.evaluate(() => navigator.serviceWorker.ready);
  expect(swReady).toBeTruthy();
  
  // Go offline
  await page.context().setOffline(true);
  await page.reload();
  
  // Dashboard should still load
  await expect(page.locator("h1")).toContainText("Fleet Dashboard");
});
```

### Field Simulation Checklist
- [ ] Chrome DevTools offline mode testing
- [ ] Touch target validation with gloves
- [ ] High contrast mode for outdoor use
- [ ] Low battery mode behavior
- [ ] 3G/2G network simulation
- [ ] Multi-browser compatibility

---

# Technology Diligence

## Service Worker Technology Decision: Workbox vs Alternatives

### Executive Summary
After comprehensive analysis using GPT-4o, Gemini 2.5 Pro, and Qwen Max, we have reached near-unanimous consensus on service worker technology.

**Decision**: Use Google Workbox via `@ducanh2912/next-pwa`

**Confidence**: 8.7/10 (average across models)

### Community Metrics Comparison

| Technology | GitHub Stars | NPM Downloads | Version | Last Update | Next.js Support |
|------------|-------------|---------------|---------|-------------|-----------------|
| **Workbox (Core)** | 27.5K | 1M/month | v7.x | Active | ✅ Excellent |
| **workbox-webpack-plugin** | - | 3.5M/week | v7.1.0 | Active | ✅ Native |
| **@ducanh2912/next-pwa** | 5.2K | 150K/week | 10.x | Active | ✅ Purpose-built |
| **PWA Builder** | 1.6K-6K* | 5K/week | Current | Q1 2024 | ❌ Manual |
| **Native API** | N/A | N/A | Web Standard | Evergreen | ✅ Full control |
| **sw-precache** | Deprecated | 0 | - | 2018 | ❌ Dead |
| **offline-plugin** | Deprecated | 0 | - | 2020 | ❌ Dead |

*Conflicting data between models

### Detailed Analysis

#### Why Workbox Wins

1. **Massive Adoption**
   - 3.5M weekly downloads (workbox-webpack-plugin)
   - Used by Twitter Lite, Shopify, Airbnb, Google Docs
   - Even Microsoft and Mozilla contribute to it

2. **Timeline Impact**
   - Workbox: 1-2 days implementation
   - Native API: 2-3 weeks + testing
   - PWA Builder: 1 week + compatibility issues

3. **Technical Features**
   - Pre-built caching strategies (NetworkFirst, StaleWhileRevalidate)
   - Background sync for telemetry (critical for fleet ops)
   - Automatic precaching and versioning
   - MapBox tile caching support

4. **Next.js Integration**
   - @ducanh2912/next-pwa provides seamless integration
   - Configuration via next.config.js
   - No webpack ejection required

#### Addressing Concerns

##### Google Ecosystem Lock-in
**Concern**: "Are we locked into Google's ecosystem?"

**Reality**:
- Workbox is open source (Apache 2.0)
- Implements W3C standards
- Generated service workers are portable
- Migration path exists if needed

**Mitigation**:
- Abstract Workbox config in a separate module
- Document caching strategies used
- Keep custom logic separate from Workbox

##### Future Deprecation Risk
**Concern**: "What if Workbox is deprecated?"

**Reality**:
- 27.5K stars, 1M monthly downloads
- Google, Microsoft, Mozilla all contribute
- v7 shows active development
- No signs of deprecation

**Mitigation**:
- Monitor Workbox roadmap quarterly
- Maintain upgrade path documentation
- Consider post-MVP evaluation if concerns arise

#### Native API Alternative

**When to Consider**:
- Ultra-minimal bundle size required
- Team has service worker experts
- Unique caching requirements Workbox can't handle
- Post-MVP when timeline pressure reduced

**Trade-offs**:
- ✅ Full control, no dependencies
- ❌ 2-3 weeks additional development
- ❌ Higher maintenance burden
- ❌ Risk of edge case bugs

#### PWA Builder Assessment

**Status**: Not recommended for this project

**Issues**:
- Limited Next.js integration
- Small community (5K weekly downloads)
- Documentation gaps for advanced use cases
- More suited to simple static sites

### Implementation Strategy

#### Phase 1: Basic Workbox Setup (Day 1)
```bash
pnpm add -D @ducanh2912/next-pwa
pnpm add workbox-background-sync  # For telemetry
```

#### Phase 2: Configure Caching (Day 1-2)
```javascript
// next.config.js
const withPWA = withPWAInit({
  dest: "public",
  workboxOptions: {
    runtimeCaching: [
      // Telemetry: Network first with offline queue
      {
        urlPattern: /^\/api\/telemetry/,
        handler: "NetworkFirst",
        options: {
          cacheName: "telemetry-cache",
          networkTimeoutSeconds: 3,
          plugins: [{
            handlerDidError: async () => {
              // Queue for background sync
              return caches.match('/offline-telemetry.json');
            }
          }]
        }
      },
      // MapBox tiles: Cache first
      {
        urlPattern: /^https:\/\/api\.mapbox\.com/,
        handler: "CacheFirst",
        options: {
          cacheName: "mapbox-tiles",
          expiration: {
            maxEntries: 500,
            maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
          }
        }
      }
    ]
  }
});
```

#### Phase 3: Custom Extensions (If Needed)
```javascript
// For advanced telemetry queue handling
import { Queue } from 'workbox-background-sync';

const telemetryQueue = new Queue('telemetry-queue', {
  maxRetentionTime: 24 * 60 // Retry for 24 hours
});
```

### Testing Strategy

#### Chrome DevTools
1. **Application Tab**
   - Verify service worker registration
   - Check cache storage contents
   - Test offline mode checkbox

2. **Lighthouse**
   - Run PWA audit
   - Target: 90+ PWA score
   - Fix any flagged issues

3. **Network Tab**
   - Monitor caching behavior
   - Verify offline responses
   - Check background sync

#### Automated Tests
```javascript
// playwright.test.js
test('service worker caches telemetry', async ({ page }) => {
  // Go offline
  await page.context().setOffline(true);
  
  // Attempt telemetry update
  await page.evaluate(() => {
    return fetch('/api/telemetry', {
      method: 'POST',
      body: JSON.stringify({ sensor: 'test' })
    });
  });
  
  // Verify queued response
  const response = await page.waitForResponse(r => 
    r.status() === 202 && 
    r.url().includes('/api/telemetry')
  );
  
  expect(await response.json()).toContain({ queued: true });
});
```

### Decision Matrix

| Criteria | Workbox | Native API | PWA Builder |
|----------|---------|------------|-------------|
| Timeline Fit | ✅ 1-2 days | ❌ 2-3 weeks | ⚠️ 1 week |
| Next.js Support | ✅ Excellent | ✅ Full | ❌ Poor |
| Community | ✅ 3.5M/week | N/A | ❌ 5K/week |
| Maintenance | ✅ Low | ❌ High | ⚠️ Medium |
| Flexibility | ✅ High | ✅ Ultimate | ❌ Limited |
| Risk | ✅ Low | ❌ High | ⚠️ Medium |

### Final Recommendation

**Use Workbox via @ducanh2912/next-pwa because:**

1. **Timeline**: Saves 2+ weeks vs Native API
2. **Reliability**: Battle-tested by major companies
3. **Features**: Everything needed for offline telemetry
4. **Support**: Massive community and documentation
5. **Future**: Can migrate post-MVP if needed

**Post-MVP Considerations:**
- Re-evaluate if extreme customization needed
- Consider hybrid approach for specific features
- Monitor Workbox roadmap for major changes

### Risk Mitigation

1. **Abstraction Layer**
   ```typescript
   // lib/pwa/cache-strategies.ts
   export const TELEMETRY_CACHE = {
     name: 'telemetry-cache',
     strategy: 'NetworkFirst',
     ttl: 24 * 60 * 60
   };
   ```

2. **Documentation**
   - Document all caching strategies used
   - Maintain migration guide
   - Track Workbox version changes

3. **Monitoring**
   - Track service worker errors
   - Monitor cache hit rates
   - Alert on sync failures

---
*Decision Date: 2025-07-05*
*Based on: Consensus from GPT-4o (9/10), Gemini 2.5 Pro (9/10), and Qwen Max (8/10)*
*Average Confidence: 8.7/10*

---

## Next.js Native vs Workbox: Gap Analysis Addendum

### Executive Summary
After comprehensive gap analysis using GPT-4o, Gemini 2.5 Pro, and Qwen Max, we have unanimous consensus: **Next.js native PWA capabilities are wholly insufficient** for our fleet management requirements.

**Final Decision**: Use `@ducanh2912/next-pwa` (Workbox-based)

**Confidence**: 8.3/10 (average across models)

### Gap Analysis: Next.js Native PWA Capabilities

#### What Next.js 15 Provides
1. **Static file serving** - Can serve manifest.json from public/
2. **Manual SW registration** - Can register SW from public/sw.js
3. **That's it.**

#### What Next.js 15 Does NOT Provide
1. **No service worker generation**
2. **No precaching strategies**
3. **No caching strategies** (NetworkFirst, StaleWhileRevalidate, etc.)
4. **No background sync abstractions**
5. **No push notification helpers**
6. **No asset versioning/hashing integration**
7. **No development tools**
8. **No routing logic**
9. **No cache management**
10. **No offline queue handling**

### Fleet Platform Requirements vs Next.js Capabilities

| Requirement | Next.js Native | Manual Effort Required |
|-------------|----------------|----------------------|
| **Offline telemetry caching (100+ sensors)** | ❌ None | Write custom IndexedDB + cache logic |
| **Background sync for queued updates** | ❌ None | Implement SyncManager from scratch |
| **MapBox tile caching** | ❌ None | Custom cache strategy + expiration |
| **Stale-while-revalidate** | ❌ None | Manual fetch handler logic |
| **Network-first with fallback** | ❌ None | Custom fetch event handling |
| **24-hour data retention** | ❌ None | Manual cache expiration logic |
| **Precaching app shell** | ❌ None | Manual manifest generation |
| **Cache versioning** | ❌ None | Custom version tracking |

### Timeline Impact Analysis

#### Native Implementation Breakdown
```
Week 1: Basic service worker setup
- Write SW registration logic
- Set up fetch event handlers
- Implement basic cache API usage

Week 2: Caching strategies
- Implement NetworkFirst for telemetry
- Build StaleWhileRevalidate for equipment
- Create CacheFirst for MapBox tiles

Week 3: Background sync
- Implement SyncManager API
- Build queue management system
- Handle retry logic

Week 4: Testing & edge cases
- Network condition testing
- Cache corruption handling
- Version migration logic

Week 5: Integration & debugging
- Next.js asset integration
- Route handling alignment
- Performance optimization

Total: 5 weeks (50% of MVP timeline!)
```

#### Workbox Implementation
```
Day 1:
- Install @ducanh2912/next-pwa
- Configure in next.config.js
- Set up caching strategies

Day 2:
- Add background sync
- Test offline scenarios
- Deploy

Total: 2 days
```

### Decision Criteria Analysis

| Criteria | Weight | Native Score | Workbox Score | Weighted Difference |
|----------|--------|--------------|---------------|-------------------|
| **Implementation Speed** | 30% | 1/10 | 9/10 | +2.4 |
| **Maintenance Burden** | 25% | 2/10 | 8/10 | +1.5 |
| **Feature Completeness** | 20% | 3/10 | 10/10 | +1.4 |
| **Risk of Bugs** | 15% | 2/10 | 9/10 | +1.05 |
| **Team Expertise Required** | 10% | 1/10 | 7/10 | +0.6 |
| **Total** | 100% | **1.8/10** | **8.7/10** | **+6.95** |

### Code Duplication Analysis

#### What We'd Re-implement from Workbox
```javascript
// 1. Precaching (500+ lines)
class PrecacheController {
  constructor() {
    this._urlsToCacheKeys = new Map();
    this._urlsToCacheModes = new Map();
    this._cacheKeysToIntegrities = new Map();
  }
  // ... extensive implementation
}

// 2. Background Sync (300+ lines)
class Queue {
  constructor(name, options) {
    this._name = name;
    this._queueStore = new QueueStore(this._name);
    this._addSyncListener();
  }
  // ... complex retry logic
}

// 3. Caching Strategies (400+ lines each)
class NetworkFirst {
  async handle({event, request}) {
    // ... timeout handling, cache fallback
  }
}

// 4. Routing (200+ lines)
class Router {
  constructor() {
    this._routes = new Map();
  }
  // ... pattern matching, handler selection
}

// Total: ~2000+ lines of complex, bug-prone code
```

### Risk Assessment

#### Native Implementation Risks
1. **Edge case bugs** - Offline/online transitions, partial responses
2. **Browser compatibility** - Different SW implementations
3. **Next.js conflicts** - Asset versioning mismatches
4. **Maintenance debt** - Every Next.js update may break SW
5. **Testing complexity** - Requires extensive network simulation

#### Workbox Mitigation
- Battle-tested by millions of users
- Handles edge cases automatically
- Maintained by Google Chrome team
- Integrated with Next.js ecosystem
- Comprehensive test suite included

### Industry Evidence

**Companies using Workbox:**
- Twitter Lite
- Shopify
- Pinterest
- Starbucks
- Uber
- Trivago
- The Washington Post

**Companies manually implementing service workers:**
- *(Extremely rare for complex applications)*

### Definitive Recommendation

#### Use @ducanh2912/next-pwa Because:

1. **Timeline Critical**: Saves 23-28 days (5 weeks → 2 days)
2. **Risk Reduction**: Eliminates ~2000 lines of error-prone code
3. **Feature Complete**: Everything we need is included
4. **Industry Standard**: What everyone else uses
5. **Future Proof**: Maintained and updated regularly

#### The "Native Trap"
Going native seems appealing ("no dependencies!") but is actually:
- Re-implementing a mature library
- Creating technical debt
- Risking the MVP timeline
- Ignoring industry best practices

### Implementation Plan

#### Day 1 Morning
```bash
pnpm add -D @ducanh2912/next-pwa
pnpm add workbox-background-sync
```

#### Day 1 Afternoon
Configure next.config.js with our caching strategies

#### Day 2
Test offline scenarios and deploy

#### If We Went Native
Cancel the next 4 features to make room in the timeline

### Final Verdict

**Next.js native PWA = Basic hooks only**
**Our needs = Complex offline-first platform**
**Gap = 98% of functionality missing**

The unanimous consensus across all three models is clear: attempting native PWA implementation would be **project suicide** for a 10-week MVP.

---
*Gap Analysis Date: 2025-07-05*
*Based on: Gap analysis by GPT-4o (8/10), Gemini 2.5 Pro (9/10), and Qwen Max (8/10)*
*Verdict: Use @ducanh2912/next-pwa - no other viable option exists*

---

## @ducanh2912/next-pwa vs @serwist/next: Final Comparison

### Executive Summary

After comprehensive analysis and fact-checking, we have determined the actual relationship and metrics for both libraries.

**Updated Decision**: Use `@serwist/next` for new Next.js 15 PWA implementation

**Confidence**: 8.5/10 (based on verified facts)

### Verified Facts (As of 2025-07-05)

#### Actual Download Statistics
| Library | Weekly Downloads | GitHub Stars | Version | Workbox |
|---------|-----------------|--------------|---------|---------|
| **@serwist/next** | **41,110** ✅ | ~1.5K | 9.0.15 | 7.x |
| **@ducanh2912/next-pwa** | ~20-30K | ~1.2K | 10.x | 6.5.4 |

**Critical Finding**: Gemini Pro was correct - @serwist/next has 40K+ weekly downloads, NOT the 600-1K claimed by other models.

#### Library Relationship Timeline
1. **Original**: `next-pwa` by shadowwalker (now unmaintained)
2. **Fork**: `@ducanh2912/next-pwa` by DuCanhGH (when original stopped)
3. **Evolution**: `@serwist/next` by same author DuCanhGH (complete rewrite)

**Key Fact**: @serwist is created by the SAME AUTHOR who maintained @ducanh2912/next-pwa, not the original next-pwa author.

### Feature Comparison

| Feature | @ducanh2912/next-pwa | @serwist/next |
|---------|---------------------|---------------|
| **Maintenance** | Maintenance mode | Actively developed |
| **Architecture** | Legacy approach | Modern rewrite |
| **Workbox Version** | 6.5.4 (outdated) | 7.x (latest) |
| **App Router Support** | Added later | Native from start |
| **TypeScript** | Good | Excellent |
| **Documentation** | Extensive (legacy) | Modern, growing |
| **Author Recommendation** | "Migrate to Serwist" | Current focus |

### Use Case Analysis

#### Simple PWA (Basic Caching)
- **Winner**: @serwist/next (cleaner API)

#### Complex Offline-First (Fleet Management)
- **Winner**: @serwist/next (modern Workbox 7 features)

#### Real-time Telemetry Sync
- **Winner**: @serwist/next (better background sync APIs)

#### MapBox Tile Caching
- **Winner**: Both capable, @serwist has cleaner implementation

#### Background Queue Management
- **Winner**: @serwist/next (Workbox 7 improvements)

### Fleet-Specific Evaluation

#### Why @serwist/next Wins for Fleet Management

1. **Modern Workbox 7**
   - Better background sync for telemetry
   - Improved cache expiration for MapBox tiles
   - More efficient queue management

2. **Active Development**
   - Quick bug fixes for 10-week timeline
   - Direct author support
   - Regular updates

3. **Next.js 15 Alignment**
   - Built for App Router
   - Better RSC compatibility
   - Future-proof architecture

4. **Author's Own Recommendation**
   - The maintainer of @ducanh2912/next-pwa explicitly recommends migrating to @serwist/next

### Risk Assessment

#### @ducanh2912/next-pwa Risks
- ❌ Maintenance mode only
- ❌ Outdated Workbox 6.5.4
- ❌ Author recommends against it
- ❌ May not support future Next.js versions

#### @serwist/next Advantages
- ✅ Active development
- ✅ Latest Workbox 7
- ✅ Same trusted author
- ✅ Growing community (41K downloads/week)

### Migration Path

Since this is a new project:
1. Start directly with @serwist/next
2. No migration needed
3. Benefit from latest features immediately

### Implementation Plan

#### Install Dependencies
```bash
pnpm add @serwist/next
pnpm add -D serwist
```

#### Configure next.config.js
```javascript
import { withSerwist } from "@serwist/next";

export default withSerwist({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  // Additional Next.js config
})(nextConfig);
```

#### Create Service Worker
```typescript
// app/sw.ts
import { defaultCache } from "@serwist/next/browser";
import type { PrecacheEntry } from "@serwist/precaching";
import { installSerwist } from "@serwist/sw";

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (PrecacheEntry | string)[];
};

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: defaultCache,
});
```

### Decision Matrix

| Criteria | Weight | @ducanh2912 | @serwist | Winner |
|----------|--------|-------------|----------|--------|
| **Downloads/Community** | 20% | 20-30K | 41K | @serwist |
| **Maintenance Status** | 25% | Maintenance only | Active | @serwist |
| **Workbox Version** | 20% | 6.5.4 | 7.x | @serwist |
| **Author Support** | 15% | Deprecated | Active | @serwist |
| **Documentation** | 10% | More examples | Growing | Tie |
| **Next.js 15 Support** | 10% | Retrofitted | Native | @serwist |

### Final Updated Recommendation

**Use @serwist/next because:**

1. **It's the future** - Same author's evolution of the library
2. **Better for MVP** - Active support during critical 10-week timeline
3. **Technical superiority** - Workbox 7 with better offline features
4. **Growing adoption** - 41K weekly downloads and rising
5. **Author's recommendation** - Creator explicitly says to use Serwist

The only reason to use @ducanh2912/next-pwa would be if you have existing code using it. For a new project, @serwist/next is the clear choice.

### Common Misconceptions Corrected

1. **@serwist/next has only 600 downloads** ❌
   - Reality: 41,110 weekly downloads

2. **@serwist is by the original next-pwa author** ❌
   - Reality: By the @ducanh2912/next-pwa fork author

3. **@ducanh2912/next-pwa is more mature/safer** ❌
   - Reality: It's in maintenance mode, author recommends Serwist

4. **Less documentation for @serwist** ⚠️
   - Reality: Growing docs, same concepts apply

---
*Comparison Date: 2025-07-05*
*Based on: Analysis by GPT-4o, Gemini 2.5 Pro, Qwen Max, and fact verification*
*Verified download stats from npm and author statements*

---

## Implementation Findings

### Date: 2025-07-06

During the implementation of PWA functionality for the FleetOps platform, we made several critical discoveries and decisions that diverge from the initial plan. This section documents the actual implementation details and key learnings.

### 1. Service Worker Library Decision

**Initial Plan**: Use `@ducanh2912/next-pwa`
**Actual Implementation**: `@serwist/next` (version 9.0.15)

**Rationale for Change**:
- @serwist/next is the evolution of @ducanh2912/next-pwa by the same author
- Better Next.js 15 App Router support
- Uses latest Workbox 7.x features
- Active development vs maintenance mode

### 2. Cache Busting Strategy

**Problem Discovered**: Offline mode worked in Chrome Incognito but failed in regular Chrome due to stale cached assets.

**Root Cause**: Hardcoded `PWA_VERSION = '1.0.0'` prevented proper cache invalidation between deployments.

**Solution Implemented**:
1. Created dynamic version generation script (`/scripts/generate-pwa-version.js`)
2. Version format: `{packageVersion}-{gitHash}-{timestamp}`
3. Auto-generates on every build via prebuild script
4. Service worker cleans up old versioned caches on activation

**Key Code**:
```javascript
// package.json
"scripts": {
  "prebuild": "node scripts/generate-pwa-version.js",
  "build": "pnpm run prebuild && next build"
}
```

### 3. Offline Page CSS/JS Dependencies

**Problem**: Initial implementation only cached the offline HTML page, not its CSS/JS dependencies, resulting in unstyled offline page.

**Analysis Results**:
- Offline page requires ~162KB gzipped assets (CSS + JS)
- This is a broken feature fix, not premature optimization
- User explicitly rejected inline CSS as "code smell"

**Solution**: Leveraged Serwist's automatic precache manifest generation which includes all build assets automatically.

### 4. Development Environment Configuration

**Key Findings**:
- PWA features disabled in development by default (correct approach)
- Use `pnpm dev:pwa` with `NEXT_PUBLIC_PWA_ENABLED=true` for PWA testing
- Service worker only active in production builds

### 5. Project Structure Decisions

**Organized PWA code into modular structure**:
```
/lib/pwa/
├── constants.ts    (auto-generated, includes version)
├── hooks.ts        (React hooks for PWA features)
├── register.ts     (SW registration logic)
└── utils.ts        (Helper functions)
```

### 6. Key Technical Discoveries

#### a. Prebuild Scripts in pnpm
- `prebuild` is NOT a standard lifecycle hook
- Must be explicitly chained: `"build": "pnpm run prebuild && next build"`
- This differs from npm's automatic pre/post script execution

#### b. Service Worker Activation
- Added cache cleanup during activation phase
- Deletes caches with `fleetops-` prefix not in current version
- Prevents accumulation of stale caches

#### c. TypeScript Considerations
- Required explicit typing for cache name arrays: `as string[]`
- Service worker context requires special type declarations
- Error handling wrapped in try/catch to prevent SW crashes

### 7. Testing Insights

**Chrome vs Incognito Behavior**:
- Regular Chrome: May have stale caches from previous builds
- Incognito: Always starts fresh, good for clean testing
- Solution: Dynamic versioning ensures cache invalidation

**Manual Testing Protocol**:
1. Build with `pnpm build`
2. Start with `pnpm start`
3. Visit http://localhost:3000/pwa-test
4. Test offline mode in DevTools
5. Verify in both regular and incognito modes

### 8. Performance Considerations

**Build Output Analysis**:
- Offline page: 1.19 kB (105 kB First Load JS)
- Service worker automatically includes all necessary chunks
- Total precache size manageable for target devices

### 9. Future Considerations

**Not Yet Implemented** (for future phases):
- Background sync for telemetry data
- Push notifications for critical alerts
- Offline queue management
- MapBox tile caching strategies
- JWT refresh strategy for offline auth

### 10. Lessons Learned

1. **Start Simple**: Basic offline page with automatic precaching solved 80% of immediate needs
2. **Cache Busting Critical**: Dynamic versioning is essential for PWA reliability
3. **Test in Multiple Contexts**: Regular vs Incognito Chrome revealed critical bugs
4. **Leverage Framework Features**: Serwist's automatic asset handling saved significant complexity
5. **User Feedback Valuable**: "Code smell" comment led to better architecture decision

### Implementation Timeline

- Initial setup and configuration: 2 hours
- Debugging offline CSS issue: 1 hour
- Implementing cache busting: 1 hour
- Testing and verification: 1 hour
- Total: ~5 hours (vs estimated 1-2 days)

### Next Steps

1. Monitor PWA performance in production
2. Implement telemetry background sync (Phase 2)
3. Add offline queue for user actions (Phase 3)
4. Set up automated PWA testing with Playwright

---
*Implementation Date: 2025-07-06*
*Implemented by: Claude Code + User collaboration*
*Status: Phase 1 Complete - Basic offline functionality working*