'use client';

import { useState, useRef } from 'react';

export default function HoloCard() {
  const [flipped, setFlipped] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -14;
    const rotY = ((x - centerX) / centerX) * 14;
    setRotate({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={cardRef}
        onClick={() => setFlipped(!flipped)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-[280px] sm:w-[320px] aspect-[5/7] cursor-pointer perspective-[1200px] select-none group"
      >
        <div
          className={`w-full h-full relative duration-300 transform-gpu preserve-3d rounded-2xl shadow-2xl transition-transform ${
            flipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${
              rotate.y + (flipped ? 180 : 0)
            }deg)`,
          }}
        >
          {/* Card Front */}
          <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden border border-[var(--line)] bg-[#181616] text-[#E8E4E0] p-6 flex flex-col justify-between shadow-xl">
            {/* Top header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-amber-300">
                  Specialist Card
                </span>
                <h3 className="text-xl font-bold tracking-tight">Ashik</h3>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-white/10">
                LVL 99
              </span>
            </div>

            {/* Stats Bars */}
            <div className="space-y-3.5 my-auto">
              {[
                { name: 'Web Dev', score: 95, color: 'bg-blue-400' },
                { name: 'DevOps / K8s', score: 90, color: 'bg-emerald-400' },
                { name: 'App Dev (iOS)', score: 85, color: 'bg-purple-400' },
                { name: 'UI/UX Design', score: 85, color: 'bg-amber-400' },
                { name: 'Powerlifting', score: 95, color: 'bg-rose-400' },
              ].map((stat, i) => (
                <div key={i} className="text-xs">
                  <div className="flex justify-between font-mono mb-1 text-white/80">
                    <span>{stat.name}</span>
                    <span>{stat.score}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stat.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${stat.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom info */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50">
              <span>Tap to flip</span>
              <span className="text-amber-400/80">★ Holographic Rare</span>
            </div>

            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-transparent pointer-events-none group-hover:via-white/20 transition-all duration-500" />
          </div>

          {/* Card Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden border border-[var(--line)] bg-[#121111] text-[#E8E4E0] p-6 flex flex-col items-center justify-center text-center shadow-xl">
            <div className="w-20 h-20 rounded-full border-2 border-amber-400/40 flex items-center justify-center mb-4 bg-amber-400/5">
              <span className="text-3xl font-extrabold tracking-tighter text-amber-300">A</span>
            </div>
            <h4 className="font-bold text-lg mb-1">Ashik</h4>
            <p className="text-xs text-neutral-400 max-w-[200px] mb-4">
              Full-Stack Developer, DevOps Engineer &amp; Competitive Athlete.
            </p>
            <div className="text-[10px] font-mono px-3 py-1 rounded-full border border-white/20 bg-white/5 text-amber-200">
              Verified Edition
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-[var(--muted)] mt-3 font-mono">
        {flipped ? 'Showing reverse side' : 'Hover to tilt · Click to flip'}
      </p>
    </div>
  );
}

