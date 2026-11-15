// Export the existing live banner, including its title and three original
// screens. This is an optional authoring step; Home serves the resulting PNG.
const path=require('node:path');
const {puppeteer,chromePath}=require('../../../scripts/qa/browser-runtime.cjs').browserRuntime();
const site=process.env.SITE_URL||'http://localhost:4317';
(async()=>{
 const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--disable-webgl']});
 try{
  const page=await browser.newPage();
  await page.setViewport({width:1440,height:1000,deviceScaleFactor:2});
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  await page.goto(site+'/projects/moti-pulse/',{waitUntil:'networkidle0'});
  await page.evaluate(()=>document.fonts.ready);
  await page.addStyleTag({content:'.hero,.hero *{animation:none!important;transition:none!important}'});
  await page.$$eval('.hero img',images=>Promise.all(images.map(image=>image.decode())));
  const box=await page.$eval('.hero',element=>{const r=element.getBoundingClientRect();return{top:r.top,height:r.height};});
  const file=path.resolve(__dirname,'../../../assets/img/home/moti-pulse-cover.png');
  // Keep the banner's original horizontal page gutters so neither the heading
  // nor the rotated Goal screen is cropped by an element-only screenshot.
  await page.screenshot({path:file,clip:{x:0,y:Math.floor(box.top),width:1440,height:Math.ceil(box.height)}});
  console.log('Exported current Moti-Pulse banner to assets/img/home/moti-pulse-cover.png');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
