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
    const stars = Array.from({ length: 65 }, () => ({
      x: Math.random() * sw,
      y: Math.random() * sh,
      r: Math.random() * 1.5 + 0.4,
      o: Math.random() * 0.5 + 0.2,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12
    }));

    const renderSky = () => {
      sctx.clearRect(0, 0, sw, sh);
      stars.forEach(s => {
        sctx.fillStyle = `rgba(232, 228, 224, ${s.o})`;
        sctx.beginPath();
        sctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        sctx.fill();
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0) s.x = sw; else if (s.x > sw) s.x = 0;
        if (s.y < 0) s.y = sh; else if (s.y > sh) s.y = 0;
      });
      requestAnimationFrame(renderSky);
    };
    renderSky();
    window.addEventListener('resize', () => {
      sw = sky.width = innerWidth; sh = sky.height = innerHeight;
    });
  }

  /* ---- items list & filtering ---- */
  const ALL_ITEMS = window.POWERLIFTING_ITEMS || [];
  let currentFilter = 'all';
  let activeItems = [...ALL_ITEMS];

  const getFilteredItems = (filter) => {
    if (filter === 'all') return ALL_ITEMS;
    if (filter === 'video') return ALL_ITEMS.filter(it => it.mediaType === 'video');
    return ALL_ITEMS.filter(it => it.category === filter);
  };

  /* ---- 3D draggable matrix layout ---- */
  let vw = innerWidth, vh = innerHeight, g = vw >= 640 ? 32 : 18;
  let ROWS = [];
  let PW = 0, PH = 0;

  function buildRows() {
    vw = innerWidth; vh = innerHeight;
    g = vw >= 640 ? 32 : 18;
    const mobile = vw < 640;
    const side = (mobile ? vw * 0.65 : Math.min(420, vh * 0.48)) * 0.95;
    const A = side * side;

    const items = activeItems.map((p, idx) => {
      const r = p.w / p.h;
      const w = Math.sqrt(A * r);
      return { idx, r, w, h: w / r, item: p };
    });

    const numRows = mobile ? 3 : 4;
    ROWS = [];
    const itemsPerRow = Math.ceil(items.length / numRows);

    let y = 0;
    for (let r = 0; r < numRows; r++) {
      const rowSlice = [];
      for (let c = 0; c < itemsPerRow; c++) {
        const itemIdx = (r * itemsPerRow + c) % items.length;
        rowSlice.push(items[itemIdx]);
      }
      const H = Math.max(...rowSlice.map(o => o.h));
      let x = 0;
      const cells = rowSlice.map(o => {
        const cell = { idx: o.idx, x, y: (H - o.h) / 2, w: o.w, h: o.h, item: o.item };
        x += o.w + g;
        return cell;
      });
      ROWS.push({ y, H, L: x, off: ((r * 0.381966) % 1) * x, cells });
      y += H + g;
    }
    PH = y;
    PW = Math.max(...ROWS.map(r => r.L));
  }

  buildRows();

  /* ---- infinite viewport rendering ---- */
  let camX = 0, camY = 0;
  let velX = 0, velY = 0;
  let isDragging = false;
  let startX = 0, startY = 0;
  let lastX = 0, lastY = 0;
  let hasMoved = false;

  const POOL_SIZE = 45;
  const pool = [];

  for (let i = 0; i < POOL_SIZE; i++) {
    const el = document.createElement('div');
    el.className = 'cell';
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
    pool.push({ el, inUse: false });
  }

  function renderCells() {
    pool.forEach(p => { p.inUse = false; p.el.style.display = 'none'; });

    const viewLeft = camX - 100;
    const viewRight = camX + vw + 100;
    const viewTop = camY - 100;
    const viewBottom = camY + vh + 100;

    let poolIdx = 0;

    const rowStart = Math.floor(viewTop / PH);
    const rowEnd = Math.floor(viewBottom / PH);

    for (let rBlock = rowStart; rBlock <= rowEnd; rBlock++) {
      const blockY = rBlock * PH;
      for (let ri = 0; ri < ROWS.length; ri++) {
        const row = ROWS[ri];
        const rowY = blockY + row.y;
        if (rowY + row.H < viewTop || rowY > viewBottom) continue;

        const effectiveX = viewLeft - row.off;
        const colStart = Math.floor(effectiveX / row.L);
        const colEnd = Math.floor((viewRight - row.off) / row.L);

        for (let cBlock = colStart; cBlock <= colEnd; cBlock++) {
          const blockX = cBlock * row.L + row.off;
          for (let ci = 0; ci < row.cells.length; ci++) {
            const c = row.cells[ci];
            const cellX = blockX + c.x;
            const cellY = rowY + c.y;

            if (cellX + c.w < viewLeft || cellX > viewRight) continue;
            if (poolIdx >= pool.length) break;

            const pObj = pool[poolIdx++];
            pObj.inUse = true;
            const el = pObj.el;
            el.style.display = 'block';
            el.style.transform = `translate3d(${cellX - camX}px, ${cellY - camY}px, 0)`;
            el.style.width = `${c.w}px`;
            el.style.height = `${c.h}px`;
            el.dataset.idx = c.idx;

            const it = c.item;
            const img = el.querySelector('img');
            if (img.getAttribute('src') !== it.thumbnail) {
              img.src = it.thumbnail;
              img.classList.remove('ok');
              img.onload = () => img.classList.add('ok');
            }

            const badge = el.querySelector('.ph__badge');
            if (it.mediaType === 'video') {
              badge.innerHTML = `<span class="badge-vid">▶ VIDEO</span> <span class="badge-txt">${it.badge}</span>`;
            } else {
              badge.innerHTML = `<span class="badge-txt">${it.badge}</span>`;
            }

            el.querySelector('.ph__title').textContent = it.title;
            el.querySelector('.ph__sub').textContent = it.subtitle;
          }
        }
      }
    }
  }

  /* ---- physics loop & inertia ---- */
  function tick() {
    if (!isDragging) {
      camX += velX;
      camY += velY;
      velX *= 0.92;
      velY *= 0.92;

      // constant slow majestic drift
      camX += 0.25;
    }
    renderCells();
    requestAnimationFrame(tick);
  }
  tick();

  /* ---- drag events ---- */
  const onPointerDown = (e) => {
    isDragging = true;
    hasMoved = false;
    startX = lastX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    startY = lastY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    velX = velY = 0;
    wall.classList.add('drag');
    const hint = document.getElementById('hint');
    if (hint) hint.classList.add('gone');
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const y = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const dx = x - lastX;
    const dy = y - lastY;

    if (Math.hypot(x - startX, y - startY) > 5) hasMoved = true;

    camX -= dx;
    camY -= dy;
    velX = -dx;
    velY = -dy;

    lastX = x;
    lastY = y;
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    wall.classList.remove('drag');

    if (!hasMoved) {
      // It's a click! Check if a cell was clicked
      const target = e.target.closest('.cell');
      if (target && target.dataset.idx !== undefined) {
        openLightbox(+target.dataset.idx);
      }
    }
  };

  wall.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  wall.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp, { passive: true });

  // Wheel to pan
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
      renderCells();
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
    renderCells();
  });
})();

