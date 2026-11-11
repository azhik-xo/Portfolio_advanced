// Keeps the rooms in step with Rishi's portfolio manager without a rebuild.
// Each room starts from the copy baked in at build time (so it paints instantly and works offline).
// If a newer published copy exists it is used: straight away when this browser has seen it before,
// otherwise the page fetches it, keeps it, and reloads once.
(function () {
  var API = 'https://qgrbtgmcslsovoatttdm.supabase.co/rest/v1/portfolio_site';
  var KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFncmJ0Z21jc2xzb3ZvYXR0dGRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM5NjUxNDMsImV4cCI6MjEwOTU0MTE0M30.oAyFaUo-R5eNaFpc652OaxRP6bwSpxUeQr5qd3HN6Fo';   // the public "anon" key: it can only read what is already published
  var ms = function (s) { var t = Date.parse(String(s || '').replace(/(\.\d{3})\d+/, '$1')); return isNaN(t) ? 0 : t; };
  var read = function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  var keep = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
  window.__room = function (room, baked, stamp, box) {
    var key = 'rt-live:' + room, cached = read(key), data = baked, at = ms(stamp);
    if (cached && Array.isArray(cached.data) && ms(cached.at) > at) {
      data = cached.data; at = ms(cached.at);
      var el = box && document.getElementById(box);
      if (el) el.innerHTML = '';                 // drop the pre-rendered markup so the newer copy is drawn
    }
    if (location.protocol === 'https:' && window.fetch) {
      fetch(API + '?select=data,published_at&room=eq.' + encodeURIComponent(room), { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } })
        .then(function (r) { return r.ok ? r.json() : []; })
        .then(function (rows) {
          var row = rows && rows[0];
          if (!row || !Array.isArray(row.data) || !(ms(row.published_at) > at)) return;
          if (!keep(key, { at: row.published_at, data: row.data })) return;
          var once = 'rt-reloaded:' + room + ':' + row.published_at;
          try { if (sessionStorage.getItem(once)) return; sessionStorage.setItem(once, '1'); } catch (e) { return; }
          location.reload();
        })
        .catch(function () {});
    }
    return data;
  };
})();
