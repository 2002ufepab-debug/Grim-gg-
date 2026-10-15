/* Grim_gg PWA service worker */
const CACHE_NAME = "grim-gg-pwa-v9";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=60",
  "./talents.css?v=11",
  "./layout-wide.css?v=18",
  "./visual-refresh.css?v=2",
  "./premium-update.css?v=6",
  "./mobile-optimization.css?v=41",
  "./script.js?v=105",
  "./talents.js?v=23",
  "./favicon.svg",
  "./icon-192.svg",
  "./icon-512.svg",
  "./manifest.webmanifest",
  "./data/hero-catalog.json",
  "./data/equipment-catalog.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const currentCache = await caches.open(CACHE_NAME);

    // Preserve anything already downloaded by older Grim_gg versions, including images.
    for (const key of keys) {
      if (!key.startsWith("grim-gg-pwa-") || key === CACHE_NAME) continue;
      const oldCache = await caches.open(key);
      for (const request of await oldCache.keys()) {
        if (await currentCache.match(request)) continue;
        const response = await oldCache.match(request);
        if (response) await currentCache.put(request, response);
      }
      await caches.delete(key);
    }

    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Cache images from every host used by Grim_gg: hero portraits, splash art,
  // item icons and talent icons. Most hero art is served by weserv.nl / Lara_Image,
  // not just raw.githubusercontent.com. This is cache-first and refreshes in background.
  if (request.destination === "image") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) {
        fetch(request).then(response => {
          if (response && (response.ok || response.type === "opaque")) {
            cache.put(request, response.clone()).catch(() => {});
          }
        }).catch(() => {});
        return cached;
      }
      try {
        const response = await fetch(request);
        if (response && (response.ok || response.type === "opaque")) {
          cache.put(request, response.clone()).catch(() => {});
        }
        return response;
      } catch (error) {
        const fallback = await cache.match(request);
        if (fallback) return fallback;
        throw error;
      }
    })());
    return;
  }

  if (url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          return (await cache.match(request)) || (await cache.match("./index.html"));
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkUpdate = fetch(request).then((response) => {
        if (response && response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
      return cached || networkUpdate;
    })
  );
});