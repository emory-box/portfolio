// Morphs the one original paper, tab and binding; never fades a replacement sheet.
export function createNoteArtwork(art) {
  const tracks=[];
  function add(selector,properties) {
    for(const element of art.querySelectorAll(selector))tracks.push({element,properties});
  }
  const box={left:'x',top:'y',width:'x',height:'y'};
  add('.home-note-face,.home-note-shadow,.home-note-tab',{...box,borderWidth:'borderTopWidth',borderRadius:'borderTopLeftRadius'});
  add('.home-note-holes',{...box,gap:'gap'});
  add('.home-note-holes img',{width:'width',height:'height'});
  add('.home-note-rules',{...box,gap:'gap',opacity:'opacity'});
  add('.home-note-rules > span',{height:'height'});
  function capture() {
    const rootStyle=getComputedStyle(art),bounds={width:parseFloat(rootStyle.width),height:parseFloat(rootStyle.height)};
    const scale=bounds.width/Number(art.dataset.artWidth);
    return tracks.map(({element,properties})=>{
      const style=getComputedStyle(element),pose={};
      for(const [property,kind]of Object.entries(properties)) {
        const value=parseFloat(style[kind==='x'||kind==='y'?property:kind])||0;
        pose[property]=kind==='opacity'?String(value):kind==='x'||kind==='y'?value/(kind==='x'?bounds.width:bounds.height)*100+'%':value/scale+'px';
      }
      return pose;
    });
  }
  function apply(pose) { tracks.forEach(({element},i)=>Object.assign(element.style,pose[i])); }
  function clear() { for(const {element,properties}of tracks)for(const property of Object.keys(properties))element.style[property]=''; }
  function morph(from,to,animate,duration) {
    return tracks.map(({element},i)=>animate(element,[from[i],to[i]],{duration,easing:'cubic-bezier(.3,0,.7,1)'}));
  }
  return {capture,apply,clear,morph};
}
