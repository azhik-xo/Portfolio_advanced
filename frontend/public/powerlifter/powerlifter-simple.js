(() => {
  const root = document.documentElement;
  const API_ROOT = (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'))
    ? 'https://ashik-portfolio-backend.onrender.com'
    : '';

  // Escaper helper
  const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // PR Telemetry formatting
  const formatPr = (val, fallback) => {
    if (!val) return fallback;
    let str = String(val).trim().replace(/\s*\([^)]*\)/g, '').trim().toUpperCase();
    if (/^\d+$/.test(str)) str += ' KG';
    return str;
  };

  const updatePrTelemetry = (stats) => {
    if (!stats) return;
    const tot = formatPr(stats.bigThreeTotal, '315 KG');
    const sq = formatPr(stats.squatPR, '110 KG');
    const bp = formatPr(stats.benchPR, '70 KG');
    const dl = formatPr(stats.deadliftPR, '135 KG');

    const eTotal = document.getElementById('teleTotal');
    const eTotalLbs = document.getElementById('teleTotalLbs');
    const eSq = document.getElementById('teleSquat');
    const eBp = document.getElementById('teleBench');
    const eDl = document.getElementById('teleDeadlift');
    const badge = document.getElementById('plStatBadge');

    if (eTotal) eTotal.textContent = tot;
    if (eSq) eSq.textContent = sq;
    if (eBp) eBp.textContent = bp;
    if (eDl) eDl.textContent = dl;
    if (badge) badge.textContent = `${tot} Official Big Three Total`;

    if (eTotalLbs && stats.bigThreeTotal) {
      const m = String(stats.bigThreeTotal).match(/\(([^)]+)\)/);
      if (m && m[1]) eTotalLbs.textContent = m[1];
    }
  };

  // Immediate cache hydration
  try {
    const cachedStats = JSON.parse(localStorage.getItem('ashik_pr_stats') || 'null');
    if (cachedStats) updatePrTelemetry(cachedStats);
  } catch (_) {}

  // Fetch live stats
  fetch(API_ROOT + '/api/portfolio/profile')
    .then(r => r.ok ? r.json() : null)
    .then(json => {
      if (json?.success && json.data?.stats) {
        updatePrTelemetry(json.data.stats);
        try { localStorage.setItem('ashik_pr_stats', JSON.stringify(json.data.stats)); } catch (_) {}
      }
    })
    .catch(() => {});

  /* ---- Items List & State ---- */
  let cachedLifts = null;
  try {
    cachedLifts = JSON.parse(localStorage.getItem('ashik_powerlifting_items') || 'null');
  } catch (_) {}

  let ALL_ITEMS = (cachedLifts && Array.isArray(cachedLifts) && cachedLifts.length > 0)
    ? cachedLifts
    : ((window.POWERLIFTING_ITEMS && Array.isArray(window.POWERLIFTING_ITEMS))
      ? window.POWERLIFTING_ITEMS
      : []);

  let currentFilter = 'all';
  let activeItems = [...ALL_ITEMS];

  const getFiltered = (filter) => {
    const list = (ALL_ITEMS && ALL_ITEMS.length > 0) ? ALL_ITEMS : (window.POWERLIFTING_ITEMS || []);
    if (filter === 'all') return list;
    if (filter === 'video') return list.filter(it => it.mediaType === 'video');
    return list.filter(it => it.category === filter);
  };

  const grid = document.getElementById('plGrid');
  const countEl = document.getElementById('plCount');

  function renderGrid() {
    if (!grid) return;
    if (countEl) countEl.textContent = ALL_ITEMS.length;

    if (!activeItems || activeItems.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:rgba(var(--fg-rgb),.6)">
          <p style="font-size:18px;font-weight:600">No lifts found in this category.</p>
        </div>`;
      return;
    }

    grid.innerHTML = activeItems.map((it, idx) => {
      const isVid = it.mediaType === 'video';
      const badgeHtml = isVid
        ? `<span class="pl-badge-pill pl-badge-vid">▶ VIDEO</span><span class="pl-badge-pill">${esc(it.badge)}</span>`
        : `<span class="pl-badge-pill">${esc(it.badge)}</span>`;

      const s = it.stats || {};
      const tags = [];
      if (s.weight) tags.push(s.weight);
      if (s.reps && s.reps !== '—') tags.push(s.reps);
      if (s.discipline) tags.push(s.discipline);

      return `
        <article class="pl-card" data-idx="${idx}" role="button" tabindex="0" aria-label="${esc(it.title)}">
          <div class="pl-card__media">
            <div class="pl-card__badge">${badgeHtml}</div>
            <img src="${esc(it.thumbnail)}" alt="${esc(it.title)}" loading="lazy" onload="this.classList.add('loaded')">
          </div>
          <div class="pl-card__body">
            <h2 class="pl-card__title">${esc(it.title)}</h2>
            <p class="pl-card__sub">${esc(it.subtitle || s.meet || '')}</p>
            ${tags.length > 0 ? `<div class="pl-card__tags">${tags.map(t => `<span class="pl-tag">${esc(t)}</span>`).join('')}</div>` : ''}
          </div>
        </article>
      `;
    }).join('');
  }

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.pl-filter-chip');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      activeItems = getFiltered(currentFilter);
      renderGrid();
    });
  });

  /* ---- Hero Video Reel Controls ---- */
  const heroVid = document.getElementById('heroVideo');
  const heroPlayBtn = document.getElementById('heroPlayBtn');
  const heroMuteBtn = document.getElementById('heroMuteBtn');

  if (heroVid && heroPlayBtn) {
    const playSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    const pauseSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

    heroPlayBtn.addEventListener('click', () => {
      if (heroVid.paused) {
        heroVid.play().then(() => {
          heroPlayBtn.innerHTML = pauseSvg;
        }).catch(() => {});
      } else {
        heroVid.pause();
        heroPlayBtn.innerHTML = playSvg;
      }
    });

    // Auto-play muted on load if supported
    heroVid.play().then(() => {
      heroPlayBtn.innerHTML = pauseSvg;
    }).catch(() => {
      heroPlayBtn.innerHTML = playSvg;
    });
  }

  if (heroVid && heroMuteBtn) {
    const muteSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M23 9l-6 6M17 9l6 6"/></svg>';
    const soundSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';

    heroMuteBtn.addEventListener('click', () => {
      heroVid.muted = !heroVid.muted;
      heroMuteBtn.innerHTML = heroVid.muted ? muteSvg : soundSvg;
      heroMuteBtn.setAttribute('aria-label', heroVid.muted ? 'Unmute video' : 'Mute video');
    });
  }

  /* ---- Lightbox Modal ---- */
  const modal = document.getElementById('plModal');
  const modalBackdrop = document.getElementById('plBackdrop');
  const modalClose = document.getElementById('plClose');
  const modalImg = document.getElementById('modalImg');
  const modalVid = document.getElementById('modalVid');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalSub = document.getElementById('modalSubtitle');
  const modalStats = document.getElementById('modalStats');
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');
  const modalCounter = document.getElementById('modalCounter');

  let currentModalIdx = 0;

  function openModal(idx) {
    if (!modal) return;
    const itemsList = (ALL_ITEMS && ALL_ITEMS.length > 0) ? ALL_ITEMS : (window.POWERLIFTING_ITEMS || []);
    if (!itemsList || itemsList.length === 0) return;

    currentModalIdx = (idx >= 0 && idx < itemsList.length) ? idx : 0;
    const it = itemsList[currentModalIdx];
    if (!it) return;

    if (it.mediaType === 'video' && it.videoSrc) {
      if (modalImg) modalImg.style.display = 'none';
      if (modalVid) {
        modalVid.style.display = 'block';
        modalVid.src = it.videoSrc;
        modalVid.play().catch(() => {});
      }
    } else {
      if (modalVid) {
        modalVid.pause();
        modalVid.style.display = 'none';
      }
      if (modalImg) {
        modalImg.style.display = 'block';
        modalImg.src = it.fullPhoto || it.thumbnail;
      }
    }

    if (modalBadge) modalBadge.textContent = it.badge || 'LIFT';
    if (modalTitle) modalTitle.textContent = it.title || '';
    if (modalSub) modalSub.textContent = it.subtitle || '';
    if (modalCounter) modalCounter.textContent = `${currentModalIdx + 1} / ${itemsList.length}`;

    const s = it.stats || {};
    if (modalStats) {
      modalStats.innerHTML = `
        <div class="pl-stat-item"><span class="pl-stat-k">LIFT / POSE</span><span class="pl-stat-v">${esc(s.discipline || it.title)}</span></div>
        <div class="pl-stat-item"><span class="pl-stat-k">WEIGHT / INTENSITY</span><span class="pl-stat-v">${esc(s.weight || '—')}</span></div>
        <div class="pl-stat-item"><span class="pl-stat-k">REPS / RPE</span><span class="pl-stat-v">${esc(s.reps || '—')}</span></div>
        <div class="pl-stat-item"><span class="pl-stat-k">GEAR / EQUIPMENT</span><span class="pl-stat-v">${esc(s.gear || 'Raw')}</span></div>
        <div class="pl-stat-item"><span class="pl-stat-k">MEET / LOCATION</span><span class="pl-stat-v">${esc(s.meet || 'Gym Session')}</span></div>
        <div class="pl-stat-item"><span class="pl-stat-k">DATE</span><span class="pl-stat-v">${esc(s.date || '2026')}</span></div>
        ${s.notes ? `<div class="pl-stat-item full-width"><span class="pl-stat-k">NOTES</span><span class="pl-stat-v">${esc(s.notes)}</span></div>` : ''}
      `;
    }

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => modal.classList.add('open'));
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    if (modalVid) modalVid.pause();
    document.body.style.overflow = '';
    setTimeout(() => { modal.hidden = true; }, 260);
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  if (modalPrev) {
    modalPrev.addEventListener('click', () => {
      const itemsList = (ALL_ITEMS && ALL_ITEMS.length > 0) ? ALL_ITEMS : (window.POWERLIFTING_ITEMS || []);
      const nextIdx = (currentModalIdx - 1 + itemsList.length) % itemsList.length;
      openModal(nextIdx);
    });
  }

  if (modalNext) {
    modalNext.addEventListener('click', () => {
      const itemsList = (ALL_ITEMS && ALL_ITEMS.length > 0) ? ALL_ITEMS : (window.POWERLIFTING_ITEMS || []);
      const nextIdx = (currentModalIdx + 1) % itemsList.length;
      openModal(nextIdx);
    });
  }

  window.addEventListener('keydown', e => {
    if (modal && !modal.hidden) {
      if (e.key === 'Escape') closeModal();
      else if (e.key === 'ArrowLeft' && modalPrev) modalPrev.click();
      else if (e.key === 'ArrowRight' && modalNext) modalNext.click();
    }
  });

  // Global listener for feature cards and badges with data-open-modal
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-open-modal]');
    if (!trigger) return;
    const rawIdx = trigger.getAttribute('data-open-modal');
    if (rawIdx !== null && rawIdx !== '') {
      e.preventDefault();
      const idx = parseInt(rawIdx, 10);
      if (!isNaN(idx)) {
        openModal(idx);
      }
    }
  });

  // Card click in grid
  if (grid) {
    grid.addEventListener('click', e => {
      const card = e.target.closest('.pl-card');
      if (!card || card.dataset.idx === undefined) return;
      const cardItem = activeItems[+card.dataset.idx];
      const allIdx = ALL_ITEMS.indexOf(cardItem);
      openModal(allIdx !== -1 ? allIdx : +card.dataset.idx);
    });
    grid.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.pl-card');
        if (card && card.dataset.idx !== undefined) {
          e.preventDefault();
          const cardItem = activeItems[+card.dataset.idx];
          const allIdx = ALL_ITEMS.indexOf(cardItem);
          openModal(allIdx !== -1 ? allIdx : +card.dataset.idx);
        }
      }
    });
  }

  // Live rebuild hook for admin panel / hydrator
  window.__rebuildPowerlifter = function(items) {
    if (!Array.isArray(items) || items.length === 0) return;
    window.POWERLIFTING_ITEMS = items;
    ALL_ITEMS = items;
    activeItems = getFiltered(currentFilter);
    renderGrid();
  };

  // Wait for lifts.js if needed
  if (!ALL_ITEMS || ALL_ITEMS.length === 0) {
    let attempts = 0;
    const timer = setInterval(() => {
      attempts++;
      if (window.POWERLIFTING_ITEMS && window.POWERLIFTING_ITEMS.length > 0) {
        clearInterval(timer);
        ALL_ITEMS = window.POWERLIFTING_ITEMS;
        activeItems = getFiltered(currentFilter);
        renderGrid();
      } else if (attempts > 60) {
        clearInterval(timer);
      }
    }, 50);
  } else {
    renderGrid();
  }

  // Fetch live powerlifting items from backend
  fetch(API_ROOT + '/api/portfolio/powerlifting')
    .then(r => r.ok ? r.json() : null)
    .then(json => {
      if (json?.success && Array.isArray(json.data) && json.data.length > 0) {
        try { localStorage.setItem('ashik_powerlifting_items', JSON.stringify(json.data)); } catch (_) {}
        window.__rebuildPowerlifter(json.data);
      }
    })
    .catch(() => {});

  /* ---- Header Navigation & Utilities ---- */
  const rn = document.getElementById('rn');
  const menu = document.getElementById('rnMenu');
  const panel = document.getElementById('rnPanel');
  const pclose = document.getElementById('rnClose');

  if (rn && menu && panel && pclose) {
    panel.querySelectorAll('.rn__plist button').forEach((b, i) => b.style.setProperty('--i', i));
    const setMenu = o => {
      rn.classList.toggle('open', o);
      menu.setAttribute('aria-expanded', o);
      root.classList.toggle('rn-lock', o);
      if (o) setTimeout(() => pclose.focus(), 60); else menu.focus();
    };
    menu.addEventListener('click', () => setMenu(!rn.classList.contains('open')));
    pclose.addEventListener('click', () => setMenu(false));
    panel.addEventListener('click', e => { if (e.target.closest('button[data-nav]')) setMenu(false); });
  }

  const HOME = '/#works'.replace(/#works$/, '');
  const SLUGS = ["web-developer", "app-developer", "ui-ux-designer", "devops-engineer", "powerlifter"];
  const go = to => {
    if (to === 'top') { scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (to === 'home') location.href = '/';
    else if (to === 'about') location.href = '/#about';
    else if (to === 'contact') location.href = '/#contact';
    else if (to?.startsWith('door:')) location.href = '/' + SLUGS[+to.slice(5)] + '/';
  };

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-nav]');
    if (!b) return;
    if (b.tagName === 'A' && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button)) return;
    e.preventDefault();
    if (rn && menu) { rn.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
    const to = b.dataset.nav;
    if (b.hasAttribute('aria-current')) { scrollTo({ top: 0, behavior: 'smooth' }); return; }
    go(to);
  });

  // Sticky header class
  const updHeader = () => { if (rn) rn.classList.toggle('stuck', scrollY > 10); };
  addEventListener('scroll', updHeader, { passive: true });
  updHeader();

  // Floating Back to the doors pill in the sticky bar
  (() => {
    const top = document.querySelector('.top .chip'); if (!top) return;
    const bar = document.querySelector('.rn__in'); if (!bar) return;
    const b = document.createElement('a');
    b.className = 'backd'; b.href = top.getAttribute('href'); b.setAttribute('aria-label', 'Back to the doors');
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg><span>Back to the doors</span>';
    b.addEventListener('click', e => { e.preventDefault(); top.click(); });
    bar.insertBefore(b, bar.firstChild);
    top.style.visibility = 'hidden'; top.tabIndex = -1;
    requestAnimationFrame(() => b.classList.add('show'));
  })();

  // Live Clock & Date
  const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const tickTime = () => {
    const d = new Date(), h = d.getHours();
    document.querySelectorAll('[data-ftime]').forEach(e => e.textContent = `${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}${h < 12 ? 'am' : 'pm'}`);
    document.querySelectorAll('[data-fdate]').forEach(e => e.textContent = `${d.getDate()} ${M[d.getMonth()]}`);
    document.querySelectorAll('[data-fyear]').forEach(e => e.textContent = d.getFullYear());
  };
  tickTime();
  setInterval(tickTime, 20000);

  // Floating back to top button
  const tt = document.querySelector('.totop');
  if (tt) {
    const updTotop = () => {
      const max = document.documentElement.scrollHeight - innerHeight, y = scrollY;
      const bot = document.querySelector('.sf__bot');
      tt.classList.toggle('show', y > innerHeight * 0.8 && !(bot && bot.getBoundingClientRect().top < innerHeight - 8));
      tt.style.setProperty('--p', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
    };
    addEventListener('scroll', updTotop, { passive: true });
    addEventListener('resize', updTotop, { passive: true });
    updTotop();
  }

  // Cookie banner choice
  const ID = 'G-12PNLHKGHK', K = 'ashik-analytics';
  let v = null; try { v = localStorage.getItem(K); } catch (e) {}
  const loadGtag = () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', ID);
    const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID; document.head.appendChild(s);
  };
  if (v === 'yes') loadGtag();
  else if (v !== 'no') {
    const b = document.getElementById('ck');
    if (b) {
      b.hidden = false;
      b.addEventListener('click', e => {
        const c = e.target.closest('[data-ck]'); if (!c) return;
        try { localStorage.setItem(K, c.dataset.ck); } catch (_) {}
        b.hidden = true; if (c.dataset.ck === 'yes') loadGtag();
      });
    }
  }
})();
