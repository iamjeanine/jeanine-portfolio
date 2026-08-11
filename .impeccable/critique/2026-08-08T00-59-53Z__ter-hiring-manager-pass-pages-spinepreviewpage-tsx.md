---
target: "Spine scroll fatigue: recruiter/hiring-manager pass"
total_score: 0
max_score: 0
na_heuristics: persona/task critique, heuristics not scored
p0_count: 1
p1_count: 2
timestamp: 2026-08-08T00-59-53Z
slug: ter-hiring-manager-pass-pages-spinepreviewpage-tsx
---
Method: dual-agent (A: ab75e9aecbaa266ed · B: a9ddebc7972ac726a)

## The question this critique answers

Jeanine's worry, verbatim: "I just worry that people will get very tired of these big poster-like layouts. Just like you're scrolling forever. But the old one didn't feel that way." Reviewed through the lens she chose: how a potential employer views this portfolio.

## Direct answer

**The fatigue risk is real, but it is not where she thinks it is.** The Productions poster spreads are the fast, skimmable half: ~1.2 viewport-heights each, a new color world per credit, titles that read at flick speed. The real fatigue is concentrated in Ghost Mode Labs, which is 16.15 of the page's 30.49 viewport-heights (measured, settled, at 1440x900): Feature entries run ~2 viewport-heights each on one unchanging dark ground with an identical template, and attention flags specifically at L-04 through L-07, four consecutive same-template entries, ~8 viewport-heights of structural sameness, sitting directly in front of AI Creator Lab, the single best employer-facing AI credential on the site (24 viewport-heights deep).

## The measured facts (Assessment B, corroborating A independently)

| | 1440x900 | 375x812 |
|---|---|---|
| Total scroll | 27,442px = 30.49 vh | 20,911px = 25.75 vh |
| Screens (flick count) | 31 | 26 |
| #productions extent | 11.07 vh | 10.67 vh |
| #labs extent | 16.15 vh | 11.23 vh |
| Distance to "Emmy and Ambie" | 0 (on load) | 0 (on load) |
| Distance to first spread title | 0.89 vh | 0.64 vh |
| Distance to "53M" | 1.40 vh | 1.47 vh |
| Distance to first Labs entry | 12.13 vh | 11.49 vh |
| Distance to About | 28.07 vh | 22.58 vh |
| Distance to the email link | 29.38 vh | 24.65 vh |

**Explicit structural finding: no control anywhere targets a point inside a chapter.** Every jump affordance (skip links, cover contents, rail, mobile menu, "About follows," "Back to cover") resolves to a chapter start or the document top. Within Productions' 11 viewport-heights and Labs' 16, the only traversal is manual scrolling. The rail's "· 3/7" counter displays position it cannot change.

Fast-scroll media check: on a cold cache, 7 of 10 Labs videos had data by the end of a ~1.5s flick to the bottom (10/10 after a 5s settle; 10/10 warm). Media readiness is not a major contributor to the fatigue problem.

## The 60-90 second employer walkthrough (Assessment A, key points)

- 0-10s: excellent. Name, gold credential line, contents in one viewport at both widths.
- 10-30s: the strongest stretch on the site. Scamfluencers (53M, Creators We Love art) and Dying for Sex (9-Emmy laurel in the artwork, Podcast of the Year).
- 30-60s: remaining five spreads at flick speed; a visible energy dip at Hollywood & Crime (no stat); hits the inter-chapter seam (~1.5 vh of pure gradient) right as attention is lowest.
- 60-90s: Labs header, Static, maybe Multiverse Quad, then the bail point, mid-Labs, where at flick speed roughly every other screen contains no title, just video frame or collapsed accordions.
- Never seen by this persona: AI Creator Lab's "4 to 50+" stat, the About awards list, the bio, and the email address. A bail before the footer means leaving with no visible way to contact her.

## Grid vs. sequence, honestly

Lost from the old grid: instant inventory (the whole body of work legible in ~2 screens), self-directed sampling (jump straight to the answer of "has she shipped AI tools?"), cheap bailing (a grid bail still shows everything existed; a sequence bail means unseen work doesn't exist). Gained by the sequence: authored credibility order (Emmy material first, unmissable), stats read inline at skim speed instead of hiding behind tile clicks, and the career reads as an argument (showrunner-then-builder) a grid cannot make. The fix is not reverting; it's giving the sequence a random-access layer.

## Priority issues

**[P0] The contents lists chapters, not work; no scannable index of the 16 pieces exists anywhere, and nothing can jump within a chapter.** This is the root cause of both the fatigue risk and the bail cost. Fix: make the Cover contents a real magazine TOC, every credit and project by name under its chapter heading, each a jump link to its spread. The per-spread anchor ids nearly exist already (`productions-progress-N-7` / `labs-progress-N-9`, currently progress-observer-only). Real magazines list articles, not sections; this deepens the publication thesis rather than diluting it.

**[P1] Contact is one tiny footer row, ~30 viewport-heights deep, with nothing persistent pointing at it.** "Can I reach her" is the employer's fourth question and the page's last answer. Fix: email on the Cover (mastheads print contact info) and/or a Contact item on the rail.

**[P1] Labs back-half pacing: four consecutive same-template Feature entries.** The actual "scrolling forever" feeling lives here. Fix options, in-thesis: tighten Feature vertical rhythm (`pb-40 md:pb-64` + `mt-12 md:mt-20` are where the dead screens come from); demote one or two mid-run Features (Narrative Space, Unstill) to Shorts; move AI Creator Lab ahead of the flag point.

**[P2] Awards invisible at skim speed on five of seven spreads.** Each spread shows one stat; the rest (Ambie win, Vogue, Peabody, adaptations) sits in collapsed expandables the impatient persona never opens. Fix: a one-line small-caps award strip under the pull-stat; data already in SPREADS.

**[P2] Mobile fixed-element collisions and scaffolding.** The mobile chip difference-blends over body text at some positions and stays visible (and stale) on the Cover, unlike the desktop rail which suppresses there; the motion toggle overlaps stats at some positions; "Teaching: Details to come" reads as an unfinished site to an employer. Fixes: extend cover suppression to the chip, solid-ground or reposition the fixed controls, cut the Teaching block until it has content.

## Strengths to protect

- The Cover answers who/what/credible in 5 seconds at both widths. Don't crowd it past that.
- Productions reads at flick speed because of the one-color-per-credit rule; the per-spread hue change is doing wayfinding work no nav element could. This disproves the specific fear about the poster format, protect it.
- The first 30 seconds outperform the old tile grid for an employer by a wide margin, numbers are in the artwork itself (the 9-Emmy laurel, Creators We Love).

## Definitive recommendation

Build the real table of contents on the Cover: every credit and project by name, grouped under the three chapter headings, each a jump link to its spread, with an email line beside the credential. One component, anchors nearly exist, converts the forced linear read into random access without a single tile, and answers all four employer questions (who / what / credible / reachable) on the first viewport while leaving the long-read experience fully intact.
