const CACHE_PREFIX = "moonlit-atelier-shell-";
const CACHE_NAME = `${CACHE_PREFIX}v2`;
const APP_SHELL = [
  "./",
  "./index.html",
  "./anime-girl-reference.png",
  "./manifest.webmanifest",
  "./anime-planet-icon.svg",
  "./anime-planet-icon-192.png",
  "./anime-planet-icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) =>
            (cacheName.startsWith(CACHE_PREFIX) ||
              cacheName === "anime-planet-shell-v1") &&
            cacheName !== CACHE_NAME,
          )
          .map((cacheName) => caches.delete(cacheName)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  if (event.request.method !== "GET" || requestUrl.origin !== self.location.origin) {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) =>
            cache.put("./index.html", copy),
          );
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match("./index.html");
          if (!cachedPage) {
            throw new Error("The app page is unavailable offline.");
          }
          return cachedPage;
        }),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request);
    }),
  );
});
