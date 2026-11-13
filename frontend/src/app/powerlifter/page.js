import fs from 'fs';
import path from 'path';
import Script from 'next/script';
import PowerlifterHydrator from '../../components/PowerlifterHydrator';
import './roomStyles.css';

export const metadata = {
  title: 'Powerlifting & Strength — Ashik',
  description: 'Powerlifting personal records, competition achievements, body posing, and heavy lift videos by Ashik.',
};

export default function PowerlifterPage() {
  const markupPath = path.join(process.cwd(), 'src/app/powerlifter/roomMarkup.html');
  const markup = fs.readFileSync(markupPath, 'utf8');

  const liftsPath = path.join(process.cwd(), 'public/powerlifter/lifts.js');
  const liftsScript = fs.readFileSync(liftsPath, 'utf8');

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: liftsScript }} />
      <div dangerouslySetInnerHTML={{ __html: markup }} />
      <PowerlifterHydrator />
      <Script id="powerlifter-engine" src="/powerlifter/powerlifter-engine.js" strategy="afterInteractive" />
    </>
  );
}
