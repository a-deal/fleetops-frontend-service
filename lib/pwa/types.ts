/**
 * PWA Type Declarations
 * 
 * This file provides TypeScript type definitions for our Progressive Web App implementation.
 * It extends global browser types to include PWA-specific events and service worker globals.
 * 
 * USER CONTEXT:
 * - Field operators work in remote locations (mines, construction sites) with poor connectivity
 * - They need the app to work offline for safety-critical equipment checks
 * - This file helps ensure our offline features are properly typed and won't crash
 * 
 * TECHNICAL CONTEXT:
 * - TypeScript doesn't know about Serwist/Workbox custom events by default
 * - Service Worker global scope needs proper typing for build-time safety
 * - Centralizes all PWA-related types for consistency across the app
 * 
 * CAUTION:
 * - These types must match the actual Serwist implementation
 * - Changes here affect service worker compilation
 * - Breaking changes here could prevent offline functionality
 */

declare global {
  // Extend Window event map to include Serwist lifecycle events
  interface WindowEventMap {
    'serwist-waiting': CustomEvent;      // Fired when new SW is waiting to activate
    'serwist-controlling': CustomEvent;  // Fired when SW takes control
  }
}

// Configuration interface for our PWA setup
export interface FleetPWAConfig {
  version: string;
  cacheNames: {
    precache: string;    // Cache for build-time assets
    runtime: string;     // Cache for runtime requests
    equipment: string;   // Cache for equipment data
    telemetry: string;   // Cache for telemetry data
  };
}

// Re-export for convenience
export type { PrecacheEntry } from 'serwist';