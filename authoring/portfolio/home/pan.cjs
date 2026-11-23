// Inline the original paths: older WebKit cannot resolve external fragment IDs
// containing spaces, leaving five pieces unavailable and the pan disabled.
const fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../../../assets/img/home/pan.svg'),'utf8');
const paths=new Map([...source.matchAll(/<path\b[^>]*\bid="([^"]+)"[^>]*\/>/g)].map(([svg,id])=>[id,svg.replace(/\s+id="[^"]+"/,'')]));
const parts=[
 ['Vector'],['Vector_2'],['Vector_3','egg'],['Line / Editable stroke'],
 ['Vector_4'],['Line / Editable stroke_2'],['Vector_5','egg yolk'],
 ['Vector_6'],['Line / Editable stroke_3','egg'],
 ['Line / Editable stroke_4','egg yolk'],['Line / Editable stroke_5'],
 ['Vector_7'],['Vector_8','egg yolk']
];
module.exports=`<svg class="home-pan-scene" width="252.721" height="223" viewBox="0 0 252.721 223" fill="none" aria-hidden="true" focusable="false"><g class="home-pan-tool"><ellipse class="home-pan-well" cx="108" cy="129" rx="51" ry="52" fill="#F8F8F8" opacity="0"/>${parts.map(([id,kind=''])=>{
  const svg=paths.get(id);if(!svg)throw new Error('Missing original pan path: '+id);
  return `<g data-source-pan-part="${id}"${kind.includes('egg')?` class="home-pan-egg${kind.includes('yolk')?' home-pan-yolk':''}"`:''}>${svg}</g>`;
}).join('')}</g></svg>`;
