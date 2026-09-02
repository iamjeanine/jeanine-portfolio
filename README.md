# jeanine-portfolio

[ghostmode.studio](https://ghostmode.studio)

Portfolio site for Jeanine Emilia Cornillot. Producing and prototyping new ways to tell stories.

## Maintaining the site

### Local development and checks

Use Node.js 22.x. On a fresh checkout, install the locked dependencies with `npm ci`.

```sh
npm run dev
npm run build
npm run preview
```

Run these separately: `dev` serves the editable site, `build` creates the production output in `dist/`, and `preview` serves that build. Use the URL printed by Vite, since the port can change if another preview is running. A localhost preview is not the live website.

### Where to edit

- `pages/`: the visual portfolio, including Productions and About. Its page copy is maintained here separately from the press assets.
- `content/press-data.json`: shared copy for the press kit, work index, machine-readable versions, and structured metadata. Keep overlapping facts consistent with the visual portfolio.
- `templates/work.html`: work-index layout and styles.
- `public/press.html`: press-kit layout, screen styles, and print styles. Content inside the marked generated blocks is replaced by the generator, so edit that copy in `content/press-data.json` instead.
- `scripts/generate-press-assets.mjs`: markup generation for the shared content.
- `public/sitemap.xml`: update a page's `lastmod` only when that page meaningfully changes. The visual portfolio's hash chapters share the homepage URL.

Both `npm run dev` and `npm run build` regenerate the HTML, Markdown, JSON, `llms.txt`, and homepage structured metadata. For content-only regeneration, run `npm run generate:press`. Review and commit the resulting tracked changes alongside their source. Do not edit generated Markdown or JSON directly.

### Updating the downloadable PDF

The PDF is a separate, committed asset. A normal site build does **not** regenerate it. After changing press-kit copy or layout:

```sh
npm run generate:press
npm run build:press-pdf
```

The PDF script requires Chrome or Chromium. Set `CHROME_PATH` if it is not installed at a standard location. It prints `public/press.html` using its print styles to `public/Jeanine-Cornillot-Press-Kit.pdf`. Open the resulting PDF and check page breaks, typography, and completeness before committing it.

### Publishing

1. Review `git status` and the diff. Leave internal critiques and temporary files out of release commits.
2. Run `npm run build` and `git diff --check`; check the affected pages in the browser at desktop and mobile sizes.
3. Commit and push the working branch, then merge its reviewed pull request into `main`. A feature-branch push alone does not publish the production site.
4. Confirm Vercel's production deployment for the merged commit is ready, then check `https://ghostmode.studio/`, the changed chapters, `/press.html`, `/work.html`, and the PDF download.

Keep the Google verification tag and crawler metadata intact. Do not commit credentials, `node_modules/`, or `dist/`. Local archived critiques can be kept under the ignored `tmp/critique-archive/` directory.

---

Emmy and Ambie Award-winning executive producer and showrunner. 300+ episodes across podcasts, television, and digital. Previously at Amazon/Wondery, where I founded and led the AI Creator Lab, growing it to 50+ people across content, marketing, and production. Now through Ghost Mode Labs, developing original IP and building creative tools across nonfiction, scripted, and interactive formats.

## Independent Projects

**UNSTILL** - A museum experience about young Australians who pushed against the Victorian order in 1920s Sydney. The only photographs of them that survive are the ones the justice system kept. The work brings them back, generating a new inscription for each life every visit. Created as a proposal for Museums of History NSW.

**MythOS** - A research tool that helps studios find new franchise IP. Most development slates return to the same public domain stories. MythOS opens 3,500 years of mythology and folklore from across cultures for writers and showrunners to develop into IP.

**Narrative Space** - An interactive worldbuilding tool that turns scattered story notes, characters, timelines, and locations into a 3D space writers can move through. Designed to show story worlds in new ways.

**Tender** - A conversational app for finding culture beyond the algorithm. A human-curated library of films, essays, poems, myths, and podcasts paired with a conversational system that responds to how someone is feeling. A way of finding culture that feels closer to asking a thoughtful friend than scrolling a feed.

## Wondery / Amazon

**Multiverse Quad** - One story adapted into four formats at once: animated short, graphic novel, visual audiobook, and podcast. Built from the sci-fi series The Last City. Pitched to Amazon's AGI team and developed with engineers, scientists, product leadership, and Go To Market teams. Shortlisted for Andy Jassy's AWS re:Invent keynote.

**AI Creator Lab** - Founded Wondery's first AI Creator Lab. Grew from four people to more than fifty across content, marketing, product, and ad sales. Three projects came out of the lab: StoryCraft (story adaptation for kids and family), a research assistant for background material and media pulls, and a metadata tool for publishing across platforms.

**StoryCraft** - A tool for adapting adult narrative podcasts into kids and family adventures. Extracts story beats and themes from source material, flags content that needs navigating for younger audiences. Prototyped at Wondery using Against the Odds. Greenlit to pilot with the Kids and Family team.

**In-World Social Campaign** - Marketing built from inside a fictional world. For The Last City, social posts came from inside the story: destination posts, recruitment ads, brand spots, a trailer made as if the city had its own creative agency. Built more than a dozen prototypes. Two moved into production.

## Stack

Portfolio site: React · TypeScript · Vite · Tailwind CSS · React Router

UNSTILL: React · Vite · GSAP ScrollTrigger · Canvas API · Anthropic Claude API · Vercel serverless proxy · Google Veo 3.1 · AI colorization

MythOS: React · Three.js · React Three Fiber · GSAP · Anthropic Claude API · Zustand · Vite · Vercel

Narrative Space: React · Three.js · React Three Fiber · GSAP · Anthropic Claude API · Zustand · Playwright · Vite · Vercel

Tender: React · Vite · Anthropic Claude API · Express · Node.js · Vercel

## Built with

All projects were built using Claude Code, Google AI Studio, and Google Antigravity.
