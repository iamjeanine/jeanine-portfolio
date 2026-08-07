# ghostmode.studio: One Publication Redesign Plan

Self-contained execution plan for the full-career portfolio broadening. Written 2026-08-07 from an Impeccable 4.0.4 dual-agent critique (snapshot: `.impeccable/critique/2026-08-07T13-41-46Z__pages-labspreviewpage-tsx.md`, score 18/28) plus a premium-frontend planning pass. The executing agent should be able to build from this document alone, without the originating conversation.

**Owner:** Jeanine Emilia Cornillot. Open decisions listed in section 9 are hers alone; the builder must not invent answers to them.

---

## 1. Design thesis

**The site is one publication: a single issue of a magazine about one career.**

- **Cover** (hero): promises the whole career, not just AI work.
- **Chapter 01, Productions**: the color plates. Full-bleed poster spreads, one per credit, palettes sampled from each show's actual key art.
- **Chapter 02, Ghost Mode Labs**: the screening room. The same publication with the house lights down. Video-led, wide-paced, warm dark.
- **Colophon** (About): the person behind both chapters.

Cohesion comes from shared physics: one typographic system, one indexing grammar, one warm color family, one grain, one scroll-driven color continuum. Distinction between chapters comes from **structure and pace only, never temperature**. Jeanine has explicitly rejected the warm-story vs cool-AI metaphor. Nothing on this site is cool-toned. The AI work is hers and it is warm.

The elevation target: a visitor should ask "who designed this?", never "which AI made this?"

---

## 2. Current state (what exists on branch `productions-chapter-prototype`)

- Live site: HashRouter, `/#/` home (cream, hero video, filterable project grid), `/#/project/:id` detail pages. Project data in `constants.ts`.
- Prototype `/#/preview/productions` (`pages/ProductionsPreviewPage.tsx`): 7 numbered spreads (Scamfluencers, Dying for Sex, The Last City, Hollywood & Crime, Born This Way, No Passport Required, Life of Kylie), per-spread color fields, oversized Bodoni titles, Role/Series/Impact expandables, scroll-driven ColorBridge between spreads.
- Prototype `/#/preview/labs` (`pages/LabsPreviewPage.tsx`): 9 entries (L-01 Visual Audiobooks ... L-09 In-World Social Campaign) on one continuous warm ink-black ground `#120C08` with terra-ember accent `#E8A672`, 16:9 lazy-loading cover videos, LightsDown bridges at chapter entry/exit.
- Reference art for Productions is local-only (`public/proto/`, gitignored). Labs media streams from Google Cloud (`https://storage.googleapis.com/jeanine-portfolio-video/`).

Known verdict from critique: typography and editorial voice already carry ~70% cohesion; remaining gaps are structural (no spine connecting chapters, no hierarchy inside Labs, inconsistent depth-of-content rules) and craft-floor (contrast failures in Productions, missing focus states, monotony in Labs).

---

## 3. Design system (build this first, everything else consumes it)

### 3.1 Color tokens (all warm family, OKLCH hue ~50-60 deg for neutrals)

| Token | Value | Role |
|---|---|---|
| `--paper` | `#F5F2EC` | Site ground (existing) |
| `--ink` | `#150E0A` | Text on paper (existing) |
| `--ink-deep` | `#120C08` | Labs chapter ground (site ink, deepened) |
| `--cream-ink` | `#F2EDE2` | Text on dark grounds |
| `--terra` | `#B3543A` | Site accent on light grounds (existing) |
| `--ember` | `#E8A672` | Terra tuned for dark grounds (9.4:1 on `--ink-deep`; raw terra fails at 3.9:1) |
| Productions spread fields | per-spread, sampled from key art | Diegetic color, the one sanctioned departure from neutrals |

Rules:
- No new hues without Jeanine's sign-off. No mint, no cyan, no violet, no cool gray anywhere.
- Every accent-on-field pair must be computed (not eyeballed) against **all three stops** of its gradient, target 4.5:1 for small text. Use real WCAG math.
- Neutrals may be tinted toward terra at chroma 0.005-0.01 for cohesion; check new neutrals' OKLCH hue angle against their scroll neighbors (a past bug: two adjacent spreads both drifted to the same ~90 deg gold and looked accidentally identical).

### 3.2 Typography (existing faces, formalized scale)

- **Bodoni Moda** (display, already loaded): spread titles, chapter titles, pull-stats.
- **Source Serif 4** (body, already loaded): descriptions, intro statements.
- Uppercase tracked labels (existing style, `0.7rem`, tracking `0.18em`): eyebrows, indexes, small UI.

Unified scale, same in both chapters (Labs currently runs a smaller title clamp than Productions; unify so the chapters read as siblings):

| Token | Value | Use |
|---|---|---|
| `--display-xl` | `clamp(3.2rem, 12.5vw, 12.5rem)`, line-height 0.92, tracking -0.015em | Spread/entry titles, both chapters |
| `--display-md` | `clamp(2rem, 4vw, 3.5rem)` | Chapter headers |
| `--stat` | `clamp(3rem, 5.5vw, 5rem)` italic | Pull-stats (auto-drop to `clamp(2rem, 3vw, 3rem)` when value exceeds 6 characters) |
| `--body` | `1.02-1.05rem`, line-height relaxed, max-width 36-40ch | Descriptions |
| `--label` | `0.7rem` / `0.18em` tracking, uppercase | Eyebrows, indexes |

Title rules (hard-won, do not regress):
- Bind only two SHORT words with `&nbsp;` (8 or fewer combined characters) to prevent orphans. Longer titles wrap naturally. Verify every title at 375px.
- Titles have `z-10` and paint over media on overlap. If a main image has a face or key content in its top third, push media down (`md:mt-10` style offset), never trust the default negative pull. Check every spread.

### 3.3 Spacing rhythm

- Chapter gutters: `px-6 md:px-20` (Productions) and `px-6 md:px-24` (Labs keeps slightly wider gutters as part of its pace identity).
- Labs inter-entry spacing varies by tier (see 5.2), not one uniform gap. Uniform 224px gaps between identical templates caused the "infinite feed" fatigue finding.
- Bridges: standard chapter-internal bridge `h-[16vh] md:h-[24vh]`. The two biggest lightness swings (paper into `--ink-deep` and back) get `h-[32vh] md:h-[40vh]` so the lights-down reads as a dim, not a cut.

### 3.4 Motion grammar (one physics for the whole site)

- Scroll-driven effects set CSS custom properties directly via ref (rAF-throttled), no React re-renders. This is the established site pattern (hero zoom, ColorBridge); all new motion follows it.
- Entrances: fade-up 24-28px, 0.7-0.9s, expo-out family easing (`cubic-bezier(0.22,1,0.36,1)`), staggered 80-120ms within a spread. One entrance per element, ever.
- No bounce/elastic easing. No layout-property animation (transform and opacity only). No infinite ambient loops except video content itself.
- `prefers-reduced-motion`: every scroll listener skips (bridges freeze at `--t: 0.5`), every entrance renders settled, videos do not autoplay.
- Budget: at most one active flourish per viewport. In Productions that is the color bridge. In Labs that is the projector-light reveal (5.3). Nothing stacks.

### 3.5 Shared components (extract, then consume)

Currently `ColorBridge`/`LightsDown` is byte-duplicated in both prototype files, and bridge endpoint colors are hand-copied hex that silently desync from spread data. Extract into `components/chapter/`:

- `ColorBridge` (one implementation; props from/to; height variant)
- `Eyebrow` (client/date left, index right)
- `IndexNumber` (chapter-prefixed: `01`-`07` Productions, `L-01`-`L-09` Labs)
- `Expandable` (the `details`/`summary` grid-rows animation from Productions)
- `SpreadShell` (grain overlay + palette CSS vars + gutters)
- `LazyVideo` (IntersectionObserver mount, 400px rootMargin, muted loop, reduced-motion, poster support, **and a failure fallback**: on error render title-on-field placeholder so a dead video is never an invisible black box on black)

Bridge endpoints must derive from the spread data array, not hand-copied hex.

---

## 4. The Spine (structural unification, the single biggest move)

Jeanine's approved architecture: **one continuous scroll with chapters**, not separate destinations.

1. **Stitch the chapters into one scroll**: Cover (restaged hero) -> Productions chapter -> lights-down bridge -> Ghost Mode Labs chapter -> lights-up bridge -> About colophon -> footer. Preserve deep links (`/#/productions`, `/#/labs`, `/#/about` scroll to anchors; `/#/project/:id` detail pages remain as-is).
2. **Chapter rail**: a persistent, minimal fixed indicator (right edge on desktop, collapsed on mobile) showing `Productions / Ghost Mode / About` with current position. It doubles as the progress cue the Labs critique found missing (Nielsen #1 scored 2/4 for exactly this). Style: `--label` type, ink on paper sections, cream-ink on dark, terra/ember active marker. No pill, no glass, no backdrop blur.
3. **Cover restage**: hero copy must promise the whole career (podcast/TV leadership plus Ghost Mode Labs), and the hero gains a contents block in the magazine idiom: `01 Productions / 02 Ghost Mode Labs / 03 About`, each an anchor link. This teaches the structure in the first viewport and seeds the indexing grammar the chapters already use.
4. The existing home project grid's fate is an open decision (9.3): the Labs chapter largely supersedes it.

Acceptance: a visitor can scroll top to bottom through the entire career with zero navigation, always knows which chapter they are in, and can jump chapters from the rail or the cover contents.

---

## 5. Chapter 02 rebuild: Ghost Mode Labs as "The Screening Room"

The current Labs prototype is structurally flat: 9 identical templates on one hue. The rebuild keeps the warm-dark world and video-led identity, and adds hierarchy, rhythm, and one signature moment.

### 5.1 Reorder (fixes P0: chapter currently leads with an unbuilt project)

Lead with proof. Jeanine has set Visual Audiobooks at position 3: she is finishing it in parallel and it should sit high, not at the end.

| Position | Project | Tier |
|---|---|---|
| L-01 | Static | Feature |
| L-02 | Multiverse Quad | Feature |
| L-03 | Visual Audiobooks | In development (graduates to Feature when she ships it) |
| L-04 | Narrative Space | Feature |
| L-05 | MythOS | Feature |
| L-06 | Unstill | Feature |
| L-07 | Tender | Short |
| L-08 | AI Creator Lab | Short |
| L-09 | In-World Social Campaign | Short |

Positions L-01, L-02, and L-03 are confirmed by Jeanine (2026-08-07). The rest is a strong default; confirm remaining tier calls with her (9.2).

### 5.2 Three tiers (fixes P1 monotony: scale hierarchy plus varied rhythm)

- **Features** (5): full treatment. `--display-xl` title, near-full-width video frame (up to `md:w-[92%]`, alternating pull left/right), description, pull-stat where a verified one exists, and **expandables for parity with Productions** using Labs-appropriate labels: `Concept / Build / Signal` (what it is / how it was made, the tools / what happened: traction, adoption, recognition). Inter-entry gap: generous (`pb-40 md:pb-64`).
- **Shorts** (3): compact. `--display-md` title, video at `md:w-[60%]`, one-paragraph description, no expandables, no stat slot. Tighter gap (`pb-24 md:pb-36`). A one-line section rule introduces them: "Shorts" or similar quiet divider in `--label` style.
- **In development** (1): Visual Audiobooks holds position L-03 as a light entry: title, one line, looping cover video, "Coming soon" tag in ember, no fabricated description or stat. Jeanine is completing the project in parallel; when it ships, this entry graduates to full Feature treatment in place. The build should make that graduation cheap (same entry shell, fields optional).

Do not fabricate stats to fill Feature slots. Verified stats only (see Appendix A). A Feature without a stat simply omits the slot (Narrative Space, Unstill currently have none).

### 5.3 Signature moment: the projector light

One flourish, CSS-driven, owned by this chapter: as each Feature's video frame enters the viewport, a soft warm light rises behind it. Implementation: a radial gradient (ember at 4-7% opacity, large blur radius, positioned behind the frame) whose opacity and vertical position are driven by a scroll-set CSS custom property, same rAF pattern as ColorBridge. The effect reads as a projector warming up as each screening starts, then settles; it is not a loop and not a glow border on the frame itself (zero-offset colored box-shadow glows are banned; the detector flags them as `dark-glow` and one was already removed from this page).

Reduced motion: light renders settled at full (subtle) value, no scroll coupling.

### 5.4 Video treatment

- Frames are aspect-native per asset, not forced 16:9. Portrait or non-16:9 assets (Visual Audiobooks) get a frame matched to their ratio; on the dark ground a letterboxed black bar is invisible and makes media boundaries vanish (critique persona finding). A hairline border `1px solid rgba(242,237,226,0.14)` marks every frame edge so frames read as objects on the ground.
- Where a cover video has its own baked-in wordmark that duplicates the page title (MythOS is the worst case), prefer the project's demo footage (`mainVideos[0]` in `constants.ts`) or a clean segment. Flag substitutions to Jeanine; do not crop or re-edit media files (media workflow is hers, see 8).
- Depth shadow only: `0 40px 120px rgba(0,0,0,0.6)`. No colored shadows.

### 5.5 Chapter furniture

- Chapter header: keep `Ghost Mode Labs` + category line + intro statement. Intro stays under 50ch, ends on a strong line, no orphan (bind final two short words).
- The eyebrow's client field becomes meaningful: entries built at/for others carry `Wondery` or `Amazon AGI`; her own carry `Ghost Mode Labs`. Verify attribution with Jeanine (9.4).
- Every entry links `Open project ->` to its existing `/#/project/:id` detail page. The About coda at chapter end becomes a real link into the About colophon.

---

## 6. Chapter 01 repairs: Productions (refinement, not redesign)

The chapter's system is approved; this is craft-floor work.

1. **Contrast repairs** (detector-measured, file `pages/ProductionsPreviewPage.tsx`):
   - Scamfluencers: ink `#FAEFE2` on field `#CC5D24` measures 3.6:1 (x5 elements). Darken the field's light stop and/or lift ink lightness until all three gradient stops pass 4.5:1 for body-size text; titles at display size need 3:1.
   - Scamfluencers accent `#F0FF29` on the orange field is 3.69:1 and is a **known, disclosed ceiling**: exhaustive search proved no chartreuse-family value passes 4.5:1 there. Fixing it means abandoning the key-art chartreuse hue. This is Jeanine's call (9.1); do not silently change it.
   - Hollywood & Crime accent `#C2201F` on `#DBDFE2` is a 4.45:1 near miss; nudge the red darker (~`#B71E1D`) and re-verify.
2. **Bridge endpoints**: replace all hand-copied hex pairs with values derived from spread data (see 3.5).
3. **Prototype chrome**: the font-switcher pills (10.4px text) and any `Prototype` labels are dev-only; remove them in the real build rather than restyling.
4. **Header chrome contrast**: muted header links measure 4.10:1 and the faint label 2.09:1 on paper. Raise mutes so all pass 4.5:1 (an `--ink` at 62-70% opacity range works; verify computed values).
5. Keep everything else: spread order, palettes, expandables, copy, the promoted Hollywood & Crime spread, Kylie's deliberately light treatment.

---

## 7. Colophon: About

Graduates from modal to the publication's closing spread, on paper ground.

- Contents: the current bio, plus what the modal never had room for: *Family Sentence* (Beacon Press), teaching/mentorship, and the full awards list.
- Form: editorial masthead/colophon idiom. `--display-md` heading, two-column on desktop (bio narrative / structured lists), `--label` headers for Awards, Teaching, Publications. Restrained: no cards, no icons, no timeline graphics.
- The existing AboutModal remains functional until the spread ships, then the header's About affordance points at the anchor instead.

---

## 8. Hard constraints for the executing agent

1. **Never commit media to the repo.** Video/image assets ship via Jeanine's workflow: renders go to her video review folder, she approves and uploads to the Google Cloud bucket (`https://storage.googleapis.com/jeanine-portfolio-video/`), the site references the Cloud URL. The `public/proto/` and `Broader Portfolio references/` folders are local-only prototyping aids and stay gitignored. The real Productions build needs its art through this pipeline before launch.
2. **No em dashes anywhere**: site copy, code comments, commit messages, replies to Jeanine. Use commas, colons, or periods.
3. **No fabricated facts.** Copy edits draw only from `constants.ts`, the two prototype files, and Appendix A. If a claim is not in those sources, ask.
4. **Design guardrails (anti-slop, enforced by review):** no glassmorphism/backdrop blur, no zero-offset colored glow shadows, no gradient text, no neon or cool accent hues, no scanlines, no generic bento grids, no side-stripe borders, no icon-above-heading cards, no monospace-as-tech-shorthand, no pure `#000`/`#fff`. The publication's warm editorial world is pinned; any "premium dark UI" reflex from training defaults is the failure mode this plan exists to prevent.
5. **Verification protocol per phase:** screenshot desktop ~1440px and mobile 375px (one change, one screenshot); zero horizontal overflow at 375px; contrast computed not eyeballed; `node ~/.claude/skills/impeccable/scripts/detect.mjs --json <changed files>` clean or findings dispositioned; console clean; reduced-motion spot-check; lazy-load intact (videos must not all mount on page load).
6. **Git:** work on `productions-chapter-prototype` (or a child branch), commit per phase, push after committing. Vercel auto-deploys `main` only; do not merge to `main` without Jeanine.
7. **Accessibility floor:** `:focus-visible` styles on every interactive element (2px `--terra`/`--ember` outline, 2px offset, per ground); all text 4.5:1 (3:1 display-size); `aria-label` on videos; the chapter rail keyboard-navigable; skip-to-chapter links for screen readers.

---

## 9. Open decisions (Jeanine only; builder must not invent)

1. **Scamfluencers chartreuse**: keep the key-art hue at 3.69:1 as a disclosed exception, or abandon the hue for a compliant accent.
2. **Labs tiers**: L-01/L-02/L-03 order is confirmed. Confirm the remaining order and the Feature/Short split (particularly whether AI Creator Lab, a 4-to-50-people program with a real stat, deserves Feature over Short).
3. **Home project grid**: retire it once the Labs chapter exists, keep it as a compact "index" section after About, or keep both temporarily.
4. **Attribution eyebrows**: AI Creator Lab shows `Wondery` (its copy says "Wondery's first AI Creator Lab" but `constants.ts` lists client `Ghost Mode Labs`); Multiverse Quad shows `Amazon AGI`; In-World Social shows `Wondery`. Confirm.
5. **MythOS cover swap**: cover video carries a baked-in wordmark; approve demo-footage substitution or supply a new cover through the media pipeline.
6. **Expandable labels for Labs Features**: `Concept / Build / Signal` proposed; alternatives welcome.

---

## 10. Execution phases (each independently shippable, in order)

| Phase | Scope | Done when |
|---|---|---|
| **0. Systemize** | Extract shared components (3.5), define tokens (3.1-3.4), derive bridge endpoints from data. Zero intended visual change. | Both prototypes render pixel-equivalent from shared parts; detector clean. |
| **1. The Spine** | Stitch chapters into one scroll, chapter rail, hero cover restage with contents block, anchor deep-links. | Full top-to-bottom scroll works desktop+mobile; rail tracks position; old routes redirect to anchors. |
| **2. Screening Room** | Labs rebuild per section 5: reorder, tiers, expandables, projector light, aspect-native frames, video fallbacks, chapter furniture. | Critique re-run on Labs scores 24/28 or better with zero P0/P1; all 9 entries verified at 375px. |
| **3. Plates repair** | Productions per section 6. | All measured contrast failures pass (or are Jeanine-approved exceptions); bridges data-derived. |
| **4. Colophon** | About spread per section 7; retire modal. | About carries Family Sentence, teaching, full awards; modal affordance re-pointed. |
| **5. Finish pass** | Full copy pass in Jeanine's voice (she reviews every line), accessibility floor sweep, performance check (lazy media, no layout shift), final full-site critique. | Final critique 26/28 or better; detector clean; Jeanine signs off copy. |

Phases 2 and 3 can run in parallel after 1. Phase 5 is deliberately last: Jeanine chose to finish structural work first, then do one clean copy pass, rather than polishing piecemeal.

---

## Appendix A: Locked facts (verified; do not alter, do not embellish)

- **Scamfluencers**: Winner, 2023 Ambie, Best Entertainment Podcast; second nomination 2025; Vogue's Best Podcasts of the Year; Apple's Creators We Love; adapted internationally (Mexico, Brazil); 53M downloads.
- **Dying for Sex**: Winner, Ambie **Podcast of the Year** (2021); named to Apple Podcasts' Favorites of the Year. **Never** "Apple Podcasts Show of the Year": that phrasing is factually wrong and previously had to be purged. FX adaptation: Peabody winner, 9 Primetime Emmy nominations, starring Michelle Williams.
- **The Last City**: #1 Apple Fiction in 20 countries; Ambie Best Fiction nominee; Audible Original adaptation; source world for Multiverse Quad.
- **Born This Way**: 3 wins, 16 Primetime Emmy nominations.
- **No Passport Required**: James Beard Media Award winner.
- **Life of Kylie / Hollywood & Crime**: no invented stats; their value is stated in prose only.
- **Static**: 582 recurring overlaps across 6,884 accounts; thirteen Reddit communities; "7,000 voices. One American haunting."
- **Multiverse Quad**: built with Amazon's AGI team; shortlisted for the AWS re:Invent keynote; four formats.
- **AI Creator Lab**: grew 4 to 50+ across the company; three tools shipped from it.
- **MythOS**: 494 source stories; Circe: 46 cultures, 3,500 years.
- **Unstill**: built as a proposal for Museums of History NSW; Saidiya Hartman epigraph.
- All Productions dates are show air dates, never personal employment tenure.

## Appendix B: File map

| File | Role in plan |
|---|---|
| `pages/ProductionsPreviewPage.tsx` | Chapter 01 source (refine per section 6) |
| `pages/LabsPreviewPage.tsx` | Chapter 02 source (rebuild per section 5) |
| `pages/HomePage.tsx`, `components/Hero.tsx` | Cover restage (section 4) |
| `components/AboutModal.tsx` | Superseded by colophon (section 7) |
| `constants.ts` | Single source of project data and Cloud media URLs |
| `components/chapter/*` (new) | Shared system components (section 3.5) |
| `.impeccable/critique/` | Critique snapshots; re-run targets per phase |
