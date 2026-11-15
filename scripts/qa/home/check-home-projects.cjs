const assert=require('node:assert/strict');
const {projects}=require('../../../authoring/portfolio/content.cjs');
const {puppeteer,chromePath}=require('../browser-runtime.cjs').browserRuntime();
const SITE=process.env.SITE_URL||'http://localhost:4317';
(async()=>{
 const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--disable-webgl']});
 try{
  const page=await browser.newPage(),errors=[],missing=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
  await page.setViewport({width:1440,height:1024});await page.goto(SITE+'/#work',{waitUntil:'networkidle0'});await page.evaluate(()=>document.fonts.ready);
  const native=await page.$eval('.home-project-preview:not([hidden])',e=>{
   const type=getComputedStyle(e.querySelector('.home-project-type')),duration=getComputedStyle(e.querySelector('.home-project-duration'));
   return {type:parseFloat(type.lineHeight),duration:parseFloat(duration.lineHeight),cta:e.querySelector('.home-project-open').getBoundingClientRect().y};
  });
  assert(Math.abs(native.type-26)<.1);assert(Math.abs(native.duration-20.8)<.1);assert(Math.abs(native.cta-908)<1,'Native action bottom aligns with the pegboard paper edge');
  assert.equal(new Set(projects.map(p=>p.homeSummary)).size,3,'Distinct summaries');
  assert(await page.$$eval('.home-project-preview .portfolio-cover',es=>es.every(e=>getComputedStyle(e).borderTopWidth==='0px')),'Project preview frames have no border');
  assert(await page.$eval('#project-moti-pulse .portfolio-cover img',e=>e.complete&&e.naturalWidth>0&&e.src.endsWith('/moti-pulse-cover.png')&&getComputedStyle(e).objectFit==='contain'),'Moti preview uses the full existing banner without cropping');
  for(let i=0;i<projects.length;i++){
   await page.click('[data-project-index="'+i+'"]');
   await page.waitForFunction(i=>document.querySelector('[data-project-index="'+i+'"]').getAttribute('aria-selected')==='true',{},i);
   assert.equal(await page.$eval('.home-project-preview:not([hidden]) .home-project-summary',e=>e.textContent),projects[i].homeSummary);
   assert.equal(await page.$eval('.home-board-preview img:not([hidden])',e=>e.getAttribute('src')),'assets/img/home/'+projects[i].homeBoard);
   assert.equal(await page.$eval('.home-project-preview:not([hidden]) a',e=>e.getAttribute('href')),'projects/'+projects[i].slug+'/');
  }
  await page.focus('[data-project-index="2"]');await page.keyboard.press('Home');
  assert.equal(await page.$eval('[data-project-index="0"]',e=>e.getAttribute('aria-selected')),'true');
  for(const width of [1280,1440]){
   await page.setViewport({width,height:1024});await page.evaluate(()=>document.documentElement.style.fontSize='100%');
   const normal=await page.$eval('.home-project-preview:not([hidden]) h3',e=>parseFloat(getComputedStyle(e).fontSize));
   await page.evaluate(()=>document.documentElement.style.fontSize='200%');
   await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const enlarged=await page.$eval('.home-project-preview:not([hidden]) h3',e=>parseFloat(getComputedStyle(e).fontSize));
   assert.equal(enlarged,normal*2,'Project type really enlarges at200%');
   for(let i=0;i<projects.length;i++){
    await page.evaluate(i=>document.querySelector('[data-project-index="'+i+'"]').click(),i);
    await page.waitForFunction(i=>document.querySelector('[data-project-index="'+i+'"]').getAttribute('aria-selected')==='true',{},i);
    assert(await page.$eval('.home-project-preview:not([hidden])',e=>{
     const summary=e.querySelector('.home-project-summary').getBoundingClientRect(),cta=e.querySelector('.home-project-open').getBoundingClientRect();
     return cta.top>=summary.bottom-1&&cta.right<=innerWidth&&e.scrollWidth<=e.clientWidth+1;
    }),'Enlarged copy never collides with CTA or escapes its column');
   }
  }
  for(const width of [320,360,768,900]){
   await page.setViewport({width,height:800});
   await page.goto(SITE+'/#work',{waitUntil:'networkidle0'});
   await page.waitForFunction(()=>document.documentElement.dataset.homePhase==='detail');
   for(let i=0;i<projects.length;i++){
    await page.focus('[data-project-index="'+i+'"]');await page.keyboard.press('Enter');
    await page.waitForFunction(i=>document.querySelector('[data-project-index="'+i+'"]').getAttribute('aria-selected')==='true',{},i);
    assert(await page.evaluate(()=>{
     const tabs=[...document.querySelectorAll('.home-project-tab')].map(e=>e.getBoundingClientRect());
     const board=document.querySelector('.home-project-board-surface > .home-project-board');
     const preview=document.querySelector('.home-project-preview:not([hidden])').getBoundingClientRect();
     return getComputedStyle(board).visibility==='hidden'&&tabs.every((r,i)=>r.height>=43.5&&Math.abs(r.left-tabs[0].left)<1&&Math.abs(r.width-tabs[0].width)<1&&(!i||r.top>=tabs[i-1].bottom))&&preview.top>=tabs[2].bottom+12&&document.querySelectorAll('.home-project-preview:not([hidden])').length===1&&document.documentElement.scrollWidth<=innerWidth;
    }),'Compact Projects hides pegboard, stacks usable tabs and shows only the selection underneath at '+width);
   }
  }
  const plain=await browser.newPage();await plain.setJavaScriptEnabled(false);
  for(const width of [360,1440]){
   await plain.setViewport({width,height:1024});await plain.goto(SITE+'/',{waitUntil:'networkidle0'});
   assert(await plain.evaluate(()=>{
    const work=document.querySelector('#work').getBoundingClientRect(),skills=document.querySelector('#skills').getBoundingClientRect();
    return [...document.querySelectorAll('.home-project-preview')].every(e=>e.getBoundingClientRect().bottom<=work.bottom+1)&&skills.top>=work.bottom&&document.documentElement.scrollWidth<=innerWidth;
   }),'No-JS project previews stay inside Work before Skills');
  }
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
  console.log('PASS original logo tabs, scoped summaries/covers, native UI-kit geometry, keyboard, real200% enlargement without CTA overlap, and no-JS document flow.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
