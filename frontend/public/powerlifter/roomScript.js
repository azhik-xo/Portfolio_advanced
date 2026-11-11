(() => {


const PROJECTS = (window.__room || ((r, d) => d))('web', [{"kind": "Website build", "title": "Sundown Studio", "sub": "Studio website", "desc": "An editorial website for a multi-disciplinary studio that creates spaces and experiences: oversized type, a soft red glow that follows the story and a project list that reveals imagery on hover.", "tags": ["Design & build", "Motion", "Hover interactions"], "video": "project-2.mp4", "poster": "project-2.webp", "ar": "1280 / 732", "bg": "#EBE7DE"}, {"kind": "Website build", "title": "Personal portfolio", "sub": "Product designer portfolio", "desc": "A dark, type-led portfolio with a large display headline, a project list with hover previews and an about section.", "tags": ["Design & build", "Typography", "Hover previews"], "video": "project-4.mp4", "poster": "project-4.webp", "ar": "1280 / 730", "bg": "#000"}, {"kind": "Quicko · Live", "title": "P&L Page for Zerodha", "sub": "Broker landing page · pnl.page", "desc": "Landing page that helps Zerodha users connect their demat account, track profit & loss, download tax-ready reports and share verified P&L with their tax advisor.", "tags": ["Landing page", "Responsive build", "SEO"], "url": "https://pnl.page/brokers/zerodha", "shot": "1-zerodha.webp"}, {"kind": "Quicko · Live", "title": "Capital Gains Tax Calculator", "sub": "Interactive tool · quicko.com", "desc": "Calculates LTCG and STCG on shares, property, mutual funds and crypto: enter the buy price and sell date to get capital gains tax and indexed cost instantly.", "tags": ["Calculator", "Interactive UI", "SEO"], "url": "https://quicko.com/tools/capital-gains-tax-calculator", "shot": "4-quicko-cg.webp"}, {"kind": "Sandbox · Live", "title": "Tax API Cost Calculator", "sub": "Pricing tool · sandbox.co.in", "desc": "Estimates the cost of tax APIs for KYC, Income Tax, TDS and GST: choose a plan, add monthly usage and download a pricing estimate.", "tags": ["Pricing calculator", "Interactive UI", "Embedded tool"], "url": "https://sandbox.co.in/tools/cost-calculator", "shot": "5-sandbox-cost.webp"}, {"kind": "Quicko · Live", "title": "Tax P&L Report, explained", "sub": "Long-form guide · pnl.page", "desc": "A guide to every sheet of the Tax P&L report: capital gains on shares, mutual funds and real estate, intraday and F&O income, dividends and loss adjustment, with tables and FAQs.", "tags": ["Content page", "Data tables", "SEO"], "url": "https://pnl.page/guides/understand-tax-pnl-report", "shot": "2-tax-pnl.webp"}, {"kind": "Quicko · Live", "title": "Capital Gains Statement, explained", "sub": "Long-form guide · pnl.page", "desc": "Walks Indian investors through each section of the Capital Gains Statement: STCG and LTCG on equity shares, mutual funds and real estate.", "tags": ["Content page", "Data tables", "SEO"], "url": "https://pnl.page/guides/understand-capital-gains-statement", "shot": "3-capital-gains.webp"}], '2026-11-08T14:07:44.188Z', 'stack');
const ARROW = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const stack = document.getElementById('stack');
if (!stack.firstElementChild) stack.innerHTML = PROJECTS.map((p, i) => `
  <article class="card${i % 2 ? ' flip' : ''}" style="--i:${i}" aria-labelledby="p${i}">
    <div class="card__in">
      <div class="card__info">
        <p class="card__meta"><span>${esc(p.kind)}</span></p>
        <h2 id="p${i}">${esc(p.title)}</h2>
        <p class="sub">${esc(p.sub)}</p>
        <p class="desc">${esc(p.desc)}</p>
        <ul class="tags">${p.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
        ${p.url ? `<a class="live" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">Visit live site ${ARROW}</a>` : `<span class="note">${esc(p.note || 'Screen recording of the build')}</span>`}
      </div>
      <div class="stage" aria-hidden="true">
        <div class="mon"><div class="mon__body"><div class="mon__screen${p.ar ? ' vid' : ''}"${p.ar ? ` style="--ar:${p.ar}"` : ''}>
          ${p.video ? `<video muted loop playsinline preload="metadata" poster="${p.poster}" src="${p.video}" style="background:${p.bg || '#000'};object-fit:${p.fit || 'contain'}"></video>`
                    : `<img class="page" src="${p.shot}" alt="${esc(p.title)}: full-page screenshot" decoding="async" loading="${i < 1 ? 'eager' : 'lazy'}">`}
        </div></div><div class="mon__neck"></div><div class="mon__foot"></div></div>
      </div>
    </div>
    <div class="card__dim"></div>
  </article>`).join('');

const cards = [...stack.querySelectorAll('.card')];
// a recording's screen takes the recording's own shape, so nothing is cropped or letterboxed
cards.forEach(c => { const v = c.querySelector('video'); if (!v) return; const scr = v.parentElement; scr.classList.add('vid');
  const set = () => { if (v.videoWidth) scr.style.setProperty('--ar', v.videoWidth + ' / ' + v.videoHeight); };
  if (v.readyState >= 1) set(); else v.addEventListener('loadedmetadata', set, { once: true }); });
// each live page scrolls itself top to bottom and back on its screen
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
// inside the home page the room is loaded early, out of sight: nothing plays until you have walked in and it has faded up
window.__live = !document.documentElement.classList.contains('embed');
window.__restartAll = () => {};
const SPEED = 230, REST = 1100;           // screen pixels a second, pause at each end (ms)
const shots = cards.map(c => {
  const img = c.querySelector('img.page'), scr = c.querySelector('.mon__screen'); if (!img) return null;
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
const screens = cards.map(c => ({ c, scr: c.querySelector('.mon__screen'), hidden: true, s: shots.find(x => x.c === c), v: c.querySelector('video') }));
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
    if (o.v){ if (hidden) o.v.pause(); else if (o.c.classList.contains('on') && window.__live) o.v.play().catch(() => {}); }
    if (o.s) o.s.covered = hidden;
  });
}
window.__restartAll = () => { screens.forEach(o => { restart(o); if (o.v) o.v.pause(); }); };
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
  const v = c.querySelector('video'); if (v){ if (e.isIntersecting && window.__live) v.play().catch(() => {}); else v.pause(); }
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
    if (m.wall === 'exit'){ clearTimeout(window.__liveT); window.__live = false; root.classList.add('out'); root.classList.remove('in'); document.querySelectorAll('video').forEach(v => v.pause()); }
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
