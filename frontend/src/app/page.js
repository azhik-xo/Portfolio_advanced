import fs from 'fs';
import path from 'path';
import Script from 'next/script';
import StoryHydrator from '../components/StoryHydrator';
import ProfileHydrator from '../components/ProfileHydrator';

export default function Home() {
  const markupPath = path.join(process.cwd(), 'src/app/bodyMarkup.html');
  const bodyMarkup = fs.readFileSync(markupPath, 'utf8');

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: bodyMarkup }} />
      <ProfileHydrator />
      <StoryHydrator />
      <script
        type="importmap"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            imports: {
              lenis: '/vendor/lenis.min.mjs',
            },
          }),
        }}
      />
      <Script
        src="/portfolio-main.js"
        type="module"
        strategy="afterInteractive"
      />
    </>
  );
}
