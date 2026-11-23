// Reuses original artwork; no logo or avatar paths are redrawn.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const write=(p,s)=>fs.writeFileSync(path.join(root,p),s);
const avatar=[1,2,3].map(i=>read(`assets/img/home/avatar-layer-${i}.svg`).replace(/^[\s\S]*?<svg\b[^>]*>/,'').replace(/<\/svg>\s*$/,'')).join('\n');
write('assets/img/home/favicon.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="70 22 190 190" fill="none"><rect x="70" y="22" width="190" height="190" rx="40" fill="#F2F0F3"/>${avatar}</svg>\n`);
const moti=fs.readFileSync(path.join(root,'projects/moti-pulse/img/logo-centered.png')).toString('base64');
write('projects/moti-pulse/img/favicon.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="1 1 53 53"><defs><clipPath id="moti-app-shape"><rect x="1" y="1" width="53" height="53" rx="15"/></clipPath></defs><image width="55" height="55" href="data:image/png;base64,${moti}" clip-path="url(#moti-app-shape)"/></svg>\n`);
const synergy=read('projects/synergy/img/logo.svg').replace(/<svg\b[^>]*>/,'<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="848 380 224 224"><defs><clipPath id="synergy-app-shape"><rect x="848" y="380" width="224" height="224" rx="48"/></clipPath></defs><g clip-path="url(#synergy-app-shape)">').replace('</svg>','</g></svg>');
write('projects/synergy/img/favicon.svg',synergy+'\n');
console.log('Exported Home portrait and original project favicon sources.');

// Optional authoring-only raster fallbacks. The deployed site needs no browser,
// build step or third-party font/image request.
if(process.argv.includes('--render'))(async()=>{
  const {puppeteer,chromePath}=require(path.join(root,'scripts/qa/browser-runtime.cjs')).browserRuntime();
  const browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox']});
  try{
    const page=await browser.newPage();await page.goto(process.env.SITE_URL||'http://localhost:4317/',{waitUntil:'networkidle0'});
    for(const name of ['assets/img/home/favicon','projects/moti-pulse/img/favicon','projects/greeny/img/favicon','projects/synergy/img/favicon']){
      const png=await page.evaluate(async name=>{
        const image=new Image();image.src=new URL(name+'.svg',location.origin+'/').href;await image.decode();
        const canvas=document.createElement('canvas');canvas.width=canvas.height=32;
        canvas.getContext('2d').drawImage(image,0,0,32,32);return canvas.toDataURL('image/png').split(',')[1];
      },name);
      fs.writeFileSync(path.join(root,name+'.png'),Buffer.from(png,'base64'));
    }
    console.log('Rendered four32px PNG fallbacks.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
