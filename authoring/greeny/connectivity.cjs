// Preserve the approved artwork while keeping paint servers in the same SVG.
// Safari can misresolve url(#...) inside an externally referenced <use> tree.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const source=fs.readFileSync(path.join(root,'projects/greeny/img/story/connectivity-icons.svg'),'utf8');
const definitions=new Map([...source.matchAll(/<(linearGradient|filter|clipPath|mask)\b[^>]*\bid="([^"]+)"[^>]*>[\s\S]*?<\/\1>/g)].map(([svg,,id])=>[id,svg]));
const fragments=markup=>[...markup.matchAll(/url\(#([^)]*)\)/g)].map(([,id])=>id);
function connectivityArt(name){
  const id={gateway:'cp-gateway',internet:'cp-internet',phone:'cp-phone'}[name];
  if(!id)throw new Error('Unknown connectivity artwork: '+name);
  const body=source.match(new RegExp('<symbol id="'+id+'"[^>]*>([\\s\\S]*?)</symbol>'))?.[1];
  if(!body)throw new Error('Missing connectivity symbol: '+id);
  const used=new Map(),pending=fragments(body);
  while(pending.length){
    const ref=pending.shift();if(used.has(ref))continue;
    const svg=definitions.get(ref);if(!svg)throw new Error('Missing connectivity paint definition: '+ref);
    used.set(ref,svg);pending.push(...fragments(svg));
  }
  let markup='<defs>'+[...used.values()].join('\n')+'</defs>'+body;
  for(const ref of used.keys()){
    const local='garden-'+name+'-'+ref;
    markup=markup.replaceAll('id="'+ref+'"','id="'+local+'"').replaceAll('url(#'+ref+')','url(#'+local+')');
  }
  return '<svg class="garden-connectivity-art" viewBox="0 0 180 180" aria-hidden="true" focusable="false" data-network-source="'+id+'">'+markup+'</svg>';
}
if(require.main===module){
  const file=path.join(root,'projects/greeny/index.html');
  let count=0;
  const html=fs.readFileSync(file,'utf8').replace(/(<figure class="garden-connectivity-node" data-network-node="(gateway|internet|phone)">)<svg\b[\s\S]*?<\/svg>/g,(_,figure,name)=>{count++;return figure+connectivityArt(name);});
  if(count!==3)throw new Error('Expected three existing connectivity illustrations, found '+count);
  fs.writeFileSync(file,html);
  console.log('Synchronized three self-contained network illustrations; original artwork and story unchanged.');
}
module.exports={connectivityArt};
