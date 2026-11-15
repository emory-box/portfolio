const assert=require('node:assert/strict');
const fs=require('node:fs');
const {puppeteer,chromePath}=require('../browser-runtime.cjs').browserRuntime();
const SITE=process.env.SITE_URL||'http://localhost:4317';
const out='.cache/qa/home-game-art';fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--disable-webgl']});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const phase=name=>page.waitForFunction(name=>document.documentElement.dataset.homePhase===name,{timeout:12000},name);
  await page.setViewport({width:1280,height:900});await page.goto(SITE+'/',{waitUntil:'networkidle0'});
  await page.evaluate(()=>{window.originalGame=document.querySelector('.home-game-art');});
  assert.equal(await page.$$eval('.home-game-art',es=>es.length),1,'Only one live artwork exists');
  await page.focus('.home-play');await page.keyboard.press('Enter');
  await page.waitForFunction(()=>document.documentElement.dataset.homePhase==='settling-in');
  assert(await page.evaluate(()=>document.querySelector('.home-zoom-art .home-game-art')===window.originalGame),'The actual desk object travels through the zoom');
  const rotation=await page.$eval('.home-game-outline',e=>{const m=new DOMMatrix(getComputedStyle(e).transform);return Math.atan2(m.b,m.a)*180/Math.PI;});
  assert(rotation<0&&rotation> -45,'Paper straightens continuously while zooming');
  await phase('detail');
  assert(await page.evaluate(()=>document.querySelector('.home-game-display > .home-game-art')===window.originalGame),'Play uses that same original node');
  assert.equal(await page.$$eval('.home-game-art',es=>es.length),1);
  assert(await page.$$eval('.home-game-demo,.home-game-eraser',es=>es.every(e=>getComputedStyle(e).opacity==='0')),'Decorative moves fade away');
  const front=await page.$eval('.home-game-outline',e=>{const m=new DOMMatrix(getComputedStyle(e).transform);return Math.atan2(m.b,m.a)*180/Math.PI;});assert(Math.abs(front+45)<.01);
  assert(await page.$eval('.home-game-board',e=>getComputedStyle(e).borderTopWidth==='0px'),'No replacement framed game');
  await page.click('[data-cell="0"]');
  assert(await page.$eval('[data-cell="0"] img',e=>e.src.endsWith('/game-x.svg')),'Original illustrated X used for real moves');
  await page.waitForFunction(()=>[...document.querySelectorAll('[data-cell]')].some(e=>e.dataset.value==='O'));
  assert(await page.$eval('[data-value="O"] img',e=>e.src.endsWith('/game-o.svg')),'Original illustrated O used for AI');
  await page.screenshot({path:out+'/same-board-play.png',fullPage:true});
  await page.click('.home-return');await phase('home');
  assert(await page.evaluate(()=>document.querySelector('.home-play .home-game-art')===window.originalGame),'Same object returns to desk');
  assert.equal(await page.$eval('.home-game-demo',e=>getComputedStyle(e).opacity),'1');
  await page.click('.home-play');await phase('detail');
  assert.equal(await page.$eval('[data-cell="0"]',e=>e.dataset.value),'X','Game state is retained');
  await page.click('.home-game-reset');assert(await page.$$eval('[data-cell]',es=>es.every(e=>!e.dataset.value)));
  await page.click('.home-return');await phase('home');
  await page.evaluate(()=>document.querySelector('.home-play').click());await page.click('.home-return');await phase('home');
  assert(await page.evaluate(()=>document.querySelector('.home-play .home-game-art')===window.originalGame),'Early cancel restores original object');
  await page.evaluate(()=>document.querySelector('.home-play').click());await phase('settling-in');await page.click('.home-return');await phase('home');
  assert.equal(await page.$$eval('.home-game-art',es=>es.length),1,'Mid-arrival cancel creates no duplicate');
  for(const [width,height,zoom]of [[320,640,1],[360,800,1],[768,900,1],[1280,900,1],[1920,1080,1],[360,800,2]]){
   await page.setViewport({width,height});await page.goto(SITE+'/#play',{waitUntil:'networkidle0'});await phase('detail');
   await page.evaluate(zoom=>document.documentElement.style.fontSize=zoom*100+'%',zoom);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Fits '+width+'/'+zoom);
   assert(await page.$$eval('[data-cell]',es=>es.every(e=>{const r=e.getBoundingClientRect();return r.width>=24&&r.height>=24;})),'Accessible targets at '+width);
   await page.screenshot({path:out+'/game-'+width+'-'+zoom+'.png',fullPage:true});
  }
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await page.goto(SITE+'/#play',{waitUntil:'networkidle0'});await phase('detail');
  assert(await page.$eval('.home-game-art',e=>e.classList.contains('is-front')));
  assert.deepEqual(errors,[]);console.log('PASS same original game node, straighten/fade, illustrated live marks/AI, state/reset, reversal, 320–1920/200%, reduced motion.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
