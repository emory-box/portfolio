const assert=require('node:assert/strict'),fs=require('node:fs');
const {puppeteer,chromePath}=require('./browser-runtime.cjs').browserRuntime();
const SITE=process.env.SITE_URL||'http://localhost:4317';
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

(async()=>{
  const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox']});
  try {
    const page=await browser.newPage(),errors=[],missing=[];
    page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400)missing.push(response.url());});
    // This flow must remain readable without the optional 3D renderer.
    await page.evaluateOnNewDocument(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return String(type).includes('webgl')?null:original.call(this,type,...args);};});
    fs.mkdirSync('.cache/qa/greeny/case-study',{recursive:true});
    for(const width of [360,768,1280,1920]){
      await page.setViewport({width,height:900});await page.goto(SITE+'/projects/greeny/');
      await page.evaluate(async()=>{await document.fonts.ready;document.documentElement.style.scrollBehavior='auto';});
      assert.deepEqual(await page.$$eval('.greeny-case-study > section > .wrap > .section-head h2',elements=>elements.map(element=>element.textContent)),['Research','Problem','Personas','Sitemap','Function ideation','Design system','Components','Design app']);
      for(const id of ['brief','system','ui','interface','brand','notes'])assert.equal(await page.$$eval('[id="'+id+'"]',elements=>elements.length),1,'retained anchor '+id);
      assert.equal(await page.$$eval('#personas .persona',elements=>elements.length),3);
      assert.deepEqual(await page.$$eval('#personas .persona h3',elements=>elements.map(element=>element.textContent)),['Đức Phú','Phương Lan','Trung Khang']);
      assert.equal(await page.$$eval('#personas blockquote',elements=>elements.length),0,'summaries are not fabricated interview quotes');
      assert.deepEqual(await page.$$eval('.sitemap-branch > h3',elements=>elements.map(element=>element.textContent)),['Dashboard','Garden list','Automation','Setting']);
      assert.equal(await page.$$eval('.ideation-priorities > li',elements=>elements.length),6);
      assert.equal(await page.$$eval('#interface .phone-figure',elements=>elements.length),3,'existing app screens retained');
      for(const id of ['brief','problem','personas','sitemap','function-ideation','ui','components','interface']){
        await page.$eval('#'+id,element=>element.scrollIntoView({block:'start',behavior:'instant'}));await wait(120);
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width+'/'+id);
        if((width===360||width===1280)&&['brief','sitemap','function-ideation','components'].includes(id)){await wait(650);await page.screenshot({path:'.cache/qa/greeny/case-study/'+width+'-'+id+'.png'});}
      }
      await page.$eval('.ideation-additional summary',element=>element.scrollIntoView({block:'center',behavior:'instant'}));await page.focus('.ideation-additional summary');await page.keyboard.press('Enter');assert(await page.$eval('.ideation-additional',element=>element.open),'keyboard opens supporting ideas');
      assert(await page.evaluate(()=>document.querySelector('.garden-stage').getBoundingClientRect().bottom<=document.querySelector('.garden-story').getBoundingClientRect().bottom+1),'garden stays inside its story');
      console.log('PASS case study '+width+'px: chapter order, source content, sitemap, app screens, anchors, overflow and keyboard details.');
    }
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await page.reload();await page.$eval('#sitemap',element=>element.scrollIntoView({block:'start',behavior:'instant'}));
    assert.equal(await page.$$eval('#sitemap .reveal:not(.is-in)',elements=>elements.length),0);
    await page.setJavaScriptEnabled(false);await page.reload();assert.equal(await page.$$eval('.greeny-case-study > section',elements=>elements.length),8);
    assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
    console.log('PASS reduced motion, no-script case-study content and local asset delivery.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
