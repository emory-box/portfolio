const assert=require('node:assert/strict');
const {puppeteer,chromePath}=require('./browser-runtime.cjs').browserRuntime();
const SITE=process.env.SITE_URL||'http://localhost:4317';
(async()=>{
  const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage();
    for(const [width,height] of [[1280,900],[360,900],[320,640]]){
      await page.setViewport({width,height});await page.goto(SITE+'/projects/greeny/');
      await page.waitForSelector('.garden-webgl');
      await page.evaluate(async()=>{await document.fonts.ready;document.documentElement.style.scrollBehavior='auto';});
      const timing=await page.$eval('.garden-story',story=>{
        const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h'));
        return {release:story.getBoundingClientRect().bottom+scrollY-story.querySelector('.garden-stage').getBoundingClientRect().height-header,header};
      });
      const scroll=async y=>{
        await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);
        await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
      };
      const frame=()=>page.evaluate(()=>{
        const stage=document.querySelector('.garden-stage'),copy=document.querySelector('#garden-connect .garden-copy');
        return {top:stage.getBoundingClientRect().top,opacity:+getComputedStyle(stage).opacity,
          copy:+getComputedStyle(copy).opacity,inert:stage.inert,
          copyTop:copy.getBoundingClientRect().top,shift:getComputedStyle(document.querySelector('.garden-view')).transform,
          stageBottom:stage.getBoundingClientRect().bottom,nextTop:document.querySelector('.garden-project-context').getBoundingClientRect().top,
          icons:+getComputedStyle(copy.querySelector('.garden-connectivity')).opacity*+getComputedStyle(copy).opacity,
          wires:+document.querySelector('[data-effect="connectivity"]').getAttribute('opacity')*+getComputedStyle(stage).opacity};
      });
      await scroll(timing.release-40);
      const parked=await frame();
      assert.equal(parked.opacity,1,'final garden stays visible instead of fading away');
      assert.equal(await page.$eval('#garden-connect',e=>e.dataset.networkPhase),'offline');
      // Sticky positioning must hand over to document scrolling continuously,
      // with no fixed/absolute reparenting, snap or second camera movement.
      for(const offset of [-40,-2,0,2,40,140,40,2,0,-2,-40]){
        await scroll(timing.release+offset);const current=await frame();
        const movement=Math.max(0,offset);
        assert.equal(current.opacity,1,'model remains fully opaque through the handoff');
        assert.equal(current.copy,1);assert(!current.inert);
        assert.equal(current.shift,parked.shift,'final model does not switch side');
        assert(Math.abs(current.top-(timing.header-movement))<1.5,'scene follows normal page scrolling after its stop');
        assert(Math.abs(current.copyTop-(parked.copyTop-movement))<1.5,'text and garden leave as one document block');
        assert(Math.abs(current.icons-current.wires)<.02,'diagram remains intact');
        assert(current.stageBottom<=current.nextTop+1,'model stays inside its own section');
      }
      console.log(`PASS visible parked scene, continuous native handoff, reverse scroll and section boundary: ${width}x${height}`);
    }
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
