// Approved Figma frame 2995:20025. Native structure; original illustration assets.
const fs=require('node:fs'),path=require('node:path');
const {esc}=require('./render-diagram.cjs');
const groups=[
 {title:'Garden Management',class:'management',branches:[
  {title:'Remote control',items:['Irrigation','Fan','Net/Shade','Lighting']},
  {title:'Automatic control',items:['Create schedules','Select schedules','Customize schedules']},
  {title:'Notifications',items:['Device status','Light intensity exceeds threshold'],note:'Set thresholds as basis for app notifications'},
  {title:'Monitoring',items:['Parameters','Air humidity','Soil moisture','Temperature','Light intensity']},
 ]},
 {title:'Store garden data',branches:[{title:'Track parameter',items:['Day','Week','Month','3 months','Year']},{title:'History',items:['Activity','Filter']}]},
 {title:'Garden Wiki',branches:[{title:'AI',items:['Plant type','Disease type']}]},
 // The owner's source explicitly uses this label for these two branches.
 {title:'Notifications',branches:[{title:'Add garden'},{title:'Add device'}]},
 {title:'Customer management',branches:[{title:'Account',items:['Package'],note:['Household business','Miniature landscape','Personal']},{title:'Login / Register',items:['Information']}]},
];
const list=items=>`<ul>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
const functionIntro='With two distinct personas requiring very different capabilities, I mapped out all necessary features into five core groups. This ensured no user need was overlooked and gave the team a shared understanding of the product scope before any design work began.';
function functionMap(){return `<p class="deck-function-intro">${functionIntro}</p><div class="deck-function-map">${groups.map(g=>`<article class="deck-function-tree ${g.class?'deck-function-tree--'+g.class:''}"><h4>${esc(g.title)}</h4><ul class="deck-function-branches">${g.branches.map(b=>`<li><h5>${esc(b.title)}</h5>${b.items?`<div class="deck-function-items">${list(b.items)}</div>`:''}${b.note?`<div class="deck-function-note">${Array.isArray(b.note)?list(b.note):esc(b.note)}</div>`:''}</li>`).join('')}</ul></article>`).join('')}</div>`;}

// Crops retain the image transforms from the original Figma sketch nodes.
const photos=[
 ['dashboard','Dashboard','f6bdc.png',289,360,.469155848,.998664916,.509780645,-.000667557],
 ['dashboard-alternatives','Dashboard · alternatives','f6bdc.png',238,278,.5,.998664916,.0015625,-.000667557],
 ['garden-list','Garden List','41785.png',155,360,.251574636,.998664916,.037330426,0],
 ['automation','Automation','3a501.png',290,360,.471139163,.998664916,.491432548,.00200267],
 ['garden-details','Detail of a Garden','6afb1.png',283,360,.459415585,.998664916,.040584415,0],
 ['scan','Scan and device entry','af5c6.png',175,197,.506250024,.973945498,0,0],
 ['sign-in','Sign in','ff0ff.png',84,199,.24807694554328918,1.0040054321289062,.7155888676643372,-.002002670429646969],
 ['password','Password','ff0ff.png',82,201,.24075979,1.004005432,.039062504,-.00200267],
 ['device-selection','Device selection','f0744.png',104,202,1,1,0,0],
 ['device-control','Device control','d4b57.png',223,236,.4749999940395355,.8598131537437439,.0015625000232830644,.0006675567710772157],
 ['plant-option-1','Plant information · option 1','257cc.png',131,218,.359375,.998664916,.641231,0],
 ['plant-option-2','Plant information · option 2','c7b39.png',102.13771,218,.279374987,1.004005432,.704953074,-.00200267],
];
function sketchSVG(p,dir){
 const dataURL=file=>{const mime=file.endsWith(".svg")?"image/svg+xml":"image/png";return "data:"+mime+";base64,"+fs.readFileSync(path.join(dir,file)).toString("base64");};
 const [id,title,file,w,h,a,b,c,d]=p;
 const ih=id==='plant-option-1'?213:id==='plant-option-2'?214:h;
 const strokes=id==='plant-option-1'?[['bde5c',96,208.25,3,5.25],['6d86c',99,209,.75,9],['143bf',99.75,209,2.25,4.5],['da50f',103.5,206,1.5,8.25],['09949',107.25,207.5,.75,6]]:id==='plant-option-2'?[['292a3',94.5,206,1.5,8.25],['810a9',99.0664,208.2227,3.0713,6.5568]]:[];
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title"><title id="title">${esc(title)} — original Greeny sketch</title><rect width="100%" height="100%" fill="white"/><svg width="${w}" height="${ih}" viewBox="0 0 ${w} ${ih}" overflow="hidden"><image href="${dataURL(file)}" x="${-c*w/a}" y="${-d*ih/b}" width="${w/a}" height="${ih/b}" preserveAspectRatio="none"/></svg>${strokes.map(([f,x,y,sw,sh])=>`<image href="${dataURL(f+".svg")}" x="${x}" y="${y}" width="${sw}" height="${sh}"/>`).join('')}</svg>`;
}
function sketches(web){
 const dir=path.join(__dirname,'references/sketches');
 const output=path.join(web,'img/sketches');
 fs.mkdirSync(output,{recursive:true});
 for(const p of photos)fs.writeFileSync(path.join(output,p[0]+'.svg'),sketchSVG(p,dir)+'\n');
 const tile=(id,extra='')=>{const p=photos.find(p=>p[0]===id);return `<figure class="deck-sketch ${extra}"><figcaption>${esc(p[1])}</figcaption><a href="img/sketches/${id}.svg" target="_blank" rel="noopener" aria-label="Open ${esc(p[1])} original sketch"><img src="img/sketches/${id}.svg" width="${p[3]}" height="${p[4]}" alt="${esc(p[1])} original Greeny sketch" loading="lazy"></a></figure>`;};
 return `<section class="section deck-reference-section" id="sketches" data-source-slide="46" aria-labelledby="sketches-title"><div class="wrap"><header class="deck-reference-heading"><h3 id="sketches-title">Sketches</h3></header><p class="deck-sketch-intro">Low-fidelity sketches allowed us to rapidly explore and validate screen layouts before committing to visual design. This step saved time by surfacing structural issues early, ensuring the interface logic was sound before moving into high-fidelity wireframes.</p><div class="deck-sketch-grid">${['dashboard','dashboard-alternatives','garden-list','automation','garden-details'].map(x=>tile(x)).join('')}<div class="deck-sketch deck-sketch-extra"><h4>Additional screens</h4><div>${['scan','sign-in','password','device-selection'].map(x=>tile(x,'deck-sketch-mini')).join('')}</div></div>${['device-control','plant-option-1','plant-option-2'].map(x=>tile(x,'deck-sketch-short')).join('')}</div></div></section>`;
}
function phone(kind){
 const spec={dashboard:['37099.png','0761c.png','5d6d4.svg','5bd89.svg'],scan:['bd097.png','307d5.png','f936f.svg','28dbe.svg'],plant:['daa61.png','307d5.png','2f796.svg','939f9.svg']}[kind];
 return `<div class="deck-interface-phone is-${kind}" aria-hidden="true"><img class="deck-phone-shadow" src="img/interface/${spec[2]}" alt="" loading="lazy"><div class="deck-phone-screen" style="--screen-mask:url('img/interface/${spec[3]}')"><img src="img/interface/${spec[0]}" alt="" loading="lazy"></div><img class="deck-phone-shell" src="img/interface/${spec[1]}" alt="" loading="lazy"></div>`;
}
function interfaces(){return `<article class="deck-interface-feature is-dashboard" data-source-slide="45" aria-labelledby="dashboard-feature-title"><div class="deck-interface-feature-copy"><h3 id="dashboard-feature-title" style="--title-paint:url('img/interface/ae13b.png')">Garden management</h3><p>View and manage your garden efficiently in the palm of your hand</p></div>${phone('dashboard')}</article><article class="deck-interface-feature is-ai" aria-labelledby="ai-feature-title"><div class="deck-interface-phone-pair">${phone('scan')}${phone('plant')}</div><div class="deck-interface-feature-copy"><h3 id="ai-feature-title" style="--title-paint:url('img/interface/048d6.png')">GREENY</h3><p>Identify plants &amp;<br>get useful care tips</p></div></article>`;}
function onboarding(data){return `<h3 class="deck-onboarding-title">Onboarding illustrations</h3><figure class="deck-onboarding-atlas"><a href="img/onboarding.png" target="_blank" rel="noopener" aria-label="Enlarge all five onboarding screens"><img src="img/onboarding.png" width="1200" height="648" alt="Five staggered Greeny onboarding screens, from introduction to AI Detection." loading="lazy"></a></figure><ol class="sr-only deck-onboarding-description" aria-label="Onboarding screen content">${data.onboarding.map(card=>`<li><strong>${esc(card.title)}</strong>${card.body?`: ${esc(card.body)}`:''}</li>`).join('')}</ol>`;}
function syncContents(page){
 let updated=page.replace(/(<div class="project-contents-group">)(?=<div class="project-contents-heading"><h3><a href="#brief">Introduction<\/a>)[\s\S]*?(?=<div class="project-contents-group">|<\/nav>)/,
 '<div class="project-contents-group"><div class="project-contents-heading"><h3><a href="#brief">Introduction</a></h3></div></div>')
 .replace('href="#function-ideations">Function Ideations</a>','href="#function-ideations">Function Ideation</a>')
 .replace(/(<li><a href="#user-flows">Task Flow<\/a><\/li>)(?!<li><a href="#sketches">)/,'$1<li><a href="#sketches">Sketches</a></li>');
 if(!updated.includes('href="#ecosystem"')){
  const context=[['ecosystem','Ecosystem - Greeny']].map(([id,label])=>`<div class="project-contents-group"><div class="project-contents-heading"><h3><a href="#${id}">${label}</a></h3></div></div>`).join('');
  updated=updated.replace('<div class="project-contents-group"><div class="project-contents-heading"><h3><a href="#brief">',match=>context+match);
 }
 return updated.replace(/<div class="project-contents-group"><div class="project-contents-heading"><h3><a href="#application">Application - Greeny<\/a><\/h3><\/div><\/div>/,'').replace('data-start="#brief"','data-start="#ecosystem"');
}
module.exports={groups,functionMap,sketches,interfaces,onboarding,syncContents};
