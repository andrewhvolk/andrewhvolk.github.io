import {mkdir,copyFile,cp} from 'node:fs/promises';
await import('./check-content.mjs');
await mkdir('dist',{recursive:true});
for(const file of ['index.html','styles.css'])await copyFile(file,`dist/${file}`);
for(const dir of ['src','content'])await cp(dir,`dist/${dir}`,{recursive:true});
console.log('Static build ready in dist/');
