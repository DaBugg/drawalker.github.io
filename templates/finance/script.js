const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const header = document.getElementById('siteHeader');
const panels = [...document.querySelectorAll('.stack-panel')];
const lowerPage = document.getElementById('lowerPage');

const sceneState = {
  active: 'intro',
  previous: null,
  initialized: false
};

const scenes = {
  intro: { cursor: 'intro', theme: 'dark' },
  personal: { cursor: 'personal', theme: 'dark' },
  business: { cursor: 'business', theme: 'dark' },
  consulting: { cursor: 'consulting', theme: 'light' },
  default: { cursor: 'default', theme: 'light' }
};

function initNavigation() {
  const menuButton = document.getElementById('menuButton');
  const mobileMenu = document.getElementById('mobileMenu');

  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    mobileMenu.classList.toggle('open', !open);
    document.body.classList.toggle('menu-open', !open);
  });

  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  }));
}

function initStickyStory() {
  let frameRequested = false;
  let navOffset = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-offset')) || 88;

  function updateStackMotion() {
    frameRequested = false;
    header.classList.toggle('scrolled', window.scrollY > 18);

    if (reducedMotion || window.innerWidth <= 680) {
      panels.forEach(panel => {
        panel.style.removeProperty('--stack-scale');
        panel.style.removeProperty('--stack-y');
        panel.style.removeProperty('--stack-brightness');
      });
      return;
    }

    const travel = Math.max(1, window.innerHeight - navOffset);
    panels.slice(0, -1).forEach((panel, index) => {
      const incomingTop = panels[index + 1].getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, (window.innerHeight - incomingTop) / travel));
      panel.style.setProperty('--stack-scale', String(1 - progress * .04));
      panel.style.setProperty('--stack-y', `${progress * -24}px`);
      panel.style.setProperty('--stack-brightness', String(1 - progress * .28));
    });
  }

  function requestUpdate() {
    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(updateStackMotion);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', () => {
    navOffset = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-offset')) || 88;
    requestUpdate();
  }, { passive: true });
  requestUpdate();
}

function loadModelForScene(sceneName) {
  const modelId = scenes[sceneName]?.model;
  if (!modelId) return;
  const model = document.getElementById(modelId);
  if (!model || model.getAttribute('src') || !model.dataset.modelSrc) return;
  model.setAttribute('src', model.dataset.modelSrc);
}

function preloadNextScene(sceneName) {
  const order = ['intro', 'personal', 'business', 'consulting'];
  const nextName = order[order.indexOf(sceneName) + 1];
  if (!nextName) return;
  const nextPanel = document.querySelector(`[data-scene="${nextName}"]`);
  const image = nextPanel?.querySelector('.scene-background img');
  if (image) {
    image.loading = 'eager';
    const preloader = new Image();
    preloader.src = image.currentSrc || image.src;
  }
  loadModelForScene(nextName);
}

function updateActiveScene(sceneName) {
  if (!scenes[sceneName]) sceneName = 'default';
  if (sceneState.initialized && sceneState.active === sceneName) return;

  sceneState.previous = sceneState.active;
  sceneState.active = sceneName;
  sceneState.initialized = true;
  const metadata = scenes[sceneName];
  document.body.dataset.cursorScene = metadata.cursor;
  header.classList.toggle('on-light', metadata.theme === 'light');

  document.querySelectorAll('[data-scene-link]').forEach(link => {
    const current = link.dataset.sceneLink === sceneName;
    if (current) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });

  const progress = document.getElementById('storyProgress');
  progress.classList.toggle('is-light', metadata.theme === 'light');
  progress.classList.toggle('is-lower', sceneName === 'default');
  progress.querySelectorAll('[data-progress-scene]').forEach(link => {
    const current = link.dataset.progressScene === sceneName;
    link.classList.toggle('is-active', current);
    if (current) link.setAttribute('aria-current', 'step');
    else link.removeAttribute('aria-current');
  });

  if (sceneName !== 'default') preloadNextScene(sceneName);
}

function initActiveSceneObserver() {
  if (!('IntersectionObserver' in window)) {
    updateActiveScene('intro');
    return;
  }

  const centered = new Set();
  const order = ['intro', 'personal', 'business', 'consulting', 'default'];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const name = entry.target === lowerPage ? 'default' : entry.target.dataset.scene;
      if (entry.isIntersecting) centered.add(name);
      else centered.delete(name);
    });
    const active = [...order].reverse().find(name => centered.has(name));
    if (active) updateActiveScene(active);
  }, { rootMargin: '-49% 0px -49% 0px', threshold: 0 });

  panels.forEach(panel => observer.observe(panel));
  observer.observe(lowerPage);
  updateActiveScene('intro');
}

function initStoryProgress() {
  document.querySelectorAll('.story-progress a').forEach(link => {
    link.addEventListener('click', () => link.blur());
  });
}

function initHeroProductSelector() {
  const hero = document.getElementById('intro');
  const tabs = [...document.querySelectorAll('.hero-mode-tab')];
  const backgrounds = [...document.querySelectorAll('.hero-background')];
  const dots = [...document.querySelectorAll('.progress-dots span')];
  const model = document.getElementById('heroModel');
  const modelStage = document.getElementById('heroModelStage');
  const previous = document.getElementById('previousMode');
  const next = document.getElementById('nextMode');
  if (!hero || !tabs.length || !model || !previous || !next) return;

  const order = ['personal', 'business', 'consulting'];
  const content = {
    personal: { index: '01', label: 'Personal credit', headline: 'See beneath the surface.', copy: 'Track score trends, utilization, inquiries, and account changes without digging through disconnected reports.', cta: 'Review my personal credit', href: '#personal', model: 'assets/ocean-card-3d-comp-v1.glb', alt: 'Interactive Northstar personal credit card', kicker: 'Personal monitoring', value: '742', delta: '+18', description: 'Track score trends, utilization, inquiries, and account changes from one organized view.', features: ['Three bureau score snapshots', 'Account and inquiry monitoring', 'Plain language change explanations'] },
    business: { index: '02', label: 'Business credit', headline: 'Build with more leverage.', copy: 'Organize the signals that influence business credit readiness, financing conversations, and vendor credibility.', cta: 'Review my business profile', href: '#business', model: 'assets/fire-card-3d-comp-v1.glb', alt: 'Interactive Northstar business credit card', kicker: 'Business readiness', value: '3 paths', delta: '', description: 'Organize the signals that influence business credit readiness, financing conversations, and vendor credibility.', features: ['Business profile health checklist', 'Trade account and payment tracking', 'Readiness milestones for future financing'] },
    consulting: { index: '03', label: 'Consultant guidance', headline: 'A calmer route forward.', copy: 'Meet with a consultant to review your reports, identify realistic priorities, and create a documented improvement roadmap.', cta: 'Schedule a consultation', href: '#consulting', model: 'assets/nature-card-3d-comp-v1.glb', alt: 'Interactive Northstar consultant guidance card', kicker: 'Guided improvement', value: '90 days', delta: '', description: 'Meet with a consultant to identify realistic priorities and create a documented improvement roadmap.', features: ['One on one report review', 'Prioritized 30, 60, and 90 day plan', 'Dispute education and documentation support'] }
  };
  let active = 'personal';
  let transitionToken = 0;
  let verticalRotationFrame = 0;
  let verticalRotationAngle = 0;

  function stopVerticalRotation() {
    if (verticalRotationFrame) cancelAnimationFrame(verticalRotationFrame);
    verticalRotationFrame = 0;
  }

  function startVerticalRotation() {
    stopVerticalRotation();
    if (reducedMotion || active === 'personal') return;
    let previousTime = performance.now();
    const rotate = time => {
      const elapsed = Math.min(40, time - previousTime);
      previousTime = time;
      verticalRotationAngle = (verticalRotationAngle + elapsed * .018) % 360;
      model.setAttribute('orientation', `0deg ${verticalRotationAngle.toFixed(2)}deg 0deg`);
      verticalRotationFrame = requestAnimationFrame(rotate);
    };
    verticalRotationFrame = requestAnimationFrame(rotate);
  }

  function render(mode, moveFocus = false) {
    const data = content[mode];
    const index = order.indexOf(mode);
    if (!data) return;
    active = mode;
    hero.dataset.mode = mode;
    document.getElementById('heroModePanel').setAttribute('aria-labelledby', `tab-${mode}`);
    document.getElementById('heroModeLabel').textContent = `${data.index} / ${data.label}`;
    document.getElementById('heroHeadline').textContent = data.headline;
    document.getElementById('heroDescription').textContent = data.copy;
    document.getElementById('heroCta').textContent = data.cta;
    document.getElementById('heroCta').href = data.href;
    document.getElementById('contextKicker').textContent = data.kicker;
    document.getElementById('contextValue').textContent = data.value;
    document.getElementById('contextDelta').textContent = data.delta;
    document.getElementById('contextDelta').hidden = !data.delta;
    document.getElementById('contextDescription').textContent = data.description;
    document.getElementById('contextFeatures').replaceChildren(...data.features.map(feature => Object.assign(document.createElement('li'), { textContent: feature })));
    document.getElementById('heroProgressText').textContent = `${data.index} / 03`;
    modelStage.dataset.model = mode;
    modelStage.dataset.rotationAxis = mode === 'personal' ? 'horizontal' : 'vertical';
    model.src = data.model;
    model.alt = data.alt;
    model.setAttribute('camera-orbit', '0deg 75deg auto');
    if (mode === 'personal') {
      stopVerticalRotation();
      model.removeAttribute('orientation');
      if (!reducedMotion) model.setAttribute('auto-rotate', '');
    } else {
      model.removeAttribute('auto-rotate');
      verticalRotationAngle = 0;
      model.setAttribute('orientation', '0deg 0deg 0deg');
      startVerticalRotation();
    }
    tabs.forEach(tab => {
      const selected = tab.dataset.mode === mode;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && moveFocus) tab.focus({ preventScroll: true });
    });
    backgrounds.forEach(background => {
      const selected = background.dataset.background === mode;
      background.classList.toggle('is-active', selected);
      if (selected && !reducedMotion && !document.hidden) background.play().catch(() => {});
      else background.pause();
    });
    dots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === index));
    previous.disabled = index === 0;
    next.disabled = index === order.length - 1;
    document.getElementById('heroAnnouncement').textContent = `${data.label} selected. ${data.headline}`;
  }

  function activateProduct(mode, moveFocus = false) {
    if (!content[mode] || mode === active) return;
    const token = ++transitionToken;
    if (reducedMotion) return render(mode, moveFocus);
    hero.classList.add('mode-out');
    window.setTimeout(() => {
      if (token !== transitionToken) return;
      render(mode, moveFocus);
      hero.classList.remove('mode-out');
      hero.classList.add('mode-in');
      requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.remove('mode-in')));
    }, 280);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateProduct(tab.dataset.mode));
    tab.addEventListener('keydown', event => {
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      activateProduct(tabs[nextIndex].dataset.mode, true);
    });
  });
  previous.addEventListener('click', () => activateProduct(order[Math.max(0, order.indexOf(active) - 1)]));
  next.addEventListener('click', () => activateProduct(order[Math.min(order.length - 1, order.indexOf(active) + 1)]));
  render(active);
}

function initCustomCursor() {
  if (!finePointer || reducedMotion || !window.requestAnimationFrame) return;
  const cursor = document.querySelector('.custom-cursor');
  const label = cursor.querySelector('.custom-cursor__label');
  const accents = [...cursor.querySelectorAll('.custom-cursor__accent')];
  const state = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    renderedX: window.innerWidth / 2,
    renderedY: window.innerHeight / 2,
    previousX: window.innerWidth / 2,
    previousY: window.innerHeight / 2,
    angle: 0,
    visible: false,
    nativeZone: false,
    initialized: false,
    dragging: false,
    sparkIndex: 0,
    lastSpark: 0
  };

  function renderCursor() {
    state.renderedX += (state.x - state.renderedX) * .18;
    state.renderedY += (state.y - state.renderedY) * .18;
    cursor.style.transform = `translate3d(${state.renderedX}px, ${state.renderedY}px, 0)`;
    cursor.style.setProperty('--cursor-angle', `${state.angle}deg`);
    cursor.classList.toggle('is-visible', state.visible && !state.nativeZone);
    requestAnimationFrame(renderCursor);
  }

  function emitSpark(now, speed) {
    if (document.body.dataset.cursorScene !== 'business' || state.dragging || speed < 5 || now - state.lastSpark < 70) return;
    state.lastSpark = now;
    const accent = accents[state.sparkIndex % accents.length];
    state.sparkIndex += 1;
    accent.classList.remove('is-spark');
    requestAnimationFrame(() => accent.classList.add('is-spark'));
    window.setTimeout(() => accent.classList.remove('is-spark'), 240);
  }

  document.addEventListener('pointermove', event => {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    if (!state.initialized) {
      state.initialized = true;
      document.body.classList.add('has-custom-cursor');
      requestAnimationFrame(renderCursor);
    }
    const deltaX = event.clientX - state.previousX;
    const deltaY = event.clientY - state.previousY;
    state.previousX = event.clientX;
    state.previousY = event.clientY;
    state.x = event.clientX;
    state.y = event.clientY;
    state.angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI + 35;
    state.visible = true;
    emitSpark(event.timeStamp, Math.hypot(deltaX, deltaY));
  }, { passive: true });

  document.addEventListener('pointerover', event => {
    const nativeControl = event.target.closest('input, textarea, select, [contenteditable="true"]');
    state.nativeZone = Boolean(nativeControl);
    const target = event.target.closest('a, button, .model-stage, .hero-model');
    cursor.classList.toggle('is-interactive', Boolean(target) && !nativeControl);
    if (target && !nativeControl) {
      const isModel = target.classList.contains('model-stage') || target.classList.contains('hero-model');
      label.textContent = target.dataset.cursorLabel || (isModel ? 'Drag' : '');
    } else {
      label.textContent = '';
    }
  });

  document.addEventListener('pointerout', event => {
    if (!event.relatedTarget) {
      state.visible = false;
      state.x = window.innerWidth / 2;
      state.y = window.innerHeight / 2;
      state.nativeZone = false;
      cursor.classList.remove('is-interactive', 'is-dragging');
      return;
    }
    const nextControl = event.relatedTarget.closest?.('input, textarea, select, [contenteditable="true"]');
    state.nativeZone = Boolean(nextControl);
    const nextTarget = event.relatedTarget.closest?.('a, button, .model-stage, .hero-model');
    cursor.classList.toggle('is-interactive', Boolean(nextTarget) && !nextControl);
    const nextIsModel = nextTarget?.classList.contains('model-stage') || nextTarget?.classList.contains('hero-model');
    label.textContent = nextTarget?.dataset.cursorLabel || (nextIsModel ? 'Drag' : '');
  });

  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('.model-stage, .hero-model')) return;
    state.dragging = true;
    cursor.classList.add('is-dragging');
    label.textContent = 'Dragging';
  });

  document.addEventListener('pointerup', () => {
    if (!state.dragging) return;
    state.dragging = false;
    cursor.classList.remove('is-dragging');
    label.textContent = 'Drag';
  });

  window.addEventListener('blur', () => {
    state.visible = false;
    state.x = window.innerWidth / 2;
    state.y = window.innerHeight / 2;
  });
}

function initModelPlaceholders() {
  const models = [...document.querySelectorAll('model-viewer')];
  const cameraOrbits = new Map(models.map(model => [model.id, 0]));

  models.forEach(model => {
    const stage = model.closest('.model-stage, .hero-model');
    const markLoaded = () => stage?.classList.add('is-loaded');
    model.addEventListener('load', markLoaded, { once: true });
    if (model.loaded) markLoaded();
    if (reducedMotion) {
      model.removeAttribute('camera-controls');
      model.removeAttribute('auto-rotate');
    }
  });

  if ('IntersectionObserver' in window) {
    const loader = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const model = entry.target.querySelector('model-viewer[data-model-src]');
        if (model && !model.getAttribute('src')) model.setAttribute('src', model.dataset.modelSrc);
        loader.unobserve(entry.target);
      });
    }, { rootMargin: '70% 0px' });
    document.querySelectorAll('.model-stage').forEach(stage => loader.observe(stage));
  }

  document.querySelectorAll('[data-rotate-target]').forEach(button => {
    if (reducedMotion) {
      button.disabled = true;
      return;
    }
    button.addEventListener('click', () => {
      const model = document.getElementById(button.dataset.rotateTarget);
      if (!model) return;
      const nextOrbit = (cameraOrbits.get(model.id) || 0) + Number(button.dataset.direction) * 30;
      cameraOrbits.set(model.id, nextOrbit);
      model.setAttribute('camera-orbit', `${nextOrbit}deg 75deg auto`);
    });
  });
}

function initStickyTools() {
  const tools = [...document.querySelectorAll('.sticky-tool')];

  function setCounterValue(element, value) {
    const prefix = element.dataset.countPrefix || '';
    const suffix = element.dataset.countSuffix || '';
    element.textContent = `${prefix}${value}${suffix}`;
  }

  function animateCounters(tool) {
    tool.querySelectorAll('[data-count-to]').forEach((element, index) => {
      if (element.dataset.counted === 'true') return;
      element.dataset.counted = 'true';
      const destination = Number(element.dataset.countTo);
      if (reducedMotion || !Number.isFinite(destination)) {
        setCounterValue(element, destination);
        return;
      }
      const duration = 850 + index * 90;
      const start = performance.now();
      const count = time => {
        const progress = Math.min(1, (time - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCounterValue(element, Math.round(destination * eased));
        if (progress < 1) requestAnimationFrame(count);
      };
      requestAnimationFrame(count);
    });
  }

  tools.forEach(tool => {
    tool.querySelectorAll('[data-count-to]').forEach(element => {
      if (reducedMotion) setCounterValue(element, Number(element.dataset.countTo));
      else setCounterValue(element, 0);
    });
  });

  if (reducedMotion || !('IntersectionObserver' in window)) {
    tools.forEach(tool => {
      tool.classList.add('is-in-view');
      animateCounters(tool);
    });
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in-view');
        animateCounters(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: .35 });
    tools.forEach(tool => observer.observe(tool));
  }

  const roadmap = document.getElementById('roadmapTool');
  const slide = document.getElementById('roadmapSlide');
  const previous = document.getElementById('roadmapPrevious');
  const next = document.getElementById('roadmapNext');
  if (!roadmap || !slide || !previous || !next) return;

  const phases = [
    {
      range: 'Days 01–30', title: 'Stabilize',
      description: 'Verify reporting details, organize documents, and lower the highest-impact utilization balances.',
      actions: ['Audit all three reports', 'Organize supporting records', 'Target high utilization first'],
      status: '3 actions in progress', checkpoint: 'Next check-in · Day 14', progress: '34%'
    },
    {
      range: 'Days 31–60', title: 'Strengthen',
      description: 'Build consistent payment evidence and address the next priority items in the right sequence.',
      actions: ['Confirm reporting updates', 'Maintain payment cadence', 'Review remaining disputes'],
      status: '4 actions planned', checkpoint: 'Consultant review · Day 45', progress: '67%'
    },
    {
      range: 'Days 61–90', title: 'Prepare',
      description: 'Measure movement, review remaining gaps, and prepare for the next financial decision.',
      actions: ['Compare score movement', 'Close documentation gaps', 'Set the next milestone'],
      status: 'Final review checkpoint', checkpoint: 'Progress review · Day 90', progress: '100%'
    }
  ];
  const dots = [...roadmap.querySelectorAll('[data-roadmap-index]')];
  let activeIndex = 0;
  let changing = false;

  function updateContent(index) {
    const phase = phases[index];
    document.getElementById('roadmapRange').textContent = phase.range;
    document.getElementById('roadmapTitle').textContent = phase.title;
    document.getElementById('roadmapDescription').textContent = phase.description;
    document.getElementById('roadmapActions').replaceChildren(...phase.actions.map(action => Object.assign(document.createElement('li'), { textContent: action })));
    document.getElementById('roadmapStatus').textContent = phase.status;
    document.getElementById('roadmapCheckpoint').textContent = phase.checkpoint;
    document.getElementById('roadmapPosition').textContent = `0${index + 1} / 03`;
    document.getElementById('roadmapProgressBar').style.setProperty('--progress', phase.progress);
    previous.disabled = index === 0;
    next.disabled = index === phases.length - 1;
    dots.forEach((dot, dotIndex) => {
      const selected = dotIndex === index;
      dot.classList.toggle('is-active', selected);
      dot.setAttribute('aria-pressed', String(selected));
    });
  }

  function showPhase(index) {
    if (index < 0 || index >= phases.length || index === activeIndex || changing) return;
    const direction = index > activeIndex ? 1 : -1;
    if (reducedMotion) {
      activeIndex = index;
      updateContent(index);
      return;
    }
    changing = true;
    slide.style.setProperty('--slide-direction', `${direction * -20}px`);
    slide.classList.add('is-changing');
    window.setTimeout(() => {
      activeIndex = index;
      updateContent(index);
      slide.style.setProperty('--slide-direction', `${direction * 20}px`);
      void slide.offsetWidth;
      slide.classList.remove('is-changing');
      changing = false;
    }, 220);
  }

  previous.addEventListener('click', () => showPhase(activeIndex - 1));
  next.addEventListener('click', () => showPhase(activeIndex + 1));
  dots.forEach(dot => dot.addEventListener('click', () => showPhase(Number(dot.dataset.roadmapIndex))));
  roadmap.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    showPhase(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
  });
  updateContent(activeIndex);
}

function initDashboardPreview() {
  const chart = document.getElementById('creditChart');
  const bars = [...chart.children];
  const profileLabel = document.getElementById('dashboardProfileLabel');
  const score = document.getElementById('dashboardScore');
  const change = document.getElementById('dashboardChange');
  const summary = document.getElementById('accountSummary');
  const data = {
    personal: {
      label: 'Personal score', score: '742', summary: 'Utilization decreased on one account',
      ranges: { 3: [43,48,54,61,66,73,82], 6: [34,42,49,58,67,79,88], 12: [25,34,31,47,54,69,88] }
    },
    business: {
      label: 'Business readiness', score: '78%', summary: 'Two readiness milestones completed',
      ranges: { 3: [38,44,50,57,63,69,78], 6: [29,36,43,49,58,68,78], 12: [22,29,34,42,50,62,78] }
    }
  };
  let activeProfile = 'personal';
  let activeRange = '6';
  let dashboardVisible = reducedMotion;
  let scoreFrame = 0;

  function animateScore(value) {
    if (scoreFrame) cancelAnimationFrame(scoreFrame);
    const destination = Number.parseInt(value, 10);
    const suffix = value.includes('%') ? '%' : '';
    if (reducedMotion || !dashboardVisible) {
      score.textContent = dashboardVisible ? value : `0${suffix}`;
      return;
    }
    const initial = Number.parseInt(score.textContent, 10) || 0;
    const started = performance.now();
    const duration = 900;
    const count = time => {
      const progress = Math.min(1, (time - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      score.textContent = `${Math.round(initial + (destination - initial) * eased)}${suffix}`;
      if (progress < 1) scoreFrame = requestAnimationFrame(count);
      else scoreFrame = 0;
    };
    scoreFrame = requestAnimationFrame(count);
  }

  function updateDashboard() {
    const profile = data[activeProfile];
    profileLabel.textContent = profile.label;
    animateScore(profile.score);
    change.textContent = `${activeProfile === 'personal' ? '+18' : '+9'} in ${activeRange === '12' ? '1 year' : `${activeRange} months`}`;
    summary.textContent = profile.summary;
    bars.forEach((bar, index) => bar.style.setProperty('--h', `${profile.ranges[activeRange][index]}%`));
    bars.at(-1).querySelector('b').textContent = profile.score;
    chart.setAttribute('aria-label', `${profile.label} history over ${activeRange === '12' ? 'one year' : `${activeRange} months`}`);
  }

  document.querySelectorAll('[data-profile]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.classList.contains('is-active')));
    button.addEventListener('click', () => {
      activeProfile = button.dataset.profile;
      document.querySelectorAll('[data-profile]').forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      updateDashboard();
    });
  });

  document.querySelectorAll('[data-range]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.classList.contains('is-active')));
    button.addEventListener('click', () => {
      activeRange = button.dataset.range;
      document.querySelectorAll('[data-range]').forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      updateDashboard();
    });
  });

  const preview = document.querySelector('.dashboard-preview');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    dashboardVisible = true;
    updateDashboard();
  } else if (preview) {
    score.textContent = '0';
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      dashboardVisible = true;
      updateDashboard();
      observer.disconnect();
    }, { threshold: .3 });
    observer.observe(preview);
  }
}

function initFaq() {
  document.querySelectorAll('.faq-list details').forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      document.querySelectorAll('.faq-list details[open]').forEach(openItem => {
        if (openItem !== item) openItem.removeAttribute('open');
      });
    });
  });
}

function initLowerReveals() {
  const elements = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    elements.forEach(element => element.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12 });
  elements.forEach(element => observer.observe(element));
}

function initConsultationForm() {
  const form = document.getElementById('reviewForm');
  const success = document.getElementById('formSuccess');
  const submit = form.querySelector('[type="submit"]');
  const submitText = submit.querySelector('span');

  function fieldMessage(field) {
    if (field.validity.valueMissing) return 'This field is required.';
    if (field.type === 'email' && field.validity.typeMismatch) return 'Enter a valid email address.';
    if (field.name === 'phone' && field.value.replace(/\D/g, '').length < 10) return 'Enter a valid phone number.';
    return '';
  }

  function validateField(field) {
    const error = form.querySelector(`[data-error-for="${field.name}"]`);
    const message = fieldMessage(field);
    if (error) error.textContent = message;
    field.setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
  }

  form.querySelectorAll('input, select').forEach(field => {
    const error = form.querySelector(`[data-error-for="${field.name}"]`);
    if (error) {
      error.id = `${field.name}Error`;
      field.setAttribute('aria-describedby', error.id);
    }
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('change', () => validateField(field));
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    success.hidden = true;
    const fields = [...form.querySelectorAll('input, select')];
    const valid = fields.map(validateField).every(Boolean);
    if (!valid) {
      fields.find(field => field.getAttribute('aria-invalid') === 'true')?.focus();
      return;
    }

    submit.disabled = true;
    submitText.textContent = 'Sending request…';
    window.setTimeout(() => {
      form.reset();
      fields.forEach(field => field.removeAttribute('aria-invalid'));
      form.querySelectorAll('.field-error').forEach(error => { error.textContent = ''; });
      submit.disabled = false;
      submitText.textContent = 'Book a credit review';
      success.hidden = false;
      success.focus?.();
    }, 700);
  });
}

initNavigation();
initStickyStory();
initActiveSceneObserver();
initStoryProgress();
initCustomCursor();
initModelPlaceholders();
initHeroProductSelector();
initStickyTools();
initDashboardPreview();
initFaq();
initLowerReveals();
initConsultationForm();
