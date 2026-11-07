// Read-only source inventory: ensure 1–45 are complete and served artwork matches them.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'authoring/synergy/slides.json'),'utf8'));
const source=process.argv[2]?path.resolve(process.argv[2]):path.resolve(root,manifest.sourceDirectory);
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
const page=fs.readFileSync(path.join(root,'projects/synergy/index.html'),'utf8');
assert.deepEqual(manifest.slides.map(row=>row.slide),Array.from({length:45},(_,i)=>i+1),'Inventory must cover slides 1–45');
let originals=0,native=0;
for(const row of manifest.slides){
  const file=path.join(source,row.source);
  assert(fs.existsSync(file),'Missing source slide '+row.source);
  const digest=hash(fs.readFileSync(file));
  assert.equal(digest,row.sha256,'Source changed: '+row.source+'; review and refresh its web representation');
  if(row.asset){assert.equal(hash(fs.readFileSync(path.join(root,row.asset))),digest,'Web artwork differs from source '+row.source);assert(page.includes('img/'+path.basename(row.asset)),'Artwork missing from page: '+row.source);originals++;}
  else{assert(row.selector && row.presentation,'Unmapped source slide '+row.source);native++;}
}
console.log(`PASS all 45 source slides: ${originals} original artwork files match byte-for-byte; ${native} HTML content/title mappings.`);
