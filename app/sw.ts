/**
 * FleetOps Service Worker
 * 
 * This is the main service worker file that enables offline functionality
 * for the FleetOps platform. It handles caching, offline fallbacks, and
 * background sync for field operations.
 * 
 * USER CONTEXT:
 * - Field operators often work in areas with no internet (underground mines, remote sites)
 * - Equipment data must be available offline for safety inspections
 * - Telemetry readings need to sync when connection returns
 * - App must load instantly even on slow 2G/3G networks
 * 
 * TECHNICAL CONTEXT:
 * - Uses Serwist (modern Workbox wrapper) for caching strategies
 * - Implements progressive enhancement - basic offline in Phase 1
 * - Future phases will add background sync and push notifications
 * - Precaches all static assets for instant loading
 * 
 * CAUTION:
 * - This file runs in Service Worker context (no DOM access)
 * - Changes here affect ALL users until they update
 * - Test thoroughly - SW bugs can break the entire app
 * - Use try/catch - uncaught errors kill the service worker
 */

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistOptions } from "serwist";
import { Serwist } from "serwist";

import { CACHE_NAMES, PWA_CONFIG, PWA_VERSION } from "@/lib/pwa/constants";
import { handleSWError } from "@/lib/pwa/utils";

// TypeScript declaration for service worker global scope
declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (PrecacheEntry | string)[];
  __WB_DISABLE_DEV_LOGS: boolean;
};

// Disable verbose logs in production for performance
self.__WB_DISABLE_DEV_LOGS = true;

try {
  // In development, __SW_MANIFEST might be undefined
  const manifest = self.__SW_MANIFEST || [];
  
  // The manifest automatically includes all static assets from the build
  // including CSS and JS chunks needed for pages to render properly.
  // Serwist/Next.js integration handles this for us.
  
  // Configuration for Serwist
  const serwistConfig: SerwistOptions = {
    // Precache all build assets (HTML, CSS, JS, images)
    // This ensures app shell loads offline
    precacheEntries: [
      ...manifest,
      // Explicitly version the offline page for cache busting
      { url: '/offline', revision: PWA_VERSION },
    ],
    
    // Aggressive update strategy for safety fixes
    skipWaiting: PWA_CONFIG.skipWaiting,
    clientsClaim: PWA_CONFIG.clientsClaim,
    
    // Enable navigation preload for faster page loads
    // (Browser starts network request before SW boots)
    navigationPreload: true,
    
    // Runtime caching strategies
    runtimeCaching: [
      // Use Serwist's default strategies for common assets
      ...defaultCache,
      
      // Phase 1: Basic app shell caching is handled by precache manifest
      // Phase 2 will add:
      // - NetworkFirst for telemetry API
      // - StaleWhileRevalidate for equipment data  
      // - CacheFirst for MapBox tiles
      // - Background sync for offline actions
    ],
    
    // Offline fallback configuration
    fallbacks: {
      entries: [{
        // Simple offline page for uncached routes
        url: '/offline',
        // Match navigation requests (page loads)
        matcher: ({ request }) => request.mode === 'navigate',
      }],
    },
  };
  
  // Initialize modern Serwist instance
  const serwist = new Serwist(serwistConfig);
  
  // Register event listeners for service worker lifecycle
  serwist.addEventListeners();
  
  // eslint-disable-next-line no-console
  console.log('[SW] FleetOps service worker installed successfully');
} catch (error) {
  // Log errors but don't crash - app should work without SW
  handleSWError(error as Error);
}

// Clean up old versioned caches during activation
self.addEventListener('activate', (event) => {
  const currentCaches = Object.values(CACHE_NAMES) as string[];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete caches that:
          // 1. Start with our prefix but aren't in current cache names
          // 2. Are versioned caches from previous builds
          if (cacheName.startsWith('fleetops-') && !currentCaches.includes(cacheName)) {
            // eslint-disable-next-line no-console
            console.log(`[SW] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    }).then(() => {
      // eslint-disable-next-line no-console
      console.log(`[SW] Activated with version: ${PWA_VERSION}`);
    })
  );
});

// Listen for skip waiting message from client
// This allows users to activate updates immediately
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    // eslint-disable-next-line no-console
    console.log('[SW] User requested immediate update');
    event.waitUntil(self.skipWaiting());
  }
});

// Future: Handle background sync for offline telemetry
// self.addEventListener('sync', (event) => {
//   if (event.tag === 'telemetry-sync') {
//     event.waitUntil(syncTelemetryData());
//   }
// });

// Future: Handle push notifications for critical alerts
// self.addEventListener('push', (event) => {
//   const data = event.data?.json();
//   if (data?.priority === 'critical') {
//     event.waitUntil(showCriticalAlert(data));
//   }
// });