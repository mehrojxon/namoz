// Internet bor bo'lsa har doim yangisini oladi, yo'q bo'lsa saqlangan nusxani ko'rsatadi.
const C = "namoz-v1";
const SHELL = ["./", "index.html", "vaqtlar.json", "manifest.json", "icon.svg"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});
self.addEventListener("activate", e => e.waitUntil(clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  if (/quran-uthmani\.txt|UthmanicHafs/.test(e.request.url)) {
    e.respondWith(caches.match(e.request.url).then(r => r || fetch(e.request.url).then(n => { const k = n.clone(); if (n.ok) caches.open(C).then(c => c.put(e.request.url, k)); return n; })));
    return;
  }
  e.respondWith(
    fetch(e.request.url, { cache: "no-store" })
      .then(r => { const k = r.clone(); caches.open(C).then(c => c.put(e.request.url, k)); return r; })
      .catch(() => caches.match(e.request.url, { ignoreSearch: true }).then(r => r || caches.match("index.html")))
  );
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
