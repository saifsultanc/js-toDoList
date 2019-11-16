const cacheName = 'cache-v1';
const resourcesToPrecache = [
    '/',
    'index.html',
    'to-do-list-icon.png',
    'css/all.css',
    'css/bootstrap.min.css',
    'css/main.css',
    'js/app.js',
    'js/bootstrap.bundle.min.js',
    'js/jquery-3.3.1.min.js',
];

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

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Update UI notify the user they can add to home screen
    btnAdd.style.display = 'block';
});

btnAdd.addEventListener('click', (e) => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        // condition below is optional for analytics
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
        }
        
        // to reset after the user choice has been processed
        deferredPrompt = null;
    })
});
  
// for analytics
window.addEventListener('appinstalled', (evt) => {
    app.logEvent('a2hs', 'installed');
});
