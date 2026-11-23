// Fits the visible composition, not its transparent canvas/margins, below Close.
export function createHomeViewFit(views) {
  const targets={
    about:'.home-about-card,.home-about-clip',
    work:'.home-project-board-surface,.home-project-details',
    contact:'.home-contact-paper,.home-note-tab,.home-note-shadow',
    play:'#play-title,.home-game-instructions,.home-game-status,.home-game-reset,.home-game-display,.home-game-paper img,.home-game-outline img,.home-game-shadow img'
  };
  const originWidth=view=>view.getBoundingClientRect().width;
  function fit(id) {
    const view=views.get(id),panel=view.querySelector('.home-panel');
    panel.style.transform='';panel.style.left='0px';panel.style.top='0px';view.style.height='';view.style.setProperty('--home-fit-scale','1');
    if(id==='skills')return;
    const nativeFrame=innerWidth>=1440&&innerHeight>=1024&&parseFloat(getComputedStyle(document.documentElement).fontSize)<=20;
    const workFitsFrame=id!=='work'||panel.querySelector('.home-work-layout').getBoundingClientRect().height<=1025;
    if((id==='about'||id==='work')&&nativeFrame&&workFitsFrame){panel.style.transform='translate('+((originWidth(view)-1440)/2)+'px,'+((innerHeight-1024)/2)+'px)';view.dataset.fitScale='1';return;}
    if(id==='play'&&nativeFrame){panel.style.transform='translate('+((originWidth(view)-760)/2-1.2)+'px,'+((innerHeight-1024)/2)+'px)';view.dataset.fitScale='1';return;}
    const origin=view.getBoundingClientRect();
    const boxes=[...view.querySelectorAll(targets[id])].map(el=>el.getBoundingClientRect()).filter(r=>r.width&&r.height);
    if(!boxes.length)return;
    const left=Math.min(...boxes.map(r=>r.left))-origin.left,top=Math.min(...boxes.map(r=>r.top))-origin.top;
    const width=Math.max(...boxes.map(r=>r.right))-origin.left-left,height=Math.max(...boxes.map(r=>r.bottom))-origin.top-top;
    const closeStyle=getComputedStyle(document.querySelector('.home-return'));
    const closeBottom=parseFloat(closeStyle.top)+parseFloat(closeStyle.height);
    const margin=innerWidth<680?16:24,headroom=id==='contact'&&nativeFrame?72:Math.max(72,closeBottom+16),availableWidth=origin.width-margin*2,availableHeight=innerHeight-headroom-margin;
    // Enlarged browser text keeps its real size. Allow vertical reading space
    // rather than undoing accessibility zoom with a transform.
    const enlarged=parseFloat(getComputedStyle(document.documentElement).fontSize)>20;
    // The restored vertical note/game must not turn into tiny controls on a
    // very short screen. Keep the original composition with reading space.
    const paper=id==='contact'||id==='play';
    const minimumScale=paper?Math.min(1,Math.max(...[...panel.querySelectorAll('button,input,textarea')].map(el=>el.getBoundingClientRect()).filter(r=>r.width&&r.height).flatMap(r=>[24/r.width,24/r.height]))):0;
    // Compact Projects is a vertical selector followed by its selected content.
    // Keep readable text and real hit areas; short screens use reading space.
    const compactWork=id==='work'&&innerWidth<=900;
    const scale=Math.min(1,availableWidth/width,enlarged||compactWork?1:Math.max(minimumScale,availableHeight/height));
    const readingHeight=Math.max(availableHeight,height*scale);
    if(enlarged||height*scale>availableHeight+1)view.style.height=(readingHeight+headroom+margin)+'px';
    const x=margin+(availableWidth-width*scale)/2-left*scale,y=headroom+Math.max(0,(availableHeight-height*scale)/2)-top*scale;
    panel.style.transform='translate('+x+'px,'+y+'px) scale('+scale+')';
    view.style.setProperty('--home-fit-scale',String(scale));
    view.dataset.fitScale=String(scale);
  }
  for(const [id,view]of views) {
    view.classList.add('home-fit-view');
    if(id==='skills')continue;
    const observer=new ResizeObserver(()=>{
      if(!view.hidden&&document.documentElement.dataset.homePhase==='detail')fit(id);
    });
    for(const element of view.querySelectorAll('.home-panel,.home-contact-paper,.home-project-details,.home-about-card'))observer.observe(element);
  }
  return {fit};
}
