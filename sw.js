const CACHE_NAME = "v1_cache";
const urlsToCache=[
  "./index.html",
  "./css/stylGe.css",//Rename in production
  "./js/main.js", 
  "./js/ajax.js",
  "./simple_html_dom.php",
  "./js/app.js",
  "./server.php",
  "./img/icon.png",
  "./img/sidenav.jpg",
  "./img/fiusac.png",
  "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js", 
  "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css", 
  "https://fonts.googleapis.com/icon?family=Material+Icons", 
  "https://fonts.googleapis.com/css?family=Roboto&display=swap", 
  "https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.10/vue.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.0.6/vue-router.min.js" 
]
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(caches => {
        return caches.addAll(urlsToCache)
          .then(() => self.skipWaiting)
      })
      .catch(err => console.log(err))
  )
})
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME]
  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => self.clients.claim())
  )
})
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) {
          return res
        }
        return fetch(e.request)
      })
  )
})