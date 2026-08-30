# Handoff: ghostmode.studio redesign work

For the next agent or developer picking this up. Written 2026-08-29 after a long
exploration session with Jeanine. Read PRODUCT.md alongside this; it holds the
durable product truth. This file holds the working state, the decisions, and
the taste verdicts so nothing gets relearned the expensive way.

## The goal

A cohesive portfolio for Jeanine Emilia Cornillot, showrunner and executive
producer. Primary visitor: buyers and executives deciding whether to hire her.
Within ten seconds they should believe they are looking at a proven hitmaker.
The site must not read as AI-generated, corporate, or gimmicky.

## Repo and deploy state

- Live site: https://ghostmode.studio serves branch `main`, untouched all
  session. Vercel auto-deploys on push (project `jeanine-portfolio`).
- All session work is on branch `hero-explorations`, currently at `ca8c412`.
- Vercel previews are SSO-protected. The Vercel MCP tool
  `get_access_to_vercel_url` mints a shareable no-login link.
- Stack: Vite 6, React 19, TypeScript, Tailwind 4, HashRouter. `?hero=` query
  params survive hash routing. Dev port 3000.

## What is on the branch vs main

1. **The poppy palette swap (KEEP — she loves it).** The site's muted rust
   terracotta read as "the Claude palette" to her. Replaced with a saturated
   Clare V-style poppy vermilion: the Scamfluencers field
   (`linear-gradient(160deg, #FA4B24 0%, #F43A1A 55%, #E5300F 100%)` in
   `pages/ProductionsPreviewPage.tsx`), `--terra: #E5300F` and
   `--terra-text: #D42B0C` in `index.css`. Her words: "really fresh and less
   like Claude."
2. **Cover cut to four elements (KEEP).** Yellow SELECTED WORK stamp (19px
   bold caps), name in white Bodoni, the exact credential line in white
   italic, three-chapter nav. Contact links removed from the cover at her
   direction (contact lives in About and on the back cover).
3. **Contrast system on the poppy (KEEP the rule).** No light color passes
   4.5:1 for small text on this field (cream ~3.2:1, white ~3.4:1). Rule:
   nothing small ever sits on the red. Display-size type (>=24px, or >=18.66px
   bold) in pure white #FFFFFF passes the 3:1 large-text floor. The acid
   yellow #F0FF29 appears only at display size or as non-text ornament (2px
   underlines, focus rings). Long-form paragraphs on the Scamfluencers spread
   use near-black #140702 (the one place with true reading text). The honest
   numbers are in the palette comment in ProductionsPreviewPage.
4. **Hero exploration variants (DISPOSABLE).** `?hero=signal|plate|unstill|
   gels|dusk|sunlit|line-a|line-b|line-c` render experimental covers;
   `?hero=off` (the default) is the production cover. All the machinery lives
   in `components/hero/`. `HeroPicker.tsx` is branch-only review chrome.
   None of these were accepted. Delete `components/hero/` and the variant
   plumbing in `pages/SpinePreviewPage.tsx` before any merge to main, or keep
   line-a (the profile-line concept) if she revives it.
5. Removed: the banned "2015–Present" career range from the Productions title
   card; the back-cover bridge `via` (it banded at the seam after the swap).

## The unresolved problem: the cover's layout

This is the open wound and the reason for the handoff. After the cuts the
cover felt "too empty, hierarchy doesn't look right" to her. An assessment
diagnosed a missing middle type tier (152px name straight down to 24px
whispers) and leftover space pooling into a diagonal void. Two fix attempts:

- Aggressive (REVERTED, commit cd8617c → ca8c412): credential moved under the
  name at ~30px, name cap raised, nav given `mt-auto` to ride the bottom
  edge. On her real screen the nav read as stranded "really low on the page"
  and the writing "small." Note: the codebase's own comment in the Cover
  section documents why bottom-pinning fails here — the gap scales with
  viewport height. Do not repeat this.
- Conservative (CURRENT STATE at ca8c412): original designer's row grammar
  restored; the credential/nav row rises (mt-16 lg:mt-20) and top-aligns so
  credential and nav share a start line; credential at 24/28px, maxWidth
  26ch; name cap back at the tuned 9.5rem.

She has NOT approved the current state. The cover's composition still needs a
real designer's eye at real viewports. The per-show spreads, Labs chapter, and
About colophon are strong and approved-by-silence; the cover is the work.

## Taste verdicts (hard-won; violating these burned a full day)

DO:
- Saturated commitment over tasteful mutedness. Timid terracotta = AI tell.
- Her own material: show key art palettes, the acid chartreuse on poppy
  (it is sampled from Scamfluencers' key art and no template produces it).
- Minimal text on the cover. She cut copy twice; less is always her answer.
- Plain language when explaining design to her. "Big letters fine on red,
  tiny letters not" — never WCAG jargon, never P0/heuristic tables.
- Real buttons that look pressable.

DO NOT:
- Cream ground + terracotta accent + high-contrast serif (the "Claude look").
- Premium near-black with glow (the other AI look).
- Skeuomorphic object props (a blush "calling card" was rejected as "corny,
  like a post-it").
- Literal occupational metaphors: call sheets, waveforms, tape decks,
  playbills, FYC ads. All pitched, all rejected as corny or wrong-world.
  She is an audio person; film/theater rituals misread her.
- Archival imagery as the lead (reads documentary; the site is a mix of past
  and future). Never a female face as hero media (reads as a portrait of her
  without consent).
- Colons, semicolons, or em dashes in visible copy. No career date ranges.
  The credential line is exact and immutable: "Emmy and Ambie Award-winning
  showrunner and executive producer."

## Open items, prioritized

1. Cover composition sign-off (see above). This is the blocker.
2. Which red is the brand: the site accent is now #E5300F but the Ghost Mode
   logo's dot (brand mark, ~/Desktop/Ghost Mode Brand and Logo/) is the old
   terracotta #B3543A. Her call; site works either way meanwhile.
3. Licensed display font: `HeroDisplay`/`HeroDisplayItalic` @font-face slots
   exist in index.css, loading from /public/fonts/, currently falling back to
   Georgia (which she rejected by name). Bodoni Moda still sets headlines and
   she has flagged it as half the AI fingerprint. A real foundry face,
   rolled through the cover and chapter headers, is the biggest single
   remaining upgrade.
4. From the saved critique (.impeccable/critique/2026-08-30T00-00-23Z__…):
   cover nav pressability cue, progress-chip desync after jumps, the empty
   full-viewport poppy band mid-Scamfluencers on mobile, Labs chapter buried
   at 47% scroll depth for a 90-second exec.
5. An idea she liked that was never executed well: one continuous thin
   hand-drawn line forming a profile (Hitchcock-title-card register) over the
   untouched cover, drawing itself on load, breaking where the name crosses.
   Machinery exists in `components/hero/SketchLineOverlay.tsx` (line-a/b/c);
   the failure was drawing quality, not concept. Her own pen line, traced,
   was the agreed best path.

## Practical notes

- Media rule: never commit video to the repo. Video lives on the GCS bucket
  `jeanine-portfolio-video` (no CORS headers — canvas work on that footage
  must be write-only). Images are committed (posters in /public).
- PRODUCT.md in this repo holds product truth and binding constraints;
  .impeccable/ holds critique history including pre-session ones from her
  earlier designer, which are worth reading for the standard the site is
  held to.
- The About colophon is the most template-looking screen left (cream +
  serif + warm accent survived there); a candidate for the next pass after
  the cover.
