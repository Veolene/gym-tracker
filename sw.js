// Bump CACHE_VERSION on every release (keep in sync with APP_VERSION in app.js)
const CACHE_VERSION = 'gym-tracker-v3.1.1';
const GIF_CACHE = 'gif-cache-v1'; // survives app updates; must match app.js
const GIF_HOST = 'fitnessprogramer.com';
const GIF_CACHE_LIMIT = 220;      // ~95 demos in the catalog, plus headroom

const APP_SHELL = [
    './',
    './index.html',
    './styles.css',
    './program.js',
    './exercises.js',
    './app.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/maskable-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_VERSION);
        await Promise.all(APP_SHELL.map((url) => cache.add(new Request(url, { cache: 'reload' }))));
        // One-time jump from v2: its update prompt is easily lost (any toast replaced it), which
        // would leave the phone on v2 until every window is closed. Take over right away instead;
        // v2's controllerchange handler reloads the page into this version.
        if ((await caches.keys()).includes('gym-tracker-v2.0.0')) await self.skipWaiting();
    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(
            keys.filter((k) => k !== CACHE_VERSION && k !== GIF_CACHE).map((k) => caches.delete(k))
        );
        await self.clients.claim();
    })());
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

async function trimGifCache() {
    const cache = await caches.open(GIF_CACHE);
    const keys = await cache.keys();
    for (let i = 0; i < keys.length - GIF_CACHE_LIMIT; i++) {
        await cache.delete(keys[i]);
    }
}

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    const url = new URL(event.request.url);

    // Exercise GIFs: cache-first into a separate long-lived cache.
    // Responses are opaque (no-cors <img> requests) - fine to cache and serve.
    if (url.hostname === GIF_HOST || url.hostname.endsWith('.' + GIF_HOST)) {
        event.respondWith((async () => {
            const cache = await caches.open(GIF_CACHE);
            const cached = await cache.match(event.request);
            if (cached) return cached;
            const response = await fetch(event.request);
            // Only keep real responses: opaque (type 'opaque') or a 200 - never cache a CORS-visible error
            if (response.type === 'opaque' || response.ok) {
                event.waitUntil(cache.put(event.request, response.clone()).then(trimGifCache));
            }
            return response;
        })());
        return;
    }

    // App shell: cache-first, network fallback
    if (url.origin === self.location.origin) {
        event.respondWith((async () => {
            const cache = await caches.open(CACHE_VERSION);
            const request = event.request.mode === 'navigate' ? './index.html' : event.request;
            const cached = await cache.match(request, { ignoreSearch: event.request.mode === 'navigate' });
            if (cached) return cached;
            const response = await fetch(event.request);
            if (response.ok) {
                event.waitUntil(cache.put(event.request, response.clone()));
            }
            return response;
        })());
    }
});
