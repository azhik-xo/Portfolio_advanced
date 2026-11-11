/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-mode="dark"]'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muted: 'var(--muted)',
        subtle: 'var(--subtle)',
        line: 'var(--line)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        accent: 'var(--accent)',
      },
      fontFamily: {
        sans: ['Onest', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: '2rem',
        'card-sm': '1.25rem',
        control: '0.875rem',
      },
    },
  },
  plugins: [],
};

