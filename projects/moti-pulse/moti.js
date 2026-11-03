(() => {
  'use strict';

  document.documentElement.classList.replace('no-js', 'js');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 761px)');
  const runningAnimations = new Set();
  const links = Array.from(document.querySelectorAll('.chapter-nav a'));
  const chapters = links.map(link => document.querySelector(link.hash)).filter(Boolean);
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
    let currentChapter = chapters[0];
    for (const chapter of chapters) {
      if (chapter.getBoundingClientRect().top <= window.innerHeight * 0.4) currentChapter = chapter;
    }
    links.forEach(link => {
      if (currentChapter && link.hash === '#' + currentChapter.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });

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

  document.querySelectorAll('.hero h1, .hero-lede, .hero .button, .hero-facts, .hero-phone').forEach((element, index) => {
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
  updateReadingPosition();
  observeReveals();
})();
