const assert=require('node:assert/strict');
const fs=require('node:fs');
const {puppeteer,chromePath}=require('../browser-runtime.cjs').browserRuntime();
const site=process.env.SITE_URL||'http://localhost:4317';
const out='.cache/qa/home-refinements';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--disable-webgl']});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const open=async(id)=>{await page.goto(site+'/?check='+id+'#'+id,{waitUntil:'networkidle0'});await page.waitForFunction(id=>document.documentElement.dataset.homePhase==='detail'&&document.documentElement.dataset.homeView===id,{},id);await page.evaluate(()=>document.fonts.ready);};
 for(const [width,height]of [[1440,1024],[1280,720],[768,900],[360,800]]){
  await page.setViewport({width,height});await open('skills');
  if(width>=768){assert.equal(await page.$eval('.home-skills-stage',e=>e.dataset.skillsMode),'cloud','Figma word cloud stays on ordinary screens');assert.equal(await page.$$eval('.home-skill-word',es=>es.length),16);}
  await page.screenshot({path:out+'/skills-'+width+'.png'});
  await open('work');const frames=[];
  for(const i of [0,1,2,0,2,1]){
   await page.click('[data-project-index="'+i+'"]');await page.waitForFunction(i=>document.querySelector('[data-project-index="'+i+'"]').getAttribute('aria-selected')==='true',{},i);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   frames.push(await page.$eval('.home-project-board',e=>{const r=e.getBoundingClientRect();return[r.x,r.y,r.width,r.height];}));
   assert(await page.$eval('.home-project-preview:not([hidden])',e=>{const gap=e.querySelector('.home-project-open').getBoundingClientRect().top-e.querySelector('.home-project-summary').getBoundingClientRect().bottom;return gap>= (innerWidth<=900?20:22); }),'Description has breathing room before CTA');
  }
  for(const frame of frames)frame.forEach((v,i)=>assert(Math.abs(v-frames[0][i])<.2,'Pegboard does not move while changing projects '+width));
  await page.mouse.move(1,1);await page.waitForFunction(()=>[...document.querySelectorAll('.home-project-hover-art')].every(e=>e.getAnimations().length===0));const tab=await page.$('[data-project-index="0"]');await tab.hover();
  assert(await page.$eval('[data-project-index="0"]',e=>getComputedStyle(e).outlineStyle==='none'&&getComputedStyle(e.querySelector('.home-project-hover-art')).opacity==='1'),'Hover uses the original colored selected card, without the old offset outline');
  await page.screenshot({path:out+'/hover-'+width+'.png'});
  await tab.click();
  assert(await page.$eval('[data-project-index="0"] .home-project-hover-art',e=>e.getAnimations().some(a=>a.effect.getKeyframes().some(k=>k.filter==='brightness(1.25)'))),'Click briefly brightens the same card');
  assert.equal(await page.$eval('[data-project-index="1"]',e=>e.getAttribute('aria-selected')),'true','Previous content remains during the press flash');
  await page.mouse.move(1,1);await page.waitForFunction(()=>document.querySelector('[data-project-index="0"] .home-project-hover-art').getAnimations().length===0);
  await page.waitForFunction(()=>document.querySelector('[data-project-index="0"]').getAttribute('aria-selected')==='true');
  assert.equal(await page.$eval('[data-project-index="0"]',e=>e.getAttribute('aria-selected')),'true');
  assert.equal(await page.$eval('#project-greeny',e=>e.hidden),false);
 }
 await page.evaluate(()=>{document.querySelector('[data-project-index="1"]').click();document.querySelector('[data-project-index="2"]').click();});
 await page.waitForFunction(()=>document.querySelector('[data-project-index="2"]').getAttribute('aria-selected')==='true');
 assert.equal(await page.$eval('.home-project-preview:not([hidden]) h3',e=>e.textContent),'Synergy','Rapid clicks commit only the latest project');
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 await page.evaluate(()=>{document.querySelector('[data-project-index="0"]').click();document.querySelector('.home-return').click();document.querySelector('.home-projects').click();});
 assert(await page.$$eval('.home-project-hover-art',es=>es.every(e=>e.getAnimations().length===0)),'Leaving cancels pending press feedback before reopening');
 assert.equal(await page.$eval('[data-project-index="2"]',e=>e.getAttribute('aria-selected')),'true','Reopening keeps the last completed selection');
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
 await page.setViewport({width:1280,height:720});await page.goto(site+'/?entrance=1',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.documentElement.classList.contains('home-ready'));
 const intro=await page.evaluate(()=>['.home-header','#home-title','.home-portrait','.home-skills','.home-pan-decoration','.home-projects','.home-note','.home-play','.home-ball'].map(selector=>{const s=getComputedStyle(document.querySelector(selector));return{selector,duration:s.animationDuration,name:s.animationName,delay:parseFloat(s.animationDelay)*1000};}));
 for(const [i,entry]of intro.entries()){assert.equal(entry.name,'home-enter');assert.equal(entry.duration,'0.3s','Entrance uses a300ms fade');assert.equal(entry.delay,i*100,'Content groups retain their sequential entrance');assert(entry.delay+parseFloat(entry.duration)*1000<=1100,'Every group finishes within1.1seconds');}
 await page.evaluate(()=>{for(const e of document.querySelectorAll('.home-header,.home-stage > *'))for(const a of e.getAnimations()){a.pause();a.currentTime=250;}});
 assert(await page.$eval('#home-title',e=>+getComputedStyle(e).opacity>0),'Greeting is revealing before later objects');
 assert(await page.$$eval('.home-skills,.home-pan-decoration,.home-projects,.home-note,.home-play,.home-ball',es=>es.every(e=>+getComputedStyle(e).opacity===0)),'Later objects remain hidden until their turn');
 assert.equal(await page.$eval('.home-note',e=>getComputedStyle(e).pointerEvents),'none','Pending invisible objects do not catch pointer clicks');
 await page.focus('.home-pan-decoration');
 assert.equal(await page.$eval('.home-pan-decoration',e=>getComputedStyle(e).opacity),'1','Keyboard focus reveals a pending object immediately');
 await page.evaluate(()=>{for(const e of document.querySelectorAll('.home-header,.home-stage > *'))for(const a of e.getAnimations())a.currentTime=1100;});
 assert(await page.$$eval('.home-header,#home-title,.home-portrait,.home-skills,.home-pan-decoration,.home-projects,.home-note,.home-play,.home-ball',es=>es.every(e=>+getComputedStyle(e).opacity===1)),'All entrance groups are fully visible at1.1seconds');
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 await page.goto(site+'/?entrance=reduced',{waitUntil:'networkidle0'});
 assert(await page.$$eval('.home-stage > *',es=>es.every(e=>getComputedStyle(e).animationName==='none')),'Reduced motion skips the longer entrance');
 assert.deepEqual(errors,[]);
 console.log('PASS Figma Skills on laptop/tablet, stable pegboard, matching hover/selected cards, press flash, CTA spacing and sequential entrance completed within1.1seconds including pan; reduced motion preserved.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
