// Progressive enhancements only: the source case study also works without JS.
(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const blocks = [...document.querySelectorAll('[data-reveal]')];
  let revealObserver;
  const revealAll = () => {
    revealObserver?.disconnect();
    blocks.forEach(block => block.classList.remove('is-pending'));
  };
  if ('IntersectionObserver' in window && !motion.matches) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('is-pending');
        revealObserver.unobserve(entry.target);
      });
    }, {rootMargin: '0px 0px -32px 0px', threshold: 0});
    blocks.forEach(block => {
      if (block.getBoundingClientRect().top < innerHeight) return;
      block.classList.add('is-pending');
      revealObserver.observe(block);
    });
    document.documentElement.classList.add('synergy-motion');
  }
  motion.addEventListener('change', revealAll);
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      const target = document.getElementById(link.hash.slice(1));
      target?.closest('[data-reveal]')?.classList.remove('is-pending');
      target?.querySelectorAll('.is-pending').forEach(block => block.classList.remove('is-pending'));
    });
  });

  const dialog = document.querySelector('.artifact-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  dialog.id = 'artifact-dialog';
  const canvas = dialog.querySelector('.dialog-canvas');
  const title = dialog.querySelector('#artifact-title');
  const sizeButton = dialog.querySelector('[data-artifact-size]');
  let opener, readingPosition;
  document.querySelectorAll('[data-enlarge]').forEach(link => {
    link.setAttribute('aria-haspopup','dialog');
    link.setAttribute('aria-controls',dialog.id);
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const art = link.closest('figure').querySelector('.artifact-visual');
      if (!art) return;
      event.preventDefault();
      opener = link;
      readingPosition = {left: scrollX, top: scrollY, behavior: 'instant'};
      title.textContent = link.dataset.enlarge;
      canvas.replaceChildren(art.cloneNode(true));
      canvas.classList.remove('is-original');
      sizeButton.textContent = 'Original size';
      sizeButton.setAttribute('aria-pressed', 'false');
      dialog.showModal();
      canvas.scrollTo(0, 0);
    });
  });
  sizeButton.addEventListener('click', () => {
    const original = canvas.classList.toggle('is-original');
    sizeButton.setAttribute('aria-pressed', String(original));
    sizeButton.textContent = original ? 'Fit to screen' : 'Original size';
  });
  dialog.querySelector('[data-artifact-close]').addEventListener('click', () => dialog.close());
  let outside = false;
  const isOutside = event => {
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right
      || event.clientY < rect.top || event.clientY > rect.bottom;
  };
  dialog.addEventListener('pointerdown', event => { outside = isOutside(event); });
  dialog.addEventListener('click', event => { if (outside && isOutside(event)) dialog.close(); });
  dialog.addEventListener('close', () => {
    canvas.replaceChildren();
    opener?.focus({preventScroll: true});
    if (readingPosition) scrollTo(readingPosition);
  });
})();
