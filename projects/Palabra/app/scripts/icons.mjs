import {deflateSync} from 'node:zlib';
const crc=bytes=>{let n=0xffffffff;for(const byte of bytes){n^=byte;for(let i=0;i<8;i++)n=(n>>>1)^((n&1)?0xedb88320:0);}return (n^0xffffffff)>>>0;};
function chunk(type,data){const name=Buffer.from(type),body=Buffer.concat([name,data]),size=Buffer.alloc(4),sum=Buffer.alloc(4);size.writeUInt32BE(data.length);sum.writeUInt32BE(crc(body));return Buffer.concat([size,body,sum]);}
// Original geometric lowercase p, rendered without a font or external image dependency.
export function iconPng(size){const pixels=Buffer.alloc((size*4+1)*size);
 for(let y=0;y<size;y++){const row=y*(size*4+1);for(let x=0;x<size;x++){const px=x/size,py=y/size,d=Math.hypot(px-.55,py-.43);let color=[32,79,64];if(px>.31&&px<.40&&py>.27&&py<.79||d<.19&&d>.10)color=[248,246,238];if(Math.hypot(px-.78,py-.23)<.035)color=[242,205,105];const offset=row+1+x*4;pixels.set([...color,255],offset);}}
 const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(size);ihdr.writeUInt32BE(size,4);ihdr[8]=8;ihdr[9]=6;
 return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',deflateSync(pixels)),chunk('IEND',Buffer.alloc(0))]);
}
