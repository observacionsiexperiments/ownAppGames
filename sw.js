// Service worker: permet usar l'app sense connexió.
// Puja VERSIO a cada desplegament perquè els clients agafin els canvis.
const VERSIO = 'v0.11.0';
const CACHE = `appjocs-${VERSIO}`;

// Fitxers bàsics de la llançadora (rutes relatives a l'abast del SW)
const PRECACHE = [
  './',
  'index.html',
  'css/styles.css',
  'js/app.js',
  'js/reconeixedor-xifres.js',
  'js/entrada-numero.js',
  'js/celebracio.js',
  'jocs/jocs.json',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(claus =>
      Promise.all(claus.filter(k => k.startsWith('appjocs-') && k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  // HTML i jocs.json: primer xarxa (per veure novetats), si falla, memòria cau.
  const esPrimerXarxa = req.mode === 'navigate' || req.url.endsWith('jocs.json');
  if (esPrimerXarxa) {
    e.respondWith(
      fetch(req)
        .then(res => { guardar(req, res.clone()); return res; })
        .catch(() => caches.match(req).then(r => r || caches.match('index.html')))
    );
    return;
  }

  // La resta (css, js, imatges, recursos dels jocs): primer memòria cau.
  e.respondWith(
    caches.match(req).then(r => r || fetch(req).then(res => { guardar(req, res.clone()); return res; }))
  );
});

function guardar(req, res) {
  if (res.ok) caches.open(CACHE).then(c => c.put(req, res));
}
