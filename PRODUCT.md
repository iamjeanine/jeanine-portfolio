# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: buyers and executives in audio and television. People deciding whether to hire Jeanine, greenlight her, or bring her in to run a show or a lab. They arrive cold, often from LinkedIn or a forwarded link, and decide fast. Secondary audiences (collaborators, press, peers) matter but never outrank the buyer.

## Product Purpose

ghostmode.studio is Jeanine Emilia Cornillot's portfolio and studio site. Success on the cover: within ten seconds a buyer believes they are looking at a proven hitmaker. The track record leads. Emmy, Ambie, more than 300 episodes, shows people already know.

## Positioning

The claim a neighbor could not copy: created Scamfluencers and The Last City, produced Dying for Sex, all for Wondery and Amazon. Winner of Emmy and Ambie awards. Author of Family Sentence (Beacon Press). Founded Wondery's first AI Creator Lab and grew it from four people to more than fifty. Now runs Ghost Mode Labs, prototyping AI-native story formats. The hits are the headline; the lab is the depth behind them.

## Operating Context

The site is one continuous scroll: Cover, then Productions (seven editorial spreads, each show on its own color field drawn from its key art), then Ghost Mode Labs (dark chapter, autoplaying prototype videos), then About (colophon), then a closing contact beat. Videos are hosted on the jeanine-portfolio-video GCS bucket (no CORS headers, so canvas work on that footage is write-only). Media files never get committed to the repo; approved video goes to the bucket, uploaded by Jeanine.

## Capabilities and Constraints

- Stack: Vite 6, React 19, TypeScript, Tailwind 4, HashRouter. Deploys to Vercel on push. Hero explorations live on branch `hero-explorations` behind a `?hero=` switch.
- Copy rules, binding: no colons, semicolons, or em dashes in visible copy. Never state years of experience or a career date range. Exact credential line: "Emmy and Ambie Award-winning showrunner and executive producer."
- Hero display font is a drop-in slot: `HeroDisplay` / `HeroDisplayItalic` from `/public/fonts/`, awaiting a licensed face. Georgia is explicitly rejected as the rendered face.
- Hero media must never be a female face; it reads as a portrait of Jeanine. Archival imagery as the lead makes the site read documentary, which misrepresents the mix of past and future.

## Brand Commitments

- The studio is Ghost Mode Studio / Ghost Mode Labs. Mark: italic serif G with a small terracotta dot (#B3543A) on dark umber. The terra dot is the studio signature.
- Jeanine liked, and wants kept in some form: "GHOST MODE STUDIO" named at the top of the cover, her name as the anchor, and the rippling ghost-reflection idea.
- The hero represents the studio, never one project.
- Rejected on sight, confirmed in session: warm cream + terracotta + high-contrast serif (reads as AI/Claude template), premium near-black with glow (reads AI), literal occupational metaphors (call sheets, waveforms, tape decks, archival mugshots as lead imagery), utility-strip chrome dense with small text, nav that does not read as pressable.
- Her supernatural sensibility is "in-between worlds," sunlit and liminal, never gothic dark (see the Night Shift at the Fontainebleau deck).

## Evidence on Hand

Real, on disk or live: seven Productions spreads with real palettes and accolades in `pages/ProductionsPreviewPage.tsx`; show key art in `public/proto/` (untracked); awards list in `pages/SpinePreviewPage.tsx` (Ambie wins, Emmy nominations and wins, James Beard, Peabody for the Dying for Sex adaptation, Vogue and Apple accolades); Family Sentence (Beacon Press, Kirkus, Publishers Weekly Top 20); Unstill animations live at unstill.vercel.app/animations/ (CORS open, files 9 to 14 MB); Ghost Mode brand marks in ~/Desktop/Ghost Mode Brand and Logo. Absent, never to be fabricated: listener totals, revenue, client quotes.

## Product Principles

- The buyer decides in seconds; the scale of the career must be legible from the first viewport.
- Nothing on the site may read as template, corporate resume, or gimmick.
- The work is the proof: real shows, real awards, real prototypes, never invented claims.
- Ghost Mode is a studio identity, not a costume; concepts must survive the tenth visit.
- The site's chapters keep their per-show color fields; the cover must hand off to them deliberately.
