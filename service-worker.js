const CACHE_PREFIX = "moonlit-atelier-shell-";
const CACHE_NAME = `${CACHE_PREFIX}v4`;
const APP_PAGE = "./index.html";
const APP_SHELL = [
  "./anime-girl-reference.png",
  "./manifest.webmanifest",
  "./anime-planet-icon.svg",
  "./anime-planet-icon-192.png",
  "./anime-planet-icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    const response = await fetch(`${APP_PAGE}?cache-bust=v4`, { cache: "reload" });
    if (!response.ok) {
      throw new Error(`Could not cache the app page: ${response.status}`);
    }
    await cache.put(APP_PAGE, response.clone());
    await cache.put("./", response);
  })());
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
      fetch(event.request, { cache: "reload" })
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) =>
            cache.put(APP_PAGE, copy),
          );
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(APP_PAGE);
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
