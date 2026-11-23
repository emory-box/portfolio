const assert=require('node:assert/strict'),fs=require('node:fs');
const {puppeteer,chromePath}=require('../browser-runtime.cjs').browserRuntime();
const site=process.env.SITE_URL||'http://localhost:4317';
const selectors={
 skills:'.home-toast-art',about:'.home-about-card,.home-about-clip',
 work:'.home-project-board-surface,.home-project-preview:not([hidden])',
 contact:'.home-contact-paper,.home-note-tab,.home-note-shadow',
 play:'#play-title,.home-game-instructions,.home-game-status,.home-game-reset,.home-game-paper img,.home-game-outline img,.home-game-shadow img'
};
(async()=>{
 const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--disable-webgl']});
 try{
  const page=await browser.newPage(),errors=[],failures=[];page.on('pageerror',e=>errors.push(e.message));
  fs.mkdirSync('.cache/qa/home-fit',{recursive:true});
  for(const [width,height]of [[320,568],[360,800],[768,900],[1280,720],[1920,1080],[568,320]]){
   await page.setViewport({width,height});
   for(const id of Object.keys(selectors)){
    await page.goto(site+'/#'+id,{waitUntil:'networkidle0'});
    await page.waitForFunction(id=>document.documentElement.dataset.homePhase==='detail'&&document.documentElement.dataset.homeView===id,{},id);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const result=await page.evaluate((id,selector)=>{
     const view=document.querySelector('[data-view="'+id+'"]'),root=document.documentElement;
     const boxes=[...view.querySelectorAll(selector)].map(e=>e.getBoundingClientRect()).filter(r=>r.width&&r.height);
     const bounds={left:Math.min(...boxes.map(r=>r.left)),top:Math.min(...boxes.map(r=>r.top)),right:Math.max(...boxes.map(r=>r.right)),bottom:Math.max(...boxes.map(r=>r.bottom))};
     if(id==='skills'){
      // The original export includes transparent canvas margins. Check its
      // actual visible paper/shadow bounds from the current Figma instance.
      const r=boxes[0],scale=r.width/1854.1545;
      Object.assign(bounds,{left:r.left+445.386*scale,top:r.top+249.157*scale,right:r.left+1378.044*scale,bottom:r.top+1141.826*scale});
     }
     const small=[...view.querySelectorAll('button,input,textarea,a.home-project-open,a.home-project-tab')].filter(e=>e.getClientRects().length).map(e=>({name:e.getAttribute('aria-label')||e.textContent.trim()||e.id,min:id==='contact'||id==='play'?24:44,rect:e.getBoundingClientRect()})).filter(x=>x.rect.width<24-.5||x.rect.height<x.min-.5).map(x=>({name:x.name,width:x.rect.width,height:x.rect.height}));
     const r=document.querySelector('.home-return').getBoundingClientRect();
     const readingView=((id==='contact'||id==='play')&&(innerHeight<=480||parseFloat(view.style.height)>innerHeight+1))||(id==='work'&&innerWidth<=900);
     return{bounds,small,noScroll:root.scrollWidth<=innerWidth&&(readingView||root.scrollHeight<=innerHeight+1),frameHeight:readingView?root.scrollHeight:innerHeight,close:r.top>=0&&r.bottom<=96,scale:view.dataset.fitScale};
    },id,selectors[id]);
    const b=result.bounds;
    if(!(b.left>=15&&b.right<=width-15&&b.top>=71&&b.bottom<=result.frameHeight-15&&result.noScroll&&result.close&&!result.small.length))failures.push({viewport:[width,height],id,...result});
    if(width===320||width===1280||height===320)await page.screenshot({path:'.cache/qa/home-fit/'+id+'-'+width+'.png'});
   }
  }
  fs.writeFileSync('.cache/qa/home-fit/failures.json',JSON.stringify(failures,null,2));
  assert.deepEqual(errors,[]);
  assert.deepEqual(failures,[],'Whole objects and usable controls fit the safe viewport');
  console.log('PASS complete compositions below Close and usable controls; compact Projects and very short paper/game views retain vertical reading space.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
