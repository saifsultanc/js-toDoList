self.addEventListener('install', event => {
    console.log("Service worker install event!");
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll(resourcesToPrecache);
            })
    );
});

self.addEventListener('activate', event => {
    console.log("Activate Event");
});

self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request)
        .then(cachedResponse => {
            return cachedResponse || fetch(event.request);
        })
    );
    //console.log("Fetch intercepted for: ", event.request.url);
});

const cacheName = 'cache-v1';
const resourcesToPrecache = [
    '/',
    'index.html',
    'to-do-list-icon.png',
    'css/all.css',
    'bootstrap.min.css',
    'main.css',
    'js/app.js',
    'js/bootstrap.bundle.min.js',
    'js/jquery-3.3.1.min.js',
];
