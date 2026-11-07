// Read each chapter in document flow; hold its bottom edge while the next covers it.
(() => {
  const root = document.documentElement;
  const main = document.querySelector('main[data-stack]');
  if (!main || !CSS.supports('position', 'sticky') || !('ResizeObserver' in window)) return;
  const slots = [...main.querySelectorAll(':scope > .stack-slot')];
  const panels = slots.map(slot => slot.firstElementChild);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let reducedMotion = motion.matches;
  let positions = [];
  let viewport = innerHeight;
  let header = 0;
  let updateFrame = 0;
  let measureFrame = 0;

  function clear() {
    root.classList.remove('stack-ready');
    panels.forEach(panel => {
      panel.classList.remove('is-receding');
      panel.style.setProperty('--stack-scale', '1');
      panel.style.setProperty('--stack-shade', '0');
    });
  }
  function paint() {
    updateFrame = 0;
    if (reducedMotion || !positions.length) return;
    const distance = Math.max(1, viewport - header);
    const shrink = innerWidth < 600 ? .02 : .04;
    panels.forEach((panel,index) => {
      const next = positions[index+1];
      const progress = next && scrollY < next.start + viewport
        ? Math.max(0,Math.min(1,(scrollY + viewport - next.start)/distance))
        : 0;
      panel.classList.toggle('is-receding',progress>0);
      panel.style.setProperty('--stack-scale',String(1-progress*shrink));
      panel.style.setProperty('--stack-shade',String(progress*.3));
    });
  }
  function measure() {
    measureFrame = 0;
    if (reducedMotion) { clear(); return; }
    viewport = innerHeight;
    header = (document.querySelector('.site-header')?.offsetHeight || 0) + 8;
    main.style.setProperty('--stack-overlap',viewport+'px');
    root.classList.add('stack-ready');
    panels.forEach((panel,index) => {
      slots[index].style.setProperty('--stack-height',panel.offsetHeight+'px');
      panel.style.setProperty('--stack-top',Math.min(header,viewport-panel.offsetHeight)+'px');
    });
    positions = slots.map(slot => ({start:slot.getBoundingClientRect().top+scrollY}));
    paint();
  }
  function scheduleMeasure() {
    if (!measureFrame) measureFrame = requestAnimationFrame(measure);
  }
  // A sibling sheet can cover an element that the browser still considers on-screen.
  // Restore its reading position when keyboard focus returns to an earlier layer.
  main.addEventListener('focusin',event => {
    if (reducedMotion || !(event.target instanceof HTMLElement)) return;
    const target = event.target;
    requestAnimationFrame(() => {
      const slot = target.closest('.stack-slot');
      const index = slots.indexOf(slot);
      if (index < 0 || document.activeElement !== target) return;
      const rect = target.getBoundingClientRect();
      const x = Math.max(1,Math.min(innerWidth-1,rect.left+rect.width/2));
      const visibleTop = Math.max(header+8,rect.top);
      const visibleBottom = Math.min(viewport-8,rect.bottom);
      const y = (visibleTop+visibleBottom)/2;
      if (visibleBottom>visibleTop && target.contains(document.elementFromPoint(x,y))) return;
      const panel = panels[index];
      const scale = panel.classList.contains('is-receding') ? Number(panel.style.getPropertyValue('--stack-scale')) : 1;
      const within = (rect.top-panel.getBoundingClientRect().top)/scale;
      let destination = slot.getBoundingClientRect().top+scrollY+within-header-24;
      const next = slots[index+1];
      if (next) destination = Math.min(destination,next.getBoundingClientRect().top+scrollY-viewport-16);
      scrollTo({top:Math.max(0,destination),behavior:'instant'});
    });
  });
  const observer = new ResizeObserver(scheduleMeasure);
  panels.forEach(panel => observer.observe(panel));
  const headerElement = document.querySelector('.site-header');
  if (headerElement) observer.observe(headerElement);
  addEventListener('resize',scheduleMeasure,{passive:true});
  addEventListener('scroll',() => {
    if (!updateFrame && !reducedMotion) updateFrame = requestAnimationFrame(paint);
  },{passive:true});
  motion.addEventListener('change',event => {
    reducedMotion = event.matches;
    // Switch modes immediately and measure fresh dimensions when re-enabled.
    if (measureFrame) cancelAnimationFrame(measureFrame);
    measureFrame = 0;
    if (reducedMotion) clear();
    else scheduleMeasure();
  });
  document.fonts.ready.then(scheduleMeasure);
  measure();
})();
