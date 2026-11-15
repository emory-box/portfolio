const assert=require('node:assert/strict'),fs=require('node:fs');
const {puppeteer,chromePath}=require('../browser-runtime.cjs').browserRuntime();
const site=process.env.SITE_URL||'http://localhost:4317';
(async()=>{
 const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--disable-webgl']});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const phase=p=>page.waitForFunction(p=>document.documentElement.dataset.homePhase===p,{},p);
  const onBread=()=>page.evaluate(()=>{
   const art=document.querySelector('[data-shared-object="skills"]'),root=art.getBoundingClientRect(),W=+art.dataset.artWidth,H=+art.dataset.artHeight;
   const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;const ctx=canvas.getContext('2d');
   for(const img of art.querySelectorAll('img')){if(img.closest('.home-butter-piece'))continue;let visible=true;for(let el=img;el&&el!==art;el=el.parentElement)if(+getComputedStyle(el).opacity<.99)visible=false;if(!visible)continue;const r=img.getBoundingClientRect();ctx.drawImage(img,(r.left-root.left)/root.width*W,(r.top-root.top)/root.height*H,r.width/root.width*W,r.height/root.height*H);}
   return [...document.querySelectorAll('.home-skills-group:not([hidden])')].every(group=>{const b=group.getBoundingClientRect();return [0,.5,1].every(x=>[0,.5,1].every(y=>{const p=ctx.getImageData(Math.round((b.left+b.width*x-root.left)/root.width*W),Math.round((b.top+b.height*y-root.top)/root.height*H),1,1).data;return p[0]>240&&p[1]>240&&p[2]>240&&p[3]>250;}));});
  });
  const onButter=()=>page.evaluate(()=>{
   const img=document.querySelector('.home-butter-hard .home-butter-spread img'),r=img.getBoundingClientRect(),c=document.createElement('canvas');c.width=850;c.height=810;const ctx=c.getContext('2d');ctx.drawImage(img,0,0,850,810);
   // Sample actual native text lines, excluding empty tracks and the transparent
   // padding that gives tabs/arrows a larger touch target.
   return [...document.querySelectorAll('.home-skills-group:not([hidden]) :is(h3,li:not([hidden])),.home-skills-tabs:not([hidden]) button,.home-skills-pages:not([hidden]) :is(button,span)')].every(element=>{const range=document.createRange();range.selectNodeContents(element);return [...range.getClientRects()].every(b=>[0,.5,1].every(x=>[0,.5,1].every(y=>{const p=ctx.getImageData(Math.round((b.left+b.width*x-r.left)/r.width*850),Math.round((b.top+b.height*y-r.top)/r.height*810),1,1).data;return p[0]>230&&p[1]>150&&p[3]>250;})));});
  });
  fs.mkdirSync('.cache/qa/skills-toast',{recursive:true});
  for(const width of [360,768,1280,1920]){
   await page.setViewport({width,height:900});await page.goto(site+'/',{waitUntil:'networkidle0'});
   await page.evaluate(()=>{window.originalToast=document.querySelector('.home-toast-art');window.originalButter=[...originalToast.querySelectorAll('.home-butter-piece')];});
   await page.focus('.home-skills');await page.keyboard.press('Enter');await phase('melting-butter');
   assert(await page.$$eval('.home-skills-copy',es=>es.every(e=>+getComputedStyle(e).opacity===0)),'Copy waits for butter');
   assert(await page.evaluate(()=>originalButter.every(e=>originalToast.contains(e))),'Original butter pieces remain in original toast');
   await phase('detail');
   assert.deepEqual(await page.$$eval('[data-skill-group="hard"] li',es=>es.map(e=>e.textContent)),['User Research','User Experience','User Interface','Vibe code','Responsive Design','Embedded systems']);
   assert.deepEqual(await page.$$eval('[data-skill-group="soft"] li',es=>es.map(e=>e.textContent)),['Ownership','Communication','Critical thinking','Empathy']);
   const matched=()=>page.evaluate(()=>{
    const pieces=[...document.querySelectorAll('.home-butter-piece')],art=originalToast.getBoundingClientRect();
    return pieces.every(e=>{const r=e.getBoundingClientRect();return Math.abs(r.width/art.width-575.827/1854.1545)<.0001&&Math.abs(r.height/art.height-541.642/1636.1005)<.0001;});
   });
   assert(await matched(),'Melted butter preserves the exact organic source shape');
   assert(await onBread(),'Every skill region lies on the original white bread, inside its ink outline');
   assert(await onButter(),'Every skill column lies inside the original organic butter surface');
   assert(await page.$$eval('.home-skills-group:not([hidden]) li:not([hidden])',es=>es.every(e=>{const r=document.createRange();r.selectNodeContents(e);return r.getClientRects().length===1;})),'Ordinary skill labels are never broken into narrow columns');
   assert(await page.$$eval('.home-skills-group',es=>es.every(e=>e.getBoundingClientRect().bottom<innerHeight)),'Both skill groups reveal within the ordinary 900px viewport');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');
   assert.equal(await page.$$eval('.home-skills-stage img[src$=".png"]',es=>es.length),0,'Reference photo is not website content');
   await page.evaluate(()=>document.documentElement.style.fontSize='200%');
   await new Promise(r=>setTimeout(r,100));assert(await matched(),'Butter reflows with enlarged native text');
   assert(await onBread(),'200% text remains on the bread');assert(await onButter(),'200% text remains on the organic butter');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'200% text fits');
   await page.evaluate(()=>document.documentElement.style.fontSize='');
   await page.keyboard.press('Escape');await phase('gathering-butter');
   assert(await page.evaluate(()=>document.querySelector('[data-view="skills"]').contains(originalToast)),'Butter gathers before toast returns');
   await phase('home');assert(await page.evaluate(()=>document.querySelector('.home-skills').contains(originalToast)&&originalButter.every(e=>originalToast.contains(e))),'Same original returns home');
   assert.equal(await page.$eval('.home-return',e=>e.hidden),true);
   console.log('PASS Skills toast/butter geometry, content, sequence, text reflow and return '+width+'px');
  }
  for(const [width,height,zoom]of [[320,568,1],[568,320,1],[360,800,2]]){
   await page.setViewport({width,height});await page.goto(site+'/#skills',{waitUntil:'networkidle0'});await phase('detail');
   await page.evaluate(zoom=>document.documentElement.style.fontSize=zoom*100+'%',zoom);
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   assert.equal(await page.$eval('.home-skills-tabs',e=>e.hidden),false,'Small view offers both skill groups');
   const seen=new Set();
   for(let group=0;group<2;group++){
    await page.focus('#skills-tab-'+group);await page.keyboard.press('Enter');
    for(let n=0;n<10;n++){
     for(const text of await page.$$eval('.home-skills-group:not([hidden]) li:not([hidden])',es=>es.map(e=>e.textContent)))seen.add(text);
     assert(await onButter(),'Every visible group/page fits the original butter '+width+'x'+height+'/'+zoom+' group '+group+' page '+n);
     const next=await page.$eval('.home-skills-pages',e=>!e.hidden&&!e.querySelector('button:last-child').disabled);
     if(!next)break;await page.click('.home-skills-pages button:last-child');
    }
   }
   assert.equal(seen.size,10,'Both groups and every short-screen page remain reachable');
   assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1),'Contained bread needs no page scrolling');
   await page.click('#skills-tab-0');await page.keyboard.press('ArrowRight');
   assert.equal(await page.evaluate(()=>document.activeElement.id),'skills-tab-1','Native arrow-key tabs');
   await page.evaluate(()=>document.documentElement.style.fontSize='');
  }
  await page.setViewport({width:1280,height:900});
  for(const delay of [180,1150,1950]){
   await page.goto(site+'/',{waitUntil:'networkidle0'});
   await page.evaluate(()=>{window.originalToast=document.querySelector('.home-toast-art');window.originalButter=[...originalToast.querySelectorAll('.home-butter-piece')];document.querySelector('.home-skills').click()});
   await new Promise(r=>setTimeout(r,delay));await page.evaluate(()=>document.querySelector('.home-return').click());
   await new Promise(r=>setTimeout(r,350));await page.evaluate(()=>document.querySelector('.home-skills').click());await phase('detail');
   assert(await page.evaluate(()=>document.querySelector('[data-view="skills"]').contains(originalToast)&&originalButter.every(e=>originalToast.contains(e))),'Interrupted/reopened melt retains all original nodes');
   await page.keyboard.press('Escape');await phase('home');
  }
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  await page.goto(site+'/#skills',{waitUntil:'networkidle0'});await phase('detail');
  assert(await page.$$eval('.home-skills-copy',es=>es.every(e=>+getComputedStyle(e).opacity===1)),'Reduced motion/direct link has full native content');
  await page.keyboard.press('Escape');await phase('home');
  const plain=await browser.newPage();await plain.setJavaScriptEnabled(false);await plain.setViewport({width:360,height:900});
  await plain.goto(site+'/#skills',{waitUntil:'networkidle0'});
  assert.equal(await plain.$$eval('.home-skill-list li',es=>es.length),10,'Native no-script lists remain readable');
  assert(await plain.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Native no-script fits');
  assert.deepEqual(errors,[]);
  console.log('PASS Skills interrupted entry/melt/return, keyboard, reduced motion, direct links and native fallback.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
