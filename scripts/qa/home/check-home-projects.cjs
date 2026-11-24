const assert=require('node:assert/strict');
const {projects}=require('../../../authoring/portfolio/content.cjs');
const {puppeteer,chromePath}=require('../browser-runtime.cjs').browserRuntime();
const SITE=process.env.SITE_URL||'http://localhost:4317';
const homeCss=require('node:fs').readFileSync(require('node:path').join(__dirname,'../../../assets/css/home.css'));
const styleVersion=require('node:crypto').createHash('sha256').update(homeCss).digest('hex').slice(0,12);
(async()=>{
 const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--disable-webgl']});
 try{
  const page=await browser.newPage(),errors=[],missing=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
  await page.setViewport({width:1440,height:1024});await page.goto(SITE+'/#work',{waitUntil:'networkidle0'});await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.$eval('link[href*="assets/css/home.css"]',e=>e.getAttribute('href')),'assets/css/home.css?v='+styleVersion,'Home requests the current stylesheet instead of a cached earlier version');
  assert.equal(await page.$$eval('.home-project-tab[aria-selected="true"],.home-project-preview:not([hidden])',es=>es.length),0,'Projects starts without a selection or preview');
  assert(await page.$eval('.home-project-prompt',e=>!e.hidden&&e.textContent.includes('Choose an object on the pegboard')),'Desktop has a selection prompt');
  await page.click('[data-project-index="1"]');
  await page.waitForFunction(()=>document.querySelector('[data-project-index="1"]').getAttribute('aria-selected')==='true');
  const native=await page.$eval('.home-project-preview:not([hidden])',e=>{
   const type=getComputedStyle(e.querySelector('.home-project-type')),duration=getComputedStyle(e.querySelector('.home-project-duration'));
   return {type:parseFloat(type.lineHeight),duration:parseFloat(duration.lineHeight),cta:e.querySelector('.home-project-open').getBoundingClientRect().y};
  });
  assert(Math.abs(native.type-32)<.1);assert(Math.abs(native.duration-32)<.1);assert(Math.abs(native.cta-891)<1,'Native action is inset12px above its previous slot');
  assert.equal(new Set(projects.map(p=>p.homeSummary)).size,3,'Distinct summaries');
  assert(await page.$$eval('.home-project-preview .portfolio-cover',es=>es.every(e=>getComputedStyle(e).borderTopWidth==='0px')),'Project preview frames have no border');
  assert(await page.$eval('#project-moti-pulse .portfolio-cover img',e=>e.complete&&e.naturalWidth>0&&e.src.endsWith('/moti-home-cover.png')&&getComputedStyle(e).objectFit==='contain'),'Moti preview uses the full existing banner without cropping');
  for(let i=0;i<projects.length;i++){
   await page.click('[data-project-index="'+i+'"]');
   await page.waitForFunction(i=>document.querySelector('[data-project-index="'+i+'"]').getAttribute('aria-selected')==='true',{},i);
   assert.equal(await page.$eval('.home-project-preview:not([hidden]) .home-project-summary',e=>e.textContent),projects[i].homeSummary);
   assert.equal(await page.$eval('.home-board-preview img:not([hidden])',e=>e.getAttribute('src')),'assets/img/home/'+projects[i].homeBoard);
   assert.equal(await page.$eval('.home-project-preview:not([hidden]) a',e=>e.getAttribute('href')),'projects/'+projects[i].slug+'/');
   assert(await page.$eval('.home-project-prompt',e=>e.hidden),'Prompt hides after selection');
   assert.equal(await page.$$eval('.home-project-preview:not([hidden]) a, .home-project-preview:not([hidden]) button',es=>es.length),1,'Read more is the only interactive element in the preview');
   await page.hover('.home-project-preview:not([hidden]) .portfolio-cover');
   assert.equal(await page.$eval('.home-project-preview:not([hidden]) .home-project-open',e=>getComputedStyle(e).textDecorationLine),'none','Hovering the cover does not style read more');
   await page.click('.home-project-preview:not([hidden]) .portfolio-cover');
   assert(new URL(page.url()).pathname.endsWith('/'),'Clicking the cover does not navigate');
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
   await page.goto(SITE+'/?project-default='+width+'#work',{waitUntil:'networkidle0'});
   await page.waitForFunction(()=>document.documentElement.dataset.homePhase==='detail');
   assert.equal(await page.$$eval('.home-project-preview:not([hidden])',es=>es.length),0,'Compact view also starts without a selection');
   assert(await page.$eval('.home-project-prompt-tabs',e=>getComputedStyle(e).display!=='none'&&e.textContent.includes('above')),'Compact prompt refers to the tabs');
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
