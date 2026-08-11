---
target: Cover options A and B (pages/CoverOptionsPreviewPage.tsx)
total_score: 15
max_score: 24
na_heuristics: 1,5,7,9,10
p0_count: 2
p1_count: 1
timestamp: 2026-08-07T23-15-16Z
slug: options-a-and-b-pages-coveroptionspreviewpage-tsx
---
Method: dual-agent (A: ac12c9b142054d882 · B: ab29551a3b8185309)

## Design Health Score

| # | Heuristic | Option A | Option B | Note |
|---|---|---|---|---|
| 1 | Visibility of System Status | n/a | n/a | Static cover, no system state to reflect |
| 2 | Match Between System & Real World | 4 | 3 | B's real key art is truer to her world, but face-proximity crowding costs it a point |
| 3 | User Control and Freedom | 3 | 3 | Both scroll freely, neither traps a path |
| 4 | Consistency and Standards | 3 | 2 | Both break their own type scale by giving the credential line the tagline's tier |
| 5 | Error Prevention | n/a | n/a | No input, nothing to prevent |
| 6 | Recognition Rather Than Recall | 4 | 3 | Contents list works in both; B's competes briefly with the smoke plume |
| 7 | Flexibility and Efficiency of Use | n/a | n/a | Not applicable to a cover surface |
| 8 | Aesthetic and Minimalist Design | 3 | 2 | A is clean by construction; B's face/name proximity adds noise the design didn't intend |
| 9 | Help Recognize/Diagnose/Recover from Errors | n/a | n/a | No error states possible |
| 10 | Help and Documentation | n/a | n/a | Not applicable to a cover surface |
| **Total (applicable max 24)** | | **17/24 (71%)** | **13/24 (54%)** | |

## Design Specificity Verdict

**LLM assessment:** Option A ties its color field to `TERRA_FIELD`, the literal gradient Scamfluencers opens on, reused verbatim rather than picked to match, an authored decision, not a template one. Option B uses real, cleared key art from a show she created and pitched, the strongest specificity claim of the two, though the *composition pattern* (dark vertical scrim, name bottom-left, contents bottom-right) is the most common cinematic-portfolio template on the web. The specificity in B lives entirely in the asset; in A it lives in the color logic.

**Deterministic scan:** Zero findings (`detect.mjs --json`, clean, exit 0). This is a coverage limit, not a clean bill of health: the scanner pattern-matches source text and cannot see computed runtime state, so it could not have caught either of the two real defects below, both of which only exist in the rendered DOM (a `clamp()` font size, a square image under `object-cover`, a Tailwind `mt-1` resolving to 4px). No false positives, since there was nothing to evaluate.

**Visual overlays:** No injected overlay; Assessment B substituted real DOM measurement (`getBoundingClientRect`, `getComputedStyle`) and a canvas-based background reconstruction to compute actual contrast at the exact pixel position each line renders, rather than assuming the CSS gradient math. That harder measurement is what resolved a real disagreement below.

## Overall Impression

Both options are stronger than the current AI-video hero, and Option A specifically fixes the "three moods before the first spread" problem Jeanine flagged. But her two complaints are both real, both measured, and both fixable without rebuilding either concept: Option B's face sits close enough to her own name to compete with it for the reader's eye, at every viewport width tested, not just desktop as first assumed; and in both options, the single highest-value credibility claim on the page (a real Emmy and a real Ambie) is dressed identically to a plain descriptive line beneath it, down to the exact same color and opacity. Neither is a concept-level problem. Both are typographic and compositional execution gaps in an otherwise sound direction.

## What's Working

- **Option A's color continuity**: the cover and the first Productions spread share one field, so the opening reads as one gesture instead of three. This is the specific problem the whole exercise was commissioned to fix, and A fixes it completely.
- **Option B's asset legitimacy**: real, cleared, cinematic work that is unmistakably hers, not stock photography and not the AI hero it's replacing.
- **Option B's scrim engineering**: computed against a worst-case bright/pale-text pairing (0.86 opacity stop, not eyeballed), and re-verified live here: measured contrast at the actual credential line's pixel position is 11.2:1 at 1440px and 13.1:1 at 375px, both far past the 4.5:1 floor. Legibility is not in question, only hierarchy.
- **Focus-managed structure carried over**: both options reuse the site's existing chapter-label kicker and Contents pattern rather than inventing new chrome.

## Priority Issues

**[P0] Option B: the figure's face sits close enough to "Cornillot" to compete with it, at every viewport tested, not only desktop.** Assessment A measured 1280×800: face vertical center at y≈430, chin at y≈482, falling inside the name heading's own text box (top 439–577px), horizontal clearance to the last letter of "Cornillot" only ~20px. Assessment B, working independently at 1440×900, corroborated this closely (face center ≈x460,y430, sitting essentially at the top edge of the name heading's bounding box, top=467.3). Assessment A's initial read was that mobile "does not have this problem," but Assessment B's harder measurement contradicts that: at 375×812 the source image's square aspect crops horizontally rather than vertically, and the face lands at roughly x=60-90, y=350-380, directly adjacent to the "J" of "Jeanine" (name box top=380, left=24), a *tighter* margin than desktop, not a looser one. Treat this as a defect at every breakpoint, not a desktop-only one. Fix: re-crop the source art so the figure sits right-of-center with headroom above (durable fix, removes dependence on live crop math against a square asset); `object-position` adjustment as an immediate lever (`pages/CoverOptionsPreviewPage.tsx:154`); cap the name column's max-width so it can't extend into the figure regardless of viewport. Suggested command: `/impeccable layout`

**[P0] Both options: "Emmy and Ambie Award-winning showrunner" is typographically identical to the tagline beneath it.** Confirmed by exact computed-style measurement, not estimated: in both A and B, at both 1440px and 375px, the credential line and "Podcasts, television, and Ghost Mode Labs" share the same font, the same font-size (18.4px desktop / 16px mobile), the same weight (400), and the *same computed color value down to the alpha channel* (`rgba(252,245,236,0.85)` in A, `rgba(247,243,234,0.88)` in B, identical between the two lines in each option), separated by a 4px gap that welds them into one paragraph. A verifiable Emmy and Ambie are the single highest-value credibility signal on the page, and they currently read as flavor text. This is not a contrast problem (measured 5.3:1 in A, 11-13:1 in B, both comfortably clear), it is purely a missing hierarchy tier. Fix: give the credential line its own visual tier, larger size (1.35–1.5rem vs. keeping the tagline at 1rem) and/or a weight or family shift (Uncut Sans 700 against the display serif name is a standard masthead contrast move); recolor it to the accent already used for the kicker/Contents index instead of matching the tagline; widen the gap from 4px (`mt-1`) to 12–16px so the two lines read as separate statements. Suggested command: `/impeccable typeset`

**[P1] Option B's crop is breakpoint-fragile by construction.** The source is a square 1254×1254px asset under `object-cover` with no `object-position` override, so the visible crop window changes shape (vertical trim at wide viewports, horizontal trim at narrow ones) depending on container aspect ratio alone. Any one-off `object-position` fix needs verification at 3-4 breakpoints, not just the width it was tuned against, since the mobile case above shows the fragility can flip which direction is worse. Suggested command: `/impeccable adapt`

**[P2] Option A's kicker accent (`#F0FF29`, electric chartreuse-yellow) is a cool-temperature color against a warm terra/rust field.** Legible and high-contrast, but the temperature clash reads closer to a tech-demo accent than an editorial one. Worth testing a warmer accent, cream or the ember `#E8A672` already established in Option B and the Labs chapter, for tonal consistency. Suggested command: `/impeccable polish`

**[P3] In both options, the Contents list (secondary navigation) renders larger (1.35–1.6rem) than the tagline (1rem) it sits beside**, despite carrying less informational weight, a minor internal hierarchy inversion worth revisiting once the credential-line fix above is in place and the type scale is being touched anyway. Suggested command: `/impeccable typeset`

## Persona Red Flags

**Jordan (confused first-timer):** lands on the cover, reads the name, then the two body lines in one breath since they're visually identical, an Emmy and an Ambie included among them with no more weight than a job description. Never registers that a specific, verifiable, high-value credential just went by. The one piece of information a hiring manager or commissioner most needs to see first is the one currently easiest to miss.

**Riley (stress-tester):** resizes the window through a few common widths and watches Option B's face-to-name relationship change shape entirely, tight at 1280-1440px, tighter still at 375px, comfortable nowhere that was actually tested before shipping. Confirms this is a systemic crop-math issue, not a one-viewport fluke.

**Casey (distracted mobile):** on a phone, which is the likeliest first-touch surface for a shared portfolio link, Option B's face sits directly beside the first letter of her own name, the single worst-measured instance of the face/name proximity problem across every viewport checked.

## Minor Observations

- On the comparison page only (not a defect in either real cover): the sticky "OPTION A" and "OPTION B" label bars are both `position: sticky; top: 0`, and briefly overlap each other during the scroll transition between sections. Cosmetic, prototype-only, worth knowing about before judging screenshots taken mid-scroll.
- In Option B, the dome's smoke plume rises directly behind the Contents list's screen position; the scrim keeps it legible, but it's a busier backdrop for navigation text than the rest of the frame.
- `.chapter-label` (used for "SELECTED WORK" and the Contents indices) has no explicit font-weight; if the credential-line fix above ends up reusing this token's accent color, confirm the two don't end up visually identical to each other by accident.

## Questions to Consider

- If the credential line is the most persuasive claim on the page, should it outrank the tagline in position, not just weight, sitting directly under the name with the Ghost Mode Labs line demoted further down?
- Option B's argument is "real work over a generic AI hero." Does a frame that includes a stranger's face make that argument better than a frame of the same key art cropped to the dome and the smoke alone, keeping the proof of real, cleared, cinematic work without ever risking a face/name collision?
- The face-position problem is a byproduct of a square source asset; since that same file may get reused elsewhere in the site, is it worth requesting a proper wide crop of this key art now rather than patching `object-position` per breakpoint later?
