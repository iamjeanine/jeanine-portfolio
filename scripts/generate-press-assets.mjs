import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(await readFile(path.join(root, 'content/press-data.json'), 'utf8'));

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&rsquo;');

const titles = [
  ...data.selectedWork.map((item) => item.title),
  ...data.portfolioChapters.flatMap((chapter) => chapter.items.map((item) => item.title)),
  data.authorWork.title,
  'Loosing My Espanish',
  'The Mambo Kings Play Songs of Love'
].sort((a, b) => b.length - a.length);
const richText = (value) => {
  let result = escapeHtml(value);
  for (const title of titles) {
    result = result.replaceAll(escapeHtml(title), `<em>${escapeHtml(title)}</em>`);
  }
  return result;
};
const quoteText = (value) => escapeHtml(value).replaceAll('. . .', '<span class="ellipsis">. . .</span>');
const displayQuote = (item) => item.leadIn
  ? `${escapeHtml(item.leadIn)} “${quoteText(item.quote)}”`
  : `“${quoteText(item.quote)}”`;
const plainDisplayQuote = (item) => item.leadIn
  ? `${item.leadIn} “${item.quote}”`
  : `“${item.quote}”`;

const replaceBlock = (html, id, content) => {
  const start = `<!-- press:${id}:start -->`;
  const end = `<!-- press:${id}:end -->`;
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (!pattern.test(html)) throw new Error(`Missing press block: ${id}`);
  return html.replace(pattern, `${start}\n${content}\n${end}`);
};

const replaceWorkBlock = (html, id, content) => {
  const start = `<!-- work:${id}:start -->`;
  const end = `<!-- work:${id}:end -->`;
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (!pattern.test(html)) throw new Error(`Missing work block: ${id}`);
  return html.replace(pattern, `${start}\n${content}\n${end}`);
};

const mdWork = data.selectedWork.map((item) =>
  `- **${item.title}**: ${item.role}. ${item.proof}${item.url ? ` [Portfolio page](${item.url})` : ''}`
).join('\n');

const mdPraise = data.authorWork.praise.map((item) =>
  `> ${plainDisplayQuote(item)}\n>\n> **${item.attribution}**, ${item.credential}`
).join('\n\n');

const authorRecognition = `${data.authorWork.recognition.source}: ${data.authorWork.recognition.label}`;

const markdown = `# ${data.name}\n\n> ${data.positioning}\n\n` +
`Last updated: ${data.lastUpdated}\n\n` +
`Official portfolio: ${data.contact.portfolio}\n` +
`Canonical press kit: ${data.contact.pressKit}\n` +
`Downloadable PDF: ${data.contact.portfolio}Jeanine-Cornillot-Press-Kit.pdf\n` +
`Contact: ${data.contact.email}\n` +
`LinkedIn: ${data.contact.linkedin}\n\n` +
`## Short bio\n\n${data.shortBio}\n\n` +
`## Connecting thread\n\n${data.profileThroughline}\n\n` +
`## Selected work\n\n${mdWork}\n\n` +
`## Author: ${data.authorWork.title}\n\n${data.authorWork.description}\n\n**${authorRecognition}**\n\n${mdPraise}\n\n` +
`## Available to discuss\n\n${data.topics.map((item) => `- ${item}`).join('\n')}\n\n` +
`## Full bio\n\n${data.fullBio.join('\n\n')}\n\n` +
`## Awards and recognition\n\n${data.awards.map((item) => `- **${item.name}**: ${item.detail}`).join('\n')}\n\n` +
`## Current work\n\n${data.currentWork}\n\n` +
`## Attribution notes\n\n${data.attributionNotes.map((item) => `- ${item}`).join('\n')}\n`;

const llms = `# ${data.name}\n\n> ${data.positioning}\n\n` +
`Official portfolio: ${data.contact.portfolio}\n` +
`Canonical press kit: ${data.contact.pressKit}\n` +
`Full machine-readable profile: ${data.contact.portfolio}press.md\n` +
`Structured profile data: ${data.contact.portfolio}press.json\n` +
`Crawlable work index: ${data.contact.portfolio}work.html\n` +
`Machine-readable work index: ${data.contact.portfolio}work.md\n` +
`Structured work data: ${data.contact.portfolio}work.json\n` +
`Downloadable press kit: ${data.contact.portfolio}Jeanine-Cornillot-Press-Kit.pdf\n` +
`Contact: ${data.contact.email}\n` +
`LinkedIn: ${data.contact.linkedin}\n\n` +
`## Profile\n\n${data.shortBio}\n\n` +
`${data.profileThroughline}\n\n` +
`## Selected work\n\n${data.selectedWork.map((item) => `- ${item.title}: ${item.role}. ${item.proof}`).join('\n')}\n\n` +
`## Author\n\n${data.authorWork.title}: ${data.authorWork.description}\n\nRecognition: ${authorRecognition}.\n\n` +
`${data.authorWork.praise.map((item) => `- ${plainDisplayQuote(item)} ${item.attribution}, ${item.credential}.`).join('\n')}\n\n` +
`## Areas of expertise\n\n${data.expertise.map((item) => `- ${item}`).join('\n')}\n\n` +
`## Current work\n\n${data.currentWork}\n\n` +
`## Attribution notes\n\n${data.attributionNotes.map((item) => `- ${item}`).join('\n')}\n`;

const structured = {
  schemaVersion: '1.0',
  lastUpdated: data.lastUpdated,
  canonicalUrl: data.contact.pressKit,
  downloadablePdf: `${data.contact.portfolio}Jeanine-Cornillot-Press-Kit.pdf`,
  person: {
    name: data.name,
    alternateName: data.alternateName,
    jobTitle: data.jobTitle,
    positioning: data.positioning,
    profileThroughline: data.profileThroughline,
    shortBio: data.shortBio,
    fullBio: data.fullBio,
    quickFacts: data.quickFacts,
    selectedWork: data.selectedWork,
    authorWork: data.authorWork,
    awards: data.awards,
    topics: data.topics,
    expertise: data.expertise,
    currentWork: data.currentWork,
    attributionNotes: data.attributionNotes,
    contact: data.contact,
    organization: data.organization,
    alumniOf: data.alumniOf
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfilePage',
      '@id': `${data.contact.pressKit}#page`,
      url: data.contact.pressKit,
      name: `${data.name} | Press Kit`,
      description: `Biography, selected work, awards, interview topics, and contact information for ${data.name}.`,
      dateModified: data.lastUpdated,
      mainEntity: { '@id': `${data.contact.portfolio}#jeanine` },
      encoding: [
        { '@type': 'MediaObject', encodingFormat: 'text/markdown', contentUrl: `${data.contact.portfolio}press.md` },
        { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${data.contact.portfolio}press.json` },
        { '@type': 'MediaObject', encodingFormat: 'application/pdf', contentUrl: `${data.contact.portfolio}Jeanine-Cornillot-Press-Kit.pdf` }
      ]
    },
    {
      '@type': 'Person',
      '@id': `${data.contact.portfolio}#jeanine`,
      name: data.name,
      alternateName: data.alternateName,
      jobTitle: data.jobTitle,
      description: data.shortBio,
      url: data.contact.portfolio,
      email: data.contact.email,
      sameAs: data.publicProfiles,
      worksFor: { '@type': 'Organization', ...data.organization },
      alumniOf: { '@type': 'CollegeOrUniversity', name: data.alumniOf },
      award: data.awards.map((item) => `${item.name}, ${item.detail}`),
      knowsAbout: data.expertise
    },
    {
      '@type': 'Book',
      '@id': `${data.contact.pressKit}#family-sentence`,
      name: data.authorWork.title,
      url: data.bookUrl,
      bookFormat: data.authorWork.format,
      description: data.authorWork.description,
      award: authorRecognition,
      author: { '@id': `${data.contact.portfolio}#jeanine` },
      publisher: { '@type': 'Organization', name: data.authorWork.publisher },
      review: data.authorWork.praise.map((item) => ({
        '@type': 'Review',
        reviewBody: item.quote,
        author: { '@type': ['Booklist', 'Kirkus Reviews'].includes(item.attribution) ? 'Organization' : 'Person', name: item.attribution }
      }))
    }
  ]
};

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${data.contact.portfolio}#website`,
      url: data.contact.portfolio,
      name: data.name,
      description: data.positioning,
      about: { '@id': `${data.contact.portfolio}#jeanine` }
    },
    {
      '@type': 'Person',
      '@id': `${data.contact.portfolio}#jeanine`,
      name: data.name,
      alternateName: data.alternateName,
      jobTitle: data.jobTitle,
      description: data.shortBio,
      url: data.contact.portfolio,
      email: data.contact.email,
      sameAs: data.publicProfiles,
      worksFor: { '@type': 'Organization', ...data.organization },
      alumniOf: { '@type': 'CollegeOrUniversity', name: data.alumniOf },
      award: data.awards.map((item) => `${item.name}, ${item.detail}`),
      knowsAbout: data.expertise,
      subjectOf: [
        { '@type': 'ProfilePage', url: data.contact.pressKit },
        { '@type': 'CollectionPage', url: `${data.contact.portfolio}work.html` }
      ]
    }
  ]
};

const workMarkdown = `# ${data.name}: Work Index\n\n> ${data.profileThroughline}\n\n` +
`Last updated: ${data.lastUpdated}\n\n` +
`Visual portfolio: ${data.contact.portfolio}\n` +
`Press kit: ${data.contact.pressKit}\n` +
`Canonical work index: ${data.contact.portfolio}work.html\n` +
`Contact: ${data.contact.email}\n\n` +
data.portfolioChapters.map((chapter) =>
  `## ${chapter.title}\n\n${chapter.description}\n\n` +
  chapter.items.map((item) => {
    const details = [item.format, item.organization, item.years, item.role].filter(Boolean).join(' | ');
    const proof = item.proof ? ` ${item.proof}` : '';
    return `### ${item.title}\n\n${details}\n\n${item.summary}${proof}\n\nPermanent entry: ${data.contact.portfolio}work.html#${item.id}${item.portfolioUrl ? `\nVisual portfolio page: ${item.portfolioUrl}` : ''}`;
  }).join('\n\n')
).join('\n\n');

const workStructured = {
  schemaVersion: '1.0',
  lastUpdated: data.lastUpdated,
  canonicalUrl: `${data.contact.portfolio}work.html`,
  person: {
    name: data.name,
    alternateName: data.alternateName,
    jobTitle: data.jobTitle,
    profileThroughline: data.profileThroughline,
    publicProfiles: data.publicProfiles
  },
  chapters: data.portfolioChapters
};

const workJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${data.contact.portfolio}work.html#page`,
      url: `${data.contact.portfolio}work.html`,
      name: `${data.name} | Work Index`,
      description: data.profileThroughline,
      dateModified: data.lastUpdated,
      about: { '@id': `${data.contact.portfolio}#jeanine` },
      mainEntity: data.portfolioChapters.map((chapter) => ({ '@id': `${data.contact.portfolio}work.html#${chapter.id}-list` }))
    },
    {
      '@type': 'Person',
      '@id': `${data.contact.portfolio}#jeanine`,
      name: data.name,
      alternateName: data.alternateName,
      jobTitle: data.jobTitle,
      description: data.shortBio,
      url: data.contact.portfolio,
      sameAs: data.publicProfiles
    },
    ...data.portfolioChapters.map((chapter) => ({
      '@type': 'ItemList',
      '@id': `${data.contact.portfolio}work.html#${chapter.id}-list`,
      name: chapter.title,
      description: chapter.description,
      numberOfItems: chapter.items.length,
      itemListElement: chapter.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${data.contact.portfolio}work.html#${item.id}`,
        item: {
          '@type': 'CreativeWork',
          '@id': `${data.contact.portfolio}work.html#${item.id}-work`,
          name: item.title,
          description: item.summary,
          genre: item.format,
          creditText: item.role,
          creator: { '@id': `${data.contact.portfolio}#jeanine` },
          productionCompany: item.organization ? { '@type': 'Organization', name: item.organization } : undefined,
          dateCreated: item.years,
          url: item.portfolioUrl || `${data.contact.portfolio}work.html#${item.id}`
        }
      }))
    }))
  ]
};

let pressHtml = await readFile(path.join(root, 'public/press.html'), 'utf8');
pressHtml = replaceBlock(pressHtml, 'jsonld', `  <script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2).split('\n').map((line) => `  ${line}`).join('\n')}\n  </script>`);
pressHtml = replaceBlock(pressHtml, 'positioning', `          <p class="positioning">${escapeHtml(data.positioning)}</p>`);
pressHtml = replaceBlock(pressHtml, 'facts', data.quickFacts.map((fact) => `            <div class="fact">\n              <dt>${escapeHtml(fact.label)}</dt>\n              <dd>${richText(fact.value)}</dd>\n            </div>`).join('\n'));
pressHtml = replaceBlock(pressHtml, 'shortbio', `          <p class="bio" id="short-bio-copy">${richText(data.shortBio)}</p>\n          <p class="bio bio-throughline">${richText(data.profileThroughline)}</p>`);
pressHtml = replaceBlock(pressHtml, 'work', data.selectedWork.map((item) => {
  const title = item.url
    ? `<a href="${escapeHtml(item.url.replace(data.contact.portfolio.replace(/\/$/, ''), ''))}">${escapeHtml(item.title)}</a>`
    : escapeHtml(item.title);
  return `            <li class="work-item">\n              <p class="work-title">${title}</p>\n              <p class="work-role">${escapeHtml(item.role)}</p>\n              <p class="work-proof">${richText(item.proof)}</p>\n            </li>`;
}).join('\n'));
pressHtml = replaceBlock(pressHtml, 'author', `    <section class="section author-section" id="family-sentence" aria-labelledby="author-title">\n      <div class="section-grid author-grid">\n        <h2 class="section-title" id="author-title">Author</h2>\n        <div class="section-body author-body">\n          <div class="author-book">\n            <h3>${escapeHtml(data.authorWork.title)}</h3>\n            <p class="author-meta">${escapeHtml(data.authorWork.format)} · ${escapeHtml(data.authorWork.publisher)}</p>\n            <p class="author-recognition"><span>${escapeHtml(data.authorWork.recognition.source)}</span><strong>${escapeHtml(data.authorWork.recognition.label)}</strong></p>\n            <p class="author-description">${richText(data.authorWork.description)}</p>\n          </div>\n          <div class="praise-layout" aria-label="Praise for ${escapeHtml(data.authorWork.title)}">\n            <figure class="praise praise-lead">\n              <blockquote>${displayQuote(data.authorWork.praise[0])}</blockquote>\n              <figcaption><strong>${escapeHtml(data.authorWork.praise[0].attribution)}</strong><span>${richText(data.authorWork.praise[0].credential)}</span></figcaption>\n            </figure>\n            <div class="praise-supporting">\n${data.authorWork.praise.slice(1).map((item) => `              <figure class="praise">\n                <blockquote>${displayQuote(item)}</blockquote>\n                <figcaption><strong>${escapeHtml(item.attribution)}</strong><span>${richText(item.credential)}</span></figcaption>\n              </figure>`).join('\n')}\n            </div>\n          </div>\n        </div>\n      </div>\n    </section>`);
pressHtml = replaceBlock(pressHtml, 'topics', data.topics.map((item) => `            <li>${escapeHtml(item)}</li>`).join('\n'));
pressHtml = replaceBlock(pressHtml, 'fullbio', data.fullBio.map((item) => `          <p>${richText(item)}</p>`).join('\n'));
pressHtml = replaceBlock(pressHtml, 'awards', data.awards.map((item) => `            <li><strong>${escapeHtml(item.name)}</strong>, ${richText(item.detail)}</li>`).join('\n'));
pressHtml = pressHtml.replace(/<span>Updated [^<]+<\/span>/, `<span>Updated ${escapeHtml(data.updatedLabel)}</span>`);

let workHtml = await readFile(path.join(root, 'templates/work.html'), 'utf8');
workHtml = replaceWorkBlock(workHtml, 'jsonld', `  <script type="application/ld+json">\n${JSON.stringify(workJsonLd, null, 2).split('\n').map((line) => `  ${line}`).join('\n')}\n  </script>`);
workHtml = replaceWorkBlock(workHtml, 'throughline', `          <p class="throughline">${escapeHtml(data.profileThroughline)}</p>`);
workHtml = replaceWorkBlock(workHtml, 'navigation', data.portfolioChapters.map((chapter) => `        <a href="#${escapeHtml(chapter.id)}">${escapeHtml(chapter.title)}</a>`).join('\n'));
workHtml = replaceWorkBlock(workHtml, 'chapters', data.portfolioChapters.map((chapter) => {
  const chapterClass = chapter.id === 'labs' ? 'labs' : 'production';
  const items = chapter.items.map((item) => {
    const meta = [item.format, item.organization, item.years].filter(Boolean).join(' · ');
    const projectLink = item.portfolioUrl
      ? `\n              <a class="project-link" href="${escapeHtml(item.portfolioUrl)}">Open visual project</a>`
      : '';
    const proof = item.proof ? `\n              <p class="work-proof">${richText(item.proof)}</p>` : '';
    return `        <li class="work-item" id="${escapeHtml(item.id)}">\n          <div>\n            <h3 class="work-title">${escapeHtml(item.title)}</h3>\n          </div>\n          <div>\n            <p class="work-meta">${escapeHtml(meta)}</p>\n            <p class="work-role">${escapeHtml(item.role)}</p>\n          </div>\n          <div class="work-copy">\n            <p>${richText(item.summary)}</p>${proof}${projectLink}\n          </div>\n        </li>`;
  }).join('\n');
  return `    <section class="chapter ${chapterClass}" id="${escapeHtml(chapter.id)}" aria-labelledby="${escapeHtml(chapter.id)}-title">\n      <div class="chapter-grid">\n        <header class="chapter-header">\n          <h2 class="chapter-title" id="${escapeHtml(chapter.id)}-title">${escapeHtml(chapter.title)}</h2>\n          <p class="chapter-description">${escapeHtml(chapter.description)}</p>\n          <a class="chapter-link" href="${escapeHtml(chapter.portfolioUrl)}">Experience this chapter</a>\n        </header>\n        <ol class="work-list">\n${items}\n        </ol>\n      </div>\n    </section>`;
}).join('\n\n'));

let indexHtml = await readFile(path.join(root, 'index.html'), 'utf8');
indexHtml = replaceBlock(indexHtml, 'home-jsonld', `    <script type="application/ld+json">\n${JSON.stringify(homeJsonLd, null, 2).split('\n').map((line) => `    ${line}`).join('\n')}\n    </script>`);

await Promise.all([
  writeFile(path.join(root, 'public/press.md'), markdown, 'utf8'),
  writeFile(path.join(root, 'public/press.json'), `${JSON.stringify(structured, null, 2)}\n`, 'utf8'),
  writeFile(path.join(root, 'public/work.md'), `${workMarkdown}\n`, 'utf8'),
  writeFile(path.join(root, 'public/work.json'), `${JSON.stringify(workStructured, null, 2)}\n`, 'utf8'),
  writeFile(path.join(root, 'public/work.html'), workHtml, 'utf8'),
  writeFile(path.join(root, 'public/llms.txt'), llms, 'utf8'),
  writeFile(path.join(root, 'public/press.html'), pressHtml, 'utf8'),
  writeFile(path.join(root, 'index.html'), indexHtml, 'utf8')
]);

console.log('Generated press and work HTML, Markdown, JSON, llms.txt from content/press-data.json');
