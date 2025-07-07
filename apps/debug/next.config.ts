/**
 * Next.js Configuration with PWA Support
 * 
 * This configuration file integrates Serwist for Progressive Web App functionality.
 * It handles service worker generation and registration based on environment.
 * 
 * USER CONTEXT:
 * - Production: PWA always enabled for offline field operations
 * - Development: PWA disabled by default to avoid cache headaches
 * - Testing: Enable with NEXT_PUBLIC_PWA_ENABLED=true
 * 
 * TECHNICAL CONTEXT:
 * - Serwist plugin generates and injects service worker
 * - Handles manifest injection and asset precaching
 * - Configures SW scope and registration behavior
 * 
 * CAUTION:
 * - SW in dev can cause confusing cache issues
 * - Changes require server restart to take effect
 * - Test PWA features with production build
 */

import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

// Determine if PWA should be enabled
const isPWAEnabled = 
  process.env.NODE_ENV === 'production' || 
  process.env.NEXT_PUBLIC_PWA_ENABLED === 'true';

console.log(`[Next.js Config] PWA ${isPWAEnabled ? 'enabled' : 'disabled'}`);

// Serwist configuration for PWA functionality
const serwistConfig = {
  // TypeScript service worker source
  swSrc: "app/sw.ts",
  
  // Output location for compiled service worker
  swDest: "public/sw.js",
  
  // Disable in development unless explicitly enabled
  disable: !isPWAEnabled,
  
  // Reload pages when returning online (fresh telemetry)
  reloadOnOnline: true,
  
  // Auto-register service worker
  register: true,
  
  // Service worker scope (entire app)
  scope: "/",
  
  // Exclude API routes from caching
  exclude: [/^\/api\//],
  
  // Include all static assets in precache manifest
  // This ensures CSS/JS dependencies are available offline
  additionalPrecacheEntries: [],
  
  // Increase the size limit to include all necessary chunks
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
};

// Base Next.js configuration
const nextConfig: NextConfig = {
  // Strict mode for better React development
  reactStrictMode: true,
  
  // Transpile workspace packages
  transpilePackages: [
    '@repo/ui',
    '@repo/telemetry',
    '@repo/theme'
  ],
  
  // Fix infinite recompilation in PWA dev mode by ignoring generated service worker
  webpack: (config, { isServer, dev }) => {
    if (dev && !isServer && isPWAEnabled) {
      // Create new objects to avoid read-only errors
      const newConfig = { ...config };
      newConfig.watchOptions = { ...(config.watchOptions || {}) };
      
      // Get existing ignored patterns and ensure it's an array
      const existingIgnored = config.watchOptions?.ignored;
      let ignoredArray: string[] = [];
      
      if (Array.isArray(existingIgnored)) {
        // Convert any non-strings to strings (Next.js strict validation)
        ignoredArray = existingIgnored.map(item => 
          typeof item === 'string' ? item : String(item)
        );
      } else if (existingIgnored) {
        ignoredArray = [String(existingIgnored)];
      }
      
      // Append our patterns while preserving existing ones
      newConfig.watchOptions.ignored = [
        ...ignoredArray,
        '**/public/sw.js',
        '**/public/sw.js.map'
      ];
      
      console.log('[Next.js Config] Applied sw.js watch ignore for PWA dev mode');
      return newConfig;
    }
    return config;
  },
  
  // Future: Add image domains for equipment photos
  // images: {
  //   domains: ['fleet-assets.example.com'],
  // },
};

// Initialize Serwist with config
const withSerwist = withSerwistInit(serwistConfig);

// Export with conditional PWA support
export default isPWAEnabled 
  ? withSerwist(nextConfig)
  : nextConfig;
