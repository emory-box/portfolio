const assert=require('node:assert/strict');
const {puppeteer,chromePath}=require('../browser-runtime.cjs').browserRuntime();
const SITE=process.env.SITE_URL||'http://localhost:4317';
const objects={about:'.home-portrait .home-avatar-art',work:'.home-projects .home-pegboard-art',skills:'.home-skills .home-toast-art',contact:'.home-note .home-note-art',play:'.home-play .home-game-art'};
(async()=>{
 const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--disable-webgl']});
 try{
  const page=await browser.newPage(),failures=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
  const widths=process.env.HOME_OBJECT_WIDTHS?process.env.HOME_OBJECT_WIDTHS.split(',').map(Number):[360,768,1280,1920];
  for(const width of widths){
  await page.setViewport({width,height:900});
  for(const [id,selector]of Object.entries(objects)){
   await page.goto(SITE+'/',{waitUntil:'networkidle0'});
   const result=await page.evaluate(async({id,selector})=>{
    const original=document.querySelector(selector),parts=[...original.querySelectorAll('img,.home-note-face,.home-note-tab,.home-note-shadow')];
    const visible=e=>{if(!e.getBoundingClientRect().height)return false;for(let p=e;p&&p.nodeType===1;p=p.parentElement){const s=getComputedStyle(p);if(s.visibility==='hidden'||+s.opacity<.01||s.display==='none')return false;}return true;};
    document.querySelector('.home-stage a[href="#'+id+'"]').click();
    const carrier=document.querySelector('.home-zoom-art'),travels=carrier?.contains(original);
    const last=carrier.getAnimations()[0].effect.getKeyframes().at(-1),matrix=new DOMMatrix(last.transform);
    const expected={left:matrix.e,top:matrix.f,width:parseFloat(carrier.style.width)*matrix.a,height:parseFloat(last.height||carrier.style.height)*matrix.a};
    let overlap=false,dimmed=false,lost=false,fallbackVisible=false,earlyContent=false,escapedRules=false;
    function checkNote(){
     if(id!=='contact')return;
     if([...document.querySelectorAll('.home-note-face')].filter(visible).length>1)overlap=true;
     const rules=original.querySelector('.home-note-rules');
     if(visible(rules)){
      const face=original.querySelector('.home-note-face').getBoundingClientRect();
      for(const line of rules.children){const r=line.getBoundingClientRect();if(r.left<face.left-1||r.right>face.right+1||r.top<face.top-1||r.bottom>face.bottom+1)escapedRules=true;}
     }
    }
    const deadline=performance.now()+10000;
    await new Promise((resolve,reject)=>{function tick(){
     checkNote();
     if(visible(original)&&+getComputedStyle(original).opacity<.99)dimmed=true;
     const compactBoardLanded=id==='work'&&innerWidth<=900&&!document.querySelector('.home-zoom-art');
     if(!visible(original)&&!compactBoardLanded)lost=true;
     if([...document.querySelectorAll('.home-object-fallback')].some(visible))fallbackVisible=true;
     if(document.querySelector('.home-zoom-art')&&id==='contact'&&visible(document.querySelector('.home-contact-content')))earlyContent=true;
     if(document.documentElement.dataset.homePhase==='detail')resolve();else if(performance.now()>deadline)reject(Error('Entry timed out: '+id));else requestAnimationFrame(tick);
    }requestAnimationFrame(tick);});
    const arrived=document.querySelector('[data-view="'+id+'"]').contains(original);
    const actual=original.getBoundingClientRect(),landedClean=Object.keys(expected).every(key=>Math.abs(actual[key]-expected[key])<.5);
    const intact=parts.every(p=>original.contains(p));
    const settledVisibility=id==='work'&&innerWidth<=900?!visible(original):visible(original);
    document.querySelector('.home-return').click();
    const returnDeadline=performance.now()+10000;
    await new Promise((resolve,reject)=>{function tick(){
     checkNote();
     if(document.documentElement.dataset.homePhase==='home')resolve();else if(performance.now()>returnDeadline)reject(Error('Exit timed out: '+id));else requestAnimationFrame(tick);
    }tick();});
    const returned=document.querySelector('.home-stage a[href="#'+id+'"]').contains(original);
    return {travels,arrived,intact,returned,landedClean,settledVisibility,overlap,dimmed,lost,fallbackVisible,earlyContent,escapedRules};
   },{id,selector});
   for(const [key,value]of Object.entries(result))if(value!==!['overlap','dimmed','lost','fallbackVisible','earlyContent','escapedRules'].includes(key))failures.push(width+'/'+id+': '+key+'='+value);
   console.log(width+'/'+id,JSON.stringify(result));
  }
  }
  // A user can reverse an entrance, then reopen the same view while the
  // object is returning. Compare the actual art and its children synchronously
  // across each handoff, so a clone swap or reset-to-endpoint cannot pass.
  await page.setViewport({width:1280,height:900});
  for(const [id,selector]of Object.entries(objects))for(const delay of [180,1020]){
   await page.goto(SITE+'/',{waitUntil:'networkidle0'});
   const result=await page.evaluate(async({id,selector,delay})=>{
    const sleep=ms=>new Promise(r=>setTimeout(r,ms)),original=document.querySelector(selector),parts=[...original.children];
    const snapshot=()=>[original,...parts].map(e=>{const r=e.getBoundingClientRect();return[r.left,r.top,r.width,r.height];});
    const jump=(a,b)=>Math.max(...a.flatMap((rect,i)=>rect.map((n,j)=>Math.abs(n-b[i][j]))));
    const open=()=>document.querySelector('.home-stage a[href="#'+id+'"]').click();
    const until=async phase=>{const end=performance.now()+10000;while(document.documentElement.dataset.homePhase!==phase){if(performance.now()>end)throw Error('Timed out: '+id+'/'+phase);await sleep(16);}};
    open();await sleep(delay);
    const a=snapshot();document.querySelector('.home-return').click();const b=snapshot();
    await sleep(320);const c=snapshot();open();const d=snapshot();await until('detail');
    const arrived=document.querySelector('[data-view="'+id+'"]').contains(original);
    document.querySelector('.home-return').click();await until('home');
    return {closeJump:jump(a,b),reopenJump:jump(c,d),arrived,intact:parts.every(p=>original.contains(p)),returned:Boolean(original.closest('.home-stage')),carriers:document.querySelectorAll('.home-zoom-art').length};
   },{id,selector,delay});
   console.log('reversal/'+id+'/'+delay,JSON.stringify(result));
   if(result.closeJump>=.5||result.reopenJump>=.5||!result.arrived||!result.intact||!result.returned||result.carriers!==0)failures.push('reversal/'+id+'/'+delay+': '+JSON.stringify(result));
  }
  assert.deepEqual(errors,[]);assert.deepEqual(failures,[],'Every view must keep its original object, without a second paper or object fade');
  console.log('PASS one original object/parts through opening, landing and return for all five views; one visible note surface.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
