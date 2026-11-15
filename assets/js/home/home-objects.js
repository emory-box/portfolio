// Owns each original illustration and its home/view slots. Artwork is never cloned.
export function createHomeObjects(views) {
  const definitions={
    about:['.home-portrait .home-avatar-art','.home-about-avatar'],
    work:['.home-projects .home-pegboard-art','.home-project-board'],
    skills:['.home-skills .home-toast-art','.home-skills-art-slot'],
    contact:['.home-note .home-note-art','.home-contact-decoration'],
    play:['.home-play .home-game-art','.home-game-display']
  };
  const records=new Map();let carrier=null;
  for(const [id,[selector,targetSelector]]of Object.entries(definitions)) {
    const art=document.querySelector(selector),anchor=art.closest('.home-object');
    const image=art.matches('img')?art:art.querySelector('img');
    const size={width:Number(art.dataset.artWidth||image.getAttribute('width')),height:Number(art.dataset.artHeight||image.getAttribute('height'))};
    let target=views.get(id).querySelector(targetSelector);
    if(id==='work') {
      const wrapper=document.createElement('div');wrapper.className='home-project-board';
      target.before(wrapper);wrapper.append(target);target=wrapper;
    }
    target.classList.add('home-object-target');target.dataset.objectTarget=id;
    if(id!=='play')for(const fallback of target.children){fallback.classList.add('home-object-fallback');fallback.hidden=true;}
    const slot=document.createElement('span');slot.className='home-object-home-slot';slot.dataset.objectHome=id;slot.setAttribute('aria-hidden','true');
    art.dataset.sharedObject=id;
    records.set(id,{art,anchor,target,slot,size});
  }
  function toView(id) {
    const r=records.get(id);if(r.anchor.contains(r.art))r.art.before(r.slot);
    r.target.prepend(r.art);removeEmptyCarrier(id);
  }
  function toHome(id) {
    const r=records.get(id);
    if(r.slot.isConnected)r.slot.replaceWith(r.art);
    else if(!r.anchor.contains(r.art))r.anchor.prepend(r.art);
    removeEmptyCarrier(id);
  }
  function removeEmptyCarrier(id) {
    if(carrier?.dataset.object===id&&!carrier.contains(records.get(id).art)){carrier.remove();carrier=null;}
  }
  function frame(rect,id=carrier.dataset.object) {
    const scale=rect.width/records.get(id).size.width;
    return {transform:'translate3d('+rect.left+'px,'+rect.top+'px,0) scale('+scale+')',height:rect.height/scale+'px'};
  }
  function carry(id,rect) {
    const r=records.get(id);
    if(!carrier) {
      carrier=document.createElement('div');carrier.className='home-zoom-art';carrier.dataset.object=id;
      carrier.inert=true;carrier.setAttribute('aria-hidden','true');carrier.dataset.width=r.size.width;carrier.style.width=r.size.width+'px';
      if(r.anchor.contains(r.art))r.art.before(r.slot);
      carrier.append(r.art);document.body.append(carrier);
    }
    Object.assign(carrier.style,frame(rect,id));return carrier;
  }
  function measure(id,capture,beforeMeasure) {
    const r=records.get(id),parent=r.art.parentNode,next=r.art.nextSibling,wasHome=r.anchor.contains(r.art);
    if(wasHome)r.art.before(r.slot);
    r.target.prepend(r.art);beforeMeasure?.();const box=r.art.getBoundingClientRect();
    const rect={left:box.left,top:box.top,width:box.width,height:box.height};
    const paint=capture?.(box.width/r.size.width);
    if(wasHome)r.slot.replaceWith(r.art);else parent.insertBefore(r.art,next);
    return {rect,paint};
  }
  return {
    art:id=>records.get(id).art,anchor:id=>records.get(id).anchor,
    homeRect:id=>{const r=records.get(id);return(r.slot.isConnected?r.slot:r.art).getBoundingClientRect();},
    target:id=>records.get(id).target,size:id=>records.get(id).size,
    toView,toHome,carry,frame,measure,carrier:()=>carrier,
    homeAll:()=>{for(const id of records.keys())toHome(id);}
  };
}
