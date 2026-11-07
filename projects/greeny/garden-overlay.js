// SVG presentation effects follow projected 3D anchors, independent of canvas size.
const NS='http://www.w3.org/2000/svg';

export function createGardenOverlay(svg) {
  function node(name,attributes,parent) {
    const element=document.createElementNS(NS,name);
    for(const [key,value] of Object.entries(attributes))element.setAttribute(key,value);
    parent.append(element);return element;
  }
  const defs=node('defs',{},svg);
  const blur=node('filter',{id:'garden-beam-soft'},defs);
  node('feGaussianBlur',{stdDeviation:3},blur);
  const pool=node('radialGradient',{id:'garden-light-pool'},defs);
  node('stop',{offset:0,class:'garden-pool-center'},pool);
  node('stop',{offset:.48,class:'garden-pool-mid'},pool);
  node('stop',{offset:1,class:'garden-pool-edge'},pool);
  const lighting=node('g',{'data-effect':'lighting',opacity:0},svg);
  const lamps=[0,1].map(i=>{
    const gradient=node('linearGradient',{id:`garden-cone-${i}`,gradientUnits:'userSpaceOnUse'},defs);
    node('stop',{offset:0,class:'garden-cone-start'},gradient);
    node('stop',{offset:1,class:'garden-cone-end'},gradient);
    return {
      gradient,
      pool:node('polygon',{fill:'url(#garden-light-pool)'},lighting),
      beam:node('polygon',{fill:`url(#garden-cone-${i})`,filter:'url(#garden-beam-soft)'},lighting),
      lens:node('path',{class:'garden-light-lens','stroke-linecap':'round'},lighting),
    };
  });
  const signal=node('g',{'data-effect':'sensor',opacity:0},svg);
  const rings=[0,1,2].map(()=>node('circle',{class:'garden-signal-ring'},signal));
  node('circle',{r:3,class:'garden-signal-center'},signal);
  const annotation=node('g',{'data-effect':'device-label',opacity:0},svg);
  const leader=node('path',{class:'garden-device-leader'},annotation);
  const target=node('circle',{r:4,class:'garden-device-target'},annotation);
  const badge=node('g',{},annotation);
  const badgeRect=node('rect',{class:'garden-device-badge',rx:12},badge);
  const badgeText=node('text',{class:'garden-device-badge-text','text-anchor':'middle','dominant-baseline':'middle'},badge);
  const points=values=>values.map(p=>p.join(',')).join(' ');

  function update(projection,{reading,deviceLabel=null,signalTime,lightAmount}) {
    if(!projection)return;
    const {width,height,sensor,lights}=projection;
    svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
    signal.setAttribute('opacity',reading?1:0);
    signal.setAttribute('transform',`translate(${sensor.join(' ')})`);
    annotation.setAttribute('opacity',deviceLabel?1:0);
    if(deviceLabel){
      const point=deviceLabel.point;
      badgeText.textContent=deviceLabel.name;
      const badgeWidth=width<420?112:128,badgeHeight=width<420?32:40;
      const x=Math.max(8,Math.min(width-badgeWidth-8,point[0]+width*.13));
      const y=Math.max(8,Math.min(height-badgeHeight-8,point[1]-Math.min(145,height*.25)));
      badge.setAttribute('transform',`translate(${x} ${y})`);
      badgeRect.setAttribute('width',badgeWidth);badgeRect.setAttribute('height',badgeHeight);
      badgeText.setAttribute('x',badgeWidth/2);badgeText.setAttribute('y',badgeHeight/2+1);
      const startX=Math.max(x+12,Math.min(x+badgeWidth-12,point[0]));
      const startY=y+badgeHeight;
      const elbowY=startY+(point[1]-startY)*.4;
      leader.setAttribute('d',`M${startX} ${startY}V${elbowY}H${point[0]}V${point[1]}`);
      target.setAttribute('cx',point[0]);target.setAttribute('cy',point[1]);
    }
    if(reading)rings.forEach((ring,i)=>{
      const phase=(signalTime*.9+i/3)%1;
      ring.setAttribute('r',Math.min(width,height)*(.025+.09*phase));
      ring.setAttribute('opacity',(.72*(1-phase)).toFixed(3));
    });
    lighting.setAttribute('opacity',lightAmount.toFixed(3));
    if(lightAmount>.001)lights.forEach((light,i)=>{
      const layer=lamps[i];
      const start=light.top.reduce((s,p)=>[s[0]+p[0]/2,s[1]+p[1]/2],[0,0]);
      const end=light.cone.slice(2).reduce((s,p)=>[s[0]+p[0]/2,s[1]+p[1]/2],[0,0]);
      for(const [key,value] of Object.entries({x1:start[0],y1:start[1],x2:end[0],y2:end[1]}))layer.gradient.setAttribute(key,value);
      layer.pool.setAttribute('points',points(light.pool));
      layer.beam.setAttribute('points',points(light.cone));
      layer.lens.setAttribute('d',`M${light.top[0].join(' ')}L${light.top[1].join(' ')}`);
    });
  }

  function clear() {signal.setAttribute('opacity',0);annotation.setAttribute('opacity',0);lighting.setAttribute('opacity',0);}
  return {update,clear};
}
