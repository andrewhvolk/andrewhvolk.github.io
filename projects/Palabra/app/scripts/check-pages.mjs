import {readFile,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../../../../',import.meta.url)),target=path.join(root,'palabra');
// Git may check text out as CRLF on Windows; builds intentionally emit LF.
// Compare normalized generated text, while vocabulary JSON and binary assets
// retain exact-byte checks (including the independent vocabulary's stable hash).
async function files(dir,prefix=''){const out=new Map();for(const e of await readdir(dir,{withFileTypes:true})){if(e.isSymbolicLink())throw Error('Unexpected runtime symlink.');if(e.isDirectory())for(const [key,value]of await files(path.join(dir,e.name),prefix+e.name+'/'))out.set(key,value);else {const key=prefix+e.name,bytes=await readFile(path.join(dir,e.name));out.set(key,/\.(?:html|css|mjs|js|ts|webmanifest)$/.test(key)?Buffer.from(bytes.toString('utf8').replace(/\r\n/g,'\n')):bytes);}}return out;}
const before=await files(target);await import('./build-pages.mjs');const after=await files(target),expected=await files(fileURLToPath(new URL('../dist/',import.meta.url)));
const drift=[...new Set([...before.keys(),...after.keys()])].filter(key=>!before.get(key)?.equals(after.get(key)));
const stale=[...after.keys()].filter(key=>!expected.has(key));
if(drift.length||stale.length)throw Error(`Committed Pages assets differ from source. Run npm run build:pages and commit the output. Changed: ${drift.join(', ')}. Stale: ${stale.join(', ')}`);
console.log(`Pages parity verified: ${after.size} deterministic runtime assets.`);
