const V="munajat-v3",F=["./","index.html","manifest.webmanifest","icon-v3-192.png","icon-v3-512.png","icon-v3-512-maskable.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
 if(e.request.method!="GET")return;
 const t=new AbortController(),tm=setTimeout(()=>t.abort(),4000);
 const fresh=/\.(png|webmanifest)$/.test(new URL(e.request.url).pathname);
 e.respondWith(fetch(e.request,{signal:t.signal,cache:fresh?"reload":"default"}).then(r=>{clearTimeout(tm);if(r.ok){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c))}return r}).catch(()=>{clearTimeout(tm);return caches.match(e.request).then(r=>r||caches.match("index.html"))}));
});
