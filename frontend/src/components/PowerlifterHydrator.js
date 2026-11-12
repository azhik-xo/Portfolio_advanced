'use client';

import { useEffect } from 'react';

export default function PowerlifterHydrator() {
  useEffect(() => {
    let isMounted = true;

    function formatPr(val, fallback) {
      if (!val) return fallback;
      let str = String(val).trim().replace(/\s*\([^)]*\)/g, '').trim().toUpperCase();
      if (/^\d+$/.test(str)) str += ' KG';
      return str;
    }

    function updatePrDom(stats) {
      if (!stats) return;
      const prEl = document.querySelector('.chip--prs');
      if (!prEl) return;
      const tot = formatPr(stats.bigThreeTotal, '315 KG');
      const sq = formatPr(stats.squatPR, '110 KG');
      const bp = formatPr(stats.benchPR, '70 KG');
      const dl = formatPr(stats.deadliftPR, '135 KG');

      prEl.innerHTML = `
        <span title="${escapeHtml(stats.bigThreeTotal || '')}">TOTAL: <b>${escapeHtml(tot)}</b></span>
        <span class="pr-div">·</span>
        <span title="${escapeHtml(stats.squatPR || '')}">SQ: <b>${escapeHtml(sq)}</b></span>
        <span class="pr-div">·</span>
        <span title="${escapeHtml(stats.benchPR || '')}">BP: <b>${escapeHtml(bp)}</b></span>
        <span class="pr-div">·</span>
        <span title="${escapeHtml(stats.deadliftPR || '')}">DL: <b>${escapeHtml(dl)}</b></span>
      `;
    }

    // 1. Instant sync from local cache
    try {
      const cachedStats = JSON.parse(localStorage.getItem('ashik_pr_stats') || 'null');
      if (cachedStats) updatePrDom(cachedStats);
    } catch (e) {}

    // 2. Fetch live profile stats
    async function syncProfile() {
      try {
        const res = await fetch('/api/portfolio/profile');
        if (!res.ok) return;
        const json = await res.json();
        if (!isMounted || !json?.success || !json.data?.stats) return;
        const stats = json.data.stats;
        updatePrDom(stats);
        try {
          localStorage.setItem('ashik_pr_stats', JSON.stringify(stats));
        } catch (e) {}
      } catch (err) {
        console.debug('Powerlifting PR sync fallback');
      }
    }

    // 3. Fetch live powerlifting items
    async function syncLifts() {
      try {
        const res = await fetch('/api/portfolio/powerlifting');
        if (!res.ok) return;
        const json = await res.json();
        if (!isMounted || !json?.success || !Array.isArray(json.data) || json.data.length === 0) return;

        const lifts = json.data;
        window.POWERLIFTING_ITEMS = lifts;
        try {
          localStorage.setItem('ashik_powerlifting_items', JSON.stringify(lifts));
        } catch (e) {}

        if (typeof window.__rebuildPowerlifter === 'function') {
          window.__rebuildPowerlifter(lifts);
        }
      } catch (err) {
        console.debug('Powerlifting cards sync fallback');
      }
    }

    syncProfile();
    syncLifts();

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
