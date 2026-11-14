(() => {
  const EMBED = typeof location !== 'undefined' && /[?&]embed\b/.test(location.search);
  const API_ROOT = (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'))
    ? 'https://ashik-portfolio-backend.onrender.com'
    : '';
  const root = document.documentElement;
  const dark = root.dataset.mode === 'dark';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wall = document.getElementById('wall'), space = document.getElementById('space');

  /* ---- Data Preparation ---- */
  const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let cachedLifts = null;
  try {
    cachedLifts = JSON.parse(localStorage.getItem('ashik_powerlifting_items') || 'null');
  } catch (_) {}

  let RAW_ITEMS = (window.POWERLIFTING_ITEMS && Array.isArray(window.POWERLIFTING_ITEMS) && window.POWERLIFTING_ITEMS.length > 0)
    ? window.POWERLIFTING_ITEMS
    : ((cachedLifts && Array.isArray(cachedLifts) && cachedLifts.length > 0)
      ? cachedLifts
      : []);

  let P = [];
  let N = 0;

  function initItems(items) {
    if (!Array.isArray(items) || items.length === 0) return;
    RAW_ITEMS = items;
    P = items.map((it, idx) => ({
      s: idx,
      t: it.thumbnail,
      q: it.thumbnail,
      f: it.fullPhoto || it.thumbnail,
      w: it.w || 800,
      h: it.h || 1000,
      c: it.category || 'all',
      title: it.title || '',
      subtitle: it.subtitle || '',
      badge: it.badge || '',
      mediaType: it.mediaType || 'photo',
      videoSrc: it.videoSrc || null,
      stats: it.stats || {}
    }));
    N = P.length;
  }

  initItems(RAW_ITEMS);

  /* ---- PR Telemetry Formatting & Sync ---- */
  const formatPr = (val, fallback) => {
    if (!val) return fallback;
    let str = String(val).trim().replace(/\s*\([^)]*\)/g, '').trim().toUpperCase();
    if (/^\d+$/.test(str)) str += ' KG';
    return str;
  };

  const updatePrDom = (stats) => {
    if (!stats) return;
    const tot = formatPr(stats.bigThreeTotal, '315 KG');
    const sq = formatPr(stats.squatPR, '110 KG');
    const bp = formatPr(stats.benchPR, '70 KG');
    const dl = formatPr(stats.deadliftPR, '135 KG');

    const prEl = document.querySelector('.chip--prs');
    if (prEl) {
      prEl.innerHTML = `
        <span title="${esc(stats.bigThreeTotal || '')}">TOTAL: <b>${tot}</b></span>
        <span class="pr-div">·</span>
        <span title="${esc(stats.squatPR || '')}">SQ: <b>${sq}</b></span>
        <span class="pr-div">·</span>
        <span title="${esc(stats.benchPR || '')}">BP: <b>${bp}</b></span>
        <span class="pr-div">·</span>
        <span title="${esc(stats.deadliftPR || '')}">DL: <b>${dl}</b></span>
      `;
    }
  };

  try {
    const cachedStats = JSON.parse(localStorage.getItem('ashik_pr_stats') || 'null');
    if (cachedStats) updatePrDom(cachedStats);
  } catch (_) {}

  fetch(API_ROOT + '/api/portfolio/profile')
    .then(r => r.ok ? r.json() : null)
    .then(json => {
      if (json?.success && json.data?.stats) {
        updatePrDom(json.data.stats);
        try { localStorage.setItem('ashik_pr_stats', JSON.stringify(json.data.stats)); } catch (_) {}
      }
    })
    .catch(() => {});

  /* ---- Row Layout Packing (Identical to Rishi's wall) ---- */
  let vw, vh, g, PW = 800, PH = 600, ROWS = null;

  function buildRows() {
    vw = innerWidth;
    vh = innerHeight;
    const mobile = vw < 640;
    g = mobile ? 20 : 32;

    if (!P || P.length === 0) {
      ROWS = [];
      PW = 800; PH = 600;
      return;
    }

    const side = (mobile ? vw * 0.58 : Math.min(390, vh * 0.44)) * 0.94;
    const A = side * side;
    const minLen = vw * (mobile ? 2.2 : 1.75);

    const all = P.map((p, s) => {
      const r = (p.w && p.h) ? (p.w / p.h) : 0.8;
      const w = Math.sqrt(A * r);
      return { s, r, w, h: w / r, c: p.c || s };
    });

    const groups = [all.filter(o => o.r < 1), all.filter(o => o.r >= 1)].filter(gr => gr.length);
    const made = [];

    for (const gr of groups) {
      gr.sort((a, b) => a.r - b.r);
      const total = gr.reduce((a, o) => a + o.w + g, 0);
      const n = Math.max(1, Math.min(gr.length, mobile ? Math.floor(total / minLen) : Math.round(total / minLen)));
      const target = total / n;
      const rowsOfGroup = Array.from({ length: n }, () => []);
      const len = new Array(n).fill(0);
      let cum = 0;

      for (const o of gr) {
        const nat = Math.min(n - 1, Math.floor(cum / target));
        cum += o.w + g;
        const cand = [...Array(n).keys()].sort((p, q) => Math.abs(p - nat) - Math.abs(q - nat));
        const score = k => (rowsOfGroup[k].filter(x => x.c === o.c).length * 3) + Math.abs(k - nat) + (len[k] + o.w > target * 1.18 ? 9 : 0);
        const k = cand.reduce((best, k2) => score(k2) < score(best) ? k2 : best, cand[0]);
        rowsOfGroup[k].push(o);
        len[k] += o.w + g;
      }
      made.push(rowsOfGroup);
    }

    const [a = [], b = []] = made;
    const seq = [];
    let ia = 0, ib = 0;
    while (ia < a.length || ib < b.length) {
      if (ib >= b.length || (ia < a.length && ia / a.length <= ib / b.length)) seq.push(a[ia++]);
      else seq.push(b[ib++]);
    }

    ROWS = [];
    let y = 0;
    seq.filter(r => r.length).forEach((items, ri) => {
      let ord = null;
      let bestBad = 1e9;
      for (let tries = 0; tries < 40 && bestBad > 0; tries++) {
        const left = items.slice(), o2 = [];
        if (tries) left.push(...left.splice(0, tries % left.length));
        while (left.length) {
          const prev = o2[o2.length - 1];
          let k = left.findIndex(o => !prev || o.c !== prev.c);
          if (k < 0) k = 0;
          o2.push(left.splice(k, 1)[0]);
        }
        let bad = 0;
        for (let k = 0; k < o2.length; k++) {
          if (o2.length > 1 && o2[k].c === o2[(k + 1) % o2.length].c) bad++;
        }
        if (bad < bestBad) { bestBad = bad; ord = o2; }
      }

      const H = Math.max(...ord.map(o => o.h));
      let x = 0;
      const cells = ord.map(o => {
        const c = { s: o.s, x, y: (H - o.h) / 2, w: o.w, h: o.h };
        x += o.w + g;
        return c;
      });
      ROWS.push({ y, H, L: x, off: ((ri * 0.381966) % 1) * x, cells });
      y += H + g;
    });

    PH = y;
    PW = Math.max(...ROWS.map(r => r.L));
  }

  function build() {
    vw = innerWidth;
    vh = innerHeight;
    buildRows();
  }

  const mod = (a, b) => ((a % b) + b) % b;

  /* ---- Camera with Inertia ---- */
  let camX = 0, camY = 0, vx = 0, vy = 0, dragging = false, moved = 0, lastT = 0;
  function centre() { camX = PW * 0.3; camY = PH * 0.25; }

  /* ---- Virtualised DOM Cell Pool ---- */
  const live = new Map(), pool = [];

  function cellFor(key, s) {
    let el = live.get(key);
    if (el) return el;

    el = pool.pop();
    if (!el) {
      el = document.createElement('div');
      el.className = 'cell';
      const fl = document.createElement('div');
      fl.className = 'fl';
      const ph = document.createElement('div');
      ph.className = 'ph';
      const badge = document.createElement('span');
      badge.className = 'ph__badge';
      const im = document.createElement('img');
      im.alt = '';
      im.draggable = false;
      im.decoding = 'async';

      ph.appendChild(badge);
      ph.appendChild(im);
      fl.appendChild(ph);
      el.appendChild(fl);
      if (space) space.appendChild(el);
    }

    const fl = el.querySelector('.fl');
    const ph = el.querySelector('.ph');
    const badge = el.querySelector('.ph__badge');
    const im = el.querySelector('img');
    const p = P[s] || {};

    if (el.dataset.k !== key) {
      el.dataset.k = key;
      const r = n => {
        let h = 2166136261;
        for (const ch of key + n) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
        return ((h >>> 0) % 1000) / 1000;
      };
      if (ph) ph.style.setProperty('--z', '1');
      const amp = 0.25;
      if (fl) {
        fl.style.setProperty('--fx', ((r('x') - 0.5) * 14 * amp).toFixed(1) + 'px');
        fl.style.setProperty('--fy', ((r('y') - 0.5) * 18 * amp).toFixed(1) + 'px');
        fl.style.setProperty('--fr', ((r('r') - 0.5) * 1.4 * amp).toFixed(2) + 'deg');
        fl.style.setProperty('--fd', (10 + r('d') * 8).toFixed(1) + 's');
        fl.style.setProperty('--fdl', (-r('l') * 18).toFixed(1) + 's');
      }
    }

    if (el.dataset.s !== String(s)) {
      el.dataset.s = s;
      if (p.t) {
        if (ph) ph.style.backgroundImage = `url(${p.t})`;
        if (im) {
          im.src = p.t;
          if (im.complete && im.naturalWidth) im.classList.add('ok');
          else im.onload = () => im.classList.add('ok');
        }
      }

      if (badge) {
        if (p.mediaType === 'video') {
          badge.style.display = 'inline-flex';
          badge.className = 'ph__badge ph__badge--vid';
          badge.textContent = '▶ VIDEO';
        } else if (p.badge) {
          badge.style.display = 'inline-flex';
          badge.className = 'ph__badge';
          badge.textContent = p.badge;
        } else {
          badge.style.display = 'none';
        }
      }
    }

    el.style.display = '';
    live.set(key, el);
    return el;
  }

  function render() {
    if (!ROWS || ROWS.length === 0) return;
    const seen = new Set();
    const iy0 = Math.floor((camY - 400) / PH);
    const iy1 = Math.floor((camY + vh) / PH);

    for (let iy = iy0; iy <= iy1; iy++) {
      ROWS.forEach((row, ri) => {
        const ry = row.y + iy * PH - camY;
        if (ry + row.H < -40 || ry > vh + 40) return;
        const base = camX + row.off;
        const ix0 = Math.floor((base - 400) / row.L);
        const ix1 = Math.floor((base + vw) / row.L);

        for (let ix = ix0; ix <= ix1; ix++) {
          row.cells.forEach((c, k) => {
            const x = c.x + ix * row.L - base;
            const y = ry + c.y;
            if (x + c.w < -40 || x > vw + 40) return;

            const key = `${ix}:${iy}:${ri}:${k}`;
            const el = cellFor(key, c.s);
            el.style.width = c.w + 'px';
            el.style.height = c.h + 'px';
            el.style.transform = `translate3d(${x}px,${y}px,0)`;
            seen.add(key);
          });
        }
      });
    }

    for (const [key, el] of live) {
      if (!seen.has(key)) {
        live.delete(key);
        el.style.display = 'none';
        pool.push(el);
      }
    }
  }

  /* ---- Deep Space Canvas Background (Parallax Nebula & Stars) ---- */
  let tiltX = 0, tiltY = 0, mvx = 0, mvy = 0;
  const sky = document.getElementById('sky');
  const sx = sky ? sky.getContext('2d') : null;
  const TILE = 1600, STARS = [], NEB = [];

  (function seed() {
    let a = 987654321;
    const rnd = () => (a = Math.imul(a ^ (a >>> 15), 2246822507) ^ Math.imul(a ^ (a >>> 13), 3266489909), ((a >>> 0) % 1e6) / 1e6);
    for (let i = 0; i < 520; i++) {
      const m = Math.pow(rnd(), 3.2);
      STARS.push({ x: rnd() * TILE, y: rnd() * TILE, a: 0.2 + m * 0.75, s: 0.7 + m * 1.5, w: rnd() < 0.12 });
    }
    const tones = ['245,158,11', '196,176,176', '140,40,40', '150,110,60'];
    for (let i = 0; i < 6; i++) {
      NEB.push({ x: rnd() * TILE, y: rnd() * TILE, r: 260 + rnd() * 380, c: tones[i % 4], a: 0.06 + rnd() * 0.06 });
    }
  })();

  function sizeSky() {
    if (!sky || !sx) return;
    const dpr = Math.min((typeof window !== 'undefined' && window.devicePixelRatio) || 1, 2);
    sky.width = Math.round(innerWidth * dpr);
    sky.height = Math.round(innerHeight * dpr);
    sx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  let skyX = NaN, skyY = NaN;
  function drawSky() {
    if (!sky || !sx) return;
    const ox = camX * 0.12, oy = camY * 0.12;
    if (ox === skyX && oy === skyY) return;
    skyX = ox; skyY = oy;
    const w = innerWidth, h = innerHeight;

    sx.globalCompositeOperation = 'source-over';
    sx.fillStyle = '#030306';
    sx.fillRect(0, 0, w, h);
    sx.globalCompositeOperation = 'lighter';

    const hx = camX * 0.06, hy = camY * 0.06;
    for (const n of NEB) {
      for (let ix = -1; ix <= Math.ceil(w / TILE); ix++) {
        for (let iy = -1; iy <= Math.ceil(h / TILE); iy++) {
          const x = mod(n.x - hx, TILE) + ix * TILE;
          const y = mod(n.y - hy, TILE) + iy * TILE;
          if (x + n.r < 0 || y + n.r < 0 || x - n.r > w || y - n.r > h) continue;
          const g = sx.createRadialGradient(x, y, 0, x, y, n.r);
          g.addColorStop(0, `rgba(${n.c},${n.a})`);
          g.addColorStop(0.45, `rgba(${n.c},${n.a * 0.45})`);
          g.addColorStop(1, `rgba(${n.c},0)`);
          sx.fillStyle = g;
          sx.fillRect(x - n.r, y - n.r, n.r * 2, n.r * 2);
        }
      }
    }

    for (const s of STARS) {
      const x0 = mod(s.x - ox, TILE), y0 = mod(s.y - oy, TILE);
      for (let x = x0; x < w; x += TILE) {
        for (let y = y0; y < h; y += TILE) {
          sx.fillStyle = s.w ? `rgba(255,236,220,${s.a})` : `rgba(226,230,255,${s.a})`;
          sx.fillRect(x, y, s.s, s.s);
        }
      }
    }
  }

  function tick(t) {
    const dt = Math.min(48, t - (lastT || t)) / 16.67;
    lastT = t;
    const sx_val = dragging ? mvx : vx, sy_val = dragging ? mvy : vy;
    const txT = Math.max(-5, Math.min(5, sy_val * 0.35)), tyT = Math.max(-5, Math.min(5, -sx_val * 0.35));
    tiltX += (txT - tiltX) * 0.08 * dt;
    tiltY += (tyT - tiltY) * 0.08 * dt;
    mvx *= 0.85; mvy *= 0.85;

    if (!reduced && space) {
      space.style.transform = `rotateX(${tiltX.toFixed(3)}deg) rotateY(${tiltY.toFixed(3)}deg)`;
    }
    if (!dragging && (Math.abs(vx) > 0.05 || Math.abs(vy) > 0.05)) {
      camX += vx * dt;
      camY += vy * dt;
      const f = Math.pow(0.94, dt);
      vx *= f; vy *= f;
      render();
    }
    drawSky();
    requestAnimationFrame(tick);
  }

  /* ---- Pointer Input with Inertia ---- */
  let px = 0, py = 0, downX = 0, downY = 0, samples = [];

  if (wall) {
    wall.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      dragging = true; moved = 0; vx = vy = 0;
      px = downX = e.clientX; py = downY = e.clientY;
      samples = [{ x: px, y: py, t: e.timeStamp }];
      wall.setPointerCapture(e.pointerId);
      wall.classList.add('drag');
      hideHint();
    });

    wall.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - px, dy = e.clientY - py;
      px = e.clientX; py = e.clientY;
      camX -= dx; camY -= dy;
      mvx = -dx; mvy = -dy;
      moved = Math.max(moved, Math.hypot(px - downX, py - downY));
      samples.push({ x: px, y: py, t: e.timeStamp });
      if (samples.length > 6) samples.shift();
      render();
    });

    const end = e => {
      if (!dragging) return;
      dragging = false;
      wall.classList.remove('drag');
      const a = samples[0], b = samples[samples.length - 1];
      const dt = Math.max(1, b.t - a.t);
      if (b.t - a.t < 120 && !reduced) {
        vx = -(b.x - a.x) / dt * 16.67;
        vy = -(b.y - a.y) / dt * 16.67;
      }
      if (moved < 6) {
        const hit = document.elementsFromPoint(e.clientX, e.clientY).map(n => n.closest?.('.cell')).find(Boolean);
        if (hit && hit.dataset.s !== undefined) {
          openLb(+hit.dataset.s);
        }
      }
    };

    wall.addEventListener('pointerup', end);
    wall.addEventListener('pointercancel', end);
  }

  /* ---- Wheel / Trackpad Scroll ---- */
  addEventListener('wheel', e => {
    if (lb && !lb.hidden) return;
    e.preventDefault();
    let dx = e.deltaX, dy = e.deltaY;
    if (e.deltaMode === 1) { dx *= 32; dy *= 32; }
    if (e.shiftKey && !dx) { dx = dy; dy = 0; }
    camX += dx; camY += dy;
    vx = vy = 0;
    render();
    hideHint();
  }, { passive: false });

  /* ---- Keyboard Navigation ---- */
  addEventListener('keydown', e => {
    if (lb && !lb.hidden) {
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'Tab') {
        const f = [...lb.querySelectorAll('button,a[href],[tabindex]:not([tabindex="-1"])')].filter(n => n.offsetWidth || n.offsetHeight);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (!lb.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      return;
    }
    const s = 22;
    const m = { ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] }[e.key];
    if (m) {
      e.preventDefault();
      vx += m[0] * 0.5;
      vy += m[1] * 0.5;
      hideHint();
    }
    if ((e.key === 'Enter' || e.key === ' ') && document.activeElement === wall) {
      e.preventDefault();
      const hit = document.elementsFromPoint(innerWidth / 2, innerHeight / 2).map(n => n.closest?.('.cell')).find(Boolean);
      if (hit && hit.dataset.s !== undefined) openLb(+hit.dataset.s);
      else hideHint();
    }
    if (e.key === 'Escape') leave();
  });

  /* ---- Lightbox Modal ---- */
  const lb = document.getElementById('lb');
  const lbImg = document.getElementById('lbImg');
  const lbVid = document.getElementById('lbVid');
  const lbTitle = document.getElementById('lbTitle');
  const lbSub = document.getElementById('lbSub');
  const lbSpecs = document.getElementById('lbSpecs');
  const lbCount = document.getElementById('lbCount');
  let cur = 0;

  function show(i) {
    if (!P.length) return;
    cur = mod(i, N);
    const p = P[cur];

    if (p.mediaType === 'video' && p.videoSrc) {
      if (lbImg) lbImg.style.display = 'none';
      if (lbVid) {
        lbVid.style.display = 'block';
        lbVid.src = p.videoSrc;
        lbVid.poster = p.f || p.t;
        lbVid.play().catch(() => {});
      }
    } else {
      if (lbVid) {
        lbVid.pause();
        lbVid.style.display = 'none';
      }
      if (lbImg) {
        lbImg.style.display = 'block';
        lbImg.src = p.t;
        const full = new Image();
        full.decoding = 'async';
        full.src = p.f;
        full.onload = () => { if (cur === mod(i, N)) lbImg.src = p.f; };
        lbImg.alt = p.title || `Photo ${cur + 1} of ${N}`;
      }
    }

    if (lbTitle) lbTitle.textContent = p.title || '';
    if (lbSub) lbSub.textContent = p.subtitle || '';
    if (lbCount) lbCount.textContent = `${cur + 1} / ${N}`;

    if (lbSpecs) {
      const s = p.stats || {};
      const pills = [];
      if (s.weight) pills.push(s.weight);
      if (s.reps && s.reps !== '—') pills.push(s.reps);
      if (s.discipline) pills.push(s.discipline);
      if (s.gear) pills.push(s.gear);
      if (s.meet) pills.push(s.meet);
      lbSpecs.innerHTML = pills.map(txt => `<span class="lb__spec-pill">${esc(txt)}</span>`).join('');
    }

    const nextP = P[mod(cur + 1, N)];
    if (nextP && nextP.mediaType !== 'video') {
      new Image().src = nextP.f;
    }
  }

  function openLb(i) {
    if (!lb) return;
    show(i);
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add('open'));
    try { document.getElementById('lbClose')?.focus?.(); } catch (_) {}
  }

  function closeLb() {
    if (!lb) return;
    lb.classList.remove('open');
    if (lbVid) lbVid.pause();
    setTimeout(() => {
      lb.hidden = true;
      try { wall?.focus?.(); } catch (_) {}
    }, 300);
  }

  const step = d => show(cur + d);
  const closeBtn = document.getElementById('lbClose');
  const prevBtn = document.getElementById('lbPrev');
  const nextBtn = document.getElementById('lbNext');

  if (closeBtn) closeBtn.onclick = closeLb;
  if (prevBtn) prevBtn.onclick = () => step(-1);
  if (nextBtn) nextBtn.onclick = () => step(1);
  if (lb) {
    lb.addEventListener('click', e => {
      if (e.target === lb || e.target.classList.contains('lb__wrap')) closeLb();
    });
  }

  /* ---- Back / Door Navigation ---- */
  function leave() {
    if (EMBED) parent.postMessage({ wall: 'close' }, location.origin === 'null' ? '*' : location.origin);
    else location.href = document.getElementById('back').href;
  }
  const backBtn = document.getElementById('back');
  if (backBtn) {
    backBtn.addEventListener('click', e => {
      if (EMBED) { e.preventDefault(); leave(); }
    });
  }

  const hint = document.getElementById('hint');
  let hinted = false;
  function hideHint() {
    if (!hinted && hint) {
      hinted = true;
      hint.classList.add('gone');
    }
  }
  setTimeout(hideHint, 6000);

  addEventListener('resize', () => {
    sizeSky();
    skyX = NaN;
    const cx = camX + vw / 2, cy = camY + vh / 2;
    build();
    camX = cx - vw / 2; camY = cy - vh / 2;
    render();
  });

  /* ---- Live Rebuild Hook for Admin Panel ---- */
  window.__rebuildPowerlifter = function(items) {
    if (!Array.isArray(items) || items.length === 0) return;
    initItems(items);
    build();
    render();
  };

  fetch(API_ROOT + '/api/portfolio/powerlifting')
    .then(r => r.ok ? r.json() : null)
    .then(json => {
      if (json?.success && Array.isArray(json.data) && json.data.length > 0) {
        try { localStorage.setItem('ashik_powerlifting_items', JSON.stringify(json.data)); } catch (_) {}
        window.__rebuildPowerlifter(json.data);
      }
    })
    .catch(() => {});

  /* ---- Boot Initialization ---- */
  // 1. Initial items load
  if (window.POWERLIFTING_ITEMS && window.POWERLIFTING_ITEMS.length > 0) {
    initItems(window.POWERLIFTING_ITEMS);
  } else if (RAW_ITEMS && RAW_ITEMS.length > 0) {
    initItems(RAW_ITEMS);
  }

  sizeSky();
  build();
  centre();
  render();
  requestAnimationFrame(tick);
  try { wall?.focus?.({ preventScroll: true }); } catch (_) {}

  // Double check if lifts.js loaded slightly after engine
  if (!P || P.length === 0) {
    let checkCount = 0;
    const timer = setInterval(() => {
      checkCount++;
      if (window.POWERLIFTING_ITEMS && window.POWERLIFTING_ITEMS.length > 0) {
        clearInterval(timer);
        initItems(window.POWERLIFTING_ITEMS);
        build();
        centre();
        render();
      } else if (checkCount > 50) {
        clearInterval(timer);
      }
    }, 60);
  }
})();
