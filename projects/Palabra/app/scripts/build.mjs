import {mkdir,readFile,writeFile,readdir,cp} from 'node:fs/promises';
import {createHash} from 'node:crypto';
await import('./check-content.mjs');
async function walk(dir){const files=[];for(const e of await readdir(dir,{withFileTypes:true}))files.push(...e.isDirectory()?await walk(`${dir}/${e.name}`):[`${dir}/${e.name}`]);return files;}
const files=['index.html','styles.css',...await walk('src'),...await walk('content')].sort();
const hash=createHash('sha256');for(const file of files)hash.update(file).update(await readFile(file));
const release=hash.digest('hex').slice(0,16);
await mkdir('dist',{recursive:true});
for(const dir of ['src','content'])await cp(dir,`dist/${dir}`,{recursive:true});
for(const file of files){let text=await readFile(file,'utf8');
 if(file.endsWith('.mjs'))text=text.replace(/(['"])(\.{1,2}\/[^'"?]+\.(?:mjs|json))\1/g,(_,quote,url)=>`${quote}${url}?v=${release}${quote}`);
 if(file==='index.html')text=text.replace(/(href="styles.css|src="src\/app.mjs)(")/g,`$1?v=${release}$2`).replace('</head>',`<meta name="palabra-release" content="${release}"></head>`);
 await writeFile(`dist/${file}`,text);
}
console.log(`Static build ready in dist/ (release ${release})`);
