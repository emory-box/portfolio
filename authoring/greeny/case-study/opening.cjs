// Current Figma opening sections; artwork provenance is in references/figma-assets.json.
module.exports=function opening({data,esc,logo,crop,sourceAttr}){
 const artwork=(id,cls)=>{const label=id==='logo-grid'?'Greeny logo construction grid':'Greeny logo clear space';return `<figure class="deck-brand-artwork ${cls}" data-source-figma="2995:20111"><a href="img/brand/${id}-vector.svg" target="_blank" rel="noopener" aria-label="Open ${label}"><img src="img/brand/${id}-vector.svg" width="240" height="300" alt="${label}" loading="lazy"></a></figure>`;};
 const heading=(chapter,title,id)=>{const tag=['brand-safezone','personas'].includes(id)?'h3':'h2';const subtitleId={brief:'about-us',branding:'logo-meaning',research:'user-segmentation'}[id]||`${id}-subtitle`;return `<header class="deck-reference-heading">${chapter?`<h2 class="deck-reference-chapter" id="${id}-title" lang="en">${chapter}</h2><h3 id="${subtitleId}" lang="en">${title}</h3>`:`<${tag} id="${id}-title" lang="en">${title}</${tag}>`}</header>`;};
 const list=items=>`<ul>${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`;
 const ecosystem=`<section class="section deck-reference-section deck-context" id="ecosystem" lang="en" data-source-figma="2995:20035" aria-labelledby="ecosystem-title"><div class="wrap"><header class="deck-context-heading"><h2 id="ecosystem-title">ECOSYSTEM - GREENY</h2></header><div class="deck-ecosystem-cards"><article><h3>Protocol</h3><p><strong>Actuators</strong> (Sprinkler, Fan, Lighting, and Net/Shade Cover) and <strong>Sensors</strong> (Integrated Sensors), <strong>communicate</strong> with each other through a <strong>Wi-Fi Mesh protocol</strong>.</p></article><article><h3>Advantage</h3><p>Each device <strong>connects</strong> directly to <strong>neighboring nodes</strong> within the mesh, creating a <strong>self-healing</strong>, <strong>decentralized network</strong> across the entire garden area.</p></article><article><h3>Scalability</h3><p>One Model, Any Garden Size</p></article></div></div></section>`;
 const introduction=`<section class="section deck-reference-section deck-chapter-transition" id="brief" lang="en" ${sourceAttr(5)} aria-labelledby="brief-title"><div class="wrap"><span id="system" class="deck-anchor" aria-hidden="true"></span><header class="deck-reference-heading"><h2 class="deck-reference-chapter" id="brief-title">Research and Design process of <span>Greeny</span> application</h2></header></div></section>`;

 const branding=`<section class="section deck-reference-section" id="branding" lang="en" ${sourceAttr(8)} aria-labelledby="branding-title">
 <div class="wrap">
 ${heading('Logo','Meaning','branding')}
 <div id="brand" class="deck-reference-meaning" ${sourceAttr(9)}>
 <p class="deck-reference-meaning-lead">Greeny's logo is a sophisticated blend of three main elements, each carrying a special meaning:</p>
 <div class="deck-reference-anatomy">
  <img class="deck-reference-wires" src="img/meaning/c204a.svg" width="1200" height="515.281" alt="" aria-hidden="true">
  <div class="deck-reference-letter"><img src="img/meaning/a0a25.svg" width="80" height="104" alt="The letter G"><p>The first letter of the brand name.</p></div>
  <div class="deck-reference-mark"><span class="deck-logo deck-original-meaning-mark" role="img" aria-label="Greeny logo"><img src="img/meaning/99a3c.svg" width="224" height="259.703" alt=""></span></div>
  <div class="deck-reference-leaf"><img src="img/meaning/c175e.svg" width="64" height="96" alt="Seedling"><p>Seedling: This represents the growth and vitality of the garden.</p></div>
  <div class="deck-reference-fingerprint"><img src="img/meaning/68731.svg" width="96" height="96" alt="Fingerprint"><p>Fingerprint: A fingerprint is unique to each individual, just as our personalized solutions are tailored to the specific needs of our customers.</p></div>
  <p class="deck-reference-promise">Greeny offers smart, personalized, and modern management and monitoring solutions to ensure the lush growth of your garden.</p>
 </div><p class="deck-reference-closing">Greeny offers smart, personalized, and modern management and monitoring solutions to ensure the lush growth of your garden.</p>
 </div></div></section>
 <section class="section deck-reference-safezone" id="brand-safezone" lang="en" aria-labelledby="brand-safezone-title"><div class="wrap">
 ${heading('','Safezone &amp; Grid','brand-safezone')}
 <div class="deck-reference-safezone-content">
  <div class="deck-logo-rule" ${sourceAttr(10)}>${artwork('logo-grid','deck-logo-construction')}<p>The grid logo helps to determine the proportions and arrangement of elements in the logo, including icons and text, to ensure balance and consistency.</p></div>
  <div class="deck-logo-rule" ${sourceAttr(11)}>${artwork('logo-safezone','deck-safezone')}<p>The safezone for the logo must be carefully defined to ensure that the logo is displayed clearly, professionally, and is easily recognizable on all backgrounds and in any usage context.</p></div>
 </div></div></section>`;

 const research=`<section class="section deck-reference-section" id="research" lang="en" ${sourceAttr(12)} aria-labelledby="research-title"><div class="wrap">
 ${heading('User Research','User segmentation','research')}
 <div id="segmentation" class="deck-reference-segmentation" ${sourceAttr(13)}>
  <div>${data.segments.map(([title,copy])=>`<article><h4>${esc(title)}</h4><p>${esc(copy)}</p></article>`).join('')}</div>
  ${crop(13,[1329,210,501,750],'Gardener tending plants')}
 </div></div></section>`;

 const personas=`<section class="section deck-reference-section deck-reference-personas" id="personas" aria-labelledby="personas-title"><div class="wrap">
 ${heading('','User Personas','personas')}
 <span id="problem" class="deck-anchor" aria-hidden="true"></span>
 <div class="deck-personas">${data.personas.filter(p=>[14,15].includes(p.slide)).map(p=>`<article class="deck-persona" lang="en" ${sourceAttr(p.slide)}>
  <aside><div class="deck-persona-photo">${crop(p.slide,[p.crop[0]+24,p.crop[1]+24,p.crop[2]-48,p.crop[3]-48],p.name)}</div><h4 class="deck-persona-name">${esc(p.name)}</h4><dl><div><dt>Age</dt><dd>${p.age}</dd></div><div><dt>Occupation</dt><dd>${esc(p.job)}</dd></div><div><dt>Resident</dt><dd>${esc(p.location)}</dd></div></dl></aside>
  <div><h5>About</h5><p>${esc(p.introduction)}</p></div>
  <div><h5>Pain Points</h5>${list(p.difficulties)}</div>
  <div><h5>Needs</h5>${list(p.needs)}</div>
  <div class="deck-persona-motivation"><h5>Motivations</h5><p>${esc(p.motivation)}</p></div>
 </article>`).join('')}</div>
 </div></section>`;
 return {ecosystem,introduction,branding,research,personas};
};
