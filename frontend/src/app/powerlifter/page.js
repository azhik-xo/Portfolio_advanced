import fs from 'fs';
import path from 'path';
import Script from 'next/script';
import './roomStyles.css';

export const metadata = {
  title: 'Powerlifting & Physique — Ashik',
  description: 'Powerlifting personal records, competition achievements, body posing, and heavy lift videos by Ashik.',
};

export default function PowerlifterPage() {
  const markupPath = path.join(process.cwd(), 'src/app/powerlifter/roomMarkup.html');
  const markup = fs.readFileSync(markupPath, 'utf8');

  return (
    <main style={{ minHeight: '100vh', background: '#030306', color: '#E8E4E0', overflow: 'hidden' }}>
      <div dangerouslySetInnerHTML={{ __html: markup }} />
      <Script src="/powerlifter/lifts.js" strategy="afterInteractive" />
      <Script src="/powerlifter/powerlifter-engine.js" strategy="afterInteractive" />
    </main>
  );
}
