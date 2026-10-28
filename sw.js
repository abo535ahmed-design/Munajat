/* مناجاة — Service Worker: يجلب النسخة الأحدث أولًا، ويعمل بدون إنترنت من النسخة المخزّنة */
const V = "munajat-cache";
const CORE = ["./", "index.html", "manifest.webmanifest", "icon-192.png"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(V).then(c => Promise.all(
    CORE.map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {}))
  )));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  const net = fetch(r, { cache: "no-cache" }).then(res => {
    if (res && res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); }
    return res;
  });
  const wait = new Promise(res => setTimeout(() => res(null), 3500));
  e.respondWith(
    Promise.race([net.catch(() => null), wait]).then(res =>
      res || caches.match(r).then(m => m || net.catch(() => caches.match("index.html")))
    )
  );
});
