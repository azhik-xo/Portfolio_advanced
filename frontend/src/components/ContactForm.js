'use client';

import { useState } from 'react';
import { getApiUrl } from '../lib/api';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Web Development',
    budget: '$3k – $10k',
    timeline: 'Within 1 month',
    message: '',
  });

  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const res = await fetch(getApiUrl('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({ loading: false, success: true, error: null });
        setFormData({
          name: '',
          email: '',
          service: 'Web Development',
          budget: '$3k – $10k',
          timeline: 'Within 1 month',
          message: '',
        });
      } else {
        setStatus({
          loading: false,
          success: false,
          error: data.error || 'Failed to send inquiry. Please try again.',
        });
      }
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: 'Network error. Make sure the backend server is running on port 5000.',
      });
    }
  };

  return (
    <section id="contact" className="py-24 px-6 max-w-4xl mx-auto">
      <div className="p-8 sm:p-12 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-line)] shadow-2xl">
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-emerald-500 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Available for new contracts</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Need something built? Let&apos;s make it happen.
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted)] mt-2">
            Web applications, iOS apps, DevOps cloud architectures, and UI/UX design. Replies within 5 hours.
          </p>
        </div>

        {status.success && (
          <div className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm">
            ✔ <b>Inquiry received!</b> Thank you for reaching out. Ashik will reply directly to your email shortly.
          </div>
        )}

        {status.error && (
          <div className="mb-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm">
            ⚠ {status.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2 text-[var(--foreground)]/80">
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2 text-[var(--foreground)]/80">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@company.com"
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2 text-[var(--foreground)]/80">
                Service Domain
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
              >
                <option value="Web Development">Web Development</option>
                <option value="App Development">App Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="DevOps Engineering">DevOps Engineering</option>
                <option value="Powerlifting Coaching">Powerlifting / Strength</option>
                <option value="Other">Consulting / Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2 text-[var(--foreground)]/80">
                Target Budget
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
              >
                <option value="Under $3k">Under $3,000</option>
                <option value="$3k – $10k">$3,000 – $10,000</option>
                <option value="$10k – $25k">$10,000 – $25,000</option>
                <option value="$25k+">$25,000+</option>
                <option value="Flexible">Flexible / Hourly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2 text-[var(--foreground)]/80">
                Timeline
              </label>
              <select
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
              >
                <option value="Immediately">Immediately</option>
                <option value="Within 1 month">Within 1 month</option>
                <option value="Within 3 months">Within 3 months</option>
                <option value="Exploratory">Just exploring</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider mb-2 text-[var(--foreground)]/80">
              Project Details &amp; Goals *
            </label>
            <textarea
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your application, cloud architecture requirements, or timeline goals..."
              className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all resize-y"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={status.loading}
              className="px-8 py-3.5 rounded-full bg-[var(--foreground)] text-[var(--background)] font-bold text-sm tracking-wide hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg"
            >
              {status.loading ? 'Sending to MongoDB...' : 'Send Message →'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

