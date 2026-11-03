(() => {
  'use strict';

  const toc = document.querySelector('.study-toc');
  const toggle = document.querySelector('.toc-toggle');
  const hero = document.querySelector('.moti-hero');
  if (!toc || !toggle || !hero) return;

  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    const collapsed = toc.classList.toggle('is-collapsed');
    toggle.setAttribute('aria-expanded', String(!collapsed));
  });

  const links = Array.from(toc.querySelectorAll('a[href^="#"]'));
  const sections = links.map(link => document.querySelector(link.hash)).filter(Boolean);
  const firstWideSection = document.querySelector('#architecture');
  let scheduled = false;
  let wasWide = false;

  function updateNavigation() {
    const pastHero = hero.getBoundingClientRect().bottom < 24;
    toc.classList.toggle('is-fixed', pastHero);
    const isWide = firstWideSection && firstWideSection.getBoundingClientRect().top < window.innerHeight;
    toc.classList.toggle('is-wide', Boolean(isWide));
    if (Boolean(isWide) !== wasWide) {
      toc.classList.toggle('is-collapsed', Boolean(isWide));
      toggle.setAttribute('aria-expanded', String(!isWide));
      wasWide = Boolean(isWide);
    }
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= window.innerHeight * 0.35) current = section;
    }
    for (const link of links) {
      if (current && link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    scheduled = false;
  }

  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateNavigation);
  }, { passive: true });
  window.addEventListener('resize', updateNavigation);
  updateNavigation();
})();
