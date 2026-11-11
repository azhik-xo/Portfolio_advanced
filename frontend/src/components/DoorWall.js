'use client';

import { useState } from 'react';
import Link from 'next/link';

const DOORS = [
  {
    id: 0,
    title: 'Web Developer',
    headline: 'End to end, from sketch to live site',
    slug: 'web-developer',
    doorColor: 'from-[#22304a] to-[#1c2840]',
    accent: '#58A6FF',
    points: [
      'Discovery, architecture & planning',
      'Reactive, responsive front-ends',
      'Scalable backend & API integrations',
      'Technical SEO & performance',
      'Ongoing analytics & monitoring',
    ],
  },
  {
    id: 1,
    title: 'App Developer',
    headline: 'From the first idea to the App Store',
    slug: 'app-developer',
    doorColor: 'from-[#4a3540] to-[#3f2d37]',
    accent: '#D2A8FF',
    points: [
      'Native iOS & cross-platform apps',
      'Fluid animations & responsive UX',
      'Offline-first databases & caching',
      'App Store deployment & compliance',
      'Telemetry & crash diagnostics',
    ],
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    headline: 'Research first, pixels second',
    slug: 'ui-ux-designer',
    doorColor: 'from-[#7a8670] to-[#66705d]',
    accent: '#7EE787',
    points: [
      'Brand & business needs analysis',
      'User & competitor research',
      'Information architecture & flows',
      'Wireframes & high-fidelity UI',
      'Interactive Figma prototypes',
    ],
  },
  {
    id: 3,
    title: 'DevOps Engineer',
    headline: 'Automating infrastructure & scalable systems',
    slug: 'devops-engineer',
    doorColor: 'from-[#a4552c] to-[#8c4826]',
    accent: '#FFA657',
    points: [
      'CI/CD pipelines & GitOps (GitHub Actions, ArgoCD)',
      'Kubernetes orchestration & Helm',
      'Infrastructure as Code (Terraform)',
      'Full-stack Prometheus & Grafana SRE monitoring',
      'Zero-downtime canary deployment strategies',
    ],
  },
  {
    id: 4,
    title: 'Powerlifter',
    headline: 'Discipline, strength & progressive overload',
    slug: 'powerlifter',
    doorColor: 'from-[#262523] to-[#181616]',
    accent: '#FF7B72',
    points: [
      'The Big Three: Squat, Bench Press, Deadlift',
      'Scientific periodization & progressive overload',
      'Intra-abdominal core bracing & technique mastery',
      'Autoregulation (RPE) & recovery metrics',
      'Iron mindset applied to high-stakes engineering',
    ],
  },
];

export default function DoorWall() {
  const [activeDoor, setActiveDoor] = useState(0);

  const active = DOORS[activeDoor];

  return (
    <section id="works" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-semibold">
          Interactive Portfolio Doors
        </span>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mt-2">
          Magic happens behind the doors.
        </h2>
        <p className="text-[var(--muted)] text-sm sm:text-base mt-3 max-w-xl mx-auto">
          Hover or click any door to inspect each room. Step through to explore projects, architectures, and metrics.
        </p>
      </div>

      {/* The 5 Doors Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {DOORS.map((door) => {
          const isSelected = activeDoor === door.id;
          return (
            <div
              key={door.id}
              onMouseEnter={() => setActiveDoor(door.id)}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Door Frame */}
              <div
                className={`relative w-full aspect-[9/18] rounded-t-full border-4 transition-all duration-300 p-2 shadow-xl ${
                  isSelected
                    ? 'border-[var(--foreground)] scale-105 shadow-2xl'
                    : 'border-[var(--line)] hover:border-[var(--foreground)]/60'
                } bg-[var(--surface)]`}
              >
                {/* Swinging Door Body */}
                <div
                  className={`w-full h-full rounded-t-full bg-gradient-to-b ${door.doorColor} transition-transform duration-500 origin-left flex flex-col items-center justify-between py-6 px-2 text-white shadow-inner ${
                    isSelected ? 'rotate-y-[-28deg]' : 'group-hover:rotate-y-[-12deg]'
                  }`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Fluting arch top */}
                  <div className="w-10 h-10 rounded-full border border-white/20 mt-2" />

                  {/* Brass Doorplate */}
                  <div className="px-2 py-1 rounded bg-amber-200/90 text-neutral-900 font-bold text-[10px] sm:text-xs text-center tracking-tight shadow-md max-w-[90%]">
                    {door.title}
                  </div>

                  {/* Door Handle */}
                  <div className="self-end mr-2 w-3 h-6 rounded bg-amber-400/90 shadow" />
                </div>
              </div>

              {/* Door Label */}
              <div className="mt-3 text-center">
                <span className="text-xs font-mono font-bold tracking-wider uppercase block text-[var(--foreground)]">
                  {door.title}
                </span>
                <Link
                  href={`/${door.slug}`}
                  className="text-[11px] text-[var(--accent)] hover:underline inline-flex items-center gap-1 mt-0.5"
                >
                  Enter Room →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Door Info Card */}
      <div className="mt-14 p-8 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-line)] shadow-xl max-w-3xl mx-auto transition-all duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--line)]/50 pb-4 mb-6">
          <div>
            <span
              className="text-xs font-mono font-bold tracking-widest uppercase"
              style={{ color: active.accent }}
            >
              Door #{active.id + 1}
            </span>
            <h3 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
              {active.title}
            </h3>
            <p className="text-sm text-[var(--muted)]">{active.headline}</p>
          </div>

          <Link
            href={`/${active.slug}`}
            className="px-5 py-2.5 rounded-full bg-[var(--foreground)] text-[var(--background)] font-semibold text-xs tracking-wide hover:opacity-90 transition-opacity whitespace-nowrap shadow"
          >
            Explore {active.title} Showcase →
          </Link>
        </div>

        <ul className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[var(--foreground)]/85">
          {active.points.map((pt, idx) => (
            <li key={idx} className="flex items-center gap-2.5">
              <span
                className="w-2 h-2 rounded-full flex-none"
                style={{ backgroundColor: active.accent }}
              />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

