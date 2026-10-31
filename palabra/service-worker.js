// Generated Palabra release c1f23a9e8bbbd4f9; static curriculum only. No learner records are cached here.
const CACHE='palabra-c1f23a9e8bbbd4f9',ASSETS=["index.html?v=c1f23a9e8bbbd4f9","app.webmanifest","icon-192.png","icon-512.png","content/application.mjs?v=c1f23a9e8bbbd4f9","content/catchup.mjs?v=c1f23a9e8bbbd4f9","content/communication.mjs?v=c1f23a9e8bbbd4f9","content/core.mjs?v=c1f23a9e8bbbd4f9","content/course.mjs?v=c1f23a9e8bbbd4f9","content/culture.mjs?v=c1f23a9e8bbbd4f9","content/later.mjs?v=c1f23a9e8bbbd4f9","content/middle.mjs?v=c1f23a9e8bbbd4f9","content/verbs.mjs?v=c1f23a9e8bbbd4f9","content/vocabulary.json?v=c1f23a9e8bbbd4f9","src/app.mjs?v=c1f23a9e8bbbd4f9","src/assignments.mjs?v=c1f23a9e8bbbd4f9","src/audio.mjs?v=c1f23a9e8bbbd4f9","src/delivery.mjs?v=c1f23a9e8bbbd4f9","src/drafts.mjs?v=c1f23a9e8bbbd4f9","src/engine.mjs?v=c1f23a9e8bbbd4f9","src/guidance.mjs?v=c1f23a9e8bbbd4f9","src/persistence.mjs?v=c1f23a9e8bbbd4f9","src/validation.mjs?v=c1f23a9e8bbbd4f9","styles.css?v=c1f23a9e8bbbd4f9"];
const urls=new Set(ASSETS.map(p=>new URL(p,self.registration.scope).href));
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(p=>new Request(new URL(p,self.registration.scope),{cache:'reload'}))))));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_RELEASE')self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith('palabra-')&&name!==CACHE)await caches.delete(name);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url),base=new URL(self.registration.scope);
 if(request.method!=='GET'||url.origin!==base.origin)return;
 const navigation=request.mode==='navigate'&&(url.pathname===base.pathname||url.pathname===base.pathname+'index.html');
 if(!navigation&&!urls.has(url.href))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE),hit=await cache.match(navigation?'index.html?v=c1f23a9e8bbbd4f9':request);return hit||fetch(request);})());
});
