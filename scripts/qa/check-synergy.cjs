// Acceptance checks at the served-page seam, using the existing browser helper.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {browserRuntime} = require('./browser-runtime.cjs');
const {puppeteer,chromePath} = browserRuntime();
const BASE = process.env.SITE_URL || 'http://localhost:4317';
const out = path.resolve('.cache/synergy-review');
fs.mkdirSync(out,{recursive:true});
const expected = ['Logo','User Research','User Experience','Wireframes','Design system','User Interface'];

(async () => {
  const browser = await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--force-color-profile=srgb']});
  try {
    const page = await browser.newPage();
    const errors = [],external = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {if(message.type()==='error') errors.push(message.text());});
    page.on('response', response => { if(response.status() >= 400) errors.push(response.status()+' '+response.url()); });
    page.on('request', request => {if(/^https?:/.test(request.url()) && !request.url().startsWith(BASE+'/')) external.push(request.url());});
    for(const width of [360,768,1280,1920]) {
      await page.setViewport({width,height:width===1920?1080:800,deviceScaleFactor:1});
      await page.goto(BASE+'/projects/synergy/',{waitUntil:'networkidle0'});
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.evaluate(()=>document.fonts.check('16px Inter')),true,'Self-hosted Inter available');
      assert.deepEqual(await page.$$eval('.chapter-head h2', nodes => nodes.map(n=>n.textContent)),expected,'Source chapter order');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'Page overflow at '+width);
      await page.screenshot({path:path.join(out,'hero-'+width+'.png')});
      await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
      await page.evaluate(() => {
        document.documentElement.style.scrollBehavior='auto';
        document.querySelectorAll('.sheet').forEach(sheet=>sheet.open=true);
      });
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'Expanded artifacts overflow at '+width);
      const broken = await page.$$eval('img', async imgs => {
        imgs.forEach(img=>img.loading='eager');
        await Promise.all(imgs.map(img=>img.decode().catch(()=>{})));
        return imgs.filter(img=>!img.naturalWidth).map(img=>img.getAttribute('src'));
      });
      assert.deepEqual(broken,[],'Broken images');
      for(const id of ['logo','research','experience','wireframe','design-system','interface']) {
        await page.$eval('#'+id, el => el.scrollIntoView());
        await page.screenshot({path:path.join(out,id+'-'+width+'.png')});
      }
      if(width===1280) {
        await page.evaluate(()=>document.querySelectorAll('.sheet').forEach(sheet=>sheet.open=false));
        await page.screenshot({path:path.join(out,'full-1280.png'),fullPage:true});
      }
      await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
      console.log('PASS Synergy '+width+'px: chapter order, loaded assets, expanded layout');
    }
    await page.setViewport({width:1280,height:800});
    await page.goto(BASE+'/projects/synergy/',{waitUntil:'networkidle0'});
    await page.evaluate(() => {document.documentElement.style.scrollBehavior='auto';});
    assert.equal(await page.evaluate(()=>document.querySelector('main').innerText.includes('Enlarge image')),false,'No separate enlargement button labels');
    assert.equal(await page.$$eval('main figure.artifact',figures=>figures.every(figure=>{
      const art=figure.querySelector('.artifact-visual'),link=art?.parentElement;
      return link?.matches('a.artifact-zoom[data-enlarge][href]') && !figure.querySelector('figcaption');
    })),true,'Artwork itself is the link; duplicate captions are removed');
    const firstImage=await page.$('.overview-gallery .artifact-visual');
    await firstImage.click();
    assert.equal(await page.$eval('dialog',el=>el.open),true,'Pointer click on the image opens its viewer');
    await page.keyboard.press('Escape');
    // Native close restores focus/scroll on the close event, after key dispatch.
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    // Closing a tall artwork must retain the current reading position, even if
    // the center of the full image is outside the viewport.
    await page.$eval('#components .artifact-zoom',el=>scrollTo(0,el.getBoundingClientRect().top+scrollY+el.offsetHeight*.5-innerHeight*.5));
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('#components')).opacity==='1');
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const readingPosition=await page.evaluate(()=>scrollY);
    const point=await page.$eval('#components .artifact-zoom',el=>({x:el.getBoundingClientRect().left+el.offsetWidth/2,y:innerHeight/2}));
    await page.mouse.click(point.x,point.y);
    assert.equal(await page.$eval('dialog',el=>el.open),true,'Tall atlas opens directly from its visible portion');
    await page.keyboard.press('Escape');
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    assert.ok(Math.abs(await page.evaluate(()=>scrollY)-readingPosition)<2,'Closing tall artwork retains reading position');
    assert.equal(await page.evaluate(()=>document.activeElement.matches('#components .artifact-zoom')),true,'Return keyboard focus to the clickable image');
    await page.focus('.skip-link');
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(()=>location.hash),'#main');
    await page.focus('#research .sheet > summary');
    assert.ok(await page.$eval('#research .sheet > summary',el=>parseFloat(getComputedStyle(el).outlineOffset)<0),'Visible inset focus on clipped sheet');
    await page.focus('.project-contents-toggle');
    await page.keyboard.press('Enter');
    assert.equal(await page.$eval('.project-contents-toggle',el=>el.getAttribute('aria-expanded')==='true'),true);
    await page.focus('.project-contents-panel a[href="#research"]');
    await page.keyboard.press('Enter');
    assert.equal(await page.$eval('.project-contents-toggle',el=>el.getAttribute('aria-expanded')==='true'),true,'Chapter navigation must keep contents open');
    await page.focus('.project-contents-toggle');
    await page.keyboard.press('Enter');
    assert.equal(await page.$eval('.project-contents-toggle',el=>el.getAttribute('aria-expanded')==='true'),false);
    const link = await page.$('#logo [data-enlarge]');
    await link.focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.$eval('dialog',el=>el.open),true,'Enlarge via keyboard');
    await page.click('[data-artifact-size]');
    assert.equal(await page.$eval('[data-artifact-size]',el=>el.getAttribute('aria-pressed')),'true');
    await page.keyboard.press('Escape');
    assert.equal(await page.$eval('dialog',el=>el.open),false);
    assert.equal(await page.evaluate(()=>document.activeElement.hasAttribute('data-enlarge')),true,'Return focus to opener');
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
    await page.reload({waitUntil:'networkidle0'});
    assert.equal(await page.$eval('[data-reveal]',el=>getComputedStyle(el).opacity),'1','Reduced motion content visible');
    const noScript = await browser.newPage();
    await noScript.setJavaScriptEnabled(false);
    await noScript.setViewport({width:360,height:800});
    await noScript.goto(BASE+'/projects/synergy/',{waitUntil:'networkidle0'});
    assert.deepEqual(await noScript.$$eval('.chapter-head h2', nodes=>nodes.map(n=>n.textContent)),expected);
    assert.equal(await noScript.$eval('[data-reveal]',el=>getComputedStyle(el).opacity),'1');
    assert.equal(await noScript.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await noScript.$eval('#experience .sheet',el=>el.open=true);
    assert.ok(await noScript.$eval('#experience [data-enlarge]',el=>el.href.endsWith('.png')),'Original image fallback');
    await noScript.close();
    await page.goto(BASE+'/',{waitUntil:'networkidle0'});
    assert.ok((await page.$$('a[href="projects/synergy/"]')).length>=1,'Home includes the real Synergy project link');
    assert.deepEqual(errors,[],'Browser errors');
    assert.deepEqual(external,[],'No external visitor requests');
    console.log('PASS keyboard, dialog focus return, persistent contents, reduced motion, no-script, home integration and local delivery');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
