import './globals.css';

export const metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Ashik — Web Developer, App Developer, UI/UX Designer, DevOps Engineer, Powerlifter',
  description:
    'Portfolio of Ashik — Web Developer, App Developer, UI/UX Designer, DevOps Engineer, and Powerlifter. Building resilient web applications, iOS apps, cloud infrastructure, and modern interfaces.',
  authors: [{ name: 'Ashik' }],
  openGraph: {
    title: 'Ashik — Web Developer, App Developer, UI/UX Designer, DevOps Engineer, Powerlifter',
    description:
      'Portfolio of Ashik — Web Developer, App Developer, UI/UX Designer, DevOps Engineer, and Powerlifter.',
    url: 'https://therishithakor.com/',
    siteName: 'Ashik',
    images: [
      {
        url: 'https://res.cloudinary.com/h8vtnbby/image/upload/v1794388393/ashik-portfolio/hero/og.jpg',
        width: 1200,
        height: 630,
        alt: "Ashik's portfolio",
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: 'https://res.cloudinary.com/h8vtnbby/image/upload/v1794388395/ashik-portfolio/hero/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/onest-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/onest-latin-ext.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <meta name="theme-color" content="#1A1818" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('ashik-mode') === 'dark') {
                  document.documentElement.dataset.mode = 'dark';
                }
              } catch (e) {}
              /* modest devices get the same site with the heaviest per-frame effects stepped down */
              try {
                const c = navigator.hardwareConcurrency || 4, m = navigator.deviceMemory || 4;
                const tier = (c <= 4 || m <= 4) ? 'perf-modest' : 'perf-high';
                document.documentElement.classList.add(tier);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
