/**
 * Ghostlight Application Shell Service Worker
 * Caches core HTML, scripts, and CSS assets for offline shell availability.
 * WebLLM model weights and cache are managed independently by @mlc-ai/web-llm.
 */

const CACHE_NAME = 'ghostlight-shell-v1';
const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_ASSETS).catch((err) => {
        console.warn('Failed to precache some shell assets:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key.startsWith('ghostlight-shell')) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  // Ignore non-GET and WebLLM huggingface/wasm requests (let WebLLM manage its own caching)
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin.includes('huggingface.co') || url.origin.includes('githubusercontent.com')) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh in background
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(request).catch(() => {
        if (request.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
