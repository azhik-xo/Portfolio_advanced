// Keeps the rooms in step with Ashik's portfolio manager without a rebuild.
// Each room starts from the copy baked in at build time (so it paints instantly and works offline).
// If a newer published copy exists it is used: straight away when this browser has seen it before,
// otherwise the page fetches it, keeps it, and reloads once.
(function () {
  var read = function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  var keep = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };

  var catMap = {
    web: 'web',
    app: 'app',
    ux: 'uiux',
    uiux: 'uiux',
    devops: 'devops'
  };

  window.__room = function (room, baked, stamp, box) {
    var key = 'rt-live:' + room;
    var cached = read(key);
    var data = baked;

    if (cached && Array.isArray(cached.data) && cached.data.length > 0) {
      data = cached.data;
    }

    if (typeof window !== 'undefined' && window.fetch) {
      var category = catMap[room] || room;
      fetch('/api/portfolio/projects?category=' + encodeURIComponent(category))
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (res) {
          if (!res || !res.success || !Array.isArray(res.data) || res.data.length === 0) return;

          var mapped = res.data.map(function (p) {
            return {
              kind: p.subtitle || p.kind || 'Project',
              title: p.title,
              sub: p.subtitle || p.sub || '',
              desc: p.description || p.desc || '',
              tags: Array.isArray(p.tags) ? p.tags : [],
              url: p.liveUrl || p.url || '',
              video: p.videoUrl || p.video || '',
              poster: p.posterUrl || p.poster || '',
              shot: p.mediaUrl || p.shot || '',
              ar: p.ar || '1280 / 800',
              bg: p.bg || '#000',
              note: p.note || '',
              icon: p.icon || '',
              lqip: p.lqip || ''
            };
          });

          // Check if data is newer or changed
          var serializedOld = JSON.stringify(cached ? cached.data : baked);
          var serializedNew = JSON.stringify(mapped);
          if (serializedOld !== serializedNew) {
            keep(key, { at: new Date().toISOString(), data: mapped });
            var once = 'rt-reloaded:' + room + ':' + mapped.length;
            try {
              if (sessionStorage.getItem(once)) return;
              sessionStorage.setItem(once, '1');
            } catch (e) { return; }
            location.reload();
          }
        })
        .catch(function () {});
    }

    return data;
  };
})();
