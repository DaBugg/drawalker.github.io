(() => {
  const menu = document.querySelector('[data-menu]');
  const nav = document.querySelector('.site-header nav');

  menu?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.querySelector('i')?.classList.toggle('ph-x', open);
    menu.querySelector('i')?.classList.toggle('ph-list', !open);
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menu?.setAttribute('aria-expanded', 'false');
      menu?.querySelector('i')?.classList.remove('ph-x');
      menu?.querySelector('i')?.classList.add('ph-list');
    });
  });

  const story = document.querySelector('.crate-story');
  const crate = document.querySelector('[data-crate]');
  const chapters = [...document.querySelectorAll('[data-stage]')];
  const cards = [...document.querySelectorAll('[data-card]')];
  const progressBars = [...document.querySelectorAll('.stage-progress i')];
  const stageTitle = document.querySelector('[data-stage-title]');
  const stageCount = document.querySelector('[data-stage-count]');
  const stageTitles = ['01 / Drawing', '02 / Raw material', '03 / Manufactured part', '04 / Inspection record', '05 / Packing label'];
  const staticStory = window.matchMedia('(max-width: 820px), (prefers-reduced-motion: reduce)');
  let activeStage = -1;
  let ticking = false;

  const setStage = (index) => {
    if (index === activeStage || index < 0) return;
    activeStage = index;
    chapters.forEach((chapter, chapterIndex) => {
      chapter.classList.toggle('is-active', chapterIndex === index);
      if (chapterIndex === index) chapter.setAttribute('aria-current', 'step');
      else chapter.removeAttribute('aria-current');
    });
    cards.forEach((card, cardIndex) => card.classList.toggle('is-active', cardIndex === index));
    progressBars.forEach((bar, barIndex) => bar.classList.toggle('is-active', barIndex <= index));
    if (stageTitle) stageTitle.textContent = stageTitles[index];
    if (stageCount) stageCount.textContent = `${String(index + 1).padStart(2, '0')} / 05`;
  };

  const updateStory = () => {
    ticking = false;
    if (!story || !crate || staticStory.matches) {
      crate?.style.setProperty('--open', '1');
      if (stageTitle) stageTitle.textContent = 'Complete package / open box';
      if (stageCount) stageCount.textContent = '05 / 05';
      return;
    }

    const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
    const storyTop = story.getBoundingClientRect().top + window.scrollY - headerHeight;
    const storyRange = Math.max(1, story.offsetHeight - window.innerHeight + headerHeight);
    const storyProgress = Math.min(1, Math.max(0, (window.scrollY - storyTop) / storyRange));
    const lidProgress = Math.min(1, .06 + storyProgress * 4.1);
    crate.style.setProperty('--open', lidProgress.toFixed(3));

    const viewportCenter = headerHeight + (window.innerHeight - headerHeight) * .5;
    let nearest = 0;
    let nearestDistance = Infinity;
    chapters.forEach((chapter, index) => {
      const rect = chapter.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height * .5 - viewportCenter);
      if (distance < nearestDistance) {
        nearest = index;
        nearestDistance = distance;
      }
    });
    setStage(nearest);
  };

  const requestStoryUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateStory);
  };

  if (story) {
    setStage(0);
    updateStory();
    window.addEventListener('scroll', requestStoryUpdate, { passive: true });
    window.addEventListener('resize', requestStoryUpdate);
    staticStory.addEventListener?.('change', () => {
      activeStage = -1;
      requestStoryUpdate();
    });
  }

  const processSpecs = {
    machining: {
      values: ['3- and 5-axis CNC machining', 'Tight-tolerance parts and short production runs', 'STEP file, PDF drawing, material, quantity', 'Inspected parts with requested records'],
      image: 'https://images.unsplash.com/photo-1711418235199-171c8ecb9d12?auto=format&fit=crop&w=1500&q=84',
      alt: 'CNC cutting machine working a metal component',
      caption: 'ROUTE / CNC-05',
      figure: 'Precision part in process'
    },
    fabrication: {
      values: ['Welded fabrication and assemblies', 'Skids, frames, supports, and repeatable weldments', 'Drawing set, weld notes, finish, release plan', 'Labeled assembly with inspection summary'],
      image: 'https://images.unsplash.com/photo-1738162837389-3b02d6dd507b?auto=format&fit=crop&w=1500&q=84',
      alt: 'Welder fabricating a metal assembly in an industrial workshop',
      caption: 'ROUTE / WLD-12',
      figure: 'Controlled fit-up and weld sequence'
    },
    piping: {
      values: ['Shop-built process piping', 'Spools and coordinated piping packages', 'Isometrics, line class, NDE, test requirements', 'Tested spools grouped by system or area'],
      image: 'https://images.unsplash.com/photo-1699322039731-fdc996a9bb1c?auto=format&fit=crop&w=1500&q=84',
      alt: 'Stacked industrial steel pipe prepared for production',
      caption: 'ROUTE / PIP-08',
      figure: 'Material-controlled spool package'
    },
    finishing: {
      values: ['Surface preparation and coating coordination', 'Parts requiring controlled appearance or protection', 'Substrate, preparation standard, coating system', 'Finished components with batch records'],
      image: 'https://images.unsplash.com/photo-1624775106346-874426ec3831?auto=format&fit=crop&w=1500&q=84',
      alt: 'Finished precision metal components after CNC machining',
      caption: 'ROUTE / FIN-04',
      figure: 'Finished surface ready for release'
    }
  };
  const fields = ['name', 'best', 'inputs', 'output'];
  const processTabs = [...document.querySelectorAll('[data-process]')];
  const processImage = document.querySelector('[data-process-image]');
  const processCaption = document.querySelector('[data-process-caption]');
  const processFigure = document.querySelector('[data-process-figure]');

  const selectProcess = (button) => {
    const spec = processSpecs[button.dataset.process];
    if (!spec) return;
    processTabs.forEach((item) => {
      const selected = item === button;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    spec.values.forEach((value, index) => {
      const field = document.querySelector(`[data-spec="${fields[index]}"]`);
      if (field) field.textContent = value;
    });
    if (processImage) {
      processImage.src = spec.image;
      processImage.alt = spec.alt;
    }
    if (processCaption) processCaption.textContent = spec.caption;
    if (processFigure) processFigure.textContent = spec.figure;
  };

  processTabs.forEach((button, index) => {
    button.addEventListener('click', () => selectProcess(button));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + processTabs.length) % processTabs.length;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % processTabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = processTabs.length - 1;
      processTabs[nextIndex].focus();
      selectProcess(processTabs[nextIndex]);
    });
  });

  const form = document.querySelector('[data-form]');
  form?.querySelectorAll('[required]').forEach((field) => {
    field.addEventListener('input', () => {
      field.removeAttribute('aria-invalid');
      const error = form.querySelector(`[data-error="${field.name}"]`);
      if (error) error.textContent = '';
    });
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach((field) => {
      const error = form.querySelector(`[data-error="${field.name}"]`);
      let message = field.value.trim() ? '' : 'This field is required.';
      if (!message && field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value)) message = 'Enter a valid email.';
      if (error) error.textContent = message;
      field.setAttribute('aria-invalid', String(Boolean(message)));
      valid = valid && !message;
    });

    const status = form.querySelector('.form-status');
    if (!valid) {
      if (status) status.textContent = 'Review the highlighted fields.';
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const button = form.querySelector('button');
    button.disabled = true;
    button.textContent = 'Reviewing package…';
    await new Promise((resolve) => window.setTimeout(resolve, 600));
    form.reset();
    button.disabled = false;
    button.innerHTML = 'Submit RFQ <i class="ph ph-arrow-right" aria-hidden="true"></i>';
    if (status) status.textContent = 'RFQ captured for this demo. Connect a secure endpoint before launch.';
  });
})();
