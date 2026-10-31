import {mkdir,readFile,writeFile,readdir,cp,rm,lstat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {iconPng} from './icons.mjs';
import {serviceWorker} from './service-worker.mjs';
await import('./check-content.mjs');
async function walk(dir){const files=[];for(const e of await readdir(dir,{withFileTypes:true}))files.push(...e.isDirectory()?await walk(`${dir}/${e.name}`):[`${dir}/${e.name}`]);return files;}
const files=['index.html','styles.css',...await walk('src'),...await walk('content')].sort();
const normalized=async file=>file.endsWith('vocabulary.json')?await readFile(file):Buffer.from((await readFile(file,'utf8')).replace(/\r\n/g,'\n'));
const hash=createHash('sha256');for(const file of [...files,'scripts/build.mjs','scripts/icons.mjs','scripts/service-worker.mjs'])hash.update(file).update(await normalized(file));
const release=hash.digest('hex').slice(0,16);
const appRoot=fileURLToPath(new URL('../',import.meta.url)),output=path.resolve(appRoot,'dist');
if(path.dirname(output)!==path.resolve(appRoot)||path.basename(output)!=='dist')throw Error('Invalid build output path.');
if((await lstat(output).catch(()=>null))?.isSymbolicLink())throw Error('Build output must not be a symlink.');
await rm(output,{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const dir of ['src','content'])await cp(dir,`dist/${dir}`,{recursive:true});
for(const file of files){let text=(await normalized(file)).toString('utf8');
 if(file.endsWith('.mjs'))text=text.replace(/(['"])(\.{1,2}\/[^'"?]+\.(?:mjs|json))\1/g,(_,quote,url)=>`${quote}${url}?v=${release}${quote}`);
 if(file==='index.html')text=text.replace(/(href="styles.css|src="src\/app.mjs)(")/g,`$1?v=${release}$2`).replace('</head>',`<link rel="manifest" href="app.webmanifest"><link rel="icon" href="icon-192.png"><meta name="palabra-release" content="${release}"></head>`);
 await writeFile(`dist/${file}`,text);
}
const manifest={id:'./',name:'Palabra · Daily Spanish',short_name:'Palabra',start_url:'./',scope:'./',display:'standalone',background_color:'#f8f6ee',theme_color:'#204f40',description:'Original daily Spanish practice through 9B. No account required.',icons:[192,512].map(size=>({src:`icon-${size}.png`,sizes:`${size}x${size}`,type:'image/png',purpose:'any maskable'}))};
await writeFile('dist/app.webmanifest',JSON.stringify(manifest,null,2));
for(const size of [192,512])await writeFile(`dist/icon-${size}.png`,iconPng(size));
const assets=['index.html','app.webmanifest','icon-192.png','icon-512.png',...files.filter(file=>file!=='index.html'&&!file.endsWith('.d.ts')).map(file=>`${file}?v=${release}`)];
await writeFile('dist/service-worker.js',serviceWorker(release,assets));
console.log(`Static build ready in dist/ (release ${release})`);
