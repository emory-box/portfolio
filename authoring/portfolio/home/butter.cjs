// Use the complete original Figma component. Only bind its existing butter paths
// to the live morph; paper, shadow and outlines stay in place.
const fs=require('node:fs'),path=require('node:path');
let component=fs.readFileSync(path.join(__dirname,'../../../assets/img/home/toast-component.svg'),'utf8');
const bind=(id,classes)=>{
  const original='id="'+id+'"';
  if(!component.includes(original))throw new Error('Missing original bread layer: '+id);
  component=component.replace(original,original+' class="'+classes+'"');
};
bind('Vector','home-toast-rest-part');
bind('Vector_2','home-toast-rest-part');
bind('Line / Editable stroke','home-toast-rest-part');
bind('Bread / Inner surface / Closed fill and stroke','home-toast-rest-part');
bind('Vector_3','home-butter-gloss-rest');
bind('stroke0_0_36','home-butter-guide');
bind('stroke2_0_36','home-butter-body');
component=component.replace(/(<g id="Butter \/ Closed fill and editable stroke">)([\s\S]*?)(<\/g>)/,(_,open,content,close)=>open+content.replace('<path ','<path class="home-butter-boundary" ')+close);
component=component.replace('<svg ','<svg class="home-toast-component home-butter-live" aria-hidden="true" ');
component=component.replace('<defs>','<defs><clipPath id="butter-sheen-clip"><use xlink:href="#stroke2_0_36"/></clipPath>');
component=component.replace('class="home-butter-gloss-rest"','class="home-butter-gloss-rest" clip-path="url(#butter-sheen-clip)"');
// These masks are opaque copies of their contours. Vector clips preserve the
// inside strokes without rasterizing alpha masks whenever the SVG repaints.
for(const id of ['stroke1_0_36','stroke3_0_36']){
  const mask=new RegExp('<mask id="'+id+'"[^>]*>([\\s\\S]*?)</mask>');
  if(!mask.test(component))throw new Error('Missing original bread mask: '+id);
  component=component.replace(mask,'<clipPath id="'+id+'">$1</clipPath>')
    .replace('mask="url(#'+id+')"','clip-path="url(#'+id+')"');
}
// Scope the original fragment references away from other inline Home artwork.
component=component.replace(/id="([^"]+)"/g,'id="home-toast-$1"').replace(/(href="#|url\(#)([^"\)]+)/g,'$1home-toast-$2');
module.exports=component;
