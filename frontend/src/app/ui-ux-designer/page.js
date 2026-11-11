'use client';

import { useEffect } from 'react';
import './roomStyles.css';

export default function RoomPage() {
  useEffect(() => {
    try {
      const existing = document.getElementById('script-room-ui-ux');
      if (existing) {
        window.__restartAll?.();
        return;
      }
      const script = document.createElement('script');
      script.id = 'script-room-ui-ux';
      script.src = '/ui-ux-designer/roomScript.js';
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
    <nav aria-label="Primary"><ul><li><button data-nav="home">Home</button></li><li><button data-nav="door:0">Web Development</button></li><li><button data-nav="door:1">App Development</button></li><li><button data-nav="door:2" aria-current=page>UI/UX Design</button></li><li><button data-nav="door:3">DevOps</button><button data-nav="door:4">Powerlifter</button></li><li><button data-nav="about">My story</button></li><li><button data-nav="contact">Contact</button></li></ul></nav>
    <div class="rn__clock" aria-label="Local time"><span>Local time</span><b data-ftime>—</b><span class="d">•</span><span class="d" data-fdate></span></div>
    <button class="rn__menu" id="rnMenu" aria-expanded="false" aria-controls="rnPanel"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg><span>Menu</span></button>
  </div>
  <div class="rn__panel" id="rnPanel" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="rn__phead">
      <span class="rn__plbl">Menu</span>
      <button class="rn__pclose" id="rnClose" aria-label="Close menu"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    </div>
    <div class="rn__plist"><button data-nav="home">Home</button><button data-nav="door:0">Web Development</button><button data-nav="door:1">App Development</button><button data-nav="door:2" aria-current=page>UI/UX Design</button><button data-nav="door:3">DevOps</button><button data-nav="door:4">Powerlifter</button><button data-nav="about">My story</button><button data-nav="contact">Contact</button></div>
    <p class="rn__pfoot">Ashik — available for new work<br>Replies within 5 hours</p>
  </div>
</header>

<main class="wrap">
  <div class="top"><a class="chip" href="../#works">← Back to the doors</a></div>
  <section class="intro">
    <h1>UI/UX Design</h1>
    <div><p>Interfaces researched, structured and prototyped: from user flows and wireframes to polished, interactive designs ready to build.</p></div>
  </section>
  <section class="stack" id="stack" aria-label="Projects"><!--pre-->
  <article class="card" style="--i:0" aria-labelledby="p0">
    <div class="card__in">
      <div class="card__info">
        <p class="card__meta"><span>Product design</span></p>
        <h2 id="p0">Cliq</h2>
        <p class="sub">Affiliate management · self-hosted SaaS</p>
        <p class="desc">A full affiliate platform a company runs on its own servers. Admins see revenue, commission, signups and purchases, top-promoter leaderboards and a daily chart; promoters get their own dashboard to create and track referral links. Fully white-label, so each company runs it under its own brand.</p>
        <ul class="tags"><li>SaaS dashboard</li><li>Data visualisation</li><li>White-label</li></ul>
        <span class="note">Admin and promoter screens, shown under three client brands</span>
      </div>
      <div class="stage" aria-hidden="true">
        <div class="mon"><div class="mon__body"><div class="mon__screen vid" style="--ar:1280 / 800">
          <video muted loop playsinline preload="metadata" poster="https://res.cloudinary.com/h8vtnbby/video/upload/so_0/v1794388424/ashik-portfolio/ui-ux-designer/ux-cliq.webp" src="https://res.cloudinary.com/h8vtnbby/video/upload/v1794388424/ashik-portfolio/ui-ux-designer/ux-cliq.mp4" style="background:#fff;object-fit:cover"></video>
        </div></div><div class="mon__neck"></div><div class="mon__foot"></div></div>
      </div>
    </div>
    <div class="card__dim"></div>
  </article>
  <article class="card flip" style="--i:1" aria-labelledby="p1">
    <div class="card__in">
      <div class="card__info">
        <p class="card__meta"><span>Figma prototype</span></p>
        <h2 id="p1">Prime Hostel</h2>
        <p class="sub">Hotel booking · web app design</p>
        <p class="desc">A booking flow from search to reservation: location and date pickers, hotel listings with filters, a property page with gallery, facilities, reviews and a price breakdown, plus login and sign-up.</p>
        <ul class="tags"><li>User flow</li><li>Interactive prototype</li><li>Booking UX</li></ul>
        <span class="note">Prototype walkthrough recorded in Figma</span>
      </div>
      <div class="stage" aria-hidden="true">
        <div class="mon"><div class="mon__body"><div class="mon__screen vid" style="--ar:1280 / 800">
          <video muted loop playsinline preload="metadata" poster="https://res.cloudinary.com/h8vtnbby/video/upload/so_0/v1794388419/ashik-portfolio/ui-ux-designer/ux-1.webp" src="https://res.cloudinary.com/h8vtnbby/video/upload/v1794388419/ashik-portfolio/ui-ux-designer/ux-1.mp4" style="background:#000;object-fit:cover"></video>
        </div></div><div class="mon__neck"></div><div class="mon__foot"></div></div>
      </div>
    </div>
    <div class="card__dim"></div>
  </article>
  <article class="card" style="--i:2" aria-labelledby="p2">
    <div class="card__in">
      <div class="card__info">
        <p class="card__meta"><span>Figma prototype</span></p>
        <h2 id="p2">WeBuildTech</h2>
        <p class="sub">AI agency · website design</p>
        <p class="desc">A bold, dark landing page for an AI product studio: a 3D mascot hero, service cards, cloud partners, a technology wall, case studies and a project enquiry call to action.</p>
        <ul class="tags"><li>Landing page</li><li>Visual design</li><li>Brand look</li></ul>
        <span class="note">Prototype walkthrough recorded in Figma</span>
      </div>
      <div class="stage" aria-hidden="true">
        <div class="mon"><div class="mon__body"><div class="mon__screen vid" style="--ar:1280 / 800">
          <video muted loop playsinline preload="metadata" poster="https://res.cloudinary.com/h8vtnbby/video/upload/so_0/v1794388420/ashik-portfolio/ui-ux-designer/ux-2.webp" src="https://res.cloudinary.com/h8vtnbby/video/upload/v1794388420/ashik-portfolio/ui-ux-designer/ux-2.mp4" style="background:#12082a;object-fit:cover"></video>
        </div></div><div class="mon__neck"></div><div class="mon__foot"></div></div>
      </div>
    </div>
    <div class="card__dim"></div>
  </article>
  <article class="card flip" style="--i:3" aria-labelledby="p3">
    <div class="card__in">
      <div class="card__info">
        <p class="card__meta"><span>Figma prototype</span></p>
        <h2 id="p3">Jordan One Take 4</h2>
        <p class="sub">Product page · e-commerce concept</p>
        <p class="desc">A product page concept where each colourway flies in with smart-animate transitions, with oversized type, colour swatches, size select and add to cart.</p>
        <ul class="tags"><li>E-commerce</li><li>Smart animate</li><li>Product showcase</li></ul>
        <span class="note">Prototype walkthrough recorded in Figma</span>
      </div>
      <div class="stage" aria-hidden="true">
        <div class="mon"><div class="mon__body"><div class="mon__screen vid" style="--ar:1280 / 800">
          <video muted loop playsinline preload="metadata" poster="https://res.cloudinary.com/h8vtnbby/video/upload/so_0/v1794388422/ashik-portfolio/ui-ux-designer/ux-3.webp" src="https://res.cloudinary.com/h8vtnbby/video/upload/v1794388422/ashik-portfolio/ui-ux-designer/ux-3.mp4" style="background:#fff;object-fit:cover"></video>
        </div></div><div class="mon__neck"></div><div class="mon__foot"></div></div>
      </div>
    </div>
    <div class="card__dim"></div>
  </article>
  <article class="card" style="--i:4" aria-labelledby="p4">
    <div class="card__in">
      <div class="card__info">
        <p class="card__meta"><span>Quicko · Live</span></p>
        <h2 id="p4">P&amp;L Page for Zerodha</h2>
        <p class="sub">Designed and shipped · pnl.page</p>
        <p class="desc">Designed end to end: the dark trading-terminal look, a clear hero with the product shown in context, and the sections that explain P&amp;L, tax reports and accrual summaries.</p>
        <ul class="tags"><li>UI design</li><li>Design to build</li><li>Live product</li></ul>
        <a class="live" href="https://pnl.page/brokers/zerodha" target="_blank" rel="noopener noreferrer">Visit live site <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg></a>
      </div>
      <div class="stage" aria-hidden="true">
        <div class="mon"><div class="mon__body"><div class="mon__screen">
          <img class="page" src="https://res.cloudinary.com/h8vtnbby/image/upload/v1794388425/ashik-portfolio/ui-ux-designer/ux-pnl.webp" alt="P&amp;L Page for Zerodha: full-page screenshot" decoding="async" loading="lazy">
        </div></div><div class="mon__neck"></div><div class="mon__foot"></div></div>
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
