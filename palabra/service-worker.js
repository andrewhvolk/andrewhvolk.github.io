// Generated Palabra release d3dee7c2635f5bb6; static curriculum only. No learner records are cached here.
const CACHE='palabra-d3dee7c2635f5bb6',ASSETS=["index.html?v=d3dee7c2635f5bb6","app.webmanifest","icon-192.png","icon-512.png","content/application.mjs?v=d3dee7c2635f5bb6","content/catchup.mjs?v=d3dee7c2635f5bb6","content/communication.mjs?v=d3dee7c2635f5bb6","content/core.mjs?v=d3dee7c2635f5bb6","content/course.mjs?v=d3dee7c2635f5bb6","content/culture.mjs?v=d3dee7c2635f5bb6","content/later.mjs?v=d3dee7c2635f5bb6","content/middle.mjs?v=d3dee7c2635f5bb6","content/verbs.mjs?v=d3dee7c2635f5bb6","content/vocabulary.json?v=d3dee7c2635f5bb6","src/app.mjs?v=d3dee7c2635f5bb6","src/assignments.mjs?v=d3dee7c2635f5bb6","src/audio.mjs?v=d3dee7c2635f5bb6","src/delivery.mjs?v=d3dee7c2635f5bb6","src/drafts.mjs?v=d3dee7c2635f5bb6","src/engine.mjs?v=d3dee7c2635f5bb6","src/guidance.mjs?v=d3dee7c2635f5bb6","src/persistence.mjs?v=d3dee7c2635f5bb6","src/validation.mjs?v=d3dee7c2635f5bb6","styles.css?v=d3dee7c2635f5bb6"];
const urls=new Set(ASSETS.map(p=>new URL(p,self.registration.scope).href));
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(p=>new Request(new URL(p,self.registration.scope),{cache:'reload'}))))));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_RELEASE')self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith('palabra-')&&name!==CACHE)await caches.delete(name);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url),base=new URL(self.registration.scope);
 if(request.method!=='GET'||url.origin!==base.origin)return;
 const navigation=request.mode==='navigate'&&(url.pathname===base.pathname||url.pathname===base.pathname+'index.html');
 if(!navigation&&!urls.has(url.href))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE),hit=await cache.match(navigation?'index.html?v=d3dee7c2635f5bb6':request);return hit||fetch(request);})());
});
