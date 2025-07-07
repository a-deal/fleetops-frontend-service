'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PWATestPage() {
  const [swStatus, setSwStatus] = useState<'checking' | 'registered' | 'failed' | 'unsupported'>('checking');
  const [isOnline, setIsOnline] = useState(true);
  const [cacheStatus, setCacheStatus] = useState<string>('');
  const [manifestStatus, setManifestStatus] = useState<'checking' | 'found' | 'failed'>('checking');

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(() => {
          setSwStatus('registered');
          checkCacheStatus();
        })
        .catch(() => {
          setSwStatus('failed');
        });
    } else {
      setSwStatus('unsupported');
    }

    // Check manifest
    checkManifest();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkCacheStatus = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      setCacheStatus(cacheNames.length > 0 ? `${cacheNames.length} cache(s) found` : 'No caches found');
    }
  };

  const checkManifest = async () => {
    try {
      const response = await fetch('/manifest.json');
      if (response.ok) {
        const manifest = await response.json();
        setManifestStatus('found');
        // eslint-disable-next-line no-console
        console.log('Manifest found:', manifest);
      } else {
        setManifestStatus('failed');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Manifest check failed:', error);
      setManifestStatus('failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">PWA Test Page</h1>
      
      <div className="space-y-6 max-w-2xl">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Network Status</h2>
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}>
            <span className="text-sm font-medium">
              {isOnline ? '🟢 Online' : '🔴 Offline'}
            </span>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Service Worker Status</h2>
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${
            swStatus === 'registered' ? 'bg-green-500' : 
            swStatus === 'checking' ? 'bg-yellow-500' : 
            'bg-red-500'
          }`}>
            <span className="text-sm font-medium">
              {swStatus === 'registered' && '✅ Service Worker Active'}
              {swStatus === 'checking' && '⏳ Checking...'}
              {swStatus === 'failed' && '❌ Registration Failed'}
              {swStatus === 'unsupported' && '⚠️ Not Supported'}
            </span>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">PWA Manifest Status</h2>
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${
            manifestStatus === 'found' ? 'bg-green-500' : 
            manifestStatus === 'checking' ? 'bg-yellow-500' : 
            'bg-red-500'
          }`}>
            <span className="text-sm font-medium">
              {manifestStatus === 'found' && '✅ Manifest Available'}
              {manifestStatus === 'checking' && '⏳ Checking...'}
              {manifestStatus === 'failed' && '❌ Manifest Not Found'}
            </span>
          </div>
          {manifestStatus === 'found' && (
            <p className="text-gray-300 mt-2 text-sm">
              Check console for manifest details • 
              <a href="/manifest.json" target="_blank" className="text-blue-400 hover:underline ml-1">
                View manifest.json
              </a>
            </p>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Cache Status</h2>
          <p className="text-gray-300">{cacheStatus || 'Checking...'}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Test Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Open Chrome DevTools (F12)</li>
            <li>Go to Application → Service Workers</li>
            <li>Verify service worker is active</li>
            <li>Toggle &quot;Offline&quot; checkbox to test offline mode</li>
            <li>Navigate to a non-cached page to see /offline fallback</li>
          </ol>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
          <div className="space-x-4">
            <Link href="/" className="text-blue-400 hover:underline">Home</Link>
            <a href="/offline" className="text-blue-400 hover:underline">Offline Page</a>
            <a href="/non-existent" className="text-blue-400 hover:underline">Non-cached Route</a>
          </div>
        </div>
      </div>
    </div>
  );
}