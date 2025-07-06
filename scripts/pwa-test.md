# PWA Manual Testing Checklist

## Test Environment Setup
- Server: http://localhost:3000
- Browser: Chrome (recommended for best DevTools)
- Environment: NEXT_PUBLIC_PWA_ENABLED=true pnpm dev:webpack

## Test 1: Service Worker Registration ✓
1. Open http://localhost:3000/pwa-test
2. Open Chrome DevTools → Application → Service Workers
3. Verify:
   - [x] Service Worker shows as "activated and running"
   - [x] Scope is set to "/"
   - [x] Source shows "sw.js"

## Test 2: Offline Mode 
1. In DevTools → Network, check "Offline"
2. Navigate to different pages
3. Verify:
   - [ ] App shell still loads
   - [ ] /offline page shows for non-cached routes
   - [ ] No errors in console

## Test 3: Network Throttling
1. In DevTools → Network, select "Slow 3G"
2. Refresh the page
3. Verify:
   - [ ] Page loads within 3 seconds
   - [ ] No loading jank

## Test 4: Cache Inspection
1. DevTools → Application → Cache Storage
2. Verify:
   - [ ] Precache exists with versioned name
   - [ ] Contains app assets (JS, CSS, HTML)

## Test 5: PWA Installation
1. Check for install prompt in address bar
2. Verify manifest:
   - [ ] DevTools → Application → Manifest
   - [ ] All icons load correctly
   - [ ] Theme colors apply

## Success Criteria
- ✅ Service Worker active
- ✅ Offline fallback works
- ✅ Performance acceptable on 3G
- ✅ Manifest valid
- ✅ No console errors

## Common Issues
- Clear cache if SW doesn't update: DevTools → Application → Storage → Clear site data
- Force update SW: DevTools → Application → Service Workers → Update
- Check console for Serwist logs