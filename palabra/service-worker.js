// Generated Palabra release 9c8e6b1621fb3d1c; static curriculum only. No learner records are cached here.
const CACHE='palabra-9c8e6b1621fb3d1c',ASSETS=["index.html?v=9c8e6b1621fb3d1c","app.webmanifest","icon-192.png","icon-512.png","content/application.mjs?v=9c8e6b1621fb3d1c","content/catchup.mjs?v=9c8e6b1621fb3d1c","content/communication.mjs?v=9c8e6b1621fb3d1c","content/core.mjs?v=9c8e6b1621fb3d1c","content/course.mjs?v=9c8e6b1621fb3d1c","content/culture.mjs?v=9c8e6b1621fb3d1c","content/later.mjs?v=9c8e6b1621fb3d1c","content/middle.mjs?v=9c8e6b1621fb3d1c","content/verbs.mjs?v=9c8e6b1621fb3d1c","content/vocabulary.json?v=9c8e6b1621fb3d1c","src/app.mjs?v=9c8e6b1621fb3d1c","src/assignments.mjs?v=9c8e6b1621fb3d1c","src/audio.mjs?v=9c8e6b1621fb3d1c","src/delivery.mjs?v=9c8e6b1621fb3d1c","src/drafts.mjs?v=9c8e6b1621fb3d1c","src/engine.mjs?v=9c8e6b1621fb3d1c","src/persistence.mjs?v=9c8e6b1621fb3d1c","src/validation.mjs?v=9c8e6b1621fb3d1c","styles.css?v=9c8e6b1621fb3d1c"];
const urls=new Set(ASSETS.map(p=>new URL(p,self.registration.scope).href));
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(p=>new Request(new URL(p,self.registration.scope),{cache:'reload'}))))));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_RELEASE')self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith('palabra-')&&name!==CACHE)await caches.delete(name);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url),base=new URL(self.registration.scope);
 if(request.method!=='GET'||url.origin!==base.origin)return;
 const navigation=request.mode==='navigate'&&(url.pathname===base.pathname||url.pathname===base.pathname+'index.html');
 if(!navigation&&!urls.has(url.href))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE),hit=await cache.match(navigation?'index.html?v=9c8e6b1621fb3d1c':request);return hit||fetch(request);})());
});
