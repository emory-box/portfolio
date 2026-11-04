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
  const revealedEntrances = new WeakSet();
  const entranceGroups = new Map();
  let entrancesInitialized = false;
  let barsInitialized = false;
  let piesInitialized = false;
  let pieObserver;
  let barObserver;

  function revealEntrance(root, immediate = false) {
    const animations = entranceGroups.get(root);
    if (!animations) return;
    revealedEntrances.add(root);
    revealObserver?.unobserve(root);
    const heading = root.closest('.source-section')?.querySelector('.source-title');
    const headingAnimation = root !== heading && entranceGroups.get(heading)?.[0];
    const lead = headingAnimation ? Math.max(0, 200 - (headingAnimation.currentTime || 0)) : 0;
    if (!immediate && lead) animations.forEach(animation => {
      animation.effect.updateTiming({ delay: animation.effect.getTiming().delay + lead });
    });
    animations.forEach(animation => immediate ? animation.finish() : animation.play());
  }

  function observeBars() {
    barObserver?.disconnect();
    document.querySelectorAll('.bar-pending').forEach(chart => chart.classList.remove('bar-pending'));
    const preserveVisible = barsInitialized;
    barsInitialized = true;
    if (!('IntersectionObserver' in window) || typeof Element.prototype.animate !== 'function') return;
    barObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const target = entry.target;
        const requiredHeight = Math.min(entry.boundingClientRect.height * .95, window.innerHeight * .75);
        if (!entry.isIntersecting || revealedBars.has(target)) return;
        if (!reducedMotion.matches && entry.intersectionRect.height < requiredHeight) return;
        revealedBars.add(target);
        barObserver.unobserve(target);
        target.classList.remove('bar-pending');
        if (reducedMotion.matches) return;
        revealEntrance(target.closest('figure')?.querySelector('.survey-bar-title'), true);
        animate(target.querySelector('.bar-grid'), [
          { opacity: 0 }, { opacity: 1 },
        ], 100, 550);
        const offsets = [160, 0, 300, 80];
        const chartIndex = Array.from(document.querySelectorAll('.bar-chart')).indexOf(target);
        target.querySelectorAll('.bar-column').forEach((column, index) => {
          animate(column, [
            { transform: 'scaleY(0)' },
            { transform: 'scaleY(1)' },
          ], 700 + offsets[(index + chartIndex) % offsets.length], 900 + index * 50);
        });
      });
    }, { threshold: [0, .25, .5, .75, .95, 1], rootMargin: '0px 0px -24px 0px' });
    document.querySelectorAll('.bar-chart').forEach(img => {
      if (!revealedBars.has(img)) {
        const bounds = img.getBoundingClientRect();
        if (preserveVisible && bounds.top < window.innerHeight && bounds.bottom > 0) {
          revealedBars.add(img);
          return;
        }
        if (!reducedMotion.matches) img.classList.add('bar-pending');
        barObserver.observe(img);
      }
    });
  }

  function observePies() {
    pieObserver?.disconnect();
    document.querySelectorAll('.pie-pending').forEach(chart => chart.classList.remove('pie-pending'));
    const preserveVisible = piesInitialized;
    piesInitialized = true;
    if (!('IntersectionObserver' in window) || !CSS.registerProperty || typeof Element.prototype.animate !== 'function') return;
    pieObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const target = entry.target;
        const requiredHeight = Math.min(entry.boundingClientRect.height * .85, window.innerHeight * .65);
        if (!entry.isIntersecting || revealedPies.has(target)) return;
        if (!reducedMotion.matches && entry.intersectionRect.height < requiredHeight) return;
        revealedPies.add(target);
        pieObserver.unobserve(target);
        target.classList.remove('pie-pending');
        if (reducedMotion.matches) return;
        revealEntrance(target.closest('figure')?.querySelector('.demographic-title'), true);
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
    }, { threshold: [0, .25, .5, .65, .85, 1], rootMargin: '0px 0px -24px 0px' });
    document.querySelectorAll('.demographic-charts img').forEach(img => {
      if (!revealedPies.has(img)) {
        const bounds = img.getBoundingClientRect();
        if (preserveVisible && bounds.top < window.innerHeight && bounds.bottom > 0) {
          revealedPies.add(img);
          return;
        }
        if (!reducedMotion.matches) img.classList.add('pie-pending');
        pieObserver.observe(img);
      }
    });
  }

  // Web Animations leave the underlying content visible if scripting is unavailable.
  function animate(element, frames, delay = 0, duration = 600, easing = 'cubic-bezier(.2,.7,.2,1)') {
    if (reducedMotion.matches || !element || typeof element.animate !== 'function') return;
    const animation = element.animate(frames, {
      duration,
      delay,
      fill: 'backwards',
      easing,
    });
    runningAnimations.add(animation);
    const release = () => runningAnimations.delete(animation);
    animation.addEventListener('finish', release, { once: true });
    animation.addEventListener('cancel', release, { once: true });
    return animation;
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
    revealObserver?.disconnect();
    entranceGroups.forEach(animations => animations.forEach(animation => animation.cancel()));
    entranceGroups.clear();
    const preserveVisible = entrancesInitialized;
    entrancesInitialized = true;
    if (!('IntersectionObserver' in window)) return;
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (reducedMotion.matches) {
          revealedEntrances.add(entry.target);
          revealObserver.unobserve(entry.target);
        } else revealEntrance(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -48px 0px' });

    function prepare(root, elements = [root]) {
      if (revealedEntrances.has(root)) return;
      const bounds = root.getBoundingClientRect();
      // Re-enabling motion must not hide text already on screen or above it.
      if (bounds.bottom <= 0 || (preserveVisible && bounds.top < window.innerHeight)) {
        revealedEntrances.add(root);
        return;
      }
      if (reducedMotion.matches) { revealObserver.observe(root); return; }
      const animations = elements.map((element, index) => {
        const frames = [
          { opacity: 0, transform: 'translateY(12px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ];
        if (element.getBoundingClientRect().height < 320 && !element.querySelector('img, svg')) {
          frames[0].filter = 'blur(4px)';
          frames[1].filter = 'blur(0)';
        }
        const animation = animate(element, frames, index * 100, 300, 'ease-out');
        if (animation) { animation.pause(); animation.currentTime = 0; }
        return animation;
      }).filter(Boolean);
      if (!animations.length) return;
      entranceGroups.set(root, animations);
      Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
        if (entranceGroups.get(root) === animations) entranceGroups.delete(root);
      });
      revealObserver.observe(root);
    }

    document.querySelectorAll('.source-title').forEach(title => {
      const intro = title.nextElementSibling;
      const hasIntro = intro?.matches('p, ul, .hifi-intro-copy');
      prepare(title, hasIntro ? [title, intro] : [title]);
    });
    document.querySelectorAll('.motivation-card > div, .segments article, .persona-identity, .persona-description > *, .persona-bottom > div, .part, .demographic-title, .survey-bar-title').forEach(element => prepare(element));
    document.querySelectorAll('.hifi-copy').forEach(copy => prepare(copy, Array.from(copy.children)));
  }

  document.addEventListener('focusin', event => {
    entranceGroups.forEach((animations, root) => {
      if (animations.some(animation => animation.effect.target.contains(event.target))) revealEntrance(root, true);
    });
  });

  function updateMotionPreference() {
    observePies();
    observeBars();
    if (reducedMotion.matches) {
      runningAnimations.forEach(animation => animation.cancel());
      runningAnimations.clear();
    }
    observeReveals();
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
      summary.setAttribute('aria-label', `${open ? 'Close' : 'Open'} Contents`);
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
  function initializeHiFiVideos() {
    const videos = Array.from(document.querySelectorAll('.hifi-video'));
    if (!videos.length) return;
    const help = document.querySelector('.hifi-help');
    const visitorPaused = new WeakSet();
    const controllerPaused = new WeakSet();
    const pendingPlay = new WeakMap();
    let active = null;
    let frame = null;
    let request = 0;

    function pause(video) {
      if (video.paused) return;
      controllerPaused.add(video);
      video.pause();
    }

    function visibleCandidate() {
      const fullscreen = document.fullscreenElement;
      if (fullscreen) return fullscreen.classList.contains('hifi-player')
        ? fullscreen.querySelector('.hifi-video') : fullscreen.matches('.hifi-video') ? fullscreen : null;
      const nativeFullscreen = videos.find(video => video.webkitDisplayingFullscreen);
      if (nativeFullscreen) return nativeFullscreen;
      let candidate = null;
      let nearest = Infinity;
      for (const video of videos) {
        const rect = video.getBoundingClientRect();
        const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        const minimum = Math.min(rect.height * .6, window.innerHeight * .6);
        if (!rect.height || visible < minimum || rect.right <= 0 || rect.left >= window.innerWidth) continue;
        const distance = Math.abs((rect.top + rect.bottom) / 2 - window.innerHeight / 2);
        // Paired gallery demos share a center. Keep the visitor's active
        // choice until another row is closer, rather than favoring its sibling.
        if (distance < nearest - 1 || (Math.abs(distance - nearest) <= 1 && video === active)) {
          nearest = distance;
          candidate = video;
        }
      }
      return candidate;
    }

    function update() {
      frame = null;
      if (document.hidden) {
        videos.forEach(video => { pendingPlay.delete(video); pause(video); });
        active = null;
        return;
      }
      const candidate = visibleCandidate();
      if (candidate !== active) {
        videos.forEach(video => { if (video !== candidate) pause(video); });
        active = candidate;
      }
      if (!candidate || reducedMotion.matches || visitorPaused.has(candidate) || !candidate.paused || pendingPlay.has(candidate)) return;
      candidate.muted = true;
      const token = ++request;
      pendingPlay.set(candidate, token);
      try {
        const result = candidate.play();
        if (result?.then) {
          result.then(() => {
            if (pendingPlay.get(candidate) === token && (active !== candidate || document.hidden || reducedMotion.matches)) pause(candidate);
          }).catch(() => {
            // Native controls remain available when autoplay is unavailable.
          }).finally(() => {
            if (pendingPlay.get(candidate) === token) pendingPlay.delete(candidate);
          });
        } else pendingPlay.delete(candidate);
      } catch {
        pendingPlay.delete(candidate);
      }
    }

    function schedule() {
      if (frame === null) frame = window.requestAnimationFrame(update);
    }

    function motionChanged() {
      videos.forEach(video => { pendingPlay.delete(video); pause(video); });
      active = null;
      if (help) help.textContent = reducedMotion.matches
        ? 'Use the video controls to play a demo. Other demos pause automatically.'
        : 'Scroll to a feature to play its demo. Other demos pause automatically. You can pause or replay with the video controls.';
      schedule();
    }

    videos.forEach(video => {
      video.addEventListener('play', () => {
        if (document.hidden || (pendingPlay.has(video) && active !== video)) { pause(video); return; }
        if (pendingPlay.has(video)) return;
        visitorPaused.delete(video);
        active = video;
        videos.forEach(other => { if (other !== video) pause(other); });
      });
      video.addEventListener('pause', () => {
        if (controllerPaused.delete(video)) return;
        visitorPaused.add(video);
      });
      video.addEventListener('webkitbeginfullscreen', schedule);
      video.addEventListener('webkitendfullscreen', schedule);
    });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', update);
    document.addEventListener('fullscreenchange', schedule);
    reducedMotion.addEventListener('change', motionChanged);
    motionChanged();
  }

  function initializeHiFiControls() {
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !document.fullscreenElement?.classList.contains('hifi-player')) return;
      event.preventDefault();
      try { document.exitFullscreen()?.catch(() => {}); } catch { /* Fullscreen may already be exiting. */ }
    });
    const formatTime = seconds => {
      const value = Math.max(0, Math.floor(Number(seconds) || 0));
      return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
    };
    document.querySelectorAll('.hifi-player').forEach(player => {
      const video = player.querySelector('video');
      const controls = player.querySelector('.hifi-controls');
      if (!video || !controls) return;
      const play = controls.querySelector('[data-player-play]');
      const seek = controls.querySelector('[data-player-seek]');
      const sound = controls.querySelector('[data-player-sound]');
      const expand = controls.querySelector('[data-player-expand]');
      const time = controls.querySelector('[data-player-time]');
      const title = player.dataset.playerTitle;
      let wasFullscreen = false;

      function update() {
        const duration = Number.isFinite(video.duration) ? video.duration : Number(video.dataset.duration) || 0;
        const playing = !video.paused;
        play.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${title} demo`);
        play.dataset.playing = String(playing);
        sound.setAttribute('aria-pressed', String(!video.muted));
        sound.querySelector('.sound-icon').toggleAttribute('hidden', video.muted);
        sound.querySelector('.muted-icon').toggleAttribute('hidden', !video.muted);
        seek.disabled = video.readyState === 0 || !duration;
        seek.max = duration;
        seek.value = video.currentTime;
        seek.style.setProperty('--played', `${duration ? video.currentTime / duration * 100 : 0}%`);
        seek.setAttribute('aria-valuetext', `${formatTime(video.currentTime)} of ${formatTime(duration)}`);
        time.textContent = `${formatTime(video.currentTime)} / ${formatTime(duration)}`;
      }

      play.addEventListener('click', () => {
        if (!video.paused) { video.pause(); update(); return; }
        try {
          const attempt = video.play();
          update();
          attempt?.catch(update);
        } catch { update(); }
      });
      seek.addEventListener('input', () => {
        if (video.readyState > 0) video.currentTime = Number(seek.value);
        update();
      });
      sound.addEventListener('click', () => { video.muted = !video.muted; update(); });
      if (!player.requestFullscreen && !video.webkitEnterFullscreen) expand.hidden = true;
      expand.addEventListener('click', () => {
        try {
          const attempt = document.fullscreenElement === player
            ? document.exitFullscreen()
            : player.requestFullscreen ? player.requestFullscreen() : video.webkitEnterFullscreen();
          attempt?.catch(() => {});
        } catch {
          // Unsupported fullscreen leaves all playback controls available.
        }
      });
      document.addEventListener('fullscreenchange', () => {
        const fullscreen = document.fullscreenElement === player;
        expand.setAttribute('aria-label', fullscreen ? `Exit ${title} demo fullscreen` : `View ${title} demo fullscreen`);
        if (wasFullscreen && !document.fullscreenElement) expand.focus({ preventScroll: true });
        wasFullscreen = fullscreen;
      });
      ['loadedmetadata', 'durationchange', 'timeupdate', 'play', 'pause', 'volumechange', 'ended', 'emptied'].forEach(event => video.addEventListener(event, update));
      const nativeFallback = () => {
        player.classList.remove('is-enhanced');
        controls.hidden = true;
        video.controls = true;
      };
      video.addEventListener('error', nativeFallback);
      video.querySelectorAll('source').forEach(source => source.addEventListener('error', nativeFallback));
      update();
      play.querySelector('.pause-icon').removeAttribute('hidden');
      video.controls = false;
      controls.hidden = false;
      player.classList.add('is-enhanced');
    });
  }

  initializeHiFiControls();
  initializeHiFiVideos();
  updateReadingPosition();
  observePies();
  observeBars();
  observeReveals();
})();
