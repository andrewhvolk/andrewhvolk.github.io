import {emptyStore,newProfile,SCHEMA,CONTENT_VERSION,defaultSettings} from './engine.mjs?v=58415db71aab4d54';
export const MAX_BACKUP_BYTES=64*1024*1024;
const plain=x=>x&&typeof x==='object'&&!Array.isArray(x);
const assert=(ok,message)=>{if(!ok)throw Error(`${message} Nothing was changed.`);};
const timestamp=x=>Number.isFinite(x)&&x>=0&&x<=8640000000000000;
function settings(s,sections,chapters){
  assert(plain(s),'Missing preferences.');
  assert(Object.keys(s).every(k=>Object.hasOwn(defaultSettings,k)),'settings: unknown preference field.');
  assert(Array.isArray(s.sections)&&s.sections.every(id=>sections.includes(id)),'Invalid vocabulary filters.');
  assert(['es-en','en-es','mixed'].includes(s.direction)&&[10,20,30,50].includes(s.limit),'Invalid review preferences.');
  assert(typeof s.verbsOnly==='boolean','settings.verbsOnly must be true or false.');
  assert(chapters.has(s.position),'settings.position is not a known chapter.');
  assert([10,15,20].includes(s.minutes),'settings.minutes must be 10, 15 or 20.');
  assert(Number.isInteger(s.newLimit)&&s.newLimit>=0&&s.newLimit<=20,'settings.newLimit must be an integer from 0 to 20.');
  assert(typeof s.vosotros==='boolean','settings.vosotros must be true or false.');
  assert(Number.isFinite(s.speed)&&s.speed>=.5&&s.speed<=1.25,'settings.speed must be between 0.5 and 1.25.');
  return {...structuredClone(defaultSettings),...s};
}
function progress(input,ids){
  assert(plain(input),'Invalid card progress.');const valid={},unknown={};
  for(const [id,p]of Object.entries(input)){
    assert(plain(p)&&Number.isInteger(p.box)&&p.box>=1&&p.box<=5&&Number.isInteger(p.reviews)&&p.reviews>=1&&p.reviews<=1000000&&Number.isInteger(p.correct)&&p.correct>=0&&p.correct<=p.reviews&&timestamp(p.due)&&timestamp(p.lastReview),'Invalid card schedule.');
    if(ids.has(id))valid[id]=structuredClone(p);else unknown[id]=structuredClone(p);
  }return {valid,unknown};
}
export function previewBackup(raw,cards,sections,content){
  assert(typeof raw==='string'&&new TextEncoder().encode(raw).length<=MAX_BACKUP_BYTES,'Choose a backup smaller than 64 MB.');let data;
  try{data=JSON.parse(raw);}catch{throw Error('This is not valid JSON. Nothing was changed.');}
  assert(plain(data)&&data.format==='palabra-backup'&&[1,SCHEMA].includes(data.version),'Unsupported Palabra backup.');
  const ids=new Set(cards.map(c=>c.id)), sectionIds=sections.map(s=>s.id),chapters=new Set(content.chapters.map(c=>c.id));let store,matched=0,unmatched=0;
  if(data.version===1){
    const r=progress(data.progress,ids);matched=Object.keys(r.valid).length;unmatched=Object.keys(r.unknown).length;
    assert(!data.history||Array.isArray(data.history),'Invalid history.');
    const history=(data.history||[]);assert(history.every(h=>plain(h)&&typeof h.id==='string'&&typeof h.correct==='boolean'&&timestamp(h.at)),'Invalid review history.');
    store=emptyStore();const p=newProfile('legacy','Imported vocabulary');p.onboarded=true;p.progress=r.valid;p.history=history.filter(h=>ids.has(h.id));
    const legacy=data.settings??{};
    assert(plain(legacy),'settings must be an object.');
    assert(Object.keys(legacy).every(k=>['sections','direction','limit','verbsOnly'].includes(k)),'settings: unknown legacy preference field.');
    const s={...structuredClone(defaultSettings),...legacy};
    assert(Array.isArray(s.sections)&&s.sections.every(id=>typeof id==='string'),'settings.sections must be a list of chapter IDs.');
    // A removed section is reported and retained in the recovery, not silently lost.
    const unknownSections=(s.sections||[]).filter(id=>!sectionIds.includes(id));s.sections=(s.sections||defaultSettings.sections).filter(id=>sectionIds.includes(id));
    p.settings=settings(s,sectionIds,chapters);store.profiles=[p];store.activeProfile=p.id;
    store.recovery=[{reason:'Original v1 import. Unmatched records remain here; original due timestamps are retained until the next review.',raw:data,unknownIds:Object.keys(r.unknown),unknownSections}];
  }else{
    store=structuredClone(data.state);
    assert(plain(store)&&store.version===SCHEMA&&Array.isArray(store.profiles)&&store.profiles.length>0&&store.profiles.length<=50,'Invalid profile collection.');
    assert(store.contentVersion===CONTENT_VERSION,'Content version mismatch; use a backup from this release.');
    assert(Number.isInteger(store.revision)&&store.revision>=0&&Array.isArray(store.recovery),'Invalid state metadata.');
    const pids=new Set();
    const exIds=new Set(content.exercises.map(e=>e.id)), objIds=new Set(content.objectives.map(o=>o.id));
    for(const p of store.profiles){
      assert(plain(p)&&typeof p.id==='string'&&p.id.length<=100&&!pids.has(p.id)&&typeof p.displayName==='string'&&p.displayName.length<=100,'Invalid profile.');pids.add(p.id);
      p.settings=settings(p.settings,sectionIds,chapters);
      assert(chapters.has(p.settings.position)&&[10,15,20].includes(p.settings.minutes)&&Number.isInteger(p.settings.newLimit)&&p.settings.newLimit>=0&&p.settings.newLimit<=20&&typeof p.settings.vosotros==='boolean'&&Number.isFinite(p.settings.speed)&&p.settings.speed>=.5&&p.settings.speed<=1.25,'Invalid learning preferences.');
      const r=progress(p.progress,ids);matched+=Object.keys(r.valid).length;unmatched+=Object.keys(r.unknown).length;p.progress=r.valid;
      if(Object.keys(r.unknown).length)store.recovery.push({reason:'Unmatched vocabulary schedules',profileId:p.id,progress:r.unknown});
      assert(Array.isArray(p.history)&&p.history.every(h=>plain(h)&&typeof h.correct==='boolean'&&timestamp(h.at)&&typeof h.id==='string'),'Invalid history.');
      assert(Array.isArray(p.lessons)&&p.lessons.every(id=>objIds.has(id)),'Unknown completed lesson.');
      assert(Array.isArray(p.attempts)&&Array.isArray(p.sessions),'Missing attempts or sessions.');const attempts=new Set();
      for(const a of p.attempts){assert(plain(a)&&typeof a.id==='string'&&!attempts.has(a.id)&&timestamp(a.timestamp)&&Array.isArray(a.objectiveIds)&&a.objectiveIds.every(id=>objIds.has(id))&&['correct','incorrect','accent-or-orthography','self-assessed'].includes(a.outcome)&&typeof a.answer==='string'&&a.answer.length<=4000&&(exIds.has(a.exerciseId)||(a.cardId&&ids.has(a.cardId))),'Invalid or unknown learning attempt.');
        assert(['auto','self'].includes(a.assessmentMode)&&['usedHint','revealed','retry','practiceOnly','diagnostic','production'].every(k=>typeof a[k]==='boolean'),'Invalid attempt assessment flags.');attempts.add(a.id);}
      const sessions=new Set();
      for(const s of p.sessions){
        assert(plain(s)&&typeof s.id==='string'&&!sessions.has(s.id)&&s.profileId===p.id&&timestamp(s.createdAt)&&Array.isArray(s.queue)&&s.queue.length<=500&&Number.isInteger(s.cursor)&&s.cursor>=0&&s.cursor<=s.queue.length&&Array.isArray(s.committed)&&new Set(s.committed).size===s.committed.length&&s.committed.every(id=>attempts.has(id))&&s.committed.length===s.cursor&&plain(s.drafts)&&plain(s.results)&&Array.isArray(s.undo),'Invalid unfinished session.');
        assert(s.queue.every(i=>plain(i)&&(i.kind==='vocabulary'?ids.has(i.cardId):i.kind==='exercise'&&exIds.has(i.exerciseId))),'Unknown queued item.');
        assert(typeof s.practiceOnly==='boolean'&&typeof s.diagnostic==='boolean'&&(s.completedAt===null||timestamp(s.completedAt)),'Invalid session status.');
        s.settings=settings(s.settings,sectionIds,chapters);
        assert(chapters.has(s.settings.position)&&[10,15,20].includes(s.settings.minutes)&&Number.isInteger(s.settings.newLimit)&&s.settings.newLimit>=0&&s.settings.newLimit<=20&&typeof s.settings.vosotros==='boolean'&&Number.isFinite(s.settings.speed)&&s.settings.speed>=.5&&s.settings.speed<=1.25,'Invalid session preferences.');
        for(const [index,draft]of Object.entries(s.drafts))assert(/^\d+$/.test(index)&&Number(index)<s.queue.length&&plain(draft)&&(draft.answer===undefined||typeof draft.answer==='string'&&draft.answer.length<=4000)&&['usedHint','revealed','retry','audioFallback','audioPlayed'].every(k=>draft[k]===undefined||typeof draft[k]==='boolean'),'Invalid saved answer draft.');
        if(s.feedback)assert(plain(s.feedback)&&exIds.has(s.feedback.exerciseId)&&attempts.has(s.feedback.attemptId)&&plain(s.feedback.checklist)&&Object.values(s.feedback.checklist).every(v=>typeof v==='boolean'),'Invalid saved exercise feedback.');
        // Undo contains state snapshots; validate those too before they can become live data.
        for(const u of s.undo){assert(plain(u)&&s.committed.includes(u.attemptId)&&plain(u.before)&&Number.isInteger(u.before.cursor)&&u.before.cursor>=0&&u.before.cursor<s.cursor&&Number.isInteger(u.before.historyLength)&&u.before.historyLength>=0&&u.before.historyLength<=p.history.length&&Number.isInteger(u.before.attemptsLength)&&u.before.attemptsLength>=0&&u.before.attemptsLength<p.attempts.length,'Invalid undo record.');
          if(u.before.progress)progress(u.before.progress,ids);
          else {assert(u.before.cardId===null||ids.has(u.before.cardId),'Invalid undo card.');assert(u.before.previous===null||u.before.cardId!==null,'Invalid undo schedule.');if(u.before.previous!==null)progress({[u.before.cardId]:u.before.previous},ids);}}
        sessions.add(s.id);
      }
      assert(p.activeSession===null||sessions.has(p.activeSession),'Missing active session.');
    }
    assert(pids.has(store.activeProfile),'Missing active profile.');
  }
  return {state:store,summary:{version:data.version,profiles:store.profiles.length,matched,unmatched,invalid:0,migrated:data.version===1?matched:0},raw:data};
}
export function compactState(state){
 const next=structuredClone(state);
 for(const p of next.profiles){const latest=p.attempts.at(-1)?.sessionId;
  for(const s of p.sessions){s.undo=s.id===latest?s.undo.slice(-20):[];
   // Convert old full-map snapshots without changing their inverse meaning.
   for(const u of s.undo)if(u.before.progress){const item=s.queue[u.before.cursor],id=item?.cardId||null;u.before.cardId=id;u.before.previous=id?u.before.progress[id]||null:null;delete u.before.progress;}
   if(s.completedAt){s.drafts={};s.results={};}
  }
 }
 const seen=new Set();next.recovery=next.recovery.filter(r=>{const key=JSON.stringify(r);if(seen.has(key))return false;seen.add(key);return true;});
 return next;
}
export function exportBackup(state){
 const raw=JSON.stringify({format:'palabra-backup',version:SCHEMA,exportedAt:new Date().toISOString(),state:compactState(state)});
 assert(new TextEncoder().encode(raw).length<=MAX_BACKUP_BYTES,'This browser backup exceeds 64 MB. Export individual profiles.');return raw;
}
export async function openRepository(indexedDB=globalThis.indexedDB){
  if(!indexedDB)throw Error('This browser cannot open local storage. You can practice in memory and export before leaving.');
  const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('palabra-learning',2);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('state'))r.result.createObjectStore('state');};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('Close older Palabra tabs to upgrade local storage.'));});
  return {
    async read(){return new Promise((resolve,reject)=>{const tx=db.transaction('state','readonly'),r=tx.objectStore('state').get('current');r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error);});},
    async write(next,expected){return new Promise((resolve,reject)=>{const tx=db.transaction('state','readwrite'),os=tx.objectStore('state');let error=null;const r=os.get('current');r.onsuccess=()=>{if((r.result?.revision||0)!==expected){error=Error('Another tab saved newer progress. Reload this tab before continuing.');tx.abort();return;}os.put({...structuredClone(next),revision:expected+1},'current');};tx.oncomplete=()=>resolve({...next,revision:expected+1});tx.onabort=()=>reject(error||tx.error||Error('Progress could not be saved. Export a backup before leaving.'));tx.onerror=()=>reject(tx.error);});},
    close(){db.close();}
  };
}
// Same transaction contract for deterministic tests and storage-unavailable practice.
export function memoryRepository(initial=null){let current=structuredClone(initial);return {async read(){return structuredClone(current);},async write(next,expected){if((current?.revision||0)!==expected)throw Error('Another tab saved newer progress. Reload this tab before continuing.');current={...structuredClone(next),revision:expected+1};return structuredClone(current);}};}
