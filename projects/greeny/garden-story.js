import {createGardenOverlay} from './garden-overlay.js';
import {createGardenConnectivity} from './garden-connectivity.js';
import {createGardenNetworkStory} from './garden-network-story.js';

const story = document.querySelector('.garden-story');

if (story) {
  const steps = [...story.querySelectorAll('[data-garden-step]')];
  const copies = steps.map(step => step.querySelector('.garden-copy'));
  const view = story.querySelector('.garden-view');
  const controls = story.querySelector('.garden-controls');
  const pause = story.querySelector('.garden-motion');
  const readings = story.querySelector('.garden-readings');
  const sensorStatus = story.querySelector('.garden-sensor-state');
  const overlay = createGardenOverlay(story.querySelector('.garden-effects'));
  const connectivity = createGardenConnectivity(story);
  const networkStory = createGardenNetworkStory(steps[6]);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 999px)');
  const short = matchMedia('(max-height: 560px)');
  const annotations = {
    1:{name:'Sensor',anchor:'sensor'}, 2:{name:'Sprinkler',anchor:'sprinkle'},
    3:{name:'Fan',anchor:'fan'}, 4:{name:'Shade',anchor:'shade'},
    5:{name:'Grow lights',anchor:'lamp'}, 6:{name:'Hub',anchor:'hub'},
  };
  const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
  let centers = [], scene, frame = 0, previous = 0, visible = true, position = 0;
  let paused = false, animationTime = 0, fallbackOnly = false;
  let sensorState = '', holds = [];

  function setSensorState(next) {
    if (sensorState === next) return;
    sensorState = next;
    story.dataset.sensorState = next;
    readings.setAttribute('aria-hidden', String(next !== 'ready'));
    sensorStatus.textContent = next === 'ready' ? 'Đã nhận thông số' : 'Cảm biến sẵn sàng';
  }

  function measure() {
    // Measure the natural scenes first. Holds extend their scroll space, not
    // their visible compositions or the camera's seven-stop timeline.
    const savedScrollY = scrollY;
    steps.forEach(step => step.classList.remove('has-device-hold'));
    holds = [];
    const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h'));
    story.classList.toggle('has-connectivity-fallback', fallbackOnly || short.matches);
    networkStory.prepare(!motion.matches && !short.matches && !fallbackOnly);
    const bottomInset = parseFloat(getComputedStyle(controls).bottom) || 0;
    const available = innerHeight - headerHeight - controls.offsetHeight - bottomInset - 24;
    const screenCenter = (innerHeight + headerHeight) / 2;
    // Collect every natural rectangle before extending any section.
    const naturalRect = (step, i) => {
      const rect = step.getBoundingClientRect();
      return {top:rect.top + scrollY, height:rect.height,
        copyOffset:copies[i].getBoundingClientRect().top - rect.top,
        oversized:copies[i].offsetHeight > available};
    };
    const natural = steps.map(naturalRect);
    if (natural[6].oversized) {
      networkStory.prepare(false);
      natural[6] = naturalRect(steps[6],6);
    }
    centers = natural.map(rect => rect.top + rect.height / 2);
    story.classList.toggle('has-tall-readings', natural[1].oversized);
    if (natural[1].oversized) setSensorState('ready');
    let added = 0;
    steps.forEach((step, i) => {
      const rect = natural[i];
      step.classList.toggle('has-tall-copy', rect.oversized);
      if (!annotations[i] || rect.oversized || motion.matches || short.matches || fallbackOnly) return;
      const annotationDistance = clamp(innerHeight * .55, 320, 560);
      const beat = i === 6 && networkStory.enabled ? clamp(innerHeight * .8,480,800) : 0;
      const distance = annotationDistance + beat * networkStory.beats;
      holds[i] = {distance, annotationDistance, beat, quiet:annotationDistance * .18, reveal:annotationDistance * .6,
        start:centers[i] + added - screenCenter};
      step.style.setProperty('--garden-hold-distance', `${distance}px`);
      step.style.setProperty('--garden-annotation-distance', `${annotationDistance}px`);
      step.style.setProperty('--garden-network-beat', `${beat}px`);
      step.style.setProperty('--garden-step-height', `${rect.height}px`);
      step.style.setProperty('--garden-pin-top', `${screenCenter - rect.height / 2}px`);
      step.style.setProperty('--garden-copy-offset', `${rect.copyOffset}px`);
      step.classList.add('has-device-hold');
      added += distance;
    });
    // A measurement must not move the reader if temporary unpinning reduces
    // the document height while they are near the end of the page.
    if (scrollY !== savedScrollY) scrollTo({top:savedScrollY,behavior:'instant'});
    connectivity.invalidate();
    schedule();
  }

  function readPosition() {
    let center = scrollY + innerHeight / 2 + parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) / 2;
    for (const hold of holds) if (hold) center -= clamp(scrollY - hold.start, 0, hold.distance);
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
    story.dataset.step = String(index);
    const networkHold = holds[6];
    let connectivityContentOpacity = 1;
    copies.forEach((copy, i) => {
      const distance = Math.abs(position - i);
      // Finish moving the garden before revealing the incoming explanation.
      const opacity = motion.matches || short.matches || steps[i].classList.contains('has-tall-copy') || copy.contains(document.activeElement) ? 1 : clamp((.18 - distance) / .12);
      copy.style.setProperty('--garden-story-fade', opacity);
      copy.style.pointerEvents = opacity < .05 ? 'none' : '';
      if (i === 6) connectivityContentOpacity = opacity;
    });
    // Prepare readings as soon as Sensors becomes the active stop, including
    // direct jumps and return visits. Only the model annotation waits for scroll.
    if (motion.matches || paused || fallbackOnly || short.matches || index === 1) setSensorState('ready');
    // Content settles first. Further native scrolling reveals the annotation
    // while both the camera and the explanation remain at their device stop.
    const hold = holds[index];
    const deviceReveal = hold ? clamp((scrollY - hold.start - hold.quiet) / hold.reveal) : 1;
    networkStory.update(networkHold?.beat ? (scrollY-networkHold.start-networkHold.annotationDistance)/networkHold.beat : 0);
    story.dataset.deviceReveal = deviceReveal.toFixed(3);
    // The active sensor keeps transmitting on every visit after its reveal.
    // The shared clock also freezes correctly with Pause.
    const sensorActive = index === 1 && !motion.matches && deviceReveal > 0;
    if (scene && !short.matches) {
      if (!paused && !motion.matches) animationTime += delta;
      const continuous = scene.draw({position, index, time: animationTime, delta, reduced: motion.matches, paused, sensorReading: sensorActive});
      const projection = scene.project();
      const annotation = annotations[index];
      const deviceLabel = annotation ? {name:annotation.name,point:projection[annotation.anchor],reveal:deviceReveal} : null;
      overlay.update(projection, {reading:sensorActive, deviceLabel, signalTime:animationTime, lightAmount:projection.lightAmount});
      connectivity.update({active:index===6,reveal:deviceReveal,contentOpacity:connectivityContentOpacity,hub:projection.hub,ground:projection.ground,time:animationTime,reduced:motion.matches});
      if (continuous) schedule();
    } else {
      overlay.clear();
      connectivity.update({active:index===6,reveal:1,contentOpacity:connectivityContentOpacity,reduced:true});
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
    connectivity.clear();
    setSensorState('ready');
    measure();
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

  function followNetworkAnchor() {
    const hold=holds[6];
    if(location.hash!=='#garden-remote'||!networkStory.enabled||!hold?.beat)return;
    scrollTo({top:hold.start+hold.annotationDistance+hold.beat*.5,behavior:'instant'});
  }

  setSensorState(motion.matches || short.matches ? 'ready' : 'pending');
  story.classList.add('garden-ready');
  addEventListener('scroll', schedule, {passive: true});
  addEventListener('resize', measure, {passive: true});
  addEventListener('hashchange', followNetworkAnchor);
  story.addEventListener('focusin', schedule);
  story.addEventListener('focusout', schedule);
  motion.addEventListener('change', () => { measure(); updatePause(); });
  pause.addEventListener('click', () => { paused = !paused; previous = 0; updatePause(); });
  mobile.addEventListener('change', measure);
  short.addEventListener('change', measure);
  document.addEventListener('visibilitychange', () => { previous = 0; schedule(); });
  if ('ResizeObserver' in window) {
    const layoutObserver = new ResizeObserver(measure);
    layoutObserver.observe(story);
    copies.forEach(copy => layoutObserver.observe(copy));
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      previous = 0;
      if (visible) schedule();
    }).observe(story);
  }
  measure();
  updatePause();
  document.fonts?.ready.then(() => { measure();followNetworkAnchor(); });
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
