// Native disclosures remain usable without this height-transition enhancement.
(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.deck-flow').forEach(flow => {
    const summary = flow.querySelector(':scope > summary');
    const body = flow.querySelector(':scope > .deck-flow-body');
    let animation;
    let expanded = flow.open;

    const finish = () => {
      animation?.cancel();
      animation = null;
      flow.open = expanded;
      flow.style.removeProperty('height');
      flow.style.removeProperty('overflow');
      delete flow.dataset.closing;
      body.inert = !expanded;
    };

    summary.addEventListener('click', event => {
      event.preventDefault();
      const from = flow.getBoundingClientRect().height;
      animation?.cancel();
      expanded = !expanded;
      flow.open = true;
      flow.toggleAttribute('data-closing', !expanded);
      body.inert = !expanded;
      flow.style.removeProperty('height');
      const border = parseFloat(getComputedStyle(flow).borderTopWidth)
        + parseFloat(getComputedStyle(flow).borderBottomWidth);
      const to = expanded ? flow.getBoundingClientRect().height
        : summary.getBoundingClientRect().height + border;

      if (reducedMotion.matches || !flow.animate) {
        finish();
        return;
      }
      flow.style.overflow = 'hidden';
      flow.style.height = `${to}px`;
      animation = flow.animate(
        [{ height: `${from}px` }, { height: `${to}px` }],
        { duration: 300, easing: 'cubic-bezier(0.2, 0, 0, 1)' }
      );
      animation.onfinish = finish;
    });

    // Resolve to intrinsic height when text size, viewport or motion changes.
    new ResizeObserver(() => { if (animation) finish(); }).observe(summary);
    reducedMotion.addEventListener('change', () => { if (animation) finish(); });
  });
})();

// Keep full-size artwork inside the case study, with a clear way back.
(() => {
  if (typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return;
  const links = [...document.querySelectorAll('.greeny-case-study a[href]')].filter(link =>
    link.querySelector('img,svg') && /\.(svg|png|jpe?g|webp)$/i.test(new URL(link.href).pathname));
  if (!links.length) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'greeny-artifact-dialog';
  dialog.id = 'greeny-artifact-viewer';
  dialog.setAttribute('aria-labelledby', 'greeny-artifact-title');
  dialog.innerHTML = '<header class="greeny-artifact-toolbar"><h2 id="greeny-artifact-title">Image preview</h2><button type="button" data-artifact-close autofocus>Close ×</button><button type="button" data-artifact-size aria-pressed="false">Original size</button></header><div class="greeny-artifact-canvas" tabindex="0" role="region" aria-label="Enlarged image"><img alt=""></div>';
  document.body.append(dialog);
  const title = dialog.querySelector('h2');
  const canvas = dialog.querySelector('.greeny-artifact-canvas');
  const image = canvas.querySelector('img');
  const sizeButton = dialog.querySelector('[data-artifact-size]');
  let opener, position;

  links.forEach(link => {
    const label = link.querySelector('img')?.alt || link.querySelector('svg title')?.textContent
      || link.getAttribute('aria-label')?.replace(/^(Open full |Open )| full diagram.*$| diagram in a new tab$| full image.*$/g, '')
      || 'Image preview';
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', dialog.id);
    link.setAttribute('aria-label', 'Enlarge ' + label);
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      position = {left: scrollX, top: scrollY, behavior: 'instant'};
      title.textContent = label;
      image.alt = label;
      image.src = link.href;
      const visual = link.querySelector('img,svg');
      const sourceWidth = visual.viewBox?.baseVal.width || Number(visual.getAttribute('width'));
      image.style.setProperty('--artifact-source-width', sourceWidth ? `${sourceWidth}px` : 'auto');
      canvas.classList.remove('is-original');
      sizeButton.textContent = 'Original size';
      sizeButton.setAttribute('aria-pressed', 'false');
      dialog.showModal();
      canvas.scrollTo(0, 0);
    });
  });
  sizeButton.addEventListener('click', () => {
    const original = canvas.classList.toggle('is-original');
    sizeButton.textContent = original ? 'Fit to screen' : 'Original size';
    sizeButton.setAttribute('aria-pressed', String(original));
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
    image.removeAttribute('src');
    opener?.focus({preventScroll: true});
    if (position) scrollTo(position);
  });
})();
