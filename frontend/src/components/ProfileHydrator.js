'use client';

import { useEffect } from 'react';
import { getApiUrl } from '../lib/api';

export default function ProfileHydrator() {
  useEffect(() => {
    let isMounted = true;

    async function syncProfile() {
      try {
        const res = await fetch(getApiUrl('/api/portfolio/profile'));
        if (!res.ok) return;
        const json = await res.json();
        if (!isMounted || !json?.success || !json.data) return;

        const profile = json.data;

        // 1. Hero bar status & location
        const heroBar = document.querySelector('.hero__bar');
        if (heroBar) {
          const spans = heroBar.querySelectorAll('span');
          if (spans[0] && profile.availability) {
            spans[0].textContent = profile.availability;
          }
          if (spans[1] && profile.location) {
            spans[1].textContent = profile.location;
          }
        }

        // 2. Footer eye
        const sfEye = document.querySelector('.sf__eye');
        if (sfEye && profile.availability) {
          sfEye.innerHTML = `<i></i>${escapeHtml(profile.availability)}`;
        }

        // 3. Footer status column
        const statusItems = document.querySelectorAll('.sf__cols .st');
        if (statusItems.length >= 2) {
          if (profile.availability) statusItems[0].textContent = profile.availability;
          if (profile.location) statusItems[1].textContent = profile.location;
        }

        // 4. Footer intro paragraph
        const sfP = document.querySelector('.sf__p');
        if (sfP && profile.responseTime) {
          sfP.textContent = `I'm available for engineering & design work: websites, iOS apps, cloud infrastructure and UI/UX design. Tell me what you need and I'll get back to you ${profile.responseTime.toLowerCase()}.`;
        }

        // 5. Contact modal reply notice
        const replyEl = document.getElementById('mReply');
        if (replyEl && profile.responseTime) {
          replyEl.textContent = `I reply ${profile.responseTime.toLowerCase()}.`;
        }

        // 6. Update email contacts if specified
        if (profile.socials?.email) {
          window.CONTACT_EMAIL = profile.socials.email;
          document.querySelectorAll('[data-mail]').forEach((a) => {
            a.href = 'mailto:' + profile.socials.email;
            a.textContent = profile.socials.email;
          });
        }
      } catch (err) {
        console.debug('Profile hydrator fallback');
      }
    }

    syncProfile();

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

