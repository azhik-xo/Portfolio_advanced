'use client';

const CHAPTERS = [
  {
    date: 'Oct 2026 — Now',
    title: 'Independent Freelancer & Systems Architect',
    org: 'Working for myself, remote-first',
    bullets: [
      'Web applications, iOS mobile apps, and enterprise DevOps automation built end-to-end.',
      'Engineering high-reliability cloud solutions and delivering resilient software worldwide.',
    ],
  },
  {
    date: 'Jul 2026 — Sep 2026',
    title: 'DevOps Engineer',
    org: 'Cloud & Infrastructure Services',
    bullets: [
      'Architected automated CI/CD pipelines, containerizing services with Docker and Kubernetes for zero-downtime releases.',
      'Configured cloud environments, monitoring stacks (Prometheus, Grafana) and infrastructure as code with Terraform.',
    ],
  },
  {
    date: 'Jan 2026 — Jun 2026',
    title: 'UI/UX Designer & Web Developer',
    org: 'Product Design & Interfaces',
    bullets: [
      'Designed responsive web applications and design systems in Figma with focus on clarity and speed.',
      'Turned prototypes into high-performance web applications using modern React and Next.js.',
    ],
  },
  {
    date: 'Jan 2025 — Dec 2025',
    title: 'Competitive Powerlifter',
    org: 'Athletic Strength & Performance',
    bullets: [
      'Disciplined training across the Big Three: Squat, Bench Press, and Deadlift with progressive overload.',
      'Applying athletic grit, precision and structured periodization directly to software engineering challenges.',
    ],
  },
  {
    date: 'Jul 2022 — May 2026',
    title: 'B.Tech, Computer Science',
    org: 'Engineering & Computing Foundations',
    bullets: [
      'Four years of computer science: algorithms, operating systems, networking, and distributed systems.',
      'Graduated with hands-on enterprise projects and live production systems already deployed.',
    ],
  },
];

export default function StoryTimeline() {
  return (
    <section id="about" className="py-24 px-6 max-w-4xl mx-auto">
      <div className="mb-14">
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-semibold">
          My Story
        </span>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mt-2">
          Let&apos;s go back in time.
        </h2>
        <p className="text-[var(--muted)] text-sm sm:text-base mt-2">
          The path that forged engineering discipline, design craft, and physical strength.
        </p>
      </div>

      <div className="relative border-l-2 border-[var(--line)] ml-4 sm:ml-6 pl-6 sm:pl-10 space-y-12">
        {CHAPTERS.map((ch, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-[var(--background)] border-2 border-[var(--foreground)] group-hover:scale-125 transition-transform" />

            <span className="text-xs font-mono font-semibold tracking-wider uppercase text-[var(--accent)]">
              {ch.date}
            </span>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)] mt-1">
              {ch.title}
            </h3>

            <p className="text-sm font-medium text-[var(--muted)] mb-3">{ch.org}</p>

            <ul className="space-y-2 text-sm text-[var(--foreground)]/80">
              {ch.bullets.map((b, bIdx) => (
                <li key={bIdx} className="flex items-start gap-2">
                  <span className="text-[var(--accent)] font-bold">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

