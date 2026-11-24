const assert=require('node:assert/strict'),fs=require('node:fs');
const runtime=require('./webkit-runtime.cjs').webkitRuntime();
const chrome=process.argv.includes('--chrome'),engine=chrome?'chromium':'webkit';
const site=process.env.SITE_URL||'http://localhost:4317';
const output='.cache/qa/project-rendering/'+engine;fs.mkdirSync(output,{recursive:true});
(async()=>{
  const browser=await runtime[engine].launch({headless:true,...(chrome?{executablePath:require('./browser-runtime.cjs').browserRuntime().chromePath}:{})});
  try{
    const page=await browser.newPage({reducedMotion:'reduce'});
    for(const width of [360,768,1280,1920])for(const slug of ['greeny','synergy','moti-pulse']){
      await page.setViewportSize({width,height:900});
      await page.goto(site+'/projects/'+slug+'/',{waitUntil:'networkidle'});
      await page.locator('.project-next').scrollIntoViewIfNeeded();
      await page.evaluate(()=>document.fonts.ready);
      const toggle=page.locator(slug==='moti-pulse'?'.contents summary':'.project-contents-toggle');
      await toggle.waitFor({state:'visible'});
      if(await toggle.getAttribute('aria-expanded')==='true')await toggle.click();
      await toggle.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      const label=toggle.locator('.contents-label,.project-contents-toggle-label');
      const fits=()=>label.evaluate(el=>{const range=document.createRange();range.selectNodeContents(el);const width=el.getBoundingClientRect().width;return width>0&&width>=range.getBoundingClientRect().width-.5&&+getComputedStyle(el).opacity===1;});
      assert(await fits(),slug+' closed Contents label must show the entire word');
      const arrowX=()=>toggle.locator('svg').evaluate(el=>{const r=el.getBoundingClientRect();return (r.left+r.right)/2;});
      const closedX=await arrowX();
      await toggle.click();
      await page.waitForFunction(selector=>document.querySelector(selector).getAttribute('aria-expanded')==='true',slug==='moti-pulse'?'.contents summary':'.project-contents-toggle');
      await toggle.evaluate(async el=>{
        await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
        await Promise.all(el.getAnimations({subtree:true}).map(animation=>animation.finished.catch(()=>{})));
      });
      assert.equal(await label.evaluate(el=>+getComputedStyle(el).opacity),0,'Open state hides only the visible label');
      const openX=await arrowX();
      assert(Math.abs(openX-closedX)<1,slug+' '+width+'px arrow stays in the same place: '+closedX+' → '+openX);
      await toggle.click();
      await page.waitForFunction(selector=>document.querySelector(selector).getAttribute('aria-expanded')==='false',slug==='moti-pulse'?'.contents summary':'.project-contents-toggle');
      await toggle.evaluate(async el=>{
        await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
        await Promise.all(el.getAnimations({subtree:true}).map(animation=>animation.finished.catch(()=>{})));
      });
      assert(await fits(),'Closing restores the full Contents word');
      await page.locator('.project-next img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
      const covers=await page.locator('.project-next-card .portfolio-cover').evaluateAll(els=>els.map(el=>{
        const r=el.getBoundingClientRect(),img=el.querySelector('img');
        return{width:r.width,height:r.height,top:r.top,radius:getComputedStyle(el).borderRadius,imageRadius:getComputedStyle(img).borderRadius};
      }));
      assert(covers.every(c=>Math.abs(c.width/c.height-16/9)<.01),'Uniform cover-frame ratio');
      assert(covers.every(c=>c.radius===covers[0].radius&&c.imageRadius==='0px'),'Uniform frame corners without a per-image override');
      if(width>700)assert(Math.abs(covers[0].top-covers[1].top)<1,'Desktop cover frames align');
      const moti=page.locator('.project-next-card[href="../moti-pulse/"] .portfolio-cover');
      if(await moti.count()){
        const data=(await moti.screenshot()).toString('base64');
        const top=await page.evaluate(async data=>{
          const img=new Image();img.src='data:image/png;base64,'+data;await img.decode();
          const canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;
          const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);
          return [...ctx.getImageData(Math.floor(img.width/2),2,1,1).data];
        },data);
        assert(top.slice(0,3).every(n=>n>250),'Moti cover top padding continues its white artwork, not the page background');
      }
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal page overflow');
      await page.locator('.project-next').screenshot({path:output+'/'+slug+'-'+width+'.png'});
      console.log('PASS '+engine+' '+slug+' '+width+'px: full Contents label, stable arrow, consistent original-cover frames.');
    }
    console.log('Engine '+browser.version()+'. Physical Safari/iPhone not covered by this desktop-engine check.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
