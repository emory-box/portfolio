const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),manifest=require('../../authoring/greeny/case-study/slides.json'),graphs=require('../../authoring/greeny/case-study/diagrams.cjs');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const expected=[...Array.from({length:28},(_,i)=>i+5),33.1,33.2,...Array.from({length:16},(_,i)=>i+34),52];
assert.deepEqual(manifest.slides.map(s=>s.number),expected,'All source slides 5–49, including 33.1/33.2, and the approved outdoor artwork 52');
const html=fs.readFileSync(path.join(root,'projects/greeny/index.html'),'utf8');
const presented=[...html.matchAll(/data-source-slide="([^"]+)"/g)].flatMap(m=>m[1].split(/\s+/).map(Number));
const omitted=manifest.slides.filter(s=>s.status==='omitted').map(s=>s.number);
const referenceOnly=manifest.slides.filter(s=>s.status==='reference-only').map(s=>s.number);
assert.deepEqual(omitted,[6,16,35,36,37,38,40,41,42,43,44,46,47,48,49],'Only owner-approved omissions from the current references');
assert.deepEqual(referenceOnly,[7],'Sensor overview omitted; illustration retained as supporting evidence');
const expectedPresented=expected.filter(n=>!omitted.includes(n)&&!referenceOnly.includes(n));
const presentationOrder=[5,8,9,10,11,12,13,14,15,19,17,18,20,29,31,30,33.1,32,33.2,21,22,27,23,25,24,26,28,34,45,39,52];
assert.deepEqual([...new Set(presented)],presentationOrder,'Page follows all three approved uploaded layouts');
assert.deepEqual([...presentationOrder].sort((a,b)=>a-b),expectedPresented,'All retained source content is accounted for');
assert.deepEqual(manifest.presentationOrder,presentationOrder,'Source manifest matches approved reading order');
assert.equal(hash(fs.readFileSync(path.join(root,'authoring/greeny/case-study',manifest.openingReference.file))),manifest.openingReference.sha256,'Uploaded layout reference preserved');
const reference=fs.readFileSync(path.join(root,'authoring/greeny/case-study',manifest.openingReference.file),'utf8');
const referencePaths=[...reference.matchAll(/<path\b[^>]*\/?\s*>/g)].map(m=>m[0]);
for(const [name,count] of [['letter',1],['fingerprint',1],['sprout',2]]){
 const glyph=fs.readFileSync(path.join(root,'authoring/greeny/case-study/references',name+'.svg'),'utf8');
 const paths=[...glyph.matchAll(/<path\b[^>]*\/?\s*>/g)].map(m=>m[0]);
 assert.equal(paths.length,count,'Complete source glyph: '+name);
 assert(paths.every(p=>referencePaths.includes(p)),'Original uploaded glyph: '+name);
 assert(glyph.includes('fill="none"'),'Retain transparent fill inheritance: '+name);
}
assert(html.includes('img/case-study/sensor-explanation.jpg'),'Sensor explanation remains available in Components');
assert.equal(hash(fs.readFileSync(path.join(root,'authoring/greeny/case-study',manifest.experienceReference.file))),manifest.experienceReference.sha256,'Experience source preserved');
for(const asset of [...manifest.experienceAssets.vectors,...manifest.experienceAssets.photos]){
 const bytes=fs.readFileSync(path.join(root,asset.file));assert.equal(hash(bytes),asset.sha256,'Current extracted artwork: '+asset.file);
 if(asset.file.endsWith('.svg'))assert(!/<image\b|<foreignObject\b|<script\b/.test(bytes.toString()),'Vector-only original diagram: '+asset.file);
}
assert.equal(hash(fs.readFileSync(path.join(root,'authoring/greeny/case-study',manifest.interfaceReference.file))),manifest.interfaceReference.sha256,'Current interface reference preserved');
assert.deepEqual(manifest.interfaceReference.panels.map(p=>p.slide),[45,39,52],'Approved three-panel interface sequence');
assert(!html.includes('deck-sensor-overview'),'Removed introduction overview stays omitted');
let originals=0;
for(const slide of manifest.slides){
 const input=path.join(process.argv[2]||manifest.sourceDirectory,slide.file);
 if(fs.existsSync(input))assert.equal(hash(fs.readFileSync(input)),slide.sha256,'Source changed: '+slide.file);
 if(slide.asset){assert.equal(hash(fs.readFileSync(path.join(root,slide.asset))),slide.sha256,'Artwork differs from supplied source '+slide.number);originals++;}
}
for(const g of graphs){
 const svg=fs.readFileSync(path.join(root,'projects/greeny/img/diagrams',g.id+'.svg'),'utf8');
 assert.ok(!svg.includes('<image'),'Diagram '+g.id+' uses real vector content');
 const ids=new Set(g.nodes.map(n=>n.id));assert.equal(ids.size,g.nodes.length,'Unique node IDs');
 for(const edge of g.edges){assert(ids.has(edge.from)&&ids.has(edge.to),'Valid endpoints in '+g.id);assert(svg.includes(`data-from="${edge.from}" data-to="${edge.to}"`),'Delivered connection '+g.id);}
 const [x,y,w,h]=g.viewBox.split(' ').map(Number);
 for(const n of g.nodes)assert(n.x-n.w/2>=x&&n.x+n.w/2<=x+w&&n.y-n.h/2>=y&&n.y+n.h/2<=y+h,'Complete node fits viewport: '+g.id+'/'+n.id);
}
assert.equal(new Set(manifest.slides.filter(s=>s.number>=35&&s.number<=38).map(s=>s.sha256)).size,1,'Identical title-only wireframe originals are recorded as omitted');
console.log(`PASS ${manifest.slides.length} source decisions: ${expectedPresented.length} presented, ${referenceOnly.length} reference-only, ${omitted.length} owner omissions; ${originals} artwork hashes and ${graphs.length} complete SVG diagrams.`);
