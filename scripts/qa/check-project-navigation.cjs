const assert=require('node:assert/strict'),fs=require('node:fs');
const {puppeteer,chromePath}=require('./browser-runtime.cjs').browserRuntime();
const SITE=process.env.SITE_URL||'http://localhost:4317';
const project=process.argv[2]||'greeny';
const config={
  greeny:{meta:'Design with Hardware consideration2 months',start:'#brief',links:18,heading:'typography-title',topics:'UI system',waitForContent:true},
  synergy:{meta:'UX/UI Education Case Study.3 months',start:'#overview',links:21,heading:'typography',topics:'Design system',waitForContent:false}
}[project];
assert(config,'Supported project: greeny or synergy');
const route='/projects/'+project+'/';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const root='.project-contents',toggle=root+' .project-contents-toggle';
fs.mkdirSync('.cache/qa/navigation',{recursive:true});
(async()=>{
  const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    async function fit(){return page.$eval(root,e=>{
      const panel=e.querySelector('nav'),r=panel.getBoundingClientRect(),button=e.querySelector('button').getBoundingClientRect();
      return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,buttonLeft:button.left,
        pageOverflow:document.documentElement.scrollWidth>innerWidth,
        scrolls:panel.scrollHeight>panel.clientHeight+2||panel.scrollWidth>panel.clientWidth+2};
    });}
    async function assertFit(width,height){
      const f=await fit();assert(!f.pageOverflow,'no page overflow');assert(!f.scrolls,'no internal Contents scrollbar '+JSON.stringify(f));
      assert(f.left>=8&&f.right<=width-56&&f.top>=8&&f.bottom<=height-8,'panel fits viewport '+JSON.stringify(f));
      assert(f.right<=f.buttonLeft-8,'button remains outside the panel background');
    }
    for(const [width,height]of [[320,640],[360,900],[768,900],[1280,900],[1920,900],[844,390]]){
      await page.setViewport({width,height});await page.goto(SITE+route);
      await page.waitForSelector(root+'.is-enhanced');await page.evaluate(async()=>{await document.fonts.ready;scrollTo({top:0,behavior:'instant'});});
      const header=await page.$eval('.project-header',e=>({position:getComputedStyle(e).position,meta:e.querySelector('.project-header-meta').textContent,href:e.querySelector('.project-header-home').getAttribute('href')}));
      assert(!['sticky','fixed'].includes(header.position));assert.equal(header.meta,config.meta);assert.equal(header.href,'../../index.html');
      assert(await page.$eval('.project-header .brand',e=>!e.matches('a,button,[role="link"],[role="button"],[tabindex]')&&!e.hasAttribute('href')&&!e.querySelector('a,button,[tabindex]')),'logo/name identity is static and excluded from keyboard navigation');
      assert.equal(await page.$eval(toggle,e=>e.getAttribute('aria-expanded')),'false');
      if(config.waitForContent){
        assert(await page.$eval(root,e=>e.classList.contains('is-unavailable')&&e.inert),'Contents waits for Introduction');
        assert.equal(await page.$eval(root,e=>getComputedStyle(e).opacity),'0','no panel flashes over the 3D introduction');
      }else assert(!await page.$eval(root,e=>e.classList.contains('is-unavailable')||e.inert),'Contents is available in Overview');
      assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'closed panel causes no overflow');
      assert(await page.$$eval(root+' a',(links,count)=>links.length===count&&links.every(a=>document.querySelectorAll(a.hash).length===1),config.links),'all approved targets are unique');
      if(width===1280)await page.screenshot({path:'.cache/qa/navigation/'+project+'-header.png'});
      await page.evaluate(()=>scrollTo({top:500,behavior:'instant'}));await wait(80);
      assert(await page.$eval('.project-header',e=>e.getBoundingClientRect().bottom<0),'header scrolls away');
      await page.evaluate(()=>scrollTo({top:400,behavior:'instant'}));await wait(80);
      assert(await page.$eval('.project-header',e=>e.getBoundingClientRect().bottom<0),'header stays away on upward scroll');
      await page.$eval(config.start,e=>e.scrollIntoView({block:'start',behavior:'instant'}));
      await page.waitForSelector(root+':not(.is-unavailable)');
      const buttonBefore=await page.$eval(toggle,e=>{const r=e.querySelector('svg').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,bg:getComputedStyle(e).backgroundColor};});
      await page.focus(toggle);await page.keyboard.press('Space');await wait(400);
      assert.equal(await page.$eval(toggle,e=>e.getAttribute('aria-label')),'Close Contents');
      assert(await page.$eval(toggle,e=>getComputedStyle(e).outlineStyle!=='none'),'keyboard focus is visible');
      const buttonAfter=await page.$eval(toggle,e=>{const r=e.querySelector('svg').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,bg:getComputedStyle(e).backgroundColor};});
      assert(Math.abs(buttonBefore.x-buttonAfter.x)<.5&&Math.abs(buttonBefore.y-buttonAfter.y)<.5,'arrow stays at its viewport position');
      assert.equal(buttonAfter.bg,buttonBefore.bg,'open toggle is visually neutral');
      await assertFit(width,height);
      await page.keyboard.press('Escape');assert.equal(await page.$eval(toggle,e=>e.getAttribute('aria-expanded')),'true','Escape preserves open state');
      await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
      if(await page.$eval(root,e=>e.classList.contains('is-compact'))){
        await page.click('[aria-label="Show '+config.topics+' topics"]');
      }
      await page.click(root+' a[href="#typography"]');
      await page.waitForFunction(id=>document.activeElement?.id===id,{},config.heading);
      assert.equal(await page.$eval(toggle,e=>e.getAttribute('aria-expanded')),'true','following link keeps panel open');
      assert.equal(await page.$eval(root+' a[aria-current]',e=>e.hash),'#typography');
      assert(await page.$eval('#'+config.heading,e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.top<innerHeight/3;}),'target heading is visible and focused');
      await page.setViewport({width:width+8,height});await wait(80);
      assert.equal(await page.$eval(toggle,e=>e.getAttribute('aria-expanded')),'true','resize preserves open state');
      await page.setViewport({width,height});
      await page.screenshot({path:`.cache/qa/navigation/${project}-contents-${width}-${height}.png`});
      await page.click(toggle);assert.equal(await page.$eval(toggle,e=>e.getAttribute('aria-expanded')),'false');
      assert(await page.$eval(root+' nav',e=>e.inert),'closed links leave the focus order');
      if(project==='greeny'){
      await page.$eval('#garden-sensors',e=>e.scrollIntoView({block:'center',behavior:'instant'}));await wait(80);
      assert(await page.evaluate(()=>{
        const a=document.querySelector('.garden-motion').getBoundingClientRect(),b=document.querySelector('.project-contents-toggle').getBoundingClientRect();
        return a.right<=b.left||a.left>=b.right||a.bottom<=b.top||a.top>=b.bottom;
      }),'Contents does not cover Pause when returning to the 3D story');
      }
      await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
      console.log(`PASS project header, Contents fit, native links/focus and persistent open state: ${width}x${height}`);
    }
    // CSS transitions reverse from their current position, even mid-action.
    await page.setViewport({width:1280,height:900});await page.$eval(config.start,e=>e.scrollIntoView({block:'start',behavior:'instant'}));await page.click(toggle);await wait(70);
    // Measure in one browser task so normal movement between protocol calls
    // is not mistaken for a discontinuity on a busy renderer.
    const reversal=await page.$eval(root+' nav',e=>{
      const before=e.getBoundingClientRect().left;
      document.querySelector('.project-contents-toggle').click();
      return Math.abs(before-e.getBoundingClientRect().left);
    });
    assert(reversal<35,'mid-transition reversal does not jump');
    await page.click(toggle);await wait(400);
    // At large text size the same panel offers chapter/topic views, never a scrollbar.
    await page.setViewport({width:360,height:640});await page.evaluate(()=>document.documentElement.style.fontSize='200%');await wait(100);
    await assertFit(360,640);
    assert(await page.$eval(root,e=>e.classList.contains('is-compact')));
    if(await page.$eval(root,e=>e.classList.contains('is-drilldown')))await page.click('.project-contents-back');
    await page.click('[aria-label="Show '+config.topics+' topics"]');await assertFit(360,640);
    assert(await page.$eval(root+' a[href="#components"]',e=>e.checkVisibility()));
    await page.click('.project-contents-back');await assertFit(360,640);
    const session=await page.createCDPSession();
    const {root:doc}=await session.send('DOM.getDocument');
    const {nodeId}=await session.send('DOM.querySelector',{nodeId:doc.nodeId,selector:toggle});
    const {node}=await session.send('DOM.describeNode',{nodeId});
    const {nodes}=await session.send('Accessibility.getPartialAXTree',{backendNodeId:node.backendNodeId,fetchRelatives:false});
    assert(nodes.some(n=>n.role?.value==='button'&&n.name?.value==='Close Contents'),'accessible button role/name match open state');
    await page.click(toggle);await wait(400);
    assert(await page.$eval('.project-contents-toggle-label',e=>e.clientWidth>=e.scrollWidth-1),'closed Contents label is not truncated at 200% text');
    await page.setJavaScriptEnabled(false);await page.goto(SITE+route);
    assert(await page.$eval(root,e=>!e.classList.contains('is-enhanced')));
    assert(await page.$$eval(root+' a',(es,count)=>es.length===count&&es.every(e=>getComputedStyle(e).visibility==='visible'),config.links),'no-JS retains inline section links');
    assert.deepEqual(errors,[]);console.log('PASS continuous reversal, 200% text, compact topics, accessibility tree and no-JavaScript navigation.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
