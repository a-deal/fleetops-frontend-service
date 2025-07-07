"use client";

/**
 * Offline Fallback Page
 * 
 * This page is shown when users try to access uncached content while offline.
 * It provides a clear, non-technical explanation and actionable next steps.
 * 
 * USER CONTEXT:
 * - Field operators may not understand technical network errors
 * - They need to know what data IS available offline
 * - Clear guidance on how to get back online is critical
 * - Must not alarm users - offline is expected in their work
 * 
 * TECHNICAL CONTEXT:
 * - Served by service worker when network fails
 * - Must be lightweight and self-contained
 * - No external dependencies (they won't load offline)
 * - Cached as part of app shell during SW install
 * 
 * DESIGN PRINCIPLES:
 * - Reassuring tone - offline is normal, not an error
 * - Focus on what WORKS, not what doesn't
 * - Industrial design matching fleet theme
 * - Large touch targets for gloved hands
 */

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Status Card */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-8 shadow-2xl">
          {/* Offline Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                />
              </svg>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl font-bold text-neutral-100 text-center mb-2">
            Working Offline
          </h1>
          <p className="text-neutral-400 text-center mb-8">
            You&apos;re in offline mode. Core features remain available.
          </p>

          {/* Available Features */}
          <div className="space-y-3 mb-8">
            <h2 className="text-sm font-medium text-neutral-300 uppercase tracking-wider">
              Available Offline:
            </h2>
            <ul className="space-y-2">
              <li className="flex items-center text-neutral-300">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Equipment specifications & manuals
              </li>
              <li className="flex items-center text-neutral-300">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Recent telemetry data (24 hours)
              </li>
              <li className="flex items-center text-neutral-300">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Safety checklists & procedures
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full px-6 py-3 bg-amber-500 text-neutral-900 font-medium rounded-lg hover:bg-amber-400 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-6 py-3 bg-neutral-700 text-neutral-100 font-medium rounded-lg hover:bg-neutral-600 transition-colors"
            >
              Home Screen
            </button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-neutral-500 text-center mt-6">
            Data will sync automatically when connection returns
          </p>
        </div>
      </div>
    </div>
  );
}