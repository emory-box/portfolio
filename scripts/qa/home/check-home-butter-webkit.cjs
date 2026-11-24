const assert=require('node:assert/strict');
const runtime=require('../webkit-runtime.cjs').webkitRuntime();
const chrome=process.argv.includes('--chrome'),engine=chrome?'chromium':'webkit';
const site=process.env.SITE_URL||'http://localhost:4317';
(async()=>{
  const browser=await runtime[engine].launch({headless:true,...(chrome?{executablePath:require('../browser-runtime.cjs').browserRuntime().chromePath}:{})});
  try{
    const retina=process.argv.includes('--retina');
    const page=await browser.newPage({viewport:{width:1280,height:900},deviceScaleFactor:retina?2:1});
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto(site,{waitUntil:'networkidle'});
    assert.equal(await page.locator('mask#home-toast-stroke3_0_36').count(),0,'Animated butter must avoid a per-frame alpha mask');
    assert.equal(await page.locator('clipPath#home-toast-stroke3_0_36 use').getAttribute('xlink:href'),'#home-toast-stroke2_0_36','Butter stroke clip must follow the same live contour');
    await page.click('.home-skills');
    await page.waitForFunction(()=>document.documentElement.dataset.homePhase==='melting-butter');
    const frames=await page.evaluate(async()=>{
      const art=document.querySelector('.home-toast-art'),svg=art.querySelector('.home-butter-live'),body=svg.querySelector('.home-butter-body');
      const sheen=svg.querySelector('.home-butter-gloss-rest'),shine=sheen.querySelector('path');
      const animations=art.getAnimations({subtree:true});
      animations.forEach(animation=>animation.pause());
      const pose=()=>getComputedStyle(body).d||body.getAttribute('d');
      const result=[],highlights=[],opacity=[];
      for(const progress of [0,.2,.4,.6,.8,1]){
        animations.forEach(animation=>{animation.currentTime=animation.effect.getTiming().duration*progress;});
        await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
        result.push(pose());
        highlights.push(shine.getAttribute('d'));opacity.push(+getComputedStyle(sheen).opacity);
      }
      const opaque=[...svg.querySelectorAll('.home-butter-boundary,.home-butter-body')].every(path=>getComputedStyle(path).opacity==='1');
      animations.forEach(animation=>animation.play());
      return{distinct:new Set(result).size,highlights:new Set(highlights).size,opacity,opaque};
    });
    assert.equal(frames.distinct,6,'Butter contour must morph through six distinct poses, not jump to its final shape');
    assert(frames.opaque,'The original butter stays opaque');
    assert.equal(frames.highlights,6,'The same highlight deforms with the butter instead of fading in place');
    assert.equal(frames.opacity.at(-1),0,'Expanded butter has no pale reflection');
    assert(frames.opacity.every((value,i)=>!i||value<=frames.opacity[i-1]),'Reflection disappears continuously without flashing');
    await page.waitForFunction(()=>document.documentElement.dataset.homePhase==='detail');
    await page.click('.home-return');
    await page.waitForFunction(()=>document.documentElement.dataset.homePhase==='gathering-butter');
    const reversal=await page.evaluate(async()=>{
      const svg=document.querySelector('.home-butter-live'),body=svg.querySelector('.home-butter-body');
      const sheen=svg.querySelector('.home-butter-gloss-rest'),shine=sheen.querySelector('path');
      const art=document.querySelector('.home-toast-art');
      const animations=art.getAnimations({subtree:true});
      animations.forEach(animation=>{animation.pause();animation.currentTime=animation.effect.getTiming().duration*.4;});
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      const pose=()=>getComputedStyle(body).d||body.getAttribute('d');
      const reflection=()=>getComputedStyle(shine).d||shine.getAttribute('d');
      const before=pose(),beforeShine=reflection(),beforeStrength=getComputedStyle(sheen).opacity;document.querySelector('.home-skills').click();
      return{same:document.querySelector('.home-butter-live')===svg,unchanged:before===pose(),sameShine:beforeShine===reflection()&&beforeStrength===getComputedStyle(sheen).opacity};
    });
    assert(reversal.same&&reversal.unchanged&&reversal.sameShine,'Reopening mid-gather preserves the same object, contour and highlight');
    await page.waitForFunction(()=>document.documentElement.dataset.homePhase==='detail');
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.click('.home-return');await page.waitForFunction(()=>document.documentElement.dataset.homePhase==='home');
    await page.click('.home-skills');await page.waitForFunction(()=>document.documentElement.dataset.homePhase==='detail');
    assert.equal(await page.locator('.home-butter-live').evaluate(svg=>svg.getAnimations({subtree:true}).filter(a=>a.playState==='running').length),0,'Reduced motion skips the morph');
    assert.deepEqual(errors,[],'No script errors');
    console.log('PASS '+engine+' '+browser.version()+': continuous butter poses, opaque original object, interruption/reopen and reduced motion.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
