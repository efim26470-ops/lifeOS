const CACHE = 'lifeos-v10-stable-20260707-1';
const CORE = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', function(event){
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(function(cache){
    return Promise.all(CORE.map(function(url){return cache.add(url).catch(function(){return null;});}));
  }));
});
self.addEventListener('activate', function(event){
  event.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k !== CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch', function(event){
  if(event.request.method !== 'GET') return;
  var url = new URL(event.request.url);
  if(url.origin !== location.origin) return;
  event.respondWith(fetch(event.request).then(function(res){
    var copy = res.clone();
    caches.open(CACHE).then(function(cache){ cache.put(event.request, copy).catch(function(){}); });
    return res;
  }).catch(function(){
    return caches.match(event.request).then(function(cached){ return cached || caches.match('./index.html'); });
  }));
});
