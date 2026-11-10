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
    async function visit(index,fraction=.9){
      await page.$eval(`[data-garden-step="${index}"]`,(element,fraction)=>{
        if(!element.classList.contains('has-device-hold')){element.scrollIntoView({block:'center',behavior:'instant'});return;}
        const h=parseFloat(element.style.getPropertyValue('--garden-step-height')),hold=parseFloat(element.style.getPropertyValue('--garden-annotation-distance'));
        const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h'));
        scrollTo({top:element.getBoundingClientRect().top+scrollY+h/2-(innerHeight+header)/2+hold*fraction,behavior:'instant'});
      },fraction);
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
    // Read the real GLB object's transform during rendering, not a duplicate
    // deployment formula or a production-only testing interface.
    await page.evaluate(async()=>{
      const THREE=await import('three'),original=THREE.Object3D.prototype.updateMatrixWorld;
      THREE.Object3D.prototype.updateMatrixWorld=function(...args){
        if(this.name==='Shade_Deploy')window.__shadeScale=this.scale.z;
        return original.apply(this,args);
      };
    });
    const canvas=await page.$('.garden-canvas');
    for(const index of [2,3,4,5,6]){
      await visit(index);
      const before=await page.evaluate(()=>__draws);
      const image= index===5 ? null : await canvas.screenshot();
      const beam=await page.$eval('[data-effect="lighting"]',element=>element.getAttribute('opacity'));
      await wait(250);
      if(index===4){
        assert(Math.abs(await page.evaluate(()=>__shadeScale)-1)<.001,'shade stays fully deployed for the annotation hold');
        // Capturing the sticky canvas can request one layout/scroll frame.
        // Test idling after that capture has settled, rather than counting it.
        const settled=await page.evaluate(()=>__draws);await wait(250);
        assert.equal(await page.evaluate(()=>__draws),settled,'settled canopy needs no idle render loop');
        assert(image.equals(await canvas.screenshot()),'canopy does not retract with elapsed time');
        continue;
      }
      assert(await page.evaluate(()=>__draws)>before,`device scene ${index} keeps animating without further scroll`);
      if(index===5)assert.notEqual(await page.$eval('[data-effect="lighting"]',element=>element.getAttribute('opacity')),beam,'light beams visibly breathe');
      else assert(!image.equals(await canvas.screenshot()),`device scene ${index} visibly changes while stationary`);
    }
    const stops=await page.evaluate(()=>[3,4,5].map(index=>{
      const e=document.querySelector(`[data-garden-step="${index}"]`),h=parseFloat(e.style.getPropertyValue('--garden-step-height')),distance=parseFloat(e.style.getPropertyValue('--garden-hold-distance'));
      const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h'));
      const start=e.getBoundingClientRect().top+scrollY+h/2-(innerHeight+header)/2;
      return {start,end:start+distance};
    }));
    async function between(from,to,fraction){
      await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),from+(to-from)*fraction);await wait(100);
      return page.evaluate(()=>__shadeScale);
    }
    let previous=.10;
    for(const f of [0,.25,.5,.75,1]){
      const scale=await between(stops[0].end,stops[1].start,f);
      assert(scale>=previous-.002,'canopy opens monotonically while entering Shade');previous=scale;
    }
    assert(Math.abs(previous-1)<.001,'canopy is fully open when Shade text is complete');
    assert.equal(await page.$eval('#garden-shade .garden-copy',e=>+getComputedStyle(e).opacity),1);
    assert.equal(await page.$eval('[data-effect="device-label"]',e=>+e.getAttribute('opacity')),0,'shade content precedes its label');
    await visit(4,.5);assert(Math.abs(await page.evaluate(()=>__shadeScale)-1)<.001,'canopy remains open during partial label reveal');
    const halfwayLabel=await page.$eval('[data-effect="device-label"]',e=>+e.getAttribute('opacity'));assert(halfwayLabel>0&&halfwayLabel<1);
    await visit(4,.9);assert.equal(await page.$eval('[data-effect="device-label"]',e=>+e.getAttribute('opacity')),1);
    previous=1;
    for(const f of [0,.25,.5,.75,1]){
      const scale=await between(stops[1].end,stops[2].start,f);
      assert(scale<=previous+.002,'canopy retracts monotonically while leaving Shade');previous=scale;
    }
    assert(Math.abs(previous-.10)<.001,'canopy returns to its rolled state when Grow lights text is complete');
    assert.equal(await page.$eval('#garden-lights .garden-copy',e=>+getComputedStyle(e).opacity),1);
    await between(stops[1].end,stops[2].start,.5);await visit(4);
    assert(Math.abs(await page.evaluate(()=>__shadeScale)-1)<.001,'reverse scroll restores the fully open canopy');
    await between(stops[0].end,stops[1].start,.5);await visit(3);
    assert(Math.abs(await page.evaluate(()=>__shadeScale)-.10)<.001,'reverse scroll to Ventilation rolls it back');
    await visit(1);
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
    await page.waitForFunction(()=>document.querySelector('.garden-motion').textContent==='Motion reduced');
    // Let the final still frame requested by the preference change finish.
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const reducedDraws=await page.evaluate(()=>__draws);await wait(250);
    assert.equal(await page.evaluate(()=>__draws),reducedDraws,'reduced motion idles the sensor scene');
    assert.equal((await signal()).opacity,0,'reduced motion has no expanding signal rings');
    assert.deepEqual(errors,[]);
    console.log('PASS device loops, scroll-driven canopy opening/held label/closing, reverse visits, pause/resume and reduced motion.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
