// Inline motion geometry comes from the supplied SVGs; originals stay untouched.
const fs=require('node:fs'),path=require('node:path');
const read=name=>fs.readFileSync(path.join(__dirname,'../../../assets/img/home/',name),'utf8');
const d=tag=>tag.match(/\bd="([^"]+)"/)[1];
const outline=read('toast-butter-outline.svg').match(/<path\b[^>]+>/)[0];
const [outer,inner]=d(outline).split(/(?=M)/).filter(Boolean);
const spreadSource=read('toast-butter-spread.svg');
const spread=spreadSource.match(/<path\b[^>]+>/g);
const targetWidth=+spreadSource.match(/<svg\b[^>]*\bwidth="([^"]+)"/)[1];
const targetHeight=+spreadSource.match(/<svg\b[^>]*\bheight="([^"]+)"/)[1];
const gloss=d(read('toast-butter-highlight.svg').match(/<path\b[^>]+>/)[0]);
const highlights=spread.slice(1).map(tag=>tag.replace(/\s+id="[^"]*"/g,'')).join('');
module.exports=`<svg class="home-butter-live" data-target-width="${targetWidth}" data-target-height="${targetHeight}" data-target-stroke="2" viewBox="0 0 327.893 274.83" preserveAspectRatio="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path class="home-butter-boundary" d="${outer}" fill="#464544"/><defs><clipPath id="home-butter-clip"><use href="#home-butter-body"/></clipPath></defs><path id="home-butter-body" class="home-butter-body" d="${inner}" fill="#F8C73A"/><g clip-path="url(#home-butter-clip)"><g class="home-butter-gloss-rest" transform="translate(31.2105 67.2438)"><path d="${gloss}" fill="#F8F8F8"/></g><g class="home-butter-gloss-open" transform="scale(${327.893/targetWidth} ${274.83/targetHeight})" opacity="0">${highlights}</g></g><path class="home-butter-guide" d="${d(spread[0])}" visibility="hidden"/></svg>`;
