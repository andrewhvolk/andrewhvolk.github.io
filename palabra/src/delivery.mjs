export async function initDelivery(){
 const output=document.querySelector('#delivery-state'),banner=document.querySelector('#app-update'),installButton=document.querySelector('[data-action=install-app]');
 let registration=null,prompt=null,updating=false,ready=false;
 const show=()=>{output.textContent=ready?(navigator.onLine?'Ready offline on this device · progress stays local':'Offline · cached lessons available · progress stays local'):'Preparing this device for offline study…';};
 const notify=()=>{banner.hidden=!registration?.waiting;};
 const controls={async update(){if(!registration?.waiting){await registration?.update();notify();return false;}updating=true;registration.waiting.postMessage({type:'ACTIVATE_RELEASE'});return true;},async install(){if(!prompt)return;await prompt.prompt();await prompt.userChoice;prompt=null;installButton.hidden=true;}};
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();prompt=event;installButton.hidden=false;});
 window.addEventListener('online',show);window.addEventListener('offline',show);
 if(!document.querySelector('meta[name=palabra-release]')){output.textContent='Development preview · offline caching is available in built releases.';return controls;}
 if(!('serviceWorker'in navigator)){output.textContent='Offline caching is unavailable in this browser. Use online study and backups.';return controls;}
 try{show();registration=await navigator.serviceWorker.register(new URL('../service-worker.js',import.meta.url),{updateViaCache:'none'});ready=!!registration.active;show();notify();
  registration.addEventListener('updatefound',()=>{const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'){ready=!!registration.active;show();notify();}});});
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(updating)location.reload();else{ready=true;show();}});
  navigator.serviceWorker.ready.then(()=>{ready=true;show();notify();});
  setTimeout(()=>{if(!ready)output.textContent='Offline cache is not ready. Stay online and reload before relying on offline study.';},15000);
 }catch{output.textContent='Offline cache could not be prepared. Online study and local progress still work.';}
 return controls;
}
