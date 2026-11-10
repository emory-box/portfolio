const assert=require('node:assert/strict'),fs=require('node:fs');
const {puppeteer,chromePath}=require('./browser-runtime.cjs').browserRuntime();
const SITE=process.env.SITE_URL||'http://localhost:4317';
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
fs.mkdirSync('.cache/qa/greeny',{recursive:true});

(async()=>{
  const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
  try {
    const page=await browser.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    async function visit(index,fraction=.9){
      await page.$eval(`[data-garden-step="${index}"]`,(step,fraction)=>{
        if(!step.classList.contains('has-device-hold')){step.scrollIntoView({block:'center',behavior:'instant'});return;}
        const base=parseFloat(step.style.getPropertyValue('--garden-step-height')),hold=parseFloat(step.style.getPropertyValue('--garden-annotation-distance'));
        const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h'));
        scrollTo({top:step.getBoundingClientRect().top+scrollY+base/2-(innerHeight+header)/2+hold*fraction,behavior:'instant'});
      },fraction);
      await page.waitForFunction((index,fraction)=>{
        const story=document.querySelector('.garden-story');
        if(story.dataset.step!==String(index))return false;
        const opacity=+story.querySelector('[data-effect="connectivity"]').getAttribute('opacity');
        return index!==6?opacity===0:fraction===0?opacity===0:fraction>=.9?opacity===1:opacity>0&&opacity<1;
      },{},index,fraction);
    }
    const reveal=()=>page.$eval('[data-effect="connectivity"]',e=>+e.getAttribute('opacity'));
    const packets=()=>page.$$eval('.garden-network-packet',es=>es.map(e=>[e.getAttribute('cx'),e.getAttribute('cy')]));
    for(const [width,height] of [[320,640],[360,900],[768,900],[1280,720],[1280,900],[1920,900]]){
      await page.setViewport({width,height});await page.goto(SITE+'/projects/greeny/');
      await page.waitForSelector('.garden-webgl');
      await page.evaluate(async()=>{await document.fonts.ready;document.documentElement.style.scrollBehavior='auto';});
      assert.deepEqual(await page.$$eval('.garden-connectivity figcaption',es=>es.map(e=>e.textContent)),['Gateway','The Internet','Greeny App']);
      assert.equal(await page.$$eval('.garden-connectivity path,.garden-connectivity circle',es=>es.length),0,'no caption leader lines or target dots');
      await visit(6,0);assert.equal(await reveal(),0,'network waits for the extra scroll beat');
      await visit(6,.5);assert((await reveal())>0&&(await reveal())<1,'progressive network reveal');
      await visit(6);assert.equal(await reveal(),1);
      const geometry=await page.evaluate(()=>{
        const svg=document.querySelector('.garden-connectivity-wires'),origin=svg.getBoundingClientRect();
        const path=id=>svg.querySelector(`[data-connection="${id}"]`);
        const sample=e=>{const length=e.getTotalLength();return Array.from({length:251},(_,i)=>{const p=e.getPointAtLength(length*i/250);return [p.x,p.y];});};
        const outer=sample(path('hub-gateway')),local=sample(path('local-network'));
        const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
        let crosses=false;
        for(let i=1;i<outer.length;i++)for(let j=1;j<local.length;j++){
          const [a,b,c,d]=[outer[i-1],outer[i],local[j-1],local[j]];
          if(cross(a,b,c)*cross(a,b,d)<0&&cross(c,d,a)*cross(c,d,b)<0)crosses=true;
        }
        return {crosses,overflow:document.documentElement.scrollWidth>innerWidth,
          bottom:Math.max(...outer.map(p=>p[1]))+origin.top,
          controls:document.querySelector('.garden-controls').getBoundingClientRect().top,
          labels:[...document.querySelectorAll('.garden-connectivity figcaption')].map(e=>{const r=e.getBoundingClientRect();return [r.left,r.right];}),
          straight:['gateway-internet','internet-app'].map(id=>{const pts=sample(path(id));return Math.max(...pts.map(p=>p[1]))-Math.min(...pts.map(p=>p[1]));})};
      });
      assert(!geometry.crosses,'Local network must not cross Hub to Gateway '+width);
      assert(!geometry.overflow,'no horizontal overflow '+width);
      assert(geometry.bottom<=geometry.controls-8,'network clears animation control '+width+'x'+height);
      assert(geometry.labels.every(([left,right])=>left>=0&&right<=width),'framed captions fit '+width);
      assert(geometry.straight.every(delta=>delta<.1),'Gateway, Internet and App share straight wires');
      await page.screenshot({path:`.cache/qa/greeny/connectivity-${width}-${height}.png`});
      await visit(5);assert.equal(await reveal(),0,'network exits with its scene');
      await visit(6);assert.equal(await reveal(),1,'reverse visit restores network');
      console.log(`PASS connectivity layout, staged reveal, separate routes and controls: ${width}x${height}`);
    }
    const moving=await packets();await wait(180);assert.notDeepEqual(await packets(),moving,'data packets loop');
    await page.click('.garden-motion');await wait(80);const frozen=await packets();await wait(180);
    assert.deepEqual(await packets(),frozen,'Pause freezes 2D data packets');
    await page.click('.garden-motion');await wait(180);assert.notDeepEqual(await packets(),frozen,'Resume continues 2D data packets');
    await page.evaluate(async()=>{
      const THREE=await import('three'),original=THREE.Object3D.prototype.updateMatrixWorld;
      THREE.Object3D.prototype.updateMatrixWorld=function(...args){
        if(this.name==='Story_Connections')window.__networkEdges=this.children.filter(e=>e.isLine).map(e=>`${e.userData.from}>${e.userData.to}`).sort();
        return original.apply(this,args);
      };
    });
    await wait(100);
    assert.deepEqual(await page.evaluate(()=>__networkEdges),['lampL>lampR','lampR>hub','fan>sprinkleL','sprinkleL>sensor','sensor>hub','sprinkleL>lampL','sensor>sprinkleR','sprinkleR>hub'].sort(),'approved graph is rendered once per edge');
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await visit(6);
    assert.equal(await reveal(),1);assert(await page.$$eval('.garden-network-packet',es=>es.every(e=>getComputedStyle(e).display==='none')),'reduced motion keeps a static network');
    await page.setJavaScriptEnabled(false);await page.reload();
    assert(await page.$eval('.garden-network',e=>getComputedStyle(e).clip==='auto'),'readable connection description without JavaScript');
    assert(await page.$eval('.garden-connectivity',e=>getComputedStyle(e).visibility==='visible'),'static illustrations without JavaScript');
    assert.deepEqual(errors,[]);console.log('PASS connectivity packets, native device graph, pause/resume and static fallbacks.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
