const assert=require('node:assert/strict'),fs=require('node:fs');
const {puppeteer,chromePath}=require('./browser-runtime.cjs').browserRuntime();
const SITE=process.env.SITE_URL||'http://localhost:4317';
const ids=['brief','branding','brand-safezone','research','personas','experience','sitemap','user-flows','ui','typography','icons','components','interface'];
const {personas:sourcePersonas,segments:sourceSegments,attribution:sourceAttribution}=require('../../authoring/greeny/case-study/content.cjs');
const legacy=['brief','system','ui','interface','brand','notes','problem','personas','sitemap','function-ideation','components','app-design','advertising','wireframe'];

(async()=>{
 const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox']});
 try {
  const page=await browser.newPage(),errors=[],missing=[],external=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
  page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith(SITE+'/'))external.push(r.url());});
  // This case study must work independently of optional WebGL rendering.
  await page.evaluateOnNewDocument(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return String(type).includes('webgl')?null:original.call(this,type,...args);};});
  fs.mkdirSync('.cache/qa/greeny/case-study',{recursive:true});
  for(const width of [320,360,768,1280,1920]){
   await page.setViewport({width,height:900});await page.goto(SITE+'/projects/greeny/',{waitUntil:'networkidle0'});
   await page.evaluate(async()=>{document.documentElement.style.scrollBehavior='auto';await Promise.all([document.fonts.load('800 24px "Nunito Greeny Vietnamese"','Đồ thị'),document.fonts.load('400 18px "Inter Greeny Vietnamese"','Giới thiệu')]);document.querySelectorAll('.greeny-case-study img').forEach(img=>img.loading='eager');});
   await page.$$eval('.greeny-case-study img',imgs=>Promise.all(imgs.map(img=>img.decode())));
   assert.deepEqual(await page.$$eval('.greeny-case-study > section',els=>els.map(el=>el.id)),ids,'Source chapter order');
   for(const id of legacy)assert.equal(await page.$$eval('[id="'+id+'"]',els=>els.length),1,'Retained anchor '+id);
   assert.deepEqual(await page.$$eval('.deck-persona-name',els=>els.map(el=>el.textContent)),['DUC PHU','PHUONG LAN']);
   assert(await page.$$eval('.deck-persona',els=>els.every(el=>el.lang==='en')),'Personas identify the supplied English copy');
   assert.deepEqual(await page.$$eval('.deck-persona:first-child h5',els=>els.map(el=>el.textContent)),['About','Pain Points','Needs','Motivations']);
   assert.deepEqual(await page.$$eval('.deck-persona:first-child dt',els=>els.map(el=>el.textContent)),['Age','Occupation','Resident']);
   assert.equal(await page.$$eval('.deck-persona blockquote',els=>els.length),0,'No invented interview quotations');
   const actualPersonas=await page.$$eval('.deck-persona',els=>els.map(el=>el.textContent.replace(/\s+/g,' ').trim()));
   for(const [i,person] of sourcePersonas.filter(p=>[14,15].includes(p.slide)).entries()){
    for(const text of [person.name,person.age,person.job,person.location,person.introduction,...person.difficulties,...person.needs,person.motivation])assert(actualPersonas[i].includes(text.replace(/\s+/g,' ').trim()),'Complete source persona: '+person.name);
   }
   assert(!await page.$('#personas [data-source-slide="16"]'),'Owner removed the third persona');
   const personaLayout=await page.$$eval('.deck-persona',els=>els.map(el=>{const r=el.getBoundingClientRect();return {top:r.top,left:r.left,right:r.right,bottom:r.bottom};}));
   if(width>=960){
    assert(Math.abs(personaLayout[0].top-personaLayout[1].top)<1,'Two personas share a row');
    assert(personaLayout[1].left-personaLayout[0].right>=23,'Separate persona cards have a visible gap');
   }else assert(personaLayout[1].top>=personaLayout[0].bottom+23,'Small screens stack the two complete personas');
   const segmentText=await page.$eval('#segmentation',el=>el.textContent);
   for(const [title,copy] of sourceSegments)assert(segmentText.includes(title)&&segmentText.includes(copy),'Complete source segmentation');
   assert.equal(await page.$eval('.deck-source-credit',el=>el.textContent),sourceAttribution,'Original sensor illustration credit preserved');
   assert.equal(await page.$$eval('.deck-ecosystem,.deck-sensor-overview,.deck-brand-reference',els=>els.length),0,'Owner-omitted opening content stays removed');
   assert.equal(await page.$$eval('#brief .deck-chapter-panel,#branding .deck-chapter-panel,#research .deck-chapter-panel',els=>els.length),0,'Uploaded reference replaces opening slide panels');
   assert.equal(await page.$eval('#brand-safezone .deck-reference-heading h3',el=>el.textContent),'Safezone & Grid');
   assert.equal(await page.$$eval('.deck-logo-construction',els=>els.length),1,'Construction grid restored beside safezone');
   assert.deepEqual(await page.$$eval('#branding .deck-reference-heading > *',els=>els.map(el=>el.textContent)),['Logo','Meaning']);
   assert.deepEqual(await page.$$eval('#ui .deck-palette',els=>els.map(el=>el.querySelectorAll('li').length)),[4,4,4],'Current reference palette groups');
   assert.deepEqual(await page.$$eval('#ui .deck-palette:first-child code',els=>els.map(el=>el.textContent)),['#8EBE50','#6C9537','#FFFFFF','#191919']);
   assert(await page.$eval('#brief',el=>el.lang==='en'&&el.textContent.includes('Introducing "GREENY"')),'Current English introduction');
   assert.deepEqual(await page.$$eval('.deck-component-family > div > div > h4,.deck-weather-showcase > div > h4,.deck-garden-showcase > div > h4',els=>[...new Set(els.map(el=>el.textContent))]),['Environmental parameter graphs','Device Control Panel','Weather','Garden information table']);
   assert.deepEqual(await page.$$eval('.deck-reference-heading h2',els=>els.map(el=>el.textContent)),['Introduction','Logo','User Research','User Experience','UI system','User Interface'],'Only chapter titles use h2');
   const subsectionParents={'brand-safezone':'Logo',personas:'User Research',sitemap:'User Experience','user-flows':'User Experience',typography:'UI system',icons:'UI system',components:'UI system'};
   for(const [id,parent] of Object.entries(subsectionParents)){
    const role=await page.$eval('#'+id+' .deck-reference-heading',el=>{const heading=el.firstElementChild,all=[...document.querySelectorAll('.deck-reference-heading h2,.deck-reference-heading h3')];const parent=all.slice(0,all.indexOf(heading)).filter(h=>h.tagName==='H2').at(-1);return {tag:heading.tagName,parent:parent?.textContent,size:parseFloat(getComputedStyle(heading).fontSize),parentSize:parseFloat(getComputedStyle(parent).fontSize)};});
    assert.equal(role.tag,'H3','Subtitle role: '+id);assert.equal(role.parent,parent,'Nearest parent chapter: '+id);assert(role.size<role.parentSize,'Subtitle is quieter than chapter: '+id);
   }
   assert(await page.$eval('.deck-reference-mark .deck-logo',el=>el.getBoundingClientRect().width>40),'Original central brand mark remains visible at this width');
   assert.equal(await page.$$eval('#components .deck-sensor-explanation img',els=>els.length),1,'Supporting sensor illustration retained');
   assert.equal(await page.$$eval('.deck-metric-variants .deck-sensor-explanation',els=>els.length),0,'Explanatory figure is separate from UI specimens');
   assert.deepEqual(await page.$$eval('#user-flows [data-diagram]',els=>els.map(el=>el.dataset.diagram)),['sign-in','remote-control','environment','ai-detect','apply-schedule','create-schedule','add-device'],'Uploaded task-flow order');
   assert.equal(await page.$$eval('.deck-font-row',els=>els.length),14,'All supplied Inter and Nunito type specimens');
   assert.equal(await page.$$eval('.deck-source-vector img',els=>els.length),2,'Original vector feature graph and icon board');
   assert(await page.$$eval('.deck-source-vector img',els=>els.every(el=>Number(el.getAttribute('width'))>0&&Number(el.getAttribute('height'))>0)),'Vector layouts reserve their full aspect ratio before loading');
   assert.equal(await page.$$eval('.deck-feature-group',els=>els.length),6,'Complete feature families');
   assert.equal(await page.$$eval('.deck-tree-node.is-priority',els=>els.length),7,'All source priorities');
   assert.equal(await page.$$eval('.deck-diagram',els=>els.length),8,'Sitemap and seven source flows');
   assert.equal(await page.$$eval('.native-diagram image',els=>els.length),0,'Diagrams are native vectors');
   assert.deepEqual(await page.$$eval('.deck-interface-panel',els=>els.map(el=>Number(el.dataset.sourceSlide))),[45,39,52],'Current interface reference order excludes the two owner-removed collages');
   assert.equal(await page.$$eval('#interface h2',els=>els.length),1,'One User Interface heading');
   assert.equal(await page.$eval('#interface h2',el=>el.textContent),'User Interface');
   assert.equal(await page.$$eval('#interface h3,#interface .deck-chapter-panel,#interface .deck-poster',els=>els.length),0,'No duplicate UI/Wireframe/Advertising headings or poster copy');
   assert(await page.$$eval('.deck-interface-panel',els=>els.every((el,i)=>{const r=el.getBoundingClientRect(),prev=els[i-1]?.getBoundingClientRect();return !prev||Math.abs(r.top-prev.bottom)<1;})),'Three artwork panels join without gutters');
   assert.equal(await page.$$eval('.deck-onboarding > article',els=>els.length),5,'Five original illustration panels');
   assert.equal(await page.$$eval('.native-diagram',els=>els.every(el=>el.getAttribute('lang')==='en')),true,'Correct language for English diagrams');
   assert.deepEqual(await page.$$eval('[id]',els=>{const ids=els.map(el=>el.id);return ids.filter((id,i)=>ids.indexOf(id)!==i)}),[],'Unique accessible IDs');
   for(const id of ids){
    await page.$eval('#'+id,el=>el.scrollIntoView({block:'start',behavior:'instant'}));
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Overflow '+width+'/'+id);
    if([360,1280].includes(width)&&['brief','personas','sitemap','components','interface'].includes(id)){
     await page.waitForFunction(id=>getComputedStyle(document.getElementById(id)).opacity==='1',{},id);
     await page.screenshot({path:'.cache/qa/greeny/case-study/'+width+'-'+id+'.png'});
    }
   }
   await page.focus('#function-ideation .deck-transcript summary');await page.keyboard.press('Enter');
   assert(await page.$eval('#function-ideation .deck-transcript',el=>el.open),'Keyboard opens full feature inventory');
   assert.equal(await page.$$eval('#function-ideation .deck-feature-group',els=>els.length),6,'Complete source feature inventory');
   await page.focus('#sitemap .deck-transcript summary');await page.keyboard.press('Enter');
   assert(await page.$eval('#sitemap .deck-transcript',el=>el.open),'Keyboard opens diagram transcript');
   assert(await page.$$eval('#sitemap .deck-transcript li',els=>els.length>20),'Complete readable diagram transcript');
   assert.equal(await page.$$eval('.deck-flow',els=>els.length),7,'Seven independent flow disclosures');
   assert(await page.$$eval('.deck-flow',els=>els.every(el=>!el.open)),'Flows start collapsed');
   const flowSummaries=await page.$$('.deck-flow > summary');
   for(const summary of flowSummaries){
    await summary.focus();await page.keyboard.press('Enter');
    await page.waitForFunction(()=>[...document.querySelectorAll('.deck-flow')].every(el=>!el.getAnimations().length));
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Expanded flow fits '+width);
   }
   assert.equal(await page.$$eval('.deck-flow[open]',els=>els.length),7,'Opening another flow preserves earlier flows');
   if([360,1280].includes(width)){
    await page.$eval('#user-flows',el=>el.scrollIntoView({behavior:'instant'}));
    await page.screenshot({path:'.cache/qa/greeny/case-study/'+width+'-flows-expanded.png'});
   }
   await flowSummaries[0].focus();await page.keyboard.press('Space');
   await page.waitForFunction(()=>!document.querySelector('.deck-flow').open);
   assert.equal(await page.$$eval('.deck-flow[open]',els=>els.length),6,'Space closes only the focused flow');
   await page.$eval('.deck-flow > summary',el=>el.click());
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const reversal=await page.$eval('.deck-flow',el=>{
    const before=el.getBoundingClientRect().height;el.querySelector('summary').click();
    return Math.abs(before-el.getBoundingClientRect().height);
   });
   assert(reversal<2,'Reversing height transition does not jump');
   await page.waitForFunction(()=>!document.querySelector('.deck-flow').open);
   assert(await page.evaluate(()=>document.querySelector('.garden-stage').getBoundingClientRect().bottom<=document.querySelector('.garden-story').getBoundingClientRect().bottom+1),'Garden remains within story boundary');
   console.log('PASS '+width+'px: source order, legacy anchors, personas, diagrams, artwork, keyboard priorities/transcripts and story boundary.');
  }
  // Verify full-size inspection through the real native link rather than an inert affordance.
   await page.$eval('.deck-flow > summary',el=>el.click());
   await page.waitForFunction(()=>document.querySelector('.deck-flow').open&&!document.querySelector('.deck-flow').getAnimations().length);
  await page.focus('[data-diagram="sign-in"] .deck-diagram-link');
  await page.keyboard.press('Enter');
  assert(await page.$('dialog[open] [data-artifact-close]'),'Diagram opens with a clear in-page exit');
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>!document.querySelector('dialog[open]'));
  // Without enhancement, Enter must still open the original local artwork.
  const fallback=await browser.newPage();await fallback.setJavaScriptEnabled(false);
  await fallback.goto(SITE+'/projects/greeny/',{waitUntil:'networkidle0'});
  await fallback.focus('.deck-flow > summary');await fallback.keyboard.press('Enter');
  await fallback.focus('[data-diagram="sign-in"] .deck-diagram-link');
  const popupPromise=new Promise((resolve,reject)=>{
   const timeout=setTimeout(()=>reject(new Error('No-script diagram link did not open its native original')),5000);
   fallback.once('popup',popup=>{clearTimeout(timeout);resolve(popup);});
  });
  await fallback.keyboard.press('Enter');
  const popup=await popupPromise;await popup.waitForSelector('svg');
  assert(popup.url().endsWith('/img/diagrams/sign-in.svg'),'Opens the actual local vector diagram');
  assert.equal(await popup.$$eval('[data-node]',els=>els.length),12,'Standalone diagram is complete');
  await popup.close();await fallback.bringToFront();
  await fallback.focus('#advertising a');
  const artworkPopupPromise=new Promise((resolve,reject)=>{
   const timeout=setTimeout(()=>reject(new Error('No-script artwork link did not open its native original')),5000);
   fallback.once('popup',popup=>{clearTimeout(timeout);resolve(popup);});
  });
  await fallback.keyboard.press('Enter');
  const artworkPopup=await artworkPopupPromise;await artworkPopup.waitForFunction(()=>document.images[0]?.complete&&document.images[0].naturalWidth>0);
  assert(artworkPopup.url().endsWith('/img/case-study/source-52.jpg'),'Outdoor artwork opens through the real keyboard-accessible image link');
  await artworkPopup.close();await fallback.close();await page.bringToFront();
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await page.reload({waitUntil:'networkidle0'});
  await page.setViewport({width:360,height:900});await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  await page.focus('.deck-flow > summary');await page.keyboard.press('Enter');
  assert(await page.$eval('.deck-flow',el=>el.open&&!el.getAnimations().length),'Reduced motion opens immediately without height movement');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Expanded flow fits at 200% text');
  assert(await page.$eval('.greeny-case-study',el=>el.scrollWidth<=el.clientWidth),'200% text fits case-study container');
  await page.evaluate(()=>{document.documentElement.dir='rtl';});
  assert(await page.$eval('.greeny-case-study',el=>el.scrollWidth<=el.clientWidth),'RTL structure holds');
  await page.setJavaScriptEnabled(false);await page.reload({waitUntil:'networkidle0'});
  assert.equal(await page.$$eval('.greeny-case-study > section',els=>els.length),ids.length,'Complete without script');
  assert(await page.$$eval('.deck-flow',els=>els.every(el=>!el.open)),'Native flows start collapsed without JavaScript');
  await page.focus('.deck-flow > summary');await page.keyboard.press('Enter');
  assert(await page.$eval('.deck-flow',el=>el.open),'Native flow opens by keyboard without JavaScript');
  await page.keyboard.press('Space');
  assert(await page.$eval('.deck-flow',el=>!el.open),'Native flow closes without JavaScript');
  assert.equal(await page.$$eval('.greeny-case-study .reveal:not(.is-in)',els=>els.length),0);
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);assert.deepEqual(external,[],'No visitor CDN requests');
  console.log('PASS full-size SVG inspection, 200% text, RTL, reduced motion, no-script and local delivery.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
