// MoneyGlow AI — retired root service worker.
// The app moved to app/ (with its own app/sw.js) and the landing page now sits at the root.
// Browsers that installed the old root worker fetch this file on their next visit; it clears
// the old caches and unregisters itself so the landing page and app/ are always served fresh.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => !k.startsWith('moneyglow-v5')).map(k => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(clients => clients.forEach(c => c.navigate(c.url)))
  );
});
