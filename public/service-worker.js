self.addEventListener("install", (event) => {
  console.log("📦 Service Worker Installed");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("🔥 Service Worker Active");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request))
  );
});
