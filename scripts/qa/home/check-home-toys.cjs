const assert=require('node:assert/strict'),fs=require('node:fs');
const {puppeteer,chromePath}=require('../browser-runtime.cjs').browserRuntime();
const site=process.env.SITE_URL||'http://localhost:4317';
const out='.cache/qa/home-toys';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--disable-webgl']});try{
 const page=await browser.newPage(),errors=[],missing=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 await page.setViewport({width:1440,height:1024});await page.goto(site+'/',{waitUntil:'networkidle0'});await page.waitForSelector('.home-pan-decoration:not([disabled])');
 await page.waitForFunction(()=>document.getAnimations().every(a=>a.playState!=='running'));
 assert.equal(await page.$$eval('.home-pan-scene [data-source-pan-part]',es=>es.length),13,'All original pan/egg paths appear once in source paint order');
 assert(await page.$$eval('.home-pan-scene [data-source-pan-part]',es=>es.every(e=>e.getBBox().width>0)),'Every original vector part renders');
 assert.equal(await page.$$eval('.home-pan-scene use',es=>es.length),0,'No external fragment ID decoding is required');
 await page.screenshot({path:out+'/rest.png'});
 await page.focus('.home-pan-decoration');await page.keyboard.press('Enter');
 assert.equal(await page.evaluate(()=>document.documentElement.dataset.homePhase),'home','Pan never opens a view');
 await page.evaluate(()=>{for(const a of document.querySelector('.home-pan-scene').getAnimations({subtree:true})){a.pause();a.currentTime=520;}});
 const airborne=await page.$eval('.home-pan-scene',e=>{const egg=e.querySelector('.home-pan-egg'),m=new DOMMatrix(getComputedStyle(egg).transform);return{up:m.f,flip:m.d,yolk:getComputedStyle(e.querySelector('.home-pan-yolk')).filter};});
 assert(airborne.up<-100&&airborne.flip<0&&airborne.yolk.includes('brightness(0)'),'Egg rises, turns over and shows a white back face');
 await page.screenshot({path:out+'/egg-flip.png'});
 await page.evaluate(()=>{for(const a of document.querySelector('.home-pan-scene').getAnimations({subtree:true}))a.finish();});
 await page.waitForFunction(()=>!document.querySelector('.home-pan-decoration').hasAttribute('aria-busy'));
 assert(await page.$$eval('.home-pan-scene .home-pan-egg',es=>es.every(e=>getComputedStyle(e).transform==='none')),'The same egg pieces settle back into their original pose');

 await page.click('.home-ball');
 const flight=await page.$eval('.home-ball',e=>{const a=e.getAnimations()[0];a.pause();const f=a.effect.getKeyframes();return {duration:a.effect.getTiming().duration,frames:f.map(k=>({offset:k.offset,transform:k.transform}))};});
 const landings=flight.frames.filter(f=>f.transform.replace(/\s/g,'').includes('scale(1.17,0.8)'));
 assert.equal(landings.length,1,'First impact visibly squashes and spreads');
 const ground=await page.$eval('.home-ball',e=>{const r=e.getBoundingClientRect();return r.top+r.height*.85858;});
 for(const frame of flight.frames.filter(f=>f.offset<1&&f.transform.startsWith('translateY(0px)'))){
  await page.$eval('.home-ball',(e,at)=>{e.getAnimations()[0].currentTime=at;},frame.offset*flight.duration);
  const foot=await page.$eval('.home-ball',e=>{const r=e.getBoundingClientRect();return r.top+r.height*.85858;});
  assert(Math.abs(foot-ground)<.2,'Squash remains planted at the painted ball base');
 }
 await page.$eval('.home-ball',(e,at)=>{e.getAnimations()[0].currentTime=at;},landings[0].offset*flight.duration);
 await page.screenshot({path:out+'/ball-impact.png'});
 const count=await page.$eval('.home-ball',e=>e.getAnimations().length);await page.click('.home-ball');
 assert.equal(await page.$eval('.home-ball',e=>e.getAnimations().length),count,'Repeated clicks do not teleport or stack another bounce');
 await page.$eval('.home-ball',e=>e.getAnimations()[0].finish());await page.waitForFunction(()=>!document.querySelector('.home-ball').hasAttribute('aria-busy'));
 assert.equal(await page.$eval('.home-ball',e=>getComputedStyle(e).transform),'none');
 for(const width of [360,768,1280,1920]){
  await page.setViewport({width,height:900});await page.click('.home-pan-decoration');
  await page.waitForFunction(()=>!document.querySelector('.home-pan-decoration').hasAttribute('aria-busy'));
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Toy motion does not create horizontal scrolling');
 }
 await page.click('.home-ball');await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 await page.waitForFunction(()=>document.querySelector('.home-ball').getAnimations().length===0);
 assert.equal(await page.$eval('.home-ball',e=>getComputedStyle(e).transform),'none','Preference change clears in-flight motion');
 for(const selector of ['.home-pan-decoration','.home-ball']){await page.click(selector);assert(await page.$eval(selector,e=>e.getAnimations().every(a=>a.effect.getKeyframes().every(k=>!('transform'in k)))),'Reduced motion uses opacity only');}
 const slow=await browser.newPage();await slow.setCacheEnabled(false);await slow.setRequestInterception(true);
 slow.on('request',request=>{if(request.url().split('#')[0].endsWith('/pan.svg'))request.abort();else request.continue();});
 await slow.goto(site+'/?slow-pan=1',{waitUntil:'domcontentloaded'});
 await slow.waitForSelector('.home-pan-decoration:not([disabled])',{timeout:10000});
 assert(await slow.$eval('.home-pan-scene',e=>!e.hasAttribute('hidden')),'The same original vector pan stays usable without a separate SVG request');
 await slow.close();
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
 console.log('PASS native pan button, exact original parts, airborne egg turnover/back face, painted-base squash contacts, diminishing bounce, repeat clicks, responsive bounds and reduced motion.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
