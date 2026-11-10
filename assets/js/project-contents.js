// Opt-in, non-modal project Contents. Only its button changes open state.
(() => {
  for(const root of document.querySelectorAll('[data-project-contents]')){
    const toggle=root.querySelector('.project-contents-toggle');
    const panel=root.querySelector('.project-contents-panel');
    const back=root.querySelector('.project-contents-back');
    const groups=[...root.querySelectorAll('.project-contents-group')];
    const links=[...panel.querySelectorAll('a[href^="#"]')];
    const entries=links.map(link=>({link,target:document.getElementById(link.hash.slice(1))})).filter(entry=>entry.target);
    const start=document.querySelector(root.dataset.start);
    const reduce=matchMedia('(prefers-reduced-motion: reduce)');
    let open=false,appeared=false,selected=null,frame=0,layoutKey='';
    function setOpen(value){
      open=value;root.classList.toggle('is-open',open);
      toggle.setAttribute('aria-expanded',String(open));
      toggle.setAttribute('aria-label',open?'Close Contents':'Open Contents');
      panel.inert=!open;panel.setAttribute('aria-hidden',String(!open));
    }
    function applyGroups(){
      const compact=root.classList.contains('is-compact');
      root.classList.toggle('is-drilldown',compact&&selected!==null);
      back.hidden=!compact||selected===null;
      groups.forEach((group,index)=>{
        const list=group.querySelector('ul'),expand=group.querySelector('.project-contents-expand');
        group.hidden=compact&&selected!==null&&selected!==index;
        if(list)list.hidden=compact&&selected!==index;
        if(expand)expand.hidden=!compact||selected!==null;
      });
    }
    function layout(){
      const edge=parseFloat(getComputedStyle(root).getPropertyValue('--contents-edge'))||16;
      root.style.setProperty('--contents-width',`${Math.max(160,Math.min(560,innerWidth-edge*2-56))}px`);
      root.classList.remove('is-compact');applyGroups();
      const maxHeight=innerHeight-edge*2;
      const preferred=innerWidth<600?2:3;
      let fits=false;
      for(const columns of [preferred,3,2,1]){
        root.style.setProperty('--contents-columns',columns);
        if(panel.offsetHeight<=maxHeight){fits=true;break;}
      }
      if(!fits){
        root.classList.add('is-compact');applyGroups();
        root.style.setProperty('--contents-detail-columns',1);
        if(panel.offsetHeight>maxHeight)root.style.setProperty('--contents-detail-columns',2);
      }
    }
    function update(){
      frame=0;
      if(!appeared&&start&&start.getBoundingClientRect().top<innerHeight*.9){
        appeared=true;root.classList.remove('is-unavailable');root.inert=false;
        document.documentElement.classList.add('has-project-contents');
      }
      let current=entries[0];
      for(const entry of entries)if(entry.target.getBoundingClientRect().top<=innerHeight*.3)current=entry;
      entries.forEach(entry=>{
        if(entry===current)entry.link.setAttribute('aria-current','location');
        else entry.link.removeAttribute('aria-current');
      });
    }
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    root.classList.add('is-enhanced','is-unavailable');root.inert=true;toggle.hidden=false;
    setOpen(false);layout();update();
    requestAnimationFrame(()=>root.classList.add('is-ready'));
    toggle.addEventListener('click',()=>setOpen(!open));
    groups.forEach((group,index)=>group.querySelector('.project-contents-expand')?.addEventListener('click',()=>{
      selected=index;layout();group.querySelector('a').focus();
    }));
    back.addEventListener('click',()=>{selected=null;layout();groups[0].querySelector('a').focus();});
    links.forEach(link=>link.addEventListener('click',event=>{
      if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const target=document.getElementById(link.hash.slice(1));if(!target)return;
      event.preventDefault();
      const heading=target.matches('h1,h2,h3,h4')?target:target.querySelector('h1,h2,h3,h4')||target;
      heading.closest('.reveal')?.classList.add('is-in');
      if(!heading.hasAttribute('tabindex'))heading.setAttribute('tabindex','-1');
      history.pushState(null,'',link.hash);
      heading.focus({preventScroll:true});
      heading.scrollIntoView({block:'start',behavior:reduce.matches?'instant':'smooth'});
      schedule();
    }));
    addEventListener('scroll',schedule,{passive:true});
    addEventListener('resize',()=>{layout();schedule();},{passive:true});
    document.fonts?.ready.then(()=>{layout();schedule();});
    if('ResizeObserver' in window)new ResizeObserver(()=>{
      const key=[innerWidth,innerHeight,getComputedStyle(document.documentElement).fontSize].join(':');
      if(key!==layoutKey){layoutKey=key;layout();}
    }).observe(panel);
  }
})();
