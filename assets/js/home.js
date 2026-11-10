// Progressive enhancement: native scrolling and real links remain the baseline.
(() => {
  const root = document.documentElement;
  const header = document.querySelector('.home-header');
  if (!header) return;
  const menu = document.querySelector('.home-menu-toggle');
  const nav = document.querySelector('.home-nav');
  const main = document.querySelector('main');
  const footer = document.querySelector('.home-footer');
  const story = document.querySelector('.home-feature-story');
  const features = [...document.querySelectorAll('.home-feature')];
  const bio = document.querySelector('.home-bio');
  const words = [...bio.querySelectorAll('.home-bio-word')];
  const cards = [...document.querySelectorAll('[data-home-reveal]')];
  const revealedCards = new WeakSet();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let observer;
  let compact = false;
  let stack = false;

  function closeMenu(restoreFocus = false) {
    root.classList.remove('home-menu-open');
    menu.setAttribute('aria-expanded', 'false');
    menu.textContent = 'Menu';
    main.inert = footer.inert = false;
    if (restoreFocus) menu.focus({preventScroll: true});
  }

  function render() {
    frame = 0;
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 64);
    if (reduced.matches) return;
    const height = innerHeight;
    const hero = Math.min(1, Math.max(0, y / height));
    root.style.setProperty('--hero-shift', `${hero * 55}px`);
    root.style.setProperty('--hero-scale', String(1 + hero * .06));
    const start = story.getBoundingClientRect().top + y;
    const progress = Math.min(1, Math.max(0, (y - start) / (features[0].offsetHeight * 1.3)));
    features.forEach((feature, i) => {
      feature.style.setProperty('--feature-scale', String(stack ? 1 - progress * (i ? .28 : .32) : 1));
      feature.style.setProperty('--feature-shift', `${stack ? progress * (i ? 20 : -40) : 0}px`);
    });
    const rect = bio.getBoundingClientRect();
    const reading = Math.min(1, Math.max(0, (height * .85 - rect.top) / (rect.height + height * .15)));
    words.forEach((word, i) => word.style.setProperty('--word-progress', String(Math.min(1, Math.max(0, reading * (words.length + 4) - i)))));
  }

  function schedule() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(render);
  }

  function configure() {
    const fontSize = parseFloat(getComputedStyle(root).fontSize);
    compact = innerWidth <= 700 || (innerWidth < 1100 && fontSize > 20);
    stack = !reduced.matches && innerHeight >= 560 && fontSize <= 20;
    root.classList.toggle('home-compact', compact);
    root.classList.toggle('home-motion', !reduced.matches);
    root.classList.toggle('home-stack', stack);
    if (!compact) closeMenu();
    root.style.setProperty('--home-nav-height', `${header.offsetHeight}px`);
    observer?.disconnect();
    cards.forEach(card => card.classList.remove('is-pending'));
    if (!reduced.matches && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          revealedCards.add(entry.target);
          entry.target.classList.remove('is-pending');
          observer.unobserve(entry.target);
        }
      }), {threshold: .08});
      cards.forEach(card => {
        // Never hide a card that is already being read or keyboard-focused.
        if (!revealedCards.has(card) && card.getBoundingClientRect().top > innerHeight && !card.contains(document.activeElement)) {
          card.classList.add('is-pending');
          observer.observe(card);
        } else revealedCards.add(card);
      });
    } else cards.forEach(card => revealedCards.add(card));
    schedule();
  }

  root.classList.add('home-enhanced');
  menu.hidden = false;
  menu.addEventListener('click', () => {
    if (menu.getAttribute('aria-expanded') === 'true') return closeMenu(true);
    root.classList.add('home-menu-open');
    menu.setAttribute('aria-expanded', 'true');
    menu.textContent = 'Close';
    main.inert = footer.inert = true;
    nav.querySelector('a').focus();
  });
  document.addEventListener('keydown', event => {
    if (!root.classList.contains('home-menu-open')) return;
    if (event.key === 'Escape') { event.preventDefault(); closeMenu(true); }
    if (event.key === 'Tab') {
      const focusable = [...nav.querySelectorAll('a'), menu];
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  nav.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || !compact || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button) return;
    const target = document.querySelector(link.hash);
    if (!target) return;
    event.preventDefault();
    closeMenu();
    history.pushState(null, '', link.hash);
    target.tabIndex = -1;
    target.focus({preventScroll: true});
    target.scrollIntoView({behavior: reduced.matches ? 'instant' : 'smooth', block: 'start'});
  });
  document.addEventListener('focusin', event => {
    const card = event.target.closest('[data-home-reveal]');
    if (card) { revealedCards.add(card); card.classList.remove('is-pending'); }
    const feature = event.target.closest('.home-feature');
    if (feature && stack) {
      // Bring the focused sticky card to its own slot, including reverse tabbing.
      const top = story.getBoundingClientRect().top + scrollY + features.indexOf(feature) * feature.offsetHeight;
      window.scrollTo({top, behavior: 'instant'});
    }
  });
  addEventListener('scroll', schedule, {passive: true});
  addEventListener('resize', configure, {passive: true});
  reduced.addEventListener('change', configure);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else schedule();
  });
  document.querySelector('.home-profile-details').addEventListener('toggle', schedule);
  if ('ResizeObserver' in window) new ResizeObserver(() => {
    root.style.setProperty('--home-nav-height', `${header.offsetHeight}px`);
    schedule();
  }).observe(header);
  document.fonts.ready.then(configure);
  configure();
})();
