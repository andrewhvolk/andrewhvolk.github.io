// Generated Palabra release 6031c9fb9a37f249; static curriculum only. No learner records are cached here.
const CACHE='palabra-6031c9fb9a37f249',ASSETS=["index.html?v=6031c9fb9a37f249","app.webmanifest","icon-192.png","icon-512.png","content/application.mjs?v=6031c9fb9a37f249","content/catchup.mjs?v=6031c9fb9a37f249","content/communication.mjs?v=6031c9fb9a37f249","content/core.mjs?v=6031c9fb9a37f249","content/course.mjs?v=6031c9fb9a37f249","content/culture.mjs?v=6031c9fb9a37f249","content/later.mjs?v=6031c9fb9a37f249","content/middle.mjs?v=6031c9fb9a37f249","content/verbs.mjs?v=6031c9fb9a37f249","content/vocabulary.json?v=6031c9fb9a37f249","src/app.mjs?v=6031c9fb9a37f249","src/assignments.mjs?v=6031c9fb9a37f249","src/audio.mjs?v=6031c9fb9a37f249","src/delivery.mjs?v=6031c9fb9a37f249","src/drafts.mjs?v=6031c9fb9a37f249","src/engine.mjs?v=6031c9fb9a37f249","src/guidance.mjs?v=6031c9fb9a37f249","src/persistence.mjs?v=6031c9fb9a37f249","src/validation.mjs?v=6031c9fb9a37f249","styles.css?v=6031c9fb9a37f249"];
const urls=new Set(ASSETS.map(p=>new URL(p,self.registration.scope).href));
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(p=>new Request(new URL(p,self.registration.scope),{cache:'reload'}))))));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_RELEASE')self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith('palabra-')&&name!==CACHE)await caches.delete(name);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url),base=new URL(self.registration.scope);
 if(request.method!=='GET'||url.origin!==base.origin)return;
 const navigation=request.mode==='navigate'&&(url.pathname===base.pathname||url.pathname===base.pathname+'index.html');
 if(!navigation&&!urls.has(url.href))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE),hit=await cache.match(navigation?'index.html?v=6031c9fb9a37f249':request);return hit||fetch(request);})());
});
