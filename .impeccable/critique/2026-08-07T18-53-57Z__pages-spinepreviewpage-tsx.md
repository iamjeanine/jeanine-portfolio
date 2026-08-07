---
target: "full site spine (/#/preview/spine)"
total_score: 25
max_score: 36
na_heuristics: 10
p0_count: 2
p1_count: 2
timestamp: 2026-08-07T18-53-57Z
slug: pages-spinepreviewpage-tsx
---
Method: dual-agent (A: a099b9910b7451e6a · B: a4072c42818505656)

Final full-site critique for Phase 5, run against the whole spine
(`/#/preview/spine`, ~27,000px: Cover, Productions, Ghost Mode Labs,
About colophon, footer).

## Design Health Score

Heuristic 10 marked n/a (a linear editorial scroll needs no
documentation; the Cover's Contents block teaches the structure in the
first viewport). Applicable max = 36.

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2/4 | Rail measured 1.12:1 (invisible) and mislabeled the Cover as "01 Productions"; no progress indicator on 27,133px |
| 2 | Match System / Real World | 4/4 | The magazine metaphor is fully executed: eyebrows, indexes, oversized display titles, pull-stats, "Shorts", a real colophon |
| 3 | User Control and Freedom | 3/4 | Skip links, contents, rail, back-to-cover all present; rail sits at tab stops 4-6 and is unreachable mid-scroll |
| 4 | Consistency and Standards | 2/4 | Two h1s; chapter titles at the same outline level as the works inside them; every Labs entry has an outbound CTA, no Productions spread does |
| 5 | Error Prevention | 2/4 | Fixed controls measured 17px tall and overlapped disclosure rows on mobile, stealing taps intended for them |
| 6 | Recognition Rather Than Recall | 3/4 | Index numbers and eyebrows aid recognition; 39 disclosure rows share 6 labels with no open-state memory |
| 7 | Flexibility and Efficiency | 2/4 | Rail, contents, and deep routes exist, but no index and no way to see 16 credits without traversing ~30 viewports |
| 8 | Aesthetic and Minimalist Design | 4/4 | Genuinely excellent: Bodoni Moda / Source Serif 4, grain at 0.04-0.05, no cards, no icons. The Static frame on ink-black with the projector wash is museum-grade |
| 9 | Error Recovery | 3/4 | LazyVideo has a real considered failure state; "Coming soon" and "Details to come" are honest pending states |
| 10 | Help and Documentation | n/a | Not applicable to a linear editorial scroll |

**Total: 25/36** (69%, upper Acceptable band)

## Design Specificity Verdict

**LLM assessment**: Strongly authored, with a genericizable shell. Could
not survive a find-and-replace with another producer's name: palettes
are per-credit and traceable to real key art, the indexing grammar
splits (01-07 vs L-01 to L-09) because the career splits, and the design
admits gaps rather than filling them (no pull-stat where no honest
number exists, "Coming soon" instead of fabricated copy). Labs copy is
specific to the point of being unfakeable. What is genericizable: the
rail, the disclosure trio, and the "Open project" pattern; and the
project detail pages that CTA leads to are visibly from an older, more
generic system.

**Deterministic scan**: `detect.mjs --json` returned `[]` (exit 0) across
all three pages and all nine shared components, with a positive control
confirming the regex engine fires on .tsx. The live browser detector
reported 29-30 findings across four scroll positions. Dispositioned:
`radial-spotlight-glow` (6) is the plan's own mandated projector light;
`all-caps-body` (6) is the established eyebrow/label convention;
`cream-palette` (1) is the plan's core paper token; `ai-color-palette`
cyan/violet (10) resolves to the pre-existing Productions spread accents
the plan explicitly preserves in 6.5, though the mint `#00F5D4` on No
Passport Required does sit against 3.1's "no mint, no cyan" and is
flagged for Jeanine rather than changed. Three findings are measurable
false positives: `gradient-text` on body (a full-document sweep found 0
elements with background-clip:text, and the only source match is in an
unimported component), `dark-glow` attributed to body (computed
box-shadow is "none"; the real shadow is authored on img elements), and
`heading-rhythm`'s "(2 headings on page)" parenthetical (the DOM has 20).

## Overall Impression

The peaks are real and well placed, and the craft floor is high. Two
things held it back: a signature wayfinder that was invisible on roughly
40% of the scroll, and an ending that discards the advantage the peaks
earn. The first is fixed; the second needs Jeanine's voice.

## What's Working

1. The palette-from-key-art system, executed with real rigor: bridge
   endpoints are derived from the palette data so they cannot desync,
   and contrast repairs were computed rather than eyeballed.
2. The three-tier Labs system solves the monotony it was built for.
   Measured heading pitch confirms it: Features ~1,900px,
   in-development 878px, Shorts 692px.
3. Reduced motion is handled with unusual care, and verified: the
   toggle hides itself, bridges pin, projector lights settle, and
   videos hold on frame 0 rather than rendering nine black rectangles
   on a black ground.

## Priority Issues

- **[P0, FIXED] Desktop chapter rail invisible on ~40% of the scroll.**
  `mix-blend-mode: difference` sat on the buttons, but their
  position:fixed parent nav established a stacking context that
  isolated the blend group, so the inversion never happened and the
  buttons painted literal white. Measured 1.12:1 on paper from rendered
  pixels. Fixed by moving the blend to the fixed element itself; also
  raised inactive opacity from 0.55 to 0.66, since opacity scales the
  blend and 0.55 still landed at 3.66:1 against the palest field.
  Re-measured: 6.08:1 on cream, 17.78:1 on the Labs ground.
- **[P0, FIXED] Fixed controls too small and stealing mobile taps.**
  All measured 17px tall (WCAG 2.5.8 wants 24x24), and the mobile chip
  overlapped the "Build" disclosure row such that elementFromPoint
  returned the chip. Fixed: hit areas now 31px via padding with
  compensating negative margin, and the mobile chip moved from
  bottom-right to top-right, out of the thumb zone.
- **[P1, NEEDS JEANINE] The color continuum renders as flat slabs.**
  Every ColorBridge computes to a single background-color, not a
  gradient, so each bridge is one uniform color that changes with
  scroll; because t derives from viewport transit, both seams are
  visibly discontinuous for most of the bridge's travel, and under
  reduced motion all ten freeze mid-mix. A spatial
  `linear-gradient(180deg, from, to)` would make both seams match by
  construction. This is the site's stated signature move, so changing
  how it works is a design decision, not a repair.
- **[P1, NEEDS JEANINE] The ending discards the peak-end advantage.**
  The last 350px is empty cream; the final content is 11.2px uppercase
  "BACK TO COVER / LINKEDIN EMAIL". No name, no closing line, no
  readable email, no statement of availability. Needs her voice and her
  call on what to say about availability.
- **[P2, FIXED] Chapters not siblings semantically.** Two h1s, and
  chapter titles at the same outline level as the works inside them.
  Fixed: one h1 (cover name), three h2 (the chapters), 16 h3 (the
  works).

## Persona Red Flags

**Sam (accessibility-dependent)** was the worst-served visitor and is
now substantially better served. Fixed this pass: the three invisible
rail tab stops; every persistent control's target size; the
self-contradicting `aria-pressed` on the motion toggle (announced "Play
motion, pressed" while motion was stopped); the mobile chip's aria-label
claiming a chapter while on the Cover; and six of nine video alt strings
that were the title plus "cover video" for content that *is* the entry.
Still open: skip links are positioned at document top, so Shift-Tabbing
back to them from deep in the scroll focuses an offscreen element.

**Casey (distracted mobile)**: fixed the chip's thumb-zone overlap, the
17px targets, and the flagship credit rendering as "Scam-/fluencers"
with a visible hyphen (now a zero-width break, so the wordmark is not
falsely hyphenated). Also added loading="lazy" and decoding="async" to
the spread art, which included a 2.4MB and a 2.3MB PNG previously
fetched eagerly. Still open: no scroll progress indicator.

**Alex (impatient power user)**: 27,133px with three navigation targets
and no index; every fact behind one of 39 identically-labeled rows; the
one CTA leads out of the publication into an older visual system. All
structural, all Jeanine's call.

## Minor Observations

- 16px horizontal overflow at exactly 768px, root-caused to the
  colophon's 12-column grid (eleven 64px gutters inside a 608px content
  box). Fixed by moving the split to lg and tightening col-start from 8
  to 7, which also closed a ~350px void between bio and lists.
  Re-verified zero overflow at 375/640/768/800/1024/1280/1440/1920.
- CLS measured 0.0065 across a full scripted scroll, down from the 0.52
  the Phase 2 critique measured; the aspect-ratio pinning work holds.
- Lazy media confirmed: 1 video mounted at page top, 10 after scrolling
  the full 27,133px.
- Console clean: 0 errors, 0 warnings.
- 61 focusable elements, all reached by sequential Tab, zero traps, and
  zero with a missing focus indicator while matching :focus-visible.
- No duplicate element IDs.
- Award sentences appear verbatim in three places (Impact expandable,
  colophon Awards, project detail page).
- "7,000 voices" rounds "6,884 accounts," which appears three lines
  above it in the same column.
- Dying for Sex states its own name four times in one spread and claims
  its awards three times before the Impact row says it a fourth; its art
  carries borrowed laurel and Peabody graphics that fight her own
  typography. `tlc-notext.png` proves wordmark-free art already exists.
- "Pause motion" governs LazyVideo only: the bridges, the Reveal fades,
  the projector lights, and the Hollywood & Crime spread video all run
  outside the motion store.
- Labs is 14,536px against Productions' 9,676px, so the newest work
  occupies 1.5x the chapter holding the Emmy, Ambies, Peabody adaptation
  and 53M downloads.

## Questions to Consider

1. If the Screening Room metaphor's most literal expression is a
   projector's picture, does the Multiverse Quad entry showing a
   competitor's Wondery logo undercut it more than any layout issue?
2. Every Labs entry ends with "Open project" into a page set in a
   different typeface. If this is one publication, why does its only
   call to action lead out of it?
3. Labs at 1.5x Productions: has the newest, most fun work quietly
   colonized the publication, given the goal is showrunning work?
