'use client';

import { useState, useEffect } from 'react';

const SKILLS = [
  'Web Developer',
  'App Developer',
  'UI/UX Designer',
  'DevOps Engineer',
  'Powerlifter',
];

export default function FlipCalendar() {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % SKILLS.length);
        setAnimating(false);
      }, 500);
    }, 2800);

    return () => clearInterval(timer);
  }, []);

  const currentSkill = SKILLS[index];
  const nextSkill = SKILLS[(index + 1) % SKILLS.length];

  return (
    <div className="inline-block relative">
      <div className="relative inline-flex items-center min-w-[280px] sm:min-w-[340px] h-[58px] sm:h-[68px] px-5 sm:px-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-lg select-none overflow-hidden cal-shadow">
        {/* Top spiral rings */}
        <div className="absolute -top-1.5 left-0 right-0 flex justify-around px-4 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="w-2.5 h-3.5 rounded-full bg-neutral-400 dark:bg-neutral-600 border border-neutral-700/30 dark:border-neutral-300/30 shadow-inner"
            />
          ))}
        </div>

        {/* Flipping page content */}
        <div className="w-full flex items-center justify-between mt-1">
          <div
            className={`font-bold text-xl sm:text-2xl tracking-tight transition-all duration-500 transform ${
              animating
                ? '-translate-y-4 opacity-0 scale-95'
                : 'translate-y-0 opacity-100 scale-100'
            }`}
          >
            {currentSkill}
          </div>

          <div className="font-mono text-xs font-semibold tracking-widest text-[var(--accent)] pl-4">
            {String(index + 1).padStart(2, '0')} / {String(SKILLS.length).padStart(2, '0')}
          </div>
        </div>

        {/* Bottom subtle page depth lines */}
        <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-black/10 dark:bg-white/10 rounded-full" />
      </div>
    </div>
  );
}

