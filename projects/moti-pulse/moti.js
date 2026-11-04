(() => {
  'use strict';

  document.documentElement.classList.replace('no-js', 'js');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const runningAnimations = new Set();
  const contents = document.querySelector('.contents');
  const contentsDisclosure = contents?.querySelector('details');
  const contentsLinks = Array.from(document.querySelectorAll('.contents a'));
  const contentsSections = contentsLinks.map(link => document.querySelector(link.hash));
  const roomyViewport = window.matchMedia('(min-width: 1800px)');
  const hero = document.querySelector('.hero');
  let revealObserver;
  let framePending = false;
  let contentsHasAppeared = false;
  const revealedPies = new WeakSet();
  const revealedBars = new WeakSet();
  let pieObserver;
  let barObserver;

  function observeBars() {
    barObserver?.disconnect();
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
    barObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const target = entry.target;
        const requiredHeight = Math.min(entry.boundingClientRect.height * .95, window.innerHeight * .75);
        if (!entry.isIntersecting || entry.intersectionRect.height < requiredHeight || revealedBars.has(target)) return;
        revealedBars.add(target);
        barObserver.unobserve(target);
        animate(target, [
          { clipPath: 'inset(100% 0 0 0)', opacity: .4 },
          { clipPath: 'inset(0% 0 0 0)', opacity: 1 },
        ], 120, 1100);
      });
    }, { threshold: [0, .25, .5, .75, .95, 1], rootMargin: '0px 0px -24px 0px' });
    document.querySelectorAll('.survey-bar img').forEach(img => {
      if (!revealedBars.has(img)) barObserver.observe(img);
    });
  }

  function observePies() {
    pieObserver?.disconnect();
    if (reducedMotion.matches || !('IntersectionObserver' in window) || !CSS.registerProperty) return;
    pieObserver = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting || revealedPies.has(target)) return;
        revealedPies.add(target);
        pieObserver.unobserve(target);
        const isAgeChart = target.getAttribute('width') === '312';
        target.style.setProperty('--pie-center', isAgeChart ? '32.69%' : '28.19%');
        target.style.setProperty('--pie-label-start', isAgeChart ? '66%' : '57%');
        target.classList.add('pie-reveal');
        const legendAnimations = [];
        const legendLayers = Array.from({ length: 6 }, (_, index) => {
          const layer = document.createElement('span');
          layer.className = 'pie-legend-reveal';
          layer.setAttribute('aria-hidden', 'true');
          layer.style.backgroundImage = `url("${target.currentSrc || target.src}")`;
          const top = (8 + index * 31.1593) / 203 * 100;
          const bottom = 100 - (39.1593 + index * 31.1593) / 203 * 100;
          const left = isAgeChart ? 66 : 57;
          layer.style.clipPath = `inset(${top}% 0 ${bottom}% ${left}%)`;
          layer.style.transformOrigin = `${left}% ${top + 8}%`;
          target.parentElement.append(layer);
          const pop = layer.animate([
            { opacity: 0, transform: 'scale(.92)', offset: 0 },
            { opacity: 1, transform: 'scale(1.06)', offset: .6 },
            { opacity: 1, transform: 'scale(1)', offset: 1 },
          ], { duration: 400, delay: 1550 + index * 120, fill: 'backwards', easing: 'cubic-bezier(.2,.7,.2,1)' });
          legendAnimations.push(pop);
          runningAnimations.add(pop);
          const release = () => runningAnimations.delete(pop);
          pop.addEventListener('finish', release, { once: true });
          pop.addEventListener('cancel', release, { once: true });
          return layer;
        });
        const animation = target.animate([{ '--pie-sweep': '0deg' }, { '--pie-sweep': '361deg' }], {
          duration: 1500, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards',
        });
        runningAnimations.add(animation);
        const finish = () => {
          runningAnimations.delete(animation);
          target.classList.remove('pie-reveal');
          legendLayers.forEach(layer => layer.remove());
          animation.cancel();
        };
        Promise.all([animation, ...legendAnimations].map(item => item.finished)).then(finish, finish);
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.demographic-charts img').forEach(img => {
      if (!revealedPies.has(img)) pieObserver.observe(img);
    });
  }

  // Web Animations leave the underlying content visible if scripting is unavailable.
  function animate(element, frames, delay = 0, duration = 600) {
    if (reducedMotion.matches || typeof element.animate !== 'function') return;
    const animation = element.animate(frames, {
      duration,
      delay,
      fill: 'backwards',
      easing: 'cubic-bezier(.2,.7,.2,1)',
    });
    runningAnimations.add(animation);
    const release = () => runningAnimations.delete(animation);
    animation.addEventListener('finish', release, { once: true });
    animation.addEventListener('cancel', release, { once: true });
  }

  function updateReadingPosition() {
    if (contents && hero) {
      if (hero.getBoundingClientRect().bottom <= window.innerHeight * 0.75) contentsHasAppeared = true;
      contents.hidden = !contentsHasAppeared && !contents.contains(document.activeElement);
      let activeContents = contentsSections[0];
      for (const section of contentsSections) {
        if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.4) activeContents = section;
      }
      contents.querySelectorAll('.contents-group').forEach(group => group.classList.remove('is-active'));
      contentsLinks.forEach(link => {
        if (activeContents && link.hash === '#' + activeContents.id) {
          link.setAttribute('aria-current', 'location');
          link.closest('.contents-group').classList.add('is-active');
        } else link.removeAttribute('aria-current');
      });
    }
    framePending = false;
  }

  function schedulePositionUpdate() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateReadingPosition);
  }

  function observeReveals() {
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        animate(element, [
          { opacity: 0, transform: 'translateY(20px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ]);
        revealObserver.unobserve(element);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.source-title, .motivation-card, .segments article, .persona, .mockup').forEach(element => revealObserver.observe(element));
  }

  function updateMotionPreference() {
    observePies();
    observeBars();
    if (revealObserver) revealObserver.disconnect();
    if (reducedMotion.matches) {
      runningAnimations.forEach(animation => animation.cancel());
      runningAnimations.clear();
    } else {
      observeReveals();
    }
    updateReadingPosition();
  }

  document.querySelectorAll('.hero h1, .hero-subtitle, .hero-translation, .hero-phone').forEach((element, index) => {
    const restingTransform = window.getComputedStyle(element).transform;
    const transform = restingTransform === 'none' ? '' : restingTransform;
    animate(element, [
      { opacity: 0, transform: transform + ' translateY(28px)' },
      { opacity: 1, transform: restingTransform },
    ], index * 120);
  });

  window.addEventListener('scroll', schedulePositionUpdate, { passive: true });
  window.addEventListener('resize', schedulePositionUpdate);
  reducedMotion.addEventListener('change', updateMotionPreference);
  if (contents && contentsDisclosure) {
    const summary = contentsDisclosure.querySelector('summary');
    const panel = contentsDisclosure.querySelector('nav');
    const chevron = summary.querySelector('svg');
    let desiredOpen = roomyViewport.matches;
    let contentsAnimations = [];
    let transitionVersion = 0;
    let closedShift = 0;

    function measureContents() {
      const hidden = contents.hidden;
      contents.hidden = false;
      contentsDisclosure.style.width = '';
      contentsDisclosure.style.height = '';
      contentsDisclosure.style.transform = '';
      contentsDisclosure.open = true;
      const bounds = panel.getBoundingClientRect();
      const drawerWidth = contentsDisclosure.getBoundingClientRect().width;
      closedShift = drawerWidth + window.innerWidth - contents.getBoundingClientRect().right;
      // Reserve the same geometry in both states so the handle never jumps vertically.
      contentsDisclosure.style.width = drawerWidth + 'px';
      contentsDisclosure.style.height = bounds.height + 'px';
      contents.hidden = hidden;
    }

    function setContentsOpen(open, immediate = false) {
      const fromTransform = window.getComputedStyle(contentsDisclosure).transform;
      const fromHandleTransform = window.getComputedStyle(summary).transform;
      const fromRotation = window.getComputedStyle(chevron).transform;
      const version = ++transitionVersion;
      desiredOpen = open;
      contentsAnimations.forEach(animation => animation.cancel());
      contentsAnimations = [];
      summary.setAttribute('aria-expanded', String(open));
      panel.inert = !open;

      if (immediate || reducedMotion.matches || typeof summary.animate !== 'function') {
        measureContents();
        contentsDisclosure.open = open;
        contentsDisclosure.style.transform = `translateX(${open ? 0 : closedShift}px)`;
        summary.style.transform = `translateX(${open ? 0 : -closedShift}px)`;
        return;
      }

      // The drawer slides beneath a stationary handle on one shared timeline.
      contentsDisclosure.open = true;
      const targetTransform = `translateX(${open ? 0 : closedShift}px)`;
      const targetHandleTransform = `translateX(${open ? 0 : -closedShift}px)`;
      const options = { duration: 340, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' };
      contentsAnimations = [
        contentsDisclosure.animate([{ transform: fromTransform }, { transform: targetTransform }], options),
        summary.animate([{ transform: fromHandleTransform }, { transform: targetHandleTransform }], options),
        chevron.animate([{ transform: fromRotation }, { transform: `rotate(${open ? 0 : 180}deg)` }], options),
      ];
      const startTime = document.timeline.currentTime;
      if (startTime !== null) contentsAnimations.forEach(animation => { animation.startTime = startTime; });
      Promise.all(contentsAnimations.map(animation => animation.finished)).then(() => {
        if (version !== transitionVersion) return;
        contentsDisclosure.style.transform = targetTransform;
        summary.style.transform = targetHandleTransform;
        contentsDisclosure.open = desiredOpen;
        contentsAnimations.forEach(animation => animation.cancel());
        contentsAnimations = [];
      }).catch(() => {
        // Reversing or resizing cancels the old transition; the latest state wins.
      });
    }

    setContentsOpen(desiredOpen, true);
    summary.addEventListener('click', event => {
      event.preventDefault();
      setContentsOpen(!desiredOpen);
    });
    window.addEventListener('resize', () => setContentsOpen(desiredOpen, true));
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) setContentsOpen(desiredOpen, true);
    });
    contentsLinks.forEach(link => link.addEventListener('click', () => {
      const target = document.querySelector(link.hash);
      if (target) {
        target.tabIndex = -1;
        window.requestAnimationFrame(() => target.focus({ preventScroll: true }));
      }
    }));
  }
  updateReadingPosition();
  observePies();
  observeBars();
  observeReveals();
})();
