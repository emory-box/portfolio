const assert=require('node:assert/strict'),fs=require('node:fs');
const {puppeteer:p,chromePath}=require('./browser-runtime.cjs').browserRuntime();
const SITE=process.env.SITE_URL||'http://localhost:4317';
fs.mkdirSync('.cache/qa/greeny',{recursive:true});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function storyStop(page,index,fraction=.9){
 await page.$eval(`[data-garden-step="${index}"]`,(step,fraction)=>{
  if(!step.classList.contains('has-device-hold')){step.scrollIntoView({block:'center',behavior:'instant'});return;}
  const base=parseFloat(step.style.getPropertyValue('--garden-step-height'));
  const hold=parseFloat(step.style.getPropertyValue('--garden-annotation-distance'));
  const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h'));
  scrollTo({top:step.getBoundingClientRect().top+scrollY+base/2-(innerHeight+header)/2+hold*fraction,behavior:'instant'});
 },fraction);
 await wait(100);
}
async function storyFrame(page,index){return page.$eval('.garden-story',(story,index)=>{
 const copy=story.querySelector(`[data-garden-step="${index}"] .garden-copy`),view=story.querySelector('.garden-view');
 return {step:story.dataset.step,copyOpacity:+getComputedStyle(copy).opacity,copyTop:copy.getBoundingClientRect().top,viewTop:view.getBoundingClientRect().top,shift:getComputedStyle(view).transform,label:+story.querySelector('[data-effect=device-label]').getAttribute('opacity')};
},index);}
async function checkHold(page,index){
 assert(await page.$eval(`[data-garden-step="${index}"]`,e=>e.classList.contains('has-device-hold')),'Readable device stop has a hold: '+index);
 await storyStop(page,index,0);const arrived=await storyFrame(page,index);
 assert.equal(arrived.step,String(index));assert.equal(arrived.copyOpacity,1);assert.equal(arrived.label,0,'Full content precedes annotation: '+index);
 await wait(200);assert.equal((await storyFrame(page,index)).label,0,'Waiting alone cannot reveal annotation: '+index);
 await storyStop(page,index,.1);assert.equal((await storyFrame(page,index)).label,0,'Quiet scroll beat: '+index);
 await storyStop(page,index,.5);const middle=await storyFrame(page,index);
 assert(middle.label>0&&middle.label<1,'Progressive annotation reveal: '+index);
 await storyStop(page,index,.9);const complete=await storyFrame(page,index);
 assert.equal(complete.label,1,'Annotation finishes before release: '+index);
 for(const held of [middle,complete]){
  assert.equal(held.step,String(index));assert.equal(held.copyOpacity,1);assert(Math.abs(held.copyTop-arrived.copyTop)<1,'Pinned explanation height: '+index);
  assert(Math.abs(held.viewTop-arrived.viewTop)<1&&held.shift===arrived.shift,'Settled garden pose: '+index);
 }
 await storyStop(page,index,.5);assert((await storyFrame(page,index)).label<1,'Reverse reveal: '+index);
 await storyStop(page,index,0);assert.equal((await storyFrame(page,index)).label,0,'Return to hold start: '+index);
}
(async()=>{const b=await p.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});try{
 const page=await b.newPage(),errors=[],missing=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
 for(const [width,height] of [[320,900],[320,640],[360,900],[360,640],[768,900],[1280,720],[1280,900],[1920,900]]){
  await page.setViewport({width,height});await page.goto(SITE+'/projects/greeny/');
  await page.evaluate(async()=>{await document.fonts.ready;document.documentElement.style.scrollBehavior='auto';});
  await page.waitForFunction(()=>document.querySelector('.garden-webgl'),{timeout:20000});
  assert.equal(await page.$$eval('.site-header a',es=>es.length),1,'Only All projects is clickable in the header');
  assert(await page.$eval('.site-header .brand',e=>!e.closest('a')&&!e.querySelector('a')),'App identity is not a navigation link');
  assert.equal(await page.$eval('#top-title',e=>e.textContent),'Manage your garden easier with Greeny');
  assert.equal(await page.$eval('#garden-sensors-title',e=>e.textContent),'Integrated sensors');
  assert.equal(await page.$eval('#garden-watering-title',e=>e.textContent),'Sprinkler');
  assert.equal(await page.$$eval('.garden-story .garden-app,.garden-story img[src*="app-"]',es=>es.length),0,'no phones in scroll scenes');
  if(height===900&&(width===360||width===1280)){
   await checkHold(page,1);
   assert.equal(await page.$eval('.garden-readings',e=>e.getAttribute('aria-hidden')),'false');
  }
  assert(!await page.$eval('#top',e=>e.classList.contains('has-device-hold')),'Introduction keeps its existing presentation');
  await storyStop(page,1);
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
  assert(fit.bottom<=await page.$eval('.garden-controls',e=>e.getBoundingClientRect().top)-12,'panel clears the animation control '+width+'x'+height);
  assert.deepEqual(fit.values,['32%','24°C','62%','12,400lx']);
  if(width===360||width===1280)await page.screenshot({path:`.cache/qa/greeny/${width}-${height}-sensor.png`});
  for(const i of [0,2,3,4,5,6]){
   if(i>1&&height===900&&(width===360||width===1280))await checkHold(page,i);
   await storyStop(page,i);
   await page.waitForFunction(i=>document.querySelector('.garden-story').dataset.step===String(i),{},i);await wait(80);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width+'/'+i);
   if(i===2){
    assert.equal(await page.$eval('[data-effect=device-label]',e=>e.querySelector('text').textContent),'Sprinkler');
    assert.equal(await page.$eval('[data-effect=device-label]',e=>e.getAttribute('opacity')),'1');
    assert.equal(await page.$$eval('.garden-device-label',es=>es.length),0,'no duplicate plain device labels');
    assert.equal(await page.$eval('#garden-watering .garden-copy > p',e=>e.textContent),'Automated irrigation devices triggered by sensor thresholds or user-defined schedules, ensuring plants receive the right amount of water without manual effort.');
    if(width===360||width===1280)await page.screenshot({path:`.cache/qa/greeny/${width}-${height}-sprinkle.png`});
   }
   if(i>=3){
    const expected={3:'Fan',4:'Shade',5:'Grow lights',6:'Hub'}[i];
    const badge=await page.$eval('[data-effect=device-label]',e=>{const r=e.querySelector('rect').getBoundingClientRect(),view=e.ownerSVGElement.getBoundingClientRect();return {text:e.querySelector('text').textContent,opacity:e.getAttribute('opacity'),left:r.left,right:r.right,top:r.top,bottom:r.bottom,viewLeft:view.left,viewRight:view.right,viewTop:view.top,viewBottom:view.bottom,width:r.width,height:r.height};});
    assert.equal(badge.text,expected,'consistent device annotation '+i);assert.equal(badge.opacity,'1');
    assert(badge.left>=badge.viewLeft&&badge.right<=badge.viewRight&&badge.top>=badge.viewTop&&badge.bottom<=badge.viewBottom,'device annotation fits its model view '+width+'/'+i);
   }
   if(i===5){assert(+await page.$eval('[data-effect=lighting]',e=>e.getAttribute('opacity'))>.95,'lighting A visible');assert.equal(await page.$$eval('.garden-light-lens',es=>es.length),2);}
   if((width===360||width===1280)&&[0,3,4,5,6].includes(i))await page.screenshot({path:`.cache/qa/greeny/${width}-${height}-${i}.png`});
  }
  await page.$eval('#brief',e=>e.scrollIntoView({block:'start',behavior:'instant'}));await wait(100);
  assert(await page.$eval('.garden-story',s=>s.querySelector('.garden-stage').getBoundingClientRect().bottom<=s.getBoundingClientRect().bottom+1),'Final garden stays within the story above the case study');
  console.log('PASS Greeny story: '+width+'x'+height+', source copy/readings, six staged device stops, aligned lights and final boundary.');
 }
 await page.setViewport({width:1280,height:900});await page.reload();await page.waitForFunction(()=>document.querySelector('.garden-webgl'));await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
 await storyStop(page,1);await page.waitForFunction(()=>document.querySelector('.garden-story').dataset.step==='1');
 await page.$eval('#garden-watering',e=>e.scrollIntoView({block:'center',behavior:'instant'}));await wait(100);assert.equal(await page.$eval('.garden-story',e=>e.dataset.sensorState),'ready');
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await page.$eval('#garden-sensors',e=>e.scrollIntoView({block:'center',behavior:'instant'}));await wait(100);assert.equal(await page.$eval('.garden-readings',e=>e.getAttribute('aria-hidden')),'false');
 assert.equal(await page.$eval('[data-effect=device-label]',e=>e.getAttribute('opacity')),'1','reduced motion retains the still annotation');
 await page.setJavaScriptEnabled(false);await page.reload();assert(await page.$eval('.garden-readings',e=>getComputedStyle(e).visibility==='visible'));
 assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);console.log('PASS return visits, reduced motion/no JS preserve readings, no script errors or missing requests.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1);});
