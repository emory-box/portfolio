const assert=require('node:assert/strict');
const {puppeteer,chromePath}=require('./browser-runtime.cjs').browserRuntime();
const site=process.env.SITE_URL||'http://localhost:4317';
(async()=>{const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--disable-webgl']});try{
 const page=await browser.newPage();
 for(const route of ['/','/projects/moti-pulse/','/projects/greeny/','/projects/synergy/']){
  await page.goto(site+route,{waitUntil:'domcontentloaded'});
  const icons=await page.$$eval('link[rel="icon"]',es=>es.map(e=>({href:e.getAttribute('href'),type:e.type,sizes:e.sizes.value})));
  assert.equal(icons.length,2,'PNG fallback and scalable icon: '+route);
  assert(icons.every(i=>!i.href.startsWith('/')&&!i.href.startsWith('data:')&&!i.href.startsWith('http')),'Relative, meaningful favicon paths');
  assert(icons.some(i=>i.type==='image/svg+xml'&&i.sizes==='any'));
  assert(icons.some(i=>i.type==='image/png'&&i.sizes==='32x32'));
  for(const icon of icons){
   const result=await page.evaluate(async href=>{
    const url=new URL(href,location.href),response=await fetch(url);
    const img=new Image();img.src=url.href;await img.decode();
    const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d');x.drawImage(img,0,0,32,32);
    const pixels=x.getImageData(0,0,32,32).data;let painted=0;
    for(let i=3;i<pixels.length;i+=4)if(pixels[i]>0)painted++;
    return{status:response.status,painted,width:img.naturalWidth,height:img.naturalHeight};
   },icon.href);
   assert.equal(result.status,200);assert(result.painted>24,'Actual artwork is visible: '+route);
   assert.equal(result.width,result.height,'Square tab icon: '+route);
   if(icon.type==='image/png')assert.equal(result.width,32);
  }
 }
 console.log('PASS four page-specific tab icons, local SVG+32px PNG delivery, square geometry and nonempty artwork.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
