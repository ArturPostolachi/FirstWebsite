// --------------------------------Only Chashing content--------------------------

const cacheName = "v2";

self.addEventListener("install", e => {
  console.log("Service Worker: Install");
});
// ------------------------Clear Old CACHE content----------------------------

self.addEventListener("activate", e => {
  console.log("Service Worker: Activated");
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          // If the item in the cache is NOT cacheName("v2")
          if (cache !== cacheName) {
            console.log("Service Worker: Clearing all Cache");
            // We delete what is in the cache then
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// -------------Inside the fetch event we will SHOW the files OFFLINE-----------
// The real work will be done in the FETCH Event
self.addEventListener("fetch", e => {
  console.log("Service Worker: Fetching");
  e.respondWith(
    // It will only get a fetch request when you visit the pages and keep them there
    fetch(e.request)
      .then(res => {
        //   make copy/close that we get from the server
        const resClone = res.clone();
        // Open a cache
        caches.open(cacheName).then(cache => {
          //   Add response to the cache
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(err => caches.match(e.request).then(res => res))
  );
});
