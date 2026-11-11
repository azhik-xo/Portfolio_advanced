'use client';

import { useRef, useEffect } from 'react';

export default function LiquidReveal() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    const colorImg = new Image();
    colorImg.src = 'https://res.cloudinary.com/h8vtnbby/image/upload/v1794388391/ashik-portfolio/hero/ashik-portrait.webp';

    let width = 0;
    let height = 0;
    let animId = null;
    const ripples = [];

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        ripples.push({ x, y, radius: 10, maxRadius: 110, opacity: 1 });
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', (e) => {
      if (e.touches[0]) handlePointerMove(e.touches[0]);
    });

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      if (ripples.length > 0 && colorImg.complete && colorImg.naturalWidth) {
        ctx.save();
        ctx.beginPath();
        for (let i = 0; i < ripples.length; i++) {
          const r = ripples[i];
          ctx.moveTo(r.x + r.radius, r.y);
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          r.radius += 2.8;
          r.opacity -= 0.024;
        }
        ctx.clip();

        // Draw color image clipped to ripples
        ctx.drawImage(colorImg, 0, 0, width, height);
        ctx.restore();

        // Remove dead ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
          if (ripples[i].opacity <= 0 || ripples[i].radius >= ripples[i].maxRadius) {
            ripples.splice(i, 1);
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[440px] aspect-[881/1024] mx-auto select-none cursor-pointer group"
    >
      {/* Base Monochrome Portrait */}
      <img
        src="https://res.cloudinary.com/h8vtnbby/image/upload/v1794388392/ashik-portfolio/hero/ashik-portrait-bw.webp"
        alt="Ashik — Portrait"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]"
        loading="eager"
      />

      {/* Interactive Liquid Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Subtle Hint Pill */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none text-[11px] font-mono tracking-wider text-[var(--accent)] bg-[var(--surface)]/90 px-3 py-1 rounded-full border border-[var(--line)] shadow-sm whitespace-nowrap">
        Hover to reveal color
      </div>
    </div>
  );
}
