const assert=require('node:assert/strict');
const fs=require('node:fs');
const {puppeteer,chromePath}=require('../browser-runtime.cjs').browserRuntime();
const SITE=process.env.SITE_URL||'http://localhost:4317';
const EMAIL='thanh.pham.work3112@gmail.com';
const out='.cache/qa/home-contact';fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--disable-webgl']});
 try{
  const page=await browser.newPage(),errors=[],missing=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
  const phase=name=>page.waitForFunction(name=>document.documentElement.dataset.homePhase===name,{timeout:12000},name);
  await page.setViewport({width:1440,height:1024});await page.goto(SITE+'/',{waitUntil:'networkidle0'});
  const geometry=await page.$eval('.home-note .home-note-art',art=>{
   const root=art.getBoundingClientRect(),scale=root.width/283.8684387207031;
   return [...art.querySelectorAll('.home-note-face,.home-note-shadow,.home-note-tab,.home-note-holes img')].map(e=>{const r=e.getBoundingClientRect();return[(r.left-root.left)/scale,(r.top-root.top)/scale,r.width/scale,r.height/scale];});
  });
  const expected=[[65,57,162,170],[61,53,162,170],[124,39,35,20],...Array.from({length:9},(_,i)=>[73+i*16,64,6.5,6.5])];
  geometry.forEach((r,i)=>r.forEach((v,j)=>assert(Math.abs(v-expected[i][j])<.35,'Figma note source geometry '+i+'/'+j+': '+v)));
  assert.equal(await page.$$eval('.home-note-rules > span',es=>es.length),9);
  await page.screenshot({path:out+'/desk-note.png'});
  await page.focus('.home-note');await page.keyboard.press('Enter');await phase('detail');
  await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'contact-subject');
  await page.click('.home-contact-send');
  assert.equal(await page.evaluate(()=>document.activeElement.id),'contact-subject');
  assert.equal(await page.$eval('#contact-subject',e=>e.getAttribute('aria-invalid')),'true');
  const subject='Project + Caf\u00e9? & #',message='Hello Emory,\nLet\u2019s work together & talk UI.';
  await page.type('#contact-subject',subject);await page.type('#contact-message',message);
  await page.evaluate(()=>{
   window.mailtoRequests=[];
   document.addEventListener('click',e=>{const a=e.target.closest('a[href^="mailto:"]');if(a){e.preventDefault();window.mailtoRequests.push(a.href);}},true);
   Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.copiedEmail=value;}}});
  });
  await page.click('.home-contact-send');
  const mailto=await page.evaluate(()=>window.mailtoRequests[0]);
  assert.equal(mailto,'mailto:'+EMAIL+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(message));
  assert((await page.$eval('#contact-status',e=>e.textContent)).includes('Review your message'));
  await page.click('.home-copy-email');assert.equal(await page.evaluate(()=>window.copiedEmail),EMAIL);
  assert.equal(await page.$eval('#contact-status',e=>e.textContent),'Email copied.');
  await page.evaluate(()=>navigator.clipboard.writeText=async()=>{throw Error('Clipboard blocked');});
  await page.click('.home-copy-email');assert.equal(await page.evaluate(()=>getSelection().toString()),EMAIL);
  assert((await page.$eval('#contact-status',e=>e.textContent)).includes('Email selected'));
  await page.click('.home-return');await phase('home');
  await page.click('.home-note');await phase('detail');
  assert.equal(await page.$eval('#contact-subject',e=>e.value),subject);assert.equal(await page.$eval('#contact-message',e=>e.value),message);
  await page.screenshot({path:out+'/contact-desktop.png',fullPage:true});
  for(const [width,height,zoom]of [[320,640,1],[360,800,1],[768,900,1],[1280,900,1],[1920,1080,1],[360,800,2],[1280,900,2]]){
   await page.setViewport({width,height});await page.evaluate(zoom=>document.documentElement.style.fontSize=zoom*100+'%',zoom);
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow '+width+'/'+zoom);
   const invalid=await page.$$eval('.home-contact-content :is(input,textarea,button)',es=>es.map(e=>{const r=e.getBoundingClientRect(),p=e.closest('.home-contact-paper').getBoundingClientRect();return {name:e.id||e.className,width:r.width,height:r.height,within:r.left>=p.left-.5&&r.right<=p.right+.5};}).filter(r=>r.width<24-.5||r.height<24-.5||!r.within));
   assert.deepEqual(invalid,[],'Restored paper keeps AA targets within its outline '+width+'/'+zoom);
   await page.screenshot({path:out+'/contact-'+width+'-'+zoom+'.png',fullPage:true});
  }
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  await page.click('.home-return');await phase('home');await page.evaluate(()=>document.documentElement.style.fontSize='');
  await page.click('.home-note');await phase('detail');assert.equal(await page.$('.home-zoom-art'),null);
  await page.setJavaScriptEnabled(false);await page.goto(SITE+'/?native-contact#contact',{waitUntil:'networkidle0'});
  assert.equal(await page.$eval('.home-contact-content',e=>e.action),'mailto:'+EMAIL);
  assert.equal(await page.$eval('.home-copy-email',e=>e.hidden),true);
  assert.equal(await page.$eval('#contact-email',e=>e.textContent),EMAIL);
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
  console.log('PASS Figma note geometry, keyboard/validation, encoded mail composer, copy/fallback, retained draft, responsive 320–1920/200%, reduced motion and native fallback.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
