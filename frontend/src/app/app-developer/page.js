'use client';

import { useEffect } from 'react';
import './roomStyles.css';

export default function RoomPage() {
  useEffect(() => {
    try {
      const existing = document.getElementById('script-room-app-dev');
      if (existing) {
        window.__restartAll?.();
        return;
      }
      const script = document.createElement('script');
      script.id = 'script-room-app-dev';
      script.src = '/app-developer/roomScript.js';
      script.async = true;
      document.body.appendChild(script);
    } catch(e) {
      console.error(e);
    }
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `<div class="glow" aria-hidden="true"></div>
<header class="rn" id="rn">
  <div class="rn__in">
    <nav aria-label="Primary"><ul><li><button data-nav="home">Home</button></li><li><button data-nav="door:0">Web Development</button></li><li><button data-nav="door:1" aria-current=page>App Development</button></li><li><button data-nav="door:2">UI/UX Design</button></li><li><button data-nav="door:3">DevOps</button><button data-nav="door:4">Powerlifter</button></li><li><button data-nav="about">My story</button></li><li><button data-nav="contact">Contact</button></li></ul></nav>
    <div class="rn__clock" aria-label="Local time"><span>Local time</span><b data-ftime>—</b><span class="d">•</span><span class="d" data-fdate></span></div>
    <button class="rn__menu" id="rnMenu" aria-expanded="false" aria-controls="rnPanel"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg><span>Menu</span></button>
  </div>
  <div class="rn__panel" id="rnPanel" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="rn__phead">
      <span class="rn__plbl">Menu</span>
      <button class="rn__pclose" id="rnClose" aria-label="Close menu"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    </div>
    <div class="rn__plist"><button data-nav="home">Home</button><button data-nav="door:0">Web Development</button><button data-nav="door:1" aria-current=page>App Development</button><button data-nav="door:2">UI/UX Design</button><button data-nav="door:3">DevOps</button><button data-nav="door:4">Powerlifter</button><button data-nav="about">My story</button><button data-nav="contact">Contact</button></div>
    <p class="rn__pfoot">Ashik — available for new work<br>Replies within 5 hours</p>
  </div>
</header>

<main class="wrap">
  <div class="top"><a class="chip" href="../#works">← Back to the doors</a></div>
  <section class="intro">
    <h1>App Development</h1>
    <div><p>iOS apps and games, designed and built end to end: from the first screen and the small interactions to the details that make an app feel at home on iPhone.</p></div>
  </section>
  <section class="stack" id="stack" aria-label="Projects"><!--pre-->
  <article class="card" style="--i:0" aria-labelledby="p0">
    <div class="card__in">
      <div class="card__info">
        <div class="app"><img src="https://res.cloudinary.com/h8vtnbby/image/upload/v1794388854/ashik-portfolio/app-developer/icon-expense.webp" alt="" width="58" height="58" decoding="async" loading="eager"><p class="card__meta"><span>iOS app · Finance</span></p></div>
        <h2 id="p0">Expense Tracker</h2>
        <p class="sub">Personal finance, organised into books</p>
        <p class="desc">Spending is grouped into expense books such as Personal, Travel and Business, each with its own budget. Add income or an expense in a couple of taps, see the balance, spend and budget used at a glance, and search across every entry.</p>
        <ul class="tags"><li>Budgets</li><li>Expense books</li><li>Shortcuts &amp; Back Tap</li></ul>
        <span class="note">Screen recording on iPhone</span>
      </div>
      <div class="stage" aria-hidden="true">
        <div class="phone"><div class="phone__body">
          <i class="phone__btn l" style="top:19%;height:4%"></i><i class="phone__btn l" style="top:26%;height:7.5%"></i><i class="phone__btn l" style="top:35%;height:7.5%"></i><i class="phone__btn r" style="top:28%;height:11%"></i>
          <div class="phone__screen" style="background-image:url(data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAABQBQCdASoWADAAPrFOoEunJCMhqqgA4BYJaQAAPY/9OjphkIk8XGYA6eEFf3dAe9tN3gAA/varJVrewwzMIzTFLawEO29Fx1JsHinvtEM2zUFTPr13RVQd9uhJzNhx6bwOr+5hOwzYEeeMEGNNChwNt7zrkEgAAAA=)">
            <video muted loop playsinline preload="metadata" poster="https://res.cloudinary.com/h8vtnbby/video/upload/so_0/v1794388413/ashik-portfolio/app-developer/app-expense.webp" src="https://res.cloudinary.com/h8vtnbby/video/upload/v1794388413/ashik-portfolio/app-developer/app-expense.mp4"></video>
            <div class="sbar"><span>9:41</span><span><svg aria-hidden="true" focusable="false" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg aria-hidden="true" focusable="false" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.3-1.4A10.6 10.6 0 0 0 8 .3 10.6 10.6 0 0 0 .7 3.2L2 4.6a8.7 8.7 0 0 1 6-2.4Zm0 3.8c1.3 0 2.5.5 3.4 1.3l1.3-1.4A6.8 6.8 0 0 0 8 4.1a6.8 6.8 0 0 0-4.7 1.8l1.3 1.4C5.5 6.5 6.7 6 8 6Zm0 3.7c-.6 0-1.1.2-1.5.6L8 12l1.5-1.7c-.4-.4-.9-.6-1.5-.6Z"/></svg><svg aria-hidden="true" focusable="false" viewBox="0 0 27 12" fill="none"><rect x=".5" y=".5" width="22" height="11" rx="3.2" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="19" height="8" rx="2" fill="currentColor"/><path d="M24.5 4v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity=".45"/></svg></span></div><div class="island"></div>
          </div>
        </div></div>
      </div>
    </div>
    <div class="card__dim"></div>
  </article>
  <article class="card flip" style="--i:1" aria-labelledby="p1">
    <div class="card__in">
      <div class="card__info">
        <div class="app"><img src="https://res.cloudinary.com/h8vtnbby/image/upload/v1794388856/ashik-portfolio/app-developer/icon-vault.webp" alt="" width="58" height="58" decoding="async" loading="lazy"><p class="card__meta"><span>iOS app · Privacy</span></p></div>
        <h2 id="p1">Secret Vault</h2>
        <p class="sub">A photo vault disguised as a calculator</p>
        <p class="desc">It looks and works like an ordinary calculator. Type your secret equation and double-tap % to open a private vault: photos you import are hidden there and can be removed from your photo library.</p>
        <ul class="tags"><li>Privacy</li><li>Equation passcode</li><li>Photos access</li></ul>
        <span class="note">Recorded on iPhone with sample photos</span>
      </div>
      <div class="stage" aria-hidden="true">
        <div class="phone"><div class="phone__body">
          <i class="phone__btn l" style="top:19%;height:4%"></i><i class="phone__btn l" style="top:26%;height:7.5%"></i><i class="phone__btn l" style="top:35%;height:7.5%"></i><i class="phone__btn r" style="top:28%;height:11%"></i>
          <div class="phone__screen" style="background-image:url(data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAAAwBgCdASoWADAAPpVClkmlpCIhOrzIALASiWkA0YAs2W94CsvMnPEjrZH9/8puNKKooDEk+IeuVpgAAP7y2dGMKDtWIkcS87pXM5c73fkTCwUF+DRPBtVySJ2nAkgXYpkqGTouykU4hp5cR55AAA==)">
            <video muted loop playsinline preload="metadata" poster="https://res.cloudinary.com/h8vtnbby/video/upload/so_0/v1794388414/ashik-portfolio/app-developer/app-vault.webp" src="https://res.cloudinary.com/h8vtnbby/video/upload/v1794388414/ashik-portfolio/app-developer/app-vault.mp4"></video>
            <div class="sbar"><span>9:41</span><span><svg aria-hidden="true" focusable="false" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg aria-hidden="true" focusable="false" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.3-1.4A10.6 10.6 0 0 0 8 .3 10.6 10.6 0 0 0 .7 3.2L2 4.6a8.7 8.7 0 0 1 6-2.4Zm0 3.8c1.3 0 2.5.5 3.4 1.3l1.3-1.4A6.8 6.8 0 0 0 8 4.1a6.8 6.8 0 0 0-4.7 1.8l1.3 1.4C5.5 6.5 6.7 6 8 6Zm0 3.7c-.6 0-1.1.2-1.5.6L8 12l1.5-1.7c-.4-.4-.9-.6-1.5-.6Z"/></svg><svg aria-hidden="true" focusable="false" viewBox="0 0 27 12" fill="none"><rect x=".5" y=".5" width="22" height="11" rx="3.2" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="19" height="8" rx="2" fill="currentColor"/><path d="M24.5 4v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity=".45"/></svg></span></div><div class="island"></div>
          </div>
        </div></div>
      </div>
    </div>
    <div class="card__dim"></div>
  </article>
  <article class="card" style="--i:2" aria-labelledby="p2">
    <div class="card__in">
      <div class="card__info">
        <div class="app"><img src="https://res.cloudinary.com/h8vtnbby/image/upload/v1794388417/ashik-portfolio/app-developer/icon-brick.webp" alt="" width="58" height="58" decoding="async" loading="lazy"><p class="card__meta"><span>iOS game · Arcade</span></p></div>
        <h2 id="p2">Brick Breaker</h2>
        <p class="sub">Arcade game with pixel-art levels</p>
        <p class="desc">A fast arcade brick breaker: pixel-art levels, multi-ball power-ups that flood the screen, combos and a live score, with a pause menu and level-by-level progression.</p>
        <ul class="tags"><li>Game design</li><li>Power-ups</li><li>Level design</li></ul>
        <span class="note">Gameplay recorded on iPhone</span>
      </div>
      <div class="stage" aria-hidden="true">
        <div class="phone"><div class="phone__body">
          <i class="phone__btn l" style="top:19%;height:4%"></i><i class="phone__btn l" style="top:26%;height:7.5%"></i><i class="phone__btn l" style="top:35%;height:7.5%"></i><i class="phone__btn r" style="top:28%;height:11%"></i>
          <div class="phone__screen" style="background-image:url(data:image/webp;base64,UklGRrwAAABXRUJQVlA4ILAAAAAwBgCdASoWADAAPrFGnEmnI6KhNVQIAOAWCWQAx+Q5X7Fb2+drW7FLsX3d1xUlIStpj0XKMRUoP52gAP78ptUdXrARGOtskF8MifbUiH/I2pV9htfUcRcLEZsUP3eAJrueLZGNJKnWpRjMHdgv1VjyOxdpHawEbcckCq9I27rno3Us0eHZpDW7GUyMBuEKNr8UHt6C+GiJtKWqjfSRTnZKBO1LxxDHHMli2UNE0O2QAA==)">
            <video muted loop playsinline preload="metadata" poster="https://res.cloudinary.com/h8vtnbby/video/upload/so_0/v1794388411/ashik-portfolio/app-developer/app-brick.webp" src="https://res.cloudinary.com/h8vtnbby/video/upload/v1794388411/ashik-portfolio/app-developer/app-brick.mp4"></video>
            <div class="sbar"><span>9:41</span><span><svg aria-hidden="true" focusable="false" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg aria-hidden="true" focusable="false" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.3-1.4A10.6 10.6 0 0 0 8 .3 10.6 10.6 0 0 0 .7 3.2L2 4.6a8.7 8.7 0 0 1 6-2.4Zm0 3.8c1.3 0 2.5.5 3.4 1.3l1.3-1.4A6.8 6.8 0 0 0 8 4.1a6.8 6.8 0 0 0-4.7 1.8l1.3 1.4C5.5 6.5 6.7 6 8 6Zm0 3.7c-.6 0-1.1.2-1.5.6L8 12l1.5-1.7c-.4-.4-.9-.6-1.5-.6Z"/></svg><svg aria-hidden="true" focusable="false" viewBox="0 0 27 12" fill="none"><rect x=".5" y=".5" width="22" height="11" rx="3.2" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="19" height="8" rx="2" fill="currentColor"/><path d="M24.5 4v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity=".45"/></svg></span></div><div class="island"></div>
          </div>
        </div></div>
      </div>
    </div>
    <div class="card__dim"></div>
  </article>
  <article class="card flip" style="--i:3" aria-labelledby="p3">
    <div class="card__in">
      <div class="card__info">
        <div class="app"><img src="https://res.cloudinary.com/h8vtnbby/image/upload/v1794388418/ashik-portfolio/app-developer/icon-dice.webp" alt="" width="58" height="58" decoding="async" loading="lazy"><p class="card__meta"><span>iOS app · Utility</span></p></div>
        <h2 id="p3">Dice</h2>
        <p class="sub">A colourful dice roller</p>
        <p class="desc">Roll several dice at once: each die fills its own block of colour and the total updates instantly, so a board-game night needs nothing but a phone.</p>
        <ul class="tags"><li>Utility</li><li>Minimal UI</li><li>Tap to roll</li></ul>
        <span class="note">Screen recording on iPhone</span>
      </div>
      <div class="stage" aria-hidden="true">
        <div class="phone"><div class="phone__body">
          <i class="phone__btn l" style="top:19%;height:4%"></i><i class="phone__btn l" style="top:26%;height:7.5%"></i><i class="phone__btn l" style="top:35%;height:7.5%"></i><i class="phone__btn r" style="top:28%;height:11%"></i>
          <div class="phone__screen" style="background-image:url(data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAACQBACdASoWADAAPqlGnkmmJCMhMAqowBUJYgCDMfkgGEg4+mAlEH6d3GNpc0AA/rhzRmSQDP+chJNr/d1jZAbXbk4ynfkvNYiJnwJ5T43ypu3InS8X7SMq5QkGluq3yOIvkG7PRYsaKUYAAAA=)">
            <video muted loop playsinline preload="metadata" poster="https://res.cloudinary.com/h8vtnbby/video/upload/so_0/v1794388415/ashik-portfolio/app-developer/app-dice.webp" src="https://res.cloudinary.com/h8vtnbby/video/upload/v1794388415/ashik-portfolio/app-developer/app-dice.mp4"></video>
            <div class="sbar"><span>9:41</span><span><svg aria-hidden="true" focusable="false" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg aria-hidden="true" focusable="false" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.3-1.4A10.6 10.6 0 0 0 8 .3 10.6 10.6 0 0 0 .7 3.2L2 4.6a8.7 8.7 0 0 1 6-2.4Zm0 3.8c1.3 0 2.5.5 3.4 1.3l1.3-1.4A6.8 6.8 0 0 0 8 4.1a6.8 6.8 0 0 0-4.7 1.8l1.3 1.4C5.5 6.5 6.7 6 8 6Zm0 3.7c-.6 0-1.1.2-1.5.6L8 12l1.5-1.7c-.4-.4-.9-.6-1.5-.6Z"/></svg><svg aria-hidden="true" focusable="false" viewBox="0 0 27 12" fill="none"><rect x=".5" y=".5" width="22" height="11" rx="3.2" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="19" height="8" rx="2" fill="currentColor"/><path d="M24.5 4v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity=".45"/></svg></span></div><div class="island"></div>
          </div>
        </div></div>
      </div>
    </div>
    <div class="card__dim"></div>
  </article><!--/pre--></section>
</main>
<div class="sfw">
<footer class="sf" id="contact-footer" aria-labelledby="sfTitle">
  <div class="sf__in">
    <p class="sf__eye"><i></i>Available for new work</p>
    <h2 class="sf__h" id="sfTitle">Need something built?<span>Let's make it happen.</span></h2>
    <p class="sf__p">I'm available for freelance work: websites, apps, interfaces and visual content. Tell me what you need and I'll get back to you within a day.</p>
    <div class="sf__cta">
      <button class="sf__btn" data-nav="contact">Hire me <b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></b></button>
      
    </div>
    <div class="sf__cols">
      <div><h3>Work</h3><ul class="work"><li><a href="../web-developer/" data-nav="door:0">Web Development</a></li><li><a href="../app-developer/" data-nav="door:1">App Development</a></li><li><a href="../ui-ux-designer/" data-nav="door:2">UI/UX Design</a></li><li><a href="../devops-engineer/" data-nav="door:3">DevOps Engineering</a></li><li><a href="../powerlifter/" data-nav="door:4">Powerlifting</a></li></ul></div>
      <div><h3>Navigate</h3><ul><li><a href="../" data-nav="home">Home</a></li><li><a href="../#about" data-nav="about">My story</a></li><li><button data-nav="contact">Contact</button></li></ul></div>
      <div><h3>Status</h3><ul><li class="st">Available for work</li><li class="st">Remote-first, worldwide</li><li class="st">Local time <span data-ftime>—</span></li></ul></div>
    </div>
    <div class="sf__bot"><span>© <span data-fyear>2026</span> Ashik. Designed and built by Ashik.</span><span class="sf__legal"><a href="../legal/" target="_top">Privacy &amp; credits</a></span><button data-nav="top">Back to top ↑</button></div>
  </div>
</footer>
</div>
<button class="totop" data-nav="top" aria-label="Back to top"><svg class="ring" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/></svg><svg class="ar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg><span class="lbl">Back to top</span></button>















<style>
.ck{position:fixed;left:50%;bottom:max(1rem,env(safe-area-inset-bottom));z-index:90;transform:translateX(-50%);width:min(34rem,calc(100% - 2rem));
  display:flex;align-items:center;gap:1rem;padding:.9rem .9rem .9rem 1.2rem;border-radius:1.25rem;background:#1A1818;color:#E8E4E0;
  box-shadow:0 18px 40px -16px rgba(0,0,0,.55),0 0 0 1px rgba(232,228,224,.12);font:400 .875rem/1.45 'Onest',ui-sans-serif,system-ui,sans-serif}
.ck[hidden]{display:none}
.ck p{margin:0;flex:1}.ck a{color:inherit}
.ck div{display:flex;gap:.5rem;flex:none}
.ck button{height:2.5rem;padding:0 1rem;border-radius:999px;border:1px solid rgba(232,228,224,.25);background:none;color:inherit;font:inherit;font-size:.8125rem;font-weight:600;line-height:1;cursor:pointer}
.ck button[data-ck="yes"]{background:#E8E4E0;color:#1A1818;border-color:transparent}
@media (max-width:539.98px){.ck{flex-direction:column;align-items:stretch}.ck div button{flex:1}}
</style>
<div class="ck" id="ck" role="region" aria-label="Analytics choice" hidden><p>May I count your visit with Google Analytics? It sets cookies. <a href="/legal/">Details</a></p><div><button type="button" data-ck="no">No thanks</button><button type="button" data-ck="yes">Allow</button></div></div>`
      }}
    />
  );
}
