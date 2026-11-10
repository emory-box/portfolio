// Source-layout acceptance for the approved Components and Spacing presentation.
const assert=require('node:assert/strict'),fs=require('node:fs');
const {puppeteer,chromePath}=require('./browser-runtime.cjs').browserRuntime();
const BASE=process.env.SITE_URL||'http://localhost:4317';
const out='.cache/synergy-design-review';fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--force-color-profile=srgb']});
 try {
  const page=await browser.newPage();
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  for(const width of [320,360,768,1280,1920]) {
   await page.setViewport({width,height:width===1920?1080:900});
   await page.goto(BASE+'/projects/synergy/',{waitUntil:'networkidle0'});
   await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.querySelectorAll('img').forEach(img=>img.loading='eager');});
   await page.$$eval('img',imgs=>Promise.all(imgs.map(img=>img.decode())));
   assert.equal(await page.$$eval('main > .stack-slot',els=>els.length),7,'Keep seven top-level layers');
   assert.equal(await page.$eval('#overview h1',el=>el.textContent),'Overview');
   assert.deepEqual(await page.$$eval('.overview-copy p',els=>els.map(el=>el.textContent)),[
    'This is a self-initiated project created out of my passion for the education sector, developed over 3 months.',
    'Synergy is designed to enhance the university experience by providing seamless access to essential academic tools and communication features.'
   ],'Keep the owner-provided introduction verbatim');
   assert.deepEqual(await page.$$eval('.overview-gallery figure',els=>els.map(el=>({slide:el.dataset.slide,src:el.querySelector('img').getAttribute('src')}))),[
    {slide:'1',src:'img/overview-01.png'}, {slide:'2',src:'img/calendar-tracker.jpg'},
    {slide:'3',src:'img/campus-navigator.jpg'}, {slide:'4',src:'img/grade-tracker.jpg'}
   ],'Overview uses the four whole source images in order');
   const opening=await page.$eval('#overview .stack-panel',el=>({
    order:[...el.children].map(child=>child.classList[0]),
    firstImage:el.querySelector('.overview-gallery img').getBoundingClientRect().toJSON(),
    galleryBottom:el.querySelector('.overview-gallery').getBoundingClientRect().bottom,
    introductionTop:el.querySelector('.overview-intro').getBoundingClientRect().top,
    viewport:document.documentElement.clientWidth
   }));
   assert.deepEqual(opening.order,['overview-gallery','overview-intro','case-index'],'Images lead the opening in document order');
   assert.ok(Math.abs(opening.firstImage.width-opening.viewport)<2,'Opening artwork fills the available viewport width');
   assert.ok(opening.galleryBottom<=opening.introductionTop+1,'Overview text follows all four images');
   assert.deepEqual(await page.$$eval('#interface img',els=>els.map(el=>el.getAttribute('src'))),[
    'img/campaign-mockup.png','img/meeting-mockup.png','img/app-mockup.png','img/interface-mockup.png','img/calendar-mockup.png'
   ],'User Interface uses only slides 41–45');
   assert.equal(await page.$eval('.project-contents-panel a',el=>el.textContent),'Overview');
   const components=await page.$eval('#components',el=>({
    inside:!!el.closest('#design-system'),
    figures:el.querySelectorAll('figure').length,
    collapsed:[...el.querySelectorAll('figure')].some(figure=>!!figure.closest('details')),
    sources:[...el.querySelectorAll('image,img')].map(image=>image.getAttribute('href')||image.getAttribute('src'))
   }));
   assert.equal(components.inside,true);assert.equal(components.figures,1);assert.equal(components.collapsed,false);
   assert.deepEqual(components.sources,['img/components-input-navigation.png','img/components-calendar-facility.png','img/components-content.png']);
   assert.deepEqual(await page.$$eval('#components image',els=>els.map(el=>el.getAttribute('y'))),['0','1104','2261'],'Component boards share one continuous canvas');
   const spacing=await page.$eval('#spacing .spacing-diagram',el=>({
    viewBox:el.getAttribute('viewBox'),
    slices:[...el.querySelectorAll('image')].map(image=>({href:image.getAttribute('href'),y:image.getAttribute('y')})),
    width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height
   }));
   assert.deepEqual(spacing.slices,[{href:'img/spacing-1.png',y:'0'},{href:'img/spacing-2.png',y:'1080'}],'Original slices form one continuous drawing');
   assert.equal(spacing.viewBox,'320 390 1300 1580','Both whole phones and lowest measurement labels fit');
   assert.ok(Math.abs(spacing.width/spacing.height-1300/1580)<.01,'Preserve composition ratio');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   for(const id of ['overview','components','spacing','interface']) {
    await page.$eval('#'+id,el=>el.scrollIntoView());
    await page.screenshot({path:`${out}/${id}-${width}.png`});
   }
   if(width===1280) {
    const captureStyle=await page.addStyleTag({content:'.site-header,.project-contents { visibility: hidden !important; }'});
    await (await page.$('#spacing')).screenshot({path:`${out}/spacing-complete.png`});
    await (await page.$('#components')).screenshot({path:`${out}/components-complete.png`});
    await captureStyle.evaluate(el=>el.remove());
   }
   console.log(`PASS ${width}px: Overview 1–4 and exact copy; Components atlas 37–39; UI 41–45; complete Spacing`);
  }
  await page.focus('#spacing [data-enlarge]');await page.keyboard.press('Enter');
  assert.equal(await page.$eval('dialog',el=>el.open),true);
  assert.equal(await page.$$eval('.dialog-canvas image',images=>images.length),2,'Viewer keeps both source slices');
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(()=>document.activeElement.closest('#spacing')!==null),true);
  await page.focus('#components [data-enlarge]');await page.keyboard.press('Enter');
  assert.equal(await page.$eval('dialog',el=>el.open),true);
  assert.equal(await page.$$eval('.dialog-canvas image',images=>images.length),3,'Component enlargement retains the complete atlas');
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(()=>document.activeElement.closest('#components')!==null),true);
  await page.goto(BASE+'/projects/synergy/img/spacing.svg',{waitUntil:'networkidle0'});
  assert.equal(await page.$$eval('svg image',images=>images.filter(image=>image.getAttribute('href').startsWith('data:image/png;base64,')).length),2,'Standalone no-script artifact embeds both original captures');
  await page.goto(BASE+'/projects/synergy/img/components.svg',{waitUntil:'networkidle0'});
  assert.equal(await page.$$eval('svg image',images=>images.filter(image=>image.getAttribute('href').startsWith('data:image/png;base64,')).length),3,'Standalone component atlas embeds all three original boards');
  await page.setViewport({width:718,height:1226});
  await page.screenshot({path:`${out}/components-reference-size.png`});
  console.log('PASS complete enlarged diagrams, keyboard focus return and standalone SVG fallbacks');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
