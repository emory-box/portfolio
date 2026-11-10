// The owner's uploaded opening-layout.svg governs only the opening case-study sections.
const fs=require('node:fs'),path=require('node:path');
module.exports=function opening({data,esc,logo,crop,sourceAttr}){
 const glyph=name=>fs.readFileSync(path.join(__dirname,'references',name+'.svg'),'utf8');
 const heading=(chapter,title,id)=>{const tag=['brand-safezone','personas'].includes(id)?'h3':'h2';const subtitleId={brief:'about-us',branding:'logo-meaning',research:'user-segmentation'}[id]||`${id}-subtitle`;return `<header class="deck-reference-heading">${chapter?`<h2 class="deck-reference-chapter" id="${id}-title" lang="en">${chapter}</h2><h3 id="${subtitleId}" lang="en">${title}</h3>`:`<${tag} id="${id}-title" lang="en">${title}</${tag}>`}</header>`;};
 const list=items=>`<ul>${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`;
 const introduction=`<section class="section deck-reference-section" id="brief" lang="en" ${sourceAttr(5)} aria-labelledby="brief-title">
 <div class="wrap">
 ${heading('Introduction','About us','brief')}
 <span id="system" class="deck-anchor" aria-hidden="true"></span>
 <div class="deck-reference-about">
  <div class="deck-reference-identity">${logo()}<p class="deck-wordmark">GREENY</p></div>
  <div>${data.about.map(copy=>`<p>${esc(copy)}</p>`).join('')}</div>
 </div>
 </div></section>`;

 const branding=`<section class="section deck-reference-section" id="branding" lang="en" ${sourceAttr(8)} aria-labelledby="branding-title">
 <div class="wrap">
 ${heading('Logo','Meaning','branding')}
 <div id="brand" class="deck-reference-meaning" ${sourceAttr(9)}>
 <p class="deck-reference-meaning-lead">Greeny's logo is a sophisticated blend of three main elements, each carrying a special meaning:</p>
 <div class="deck-reference-anatomy">
  <svg class="deck-reference-wires" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M205 120H410M565 120H720M400 245V385H240"/></svg>
  <div class="deck-reference-letter">${glyph('letter')}<p>The first letter of the brand name.</p></div>
  <div class="deck-reference-mark">${logo()}</div>
  <div class="deck-reference-leaf">${glyph('sprout')}<p>Seedling: This represents the growth and vitality of the garden.</p></div>
  <div class="deck-reference-fingerprint">${glyph('fingerprint')}<p>Fingerprint: A fingerprint is unique to each individual, just as our personalized solutions are tailored to the specific needs of our customers.</p></div>
  <p class="deck-reference-promise">Greeny offers smart, personalized, and modern management and monitoring solutions to ensure the lush growth of your garden.</p>
 </div>
 </div></div></section>
 <section class="section deck-reference-safezone" id="brand-safezone" lang="en" aria-labelledby="brand-safezone-title"><div class="wrap">
 ${heading('','Safezone &amp; Grid','brand-safezone')}
 <div class="deck-reference-safezone-content">
  <div class="deck-logo-rule" ${sourceAttr(10)}><div class="deck-logo-construction" role="img" aria-label="Greeny logo construction grid, 6a wide and 7a high, with 1a units">${logo('deck-grid-mark')}<strong>GREENY</strong><span class="deck-grid-width" aria-hidden="true">6a</span><span class="deck-grid-height" aria-hidden="true">7a</span><span class="deck-grid-unit" aria-hidden="true">1a</span></div><p>The grid logo helps to determine the proportions and arrangement of elements in the logo, including icons and text, to ensure balance and consistency.</p></div>
  <div class="deck-logo-rule" ${sourceAttr(11)}><div class="deck-safezone" role="img" aria-label="Clear space around the Greeny logo">${logo('deck-safe-mark')}<strong>GREENY</strong>${['tl','tr','bl','br'].map(pos=>logo('deck-safe-corner '+pos)).join('')}</div><p>The safezone for the logo must be carefully defined to ensure that the logo is displayed clearly, professionally, and is easily recognizable on all backgrounds and in any usage context.</p></div>
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
  <div><h5>Pain Points</h5>${list(p.difficulties)}<h5>Needs</h5>${list(p.needs)}</div>
  <div class="deck-persona-motivation"><h5>Motivations</h5><p>${esc(p.motivation)}</p></div>
 </article>`).join('')}</div>
 </div></section>`;
 return {introduction,branding,research,personas};
};
