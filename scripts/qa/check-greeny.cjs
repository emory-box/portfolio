const assert=require('node:assert/strict'),fs=require('node:fs');
const {puppeteer:p,chromePath}=require('./browser-runtime.cjs').browserRuntime();
const SITE=process.env.SITE_URL||'http://localhost:4317';
fs.mkdirSync('.cache/qa/greeny',{recursive:true});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await p.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});try{
 const page=await b.newPage(),errors=[],missing=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 for(const [width,height] of [[320,900],[320,640],[360,900],[360,640],[768,900],[1280,720],[1280,900],[1920,900]]){
  await page.setViewport({width,height});await page.goto(SITE+'/projects/greeny/');
  await page.evaluate(async()=>{await document.fonts.ready;document.documentElement.style.scrollBehavior='auto';});
  await page.waitForFunction(()=>document.querySelector('.garden-webgl'),{timeout:20000});
  assert.equal(await page.$$eval('.site-header a',es=>es.length),1,'header contains only the linked Greeny logo and name');
  assert.equal(await page.$eval('#top-title',e=>e.textContent),'Manage your garden easier with Greeny');
  assert.equal(await page.$eval('#garden-sensors-title',e=>e.textContent),'Sensors');
  assert.equal(await page.$eval('#garden-watering-title',e=>e.textContent),'Sprinkle');
  assert.equal(await page.$$eval('.garden-story .garden-app,.garden-story img[src*="app-"]',es=>es.length),0,'no phones in scroll scenes');
  await page.$eval('#garden-sensors',e=>e.scrollIntoView({block:'center',behavior:'instant'}));
  await page.waitForFunction(()=>document.querySelector('.garden-story').dataset.step==='1');
  assert.equal(await page.$eval('.garden-readings',e=>e.getAttribute('aria-hidden')),'false','readings appear on arrival without a collection timer');
  assert.equal(await page.$eval('[data-effect=sensor]',e=>e.getAttribute('opacity')),'1');
  assert.equal(await page.$eval('[data-effect=device-label]',e=>e.getAttribute('opacity')),'1','sensor has an anchored annotation');
  const annotation=await page.$eval('[data-effect=device-label]',e=>{const r=e.querySelector('rect').getBoundingClientRect();const view=e.ownerSVGElement.getBoundingClientRect();return {text:e.querySelector('text').textContent,left:r.left,right:r.right,top:r.top,bottom:r.bottom,viewLeft:view.left,viewRight:view.right,viewTop:view.top,viewBottom:view.bottom,dashes:getComputedStyle(e.querySelector('path')).strokeDasharray};});
  assert.equal(annotation.text,'Sensor');assert.notEqual(annotation.dashes,'none');
  assert(annotation.left>=annotation.viewLeft&&annotation.right<=annotation.viewRight&&annotation.top>=annotation.viewTop&&annotation.bottom<=annotation.viewBottom,'annotation fits inside the model view');
  await page.waitForFunction(()=>document.querySelector('.garden-story').dataset.sensorState==='ready');await wait(600);
  const fit=await page.$eval('.garden-readings',e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,values:[...e.querySelectorAll('dd')].map(v=>v.textContent)};});
  assert(fit.left>=0&&fit.right<=width,'panel horizontal '+width);assert(fit.top>=60&&fit.bottom<height-48,'panel vertical '+width+'x'+height+' '+JSON.stringify(fit));
  assert(fit.bottom<=await page.$eval('.garden-progress',e=>e.getBoundingClientRect().top)-12,'panel clears the progress controls '+width+'x'+height);
  assert.deepEqual(fit.values,['32%','24°C','62%','12,400lx']);
  if(width===360||width===1280)await page.screenshot({path:`.cache/qa/greeny/${width}-${height}-sensor.png`});
  for(const i of [0,2,3,4,5,6,7]){
   await page.$eval(`[data-garden-step="${i}"]`,e=>e.scrollIntoView({block:'center',behavior:'instant'}));
   await page.waitForFunction(i=>document.querySelector('.garden-story').dataset.step===String(i),{},i);await wait(80);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width+'/'+i);
   if(i===2){
    assert.equal(await page.$eval('[data-effect=device-label]',e=>e.querySelector('text').textContent),'Sprinkle');
    assert.equal(await page.$eval('[data-effect=device-label]',e=>e.getAttribute('opacity')),'1');
    assert.equal(await page.$$eval('.garden-device-label',es=>es.length),0,'no duplicate plain device labels');
    assert.equal(await page.$eval('.garden-current',e=>e.textContent),'Sprinkle');
    assert.equal(await page.$eval('#garden-watering .garden-copy > p',e=>e.textContent),'Automated irrigation devices triggered by sensor thresholds or user-defined schedules, ensuring plants receive the right amount of water without manual effort.');
    if(width===360||width===1280)await page.screenshot({path:`.cache/qa/greeny/${width}-${height}-sprinkle.png`});
   }
   if(i>=3){
    const expected={3:'Fan',4:'Shade',5:'Grow lights',6:'Hub',7:'Hub'}[i];
    const badge=await page.$eval('[data-effect=device-label]',e=>{const r=e.querySelector('rect').getBoundingClientRect(),view=e.ownerSVGElement.getBoundingClientRect();return {text:e.querySelector('text').textContent,opacity:e.getAttribute('opacity'),left:r.left,right:r.right,top:r.top,bottom:r.bottom,viewLeft:view.left,viewRight:view.right,viewTop:view.top,viewBottom:view.bottom,width:r.width,height:r.height};});
    assert.equal(badge.text,expected,'consistent device annotation '+i);assert.equal(badge.opacity,'1');
    assert(badge.left>=badge.viewLeft&&badge.right<=badge.viewRight&&badge.top>=badge.viewTop&&badge.bottom<=badge.viewBottom,'device annotation fits its model view '+width+'/'+i);
   }
   if(i===5){assert(+await page.$eval('[data-effect=lighting]',e=>e.getAttribute('opacity'))>.95,'lighting A visible');assert.equal(await page.$$eval('.garden-light-lens',es=>es.length),2);}
   if((width===360||width===1280)&&[0,3,4,5,6,7].includes(i))await page.screenshot({path:`.cache/qa/greeny/${width}-${height}-${i}.png`});
  }
  console.log('PASS Greeny story: '+width+'x'+height+', Figma header/copy, immediate readings, anchored sensor label, 8 stops and aligned lights.');
 }
 await page.setViewport({width:1280,height:900});await page.reload();await page.waitForFunction(()=>document.querySelector('.garden-webgl'));await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
 await page.$eval('#garden-sensors',e=>e.scrollIntoView({block:'center',behavior:'instant'}));await page.waitForFunction(()=>document.querySelector('.garden-story').dataset.step==='1');
 await page.$eval('#garden-watering',e=>e.scrollIntoView({block:'center',behavior:'instant'}));await wait(100);assert.equal(await page.$eval('.garden-story',e=>e.dataset.sensorState),'ready');
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await page.$eval('#garden-sensors',e=>e.scrollIntoView({block:'center',behavior:'instant'}));await wait(100);assert.equal(await page.$eval('.garden-readings',e=>e.getAttribute('aria-hidden')),'false');
 assert.equal(await page.$eval('[data-effect=device-label]',e=>e.getAttribute('opacity')),'1','reduced motion retains the still annotation');
 await page.setJavaScriptEnabled(false);await page.reload();assert(await page.$eval('.garden-readings',e=>getComputedStyle(e).visibility==='visible'));
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);console.log('PASS return visits, reduced motion/no JS preserve readings, no script errors or missing requests.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1);});
