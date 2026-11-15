// One persistent filled body changes shape. There are no fading butter layers.
export function createButterMorph(art) {
  const svg=art.querySelector('.home-butter-live');
  const edge=svg.querySelector('.home-butter-boundary'),body=svg.querySelector('.home-butter-body');
  const restGloss=svg.querySelector('.home-butter-gloss-rest'),openGloss=svg.querySelector('.home-butter-gloss-open');
  const count=96,targetWidth=Number(svg.dataset.targetWidth),targetHeight=Number(svg.dataset.targetHeight),halfStroke=Number(svg.dataset.targetStroke)/2;
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
  function offset(points,amount) {
    return points.map((p,i)=>{const a=points[(i+count-1)%count],b=points[(i+1)%count],dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy)||1;return{x:(p.x+dy/length*amount)*327.893/targetWidth,y:(p.y-dx/length*amount)*274.83/targetHeight};});
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
  const homeEdge=sample(edge),homeBody=align(sample(body),homeEdge);
  const target=sample(svg.querySelector('.home-butter-guide'));
  const targetEdge=align(offset(target,halfStroke),homeEdge),targetBody=align(offset(target,-halfStroke),targetEdge);
  const home={edge:curve(homeEdge),body:curve(homeBody),rest:'1',open:'0'};
  const expanded={edge:curve(targetEdge),body:curve(targetBody),rest:'0',open:'1'};
  const cssPath=path=>getComputedStyle(path).d||'path("'+path.getAttribute('d')+'")';
  function capture(){return{edge:cssPath(edge),body:cssPath(body),rest:getComputedStyle(restGloss).opacity,open:getComputedStyle(openGloss).opacity};}
  function apply(pose) {
    for(const [path,d]of [[edge,pose.edge],[body,pose.body]]){path.style.d='';path.setAttribute('d',d.slice(d.indexOf('"')+1,d.lastIndexOf('"')));}
    restGloss.style.opacity=pose.rest;openGloss.style.opacity=pose.open;
  }
  function morph(open,animate,duration) {
    const from=capture(),to=open?expanded:home;
    if(!CSS.supports('d',to.body)){apply(to);return[];}
    const timing={duration,easing:'cubic-bezier(.3,0,.7,1)'};
    return [animate(edge,[{d:from.edge},{d:to.edge}],timing),animate(body,[{d:from.body},{d:to.body}],timing),
      animate(restGloss,[{opacity:from.rest},{opacity:to.rest}],timing),animate(openGloss,[{opacity:from.open},{opacity:to.open}],timing)];
  }
  apply(home);art.classList.add('has-continuous-butter');
  return{finish:open=>apply(open?expanded:home),freeze:()=>apply(capture()),morph};
}
