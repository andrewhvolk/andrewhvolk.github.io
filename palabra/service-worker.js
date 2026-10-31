// Generated Palabra release f92baa39750e1611; static curriculum only. No learner records are cached here.
const CACHE='palabra-f92baa39750e1611',ASSETS=["index.html","app.webmanifest","icon-192.png","icon-512.png","content/application.mjs?v=f92baa39750e1611","content/catchup.mjs?v=f92baa39750e1611","content/communication.mjs?v=f92baa39750e1611","content/core.mjs?v=f92baa39750e1611","content/course.mjs?v=f92baa39750e1611","content/culture.mjs?v=f92baa39750e1611","content/later.mjs?v=f92baa39750e1611","content/middle.mjs?v=f92baa39750e1611","content/verbs.mjs?v=f92baa39750e1611","content/vocabulary.json?v=f92baa39750e1611","src/app.mjs?v=f92baa39750e1611","src/assignments.mjs?v=f92baa39750e1611","src/audio.mjs?v=f92baa39750e1611","src/delivery.mjs?v=f92baa39750e1611","src/drafts.mjs?v=f92baa39750e1611","src/engine.mjs?v=f92baa39750e1611","src/persistence.mjs?v=f92baa39750e1611","src/validation.mjs?v=f92baa39750e1611","styles.css?v=f92baa39750e1611"];
const urls=new Set(ASSETS.map(p=>new URL(p,self.registration.scope).href));
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_RELEASE')self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith('palabra-')&&name!==CACHE)await caches.delete(name);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url),base=new URL(self.registration.scope);
 if(request.method!=='GET'||url.origin!==base.origin)return;
 const navigation=request.mode==='navigate'&&(url.pathname===base.pathname||url.pathname===base.pathname+'index.html');
 if(!navigation&&!urls.has(url.href))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE),hit=await cache.match(navigation?'index.html':request);return hit||fetch(request);})());
});
