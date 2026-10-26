// Saqlangan nusxa darhol ochiladi, yangilari orqada yuklanadi.
const C = "namoz-v1";
const SHELL = ["./", "index.html", "vaqtlar.json", "manifest.json", "icon.svg"];
// Qur'on bo'limi internetsiz ochilishi uchun kerakli asosiy fayllar
const CORE = ["quran-meta.json", "quran-text.json", "qp-idx.json", "quran-audio.json", "UthmanicHafs_V22.ttf", "hijriy-taqvim.json"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(SHELL).then(() => Promise.all(CORE.map(u => c.add(u).catch(() => {}))))));
  self.skipWaiting();
});
self.addEventListener("activate", e => e.waitUntil(
  caches.open(C).then(c => c.keys().then(ks => Promise.all(ks.filter(k => /qm5-\d+\.bin|mushaf-\d+\.bin/.test(k.url)).map(k => c.delete(k)))))
    .catch(() => {}).then(() => clients.claim())
));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  if (e.request.headers.has("range")) return;
  if (/qp-(\d+\.bin|idx\.json)|quran-(meta|text|audio)\.json|UthmanicHafs/.test(e.request.url)) {
    e.respondWith(caches.match(e.request.url).then(r => r || fetch(e.request.url).then(n => { const k = n.clone(); if (n.ok) caches.open(C).then(c => c.put(e.request.url, k)); return n; }).catch(() => caches.match(e.request.url, { ignoreSearch: true }).then(x => x || Response.error()))));
    return;
  }
  // Tez ochilish: saqlangan nusxa DARHOL ko'rsatiladi, yangisi orqada yuklanib saqlanadi (keyingi ochilishda tayyor).
  // Nusxa yo'q bo'lsa (birinchi marta) internetdan olinadi; internet ham yo'q bo'lsa asosiy sahifa ochiladi.
  const u = new URL(e.request.url), k = u.origin + u.pathname;
  if (u.searchParams.has("c")) { // yangilanishni tekshirish so'rovi: har doim yangi
    e.respondWith(fetch(e.request.url, { cache: "no-store" }).catch(() => caches.match(k).then(r => r || Response.error())));
    return;
  }
  e.respondWith(caches.match(k).then(hit => {
    const net = fetch(e.request.url, { cache: "no-store" }).then(r => { if (r.ok) { const cl = r.clone(); caches.open(C).then(c => c.put(k, cl)); } return r; });
    if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
    return net.catch(() => caches.match("index.html").then(x => x || Response.error()));
  }));
});

self.addEventListener("push", e => {
  let d = { title: "Jannat sari", body: "" };
  try { d = e.data.json(); } catch (x) {}
  e.waitUntil(self.registration.showNotification(d.title, {
    body: d.body, icon: "icon.svg", badge: "icon.svg", tag: d.tag || "jannat", renotify: true
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: "window" }).then(l => {
    for (const c of l) if ("focus" in c) return c.focus();
    return clients.openWindow("./");
  }));
});
