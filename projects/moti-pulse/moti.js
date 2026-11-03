(() => {
  'use strict';

  document.documentElement.classList.replace('no-js', 'js');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 761px)');
  const runningAnimations = new Set();
  const contents = document.querySelector('.contents');
  const contentsDisclosure = contents?.querySelector('details');
  const contentsLinks = Array.from(document.querySelectorAll('.contents a'));
  const contentsSections = contentsLinks.map(link => document.querySelector(link.hash));
  const roomyViewport = window.matchMedia('(min-width: 1800px)');
  const hero = document.querySelector('.hero');
  const steps = Array.from(document.querySelectorAll('[data-screen]'));
  const screens = Array.from(document.querySelectorAll('[data-stage]'));
  let revealObserver;
  let framePending = false;

  // Web Animations leave the underlying content visible if scripting is unavailable.
  function animate(element, frames, delay = 0) {
    if (reducedMotion.matches || typeof element.animate !== 'function') return;
    const animation = element.animate(frames, {
      duration: 600,
      delay,
      fill: 'backwards',
      easing: 'cubic-bezier(.2,.7,.2,1)',
    });
    runningAnimations.add(animation);
    const release = () => runningAnimations.delete(animation);
    animation.addEventListener('finish', release, { once: true });
    animation.addEventListener('cancel', release, { once: true });
  }

  function showScreen(name) {
    screens.forEach(screen => {
      const active = !desktop.matches || reducedMotion.matches || screen.dataset.stage === name;
      screen.classList.toggle('is-active', active);
      screen.setAttribute('aria-hidden', String(!active));
    });
  }

  function updateReadingPosition() {
    if (contents && hero) {
      contents.hidden = hero.getBoundingClientRect().bottom > window.innerHeight * 0.75 && !contents.contains(document.activeElement);
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
    let currentStep = steps[0];
    if (desktop.matches && !reducedMotion.matches) {
      for (const step of steps) {
        if (step.getBoundingClientRect().top <= window.innerHeight * 0.5) currentStep = step;
      }
    }
    if (currentStep) showScreen(currentStep.dataset.screen);
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
        if (element.classList.contains('data-chart')) {
          element.querySelectorAll('.chart-bar').forEach((bar, index) => {
            animate(bar, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], index * 80);
          });
        } else {
          animate(element, [
            { opacity: 0, transform: 'translateY(20px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ]);
        }
        revealObserver.unobserve(element);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.chapter-heading, .research-insights article, .segments article, .persona, .data-chart, .donut, .mockup').forEach(element => revealObserver.observe(element));
  }

  function updateMotionPreference() {
    if (revealObserver) revealObserver.disconnect();
    if (reducedMotion.matches) {
      runningAnimations.forEach(animation => animation.cancel());
      runningAnimations.clear();
    } else {
      observeReveals();
    }
    updateReadingPosition();
  }

  document.querySelectorAll('.hero h1, .hero-lede, .hero-tags, .hero-facts, .hero-phone').forEach((element, index) => {
    const restingTransform = window.getComputedStyle(element).transform;
    const transform = restingTransform === 'none' ? '' : restingTransform;
    animate(element, [
      { opacity: 0, transform: transform + ' translateY(28px)' },
      { opacity: 1, transform: restingTransform },
    ], index * 120);
  });

  window.addEventListener('scroll', schedulePositionUpdate, { passive: true });
  window.addEventListener('resize', schedulePositionUpdate);
  desktop.addEventListener('change', updateReadingPosition);
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
      closedShift = bounds.width + window.innerWidth - contents.getBoundingClientRect().right;
      // Reserve the same geometry in both states so the handle never jumps vertically.
      contentsDisclosure.style.width = bounds.width + 'px';
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
    roomyViewport.addEventListener('change', () => {
      const restoreFocus = contentsDisclosure.open && contents.contains(document.activeElement);
      setContentsOpen(roomyViewport.matches, true);
      if (restoreFocus && !desiredOpen) summary.focus();
    });
    window.addEventListener('resize', () => setContentsOpen(desiredOpen, true));
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) setContentsOpen(desiredOpen, true);
    });
    contentsLinks.forEach(link => link.addEventListener('click', () => {
      if (roomyViewport.matches) return;
      setContentsOpen(false);
      const target = document.querySelector(link.hash);
      if (target) {
        target.tabIndex = -1;
        window.requestAnimationFrame(() => target.focus({ preventScroll: true }));
      }
    }));
    contents.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !desiredOpen) return;
      setContentsOpen(false);
      summary.focus();
    });
  }
  updateReadingPosition();
  observeReveals();
})();
