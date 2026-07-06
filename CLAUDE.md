# Portfolio — ghostmode.studio

Personal portfolio site showcasing 8 projects across story systems, production tools, and cultural experiments.

**Live:** https://ghostmode.studio
**Repo:** `git@github.com:iamjeanine/jeanine-portfolio.git`
**Deploy:** Push to git → Vercel auto-deploys.

## Stack

- Vite 6 + React 19 + TypeScript
- Tailwind CSS 4 + PostCSS
- React Router DOM 7 (HashRouter)
- View Transitions API for page navigation
- Dev port: **3000**

## Routing

- `/#/` → HomePage (Hero + ProjectGrid + AboutModal)
- `/#/project/:id` → ProjectDetailPage (full-screen detail overlay)

## Key Files

| File | Role |
|------|------|
| `constants.ts` | All project data (titles, descriptions, video URLs, tools, liveUrl, embedUrl) |
| `types.ts` | TypeScript interfaces: Project, ProjectVideo, ProjectImage |
| `App.tsx` | HashRouter setup, 2 routes |
| `pages/HomePage.tsx` | Hero + ProjectGrid + footer + AboutModal |
| `pages/ProjectDetailPage.tsx` | Detail page with 3 layout variants |
| `components/Hero.tsx` | Sticky hero with scroll-driven zoom, mute toggle, grain overlay |
| `components/ProjectGrid.tsx` | Filterable tile grid (All / Story Systems / Production Tools / Cultural Experiments) |
| `components/ProjectTile.tsx` | Tile with hover slide-reveal interaction, lazy-load video |
| `components/VideoPlayer.tsx` | Video player with aspect ratio support, mute toggle, fullscreen |
| `components/PhoneEmbed.tsx` | iPhone mockup with iframe embed + frosted "Tap to explore" overlay |
| `components/AboutModal.tsx` | Fixed centered modal, dark theme, escape/click-outside close |
| `components/ScrollCue.tsx` | Animated "scroll" text + line at bottom of hero |
| `hooks/useViewTransition.ts` | View Transitions API wrapper for smooth page nav |
| `hooks/useIntersectionReveal.ts` | Scroll-triggered fade-in animations |
| `index.html` | Entry point with fonts, preloads, keyframe animations, view transition CSS |
| `index.css` | Tailwind v4 imports + Uncut Sans font + theme vars |

## Projects (constants.ts order)

| # | ID | Title | Type | Special |
|---|-----|-------|------|---------|
| 1 | narrative-space | Narrative Space | Story System | liveUrl |
| 2 | unstill | Unstill | Cultural Experiment | liveUrl |
| 3 | multiverse-quad | Multiverse Quad | Story System | image only (no video) |
| 4 | ai-creator-lab | AI Creator Lab | Production Tool | **custom layout** |
| 5 | tender | Tender | Cultural Experiment | embedUrl + liveUrl + liveUrlLabel + previewHasAudio |
| 6 | storycraft | StoryCraft | Production Tool | — |
| 7 | in-world-social-campaign | In-World Social Campaign | Story System | **custom layout**, 3 videos |
| 8 | podcast-mixtape | Podcast Mixtape | Cultural Experiment | — |

## Detail Page Layouts

Three layout variants in `ProjectDetailPage.tsx`:
1. **Default** — PhoneEmbed (if embedUrl) or VideoPlayer + text + additional videos
2. **AI Creator Lab** (`id: 'ai-creator-lab'`) — Video, text, second video with parsed caption
3. **Social Campaign** (`id: 'in-world-social-campaign'`) — Custom 3-video arrangement

## Tile Hover Interaction

Desktop only — video container slides right 30% with scale 1.03, revealing title panel behind. Mute button appears for audio projects. Mobile: static video, caption always visible, tap-to-expand then tap-to-navigate.

## Typography

- **Uncut Sans** — UI sans-serif (400, 700)
- **DM Serif Display** — display headings
- **Source Serif 4** — body serif (300, 400, italic)
- All loaded via Google Fonts

## Design

- Light background (#f8f8f8), near-black text (#111111)
- Film grain overlay (SVG noise, 0.015-0.04 opacity)
- View Transitions with `project-hero` animation (0.45s cubic-bezier)
- Scroll-driven hero zoom-out via CSS custom properties (no re-renders)
- No CSS filters on tiles — full-fidelity colors

## Video Hosting

All videos on Google Cloud Storage: `https://storage.googleapis.com/jeanine-portfolio-video/`

## Performance

- Tile videos lazy-load via IntersectionObserver (200px rootMargin)
- Hero poster preloaded in `<head>`
- CSS custom properties for scroll effects (avoids re-renders)
- Always starts muted for browser autoplay compliance

## Things to Know

- Projects with `embedUrl` get PhoneEmbed instead of VideoPlayer on detail page
- Projects with `liveUrl` get a CTA box; custom label via `liveUrlLabel`
- `getVisibleProjects()` in constants.ts returns all projects (both Selected and Experiments categories)
- Prev/Next navigation loops at boundaries
- View Transitions have reduced-motion fallback
