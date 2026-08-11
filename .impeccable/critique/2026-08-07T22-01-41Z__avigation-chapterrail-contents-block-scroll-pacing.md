---
target: Spine navigation (ChapterRail + Contents block) and long-scroll pacing
total_score: 18
max_score: 32
na_heuristics: 7,10
p0_count: 2
p1_count: 1
timestamp: 2026-08-07T22-01-41Z
slug: avigation-chapterrail-contents-block-scroll-pacing
---
Method: dual-agent (A: ae36c2e38298d8d5e · B: a899e4686a3c11f76)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 2 | Rail shows which of 3 chapters you're in, then freezes for the whole chapter, ~10 viewport-heights in Productions, ~16.5 in Labs (measured), with zero sub-position feedback |
| 2 | Match Between System & Real World | 3 | "Contents" as a post-cover magazine beat is an apt, well-chosen metaphor |
| 3 | User Control and Freedom | 1 | No URL/history sync to scroll position; mobile's nav control can't reach another chapter at all |
| 4 | Consistency and Standards | 2 | The same 3 destinations render twice, simultaneously, with mismatched copy, confirmed live: rail bolds "02 GHOST MODE," Contents says "02 Ghost Mode Labs" |
| 5 | Error Prevention | 3 | Low error surface generally; nothing destructive to prevent |
| 6 | Recognition Rather Than Recall | 2 | Active-chapter bolding aids recognition; nothing shows how many entries remain in a chapter |
| 7 | Flexibility and Efficiency of Use | n/a | Linear editorial read; no power-user shortcut is meaningfully applicable to an Experience-mode showcase |
| 8 | Aesthetic and Minimalist Design | 3 | The rail itself is restrained and well-built; the rail+Contents pairing is conceptually redundant despite each piece's own restraint |
| 9 | Help Recognize/Diagnose/Recover from Errors | 2 | Mobile's single-target chip is a soft dead end, no path back to a different chapter without a full manual scroll |
| 10 | Help and Documentation | n/a | Not applicable to an experience-mode showcase |
| **Total** | | **18/32** | **Acceptable (56%)** |

## Design Specificity Verdict

**LLM assessment:** The individual pieces are genuinely authored for this site's specific problem: a mix-blend rail built to survive seven saturated Productions fields plus a dark Labs ground plus paper, and a `ColorBridge` that solves real scroll-pacing math with a pinned-gradient approach, not a flat interpolated color. But the navigation *system* connecting them, a fixed vertical link-list rail plus a one-time, larger vertical link-list "Contents" block, both showing the same 3 items, is the generic long-form-site default (sidebar rail + in-page TOC), not something built for this specific "one continuous publication" premise. The parts are bespoke; the architecture joining them isn't.

**Deterministic scan:** Zero findings (`detect.mjs --json` against `SpinePreviewPage.tsx`, `ProductionsPreviewPage.tsx`, `LabsPreviewPage.tsx`, `components/chapter/`, confirmed clean with and without config). This doesn't contradict the LLM finding above: the detector targets visual/pattern-level anti-slop signatures (glassmorphism, neon glows, generic gradients), not information-architecture redundancy, so a clean scan and a "generic nav architecture" verdict are both true at once. No false positives to report since there were no findings.

**Visual overlays:** No script-injection overlay was attempted this run (by design, to keep Assessment B to read-only DOM evidence); no user-visible overlay is available in a browser tab. In its place: direct `getComputedStyle`/`getBoundingClientRect` measurements and a real keyboard tab-order walk, which independently confirmed the rail is genuinely `position: fixed` with `mix-blend-mode: difference`, that it visibly inverts correctly across five different backgrounds sampled (white-on-dark hero, dark-on-cream Contents, dimmer olive-on-terra mid-Productions, white mid-ColorBridge, dim terra-on-black in Labs), and that the mobile variant is a single current-chapter chip, not a 3-link menu.

## Overall Impression

The wayfinding pieces are each well-built in isolation and badly integrated as a system. The rail solves a hard rendering problem correctly; the Contents block is a nice editorial beat; neither one currently knows the other exists, so they show up together, at the same size of information, with different words for the same chapter. Layered on top of a genuinely long document, roughly 31 screens at desktop width, 25 at mobile, the site never tells a reader partway through Productions or Labs how much further there is to go, and a reader who leaves and comes back starts over at the Cover every time. The single biggest opportunity: this doesn't need a different navigation pattern, the straight scroll and the ColorBridge pacing device are the right call for a linear, credibility-first argument, it needs the wayfinding brought up to the length it now spans, and the one redundant duplicate removed.

## What's Working

- **`ColorBridge.tsx`**: a real vertical gradient pinned to both neighboring colors with only the scroll-driven midpoint moving, so seams match at every scroll offset instead of the flat-slab/hard-seam problem an earlier version had. Confirmed live across the Productions-to-Labs transition; this is the one piece of genuinely sophisticated scroll pacing already in place, and it holds up.
- **The rail's `mix-blend-mode: difference` strategy**: a legitimate answer to staying legible over seven saturated fields, a dark chapter, and paper, without falling back to a pill/glass affordance. Confirmed via direct `getComputedStyle` and five real screenshots across different backgrounds, it does actually invert correctly everywhere, though it dims noticeably against mid-saturation fields.
- **Focus-managed skip links**: `skipToSection` moves DOM focus, not just scroll position, confirmed in the live tab-order walk (positions 1-3, hidden until focused). Most long-scroll sites get this wrong and leave keyboard tab order stranded at the top; this one doesn't.

## Priority Issues

**[P0] The rail and the Contents block are the same navigation shown twice, and a keyboard user meets the duplicate before the original.** Confirmed live at 1440px: scrolled to Contents, the fixed rail (top-right, small caps, bold "02 GHOST MODE") and the Contents list (large serif, left, "02 Ghost Mode Labs") both show simultaneously, with mismatched copy. Keyboard evidence makes it worse: tabbing from page load reaches the rail's three chapter buttons (positions 4-6) *before* the Hero's own mute button and before Contents' visually-first, identically-purposed buttons (positions 9-11), so a keyboard visitor is offered the same three destinations under two different accessible names before reading a word of the page. Why it matters: this is a first-impression credibility hit for a site whose whole premise is "one authored publication," and it's a real WCAG 4.1.2/consistency problem, not just a visual quibble. Fix: give each component one job, either fade the rail out while Contents is in view and back in once past it, or make Contents do something the rail structurally can't (teasers, pull-stats), and unify the label text either way. Suggested command: `/impeccable distill`

**[P0] Mobile has no way to reach a different chapter.** The mobile-only chip calls `scrollToSection(active.id)`, jumping to the top of the chapter you're already in; confirmed live, it renders as a single current-chapter indicator, not a menu. There is no mobile equivalent of the desktop rail's 3-link jump list. Why it matters: mobile is the likeliest first-touch surface for a shared portfolio link, and it's exactly where "persistent nav" degrades to non-functional for its one job. Fix: make the chip open the 3-item list on tap. Suggested command: `/impeccable adapt`

**[P1] No sub-chapter position feedback across a ~31-screen document.** Measured live: 27,829px / ≈30.9 viewport-heights at 1440px (25.2 at 375px) from top to About; Productions spans ≈10 viewport-heights for 7 spreads, Labs ≈16.5 for 9 entries, and the rail is static across all of it. Why it matters: a reader partway through either chapter has no way to know how much further there is, which is the likeliest place scroll fatigue sets in on a piece this long. Fix: something as cheap as appending live entry count to the active rail label ("02 Ghost Mode · 4/9"), the index data already exists per entry. Suggested command: `/impeccable shape`

**[P2] Scroll position never syncs to the URL.** `scrollToSection` only calls `scrollIntoView`, never `navigate()`, even though `/preview/spine/:chapter` already exists and is read on mount. Why it matters: back/forward does nothing between chapters, and reload or a shared link always drops a visitor at the Cover, discarding their place in a 31-screen document. Fix: `history.replaceState` the chapter as `activeId` changes. Suggested command: `/impeccable harden`

**[P3] No `forced-colors` fallback for the mix-blend rail.** Only `prefers-reduced-motion` is handled in `index.css`; a Windows High Contrast / forced-colors user gets the blend mode stripped with no fallback color declared. Why it matters: the rail can go invisible for exactly the user who needs a legible nav most. Fix: declare an explicit fallback color under a `forced-colors: active` media query. Suggested command: `/impeccable audit`

## Persona Red Flags

**Casey (distracted mobile):** three entries into Labs, wants to jump ahead to About to check credentials. Taps the top-right chip, which looks exactly like something that should open a chapter picker, and nothing happens except a scroll to the top of the chapter she's already in. Stuck between "keep scrolling past everything" and "scroll all the way back up." Likely abandons.

**Riley (stress-tester):** clicks "02 Ghost Mode" in the rail mid-read, doesn't like it, hits browser Back expecting to return to her spot in Productions, nothing happens, confirmed `scrollIntoView` never touches history. Reloads mid-Labs to check if her place persisted (it doesn't); lands back at the Cover.

**Sam (accessibility-dependent):** skip links work correctly, a real, confirmed strength. The gap is a forced-colors/high-contrast user: the rail's only rendering strategy is `mix-blend-mode: difference`, which forced-colors mode overrides with no declared fallback, the rail can go invisible for exactly the user who needs a legible nav most.

## Minor Observations

- Labs entries render their own `L-0x` index label that, at certain scroll offsets, sits visually adjacent to the fixed rail's active label, coincidental, not a real sub-position indicator, but easy to mistake for one and worth resolving alongside the P1 fix above.
- The fixed `MotionToggle` ("Pause motion," bottom-left) and video caption/overlay text collided in one mobile screenshot, worth a z-index/placement check alongside any rail changes, since both are part of the same always-on overlay cluster.

## Questions to Consider

- If the rail's whole reason for existing is "always know which of 3 chapters you're in," is that worth a permanent fixed element for a *linear* scroll where the answer is almost always inferable from what's on screen, or is it solving a problem multi-page sites have that this one-page structure doesn't?
- The Contents block reads as a courtesy nod to "portfolios have navigation" rather than a device this specific publication needed. What would it look like if it did something only a magazine contents page can do (teaser imagery, pull-stats) instead of duplicating the rail's job at a bigger font size?
- Is 9 flat entries in Labs, even tiered, the right unit size for a no-progress-indicator scroll, would splitting the "Shorts" tier into its own sub-scroll reduce the unmeasured middle stretch instead of asking pacing tricks alone to carry the load?
