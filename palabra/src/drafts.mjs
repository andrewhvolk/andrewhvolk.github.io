// Small synchronous journal closes the gap between typing and a debounced IDB save.
export const JOURNAL_KEY='palabra-draft-journal-v1';
export function recoverDrafts(state,raw){
 if(!raw)return state;
 try{const journal=JSON.parse(raw);if(journal.revision!==state.revision||!Array.isArray(journal.entries)||journal.entries.length>50)return state;
  const next=structuredClone(state);
  for(const entry of journal.entries){const p=next.profiles.find(p=>p.id===entry.profileId),s=p?.sessions.find(s=>s.id===entry.sessionId);
   if(!s||s.completedAt||s.feedback||entry.index!==s.cursor||typeof entry.answer!=='string'||entry.answer.length>4000)continue;
   s.drafts[s.cursor]={...s.drafts[s.cursor],answer:entry.answer};
  }return next;
 }catch{return state;}
}
