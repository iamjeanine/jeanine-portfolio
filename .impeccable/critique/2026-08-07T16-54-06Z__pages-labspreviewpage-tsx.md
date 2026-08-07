---
target: pages/LabsPreviewPage.tsx
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
timestamp: 2026-08-07T16-54-06Z
slug: pages-labspreviewpage-tsx
---
Method: dual-agent (A: a6b1b0f9ae7e79e84 · B: af2ec3854c2d6a1c0)

## Design Health Score

Two heuristics (7, 10) are n/a for a portfolio/experience surface. Applicable max = 32.

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2/4 | No progress/position indicator across a 15,382px scroll; measured CLS 0.52 from unpinned video aspect ratios resolving mid-scroll |
| 2 | Match Between System and Real World | 4/4 | The screening-room metaphor is executed at every layer: ProjectorLight brightens like a projector warming up, Concept/Build/Status reads like an actual creative process |
| 3 | User Control and Freedom | 2/4 | No in-page wayfinding across 9 entries; LazyVideo has no play/pause control |
| 4 | Consistency and Standards | 2/4 | Multiverse Quad's cover shows a "WONDERY / THE LAST CITY" title card under an "Amazon AGI" eyebrow; MythOS's cover opened on its own gold wordmark despite a code comment saying that was fixed |
| 5 | Error Prevention | 3/4 | LazyVideo's onError swaps a broken video for a legible placeholder instead of an invisible black box |
| 6 | Recognition Rather Than Recall | 2/4 | Index numbers (L-01...L-09) exist but no cumulative "you are here" marker over a long scroll |
| 7 | Flexibility and Efficiency | n/a | No repeat-task/expert-path need in a linear portfolio scroll |
| 8 | Aesthetic and Minimalist Design | 3/4 | Ink-black ground / ember accent / oversized Bodoni reads premium; non-flipped Feature entries leave empty space in the right half below the video at 1440px |
| 9 | Help Recognize/Diagnose/Recover from Errors | 3/4 | Same video-fallback mechanism as #5, handled clearly |
| 10 | Help and Documentation | n/a | Not applicable to a portfolio scroll |

**Total: 21/32** (Acceptable band, ~66%)

## Design Specificity Verdict

**LLM assessment**: Authored, not templated. Copy is dense with unfakeable specifics (582 recurring overlaps across 6,884 accounts, 46 cultures across 3,500 years, 494 source stories, named tools and collaborators, a correctly-used Saidiya Hartman citation). The "Status" label over a more impressive-sounding "Signal" is a deliberate, self-aware restraint a generic portfolio generator would never produce. Two cracks undercut the claim on close inspection: the Multiverse Quad cover foregrounds a competing Wondery wordmark, and the MythOS cover (swapped specifically to fix a wordmark problem) still opens on its own wordmark for its first ~3.5 seconds.

**Deterministic scan**: `detect.mjs --json` returned `[]` (0 findings) on `pages/LabsPreviewPage.tsx` and `components/chapter/*.tsx`. The live browser detector (a separate, injected tool) flagged 10 anti-pattern instances: `radial-spotlight-glow` (6 instances, the ProjectorLight component), `all-caps-body` (3 instances, the eyebrow/tagline/label text), `cream-palette` (1, the site's core background), `gradient-text` (1, on `body`).

Cross-checked all four against the source: `radial-spotlight-glow` is REDESIGN-PLAN.md 5.3's mandated signature moment (peak opacity 0.07, positioned behind the frame, not a box-shadow) — a false positive relative to this design's explicit brief, now dispositioned with an inline ignore comment. `all-caps-body` matches the site's established eyebrow/label typographic convention used consistently since Phase 0, not stray body text — false positive. `cream-palette` is the plan's core "paper" token, foundational to the whole design system, not the generic-AI-slop pattern the rule targets — false positive. `gradient-text` on `body` could not be reproduced: a full-codebase grep for `background-clip`, `backgroundClip`, `bg-clip`, and `text-transparent` across every file in the chapter system returned zero matches — false positive with no plausible source element.

## Overall Impression

The chapter's specificity and restraint are real and rare; the mechanics that were supposed to prove it (the wordmark swap, the aspect-native video treatment) had gaps that only surfaced under actual measurement, not code review. Both have since been fixed.

## What's Working

1. The projector-light and color-bridge scroll mechanics are restrained, on-theme, and technically clean: CSS custom properties via rAF-throttled scroll listeners, a "peak tracks itself" rule so scrolling back up never dims a lit screening, full reduced-motion fallbacks.
2. The in-development entry's honesty: Visual Audiobooks gets a real cover, an explicit "Coming soon" tag, and deliberately no fabricated description or stat.
3. Verified-only stats: Narrative Space and Unstill simply omit the stat slot rather than inventing a number.

## Priority Issues (as found; fix status noted)

- **[P1] Cover video contradicts its own eyebrow attribution.** Multiverse Quad's eyebrow reads "Amazon AGI" but its cover video is literally The Last City's Wondery key art with an audio waveform overlay. **Not fixed**: no alternate asset exists in the project, and re-editing video is outside this session's scope (media pipeline is Jeanine's per the project's hard constraints). Flagged for her call.
- **[P1] Real, measured layout shift while scrolling.** CLS 0.52 (Core Web Vitals "poor" is >0.25), traced to LazyVideo instances without a pinned `aspectRatio` reflowing once real video metadata loads. **Fixed**: measured true dimensions for all 9 videos; 3 (Narrative Space 1850x1080, Unstill 480x320, AI Creator Lab 1920x946) genuinely differ from the 16:9 default and now pin their real ratio up front.
- **[P1] Duplicate wordmark the code claimed was fixed.** The MythOS replacement cover also opens on a gold "MythOS / Original Signal" title card for ~3.5s. **Fixed**: added `startAt` support to LazyVideo (a clean-segment playback offset per plan 5.4, no media re-encoding) and start MythOS at t=4, confirmed via frame capture to be past the card and into the actual globe demo.
- **[P2] Undersized primary CTA on mobile.** "Open project" measured 25.4px tall. **Fixed**: increased `.lab-open` padding; now measures 58px.
- **[P2] No wayfinding across a 15,000+px linear scroll.** Confirmed on the standalone `/preview/labs` route, which was never intended to carry the chapter rail; the Spine (built in Phase 1) already solves this exactly via ChapterRail when Labs is viewed in its intended stitched context. **Not fixed on the standalone page** — by design, not oversight.

## Persona Red Flags

**Sam (accessibility-dependent)**: Keyboard tab order is correct and linear with real focus-visible rings (verified live: 2px solid ember, 2px offset). No control anywhere to pause the autoplaying, looping videos — a WCAG 2.2.2 gap for anyone who hasn't set OS-level reduced motion. Not fixed this pass; noted for a future accessibility sweep.

**Riley (stress tester)**: Confirmed and quantified the CLS issue via direct instrumentation. Confirmed the Wondery/Amazon AGI branding mismatch by cross-checking eyebrow copy against cover art. No horizontal overflow found at 375px under a hard resize.

## Minor Observations

- Stat block present on 4 of 6 Features, absent on 2 — an intentional "verified numbers only" policy that a careful visitor may notice without the reasoning being visible.
- The expandable marker's 45-degree rotation on open is a nice, confirmed-working detail.
- Divider borders sit at 16% opacity (1.49:1 contrast) — fine since decorative-only, but would fail if ever asked to double as a functional divider.
- No chapter-specific `<title>` if this route is ever shared as a direct link.

## Questions to Consider

1. If the Screening Room metaphor's most literal expression is a projector's light and picture, does the one entry that shows a competitor's logo on screen (Wondery, on the Amazon AGI pitch) undercut it more than any layout issue would?
2. The chapter is built on restraint — no fabricated stats, an honest "Coming soon" — so is handing the visitor zero control over autoplaying video the one place that restraint doesn't reach?
