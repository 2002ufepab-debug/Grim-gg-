/* Grim_gg PWA service worker */
const CACHE_NAME = "grim-gg-pwa-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=59",
  "./talents.css?v=11",
  "./layout-wide.css?v=18",
  "./visual-refresh.css?v=2",
  "./premium-update.css?v=6",
  "./mobile-optimization.css?v=38",
  "./script.js?v=100",
  "./talents.js?v=23",
  "./favicon.svg",
  "./manifest.webmanifest"
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