> ⚠️ **ARCHIVED**: This document is preserved for historical context.
> See [../testing-comprehensive-guide.md](./../testing-comprehensive-guide.md) for current practices.

# PWA Testing Guide & Results

## Overview

This document combines the PWA testing protocol and initial test results for the FleetOps platform. It serves as both a guide for ongoing testing and documentation of our PWA implementation validation.

---

## Test Results Summary (2025-07-06)

**Build Version**: 0.1.0-9c295d4-20250706043511  
**Status**: ✅ **Production-Ready** for Phase 1 (Basic Offline Functionality)

### Key Achievements

1. **Dynamic Cache Busting**: Successfully implemented, prevents stale cache issues
2. **Offline Functionality**: Fully styled offline page with all dependencies cached
3. **Service Worker**: Properly registered with automatic asset precaching
4. **Performance**: Acceptable for 3G networks (105KB for offline page)

### Performance Metrics

| Route | First Load JS | Status |
|-------|--------------|---------|
| /offline | 105 KB | ✅ Good for 3G |
| Home (/) | 312 KB | ⚠️ Needs optimization |
| Shared JS | 103 KB | ✅ Acceptable |

### Recommendations

1. **Immediate**: Implement code splitting for home page
2. **Week 1**: Configure Lighthouse CI with <150KB budget
3. **Future**: Add telemetry offline queue and MapBox caching

---

## Manual Test Protocol

### Pre-Test Setup

1. Kill any running server: `pkill -f "next start"`
2. Ensure latest build: `pnpm build`
3. Start production server: `pnpm start`
4. Open Chrome at http://localhost:3000
5. Open DevTools (F12)

### Test 1: Service Worker Registration

1. Navigate to Application tab → Service Workers
2. Verify service worker status: **Activated and running**
3. Note service worker version
4. Check "Offline" checkbox works

**Expected Results:**
- Registration successful
- Version matches build version
- Offline mode toggles correctly

### Test 2: PWA Installation

1. Look for install prompt in address bar
2. Click install and complete installation
3. Launch PWA from desktop/app drawer
4. Verify standalone window opens

**Expected Results:**
- Install prompt appears
- Installation completes successfully
- Standalone mode works correctly

### Test 3: Cache Storage Verification

1. Application tab → Storage → Cache Storage
2. Verify caches exist:
   - fleetops-precache-v{version}
   - fleetops-runtime-v{version}
   - serwist-precache-v1
3. Check precached assets include:
   - HTML files
   - CSS chunks
   - JS chunks
   - /offline page

**Expected Results:**
- All cache stores present
- Critical assets cached
- Cache size <50MB

### Test 4: 3G Performance Testing

#### Setup:
1. Network tab → Throttling → Slow 3G
2. Clear all caches (Application → Storage → Clear site data)
3. Hard refresh (Ctrl+Shift+R)

#### Metrics to Capture:
- First Contentful Paint: Target <3s
- Time to Interactive: Target <5s
- Total size transferred: Target <500KB

### Test 5: Offline Functionality

1. Enable Network → Offline
2. Test navigation to:
   - Home page (/)
   - /offline (should always work)
   - Non-cached routes (should show offline page)
3. Verify offline page elements:
   - Warning icon
   - "Working Offline" heading
   - Available features list
   - Navigation buttons
   - Full styling

**Critical**: Offline page must be fully functional with all styles applied.

### Test 6: Online/Offline Transitions

1. Start online, load a page
2. Go offline (Network → Offline)
3. Try navigating
4. Go back online
5. Verify recovery

**Expected Behavior:**
- Smooth transitions
- Appropriate error messages
- Automatic recovery when online

### Test 7: Lighthouse PWA Audit

1. DevTools → Lighthouse tab
2. Select "Mobile" device
3. Check "Progressive Web App" and "Performance"
4. Use "Simulated throttling"
5. Run audit

**Target Scores:**
- Performance: >80
- PWA: >95
- No critical PWA failures

### Test 8: Field Simulation

1. Set Network to "Offline"
2. Close all tabs
3. Open PWA from installed app
4. Verify it loads and functions

**Success Criteria:**
- Loads from cold start offline
- Critical features available
- Acceptable performance

---

## Chrome DevTools Quick Test

For rapid 3G testing during development:

```bash
# Terminal 1
pnpm build && pnpm start

# Browser
1. Open http://localhost:3000
2. F12 → Network → Slow 3G
3. F12 → Application → Service Workers → Offline
4. Test navigation and offline behavior
```

---

## Known Issues & Workarounds

### Chrome vs Incognito Caching
- **Issue**: Different behavior between regular and incognito mode
- **Solution**: Implemented dynamic versioning with cache cleanup
- **Status**: ✅ Fixed

### Home Page Bundle Size
- **Issue**: 312KB First Load JS exceeds 3G recommendations
- **Solution**: Planned code splitting and lazy loading
- **Status**: 🔧 Planned for Week 1

---

## Testing Schedule

| When | What to Test | Duration |
|------|--------------|----------|
| Before deployment | Full protocol | 30 min |
| After major features | Affected areas + performance | 15 min |
| Weekly | Lighthouse audit | 5 min |
| On field devices | Field simulation test | 20 min |

---

## Performance Budgets (Proposed)

| Metric | Budget | Current | Status |
|--------|--------|---------|---------|
| First Load JS | <150KB | 312KB (home) | ❌ |
| Time to Interactive (3G) | <3s | TBD | 🔍 |
| PWA Score | >95 | TBD | 🔍 |
| Offline Page Load | <2s | ~1s | ✅ |
| Cache Size | <50MB | ~10MB | ✅ |

---

## Next Steps

1. **Immediate**: Implement code splitting for home page bundle
2. **This Week**: Set up Lighthouse CI with these budgets
3. **Next Week**: Create Playwright tests for critical paths
4. **Ongoing**: Execute this protocol before each deployment

---

*Last Updated: 2025-07-06*  
*Next Review: After Real-Time State Management implementation*