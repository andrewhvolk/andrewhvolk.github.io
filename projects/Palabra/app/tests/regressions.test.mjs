import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {course} from '../content/course.mjs';
import {emptyStore} from '../src/engine.mjs';
import {previewBackup,exportBackup} from '../src/persistence.mjs';
const data=JSON.parse(await readFile(new URL('../content/vocabulary.json',import.meta.url),'utf8'));
const decode=raw=>previewBackup(raw,data.cards,data.sections,course);
test('legacy preference allowlist rejects markup, wrong types and unknown fields atomically',()=>{
 const base={format:'palabra-backup',version:1,progress:{},history:[],settings:{sections:['1a'],direction:'es-en',limit:10}};
 for(const bad of [{minutes:'<b id="injected">test</b>'},{newLimit:'NaN'},{limit:'20'},{limit:100},{verbsOnly:'false'},{sections:'1a'},{unexpected:true}]){
  const input={...base,settings:{...base.settings,...bad}},before=JSON.stringify(input);
  assert.throws(()=>decode(before),/Nothing was changed/);assert.equal(JSON.stringify(input),before);
 }
 const accepted=decode(JSON.stringify(base)).state;assert.deepEqual(decode(exportBackup(accepted)).state,accepted);
 for(const [key,value]of Object.entries({minutes:'15',newLimit:21,vosotros:1,speed:NaN,verbsOnly:'false',position:'other',unknown:1})){
  const state=emptyStore();state.profiles[0].settings[key]=value;assert.throws(()=>decode(exportBackup(state)),/settings/);
 }
});
