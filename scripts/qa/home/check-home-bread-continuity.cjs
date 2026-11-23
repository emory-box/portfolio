const assert=require('node:assert/strict');
const {puppeteer,chromePath}=require('../browser-runtime.cjs').browserRuntime();
const site=process.env.SITE_URL||'http://localhost:4317';
(async()=>{const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--disable-webgl']});try{
 const page=await browser.newPage();await page.setViewport({width:1440,height:1024});
 await page.goto(site+'/',{waitUntil:'networkidle0'});
 await page.evaluate(()=>{window.originalBread=document.querySelector('.home-toast-art');window.originalCrust=[...originalBread.querySelectorAll('.home-toast-rest-part')];});
 await page.click('.home-skills');await page.waitForFunction(()=>document.documentElement.dataset.homePhase==='melting-butter');
 for(const progress of [0,.25,.5,.75,1]){
  const state=await page.evaluate(progress=>{
   for(const a of originalBread.getAnimations({subtree:true})){a.pause();const t=a.effect.getTiming();a.currentTime=(t.delay||0)+t.duration*progress;}
   const crust=originalCrust.map(e=>({opacity:+getComputedStyle(e).opacity,connected:originalBread.contains(e)}));
   const replacement=originalBread.querySelector('.home-toast-focus');
   return {crust,replacementVisible:!!replacement&&+getComputedStyle(replacement).opacity>.001};
  },progress);
  assert(state.crust.every(p=>p.connected&&p.opacity===1),'The original bread/crust/shadow stays fully visible at melt '+progress);
  assert.equal(state.replacementVisible,false,'No second bread appears during the butter melt');
 }
 await page.evaluate(()=>originalBread.getAnimations({subtree:true}).forEach(a=>a.play()));
 await page.waitForFunction(()=>document.documentElement.dataset.homePhase==='detail');
 assert(await page.evaluate(()=>originalCrust.every(e=>originalBread.contains(e)&&+getComputedStyle(e).opacity===1)),'Original crust remains after settling');
 await page.click('.home-return');await page.waitForFunction(()=>document.documentElement.dataset.homePhase==='home');
 assert(await page.evaluate(()=>originalBread.closest('.home-stage')&&originalCrust.every(e=>originalBread.contains(e)&&+getComputedStyle(e).opacity===1)),'The same bread and crust return home');
 console.log('PASS original bread/crust/shadow remain opaque through melt, settle and return; no replacement bread.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
