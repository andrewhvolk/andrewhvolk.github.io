// Generated Palabra release b2d604b1faf547af; static curriculum only. No learner records are cached here.
const CACHE='palabra-b2d604b1faf547af',ASSETS=["index.html?v=b2d604b1faf547af","app.webmanifest","icon-192.png","icon-512.png","content/application.mjs?v=b2d604b1faf547af","content/catchup.mjs?v=b2d604b1faf547af","content/communication.mjs?v=b2d604b1faf547af","content/core.mjs?v=b2d604b1faf547af","content/course.mjs?v=b2d604b1faf547af","content/culture.mjs?v=b2d604b1faf547af","content/later.mjs?v=b2d604b1faf547af","content/middle.mjs?v=b2d604b1faf547af","content/verbs.mjs?v=b2d604b1faf547af","content/vocabulary.json?v=b2d604b1faf547af","src/app.mjs?v=b2d604b1faf547af","src/assignments.mjs?v=b2d604b1faf547af","src/audio.mjs?v=b2d604b1faf547af","src/delivery.mjs?v=b2d604b1faf547af","src/drafts.mjs?v=b2d604b1faf547af","src/engine.mjs?v=b2d604b1faf547af","src/guidance.mjs?v=b2d604b1faf547af","src/persistence.mjs?v=b2d604b1faf547af","src/validation.mjs?v=b2d604b1faf547af","styles.css?v=b2d604b1faf547af"];
const urls=new Set(ASSETS.map(p=>new URL(p,self.registration.scope).href));
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(p=>new Request(new URL(p,self.registration.scope),{cache:'reload'}))))));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_RELEASE')self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith('palabra-')&&name!==CACHE)await caches.delete(name);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url),base=new URL(self.registration.scope);
 if(request.method!=='GET'||url.origin!==base.origin)return;
 const navigation=request.mode==='navigate'&&(url.pathname===base.pathname||url.pathname===base.pathname+'index.html');
 if(!navigation&&!urls.has(url.href))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE),hit=await cache.match(navigation?'index.html?v=b2d604b1faf547af':request);return hit||fetch(request);})());
});
