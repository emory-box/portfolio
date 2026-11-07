const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {pathToFileURL}=require('node:url');
const ROOT=path.resolve(__dirname,'../..');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const write=(file,value)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n');};
function locations(root=ROOT){return {
  approved:path.join(root,'projects/greeny/models/colors.json'),
  model:path.join(root,'projects/greeny/models/garden.glb'),
  poster:path.join(root,'projects/greeny/img/story/garden-fallback.png'),
  cache:path.join(root,'.cache/greeny-color-review'),
  renderer:['projects/greeny/garden-scene.js','projects/greeny/garden-colors.js','authoring/greeny/color-review.html'].map(p=>path.join(root,p)),
};}
function revision(root){const p=locations(root);return {
  approved:hash(fs.readFileSync(p.approved)),model:hash(fs.readFileSync(p.model)),
  renderer:hash(Buffer.concat(p.renderer.map(file=>fs.readFileSync(file)))),
};}
async function normalize(profile){return (await import(pathToFileURL(path.join(ROOT,'projects/greeny/garden-colors.js')).href)).validateColors(profile);}
function inventory(root=ROOT){
  const data=fs.readFileSync(locations(root).model);
  if(data.toString('ascii',0,4)!=='glTF'||data.toString('ascii',16,20)!=='JSON')throw new Error('Invalid garden GLB');
  const gltf=JSON.parse(data.toString('utf8',20,20+data.readUInt32LE(12)));
  return {materials:new Set((gltf.materials??[]).map(m=>m.extras?.baseMaterial??m.name)),groups:new Set((gltf.nodes??[]).filter(n=>n.mesh===undefined).map(n=>n.name))};
}
async function prepareDraft(assignments=[],view=0,root=ROOT){
  if(!Number.isInteger(view)||view<0||view>7)throw new Error('View must be a stop from 0 to 7');
  const p=locations(root),profile=await normalize(read(p.approved)),known=inventory(root);
  const aliases={canopy:'material:Shade_Woven',fan:'group:Fan',sensor:'group:Sensor',hub:'group:Hub',seedlings:'group:Plants',grass:'material:Grass_Clay',fence:'group:Fence'};
  const changes=[];
  for(const assignment of assignments){
    const separator=assignment.indexOf('=');
    if(separator<1)throw new Error('Use target=#RRGGBB');
    let target=aliases[assignment.slice(0,separator)]??assignment.slice(0,separator);
    const color=assignment.slice(separator+1).toUpperCase();
    let [kind,name]=target.includes(':')?target.split(':'):[known.materials.has(target)?'material':'group',target];
    const bucket=kind==='material'?'materials':kind==='group'?'groups':null;
    if(!bucket||!known[bucket].has(name))throw new Error('Unknown garden target: '+target);
    profile[bucket][name]=color;changes.push(name+' → '+color);
  }
  const checked=await normalize(profile),base=revision(root);
  const id=hash(JSON.stringify({profile:checked,base,view})).slice(0,12);
  const draft={id,base,profile:checked,view,changes};
  fs.mkdirSync(p.cache,{recursive:true});
  for(const name of ['receipt.json','review.png','poster.png'])fs.rmSync(path.join(p.cache,name),{force:true});
  write(path.join(p.cache,'draft.json'),draft);return draft;
}
function assertCurrent(draft,root){
  if(JSON.stringify(draft.base)!==JSON.stringify(revision(root)))throw new Error('Approved colors, model or renderer changed. Render a fresh preview.');
  if(draft.id!==hash(JSON.stringify({profile:draft.profile,base:draft.base,view:draft.view})).slice(0,12))throw new Error('Draft changed after preparation. Render a fresh preview.');
}
function recordReview(root=ROOT){
  const p=locations(root),draftFile=path.join(p.cache,'draft.json'),draft=read(draftFile);
  assertCurrent(draft,root);
  const images=Object.fromEntries(['review.png','poster.png'].map(name=>[name,hash(fs.readFileSync(path.join(p.cache,name)))]));
  write(path.join(p.cache,'receipt.json'),{id:draft.id,draftHash:hash(fs.readFileSync(draftFile)),images});
}
async function approveDraft(id,root=ROOT){
  const p=locations(root),draftFile=path.join(p.cache,'draft.json'),draft=read(draftFile),receipt=read(path.join(p.cache,'receipt.json'));
  if(receipt.approved)throw new Error('This draft was already approved');
  if(!id||id!==draft.id||id!==receipt.id)throw new Error('Approval must name the rendered draft ID');
  assertCurrent(draft,root);await normalize(draft.profile);
  if(hash(fs.readFileSync(draftFile))!==receipt.draftHash)throw new Error('Draft changed since its screenshot');
  for(const name of ['review.png','poster.png'])if(hash(fs.readFileSync(path.join(p.cache,name)))!==receipt.images[name])throw new Error('Review image changed. Render a fresh preview.');
  const next=p.approved+'.tmp',nextPoster=p.poster+'.tmp';
  const oldProfile=fs.readFileSync(p.approved),oldPoster=fs.readFileSync(p.poster);
  try{
    write(next,draft.profile);fs.copyFileSync(path.join(p.cache,'poster.png'),nextPoster);
    fs.renameSync(nextPoster,p.poster);fs.renameSync(next,p.approved);
  }catch(error){fs.writeFileSync(p.approved,oldProfile);fs.writeFileSync(p.poster,oldPoster);throw error;}
  finally{fs.rmSync(next,{force:true});fs.rmSync(nextPoster,{force:true});}
  receipt.approved=true;write(path.join(p.cache,'receipt.json'),receipt);
  draft.status='approved';write(draftFile,draft);
  return {id,approved:p.approved,poster:p.poster};
}
async function capture(root=ROOT){
  const {createServer}=require('../serve.cjs');
  const {puppeteer,chromePath}=require('../qa/browser-runtime.cjs').browserRuntime();
  const server=createServer();let browser;
  try{
    await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
    browser=await puppeteer.launch({executablePath:chromePath,headless:true,pipe:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
    const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.setViewport({width:1600,height:1000,deviceScaleFactor:1});
    await page.goto(`http://127.0.0.1:${server.address().port}/authoring/greeny/color-review.html`,{waitUntil:'networkidle0'});
    await page.waitForFunction(()=>window.__greenyReview?.ready||window.__greenyReview?.error);
    const review=await page.evaluate(()=>({id:window.__greenyReview.id,error:window.__greenyReview.error}));
    if(review.error||errors.length)throw new Error(review.error??errors.join('\n'));
    const p=locations(root),draft=read(path.join(p.cache,'draft.json'));
    if(review.id!==draft.id)throw new Error('Browser rendered a different draft');
    await page.evaluate(()=>document.fonts.ready);
    await page.screenshot({path:path.join(p.cache,'review.png'),fullPage:true});
    await page.setViewport({width:1600,height:1248,deviceScaleFactor:1});
    await page.evaluate(()=>window.__greenyReview.poster());
    await page.$eval('#after canvas',canvas=>canvas.scrollIntoView());
    await (await page.$('#after canvas')).screenshot({path:path.join(p.cache,'poster.png')});
    recordReview(root);
  }finally{
    await browser?.close();await new Promise(resolve=>server.close(resolve));
  }
}
async function main(){
  const [command,...args]=process.argv.slice(2);
  if(command==='list'){const i=inventory();console.log(JSON.stringify({materials:[...i.materials],groups:[...i.groups]},null,2));return;}
  if(command==='approve'){console.log(JSON.stringify(await approveDraft(args[0])));return;}
  if(command!=='preview')throw new Error('Use: colors.cjs list | preview [target=#RRGGBB] [--view 0..7] | approve <draft-id>');
  let view;const changes=[];
  for(let i=0;i<args.length;i++){if(args[i]==='--view')view=Number(args[++i]);else changes.push(args[i]);}
  view??=changes.some(value=>value.startsWith('canopy=')||value.includes('Shade_Woven='))?4:0;
  const start=Date.now(),draft=await prepareDraft(changes,view);await capture();
  console.log(JSON.stringify({draft:draft.id,changes:draft.changes,review:'.cache/greeny-color-review/review.png',poster:'.cache/greeny-color-review/poster.png',seconds:(Date.now()-start)/1000,productionChanged:false},null,2));
}
module.exports={locations,prepareDraft,recordReview,approveDraft,revision,inventory};
if(require.main===module)main().catch(error=>{console.error(error.message);process.exitCode=1;});
