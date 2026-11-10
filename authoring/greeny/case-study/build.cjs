// Static authoring entrypoint. The delivered website has no build/runtime dependency.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const data=require('./content.cjs'),diagrams=require('./diagrams.cjs'),render=require('./render-diagram.cjs');
const {esc}=render,root=path.resolve(__dirname,'../../..'),web=path.join(root,'projects/greeny');
const raw=process.argv[2]||'D:/Web-portfolio/Raw/Greeny';
const sources=fs.readdirSync(raw).map(file=>({file,number:Number(file.match(/^Slide 16_9 -\s*(\d+(?:\.\d+)?)\.jpg$/)?.[1])})).filter(s=>(s.number>=5&&s.number<=49)||s.number===52).sort((a,b)=>a.number-b.number);
const assetSlides=[7,13,14,15,28,39,45,52];
fs.mkdirSync(path.join(web,'img/case-study'),{recursive:true});fs.mkdirSync(path.join(web,'img/diagrams'),{recursive:true});
for(const n of assetSlides){const row=sources.find(s=>s.number===n);if(!row)throw new Error('Missing source '+n);fs.copyFileSync(path.join(raw,row.file),path.join(web,'img/case-study/source-'+n+'.jpg'));}
const sourceAttr=n=>`data-source-slide="${n}"`;
const extraIcons={
 thermometer:'<path d="M9 15V5a3 3 0 0 1 6 0v10a5 5 0 1 1-6 0Z"/><path d="M12 7v11"/><circle cx="12" cy="18" r="1.5"/>',
 ruler:'<rect x="7" y="2" width="10" height="20" rx="1"/><path d="M7 6h4M7 10h3M7 14h4M7 18h3"/>',
 actuator:'<rect x="6" y="6" width="12" height="12" rx="1"/><rect x="9" y="9" width="6" height="6"/><path d="M8 2v4m4-4v4m4-4v4M8 18v4m4-4v4m4-4v4M2 8h4m-4 4h4m-4 4h4m12-8h4m-4 4h4m-4 4h4"/>',
 sensor:'<path d="M2 12h4l3-9 5 18 3-9h5"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M10 8a2 2 0 1 1 3 2c-1 .6-1 1-1 3m0 3v.1"/>',
 history:'<path d="M4 6v5h5M4 10a8 8 0 1 1 1 8"/><path d="M12 6v6l4 2"/>',
 on:'<path d="M12 3a9 9 0 0 0-9 9v6m9-11a5 5 0 0 0-5 5v8m5-9a1 1 0 0 0-1 1v10m5-13v10m4-9v6M7 4a9 9 0 0 1 14 8"/>'
};
const icon=(name,cls='')=>`<svg viewBox="0 0 24 24" class="deck-icon ${cls}" aria-hidden="true" focusable="false">${extraIcons[name]||`<use href="#i-${name}"/>`}</svg>`;
const list=items=>`<ul>${items.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`;
const paragraphs=items=>items.map(s=>`<p>${esc(s)}</p>`).join('');
const logo=(cls='')=>`<span class="deck-logo ${cls}" role="img" aria-label="Greeny logo"></span>`;
function crop(slide,box,alt,cls=''){
 return `<svg class="deck-crop ${cls}" viewBox="${box.join(' ')}" role="img" aria-label="${esc(alt)}"><image href="img/case-study/source-${slide}.jpg" width="1920" height="1080"/></svg>`;
}
function diagram(g){
 const svg=render.svg(g);fs.writeFileSync(path.join(web,'img/diagrams',g.id+'.svg'),svg+'\n');
 return `<figure class="deck-diagram" data-diagram="${g.id}"><a class="deck-diagram-link" lang="en" href="img/diagrams/${g.id}.svg" target="_blank" rel="noopener" aria-label="Open ${esc(g.title)} full diagram (new tab)">${svg.replace(/<style>[\s\S]*?<\/style>/,'')}</a><figcaption lang="en">${esc(g.title)}</figcaption>${render.transcript(g)}</figure>`;
}
const {introduction,branding,research,personas}=require('./opening.cjs')({data,esc,logo,crop,icon,sourceAttr});
const {experience,sitemap,flows,system,typography,icons,components}=require('./experience.cjs')({diagram,crop,icon});
const interfaceReference=require('./references/interface-layout.json');
const interfacePanel=([n,label])=>{const panel=interfaceReference.panels.find(p=>p.slide===n);if(!panel)throw new Error('Missing interface reference panel '+n);return `<figure class="deck-interface-panel" ${n===52?'id="advertising" ':''}${sourceAttr(n)} style="--panel-ratio:${panel.ratio}">${n===52?'<span id="notes" class="deck-anchor" aria-hidden="true"></span>':''}<a href="img/case-study/source-${n}.jpg" target="_blank" rel="noopener" aria-label="Open ${esc(label)} full image in a new tab"><img src="img/case-study/source-${n}.jpg" alt="${esc(label)}" width="1920" height="1080" loading="lazy" decoding="async"></a></figure>`;};
const interfaces=`<section class="section deck-reference-section deck-interface" id="interface" lang="en" ${sourceAttr(34)} aria-labelledby="interface-title"><div class="wrap"><header class="deck-reference-heading"><h2 id="interface-title">User Interface</h2></header></div><span id="wireframe" class="deck-anchor" aria-hidden="true"></span><div class="deck-interface-gallery" id="app-design">${[...data.mockups,data.advertising].map(interfacePanel).join('')}</div></section>`;
const body=`<div class="greeny-case-study" lang="vi">\n${[introduction,branding,research,personas,experience,sitemap,flows,system,typography,icons,components,interfaces].join('\n')}\n</div>\n`;
const accessibleBody=body.replace(/<h([34])([^>]*)>([^<]+)<\/h\1>/g,(tag,level,attrs,text)=>{
 if(!/lang=/.test(attrs)&&(/^(Introduction - |Branding - |User Experience - |User research - |Interface - )/.test(text)||['UI','Colors','Control','Environment','Others'].includes(text)))return '<h'+level+attrs+' lang="en">'+text+'</h'+level+'>';
 return tag;
});
const pageFile=path.join(web,'index.html'),page=fs.readFileSync(pageFile,'utf8'),start=page.indexOf('<div class="greeny-case-study"'),end=page.indexOf('</main>',start);
if(start<0||end<0)throw new Error('Case-study boundary not found');
const credits=page.slice(start,end).match(/<!-- project-credits:start -->[\s\S]*?<!-- project-credits:end -->/)?.[0]||'';
let updated=page.slice(0,start)+require('./chapter-layout.cjs')(accessibleBody)+(credits?credits+'\n':'')+page.slice(end);
if(!updated.includes('href="case-study.css"'))updated=updated.replace('<link rel="stylesheet" href="garden-story.css">','<link rel="stylesheet" href="garden-story.css">\n<link rel="stylesheet" href="case-study.css">');
if(!updated.includes('src="case-study.js"'))updated=updated.replace('<script src="../../assets/js/site.js" defer>', '<script src="case-study.js" defer></script>\n<script src="../../assets/js/site.js" defer>');
updated=updated.replace('Every interface element here is live markup. Garden photography comes from the original case-study materials.','Research, diagrams and interface components are rebuilt in HTML, CSS and SVG. Mockups and photography come from the original case-study materials.');
fs.writeFileSync(pageFile,updated);
const nativeSelectors={5:'#brief',7:'#components',8:'#branding',9:'#brand',11:'#brand-safezone',12:'#research',13:'#segmentation',14:'#personas',15:'#personas',16:'#personas',17:'#function-ideation',18:'#function-ideation',19:'#experience',20:'#sitemap',21:'#ui',22:'#typography',23:'#components',24:'#components',25:'#components',26:'#components',27:'#icons',28:'#components',29:'#user-flows',30:'#user-flows',31:'#user-flows',32:'#user-flows',33.1:'#user-flows',33.2:'#user-flows',34:'#interface',35:'#wireframe',36:'#wireframe',37:'#wireframe',38:'#wireframe',48:'#advertising',49:'#notes'};
nativeSelectors[10]='#brand-safezone';
nativeSelectors[52]='#advertising';
const manifest={
 sourceDirectory:raw,
 openingReference:{file:'references/opening-layout.svg',...require('./references/opening-layout.json')},
 experienceReference:{file:'references/experience-layout.svg',...require('./references/experience-layout.json')},
 experienceAssets:require('./references/experience-assets.json'),
 interfaceReference:{file:'references/interface-layout.png',...interfaceReference},
 presentationOrder:[5,8,9,10,11,12,13,14,15,19,17,18,20,29,31,30,33.1,32,33.2,21,22,27,23,25,24,26,28,34,45,39,52],
 slides:sources.map(s=>{
  const omitted=[6,16,35,36,37,38,40,41,42,43,44,46,47,48,49].includes(s.number),referenceOnly=s.number===7;
  return {
   ...s,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(raw,s.file))).digest('hex'),
   status:omitted?'omitted':referenceOnly?'reference-only':'presented',
   selector:omitted?null:nativeSelectors[s.number]||`#interface [data-source-slide="${s.number}"]`,
   ...(assetSlides.includes(s.number)?{asset:`projects/greeny/img/case-study/source-${s.number}.jpg`}:{}),
   presentation:omitted?(s.number===6?'Owner omitted product ecosystem':s.number===16?'Owner retained only Duc Phu and Phuong Lan; Trung Khang omitted':[41,42].includes(s.number)?'Owner removed the device-control/schedule and plant-identification/care collages':'Owner-approved interface reference replaces duplicate/mockup material and Advertising/Poster dividers'):referenceOnly?'Introduction overview omitted; sensor illustration remains as UI explanation in Components':s.number>=39?'Original artwork in the approved three-panel User Interface sequence':assetSlides.includes(s.number)?'Native content with cropped original photographic/illustration artwork':'Rebuilt native HTML or SVG'
  };
 })
};
fs.writeFileSync(path.join(__dirname,'slides.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Built native case study from ${sources.length} slides, ${diagrams.length} SVG diagrams and ${assetSlides.length} original artwork resources.`);
