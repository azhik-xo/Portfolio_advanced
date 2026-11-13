(() => {
  const root = document.documentElement;
  const dark = root.dataset.mode === 'dark';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wall = document.getElementById('wall'), space = document.getElementById('space');
  const sky = document.getElementById('sky');

  /* ---- ambient starfield / dust particle canvas ---- */
  if (sky) {
    const sctx = sky.getContext('2d');
    let sw = sky.width = innerWidth, sh = sky.height = innerHeight;
    const isMobile = sw < 640;
    const starsCount = isMobile ? 24 : 55;
    const stars = Array.from({ length: starsCount }, () => ({
      x: Math.random() * sw,
      y: Math.random() * sh,
      r: Math.random() * 1.3 + 0.4,
      o: Math.random() * 0.4 + 0.2,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1
    }));

    const renderSky = () => {
      if (document.hidden) {
        requestAnimationFrame(renderSky);
        return;
      }
      sctx.clearRect(0, 0, sw, sh);
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        sctx.fillStyle = `rgba(232, 228, 224, ${s.o})`;
        sctx.beginPath();
        sctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        sctx.fill();
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0) s.x = sw; else if (s.x > sw) s.x = 0;
        if (s.y < 0) s.y = sh; else if (s.y > sh) s.y = 0;
      }
      requestAnimationFrame(renderSky);
    };
    renderSky();
    window.addEventListener('resize', () => {
      sw = sky.width = innerWidth; sh = sky.height = innerHeight;
    });
  }

  /* ---- PR Telemetry Formatting & Dynamic Sync ---- */
  const formatPr = (val, fallback) => {
    if (!val) return fallback;
    let str = String(val).trim().replace(/\s*\([^)]*\)/g, '').trim().toUpperCase();
    if (/^\d+$/.test(str)) str += ' KG';
    return str;
  };

  const updatePrChip = (stats) => {
    if (!stats) return;
    const prEl = document.querySelector('.chip--prs');
    if (!prEl) return;
    const tot = formatPr(stats.bigThreeTotal, '315 KG');
    const sq = formatPr(stats.squatPR, '110 KG');
    const bp = formatPr(stats.benchPR, '70 KG');
    const dl = formatPr(stats.deadliftPR, '135 KG');
    prEl.innerHTML = `
      <span title="${stats.bigThreeTotal || ''}">TOTAL: <b>${tot}</b></span>
      <span class="pr-div">·</span>
      <span title="${stats.squatPR || ''}">SQ: <b>${sq}</b></span>
      <span class="pr-div">·</span>
      <span title="${stats.benchPR || ''}">BP: <b>${bp}</b></span>
      <span class="pr-div">·</span>
      <span title="${stats.deadliftPR || ''}">DL: <b>${dl}</b></span>
    `;
  };

  // Immediate synchronous cache hydration for 0ms paint
  try {
    const cachedStats = JSON.parse(localStorage.getItem('ashik_pr_stats') || 'null');
    if (cachedStats) updatePrChip(cachedStats);
  } catch (e) {}

  let cachedLifts = null;
  try {
    cachedLifts = JSON.parse(localStorage.getItem('ashik_powerlifting_items') || 'null');
  } catch (e) {}

  /* ---- items list & filtering ---- */
  let ALL_ITEMS = (cachedLifts && Array.isArray(cachedLifts) && cachedLifts.length > 0)
    ? cachedLifts
    : ((window.POWERLIFTING_ITEMS && Array.isArray(window.POWERLIFTING_ITEMS) && window.POWERLIFTING_ITEMS.length > 0)
      ? window.POWERLIFTING_ITEMS
      : []);
  let currentFilter = 'all';
  let activeItems = [...ALL_ITEMS];

  const getFilteredItems = (filter) => {
    const list = (window.POWERLIFTING_ITEMS && window.POWERLIFTING_ITEMS.length > 0) ? window.POWERLIFTING_ITEMS : ALL_ITEMS;
    if (filter === 'all') return list;
    if (filter === 'video') return list.filter(it => it.mediaType === 'video');
    return list.filter(it => it.category === filter);
  };

  window.__rebuildPowerlifter = function(items) {
    if (!Array.isArray(items) || items.length === 0) return;
    window.POWERLIFTING_ITEMS = items;
    ALL_ITEMS = items;
    activeItems = getFilteredItems(currentFilter);
    const allBtn = document.querySelector('.chip--filter[data-filter="all"]');
    if (allBtn) allBtn.textContent = `All (${ALL_ITEMS.length})`;
    buildRows();
    renderCells(true);
  };

  function syncPowerliftingData() {
    fetch('/api/portfolio/profile')
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (!json?.success || !json.data?.stats) return;
        updatePrChip(json.data.stats);
        try {
          localStorage.setItem('ashik_pr_stats', JSON.stringify(json.data.stats));
        } catch (e) {}
      })
      .catch(() => {});

    fetch('/api/portfolio/powerlifting')
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (!json?.success || !Array.isArray(json.data) || json.data.length === 0) return;
        try {
          localStorage.setItem('ashik_powerlifting_items', JSON.stringify(json.data));
        } catch (e) {}
        window.__rebuildPowerlifter(json.data);
      })
      .catch(() => {});
  }
  syncPowerliftingData();

  /* ---- 3D matrix layout ---- */
  let vw = Math.max(window.innerWidth || 0, 360), vh = Math.max(window.innerHeight || 0, 600);
  let g = vw < 640 ? 20 : 32;
  let ROWS = [];
  let PW = 800, PH = 600;

  function buildRows() {
    vw = Math.max(window.innerWidth || 0, 360);
    vh = Math.max(window.innerHeight || 0, 600);
    const mobile = vw < 640;
    g = mobile ? 20 : 32;

    if ((!activeItems || activeItems.length === 0) && window.POWERLIFTING_ITEMS && window.POWERLIFTING_ITEMS.length > 0) {
      ALL_ITEMS = window.POWERLIFTING_ITEMS;
      activeItems = getFilteredItems(currentFilter);
    }

    if (!activeItems || activeItems.length === 0) {
      ROWS = [{ y: 0, H: 400, L: 800, off: 0, cells: [] }];
      PH = 600; PW = 800;
      return;
    }

    // 2 rows on mobile (spacious, never congested); 4 rows on desktop
    const numRows = mobile ? 2 : 4;
    const cardW = mobile ? Math.min(265, Math.round(vw * 0.68)) : Math.min(360, Math.round(vh * 0.38));
    const cardH = mobile ? Math.min(350, Math.round(cardW * 1.32)) : Math.min(480, Math.round(cardW * 1.32));

    const items = activeItems.map((p, idx) => {
      const r = (p.w && p.h) ? (p.w / p.h) : 0.75;
      const w = mobile ? cardW : Math.round(cardH * r);
      const h = mobile ? cardH : Math.round(w / r);
      return { idx, r, w, h, item: p };
    });

    ROWS = [];
    const itemsPerRow = Math.max(1, Math.ceil(items.length / numRows));

    // Calculate vertical offset to center the rows on mobile screen
    const totalHeight = numRows * cardH + (numRows - 1) * g;
    const startY = mobile ? Math.max(120, Math.round((vh - totalHeight) / 2)) : 0;

    let y = startY;
    for (let r = 0; r < numRows; r++) {
      const rowSlice = [];
      for (let c = 0; c < itemsPerRow; c++) {
        const itemIdx = (r * itemsPerRow + c) % items.length;
        rowSlice.push(items[itemIdx]);
      }
      const H = Math.max(100, ...rowSlice.map(o => o.h));
      let x = 0;
      const cells = rowSlice.map(o => {
        const cell = { idx: o.idx, x, y: (H - o.h) / 2, w: o.w, h: o.h, item: o.item };
        x += o.w + g;
        return cell;
      });
      const L = Math.max(x, 400);
      ROWS.push({ y, H, L, off: ((r * 0.381966) % 1) * L, cells });
      y += H + g;
    }
    PH = Math.max(y, 400);
    PW = Math.max(400, ...ROWS.map(r => r.L));
  }

  buildRows();

  // Retry populating items if lifts.js finished loading after engine initialization
  if (!window.POWERLIFTING_ITEMS || window.POWERLIFTING_ITEMS.length === 0) {
    let attempts = 0;
    const checkTimer = setInterval(() => {
      attempts++;
      if (window.POWERLIFTING_ITEMS && window.POWERLIFTING_ITEMS.length > 0) {
        clearInterval(checkTimer);
        ALL_ITEMS = window.POWERLIFTING_ITEMS;
        activeItems = getFilteredItems(currentFilter);
        buildRows();
        renderCells(true);
      } else if (attempts > 60) {
        clearInterval(checkTimer);
      }
    }, 50);
  }

  /* ---- infinite viewport rendering ---- */
  let camX = 0, camY = 0;
  let velX = 0, velY = 0;
  let isDragging = false;
  let startX = 0, startY = 0;
  let lastX = 0, lastY = 0;
  let hasMoved = false;

  const POOL_SIZE = 36;
  const pool = [];

  for (let i = 0; i < POOL_SIZE; i++) {
    const el = document.createElement('div');
    el.className = 'cell';
    el.style.display = 'none';
    el.innerHTML = `
      <div class="fl" style="--fx:${(Math.random() - 0.5) * 8}px;--fy:${(Math.random() - 0.5) * 8}px;--fr:${(Math.random() - 0.5) * 1.5}deg;--fd:${10 + Math.random() * 6}s;--fdl:-${Math.random() * 8}s">
        <div class="ph">
          <img src="" alt="" loading="lazy">
          <div class="ph__badge"></div>
          <div class="ph__meta">
            <span class="ph__title"></span>
            <span class="ph__sub"></span>
          </div>
        </div>
      </div>
    `;
    space.appendChild(el);
    pool.push({
      el,
      inUse: false,
      assignedIdx: -1,
      img: el.querySelector('img'),
      badge: el.querySelector('.ph__badge'),
      title: el.querySelector('.ph__title'),
      sub: el.querySelector('.ph__sub')
    });
  }

  function renderCells(forceFullUpdate = false) {
    if (!PH || PH <= 50 || !PW || PW <= 50 || !ROWS || ROWS.length === 0) return;

    const viewLeft = camX - 120;
    const viewRight = camX + vw + 120;
    const viewTop = camY - 120;
    const viewBottom = camY + vh + 120;

    let poolIdx = 0;

    const rawRowStart = Math.floor(viewTop / PH);
    const rawRowEnd = Math.floor(viewBottom / PH);
    const rowStart = Math.max(rawRowStart, -6);
    const rowEnd = Math.min(rawRowEnd, 6);

    for (let rBlock = rowStart; rBlock <= rowEnd; rBlock++) {
      const blockY = rBlock * PH;
      for (let ri = 0; ri < ROWS.length; ri++) {
        const row = ROWS[ri];
        if (!row || !row.L || row.L <= 50) continue;
        const rowY = blockY + row.y;
        if (rowY + row.H < viewTop || rowY > viewBottom) continue;

        const effectiveX = viewLeft - (row.off || 0);
        const rawColStart = Math.floor(effectiveX / row.L);
        const rawColEnd = Math.floor((viewRight - (row.off || 0)) / row.L);
        const colStart = Math.max(rawColStart, -6);
        const colEnd = Math.min(rawColEnd, 6);

        for (let cBlock = colStart; cBlock <= colEnd; cBlock++) {
          const blockX = cBlock * row.L + (row.off || 0);
          for (let ci = 0; ci < row.cells.length; ci++) {
            const c = row.cells[ci];
            if (!c) continue;
            const cellX = blockX + c.x;
            const cellY = rowY + c.y;

            if (cellX + c.w < viewLeft || cellX > viewRight) continue;
            if (poolIdx >= pool.length) break;

            const pObj = pool[poolIdx++];
            pObj.inUse = true;
            const el = pObj.el;

            if (el.style.display !== 'block') el.style.display = 'block';

            // Fast hardware-accelerated transform
            const tx = Math.round(cellX - camX);
            const ty = Math.round(cellY - camY);
            el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;

            // Only update DOM attributes if card index changed or forced
            if (forceFullUpdate || pObj.assignedIdx !== c.idx) {
              pObj.assignedIdx = c.idx;
              el.style.width = `${c.w}px`;
              el.style.height = `${c.h}px`;
              el.dataset.idx = c.idx;

              const it = c.item;
              if (it) {
                if (pObj.img && pObj.img.getAttribute('src') !== it.thumbnail) {
                  pObj.img.src = it.thumbnail;
                  pObj.img.classList.remove('ok');
                  pObj.img.onload = () => pObj.img.classList.add('ok');
                }
                if (pObj.badge) {
                  pObj.badge.innerHTML = (it.mediaType === 'video')
                    ? `<span class="badge-vid">▶ VIDEO</span> <span class="badge-txt">${it.badge}</span>`
                    : `<span class="badge-txt">${it.badge}</span>`;
                }
                if (pObj.title) pObj.title.textContent = it.title || '';
                if (pObj.sub) pObj.sub.textContent = it.subtitle || '';
              }
            }
          }
        }
      }
    }

    // Hide any pool elements that were not used in this pass
    for (let i = poolIdx; i < pool.length; i++) {
      const p = pool[i];
      if (p.inUse) {
        p.inUse = false;
        p.assignedIdx = -1;
        p.el.style.display = 'none';
      }
    }
  }

  /* ---- physics loop & inertia ---- */
  function tick() {
    if (document.hidden) {
      requestAnimationFrame(tick);
      return;
    }

    if (!isDragging) {
      const speed = Math.hypot(velX, velY);
      if (speed > 0.02) {
        camX += velX;
        camY += velY;
        velX *= 0.92;
        velY *= 0.92;
      } else {
        velX = 0;
        velY = 0;
        // Gentle slow majestic drift
        camX += 0.2;
      }
    }
    renderCells(false);
    requestAnimationFrame(tick);
  }
  tick();

  /* ---- unified Pointer Events (handles touch + mouse identically) ---- */
  let activePointerId = null;

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    isDragging = true;
    hasMoved = false;
    activePointerId = e.pointerId;
    try { wall.setPointerCapture(e.pointerId); } catch (_) {}

    startX = lastX = e.clientX;
    startY = lastY = e.clientY;
    velX = velY = 0;
    wall.classList.add('drag');

    const hint = document.getElementById('hint');
    if (hint) hint.classList.add('gone');
  };

  const onPointerMove = (e) => {
    if (!isDragging || e.pointerId !== activePointerId) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    if (Math.hypot(e.clientX - startX, e.clientY - startY) > 8) {
      hasMoved = true;
    }

    camX -= dx;
    camY -= dy;
    velX = -dx;
    velY = -dy;

    lastX = e.clientX;
    lastY = e.clientY;
  };

  const onPointerUp = (e) => {
    if (!isDragging || e.pointerId !== activePointerId) return;
    isDragging = false;
    activePointerId = null;
    wall.classList.remove('drag');
    try { wall.releasePointerCapture(e.pointerId); } catch (_) {}

    if (!hasMoved) {
      // Direct tap or click on a card
      const target = document.elementFromPoint(e.clientX, e.clientY)?.closest('.cell');
      if (target && target.dataset.idx !== undefined) {
        openLightbox(+target.dataset.idx);
      }
    }
  };

  wall.addEventListener('pointerdown', onPointerDown);
  wall.addEventListener('pointermove', onPointerMove);
  wall.addEventListener('pointerup', onPointerUp);
  wall.addEventListener('pointercancel', onPointerUp);

  // Wheel pan support for desktop trackpads/mice
  wall.addEventListener('wheel', (e) => {
    e.preventDefault();
    camX += e.deltaX;
    camY += e.deltaY;
  }, { passive: false });

  /* ---- category filtering ---- */
  const filterBtns = document.querySelectorAll('[data-filter]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      activeItems = getFilteredItems(currentFilter);
      buildRows();
      renderCells(true);
    });
  });

  /* ---- lightbox with Video & Photo support ---- */
  const lb = document.getElementById('lb');
  const lbImg = document.getElementById('lbImg');
  const lbVid = document.getElementById('lbVid');
  const lbTitle = document.getElementById('lbTitle');
  const lbBadge = document.getElementById('lbBadge');
  const lbSubtitle = document.getElementById('lbSubtitle');
  const lbStats = document.getElementById('lbStats');
  const lbCount = document.getElementById('lbCount');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');

  let currentLbIdx = 0;

  function openLightbox(idx) {
    currentLbIdx = idx;
    const it = ALL_ITEMS[idx];
    if (!it) return;

    if (it.mediaType === 'video' && it.videoSrc) {
      lbImg.style.display = 'none';
      lbVid.style.display = 'block';
      lbVid.src = it.videoSrc;
      lbVid.play().catch(() => {});
    } else {
      lbVid.pause();
      lbVid.style.display = 'none';
      lbImg.style.display = 'block';
      lbImg.src = it.fullPhoto || it.thumbnail;
    }

    lbTitle.textContent = it.title;
    lbSubtitle.textContent = it.subtitle;
    lbBadge.textContent = it.badge;
    lbCount.textContent = `${idx + 1} / ${ALL_ITEMS.length}`;

    // Render stats matrix
    const s = it.stats || {};
    lbStats.innerHTML = `
      <div class="st-cell"><span class="st-k">LIFT / POSE</span><span class="st-v">${s.discipline || it.title}</span></div>
      <div class="st-cell"><span class="st-k">WEIGHT / INTENSITY</span><span class="st-v">${s.weight || '—'}</span></div>
      <div class="st-cell"><span class="st-k">REPS / RPE</span><span class="st-v">${s.reps || '—'}</span></div>
      <div class="st-cell"><span class="st-k">GEAR / EQUIPMENT</span><span class="st-v">${s.gear || 'Raw'}</span></div>
      <div class="st-cell"><span class="st-k">MEET / LOCATION</span><span class="st-v">${s.meet || 'Gym'}</span></div>
      <div class="st-cell"><span class="st-k">DATE</span><span class="st-v">${s.date || '2026'}</span></div>
      ${s.notes ? `<div class="st-cell st-notes"><span class="st-k">NOTES</span><span class="st-v">${s.notes}</span></div>` : ''}
    `;

    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add('open'));
  }

  function closeLightbox() {
    lb.classList.remove('open');
    if (lbVid) lbVid.pause();
    setTimeout(() => { lb.hidden = true; }, 300);
  }

  lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });

  lbPrev.addEventListener('click', () => {
    const nextIdx = (currentLbIdx - 1 + ALL_ITEMS.length) % ALL_ITEMS.length;
    openLightbox(nextIdx);
  });

  lbNext.addEventListener('click', () => {
    const nextIdx = (currentLbIdx + 1) % ALL_ITEMS.length;
    openLightbox(nextIdx);
  });

  window.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') lbPrev.click();
    else if (e.key === 'ArrowRight') lbNext.click();
  });

  /* ---- info modal: instructions to add personal lifts ---- */
  const infoBtn = document.getElementById('infoBtn');
  const infoModal = document.getElementById('infoModal');
  const infoClose = document.getElementById('infoClose');

  if (infoBtn && infoModal && infoClose) {
    infoBtn.addEventListener('click', () => {
      infoModal.hidden = false;
      requestAnimationFrame(() => infoModal.classList.add('open'));
    });
    infoClose.addEventListener('click', () => {
      infoModal.classList.remove('open');
      setTimeout(() => { infoModal.hidden = true; }, 300);
    });
  }

  window.addEventListener('resize', () => {
    buildRows();
    renderCells(true);
  });
})();
