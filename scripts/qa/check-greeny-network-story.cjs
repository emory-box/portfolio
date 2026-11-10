const assert=require('node:assert/strict'),fs=require('node:fs');
const {puppeteer,chromePath}=require('./browser-runtime.cjs').browserRuntime();
const SITE=process.env.SITE_URL||'http://localhost:4317';
fs.mkdirSync('.cache/qa/greeny',{recursive:true});

(async()=>{
  const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
  try {
    const page=await browser.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    async function frame(){return page.evaluate(()=>{
      const story=document.querySelector('.garden-story'),step=story.querySelector('#garden-connect');
      const board=step.querySelector('.garden-connectivity');let opacity=1;
      for(let e=board;e;e=e.parentElement)opacity*=+getComputedStyle(e).opacity;
      return {phase:step.dataset.networkPhase,step:story.dataset.step,pose:window.__networkPose,
        shift:getComputedStyle(story.querySelector('.garden-view')).transform,
        copyTop:step.querySelector('.garden-copy').getBoundingClientRect().top,
        slot:step.querySelector('.garden-network-text').getBoundingClientRect().toJSON(),
        grid:board.querySelector('.garden-connectivity-nodes').getBoundingClientRect().toJSON(),
        view:story.querySelector('.garden-view').getBoundingClientRect().toJSON(),
        control:story.querySelector('.garden-controls').getBoundingClientRect().top,
        opacity,wires:+story.querySelector('[data-effect="connectivity"]').getAttribute('opacity'),
        panels:[...step.querySelectorAll('[data-network-copy],[data-app-copy]')].filter(e=>e.getAttribute('aria-hidden')==='false').map(e=>e.dataset.networkCopy||e.dataset.appCopy)};
    });}
    for(const [width,height] of [[320,640],[360,900],[768,900],[1280,720],[1280,900],[1920,900]]){
      await page.setViewport({width,height});await page.goto(SITE+'/projects/greeny/');
      await page.waitForSelector('.garden-webgl');
      await page.evaluate(async()=>{
        await document.fonts.ready;document.documentElement.style.scrollBehavior='auto';
        const THREE=await import('three'),original=THREE.Object3D.prototype.updateMatrixWorld;
        THREE.Object3D.prototype.updateMatrixWorld=function(...args){
          if(this.name==='Garden_Root')window.__networkPose=[...this.parent.rotation.toArray().slice(0,3),...this.parent.position.toArray()];
          return original.apply(this,args);
        };
      });
      assert.equal(await page.$$eval('[data-garden-step]',es=>es.length),7,'seven garden scenes; no separate App scene');
      assert.equal(await page.$$eval('section#garden-remote,[data-garden-step="7"]',es=>es.length),0);
      const timeline=await page.$eval('#garden-connect',step=>{
        const base=parseFloat(step.style.getPropertyValue('--garden-step-height'));
        const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h'));
        return {start:step.getBoundingClientRect().top+scrollY+base/2-(innerHeight+header)/2,
          annotation:parseFloat(step.style.getPropertyValue('--garden-annotation-distance')),
          beat:parseFloat(step.style.getPropertyValue('--garden-network-beat'))};
      });
      assert(timeline.beat>0,'final scene has a readable text sequence '+width);
      async function visit(progress,phase){
        await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),timeline.start+timeline.annotation+timeline.beat*progress);
        await page.waitForFunction(phase=>document.querySelector('#garden-connect').dataset.networkPhase===phase,{},phase);
        await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
        return frame();
      }
      const initial=await visit(0,'hub');
      for(const [progress,phase] of [[.6,'online'],[1.6,'offline'],[.6,'online'],[0,'hub']]){
        const current=await visit(progress,phase);
        assert.equal(current.step,'6');assert.deepEqual(current.pose,initial.pose,'native model pose stays fixed');
        assert.equal(current.shift,initial.shift,'model never switches side for App');
        assert(Math.abs(current.copyTop-initial.copyTop)<1,'copy frame remains pinned');
        assert(Math.abs(current.grid.top-initial.grid.top)<1,'network illustrations never jump');
        assert.equal(current.opacity,1);assert.equal(current.wires,1,'network survives every copy swap');
        assert(current.slot.bottom<=current.grid.top-8,'text clears the diagram');
        assert(current.grid.bottom<=current.control-24,'captions clear Pause');
        assert.deepEqual(current.panels,phase==='hub'?['hub']:['app',phase],'only current copy is exposed to assistive technology');
        if(width===320)assert(current.view.bottom<=current.copyTop-6,'short mobile model clears its heading');
        assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
        if(progress===1.6)await page.screenshot({path:`.cache/qa/greeny/network-story-${width}-${height}.png`});
      }
      // Halfway through the first text crossfade, the separate diagram remains full.
      await visit(.21,'online');
      const blend=await page.$$eval('[data-network-copy]',es=>es.map(e=>+getComputedStyle(e).opacity));
      assert(blend.every(opacity=>opacity>0&&opacity<1),'smooth crossfade between Hub and App');
      assert.equal((await frame()).wires,1);
      await page.$eval('#brief',e=>e.scrollIntoView({block:'start',behavior:'instant'}));
      await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
      assert(await page.$eval('.garden-story',s=>s.querySelector('.garden-stage').getBoundingClientRect().bottom<=s.getBoundingClientRect().bottom+1),'terminal garden stays above the case study');
      console.log(`PASS fixed garden/network, Hub/Online/Offline copy, reverse scroll, accessible panels and final boundary: ${width}x${height}`);
    }
    await page.goto(SITE+'/projects/greeny/#garden-remote');
    await page.waitForFunction(()=>document.querySelector('#garden-connect').dataset.networkPhase==='online');
    assert.equal(await page.$eval('.garden-story',e=>e.dataset.step),'6','existing App anchor opens its merged copy state');
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
    await page.waitForFunction(()=>!document.querySelector('#garden-connect').classList.contains('has-network-story'));
    const readable=()=>page.$$eval('[data-network-copy],[data-app-copy]',es=>es.every(e=>!e.inert&&e.getAttribute('aria-hidden')!=='true'&&getComputedStyle(e).visibility==='visible'));
    assert(await readable(),'reduced motion retains all Hub and App copy in normal flow');
    await page.setJavaScriptEnabled(false);await page.reload();assert(await readable(),'no-JavaScript reading order remains complete');
    assert.deepEqual(errors,[]);console.log('PASS complete reduced-motion and no-JavaScript copy.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
