import { readFile, mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

// Social crawlers need metadata in the HTTP response, before JavaScript runs.
// Derive this entry from Vite's output so it always loads the current bundles.
const title = 'Visual Audiobooks for Kids';
const description = 'Children’s audiobooks that redraw themselves with every listen.';
const url = 'https://ghostmode.studio/project/visual-audiobooks';
const image = 'https://storage.googleapis.com/jeanine-portfolio-video/Visual-Audiobooks-Duo-Share.png';
const alt = 'The story cover beside an opening iPhone Duo, with the girl and the stars passage inside.';
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
let html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');

function replaceOne(pattern, replacement) {
  assert.equal([...html.matchAll(new RegExp(pattern.source, 'g'))].length, 1, `Expected one ${pattern}`);
  html = html.replace(pattern, () => replacement);
}
function meta(attribute, key, value) {
  replaceOne(new RegExp(`<meta ${attribute}="${key}"[^>]*>`), `<meta ${attribute}="${key}" content="${escape(value)}">`);
}
replaceOne(/<title>[^<]*<\/title>/, `<title>${title} | Ghost Mode</title>`);
replaceOne(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}">`);
meta('name', 'description', description);
for (const prefix of ['og', 'twitter']) {
  const attribute = prefix === 'og' ? 'property' : 'name';
  meta(attribute, `${prefix}:title`, title);
  meta(attribute, `${prefix}:description`, description);
  meta(attribute, `${prefix}:image`, image);
  meta(attribute, `${prefix}:image:alt`, alt);
}
meta('property', 'og:url', url);
meta('property', 'og:image:width', '2400');
meta('property', 'og:image:height', '1260');
replaceOne(/<!-- press:home-jsonld:start -->[\s\S]*?<!-- press:home-jsonld:end -->/, `<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'CreativeWork', name: title,
  description, url, image, creator: { '@type': 'Person', name: 'Jeanine Emilia Cornillot' },
})}</script>`);
replaceOne(/<div id="root"><\/div>/, `<div id="root"></div><noscript><main><h1>${title}</h1><p>${description}</p><p>Creator &amp; Creative Director: Jeanine Emilia Cornillot.</p><p><a href="https://visiting-day.vercel.app/visual-audiobook-player/">Try the prototype</a></p><p><a href="/#/labs">Back to work</a></p></main></noscript>`);
assert(!html.includes('Ghost-Mode-Portfolio-Coral.png'), 'Project entry must not inherit the portfolio card');
assert(html.includes('/assets/'), 'Project entry must load the built application');
const directory = new URL('../dist/project/visual-audiobooks/', import.meta.url);
await mkdir(directory, { recursive: true });
await writeFile(new URL('index.html', directory), html);
console.log('Built Visual Audiobooks share entry with project-specific metadata.');
