// Isolated CI server. Release switching exists only here; it is never in the public runtime.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../../../../../',import.meta.url));let nextRelease=false;
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');
 if(req.method==='POST'&&url.pathname==='/__test/release'){nextRelease=true;res.end('ok');return;}
 if(req.method==='POST'&&url.pathname==='/__test/reset'){nextRelease=false;res.end('ok');return;}
 const file=path.resolve(root,'.'+url.pathname+(url.pathname.endsWith('/')?'index.html':''));if(!file.startsWith(path.resolve(root)+path.sep))throw Error('Invalid path');let bytes=await readFile(file);
 if(nextRelease&&file.endsWith('service-worker.js'))bytes=Buffer.from(bytes.toString().replace(/(CACHE='palabra-[^']+)/,'$1-ci-update'));
 if(nextRelease&&file.endsWith('index.html'))bytes=Buffer.from(bytes.toString().replace(/(name="palabra-release" content="[^"]+)/,'$1-ci-update'));
 const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png'};res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':file.endsWith('service-worker.js')?'no-cache':'public, max-age=600'});res.end(bytes);
 }catch{res.writeHead(404);res.end('not found');}}).listen(4179,'127.0.0.1');
