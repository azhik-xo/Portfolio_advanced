'use client';

import { useEffect } from 'react';

export default function StoryHydrator() {
  useEffect(() => {
    let isMounted = true;

    async function syncStoryTimeline() {
      try {
        const res = await fetch('/api/portfolio/story');
        if (!res.ok) return;
        const data = await res.json();

        if (!isMounted || !data?.success || !Array.isArray(data.data) || data.data.length === 0) {
          return;
        }

        const chapters = data.data;
        const settings = data.settings;

        const sec = document.querySelector('.story');
        if (!sec) return;

        // 1. Update Heading and Eyebrow if customized
        if (settings) {
          if (settings.eyebrow) {
            const eyebrowEl = sec.querySelector('.story__clock .eyebrow');
            if (eyebrowEl) eyebrowEl.textContent = settings.eyebrow;
          }
          if (settings.heading) {
            const headingEl = sec.querySelector('#storyTitle');
            if (headingEl) headingEl.textContent = settings.heading;
          }
        }

        // 2. Update Total Count Display and CSS Variable
        sec.style.setProperty('--n', chapters.length);
        const storyOfEl = sec.querySelector('.story__of');
        if (storyOfEl) {
          storyOfEl.textContent = `/ ${String(chapters.length).padStart(2, '0')}`;
        }

        // 3. Update Ambient Light Glow Nodes
        const ambEl = sec.querySelector('.story__amb');
        if (ambEl) {
          ambEl.innerHTML = Array.from({ length: chapters.length }, () => '<i></i>').join('');
        }

        // 4. Update Timeline Chapter Elements
        const listEl = sec.querySelector('.story__list');
        if (!listEl) return;

        const renderedChaptersHtml = chapters
          .map((ch, idx) => {
            const isNow = ch.isCurrent || idx === 0;
            const bulletItems = (Array.isArray(ch.bullets) ? ch.bullets : [])
              .map((b) => `<li>${escapeHtml(b)}</li>`)
              .join('');

            return `
            <li class="ch ${isNow ? 'ch--now' : ''}" data-y="${escapeHtml(ch.year || '2026')}" data-when="${escapeHtml(ch.when || '')}">
              <p class="ch__date">${escapeHtml(ch.when || '')}</p>
              <h3 class="ch__t">${escapeHtml(ch.title || '')}</h3>
              <p class="ch__org">${escapeHtml(ch.org || '')}</p>
              <ul class="ch__b">${bulletItems}</ul>
            </li>
          `;
          })
          .join('');

        listEl.innerHTML = renderedChaptersHtml;

        // 5. Trigger resize event so timeline measuring and tracking script recalibrates
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 100);
      } catch (err) {
        // Silently fall back to existing static markup
        console.debug('Story hydrator using pre-rendered fallback');
      }
    }

    syncStoryTimeline();

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

