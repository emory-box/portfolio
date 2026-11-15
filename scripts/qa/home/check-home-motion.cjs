const assert=require('node:assert/strict');
const fs=require('node:fs');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const {puppeteer,chromePath}=require('../browser-runtime.cjs').browserRuntime();
const SITE=process.env.SITE_URL||'http://localhost:4317';
const out='.cache/qa/home-section4';fs.mkdirSync(out,{recursive:true});
const pause=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const {computerMove,result}=await import(pathToFileURL(path.resolve('assets/js/home/tic-tac-toe.js')));
 assert.equal(result(['X','X','X','','','','','','']).winner,'X');
 assert.equal(result(['O','','','O','','','O','','']).winner,'O');
 assert.equal(result(['X','O','X','X','O','O','O','X','X']).winner,'draw');
 let finishes=0;
 function explore(board){
  const end=result(board);if(end){assert.notEqual(end.winner,'X','Computer cannot lose to a legal human sequence');finishes++;return;}
  for(let i=0;i<9;i++)if(!board[i]){const next=[...board];next[i]='X';if(!result(next)){const before=[...next];const move=computerMove(next);assert.deepEqual(next,before,'AI does not mutate caller state');assert.equal(next[move],'');next[move]='O';}explore(next);}
 }
 explore(Array(9).fill(''));console.log('PASS tic-tac-toe rules, legal moves and '+finishes+' complete human/computer paths.');
 const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--disable-webgl']});
 try{
  const page=await browser.newPage(),errors=[],missing=[],external=[];
  const phase=name=>page.waitForFunction(name=>document.documentElement.dataset.homePhase===name,{timeout:12000},name);
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
  page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith(SITE+'/'))external.push(r.url());});
  for(const width of [360,768,1280,1920]){
   await page.setViewport({width,height:900});await page.goto(SITE+'/',{waitUntil:'networkidle0'});
   await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>document.getAnimations().every(a=>a.playState==='finished'));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1),'Home fits '+width);
   assert(await page.$$eval('img',es=>es.every(e=>e.complete&&e.naturalWidth>0)));
   assert.equal(await page.$$eval('dialog,[aria-modal="true"]',es=>es.length),0,'No modal windows');
   assert.equal(await page.$$eval('.home-view',es=>es.length),5);
   if(width===1280){
    assert.equal(await page.evaluate(()=>{document.querySelector('.home-projects').click();return document.documentElement.dataset.homePhase;}),'zooming-in');
    assert(await page.$eval('[data-view="work"]',e=>e.hidden),'Content waits for object zoom');
    await page.waitForFunction(()=>{const stage=document.querySelector('.home-stage'),opacity=+getComputedStyle(document.querySelector('.home-portrait')).opacity;return new DOMMatrix(getComputedStyle(stage).transform).a>1.03&&opacity>.01&&opacity<.95;});
    await page.screenshot({path:out+'/camera-and-neighbor-fade.png'});
    const proxy=await page.$('.home-zoom-art');
    const endpoint=await page.$eval('.home-zoom-art',e=>{
      const keys=e.getAnimations()[0].effect.getKeyframes();
      if(!keys.every(k=>k.transform&&!('left'in k)&&!('width'in k)))throw Error('Artwork must animate transforms only');
      const end=new DOMMatrix(keys.at(-1).transform),width=Number(e.dataset.width)*end.a;
      return {left:end.e,top:end.f,width};
    });
    await phase('settling-in');
    assert(await proxy.evaluate(e=>e===document.querySelector('.home-zoom-art')),'One artwork proxy crosses the scene boundary');
    await phase('detail');
    const live=await page.$eval('.home-project-board',e=>{const r=e.getBoundingClientRect();return {left:r.left,top:r.top,width:r.width};});
    for(const key of ['left','top','width'])assert(Math.abs(live[key]-endpoint[key])<1,'No artwork jump on final handoff: '+key);
    await page.click('.home-return');await phase('home');
   }
   for(const id of ['about','work','skills','contact','play']){
    const trigger='.home-stage a[href="#'+id+'"]';
    await page.focus(trigger);await page.keyboard.press('Enter');await phase('detail');
    const selector='.home-view[data-view="'+id+'"]';
    assert(!(await page.$eval(selector,e=>e.hidden)));
    assert(await page.$eval('.home-return',e=>!e.hidden&&e===document.activeElement),'Return is visible and focused');
    assert(await page.$eval(selector,e=>getComputedStyle(e).boxShadow==='none'&&getComputedStyle(e).borderTopWidth==='0px'),'Ordinary full-page scene');
    assert(await page.evaluate(()=>document.querySelector('.home-scene').hidden&&document.querySelector('.home-header').hidden));
    if(id==='work'){
     await page.focus('[role="tab"][aria-selected="true"]');await page.keyboard.press('End');
     assert.equal(await page.$eval('.home-project-preview:not([hidden]) h3',e=>e.textContent),'Synergy');
     await page.keyboard.press('ArrowUp');assert.equal(await page.$eval('[aria-selected="true"]',e=>e.textContent),'Moti-Pulse');
     await page.keyboard.press('Home');assert.equal(await page.$eval('.home-project-preview:not([hidden]) h3',e=>e.textContent),'Greeny');
    }
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Detail fits '+id+'/'+width);
    if(width===1280)await page.screenshot({path:out+'/focus-'+id+'.png'});
    if(id==='work'||id==='contact')await page.click('.home-return');else await page.keyboard.press('Escape');
    await phase('home');
    assert(await page.$eval(trigger,e=>e===document.activeElement),'Focus returns to clicked object');
    assert.equal(await page.$$eval('.home-zoom-art',es=>es.length),0,'No leftover zoom artwork');
   }
   console.log('PASS spatial views, Back/Escape, focus, original assets and fit: '+width+'px');
  }
  await page.setViewport({width:1280,height:720});await page.goto(SITE+'/',{waitUntil:'networkidle0'});
  await page.evaluate(()=>document.querySelector('.home-skills').click());await page.click('.home-return');await phase('home');await pause(700);
  assert.equal(await page.evaluate(()=>document.documentElement.dataset.homePhase),'home','Cancel during zoom cannot reopen detail');
  await page.click('.home-play');await phase('detail');
  await page.click('[data-cell="0"]');assert.equal(await page.$eval('[data-cell="0"]',e=>e.textContent),'X');
  await page.waitForFunction(()=>[...document.querySelectorAll('[data-cell]')].some(e=>e.textContent==='O'));
  assert(await page.$eval('[data-cell="0"]',e=>e.disabled));
  await page.click('.home-game-reset');assert(await page.$$eval('[data-cell]',es=>es.every(e=>!e.textContent&&!e.disabled)));
  await page.click('[data-cell="0"]');await page.keyboard.press('Escape');await phase('home');
  assert.equal(await page.$$eval('[data-cell]',es=>es.filter(e=>e.textContent==='O').length),0,'Leaving pauses pending AI');
  await page.click('.home-play');await phase('detail');await page.waitForFunction(()=>[...document.querySelectorAll('[data-cell]')].some(e=>e.textContent==='O'));
  await page.click('.home-return');await phase('home');
  await page.click('.home-ball');await pause(120);
  assert(await page.$eval('.home-ball',e=>e.getAnimations().some(a=>a.playState==='running')));
  assert.equal(await page.evaluate(()=>document.documentElement.dataset.homePhase),'home','Ball never navigates or zooms');
  assert.equal(await page.evaluate(()=>location.hash),'');
  assert.equal(await page.$eval('.home-stage',e=>getComputedStyle(e).transform),'none','Ball does not move the camera');
  await page.click('.home-ball');assert.equal(await page.$eval('.home-ball',e=>e.getAnimations().length),1);
  await page.goto(SITE+'/#work',{waitUntil:'networkidle0'});await phase('detail');
  assert.equal(await page.evaluate(()=>document.documentElement.dataset.homeView),'work');
  await page.click('.home-return');await phase('home');
  await page.click('.home-portrait');await phase('detail');await page.goBack();await phase('home');
  await page.evaluate(()=>document.querySelector('.home-note').click());await page.setViewport({width:360,height:900});await phase('detail');
  assert.equal(await page.$$eval('.home-zoom-art',es=>es.length),0,'Resize settles transition safely');
  await page.click('.home-return');await phase('home');
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await page.setViewport({width:360,height:640});await page.goto(SITE+'/',{waitUntil:'networkidle0'});
  await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  assert(await page.$$eval('.home-header a,.home-owner',es=>es.every(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.left>=0&&r.right<=innerWidth;})));
  for(const id of ['about','work','skills','contact','play']){
   await page.click('.home-stage a[href="#'+id+'"]');await phase('detail');
   assert.equal(await page.$eval('.home-stage',e=>getComputedStyle(e).transform),'none','Reduced-motion camera is static');
   await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
   assert(await page.$eval('.home-return',e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&e.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2));}),'Return remains usable after scroll, 200% text: '+id);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'200% detail fits');
   await page.click('.home-return');await phase('home');
  }
  const plain=await browser.newPage();await plain.setJavaScriptEnabled(false);await plain.setViewport({width:360,height:900});await plain.goto(SITE+'/',{waitUntil:'networkidle0'});
  assert.equal(await plain.$$eval('.home-panel',es=>es.length),5);
  assert(await plain.$$eval('.home-project',es=>es.every(e=>e.getBoundingClientRect().height>0)));
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);assert.deepEqual(external,[]);
  console.log('PASS camera-first ordering, fading context, reverse/cancel, game/reset/pause/resume, bounce-only ball, history, resize, 200%, reduced motion and no script.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
