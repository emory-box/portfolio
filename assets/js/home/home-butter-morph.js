// One persistent filled body changes shape. There are no fading butter layers.
export function createButterMorph(art) {
  const svg=art.querySelector('.home-butter-live');
  const edge=svg.querySelector('.home-butter-boundary'),body=svg.querySelector('.home-butter-body');
  const restGloss=svg.querySelector('.home-butter-gloss-rest'),openGloss=svg.querySelector('.home-butter-gloss-open');
  const count=96;
  function sample(path,sx=1,sy=1) {
    const length=path.getTotalLength();
    const points=Array.from({length:count},(_,i)=>{const p=path.getPointAtLength(length*i/count);return{x:p.x*sx,y:p.y*sy};});
    const area=points.reduce((sum,p,i)=>{const q=points[(i+1)%count];return sum+p.x*q.y-q.x*p.y;},0);
    return area<0?points.reverse():points;
  }
  function align(points,reference) {
    let best=0,distance=Infinity;
    for(let offset=0;offset<count;offset++){
      let score=0;for(let i=0;i<count;i++){const p=points[(i+offset)%count],q=reference[i];score+=(p.x-q.x)**2+(p.y-q.y)**2;}
      if(score<distance){distance=score;best=offset;}
    }
    return points.map((_,i)=>points[(i+best)%count]);
  }
  function curve(points) {
    const number=n=>Number(n.toFixed(4)),point=p=>number(p.x)+' '+number(p.y);
    let d='M'+point(points[0]);
    for(let i=0;i<count;i++){
      const a=points[(i+count-1)%count],b=points[i],c=points[(i+1)%count],e=points[(i+2)%count];
      d+='C'+point({x:b.x+(c.x-a.x)/6,y:b.y+(c.y-a.y)/6})+' '+point({x:c.x-(e.x-b.x)/6,y:c.y-(e.y-b.y)/6})+' '+point(c);
    }
    return 'path("'+d+'Z")';
  }
  const homeEdge=sample(edge);
  const homeContour=curve(homeEdge),expandedContour=curve(align(sample(svg.querySelector('.home-butter-guide')),homeEdge));
  // The source's fill and masked inside stroke share the same original contour.
  const home={edge:homeContour,body:homeContour,rest:'1',open:'0'};
  const expanded={edge:expandedContour,body:expandedContour,rest:'0',open:'1'};
  const cssPath=path=>getComputedStyle(path).d||'path("'+path.getAttribute('d')+'")';
  function capture(){return{edge:cssPath(edge),body:cssPath(body),rest:getComputedStyle(restGloss).opacity,open:getComputedStyle(openGloss).opacity};}
  function apply(pose) {
    for(const [path,d]of [[edge,pose.edge],[body,pose.body]]){path.style.d='';path.setAttribute('d',d.slice(d.indexOf('"')+1,d.lastIndexOf('"')));}
    restGloss.style.opacity=pose.rest;openGloss.style.opacity=pose.open;
  }
  function morphAttributes(from,to,animate,timing) {
    // Attribute updates refresh the component's referenced fill and mask too.
    // CSS d is unsupported in WebKit and leaves Chrome's <use> paint stale.
    const number=/-?\d*\.?\d+(?:e[-+]?\d+)?/gi;
    const contours=[[edge,from.edge,to.edge],[body,from.body,to.body]].map(([path,start,end])=>{
      const raw=value=>value.slice(value.indexOf('"')+1,value.lastIndexOf('"'));
      const a=raw(start).match(number).map(Number),b=raw(end).match(number).map(Number);
      return{path,a,b,parts:raw(end).split(number),end:raw(end)};
    });
    const motion=animate(svg,[{},{}],timing);
    let frame=0;
    function tick() {
      if(motion.playState==='idle')return;
      const progress=motion.effect.getComputedTiming().progress;
      if(progress!==null)for(const {path,a,b,parts}of contours){
        path.setAttribute('d',parts.map((part,i)=>part+(i<a.length?Number((a[i]+(b[i]-a[i])*progress).toFixed(4)):'')).join(''));
      }
      if(motion.playState!=='finished')frame=requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);
    motion.finished.then(()=>{
      cancelAnimationFrame(frame);
      for(const {path,end}of contours)path.setAttribute('d',end);
    },()=>cancelAnimationFrame(frame));
    return motion;
  }
  function morph(open,animate,duration) {
    const from=capture(),to=open?expanded:home;
    const timing={duration,easing:'cubic-bezier(.3,0,.7,1)'};
    return [morphAttributes(from,to,animate,timing),
      animate(restGloss,[{opacity:from.rest},{opacity:to.rest}],timing),animate(openGloss,[{opacity:from.open},{opacity:to.open}],timing)];
  }
  apply(home);
  return{finish:open=>apply(open?expanded:home),freeze:()=>apply(capture()),morph};
}
