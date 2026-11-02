const CACHE_NAME = "by-notes-v2";

const FILES = [
    "/BY-QuickNotes/",
    "/BY-QuickNotes/index.html",
    "/BY-QuickNotes/manifest.json"
];

self.addEventListener("install", event => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES))
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(
                            "/BY-QuickNotes/",
                            copy
                        ));
                    return response;
                })
                .catch(() => caches.match("/BY-QuickNotes/"))
        );
    }
});
