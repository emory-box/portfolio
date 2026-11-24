const assert=require('node:assert/strict'),fs=require('node:fs');
const {puppeteer,chromePath}=require('../browser-runtime.cjs').browserRuntime();
const site=process.env.SITE_URL||'http://localhost:4317',out='.cache/qa/home-scene-spacing';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--disable-webgl']});try{
 const page=await browser.newPage(),errors=[],failures=[];page.on('pageerror',e=>errors.push(e.message));
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 for(const [width,height,zoom]of [[320,568,1],[360,640,1],[390,844,1],[430,600,1],[540,720,1],[680,700,1],[681,700,1],[768,900,1],[1280,720,1],[1920,1080,1],[568,320,1],[320,568,2],[430,600,2]]){
  await page.setViewport({width,height});await page.goto(site+'/?spacing='+width+'-'+zoom,{waitUntil:'networkidle0'});await page.evaluate(zoom=>document.documentElement.style.fontSize=zoom*100+'%',zoom);await page.evaluate(()=>document.fonts.ready);
  const result=await page.evaluate(async()=>{
   const cache=new Map(),rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};};
   async function ink(img,box=rect(img)){
    if(img instanceof SVGElement){const bitmap=new Image();bitmap.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(img));await bitmap.decode();return ink(bitmap,box);}
    if(!img.complete)await img.decode();let a=cache.get(img.src);
    if(!a){const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(img,0,0,c.width,c.height);const d=ctx.getImageData(0,0,c.width,c.height).data;let x=c.width,y=c.height,r=0,b=0;for(let j=0;j<c.height;j++)for(let i=0;i<c.width;i++)if(d[(j*c.width+i)*4+3]>25){x=Math.min(x,i);y=Math.min(y,j);r=Math.max(r,i+1);b=Math.max(b,j+1);}a={x:x/c.width,y:y/c.height,w:(r-x)/c.width,h:(b-y)/c.height};cache.set(img.src,a);}
    return{x:box.x+a.x*box.w,y:box.y+a.y*box.h,w:a.w*box.w,h:a.h*box.h};
   }
   const pieces=[];async function image(group,selector,override){for(const img of document.querySelectorAll(selector))pieces.push({group,box:await ink(img,override?rect(document.querySelector(override)):undefined)});}
   await image('avatar','.home-portrait img');await image('projects','.home-projects .home-pegboard-art > img');await image('skills','.home-toast-component');await image('pan','.home-pan-art > img','.home-pan-scene');await image('ball','.home-ball img');await image('play','.home-play .home-game-outline img');
   for(const e of document.querySelectorAll('.home-note :is(.home-note-face,.home-note-shadow,.home-note-tab)'))pieces.push({group:'note',box:rect(e)});
   for(const [group,selector]of [['projects','.home-projects .home-object-label'],['skills','.home-skills .home-object-label'],['note','.home-note .home-object-label']])pieces.push({group,box:rect(document.querySelector(selector))});
   const collisions=[];for(let i=0;i<pieces.length;i++)for(let j=i+1;j<pieces.length;j++){const a=pieces[i],b=pieces[j];if(a.group===b.group)continue;const w=Math.min(a.box.x+a.box.w,b.box.x+b.box.w)-Math.max(a.box.x,b.box.x),h=Math.min(a.box.y+a.box.h,b.box.y+b.box.h)-Math.max(a.box.y,b.box.y);if(w>1&&h>1)collisions.push({groups:[a.group,b.group],overlap:[w,h]});}
   return{collisions,overflow:document.documentElement.scrollWidth>innerWidth};
  });
  if(result.collisions.length||result.overflow)failures.push({viewport:[width,height,zoom],...result});
  if(width===430||width===320)await page.screenshot({path:out+'/home-'+width+'-'+zoom+'.png',fullPage:true});
 }
 fs.writeFileSync(out+'/failures.json',JSON.stringify(failures,null,2));assert.deepEqual(errors,[]);assert.deepEqual(failures,[],'Visible artwork and labels must not overlap at responsive widths');
 console.log('PASS painted Home artwork/label separation at320–1920px, breakpoint edges, short portrait/landscape and200% text.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
