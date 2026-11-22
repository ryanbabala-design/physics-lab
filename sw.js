// 智忠大人的教學模擬器：離線快取
// 版本號會隨網站內容自動改變；更新後 iPad 下次有網路時會自動換成新版。
const CACHE = 'lab-3d363f1c49';
const PAGES = ["./", "index.html", "sims.js", "lab.js", "lab-audio.js", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png", "wave-propagation.html", "sound-medium-speed.html", "echo-sonar.html", "sound-three-elements.html", "sound-frequency-20k.html", "sound-spectrum-25k.html", "spectrogram-2d.html", "tuning-fork.html", "string-instrument.html", "water-glass-tube.html", "bat-echolocation.html", "pinhole.html", "reflection-law.html", "plane-mirror-drawing.html", "plane-mirror-image.html", "curved-mirrors.html", "wheel-refraction-model.html", "refraction-total-reflection.html", "lens-surface-refraction.html", "lens-types.html", "lens-black-box.html", "lens-imaging.html", "eye-vision.html", "optical-instruments.html", "dispersion-color.html", "heat-transfer.html", "specific-heat.html", "buoyancy.html", "torque-balance.html", "ice-push.html", "satellite-orbit.html"];
const EXT = ["https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css", "https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.min.js", "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap", "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;700&display=swap", "https://unpkg.com/@phosphor-icons/web", "https://unpkg.com/lucide@latest"];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(PAGES);
    await Promise.all(EXT.map(async (u) => {
      try {
        // 樣式表另外抓出裡面引用的字型檔，離線時圖示和字型才不會消失
        if (/\.css(\?|$)|fonts\.googleapis\.com\/css/.test(u)) {
          const r = await fetch(u, { mode: 'cors' });
          if (r.ok) {
            const text = await r.clone().text();
            await c.put(u, r);
            const urls = [...text.matchAll(/url\((['"]?)([^'")]+)\1\)/g)].map(m => new URL(m[2], u).href).filter(x => x.startsWith('http'));
            await Promise.all([...new Set(urls)].map(async (f) => { try { const fr = await fetch(f, { mode: 'cors' }); if (fr.ok) await c.put(f, fr); } catch (_) {} }));
            return;
          }
        }
        const r = await fetch(u, { mode: 'no-cors' });
        await c.put(u, r);
      } catch (_) {}
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('lab-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // 本站網頁：先用存好的版本（秒開），同時在背景更新
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      const hit = await c.match(req, { ignoreSearch: true });
      const net = fetch(req).then((r) => { if (r.ok) c.put(url.pathname.endsWith('/') ? req : new Request(url.origin + url.pathname), r.clone()); return r; }).catch(() => null);
      return hit || (await net) || new Response('目前沒有網路，這一頁還沒存到裝置上。', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    })());
  } else {
    // 外部元件（樣式、圖示、字型、音效）：有存就用存的，沒有就上網抓並存起來
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      const hit = await c.match(req, { ignoreVary: true });
      if (hit) return hit;
      try { const r = await fetch(req); if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }
      catch (err) { return Response.error(); }
    })());
  }
});
