const assert=require('node:assert/strict');
const {puppeteer,chromePath}=require('./browser-runtime.cjs').browserRuntime();
const SITE=process.env.SITE_URL||'http://localhost:4317';
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

(async()=>{
  const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
  try {
    const page=await browser.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.setViewport({width:1280,height:900});
    await page.evaluateOnNewDocument(()=>{
      window.__draws=0;
      for(const name of ['drawElements','drawArrays']){
        const original=WebGL2RenderingContext.prototype[name];
        WebGL2RenderingContext.prototype[name]=function(...args){window.__draws++;return original.apply(this,args);};
      }
    });
    await page.goto(SITE+'/projects/greeny/');
    await page.waitForSelector('.garden-webgl');
    await page.evaluate(async()=>{await document.fonts.ready;document.documentElement.style.scrollBehavior='auto';});
    async function visit(index){
      await page.$eval(`[data-garden-step="${index}"]`,element=>element.scrollIntoView({block:'center',behavior:'instant'}));
      await page.waitForFunction(index=>document.querySelector('.garden-story').dataset.step===String(index),{},index);
      await wait(100);
    }
    const signal=()=>page.$eval('[data-effect="sensor"]',element=>({opacity:+element.getAttribute('opacity'),radius:element.querySelector('circle').getAttribute('r')}));
    await visit(1);
    await page.waitForFunction(()=>document.querySelector('.garden-story').dataset.sensorState==='ready');
    assert.equal((await signal()).opacity,1,'sensor signal remains visible after readings arrive');
    const first=await signal();await wait(250);
    assert.notEqual((await signal()).radius,first.radius,'sensor continues emitting while readings are visible');
    await visit(2);assert.equal((await signal()).opacity,0,'sensor effect stops outside its scene');
    await visit(1);
    assert.equal((await signal()).opacity,1,'reverse scrolling restores the sensor signal');
    assert.equal(await page.$eval('.garden-readings',element=>element.getAttribute('aria-hidden')),'false','return keeps collected readings visible');
    await page.click('.garden-motion');await wait(100);
    const frozen=await signal(),pausedDraws=await page.evaluate(()=>__draws);await wait(250);
    assert.deepEqual(await signal(),frozen,'pause freezes the signal');
    assert.equal(await page.evaluate(()=>__draws),pausedDraws,'pause idles rendering in sensor scene');
    await page.click('.garden-motion');await wait(200);
    assert.notEqual((await signal()).radius,frozen.radius,'resume continues the signal');
    const canvas=await page.$('.garden-canvas');
    for(const index of [2,3,4,5,6,7]){
      await visit(index);
      const before=await page.evaluate(()=>__draws);
      const image= index===5 ? null : await canvas.screenshot();
      const beam=await page.$eval('[data-effect="lighting"]',element=>element.getAttribute('opacity'));
      await wait(250);
      assert(await page.evaluate(()=>__draws)>before,`device scene ${index} keeps animating without further scroll`);
      if(index===5)assert.notEqual(await page.$eval('[data-effect="lighting"]',element=>element.getAttribute('opacity')),beam,'light beams visibly breathe');
      else assert(!image.equals(await canvas.screenshot()),`device scene ${index} visibly changes while stationary`);
    }
    await visit(1);
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
    await page.waitForFunction(()=>document.querySelector('.garden-motion').textContent==='Motion reduced');
    // Let the final still frame requested by the preference change finish.
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const reducedDraws=await page.evaluate(()=>__draws);await wait(250);
    assert.equal(await page.evaluate(()=>__draws),reducedDraws,'reduced motion idles the sensor scene');
    assert.equal((await signal()).opacity,0,'reduced motion has no expanding signal rings');
    assert.deepEqual(errors,[]);
    console.log('PASS continuous sensor signal, reverse scroll, retained readings, all device loops, pause/resume and reduced motion.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
