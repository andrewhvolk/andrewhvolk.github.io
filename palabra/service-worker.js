// Generated Palabra release 4ebb911b0e7554fd; static curriculum only. No learner records are cached here.
const CACHE='palabra-4ebb911b0e7554fd',ASSETS=["index.html","app.webmanifest","icon-192.png","icon-512.png","content/application.mjs?v=4ebb911b0e7554fd","content/catchup.mjs?v=4ebb911b0e7554fd","content/communication.mjs?v=4ebb911b0e7554fd","content/core.mjs?v=4ebb911b0e7554fd","content/course.mjs?v=4ebb911b0e7554fd","content/culture.mjs?v=4ebb911b0e7554fd","content/later.mjs?v=4ebb911b0e7554fd","content/middle.mjs?v=4ebb911b0e7554fd","content/verbs.mjs?v=4ebb911b0e7554fd","content/vocabulary.json?v=4ebb911b0e7554fd","src/app.mjs?v=4ebb911b0e7554fd","src/assignments.mjs?v=4ebb911b0e7554fd","src/audio.mjs?v=4ebb911b0e7554fd","src/delivery.mjs?v=4ebb911b0e7554fd","src/drafts.mjs?v=4ebb911b0e7554fd","src/engine.mjs?v=4ebb911b0e7554fd","src/persistence.mjs?v=4ebb911b0e7554fd","src/validation.mjs?v=4ebb911b0e7554fd","styles.css?v=4ebb911b0e7554fd"];
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
