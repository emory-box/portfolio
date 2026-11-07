// Scroll-stack acceptance: long chapters stay readable before their successor covers them.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {browserRuntime} = require('./browser-runtime.cjs');
const {puppeteer,chromePath} = browserRuntime();
const BASE = process.env.SITE_URL || 'http://localhost:4317';
const out = '.cache/synergy-stack-review';
fs.mkdirSync(out,{recursive:true});
const ids = ['overview','logo','research','experience','wireframe','design-system','interface'];

(async()=>{
  const browser = await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--force-color-profile=srgb']});
  try {
    const page = await browser.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    for(const width of [360,768,1280,1920]) {
      await page.setViewport({width,height:width===1920?1080:800,deviceScaleFactor:1});
      await page.goto(BASE+'/projects/synergy/',{waitUntil:'networkidle0'});
      await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';});
      assert.deepEqual(await page.$$eval('main > .stack-slot',els=>els.map(el=>el.id)),ids,'Exactly seven source-ordered layers');
      await page.waitForFunction(()=>document.documentElement.classList.contains('stack-ready'));
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      const dimensions = await page.evaluate(()=>{
        const current=document.getElementById('logo'),next=document.getElementById('research');
        return {start:current.offsetTop,next:next.offsetTop,height:current.firstElementChild.offsetHeight,view:innerHeight};
      });
      assert.ok(dimensions.height>dimensions.view,'Long chapter is not cropped to one screen');
      const midway=dimensions.start+Math.min(180,dimensions.height-dimensions.view-20);
      await page.evaluate(y=>scrollTo(0,y),midway);
      await page.waitForFunction(()=>getComputedStyle(document.querySelector('#logo .stack-panel')).transform==='none');
      const previousBottom = await page.$eval('#logo .stack-panel',el=>el.getBoundingClientRect().bottom);
      assert.ok(previousBottom>=dimensions.view-2,'Chapter body remains in normal reading flow');

      const transition = dimensions.next - dimensions.view*.55;
      await page.evaluate(y=>scrollTo(0,y),transition);
      await page.waitForFunction(()=>document.querySelector('#logo .stack-panel').classList.contains('is-receding'));
      const cover = await page.evaluate(()=>{
        const old=document.querySelector('#logo .stack-panel'),next=document.querySelector('#research .stack-panel');
        const box=next.getBoundingClientRect();
        const hit=document.elementFromPoint(innerWidth/2,box.top+24);
        return {scale:new DOMMatrix(getComputedStyle(old).transform).a,shade:parseFloat(getComputedStyle(old).getPropertyValue('--stack-shade')),nextTop:box.top,oldBottom:old.getBoundingClientRect().bottom,topLayer:hit?.closest('.stack-slot')?.id};
      });
      assert.ok(cover.scale<1 && cover.scale>.94,'Previous layer scales gently');
      assert.ok(cover.shade>0 && cover.shade<.4,'Previous layer dims gently');
      assert.ok(cover.nextTop>70 && cover.nextTop<dimensions.view,'Successor enters from below');
      await page.screenshot({path:`${out}/transition-${width}.png`});
      assert.ok(Math.abs(cover.oldBottom-dimensions.view)<4,'Previous layer holds its bottom edge: '+JSON.stringify({cover,dimensions}));
      assert.equal(cover.topLayer,'research','Successor paints above the held layer');
      await page.focus('#logo .content-block:last-child .artifact-zoom');
      await page.waitForFunction(()=>{
        const el=document.activeElement,rect=el.getBoundingClientRect();
        return el.contains(document.elementFromPoint(rect.left+rect.width/2,rect.top+rect.height/2));
      });
      assert.ok(await page.evaluate(()=>document.activeElement.getBoundingClientRect().top>60),'Keyboard focus is visible above the overlapping sheet');
      await page.evaluate(y=>scrollTo(0,y),midway);
      await page.waitForFunction(()=>getComputedStyle(document.querySelector('#logo .stack-panel')).transform==='none');
      assert.equal(await page.$eval('#logo .stack-panel',el=>getComputedStyle(el).getPropertyValue('--stack-shade').trim()),'0','Reverse scroll restores original appearance');

      // Closed/open artifact sheets alter chapter height, so pinning must remeasure.
      const before=await page.$eval('#research .stack-panel',el=>el.offsetHeight);
      await page.$eval('#research .sheet:not([open])',el=>el.open=true);
      await page.waitForFunction(before=>document.querySelector('#research .stack-panel').offsetHeight>before,{},before);
      await page.waitForFunction(()=>{
        const panel=document.querySelector('#research .stack-panel');
        return Math.abs(parseFloat(panel.style.getPropertyValue('--stack-top'))-(innerHeight-panel.getBoundingClientRect().height))<3;
      });
      await page.screenshot({path:`${out}/reading-${width}.png`});
      console.log(`PASS ${width}px: seven layers, long reading, overlap, reverse, dynamic height`);
    }
    await page.focus('.contents > summary');
    await page.keyboard.press('Enter');
    await page.focus('.contents-panel a[href="#logo"]');
    await page.keyboard.press('Enter');
    await page.waitForFunction(()=>document.querySelector('#logo-title').getBoundingClientRect().top>60);
    assert.equal(await page.$eval('.contents',el=>el.open),true);
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
    await page.waitForFunction(()=>!document.documentElement.classList.contains('stack-ready'));
    assert.equal(await page.$eval('#logo .stack-panel',el=>getComputedStyle(el).transform),'none');
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
    await page.waitForFunction(()=>document.documentElement.classList.contains('stack-ready'));
    await page.setJavaScriptEnabled(false);
    await page.reload({waitUntil:'networkidle0'});
    assert.deepEqual(await page.$$eval('main > .stack-slot',els=>els.map(el=>el.id)),ids);
    assert.equal(await page.$eval('#logo .stack-panel',el=>getComputedStyle(el).position),'relative');
    assert.deepEqual(errors,[]);
    console.log('PASS anchor reading, persistent contents, live reduced-motion switching and no-script fallback');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
