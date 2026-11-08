const CACHE_NAME = "tnhs-public-v2026-11-09";
const OFFLINE_URL = "/offline.html";
const PRECACHE_URLS = [
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/images/deped-logo.png",
  "/images/tabunoc-nhs-logo-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              cacheName.startsWith("tnhs-public-") && cacheName !== CACHE_NAME,
          )
          .map((cacheName) => caches.delete(cacheName)),
      );

      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }

      await self.clients.claim();
    })(),
  );
});

function shouldBypass(request, url) {
  return (
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/api/") ||
    request.headers.has("range")
  );
}

async function cacheResponse(request, response) {
  if (response.ok && response.type === "basic") {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }

  return response;
}

async function handleNavigation(request, event) {
  try {
    const response = (await event.preloadResponse) || (await fetch(request));
    return await cacheResponse(request, response);
  } catch {
    const cachedPage = await caches.match(request, { ignoreSearch: true });
    return cachedPage || (await caches.match(OFFLINE_URL));
  }
}

async function handleStaticAsset(request, event) {
  const cachedResponse = await caches.match(request);
  const networkResponse = fetch(request)
    .then((response) => cacheResponse(request, response))
    .catch(() => null);

  if (cachedResponse) {
    event.waitUntil(networkResponse.then(() => undefined));
    return cachedResponse;
  }

  return (await networkResponse) || Response.error();
}

async function handleNetworkFirst(request) {
  try {
    return await cacheResponse(request, await fetch(request));
  } catch {
    return (
      (await caches.match(request, { ignoreSearch: true })) || Response.error()
    );
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (shouldBypass(request, url)) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request, event));
    return;
  }

  if (["font", "image", "script", "style"].includes(request.destination)) {
    event.respondWith(handleStaticAsset(request, event));
    return;
  }

  event.respondWith(handleNetworkFirst(request));
});
