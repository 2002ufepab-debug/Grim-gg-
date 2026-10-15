/* Grim_gg PWA service worker */
const CACHE_NAME = "grim-gg-pwa-v4";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=59",
  "./talents.css?v=11",
  "./layout-wide.css?v=18",
  "./visual-refresh.css?v=2",
  "./premium-update.css?v=6",
  "./mobile-optimization.css?v=39",
  "./script.js?v=101",
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
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key.startsWith("grim-gg-pwa-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Cache community-hosted hero/equipment artwork as it is viewed online.
  // Opaque image responses are valid cache entries and can be displayed offline.
  const isCommunityImage = request.destination === "image"
    && url.hostname === "raw.githubusercontent.com"
    && (url.pathname.includes("/images-hero/") || url.pathname.includes("/logo-equipment/"));
  if (isCommunityImage) {
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