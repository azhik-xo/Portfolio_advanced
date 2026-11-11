(() => {
  const m = ['rishithakor218', 'gmail.com'].join('@');
  document.querySelectorAll('[data-mail]').forEach(a => { a.href = 'mailto:' + m; a.textContent = m; });
  document.querySelectorAll('[data-fyear]').forEach(e => e.textContent = new Date().getFullYear());
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