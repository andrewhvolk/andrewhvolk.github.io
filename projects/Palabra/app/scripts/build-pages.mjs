import {cp,mkdir,lstat,readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

// The source app stays independent; only its runtime assets go into the public URL.
const app=fileURLToPath(new URL('../',import.meta.url));
const repo=fileURLToPath(new URL('../../../../',import.meta.url));
const target=path.resolve(repo,'palabra');
if(!target.startsWith(path.resolve(repo)+path.sep))throw Error('Invalid Pages output path.');
const existing=await lstat(target).catch(()=>null);
if(existing?.isSymbolicLink()||existing&&!existing.isDirectory())throw Error('The Pages output must be an ordinary directory.');
process.chdir(app);
await import('./build.mjs');
await mkdir(target,{recursive:true});
for(const entry of ['index.html','styles.css','src','content','app.webmanifest','service-worker.js','icon-192.png','icon-512.png'])await cp(path.join(app,'dist',entry),path.join(target,entry),{recursive:true});
const index=path.join(target,'index.html');
await writeFile(index,(await readFile(index,'utf8')).replace('</title>','</title><link rel="canonical" href="https://andrewhvolk.github.io/palabra/">'));
console.log(`GitHub Pages runtime ready: ${target}`);
