'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)]/50 bg-[var(--surface)]/30 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Col 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center font-bold text-xs">
              A
            </span>
            <span className="font-bold text-base">Ashik</span>
          </div>
          <p className="text-xs text-[var(--muted)] leading-relaxed max-w-xs">
            Web Developer, App Developer, UI/UX Designer, DevOps Engineer &amp; Powerlifter.
          </p>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)] mb-3">
            Showcase Rooms
          </h4>
          <ul className="space-y-2 text-xs text-[var(--foreground)]/80">
            <li>
              <Link href="/web-developer" className="hover:underline">
                Web Development
              </Link>
            </li>
            <li>
              <Link href="/app-developer" className="hover:underline">
                App Development (iOS)
              </Link>
            </li>
            <li>
              <Link href="/ui-ux-designer" className="hover:underline">
                UI/UX Design
              </Link>
            </li>
            <li>
              <Link href="/devops-engineer" className="hover:underline">
                DevOps Engineering
              </Link>
            </li>
            <li>
              <Link href="/powerlifter" className="hover:underline">
                Powerlifting &amp; Strength
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)] mb-3">
            Navigation
          </h4>
          <ul className="space-y-2 text-xs text-[var(--foreground)]/80">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/#about" className="hover:underline">
                My Story
              </Link>
            </li>
            <li>
              <Link href="/#works" className="hover:underline">
                The Doors
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="hover:underline">
                Hire Me
              </Link>
            </li>
            <li>
              <Link href="/legal" className="hover:underline">
                Legal &amp; Licenses
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)] mb-3">
            Availability
          </h4>
          <ul className="space-y-2 text-xs text-[var(--foreground)]/80">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Available for hire</span>
            </li>
            <li>Remote-first (US, UK &amp; Worldwide)</li>
            <li>Replies within 5 hours</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-[var(--line)]/40 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--muted)] gap-4">
        <span>© 2026 Ashik. Designed and built by Ashik.</span>
        <div className="flex items-center gap-6">
          <Link href="/legal" className="hover:underline">
            Privacy &amp; Open Source
          </Link>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-[var(--foreground)] transition-colors"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}

