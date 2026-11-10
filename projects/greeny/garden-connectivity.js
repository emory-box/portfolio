// Layout the approved 2D network around the real projected Hub. Rendering and
// the shared pause-aware clock remain owned by garden-story.js.
const NS='http://www.w3.org/2000/svg';
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
export function createGardenConnectivity(story) {
  const step=story.querySelector('#garden-connect');
  const board=step.querySelector('.garden-connectivity');
  const grid=board.querySelector('.garden-connectivity-nodes');
  const view=story.querySelector('.garden-view');
  const svg=story.querySelector('.garden-connectivity-wires');
  function node(tag,attrs,parent=svg) {
    const el=document.createElementNS(NS,tag);
    for(const [key,value] of Object.entries(attrs))el.setAttribute(key,value);
    parent.append(el);return el;
  }
  const defs=node('defs',{});
  for(const [id,cls] of [['garden-network-arrow','garden-network-arrow'],['garden-local-arrow','garden-local-arrow']]) {
    const marker=node('marker',{id,viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:5,markerHeight:5,orient:'auto-start-reverse'},defs);
    node('path',{d:'M2 1L8 5L2 9',class:cls},marker);
  }
  const group=node('g',{'data-effect':'connectivity',opacity:0});
  const connections=[['hub-gateway',false],['gateway-internet',false],['internet-app',false],['local-network',true]].map(([id,local])=>{
    const path=node('path',{'data-connection':id,class:`garden-network-wire${local?' is-local':''}`,'marker-end':`url(#garden-${local?'local':'network'}-arrow)`},group);
    if(local)path.setAttribute('marker-start','url(#garden-local-arrow)');
    const packet=node('circle',{r:3,class:`garden-network-packet${local?' is-local':''}`},group);
    return {path,packet,local,length:0};
  });
  const labelBack=node('rect',{rx:4,class:'garden-local-label-bg'},group);
  const label=node('text',{'text-anchor':'middle',class:'garden-local-label'},group);label.textContent='Local network';
  let layoutKey='';
  function clear() {
    board.style.setProperty('--connectivity-reveal',0);group.setAttribute('opacity',0);
    board.classList.remove('is-visible');
    step.classList.remove('has-connectivity-model');layoutKey='';
  }
  function layout(hub,ground) {
    const outer=svg.getBoundingClientRect();
    if(!outer.width||!outer.height)return;
    svg.setAttribute('viewBox',`0 0 ${outer.width} ${outer.height}`);
    const point=(name,x,y)=>{
      const r=board.querySelector(`[data-network-node="${name}"] svg`).getBoundingClientRect();
      return {x:r.left-outer.left+x*r.width/180,y:r.top-outer.top+y*r.height/180};
    };
    const gatewayL=point('gateway',22,115),gatewayR=point('gateway',158,115);
    const internetL=point('internet',28,88),internetR=point('internet',152,88);
    const phoneL=point('phone',48,82),phoneR=point('phone',132,117);
    const frame=grid.getBoundingClientRect(),caption=board.querySelector('[data-network-node="phone"] figcaption').getBoundingClientRect();
    const paths=['',`M${gatewayR.x+4} ${gatewayR.y}H${internetL.x-5}`,`M${internetR.x+4} ${internetR.y}H${phoneL.x-5}`,''];
    let labelX=0,labelY=0;
    if(hub) {
      const v=view.getBoundingClientRect(),h={x:v.left-outer.left+hub[0],y:v.top-outer.top+hub[1]};
      const mobile=innerWidth<1000;
      const right=mobile?innerWidth-4-outer.left:Math.min(innerWidth-12-outer.left,h.x+108);
      const gardenBottom=ground?.length?v.top-outer.top+Math.max(...ground.map(p=>p[1])):h.y+150;
      const controlsTop=story.querySelector('.garden-controls').getBoundingClientRect().top-outer.top;
      const rail=Math.min(controlsTop-12,mobile?frame.bottom-outer.top+54:Math.max(frame.bottom-outer.top+54,gardenBottom+50));
      const localRail=rail-(innerHeight<800?24:32);
      const gateLane=Math.max(4-outer.left,gatewayL.x-22);
      paths[0]=`M${h.x} ${h.y}H${right-14}Q${right} ${h.y} ${right} ${h.y+14}V${rail-14}Q${right} ${rail} ${right-14} ${rail}H${gateLane+14}Q${gateLane} ${rail} ${gateLane} ${rail-14}V${gatewayL.y+14}Q${gateLane} ${gatewayL.y} ${gateLane+14} ${gatewayL.y}H${gatewayL.x-3}`;
      if(mobile) {
        // A separate inner lane travels straight up beside the text; it never
        // drops across the outer Hub→Gateway rail or the framed App caption.
        const lane=right-12;
        paths[3]=`M${phoneR.x+3} ${phoneR.y}H${lane-10}Q${lane} ${phoneR.y} ${lane} ${phoneR.y-10}V${h.y+30}Q${lane} ${h.y+20} ${lane-10} ${h.y+20}H${h.x+3}`;
        labelX=(frame.left+frame.width/2)-outer.left;labelY=Math.min(frame.bottom-outer.top+27,rail-20);
      } else {
        const drop=Math.max(phoneR.x+22,caption.right-outer.left+16),localRight=Math.min(right-24,h.x+44);
        paths[3]=`M${phoneR.x+3} ${phoneR.y}H${drop-14}Q${drop} ${phoneR.y} ${drop} ${phoneR.y+14}V${localRail-14}Q${drop} ${localRail} ${drop+14} ${localRail}H${localRight-14}Q${localRight} ${localRail} ${localRight} ${localRail-14}V${h.y+34}Q${localRight} ${h.y+20} ${localRight-14} ${h.y+20}H${h.x+3}`;
        labelX=drop+76;labelY=localRail+4;
      }
    }
    connections.forEach((connection,i)=>{
      connection.path.setAttribute('d',paths[i]);
      connection.path.style.display=paths[i]?'':'none';
      connection.length=paths[i]?connection.path.getTotalLength():0;
    });
    label.style.display=labelBack.style.display=hub?'':'none';
    if(hub) {
      label.setAttribute('x',labelX);label.setAttribute('y',labelY);
      const w=label.getComputedTextLength()+24;
      labelBack.setAttribute('x',labelX-w/2);labelBack.setAttribute('y',labelY-13);
      labelBack.setAttribute('width',w);labelBack.setAttribute('height',20);
    }
  }
  function update({active,reveal=1,contentOpacity=1,hub=null,ground=[],time=0,reduced=false}) {
    const amount=active?clamp(reveal,0,1):0;
    const opacity=amount*amount*(3-2*amount);
    const model=active&&!!hub;
    step.classList.toggle('has-connectivity-model',model);
    board.style.setProperty('--connectivity-reveal',opacity);
    board.classList.toggle('is-visible',opacity>0);
    if(!opacity){group.setAttribute('opacity',0);layoutKey='';return;}
    // Icons inherit the copy's exit fade; stage-level wires need it explicitly.
    group.setAttribute('opacity',opacity*clamp(contentOpacity,0,1));
    const key=[scrollY,innerWidth,innerHeight,board.offsetWidth,board.offsetHeight,model].join(':');
    if(key!==layoutKey){layout(hub,ground);layoutKey=key;}
    connections.forEach(({path,packet,length},i)=>{
      packet.style.display=reduced||!length?'none':'';
      if(!reduced&&length){const p=path.getPointAtLength(((time*.18+i*.23)%1)*length);packet.setAttribute('cx',p.x);packet.setAttribute('cy',p.y);}
    });
  }
  return {update,clear,invalidate:()=>{layoutKey='';}};
}
