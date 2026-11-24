const assert=require('node:assert/strict');
const fs=require('node:fs');
const assets=require('../../../authoring/portfolio/home/assets.cjs');
const {puppeteer,chromePath}=require('../browser-runtime.cjs').browserRuntime();
const site=process.env.SITE_URL||'http://localhost:4317';
const out='.cache/qa/home-section4';
fs.mkdirSync(out,{recursive:true});
async function settle(page) {
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>['home','detail'].includes(document.documentElement.dataset.homePhase));
  await page.waitForFunction(()=>document.getAnimations().every(a=>a.playState==='finished'));
}
async function geometry(page,selector,expected) {
  // Focused compositions are now centered/contained. Compare their original
  // canvas coordinates before that shared presentation transform.
  const rect=await page.$eval(selector,e=>{const r=e.getBoundingClientRect(),panel=e.closest('.home-fit-view > .home-panel'),m=panel?new DOMMatrix(getComputedStyle(panel).transform):new DOMMatrix();return[(r.left-m.e)/m.a,(r.top-m.f)/m.d,r.width/m.a,r.height/m.d];});
  rect.forEach((value,i)=>assert(Math.abs(value-expected[i])<.65,selector+' geometry '+JSON.stringify({expected,actual:rect})));
}
(async()=>{
  for(const [name,[width,height]]of Object.entries(assets)) {
    const file='assets/img/home/'+name;
    assert(fs.statSync(file).size>0,'Nonempty SVG '+name);
    const root=fs.readFileSync(file,'utf8').match(/<svg\b[^>]*>/)[0];
    assert.equal(+root.match(/\bwidth="([^"]+)"/)[1],width,'Preserved SVG width '+name);
    assert.equal(+root.match(/\bheight="([^"]+)"/)[1],height,'Preserved SVG height '+name);
  }
  const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--disable-webgl']});
  try {
    const page=await browser.newPage();
    await page.setViewport({width:1440,height:1024});
    await page.goto(site+'/',{waitUntil:'networkidle0'});await settle(page);
    // Compare the 1440px design canvas, allowing space for a classic scrollbar.
    const gutter=await page.$eval('body',e=>innerWidth-e.getBoundingClientRect().width);
    if(gutter){await page.setViewport({width:1440+gutter,height:1024});await settle(page);}
    assert.equal(await page.$eval('.home-owner',e=>e.textContent),'Emory Phạm');
    assert.equal(await page.$eval('#home-title',e=>e.textContent),'Hello!');
    const used=await page.$$eval('img[src*="assets/img/home/"],link[as="image"][href*="assets/img/home/"]',es=>[...new Set(es.map(e=>(e.src||e.href).split('/').pop()))].sort());
    assert(used.filter(name=>name.endsWith('.svg')).every(name=>Object.hasOwn(assets,name)),'Every rendered original SVG is mapped to a known source asset');
    await geometry(page,'#home-title',[529,276,382,140.8]);
    const scene=[
      ['.home-portrait img',[560,334,319.218,349.861]],
      ['.home-pan-scene',[1056,205,252.721,223]],
      ['.home-skills .home-toast-art',[99,230,264.053,233]],
      ['.home-note .home-note-art',[913,661,283.868,250.485]],
      ['.home-play .home-game-art',[575.5,744.27,225,198.539]],
      ['.home-projects img',[228,584,169.091,248]],
      ['.home-ball img',[918,453,135,119.124]],
      ['.home-arrow-up-right img',[918,259,214.147,198]],
      ['.home-arrow-down-right img',[836,564,223.86,207]],
      ['.home-arrow-down-left img',[373,570,219,202.083]],
      ['.home-arrow-left img',[267,288,261.937,216]]
    ];
    for(const [selector,rect]of scene)await geometry(page,selector,rect);
    await page.screenshot({path:out+'/figma-home-1440.png'});
    await page.focus('.home-portrait');await page.keyboard.press('Enter');await settle(page);
    await geometry(page,'.home-about-card',[178,279,1084,493]);
    assert.equal(await page.$('.home-about-disc'),null,'Current About has no yellow disc');
    await geometry(page,'.home-about-avatar img',[178,279,450,493.197]);
    await geometry(page,'.home-about-clip img',[1132,203,180.467,199.669]);
    const headingTop=await page.$eval('.home-about-copy',e=>{const card=e.closest('.home-about-card'),style=getComputedStyle(e);return(card.offsetHeight-e.offsetHeight)/2+card.offsetTop+parseFloat(style.paddingTop);});
    await geometry(page,'.home-about-copy h2',[628,headingTop,483.66,76.8]);
    assert.equal(await page.$eval('.home-about-copy p',e=>getComputedStyle(e).fontWeight),'700');
    await page.screenshot({path:out+'/figma-about-1440.png'});
    await page.evaluate(()=>document.documentElement.style.fontSize='200%');
    assert.equal(await page.$eval('.home-about-copy p',e=>parseFloat(getComputedStyle(e).fontSize)),48,'Desktop About prose doubles with root text size');
    assert.equal(await page.$eval('.home-about-copy h2',e=>parseFloat(getComputedStyle(e).fontSize)),128,'Desktop About heading doubles with root text size');
    assert(await page.$eval('.home-about-copy',e=>e.getBoundingClientRect().bottom<=document.querySelector('.home-about-card').getBoundingClientRect().bottom),'Enlarged copy stays inside its growing card');
    assert(await page.$eval('.home-view:not([hidden])',e=>e.scrollWidth<=e.clientWidth+1),'Desktop enlarged card has no horizontal overflow');
    await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
    assert(await page.$eval('.home-return',e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),'Return remains visible in enlarged desktop About');
    await page.screenshot({path:out+'/about-desktop-text-200.png'});
    await page.evaluate(()=>document.documentElement.style.fontSize='');
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    await page.mouse.click(2,2);
    assert.equal(await page.evaluate(()=>document.documentElement.dataset.homePhase),'detail','Background remains an ordinary page');
    await page.click('.home-return');await settle(page);
    await page.focus('.home-projects');await page.keyboard.press('Enter');await settle(page);
    await geometry(page,'.home-project-board',[65,118,585,858]);
    await page.screenshot({path:out+'/figma-projects-1440.png'});
    await page.click('.home-return');await settle(page);
    for(const [width,height]of [[360,640],[360,900],[768,900],[1280,720],[1920,900]]) {
      await page.setViewport({width,height});await page.goto(site+'/',{waitUntil:'networkidle0'});await settle(page);
      assert(await page.$eval('.home-stage',e=>e.getBoundingClientRect().width>300),'Responsive scene has width');
      assert(await page.$$eval('.home-stage img',es=>es.filter(e=>!e.closest('[hidden]')).every(e=>{const r=e.getBoundingClientRect(),min=e.src.endsWith('note-binding-hole.svg')||e.closest('.home-game-art,.home-toast-art')?1:20;return e.complete&&r.width>min&&r.height>min;})),'All active responsive illustration layers have visible geometry');
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Responsive scene fits');
      await page.screenshot({path:out+'/layout-'+width+'-'+height+'.png'});
    }
    console.log('PASS all '+Object.keys(assets).length+' original SVG files/source mappings, source-slot geometry at 1440x1024, About typography, pegboard and responsive layers.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
