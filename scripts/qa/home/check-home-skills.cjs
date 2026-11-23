const assert=require('node:assert/strict');
const {homeSkills}=require('../../../authoring/portfolio/content.cjs');
const {puppeteer,chromePath}=require('../browser-runtime.cjs').browserRuntime();
const site=process.env.SITE_URL||'http://localhost:4317';
(async()=>{const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--disable-webgl']});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const phase=p=>page.waitForFunction(p=>document.documentElement.dataset.homePhase===p,{},p);
 for(const [width,height]of [[1440,1024],[1280,720],[768,900],[360,800],[320,568]]) {
  await page.setViewport({width,height});await page.goto(site+'/',{waitUntil:'networkidle0'});
  await page.evaluate(()=>window.originalToast=document.querySelector('.home-toast-art'));
  await page.focus('.home-skills');await page.keyboard.press('Enter');await phase('melting-butter');
  assert.equal(await page.$eval('.home-skills-copy',e=>+getComputedStyle(e).opacity),0,'Text waits for the continuous butter morph');
  await phase('detail');
  assert(await page.evaluate(()=>document.querySelector('[data-view="skills"]').contains(originalToast)),'The original bread travels into the view');
  assert.deepEqual(await page.$$eval('.home-skills-list li',es=>es.map(e=>e.textContent)),homeSkills.map(s=>s.text),'Every latest Figma word is present');
  const compact=await page.$eval('.home-skills-stage',e=>e.dataset.skillsMode==='paged');
  if(!compact) {
   assert.equal(width>=768,true,'Readable word cloud on desktop/tablet');
   assert(await page.$$eval('.home-skill-word > span',es=>es.every(e=>{
    const svg=document.querySelector('.home-butter-live'),body=svg.querySelector('.home-butter-body');
    const inverse=svg.getScreenCTM().inverse(),r=e.getBoundingClientRect();
    return [0,.5,1].every(x=>[0,.5,1].every(y=>body.isPointInFill(new DOMPoint(r.left+r.width*x,r.top+r.height*y).matrixTransform(inverse))));
   })),'All native words lie inside the actual butter contour');
  } else {
   const seen=new Set();
   for(let n=0;n<homeSkills.length;n++){
    for(const word of await page.$$eval('.home-skills-list li:not([hidden])',es=>es.map(e=>e.textContent)))seen.add(word);
    if(await page.$eval('.home-skills-pages button:last-child',e=>e.disabled))break;
    await page.focus('.home-skills-pages button:last-child');await page.keyboard.press('Enter');
   }
   assert.equal(seen.size,homeSkills.length,'Keyboard pagination reaches every skill');
  }
  assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1&&document.documentElement.scrollWidth<=innerWidth),'Whole bread fits without page scrolling');
  await page.click('.home-return');await phase('home');
  assert(await page.evaluate(()=>originalToast.closest('.home-stage')),'The same bread returns home');
 }
 await page.setViewport({width:360,height:800});await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 await page.setViewport({width:1280,height:720});await page.goto(site+'/#skills',{waitUntil:'networkidle0'});await phase('detail');
 assert.equal(await page.$eval('.home-skills-stage',e=>e.dataset.skillsMode),'cloud');
 await page.evaluate(()=>document.documentElement.style.fontSize='200%');
 await page.waitForFunction(()=>document.querySelector('.home-skills-stage').dataset.skillsMode==='paged');
 await page.evaluate(()=>document.documentElement.style.fontSize='');
 await page.waitForFunction(()=>document.querySelector('.home-skills-stage').dataset.skillsMode==='cloud');
 await page.setViewport({width:360,height:800});
 await page.goto(site+'/#skills',{waitUntil:'networkidle0'});await phase('detail');
 await page.evaluate(()=>document.documentElement.style.fontSize='200%');
 await page.waitForFunction(()=>parseFloat(getComputedStyle(document.querySelector('.home-skills-list')).fontSize)===32);
 assert(await page.$eval('.home-skills-mobile',e=>{const r=e.getBoundingClientRect();return r.left>=16&&r.right<=innerWidth-16}),'Enlarged skill copy remains in view');
 const plain=await browser.newPage();await plain.setJavaScriptEnabled(false);await plain.setViewport({width:360,height:800});await plain.goto(site+'/',{waitUntil:'networkidle0'});
 assert.equal(await plain.$$eval('.home-skill-word',es=>es.length),homeSkills.length,'All skills remain native readable text without JavaScript');
 assert(await plain.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
 console.log('PASS latest Figma word cloud on butter, same original object, readable keyboard paging, reduced motion,200% text and no-JS content.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
