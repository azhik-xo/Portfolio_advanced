(() => {


const PROJECTS = (window.__room || ((r, d) => d))('app', [{"kind": "iOS app · Finance", "title": "Expense Tracker", "sub": "Personal finance, organised into books", "desc": "Spending is grouped into expense books such as Personal, Travel and Business, each with its own budget. Add income or an expense in a couple of taps, see the balance, spend and budget used at a glance, and search across every entry.", "tags": ["Budgets", "Expense books", "Shortcuts & Back Tap"], "video": "app-expense.mp4", "poster": "app-expense.webp", "note": "Screen recording on iPhone", "icon": "icon-expense.webp", "lqip": "data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAABQBQCdASoWADAAPrFOoEunJCMhqqgA4BYJaQAAPY/9OjphkIk8XGYA6eEFf3dAe9tN3gAA/varJVrewwzMIzTFLawEO29Fx1JsHinvtEM2zUFTPr13RVQd9uhJzNhx6bwOr+5hOwzYEeeMEGNNChwNt7zrkEgAAAA="}, {"kind": "iOS app · Privacy", "title": "Secret Vault", "sub": "A photo vault disguised as a calculator", "desc": "It looks and works like an ordinary calculator. Type your secret equation and double-tap % to open a private vault: photos you import are hidden there and can be removed from your photo library.", "tags": ["Privacy", "Equation passcode", "Photos access"], "video": "app-vault.mp4", "poster": "app-vault.webp", "note": "Recorded on iPhone with sample photos", "icon": "icon-vault.webp", "lqip": "data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAAAwBgCdASoWADAAPpVClkmlpCIhOrzIALASiWkA0YAs2W94CsvMnPEjrZH9/8puNKKooDEk+IeuVpgAAP7y2dGMKDtWIkcS87pXM5c73fkTCwUF+DRPBtVySJ2nAkgXYpkqGTouykU4hp5cR55AAA=="}, {"kind": "iOS game · Arcade", "title": "Brick Breaker", "sub": "Arcade game with pixel-art levels", "desc": "A fast arcade brick breaker: pixel-art levels, multi-ball power-ups that flood the screen, combos and a live score, with a pause menu and level-by-level progression.", "tags": ["Game design", "Power-ups", "Level design"], "video": "app-brick.mp4", "poster": "app-brick.webp", "note": "Gameplay recorded on iPhone", "icon": "icon-brick.webp", "lqip": "data:image/webp;base64,UklGRrwAAABXRUJQVlA4ILAAAAAwBgCdASoWADAAPrFGnEmnI6KhNVQIAOAWCWQAx+Q5X7Fb2+drW7FLsX3d1xUlIStpj0XKMRUoP52gAP78ptUdXrARGOtskF8MifbUiH/I2pV9htfUcRcLEZsUP3eAJrueLZGNJKnWpRjMHdgv1VjyOxdpHawEbcckCq9I27rno3Us0eHZpDW7GUyMBuEKNr8UHt6C+GiJtKWqjfSRTnZKBO1LxxDHHMli2UNE0O2QAA=="}, {"kind": "iOS app · Utility", "title": "Dice", "sub": "A colourful dice roller", "desc": "Roll several dice at once: each die fills its own block of colour and the total updates instantly, so a board-game night needs nothing but a phone.", "tags": ["Utility", "Minimal UI", "Tap to roll"], "video": "app-dice.mp4", "poster": "app-dice.webp", "note": "Screen recording on iPhone", "icon": "icon-dice.webp", "lqip": "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAACQBACdASoWADAAPqlGnkmmJCMhMAqowBUJYgCDMfkgGEg4+mAlEH6d3GNpc0AA/rhzRmSQDP+chJNr/d1jZAbXbk4ynfkvNYiJnwJ5T43ypu3InS8X7SMq5QkGluq3yOIvkG7PRYsaKUYAAAA="}], '2026-11-08T14:07:44.188Z', 'stack');
const ARROW = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>';
const SIG = '<svg aria-hidden="true" focusable="false" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>';
const WIFI = '<svg aria-hidden="true" focusable="false" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.3-1.4A10.6 10.6 0 0 0 8 .3 10.6 10.6 0 0 0 .7 3.2L2 4.6a8.7 8.7 0 0 1 6-2.4Zm0 3.8c1.3 0 2.5.5 3.4 1.3l1.3-1.4A6.8 6.8 0 0 0 8 4.1a6.8 6.8 0 0 0-4.7 1.8l1.3 1.4C5.5 6.5 6.7 6 8 6Zm0 3.7c-.6 0-1.1.2-1.5.6L8 12l1.5-1.7c-.4-.4-.9-.6-1.5-.6Z"/></svg>';
const BATT = '<svg aria-hidden="true" focusable="false" viewBox="0 0 27 12" fill="none"><rect x=".5" y=".5" width="22" height="11" rx="3.2" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="19" height="8" rx="2" fill="currentColor"/><path d="M24.5 4v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity=".45"/></svg>';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const stack = document.getElementById('stack');
if (!stack.firstElementChild) stack.innerHTML = PROJECTS.map((p, i) => `
  <article class="card${i % 2 ? ' flip' : ''}" style="--i:${i}" aria-labelledby="p${i}">
    <div class="card__in">
      <div class="card__info">
        <div class="app"><img src="${p.icon}" alt="" width="58" height="58" decoding="async" loading="${i < 1 ? 'eager' : 'lazy'}"><p class="card__meta"><span>${esc(p.kind)}</span></p></div>
        <h2 id="p${i}">${esc(p.title)}</h2>
        <p class="sub">${esc(p.sub)}</p>
        <p class="desc">${esc(p.desc)}</p>
        <ul class="tags">${p.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
        ${p.url ? `<a class="live" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">Visit live site ${ARROW}</a>` : `<span class="note">${esc(p.note || 'Screen recording of the build')}</span>`}
      </div>
      <div class="stage" aria-hidden="true">
        <div class="phone"><div class="phone__body">
          <i class="phone__btn l" style="top:19%;height:4%"></i><i class="phone__btn l" style="top:26%;height:7.5%"></i><i class="phone__btn l" style="top:35%;height:7.5%"></i><i class="phone__btn r" style="top:28%;height:11%"></i>
          <div class="phone__screen" style="background-image:url(${p.lqip})">
            <video muted loop playsinline preload="metadata" poster="${p.poster}" src="${p.video}"></video>
            <div class="sbar"><span>9:41</span><span>${SIG}${WIFI}${BATT}</span></div><div class="island"></div>
          </div>
        </div></div>
      </div>
    </div>
    <div class="card__dim"></div>
  </article>`).join('');

const cards = [...stack.querySelectorAll('.card')];
// a recording's screen takes the recording's own shape, so nothing is cropped or letterboxed
/* Recordings play one at a time, and are plain videos: a real source, the browser's own poster and
   metadata preload, exactly like the UI/UX page. Safari draws its own still from the poster, so
   nothing has to be filled in by script before a screen can show a picture. Phones decode only a
   few videos at once, so only the screen being looked at plays and the rest are paused. */
const VIDS = cards.map(c => {
  const v = c.querySelector('video'); if (!v) return null;
  const scr = v.parentElement; scr.classList.add('vid');
  const o = { c, v, scr, armed: false, failed: false };
  const shape = () => { if (v.videoWidth) scr.style.setProperty('--ar', v.videoWidth + ' / ' + v.videoHeight); };
  if (v.readyState >= 1) shape(); else v.addEventListener('loadedmetadata', shape, { once: true });
  v.addEventListener('error', () => { o.failed = true; });      // the poster simply stays
  return o;
}).filter(Boolean);
function arm(o){ o.armed = true; }
function release(o){ o.armed = false; try { o.v.pause(); } catch (e) {} }
let activeVid = null;
function pickVideo(){
  if (!window.__live){ VIDS.forEach(release); activeVid = null; return; }
  // Which screen is the person actually looking at? Measure how much of each screen is
  // on display (cards stack over one another, so a screen stops where the next card starts).
  // Anything showing most of itself is a real candidate, and of those the one nearest the
  // middle of the window wins, so a card just sliding in at the bottom cannot steal it.
  const seen = [];
  for (const o of VIDS){
    if (o.failed || !o.c.classList.contains('on')) continue;
    const r = o.scr.getBoundingClientRect();
    if (r.height < 1) continue;
    let top = Math.max(r.top, 0), bot = Math.min(r.bottom, innerHeight);
    const i = cards.indexOf(o.c);
    for (let k = i + 1; k < cards.length; k++){
      const n = cards[k].getBoundingClientRect();
      if (n.top < bot) bot = Math.min(bot, n.top);
    }
    const area = Math.max(0, bot - top);
    if (area < 40) continue;
    seen.push({ o, area, frac: area / r.height, dist: Math.abs((top + bot) / 2 - innerHeight / 2) });
  }
  let best = null;
  const solid = seen.filter(x => x.frac >= 0.4);
  if (solid.length) best = solid.sort((a, b) => a.dist - b.dist)[0].o;
  else if (seen.length) best = seen.sort((a, b) => b.area - a.area)[0].o;
  if (best !== activeVid){ VIDS.forEach(o => { if (o !== best) release(o); }); activeVid = best; }
  if (best){ arm(best); best.v.play().catch(() => {}); }
}
window.__pickVideo = pickVideo;
// each live page scrolls itself top to bottom and back on its screen
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
// inside the home page the room is loaded early, out of sight: nothing plays until you have walked in and it has faded up
window.__live = !document.documentElement.classList.contains('embed');
window.__restartAll = () => {};
const SPEED = 230, REST = 1100;           // screen pixels a second, pause at each end (ms)
const shots = cards.map(c => {
  const img = c.querySelector('img.page'), scr = c.querySelector('.phone__screen'); if (!img) return null;
  const s = { c, img, scr, pos: 0, dist: 0, dir: 1, wait: REST, held: false };
  const measure = () => { s.dist = Math.max(0, img.offsetHeight - scr.clientHeight); s.pos = Math.min(s.pos, s.dist); paint(s); };
  if (img.complete && img.naturalWidth) measure(); else img.addEventListener('load', measure, { once: true });
  s.measure = measure;
  return s;
}).filter(Boolean);
function paint(s){ s.img.style.transform = `translate3d(0,${-s.pos.toFixed(1)}px,0)`; }
addEventListener('resize', () => shots.forEach(s => s.measure()));
// once a screen has been completely out of sight (scrolled away, or fully covered by the card stacked over it),
// it starts again from the top of its page the next time it shows
const screens = cards.map(c => ({ c, scr: c.querySelector('.phone__screen'), hidden: true, s: shots.find(x => x.c === c), v: c.querySelector('video') }));
function restart(o){
  if (o.s){ o.s.pos = 0; o.s.dir = 1; o.s.wait = REST; paint(o.s); }
  if (o.v){ try { o.v.currentTime = 0; } catch (err) {} }
}
function checkHidden(){
  screens.forEach((o, i) => {
    const r = o.scr.getBoundingClientRect();
    let hidden = r.bottom <= 0 || r.top >= innerHeight;
    if (!hidden) for (let k = i + 1; k < cards.length; k++){ const n = cards[k].getBoundingClientRect(); if (n.top <= r.top + 1 && n.bottom >= r.bottom - 1){ hidden = true; break; } }
    if (hidden && !o.hidden) restart(o);
    o.hidden = hidden;
    // which recording plays is decided in one place, by pickVideo()
    if (o.s) o.s.covered = hidden;
  });
  window.__pickVideo?.();
}
window.__restartAll = () => { screens.forEach(restart); VIDS.forEach(release); activeVid = null; };
addEventListener('scroll', checkHidden, { passive: true }); addEventListener('resize', checkHidden);
let lastT = 0;
function run(t){
  if (!window.__live){ lastT = t; requestAnimationFrame(run); return; }
  const dt = Math.min(64, t - (lastT || t)); lastT = t;
  if (!reduced) for (const s of shots){
    if (s.held || s.covered || !s.c.classList.contains('on') || !s.dist) continue;
    if (s.wait > 0){ s.wait -= dt; continue; }
    const left = s.dir > 0 ? s.dist - s.pos : s.pos;
    const ease = Math.min(1, .3 + left / 160) * Math.min(1, .35 + (s.dist - left) / 160);   // eases in and out at each end
    s.pos += s.dir * SPEED * ease * dt / 1000;
    if (s.pos >= s.dist){ s.pos = s.dist; s.dir = -1; s.wait = REST; }
    else if (s.pos <= 0){ s.pos = 0; s.dir = 1; s.wait = REST; }
    paint(s);
  }
  requestAnimationFrame(run);
}
requestAnimationFrame(run);
checkHidden();
// play only what's on screen
const io = new IntersectionObserver(es => es.forEach(e => {
  const c = e.target; c.classList.toggle('on', e.isIntersecting);
  if (e.isIntersecting) c.classList.add('seen');
  window.__pickVideo?.();
}), { threshold: .25 });
cards.forEach(c => io.observe(c));
// stacking: as the next card slides over, the one beneath settles back a little
let ticking = false;
function stackFx(){
  ticking = false;
  cards.forEach((c, i) => {
    const next = cards[i + 1]; let p = 0;
    if (next){ const top = parseFloat(getComputedStyle(c).top), h = c.offsetHeight; p = Math.min(1, Math.max(0, (top + h - next.getBoundingClientRect().top) / h)); }
    c.style.transform = p ? `scale(${(1 - p * .06).toFixed(4)})` : '';
    c.lastElementChild.style.opacity = (p * .28).toFixed(3);
  });
}
if (!reduced){ addEventListener('scroll', () => { if (!ticking){ ticking = true; requestAnimationFrame(stackFx); } }, { passive: true }); stackFx(); }

(() => {
  const root = document.documentElement, EMBED = root.classList.contains('embed');
  if (!EMBED) return;
  const back = [...document.querySelectorAll('a[href="../#works"]')];
  back.forEach(b => b.addEventListener('click', e => { e.preventDefault(); parent.postMessage({ wall: 'close' }, location.origin === 'null' ? '*' : location.origin); }));
  addEventListener('keydown', e => { if (e.key === 'Escape') parent.postMessage({ wall: 'close' }, location.origin === 'null' ? '*' : location.origin); });
  addEventListener('message', e => {
    if (e.source !== parent) return;                      // only the home page holding this room may steer it
    const m = e.data || {};
    if (m.wall === 'enter'){ root.classList.remove('out'); scrollTo(0, 0); window.__restartAll(); requestAnimationFrame(() => root.classList.add('in'));
      clearTimeout(window.__liveT); window.__liveT = setTimeout(() => { window.__live = true; checkHidden(); dispatchEvent(new Event('scroll')); }, 650); }
    if (m.wall === 'exit'){ clearTimeout(window.__liveT); window.__live = false; root.classList.add('out'); root.classList.remove('in'); window.__pickVideo?.(); }   // __live is false now, so every decoder is handed back
    if (m.wall === 'reset'){ root.classList.remove('out', 'in'); }
    if (m.wall === 'mode'){ if (m.mode === 'dark') root.dataset.mode = 'dark'; else delete root.dataset.mode; }
  });
})();

// press F for full screen (again, or Esc, to leave); ignored while typing
(() => {
  const typing = e => { const t = e.target; return t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)); };
  const toggle = () => {
    const d = document, el = d.documentElement;
    if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
    else (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el)?.catch?.(() => {});
  };
  addEventListener('keydown', e => {
    if ((e.key !== 'f' && e.key !== 'F') || e.metaKey || e.ctrlKey || e.altKey || typing(e)) return;
    e.preventDefault();
    if (window.top !== window) { try { parent.postMessage({ wall: 'fullscreen' }, location.origin === 'null' ? '*' : location.origin); } catch (_) {} return; }
    toggle();
  });
  if (window.top === window) addEventListener('message', e => {
    // only one of this page's own frames can ask for full screen
    if (!e.data || e.data.wall !== 'fullscreen' || ![...document.querySelectorAll('iframe')].some(f => f.contentWindow === e.source)) return;
    toggle();
  });
})();

(() => {
  // every image and recording starts on a shimmering placeholder, which lifts as soon as it has something to show
  const done = el => el.parentElement && el.parentElement.classList.remove('skel');
  const watch = el => {
    const box = el.parentElement; if (!box || box.dataset.sk || el.closest('.app')) return; box.dataset.sk = 1;   // small app icons load instantly: no placeholder
    if (el.tagName === 'IMG'){
      if (el.complete && el.naturalWidth) return;
      box.classList.add('skel');
      el.addEventListener('load', () => done(el), { once: true }); el.addEventListener('error', () => done(el), { once: true });
    } else {
      // whenever it has to wait for more of the recording, the shimmer comes back over the poster
      el.addEventListener('waiting', () => box.classList.add('skel-buf'));
      ['playing', 'canplay', 'pause', 'error'].forEach(ev => el.addEventListener(ev, () => box.classList.remove('skel-buf')));
      if (el.readyState >= 2) return;
      box.classList.add('skel');
      el.addEventListener('loadeddata', () => done(el), { once: true });
      if (el.poster){ const im = new Image(); im.onload = () => done(el); im.src = el.poster; }
    }
  };
  const scan = () => document.querySelectorAll('main img, main video').forEach(watch);
  scan(); new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
})();

(() => {
  const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const tick = () => { const d = new Date(), h = d.getHours();
    document.querySelectorAll('[data-ftime]').forEach(e => e.textContent = `${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}${h < 12 ? 'am' : 'pm'}`);
    document.querySelectorAll('[data-fyear]').forEach(e => e.textContent = d.getFullYear()); };
  tick(); setInterval(tick, 20000);
  // size the footer name so it spans the full width with only a sliver of margin
  const fit = () => document.querySelectorAll('.sf').forEach(f => {
    const w = f.querySelector('.sf__word'); if (!w) return;
    const span = [...w.children].find(s => getComputedStyle(s).display !== 'none'); if (!span) return;
    w.style.setProperty('--wf', '100px');
    const k = (f.clientWidth * .955) / span.getBoundingClientRect().width;
    f.style.setProperty('--wf', (100 * k).toFixed(2) + 'px'); w.style.removeProperty('--wf');
  });
  fit(); addEventListener('resize', fit); document.fonts?.ready.then(fit);
  // the footer's rounded corners show whatever sits directly above it: find that section's colour and paint it behind them
  const sfw = document.querySelector('.sfw');
  const above = () => {
    if (!sfw) return;
    const solid = e => { const c = getComputedStyle(e).backgroundColor; const m = c.match(/[\d.]+/g); return m && !(m.length > 3 && +m[3] < .05) ? c : ''; };
    let col = '', e = sfw.previousElementSibling;
    while (e){ if (e.getBoundingClientRect().width >= innerWidth * .9){ const c = solid(e); if (c) col = c; } e = e.lastElementChild; }
    const bg = col || solid(document.body) || getComputedStyle(document.documentElement).backgroundColor;
    sfw.style.setProperty('--above', bg);
    // a dark section above: a hairline keeps the footer reading as its own section
    const m = (bg.match(/[\d.]+/g) || [255, 255, 255]).map(Number);
    sfw.classList.toggle('sfw--dark', (.2126 * m[0] + .7152 * m[1] + .0722 * m[2]) / 255 < .25);
  };
  above(); addEventListener('load', above); addEventListener('resize', above);
  new MutationObserver(above).observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });
  // floating back-to-top: appears after the first screen, shows scroll progress, flips colour over dark backgrounds
  const tt = document.querySelector('.totop');
  if (tt) {
    const c = tt.querySelector('.ring circle'); tt.style.setProperty('--len', (2 * Math.PI * 24).toFixed(2));
    const lum = el => { for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
        const m = getComputedStyle(e).backgroundColor.match(/[\d.]+/g); if (!m) continue;
        if (m.length > 3 && +m[3] < .5) continue; return (.2126 * m[0] + .7152 * m[1] + .0722 * m[2]) / 255; }
      const m = getComputedStyle(document.body).backgroundColor.match(/[\d.]+/g) || [255,255,255];
      return (m.length > 3 && +m[3] < .5) ? (document.documentElement.dataset.mode === 'dark' ? 0 : 1) : (.2126 * m[0] + .7152 * m[1] + .0722 * m[2]) / 255; };
    let raf = 0;
    const upd = () => { raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight, y = scrollY;
      const bot = document.querySelector('.sf__bot');  // the footer has its own 'Back to top', so step aside once it's on screen
      tt.classList.toggle('show', y > innerHeight * .9 && !(bot && bot.getBoundingClientRect().top < innerHeight - 8));
      tt.style.setProperty('--p', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
      const r = tt.getBoundingClientRect();
      tt.style.pointerEvents = 'none';
      const under = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      tt.style.pointerEvents = '';
      if (under) tt.dataset.on = lum(under) < .45 ? 'dark' : 'light'; };
    const q = () => { if (!raf) raf = requestAnimationFrame(upd); };
    addEventListener('scroll', q, { passive: true }); addEventListener('resize', q);
    new MutationObserver(q).observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode', 'class'] });
    upd();
  }
})();

// "Back to the doors" stays on screen in the corner the whole time you're inside a room
(() => {
  const top = document.querySelector('.top .chip'); if (!top) return;
  const bar = document.querySelector('.rn__in'); if (!bar) return;
  const b = document.createElement('a');
  b.className = 'backd'; b.href = top.getAttribute('href'); b.setAttribute('aria-label', 'Back to the doors');
  b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg><span>Back to the doors</span>';
  b.addEventListener('click', e => { e.preventDefault(); top.click(); });     // same exit as the link at the top
  bar.insertBefore(b, bar.firstChild);                                        // first thing in the sticky bar, on the left
  top.style.visibility = 'hidden'; top.tabIndex = -1;                      // the pill in the bar takes its place, so there is one way back, always on screen
  requestAnimationFrame(() => b.classList.add('show'));
})();

(() => {
  const root = document.documentElement, EMBED = root.classList.contains('embed');
  const HOME = '../#works'.replace(/#works$/, '');
  const SLUGS = ["web-developer", "app-developer", "ui-ux-designer", "devops-engineer", "powerlifter"];
  const go = to => {
    if (to === 'top'){ scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (EMBED){ parent.postMessage({ wall: 'go', to }, location.origin === 'null' ? '*' : location.origin); return; }
    if (to === 'home') location.href = HOME;
    else if (to === 'about') location.href = HOME + '#about';
    else if (to === 'contact') location.href = HOME + '#contact';
    else if (to.startsWith('door:')) location.href = HOME + '#' + SLUGS[+to.slice(5)];
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-nav]'); if (!b) return;
    if (b.tagName === 'A' && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button)) return;   // new tab: let the link do it
    e.preventDefault(); rn.classList.remove('open'); menu.setAttribute('aria-expanded', 'false');
    const to = b.dataset.nav;
    if (b.hasAttribute('aria-current')){ scrollTo({ top: 0, behavior: 'smooth' }); return; }
    go(to);
  });
  const rn = document.getElementById('rn'), menu = document.getElementById('rnMenu');
  const panel = document.getElementById('rnPanel'), pclose = document.getElementById('rnClose');
  // each line in the menu knows its place, so they rise in one after another
  panel.querySelectorAll('.rn__plist button').forEach((b, i) => b.style.setProperty('--i', i));
  const setMenu = o => {
    rn.classList.toggle('open', o);
    menu.setAttribute('aria-expanded', o);
    root.classList.toggle('rn-lock', o);                 // the page behind stops scrolling
    if (o) setTimeout(() => pclose.focus(), 60); else menu.focus();
  };
  menu.addEventListener('click', () => setMenu(!rn.classList.contains('open')));
  pclose.addEventListener('click', () => setMenu(false));
  addEventListener('keydown', e => {
    if (!rn.classList.contains('open')) return;
    if (e.key === 'Escape'){ setMenu(false); return; }
    if (e.key !== 'Tab') return;                          // the keyboard stays inside the open menu
    const f = [...panel.querySelectorAll('button')].filter(n => n.offsetWidth || n.offsetHeight);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (!panel.contains(document.activeElement)){ e.preventDefault(); first.focus(); }
    else if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  });
  panel.addEventListener('click', e => { if (e.target.closest('button[data-nav]')) setMenu(false); });
  matchMedia('(min-width:1200px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
  const upd = () => rn.classList.toggle('stuck', scrollY > 10); addEventListener('scroll', upd, { passive: true }); upd();
  // content that sticks (the project cards) parks below the navbar, never behind it
  const navH = () => { root.style.setProperty('--nav-h', rn.offsetHeight + 'px'); root.style.setProperty('--rn-h', rn.offsetHeight + 'px'); };
  navH(); addEventListener('resize', navH); new ResizeObserver(navH).observe(rn);
  const M = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const d = new Date(), short = matchMedia('(max-width: 767.98px)').matches; document.querySelectorAll('[data-fdate]').forEach(e => e.textContent = short ? `${d.getDate()} ${M[d.getMonth()].slice(0, 3)}` : `${d.getDate()} ${M[d.getMonth()]}, ${d.getFullYear()}`);
})();

(() => {
  const ID = 'G-12PNLHKGHK', K = 'ashik-analytics';
  let v = null; try { v = localStorage.getItem(K); } catch (e) {}
  const load = () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', ID);
    const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID; document.head.appendChild(s);
  };
  if (v === 'yes') return load();
  if (v === 'no') return;
  const b = document.getElementById('ck'); b.hidden = false;
  b.addEventListener('click', e => {
    const c = e.target.closest('[data-ck]'); if (!c) return;
    try { localStorage.setItem(K, c.dataset.ck); } catch (e) {}
    b.hidden = true; if (c.dataset.ck === 'yes') load();
  });
})();
})();
