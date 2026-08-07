---
target: "Ghost Mode Labs chapter prototype (/#/preview/labs)"
total_score: 18
max_score: 28
na_heuristics: 7,9,10
p0_count: 2
p1_count: 2
timestamp: 2026-08-07T13-41-46Z
slug: pages-labspreviewpage-tsx
---
Method: dual-agent (A: a5a3847ee13cb29c0 · B: adf68cc1188a4a8b0)

# Critique: Ghost Mode Labs chapter prototype (pages/LabsPreviewPage.tsx, /#/preview/labs)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No progress cue in long single-hue chapter; video load state invisible against black |
| 2 | Match System / Real World | 3 | Copy concrete and true; "Open project" clear |
| 3 | User Control and Freedom | 2 | No jump links or way back except tiny coda link; About coda is a dead end |
| 4 | Consistency and Standards | 2 | Internally consistent but diverges from Productions (expandables, CTA style) and site hue family |
| 5 | Error Prevention | 3 | Video failure has no visible fallback (black box on black ground) |
| 6 | Recognition Rather Than Recall | 3 | L-01..L-09 index helps |
| 7 | Flexibility and Efficiency | n/a | Linear portfolio scroll, no power paths needed |
| 8 | Aesthetic and Minimalist Design | 3 | Minimal by intent; mint glow is the one cliche flourish |
| 9 | Error Recovery | n/a | No error-prone actions |
| 10 | Help and Documentation | n/a | Not applicable to portfolio surface |
| **Total** | | **18/28 (64%)** | **Acceptable** |

## Design Specificity Verdict
Copy: authored, specific, fact-dense (7,000 voices; 582 overlaps across 6,884 accounts; 46 cultures across 3,500 years). Shell: generic. Near-black #0A0A0C + spectral mint #9BE8D2 + soft cyan glow is the stock "AI-builder dark portfolio" template. Detector agrees: dark-glow x7 on the video containers is its top Labs finding. Strip the copy and this could be anyone's AI case-study page; nothing in the shell rhymes with the site's warm identity (cream #F5F2EC, ink #150E0A, terra #B3543A).

Deterministic scan: static scan of 6 files = 0 findings. Live-page scan: Labs 13 findings (dark-glow x7 real, all-caps-body x3 on eyebrow labels, rest false positives on body element); Productions 27 findings (real: #FAEFE2 ink on #CC5D24 at 3.6:1 x5, #F0FF29 accent at 3.7:1 known, #C2201F on #DBDFE2 4.45:1 near miss, neon accents #00F5D4/#E85FD1 flagged as AI palette, 10.4px font-switcher pills; false: body gradient-text/glow misattribution, toast-caused overflow). App itself has zero horizontal overflow at 375px. Labs core contrast is excellent: 16.94:1 ink, 14.0:1 accent. Prototype header chrome fails AA (brand 4.10:1, PROTOTYPE label 2.09:1).

## Priority Issues

**[P0] Cool black ground + cool mint accent breaks the site's warm hue family.**
Why: every other surface is warm (#F5F2EC cream, #150E0A ink, #B3543A terra). #0A0A0C is a cool blue-black; #9BE8D2 is ~170deg mint. The bridge can animate between palettes but cannot make them feel related once inside. This is the root of "I don't know if I like the black."
Fix: warm ink-black ground (~#120C08, the site's own ink darkened, oklch hue ~55deg) so Labs reads as "standing inside the site's ink." Swap mint for a terra-lit ember accent (~#E8A672 family). Chapters become: terra on cream (home), key-art colors (Productions, deliberately diegetic), terra's dark sibling on warm black (Labs).
Suggested command: /impeccable colorize

**[P0] Chapter leads with a "Coming soon" placeholder.**
Why: L-01 Visual Audiobooks has no open link and nothing to show; primacy is wasted on the weakest entry in a chapter whose job is proving built work.
Fix: lead with Static or Multiverse Quad; move Visual Audiobooks later.
Suggested command: /impeccable layout

**[P1] Monotony across 9 uniform entries on one unchanging hue.**
Why: identical template + 224px black gaps + no positional cues = infinite-feed feeling by entry 6; Productions gets free positional memory from color, Labs replaced it with nothing.
Fix: scale hierarchy (flagships larger), grouping cue between Labs originals and Wondery/Amazon client work, or a quiet progress indicator.
Suggested command: /impeccable layout

**[P1] LightsDown bridge too short for the largest lightness swing on the site.**
Why: cream (~96 L) to near-black (~2 L) in 18-26vh reads as a hard cut, not lights-down; every Productions bridge carries a smaller jump over similar distance.
Fix: lengthen the cream-to-Labs bridge (~40vh) or stage a deliberate mid-dim stop.
Suggested command: /impeccable animate

**[P2] Mint glow box-shadow on every video frame.**
Why: zero-offset colored glow is the most recognizable stock dark-UI effect (detector: dark-glow x7); erodes specificity.
Fix: drop the colored bloom, keep the black depth shadow; if an accent glow survives, tie it to the new warm accent.
Suggested command: /impeccable polish

## Persona Red Flags
- Jordan (first-timer): mid-Reveal, entry titles render near-invisible on black; a mid-scroll first-timer can read the page as broken. No skeleton/cue that content is coming.
- Sam (keyboard/AT): no :focus-visible styles anywhere in the file; browser-default thin blue ring on near-black is low contrast. Videos have aria-labels but no captions (acceptable for muted cover art, confirm intent).
- Casey (mobile): portrait assets letterboxed inside forced 16:9 frames; black bars merge with black ground so media boundaries vanish at a glance.

## Minor Observations
- client field (Wondery / Amazon AGI / Ghost Mode Labs) is meaningful but visually inert in the eyebrow.
- "story systems · production tools · cultural experiments" duplicates the homepage filter taxonomy as dead text.
- "About follows" coda is not a link.
- LightsDown/ColorBridge is byte-duplicated across both prototype files; extract before it drifts.
- No video-failure fallback (black box indistinguishable from ground).
- Productions carry-over: #FAEFE2 on #CC5D24 3.6:1 body-ink failure is broader than the known chartreuse accent issue; H&C red 4.45:1 near miss.

## Questions to Consider
1. What if Labs is the opposite of Productions only in structure and pace, not in temperature: both chapters on warm grounds, differentiation from composition (color fields + expandables vs one dark ground + video minimalism)?
2. The site currently maps "story vs AI" onto "warm vs cold." Is that the intended metaphor, or does it imply the AI work is less hers?
3. Does Labs need its own accent at all, or does terra tuned for dark ground unify more than any transition engineering?
