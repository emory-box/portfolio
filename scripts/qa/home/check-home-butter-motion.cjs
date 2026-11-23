const assert=require('node:assert/strict'),fs=require('node:fs');
const {puppeteer,chromePath}=require('../browser-runtime.cjs').browserRuntime();
const site=process.env.SITE_URL||'http://localhost:4317';
(async()=>{const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--disable-webgl']});
 try{const page=await browser.newPage();await page.setViewport({width:1280,height:900});await page.goto(site+'/',{waitUntil:'networkidle0'});
  await page.click('.home-skills');await page.waitForFunction(()=>document.documentElement.dataset.homePhase==='melting-butter');
  const ready=await page.evaluate(()=>({surface:!!document.querySelector('.home-butter-live'),words:document.querySelectorAll('.home-skill-word').length}));
  assert.deepEqual(ready,{surface:true,words:16},'One continuous butter surface and all sixteen current source words');
  fs.mkdirSync('.cache/qa/butter-motion',{recursive:true});
  const areas=[];
  for(const progress of [0,.2,.4,.6,.8,1]){
   const result=await page.evaluate(async progress=>{
    const art=document.querySelector('.home-toast-art');
    for(const animation of art.getAnimations({subtree:true})){animation.pause();const t=animation.effect.getTiming();animation.currentTime=(t.delay||0)+t.duration*progress;}
    const svg=art.querySelector('.home-butter-live'),copy=svg.cloneNode(true),original=[...svg.querySelectorAll('path,g')];
    [...copy.querySelectorAll('path,g')].forEach((path,i)=>{const style=getComputedStyle(original[i]);if(path.tagName==='path')path.style.d=style.d;path.style.opacity=style.opacity;});
    const source='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(copy));
    const image=new Image();image.src=source;await image.decode();const canvas=document.createElement('canvas');canvas.width=canvas.height=384;
    const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0,384,384);const pixels=ctx.getImageData(0,0,384,384).data,mask=new Uint8Array(384*384);
    for(let i=0;i<mask.length;i++)if(pixels[i*4]>230&&pixels[i*4+1]>150&&pixels[i*4+2]<140&&pixels[i*4+3]>250)mask[i]=1;
    let area=0;const components=[];
    for(let i=0;i<mask.length;i++){if(!mask[i])continue;mask[i]=0;const stack=[i];let size=0;while(stack.length){const at=stack.pop();size++;for(const next of [at-384,at+384,at%384?at-1:-1,at%384<383?at+1:-1])if(next>=0&&next<mask.length&&mask[next]){mask[next]=0;stack.push(next);}}if(size>8)components.push(size);area+=size;}
    const r=svg.getBoundingClientRect();return{components:components.length,area:area/(384*384)*r.width*r.height,opaque:[...svg.querySelectorAll('.home-butter-boundary,.home-butter-body')].every(p=>getComputedStyle(p).opacity==='1')};
   },progress);
   assert.equal(result.components,1,'One connected butter mass at '+progress);assert(result.opaque,'The mass never cross-fades '+progress);
   if(areas.length)assert(result.area>=areas.at(-1)*.98,'The same butter expands continuously');areas.push(result.area);
   await page.screenshot({path:'.cache/qa/butter-motion/melt-'+progress+'.png'});
  }
  await page.evaluate(()=>document.querySelector('.home-toast-art').getAnimations({subtree:true}).forEach(a=>a.play()));
  await page.waitForFunction(()=>document.documentElement.dataset.homePhase==='detail');
  assert(await page.$$eval('.home-skill-word',es=>es.every(e=>getComputedStyle(e).fontWeight===(e.classList.contains('home-skill-word--major')?'800':'500'))),'Source word-cloud hierarchy is preserved');
  await page.click('.home-return');await page.waitForFunction(()=>document.documentElement.dataset.homePhase==='home');
  await page.click('.home-skills');await page.waitForFunction(()=>document.documentElement.dataset.homePhase==='melting-butter');
  const jumps=await page.evaluate(async()=>{
   const svg=document.querySelector('.home-butter-live'),body=svg.querySelector('.home-butter-body');
   const pose=()=>getComputedStyle(body).d.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi).map(Number);
   const pause=progress=>document.querySelector('.home-toast-art').getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=a.effect.getTiming().duration*progress;});
   const delta=(a,b)=>Math.max(...a.map((v,i)=>Math.abs(v-b[i])));
   pause(.45);const before=pose();document.querySelector('.home-return').click();const close=delta(before,pose());
   await new Promise(resolve=>{function tick(){if(document.documentElement.dataset.homePhase==='gathering-butter')resolve();else requestAnimationFrame(tick);}tick();});
   pause(.4);const halfway=pose();document.querySelector('.home-skills').click();const reopen=delta(halfway,pose());
   document.querySelector('.home-toast-art').getAnimations({subtree:true}).forEach(a=>a.play());
   return{close,reopen,same:document.querySelector('.home-butter-live')===svg};
  });
  assert(jumps.close<.5&&jumps.reopen<.5&&jumps.same,'Interrupted melt/gather resumes the same current contour: '+JSON.stringify(jumps));
  await page.waitForFunction(()=>document.documentElement.dataset.homePhase==='detail');
  console.log('PASS native skills; one opaque connected butter mass across six actual morph frames; continuous expansion and shape continuity through close/reopen.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
