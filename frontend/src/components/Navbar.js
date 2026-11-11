'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [time, setTime] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Check initial mode
    const mode = document.documentElement.dataset.mode;
    setIsDark(mode === 'dark');

    // Clock
    const updateTime = () => {
      const d = new Date();
      let h = d.getHours();
      const m = String(d.getMinutes()).padStart(2, '0');
      const ampm = h >= 12 ? 'pm' : 'am';
      h = h % 12 || 12;
      setTime(`${h}:${m}${ampm}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const toggleMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.dataset.mode = 'dark';
      localStorage.setItem('ashik-mode', 'dark');
    } else {
      document.documentElement.removeAttribute('data-mode');
      localStorage.setItem('ashik-mode', 'light');
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Web Dev', href: '/web-developer' },
    { label: 'App Dev', href: '/app-developer' },
    { label: 'UI/UX', href: '/ui-ux-designer' },
    { label: 'DevOps', href: '/devops-engineer' },
    { label: 'Powerlifter', href: '/powerlifter' },
    { label: 'My story', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300 backdrop-blur-md bg-[var(--background)]/80 border-b border-[var(--line)]/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-full bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center font-bold text-sm tracking-tight transition-transform group-hover:scale-105">
              A
            </span>
            <span className="font-semibold text-lg tracking-tight">Ashik</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-[var(--surface)]/60 px-3 py-1.5 rounded-full border border-[var(--line)]/40 text-xs font-medium">
            {navLinks.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="px-3 py-1 rounded-full text-[var(--foreground)]/80 hover:text-[var(--foreground)] hover:bg-[var(--background)]/80 transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Clock Pill */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full bg-[var(--surface)]/70 border border-[var(--line)]/40 text-[var(--foreground)]/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{time || '9:41am'}</span>
            </div>

            {/* Mode Switch (Cord button) */}
            <button
              onClick={toggleMode}
              aria-label="Toggle light and dark mode"
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors flex items-center gap-1.5"
            >
              <span className="text-sm">{isDark ? '☀️' : '🌙'}</span>
              <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg border border-[var(--line)] bg-[var(--surface)]"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--background)]/95 backdrop-blur-xl lg:hidden flex flex-col pt-24 px-8">
          <div className="flex flex-col gap-4 text-xl font-medium">
            {navLinks.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="py-2 border-b border-[var(--line)]/40 hover:text-[var(--accent)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto pb-12 pt-6 text-xs text-[var(--muted)] flex justify-between items-center">
            <span>© 2026 Ashik</span>
            <span>Remote-first Worldwide</span>
          </div>
        </div>
      )}
    </>
  );
}

