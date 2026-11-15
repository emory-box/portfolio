// The About card draws one open outline, then fades in its complete native copy.
export function createAboutReveal(panel) {
  const card=panel.querySelector('.home-about-card');
  const clip=panel.querySelector('.home-about-clip');
  const copy=panel.querySelector('.home-about-copy');
  const outline=document.createElementNS('http://www.w3.org/2000/svg','svg');
  const path=document.createElementNS(outline.namespaceURI,'path');
  outline.classList.add('home-about-border');
  outline.setAttribute('aria-hidden','true');outline.setAttribute('focusable','false');
  path.setAttribute('fill','none');path.setAttribute('stroke','currentColor');
  path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');
  path.setAttribute('pathLength','1000');outline.append(path);card.prepend(outline);
  card.classList.add('has-drawn-border');
  function measure() {
    const style=getComputedStyle(card),rect={width:parseFloat(style.width),height:parseFloat(style.height)};
    if(!rect.width||!rect.height)return;
    const stroke=parseFloat(style.borderTopWidth);
    const radius=Math.min(parseFloat(style.borderTopLeftRadius),rect.width/2,rect.height/2);
    const left=stroke/2,top=stroke/2,right=rect.width-stroke/2,bottom=rect.height-stroke/2,r=Math.max(1,radius-stroke/2);
    const gap=Math.min(28,Math.max(18,rect.width*.022))+stroke;
    const center=Math.min(right-r-gap/2,Math.max(left+r+gap/2,rect.width*.2));
    // One continuous open path; its start and end create exactly one gap.
    const d=['M',center+gap/2,top,'H',right-r,'A',r,r,0,0,1,right,top+r,'V',bottom-r,'A',r,r,0,0,1,right-r,bottom,'H',left+r,'A',r,r,0,0,1,left,bottom-r,'V',top+r,'A',r,r,0,0,1,left+r,top,'H',center-gap/2].join(' ');
    outline.setAttribute('viewBox','0 0 '+rect.width+' '+rect.height);
    Object.assign(outline.style,{left:-stroke+'px',top:-stroke+'px',width:'calc(100% + '+stroke*2+'px)',height:'calc(100% + '+stroke*2+'px)'});
    path.setAttribute('d',d);path.setAttribute('stroke-width',String(stroke));
  }
  new ResizeObserver(measure).observe(card);document.fonts.ready.then(measure);
  function prepare() {
    outline.style.opacity=clip.style.opacity=copy.style.opacity='0';
    path.style.strokeDasharray='1000 1000';path.style.strokeDashoffset='1000';
  }
  function frame(animate) {
    measure();
    return [
      ...[outline,clip].map(el=>animate(el,[{opacity:0},{opacity:1}],{duration:480,easing:'ease-out'})),
      animate(path,[{strokeDashoffset:'1000'},{strokeDashoffset:'0'}],{duration:480,easing:'cubic-bezier(.2,0,0,1)'})
    ];
  }
  function revealText(animate) {
    return [animate(copy,[{opacity:0},{opacity:1}],{duration:520,easing:'cubic-bezier(.2,0,0,1)'})];
  }
  function freeze() {
    for(const el of [outline,clip,copy])el.style.opacity=getComputedStyle(el).opacity;
    const style=getComputedStyle(path);path.style.strokeDasharray=style.strokeDasharray;path.style.strokeDashoffset=style.strokeDashoffset;
  }
  function finish() {
    outline.style.opacity=clip.style.opacity=copy.style.opacity='1';
    path.style.strokeDasharray='none';path.style.strokeDashoffset='0';
    measure();
  }
  return {prepare,measure,frame,revealText,freeze,finish};
}
