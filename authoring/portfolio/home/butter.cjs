// The original bread stays intact; only its butter changes contour.
const fs=require('node:fs'),path=require('node:path');
const read=name=>fs.readFileSync(path.join(__dirname,'../../../assets/img/home/',name),'utf8');
const d=tag=>tag.match(/\bd="([^"]+)"/)[1];
const outline=read('toast-butter-outline.svg').match(/<path\b[^>]+>/)[0];
const [outer,inner]=d(outline).split(/(?=M)/).filter(Boolean);
const surface=read('toast-inner-outline.svg');
const guide=surface.match(/<path\b[^>]+>/)[0];
const width=+surface.match(/<svg\b[^>]*\bwidth="([^"]+)"/)[1];
const height=+surface.match(/<svg\b[^>]*\bheight="([^"]+)"/)[1];
const stroke=+guide.match(/stroke-width="([^"]+)"/)[1];
const gloss=d(read('toast-butter-highlight.svg').match(/<path\b[^>]+>/)[0]);
// These percentages are the original .home-toast-inner-outline source slot.
// Sampling that same contour lets the butter fill the existing bread instead
// of introducing a different illustration at the end of the zoom.
module.exports=`<svg class="home-butter-live" data-target-width="${width}" data-target-height="${height}" data-target-stroke="${stroke}" data-target-left="27.675" data-target-top="19.0563" data-target-width-percent="40.9975" data-target-height-percent="44.2786" viewBox="0 0 327.893 274.83" preserveAspectRatio="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path class="home-butter-boundary" d="${outer}" fill="#464544"/><defs><clipPath id="home-butter-clip"><use href="#home-butter-body"/></clipPath></defs><path id="home-butter-body" class="home-butter-body" d="${inner}" fill="#F8C73A"/><g clip-path="url(#home-butter-clip)"><g class="home-butter-gloss-rest" transform="translate(31.2105 67.2438)"><path d="${gloss}" fill="#F8F8F8"/></g><g class="home-butter-gloss-open" opacity="0"></g></g><path class="home-butter-guide" d="${d(guide)}Z" visibility="hidden"/></svg>`;
