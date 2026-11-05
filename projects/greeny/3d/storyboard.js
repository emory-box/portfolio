(() => {
  'use strict';
  const stage = document.querySelector('.stage');
  const steps = [...document.querySelectorAll('.story-step')];
  const frames = [...document.querySelectorAll('.frame')];
  const buttons = [...document.querySelectorAll('[data-frame]')];
  const labels = steps.map(step => step.querySelector('.step-label span').textContent);
  const turns = [0, 12, 24, 28];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)');
  let active = -1;
  let pending = false;

  function show(index) {
    if (index === active) return;
    active = index;
    stage.dataset.active = index;
    frames.forEach((frame, i) => {
      frame.classList.toggle('is-active', i === index);
      frame.setAttribute('aria-hidden', String(i !== index));
    });
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    buttons.forEach((button, i) => {
      if (i === index) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    document.querySelector('.dashboard').setAttribute('aria-hidden', String(index !== 3));
    document.querySelector('#frame-count').textContent = `0${index + 1} / 04`;
    document.querySelector('#frame-label').textContent = labels[index];
    document.querySelector('#frame-turn').textContent = `${turns[index]}° garden turn`;
  }

  function update() {
    pending = false;
    let nearest = 0;
    let distance = Infinity;
    const readLine = innerWidth <= 700 ? innerHeight * .72 : innerHeight * .5;
    steps.forEach((step, index) => {
      const bounds = step.getBoundingClientRect();
      const delta = Math.abs(bounds.top + bounds.height * .5 - readLine);
      if (delta < distance) { distance = delta; nearest = index; }
    });
    show(nearest);
  }

  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  }

  buttons.forEach((button, index) => button.addEventListener('click', () => {
    const bounds = steps[index].getBoundingClientRect();
    const readLine = innerWidth <= 700 ? innerHeight * .72 : innerHeight * .5;
    scrollTo({ top: scrollY + bounds.top + bounds.height * .5 - readLine,
      behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }));
  document.documentElement.classList.replace('no-js', 'js');
  addEventListener('scroll', schedule, { passive:true });
  addEventListener('resize', schedule);
  show(0);
  update();
})();
