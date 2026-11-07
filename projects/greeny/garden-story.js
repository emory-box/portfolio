import {createGardenOverlay} from './garden-overlay.js';

const story = document.querySelector('.garden-story');

if (story) {
  const steps = [...story.querySelectorAll('[data-garden-step]')];
  const copies = steps.map(step => step.querySelector('.garden-copy'));
  const view = story.querySelector('.garden-view');
  const progress = story.querySelector('.garden-progress');
  const current = story.querySelector('.garden-current');
  const count = story.querySelector('.garden-count');
  const pause = story.querySelector('.garden-motion');
  const readings = story.querySelector('.garden-readings');
  const sensorStatus = story.querySelector('.garden-sensor-state');
  const hubStatus = story.querySelector('.garden-hub-state');
  const overlay = createGardenOverlay(story.querySelector('.garden-effects'));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 999px)');
  const short = matchMedia('(max-height: 560px)');
  const names = ['Garden', 'Sensors', 'Sprinkle', 'Ventilation', 'Shade', 'Grow lights', 'Connectivity', 'Remote care'];
  const annotations = {
    1:{name:'Sensor',anchor:'sensor'}, 2:{name:'Sprinkle',anchor:'sprinkle'},
    3:{name:'Fan',anchor:'fan'}, 4:{name:'Shade',anchor:'shade'},
    5:{name:'Grow lights',anchor:'lamp'}, 6:{name:'Hub',anchor:'hub'},
    7:{name:'Hub',anchor:'hub'},
  };
  const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
  let centers = [], scene, frame = 0, previous = 0, visible = true, position = 0;
  let paused = false, animationTime = 0, fallbackOnly = false;
  let sensorState = '';

  function setSensorState(next) {
    if (sensorState === next) return;
    sensorState = next;
    story.dataset.sensorState = next;
    readings.setAttribute('aria-hidden', String(next !== 'ready'));
    sensorStatus.textContent = next === 'ready' ? 'Đã nhận thông số' : 'Cảm biến sẵn sàng';
  }

  function measure() {
    centers = steps.map(step => step.getBoundingClientRect().top + scrollY + step.offsetHeight / 2);
    const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h'));
    const bottomInset = parseFloat(getComputedStyle(progress).bottom) || 0;
    const oversized = copies[1].offsetHeight > innerHeight - headerHeight - progress.offsetHeight - bottomInset - 24;
    story.classList.toggle('has-tall-readings', oversized);
    if (oversized) setSensorState('ready');
    schedule();
  }

  function readPosition() {
    const center = scrollY + innerHeight / 2 + parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) / 2;
    let i = 0;
    while (i < centers.length - 2 && center > centers[i + 1]) i++;
    return clamp(i + (center - centers[i]) / Math.max(1, centers[i + 1] - centers[i]), 0, steps.length - 1);
  }

  function update(now) {
    frame = 0;
    if (document.hidden || !visible) return;
    const delta = previous ? Math.min((now - previous) / 1000, .05) : 0;
    previous = now;
    position = readPosition();
    const index = Math.round(position);
    const first = Math.floor(position), fraction = position - first;
    const turn = clamp((fraction - .18) / .64);
    const blend = turn * turn * (3 - 2 * turn);
    const side = first % 2 ? 1 - blend : blend;
    const shift = motion.matches ? (index % 2 ? -56.25 : 0) : -56.25 * side;
    view.style.setProperty('--garden-shift', `${mobile.matches ? 0 : shift}%`);
    progress.style.setProperty('--garden-progress', (position + 1) / steps.length);
    current.textContent = names[index];
    count.textContent = `${index + 1} / ${steps.length}`;
    story.dataset.step = String(index);
    copies.forEach((copy, i) => {
      const distance = Math.abs(position - i);
      // Finish moving the garden before revealing the incoming explanation.
      const opacity = motion.matches || short.matches || copy.contains(document.activeElement) ? 1 : clamp((.18 - distance) / .12);
      copy.style.setProperty('--garden-story-fade', opacity);
      copy.style.pointerEvents = opacity < .05 ? 'none' : '';
    });
    if (motion.matches || paused || fallbackOnly || short.matches || Math.abs(position - 1) < .20) setSensorState('ready');
    // Readings appear on arrival, but the active sensor keeps transmitting on
    // every visit. The shared clock also freezes correctly with Pause.
    const sensorActive = index === 1 && !motion.matches;
    if (scene && !short.matches) {
      if (!paused && !motion.matches) animationTime += delta;
      const continuous = scene.draw({position, index, time: animationTime, delta, reduced: motion.matches, paused, sensorReading: sensorActive});
      const projection = scene.project();
      const annotation = annotations[index];
      const deviceLabel = annotation ? {name:annotation.name,point:projection[annotation.anchor]} : null;
      overlay.update(projection, {reading:sensorActive, deviceLabel, signalTime:animationTime, lightAmount:projection.lightAmount});
      const message = projection.hubReceiving ? 'Hub receiving data' : 'Hub connected';
      if (hubStatus.textContent !== message) hubStatus.textContent = message;
      if (continuous) schedule();
    } else {
      overlay.clear();
    }
  }

  function schedule() {
    if (!frame && visible && !document.hidden) frame = requestAnimationFrame(update);
  }

  function showFallback() {
    fallbackOnly = true;
    story.classList.remove('garden-webgl');
    scene?.dispose();
    scene = null;
    overlay.clear();
    setSensorState('ready');
    hubStatus.textContent = 'Static hub preview';
    updatePause();
    schedule();
  }

  function updatePause() {
    pause.disabled = motion.matches || fallbackOnly;
    story.classList.toggle('is-paused', paused);
    pause.setAttribute('aria-pressed', String(paused));
    pause.textContent = fallbackOnly ? 'Static garden' : motion.matches ? 'Motion reduced' : paused ? 'Resume animation' : 'Pause animation';
    schedule();
  }

  setSensorState(motion.matches || short.matches ? 'ready' : 'pending');
  story.classList.add('garden-ready');
  addEventListener('scroll', schedule, {passive: true});
  addEventListener('resize', measure, {passive: true});
  story.addEventListener('focusin', schedule);
  story.addEventListener('focusout', schedule);
  motion.addEventListener('change', updatePause);
  pause.addEventListener('click', () => { paused = !paused; previous = 0; updatePause(); });
  mobile.addEventListener('change', measure);
  short.addEventListener('change', measure);
  document.addEventListener('visibilitychange', () => { previous = 0; schedule(); });
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(story);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      previous = 0;
      if (visible) schedule();
    }).observe(story);
  }
  measure();
  updatePause();
  document.fonts?.ready.then(measure);
  story.querySelectorAll('img').forEach(img => img.addEventListener('load', measure, {once:true}));
  const canvas = story.querySelector('canvas');
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); showFallback(); });
  import('./garden-scene.js').then(async ({createGardenScene}) => {
    const created = await createGardenScene(canvas);
    if (fallbackOnly) { created.dispose(); return; }
    scene = created;
    story.classList.add('garden-webgl');
    schedule();
  }).catch(() => showFallback());
}
