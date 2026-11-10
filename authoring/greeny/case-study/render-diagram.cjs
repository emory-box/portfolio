const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function port(node,side){return ({left:[node.x-node.w/2,node.y],right:[node.x+node.w/2,node.y],top:[node.x,node.y-node.h/2],bottom:[node.x,node.y+node.h/2]})[side];}
function route(g,edge){
 const a=g.nodes.find(n=>n.id===edge.from),b=g.nodes.find(n=>n.id===edge.to);
 if(!a||!b)throw new Error('Unknown endpoint in '+g.id);
 const vertical=Math.abs(b.y-a.y)>Math.abs(b.x-a.x);
 const start=port(a,edge.fromPort||(vertical?(b.y>a.y?'bottom':'top'):(b.x>a.x?'right':'left')));
 const end=port(b,edge.toPort||(vertical?(b.y>a.y?'top':'bottom'):(b.x>a.x?'left':'right')));
 const via=edge.via||((start[0]!==end[0]&&start[1]!==end[1])?[[((start[0]+end[0])/2),start[1]],[((start[0]+end[0])/2),end[1]]]:[]);
 return [start,...via,end].filter((p,i,list)=>!i||p[0]!==list[i-1][0]||p[1]!==list[i-1][1]);
}
function rounded(points){
 let d='M'+points[0].join(',');
 for(let i=1;i<points.length-1;i++){
  const [a,b,c]=[points[i-1],points[i],points[i+1]],before=Math.hypot(a[0]-b[0],a[1]-b[1]),after=Math.hypot(c[0]-b[0],c[1]-b[1]);
  const r=Math.min(18,before/2,after/2);
  if(!before||!after)continue;
  const p=[b[0]+(a[0]-b[0])*r/before,b[1]+(a[1]-b[1])*r/before],q=[b[0]+(c[0]-b[0])*r/after,b[1]+(c[1]-b[1])*r/after];
  d+=' L'+p.join(',')+' Q'+b.join(',')+' '+q.join(',');
 }
 return d+' L'+points.at(-1).join(',');
}
function node(g,n){
 const fill=n.accent?'#4A6425':'#333333',stroke=n.accent?'#8EBE50':'#48484A';
 let shape;
 if(n.type==='circle')shape=`<ellipse cx="${n.x}" cy="${n.y}" rx="${n.w/2}" ry="${n.h/2}"/>`;
 else if(n.type==='diamond')shape=`<path d="M${n.x},${n.y-n.h/2}L${n.x+n.w/2},${n.y}L${n.x},${n.y+n.h/2}L${n.x-n.w/2},${n.y}Z"/>`;
 else shape=`<rect x="${n.x-n.w/2}" y="${n.y-n.h/2}" width="${n.w}" height="${n.h}" rx="8"/>`;
 const font=n.h<=38?15.5:(n.w>130?20:18),lines=n.label.split('|'),step=font*1.3;
 const text=lines.map((line,i)=>`<tspan x="${n.x}" y="${n.y+(i-(lines.length-1)/2)*step}">${esc(line)}</tspan>`).join('');
 return `<g data-node="${esc(n.id)}" fill="${fill}" stroke="${stroke}" stroke-width="1.5">${shape}<text fill="#F8FBF4" stroke="none" text-anchor="middle" dominant-baseline="middle" font-size="${font}">${text}</text></g>`;
}
function svg(g){
 const edges=g.edges.map(e=>`<path data-from="${esc(e.from)}" data-to="${esc(e.to)}" d="${rounded(route(g,e))}" fill="none" stroke="#8EBE50" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#${g.id}-arrow)"/>`).join('');
 const labels=g.edges.filter(e=>e.label).map(e=>`<g><rect x="${e.lx-e.label.length*5.7-7}" y="${e.ly-14}" width="${e.label.length*11.4+14}" height="28" rx="5" fill="#191919"/><text x="${e.lx}" y="${e.ly}" text-anchor="middle" dominant-baseline="middle" fill="${e.label==='No'?'#E0352F':(['Manual','Smart','Weekly','Daily'].includes(e.label)?'#4CC1E2':'#AFD182')}" font-size="19">${esc(e.label)}</text></g>`).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" class="native-diagram" lang="en" xml:lang="en" style="background:#191919;color-scheme:dark" viewBox="${g.viewBox}" role="img" aria-labelledby="${g.id}-diagram-title ${g.id}-diagram-description"><title id="${g.id}-diagram-title">${esc(g.title)}</title><desc id="${g.id}-diagram-description">Source slide ${g.slide}. ${g.nodes.length} nodes; ${g.edges.length} connections. Branch labels and return paths are preserved.</desc><style>@font-face{font-family:Inter;src:url('../../../../assets/fonts/inter-latin.woff2') format('woff2');font-weight:100 900}text{font-family:Inter,Arial,sans-serif}</style><defs><marker id="${g.id}-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="#8EBE50" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>${edges}${g.nodes.map(n=>node(g,n)).join('')}${labels}</svg>`;
}
function transcript(g){
 return `<details class="deck-transcript"><summary>Đọc nội dung sơ đồ</summary><ol lang="en">${g.nodes.map(n=>{const next=g.edges.filter(e=>e.from===n.id).map(e=>(e.label?esc(e.label)+': ':'')+esc(g.nodes.find(x=>x.id===e.to).label.replaceAll('|',' ')));return `<li><strong>${esc(n.label.replaceAll('|',' '))}</strong>${next.length?' → '+next.join('; '):''}</li>`;}).join('')}</ol></details>`;
}
module.exports={svg,transcript,esc};
