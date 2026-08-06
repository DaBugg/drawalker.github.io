(() => {
  const base = document.createElement('script');
  base.src = 'base.js';
  document.head.append(base);

  const canvas = document.querySelector('[data-ops-chart]');
  if (!canvas) return;

  const sites = {
    riverside: {
      program: 'Riverside Program',
      status: '2 schedule-critical exceptions',
      completion: 86,
      start: 61,
      load: 78,
      crews: '9 of 12 crews active',
      exceptions: 6,
      critical: '2 schedule-critical',
      delta: '+8% vs prior period',
      feed: [
        ['ph-warning', 'Material delivery at risk', 'Roof curb package / owner J. Kim', '11:20'],
        ['ph-camera', 'Closeout evidence incomplete', 'Level 06 / owner M. Diaz', '10:42'],
        ['ph-clock', 'Inspection window moved', 'Level 02 / owner A. Ross', '09:15']
      ]
    },
    north: {
      program: 'North Plant Expansion',
      status: '4 readiness constraints',
      completion: 72,
      start: 68,
      load: 92,
      crews: '11 of 12 crews active',
      exceptions: 9,
      critical: '4 readiness-critical',
      delta: '+2% vs prior period',
      feed: [
        ['ph-package', 'Valve package incomplete', 'Utility corridor / owner S. Cole', '12:04'],
        ['ph-warning', 'Permit release pending', 'Process area B / owner T. Gray', '11:36'],
        ['ph-users', 'Crew capacity threshold', 'Mechanical team / owner N. Patel', '10:18'],
        ['ph-clock', 'Access window shortened', 'North gate / owner R. Lane', '08:45']
      ]
    },
    campus: {
      program: 'Campus West Retrofit',
      status: 'Operating inside plan',
      completion: 93,
      start: 73,
      load: 64,
      crews: '7 of 11 crews active',
      exceptions: 2,
      critical: '0 schedule-critical',
      delta: '+11% vs prior period',
      feed: [
        ['ph-camera', 'Final photo set due', 'Building C / owner L. Ortiz', '10:08'],
        ['ph-calendar-check', 'Supervisor approval queued', 'Building A / owner D. King', '09:22']
      ]
    }
  };

  let activeSite = 'riverside';
  let activeRange = 7;

  function pointsFor(site, range) {
    const count = range === 7 ? 7 : range === 30 ? 12 : 18;
    const completion = [];
    const exceptions = [];
    for (let index = 0; index < count; index += 1) {
      const progress = index / (count - 1);
      const wave = Math.sin((index + 1) * 1.7) * (range === 7 ? 2.8 : 4.2);
      completion.push(Math.max(20, Math.min(98, site.start + (site.completion - site.start) * progress + wave)));
      exceptions.push(Math.max(0, site.exceptions + (1 - progress) * (range === 90 ? 11 : range === 30 ? 7 : 5) - wave * .18));
    }
    return { completion, exceptions };
  }

  function drawChart() {
    const site = sites[activeSite];
    const context = canvas.getContext('2d');
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(canvas.clientWidth, 320);
    const height = Math.max(canvas.clientHeight, 220);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);

    const padding = { top: 20, right: 26, bottom: 30, left: 38 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const data = pointsFor(site, activeRange);

    context.strokeStyle = '#2a302d';
    context.lineWidth = 1;
    context.fillStyle = '#727b75';
    context.font = '10px Space Mono, monospace';
    context.textAlign = 'right';
    [0, 25, 50, 75, 100].forEach(value => {
      const y = padding.top + chartHeight - (value / 100) * chartHeight;
      context.beginPath();
      context.moveTo(padding.left, y);
      context.lineTo(width - padding.right, y);
      context.stroke();
      context.fillText(String(value), padding.left - 9, y + 3);
    });

    const plot = (values, color, max, fill) => {
      const coordinates = values.map((value, index) => ({
        x: padding.left + (index / (values.length - 1)) * chartWidth,
        y: padding.top + chartHeight - (value / max) * chartHeight
      }));
      if (fill) {
        const gradient = context.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
        gradient.addColorStop(0, 'rgba(184,244,63,.22)');
        gradient.addColorStop(1, 'rgba(184,244,63,0)');
        context.beginPath();
        context.moveTo(coordinates[0].x, padding.top + chartHeight);
        coordinates.forEach(point => context.lineTo(point.x, point.y));
        context.lineTo(coordinates[coordinates.length - 1].x, padding.top + chartHeight);
        context.closePath();
        context.fillStyle = gradient;
        context.fill();
      }
      context.beginPath();
      coordinates.forEach((point, index) => index ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y));
      context.strokeStyle = color;
      context.lineWidth = fill ? 3 : 2;
      context.lineJoin = 'round';
      context.stroke();
      coordinates.forEach(point => {
        context.beginPath();
        context.arc(point.x, point.y, fill ? 3 : 2.5, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
      });
    };

    plot(data.completion, '#b8f43f', 100, true);
    plot(data.exceptions, '#ff735c', Math.max(20, ...data.exceptions), false);

    context.fillStyle = '#727b75';
    context.textAlign = 'left';
    context.fillText(`${activeRange} days ago`, padding.left, height - 8);
    context.textAlign = 'right';
    context.fillText('Today', width - padding.right, height - 8);
  }

  function updateFeed(items) {
    const feed = document.querySelector('[data-action-feed]');
    feed.innerHTML = items.map(([icon, title, detail, time]) => `<li><i class="ph ${icon}"></i><span><b>${title}</b>${detail}</span><em>${time}</em></li>`).join('');
    document.querySelector('[data-feed-count]').textContent = `${items.length} item${items.length === 1 ? '' : 's'}`;
  }

  function render() {
    const site = sites[activeSite];
    document.querySelectorAll('[data-site]').forEach(button => button.classList.toggle('active', button.dataset.site === activeSite));
    document.querySelector('[data-network-program]').textContent = site.program;
    document.querySelector('[data-network-status]').textContent = site.status;
    document.querySelector('[data-signal-label]').textContent = `${site.program.toUpperCase()} / PERFORMANCE`;
    document.querySelector('[data-signal-title]').textContent = activeRange === 7 ? 'Daily operating signal' : activeRange === 30 ? 'Monthly operating signal' : 'Quarter operating signal';
    document.querySelector('[data-kpi-completion]').textContent = `${site.completion}%`;
    document.querySelector('[data-kpi-delta]').textContent = site.delta;
    document.querySelector('[data-kpi-load]').textContent = `${site.load}%`;
    document.querySelector('[data-kpi-crews]').textContent = site.crews;
    document.querySelector('[data-kpi-exceptions]').textContent = String(site.exceptions).padStart(2, '0');
    document.querySelector('[data-kpi-critical]').textContent = site.critical;
    document.querySelector('[data-chart-caption]').textContent = `Last ${activeRange} days`;
    canvas.setAttribute('aria-label', `${site.program} completion and exception trend over ${activeRange} days`);
    updateFeed(site.feed);
    drawChart();
  }

  document.querySelectorAll('[data-site]').forEach(button => button.addEventListener('click', () => {
    activeSite = button.dataset.site;
    render();
  }));

  document.querySelectorAll('[data-range]').forEach(button => button.addEventListener('click', () => {
    activeRange = Number(button.dataset.range);
    document.querySelectorAll('[data-range]').forEach(item => item.classList.toggle('active', item === button));
    render();
  }));

  const observer = new ResizeObserver(drawChart);
  observer.observe(canvas);
  render();
})();
