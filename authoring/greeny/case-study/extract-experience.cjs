// Extract original vector diagrams and delivery-size photographs from the uploaded SVG.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {pathToFileURL}=require('node:url');
const {puppeteer,chromePath}=require('../../../scripts/qa/browser-runtime.cjs').browserRuntime();
const root=path.resolve(__dirname,'../../..'),source=path.join(__dirname,'references/experience-layout.svg');
const output=path.join(root,'projects/greeny/img');
(async()=>{
 const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage();await page.setJavaScriptEnabled(false);await page.setViewport({width:1920,height:1080});
  await page.goto(pathToFileURL(source).href,{waitUntil:'load'});
  const vectors=[];
  for(const [name,box,title] of [['function-ideation',[40,150,1795,880],'Function Ideations'],['system-icons',[352,11482,1216,843],'Icon — Greeny UI system']]){
   const result=await page.evaluate(({box,title,name})=>{
    const svg=document.documentElement,[x,y,w,h]=box;
    const selected=[...svg.children].filter(el=>{
     if(!['rect','path','circle','ellipse','g','use','line','polyline','polygon'].includes(el.tagName))return false;
     const r=el.getBoundingClientRect();return (r.width||r.height)&&r.left>=x-1&&r.top>=y-1&&r.right<=x+w+1&&r.bottom<=y+h+1;
    });
    const body=selected.map(el=>el.outerHTML).join('\n');
    const ids=new Set(),definitions=[];let pending=body;
    while(pending){let added='';for(const match of pending.matchAll(/(?:url\(#|(?:xlink:)?href=["']#)([\w.-]+)/g)){
     if(ids.has(match[1]))continue;ids.add(match[1]);const node=document.getElementById(match[1]);if(node){definitions.push(node.outerHTML);added+=node.outerHTML;}
    }pending=added;}
    return {count:selected.length,svg:`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${box.join(' ')}" fill="none" style="background:#191919;color-scheme:dark" role="img" aria-labelledby="${name}-art-title"><title id="${name}-art-title">${title}</title>${definitions.length?'<defs>'+definitions.join('\n')+'</defs>':''}${body}</svg>\n`};
   },{box,title,name});
   if(/<image\b|<foreignObject\b|<script\b/.test(result.svg))throw new Error('Unexpected raster or active content in '+name);
   const file=path.join(output,'diagrams',name+'.svg');fs.writeFileSync(file,result.svg);
   vectors.push({file:path.relative(root,file).replaceAll('\\','/'),box,elements:result.count,sha256:crypto.createHash('sha256').update(result.svg).digest('hex')});
  }
  const images=await page.evaluate(async()=>{
   const nodes=[...document.querySelectorAll('defs image')];
   const specs=[['sensor-explanation',0,1100],['sensor-device',1,360],['garden-artwork',2,900]];const results=[];
   for(const [name,index,maxWidth] of specs){const input=nodes[index].getAttribute('href')||nodes[index].getAttributeNS('http://www.w3.org/1999/xlink','href');const img=new Image();img.src=input;await img.decode();const canvas=document.createElementNS('http://www.w3.org/1999/xhtml','canvas');canvas.width=Math.min(maxWidth,img.width);canvas.height=Math.round(img.height*canvas.width/img.width);const ctx=canvas.getContext('2d');ctx.fillStyle='#191919';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);results.push({name,index,width:canvas.width,height:canvas.height,base64:canvas.toDataURL('image/jpeg',.9).split(',')[1]});}
   return results;
  });
  const photos=[];for(const image of images){const file=path.join(output,'case-study',image.name+'.jpg'),bytes=Buffer.from(image.base64,'base64');fs.writeFileSync(file,bytes);photos.push({file:path.relative(root,file).replaceAll('\\','/'),sourceImageIndex:image.index,width:image.width,height:image.height,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length});}
  fs.writeFileSync(path.join(__dirname,'references/experience-assets.json'),JSON.stringify({source:'experience-layout.svg',vectors,photos},null,2)+'\n');
  console.log('Exported '+vectors.length+' original vector diagrams and '+photos.length+' delivery photographs.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
