const assert=require('node:assert/strict'),fs=require('node:fs');
const {webkit}=require('./webkit-runtime.cjs').webkitRuntime();
const site=process.env.SITE_URL||'http://localhost:4317';
const output='.cache/qa/webkit';fs.mkdirSync(output,{recursive:true});
(async()=>{
  const browser=await webkit.launch({headless:true});
  try{
    const context=await browser.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,isMobile:true,hasTouch:true});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(site+'/',{waitUntil:'networkidle'});
    await page.locator('.home-pan-decoration').waitFor();
    await page.waitForFunction(()=>!document.querySelector('.home-pan-decoration').disabled,{},{timeout:5000});
    await page.locator('.home-pan-decoration').tap();
    assert.equal(await page.locator('.home-pan-decoration').getAttribute('aria-busy'),'true','Tap starts egg flip on the original pan');
    assert.equal(await page.evaluate(()=>document.documentElement.dataset.homePhase),'home');
    await page.evaluate(()=>{for(const a of document.querySelector('.home-pan-scene').getAnimations({subtree:true})){a.pause();a.currentTime=520;}});
    const flight=await page.locator('.home-pan-egg').first().evaluate(el=>{const m=new DOMMatrix(getComputedStyle(el).transform);return{height:m.f,flip:m.d};});
    assert(flight.height<-100&&flight.flip<0,'Egg visibly lifts and turns over');
    await page.screenshot({path:output+'/pan-airborne.png'});
    await page.evaluate(()=>{for(const a of document.querySelector('.home-pan-scene').getAnimations({subtree:true}))a.finish();});
    await page.waitForFunction(()=>!document.querySelector('.home-pan-decoration').hasAttribute('aria-busy'));
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.locator('.home-pan-decoration').tap();
    assert(await page.locator('.home-pan-decoration').evaluate(el=>el.getAnimations().every(a=>a.effect.getKeyframes().every(k=>!('transform'in k)))),'Reduced motion uses opacity feedback');
    await page.waitForFunction(()=>!document.querySelector('.home-pan-decoration').hasAttribute('aria-busy'));
    assert.deepEqual(errors,[]);
    console.log('PASS WebKit Home: touch activation, egg flip, same object, reduced motion, no script errors.');

    const staticContext=await browser.newContext({viewport:{width:393,height:852},deviceScaleFactor:2,javaScriptEnabled:false});
    const art=await staticContext.newPage();
    await art.goto(site+'/projects/greeny/',{waitUntil:'networkidle'});
    // Paint servers must belong to each icon, not an external <use> document.
    assert(await art.locator('.garden-connectivity-art').evaluateAll(icons=>icons.length===3&&icons.every(svg=>{
      if(svg.querySelector('use[href*=".svg"]'))return false;
      return [...svg.querySelectorAll('*')].every(el=>[...el.attributes].every(attr=>[...attr.value.matchAll(/url\(#([^)]*)\)/g)].every(([,id])=>[...svg.querySelectorAll('[id]')].some(def=>def.id===id))));
    })),'Every icon owns its gradient, filter, clip and mask definitions');
    const pixels=async(selector,point)=>{
      const image=await art.locator(selector).screenshot();
      return art.evaluate(async({data,point})=>{
        const img=new Image();img.src=data;await img.decode();
        const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);
        const scale=img.width/180;
        return [...ctx.getImageData(Math.floor(point[0]*scale),Math.floor(point[1]*scale),1,1).data];
      },{data:'data:image/png;base64,'+image.toString('base64'),point});
    };
    for(const [name,point]of [['gateway',[90,98]],['internet',[90,88]],['phone',[60,80]]]){
      const rgba=await pixels(`[data-network-node="${name}"] svg`,point);
      assert(rgba[1]>80&&rgba[1]>rgba[2]&&rgba[3]>200,name+' retains its colored fill, not only an outline');
    }
    const phoneImage=await art.locator('[data-network-node="phone"] svg').screenshot();
    const logo=await art.evaluate(async data=>{
      const image=new Image();image.src=data;await image.decode();const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const ctx=c.getContext('2d');ctx.drawImage(image,0,0);const scale=image.width/180;
      const p=ctx.getImageData(Math.ceil(71*scale),Math.ceil(55*scale),Math.floor(38*scale),Math.floor(44*scale)).data;
      let green=0;for(let i=0;i<p.length;i+=4)if(p[i]<150&&p[i+1]>p[i]&&p[i+2]<100&&p[i+3]>200)green++;
      return green/(p.length/4);
    },'data:image/png;base64,'+phoneImage.toString('base64'));
    assert(logo>.01&&logo<.6,'Original Greeny line mark renders rather than a solid green rectangle');
    for(const width of [360,393,768,1440]){
      await art.setViewportSize({width,height:900});
      assert(await art.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No page overflow '+width);
    }
    await art.setViewportSize({width:393,height:852});
    await art.locator('.garden-connectivity').scrollIntoViewIfNeeded();
    await art.locator('.garden-connectivity').screenshot({path:output+'/greeny-network.png'});
    console.log('PASS WebKit Greeny: self-contained SVG paint, cream device fills, green globe, original phone mark, responsive/no-script delivery.');
    console.log('Engine '+browser.version()+'; this is Windows WebKit, not a physical iPhone Safari session.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
