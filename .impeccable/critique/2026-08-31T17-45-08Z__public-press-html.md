---
target: press kit design and Family Sentence praise
total_score: 27
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 0
timestamp: 2026-08-31T17-45-08Z
slug: public-press-html
---
Method: dual-agent (A: /root/impeccable_design_review · B: /root/impeccable_detector_review)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Copy feedback is clear; the visible masthead does not explicitly say Press kit. |
| 2 | Match System / Real World | 4 | Familiar press language and a natural reading order. |
| 3 | User Control and Freedom | 3 | Portfolio, contact, anchor, PDF, and mail exits are clear. |
| 4 | Consistency and Standards | 4 | Typography, rules, spacing, and interactions are cohesive. |
| 5 | Error Prevention | 3 | Direct actions are simple and clipboard failure is anticipated. |
| 6 | Recognition Rather Than Recall | 4 | Actions and information groups are visible and clearly named. |
| 7 | Flexibility and Efficiency | n/a | A static Read/Persuade surface does not need expert accelerators. |
| 8 | Aesthetic and Minimalist Design | 3 | Strong restraint, but the isolated blue rectangle competes with the name and the middle repeats proof. |
| 9 | Error Recovery | 3 | Copy failure offers a manual recovery instruction. |
| 10 | Help and Documentation | n/a | Not applicable to a self-contained press kit. |
| **Total** | | **27/32** | **Good** |

## Design Specificity Verdict

The page feels authored for Jeanine, not category-interchangeable. The poppy field, oversized Bodoni name treatment, Source Serif reading voice, Uncut Sans utility labels, thin editorial rules, and black closing panel form a specific visual language. The weakest element is the powder-blue facts panel. Its equal padding, near-square silhouette, and isolated fill make it read as a pasted card rather than part of the page architecture.

The deterministic scan returned zero findings, but the run was degraded because the HTML parser dependencies were unavailable. It fell back to regular-expression matching, so computed contrast and selector behavior were not evaluated. Browser evidence confirmed that the panel is about 419 by 392 pixels on desktop, with no border, radius, or shadow. On mobile it becomes about 350 by 411 pixels and starts near the bottom of the first viewport. No reliable browser overlay was available because the browser surface did not permit mutable script injection.

## Overall Impression

This is a strong, confident, useful press page. The opening has authority and the ending has drama. The main opportunity is to turn the powder blue from a floating object into structural editorial architecture, then introduce one emotional proof moment so the center of the page is not only credentials and outcomes.

## What Is Working

1. The name-first hero has real authority. The Bodoni, poppy field, and positioning line establish stature and contemporary relevance immediately.
2. The typography system is disciplined. Bodoni provides personality, Source Serif sustains reading, and Uncut Sans supports press-desk scanning.
3. The page is practical. Semantic headings, visible focus, 44-pixel targets, copy feedback, PDF and mail paths, and machine-readable formats support real press and recruiting use.

## Cognitive Load

Low, with one of eight checklist items failing. Grouping, hierarchy, visible actions, minimal choices, and memory demands are all good. The one weakness is chunking in the middle. Six works, six topics, a full bio, and awards repeat related credibility claims without introducing a new emotional register.

## Emotional Journey

The opening is the first peak. The middle becomes a factual plateau as roles, rankings, awards, and biographies accumulate. The black contact footer restores energy. A restrained Family Sentence praise section could create the missing authorial and human lift between those peaks.

## Priority Issues

### [P2] The facts panel reads as a Post-it

**Why it matters:** It is the only self-contained filled card on the page. Its geometry makes it feel placed on top of the hero instead of designed into it.

**Fix:** Keep the powder blue and the facts, but dock the color to the composition. The strongest direction is a full-width band attached to the bottom of the hero, with four editorial columns on desktop and a full-bleed stacked band on mobile. A right-edge rail that touches the hero boundary is the second-best direction. Do not add rounded corners, shadow, rotation, or tape effects.

**Suggested command:** `$impeccable layout`

### [P2] The middle has proof but little emotional dimension

**Why it matters:** Metrics and awards persuade rationally, but they do not communicate Jeanine's literary voice or the response to her work.

**Fix:** Add a compact Praise for Family Sentence section immediately after Selected work and before Available to discuss. Treat it as one open editorial composition, not a grid of testimonial cards.

**Suggested command:** `$impeccable bolder` or `$impeccable layout`

### [P2] Credential repetition flattens the reading rhythm

**Why it matters:** Short bio, Selected work, Full bio, and Awards repeat several of the same achievements. Adding praise without editing would make the page longer without making it richer.

**Fix:** Give every section one job. Short bio should be quotable identity, Selected work should show outcomes, Full bio should establish chronology and range, and Awards should act as a compact index.

**Suggested command:** `$impeccable distill`

### [P3] The page type is inferred rather than stated

**Why it matters:** A first-time visitor sees the name and actions but must infer that this is the press kit.

**Fix:** Add a small Uncut Sans eyebrow such as Press kit · August 2026. It should remain utility scale, not become a second headline.

**Suggested command:** `$impeccable clarify`

## Recommendation for the Powder-Blue Panel

Keep the color. Retire the floating rectangle. Turn it into a band docked to the bottom edge of the hero. The four facts become four columns beneath a small At a glance label. On mobile, the band becomes full-bleed and stacked between the poppy hero and the cream Short bio section. This changes the visual read from Post-it to editorial information strip.

## Recommendation for Praise for Family Sentence

Include it. It gives Family Sentence cultural authority and adds an emotional register that the production metrics cannot provide. Place it directly after Selected work, where the book is introduced.

Use the Carrillo endorsement as the lead pull quote, edited to a carefully chosen excerpt if needed. Place the short Hijuelos line and a concise Kirkus excerpt beneath or beside it as supporting proof. Do not make three equal cards, do not create a carousel, and do not introduce another powder-blue box. Use cream or white, Bodoni or Source Serif for the quotation, Uncut Sans for attribution, thin rules, and generous whitespace. Verify exact wording, attribution, source links, and reuse permission before publishing.

## Persona Red Flags

**Jordan, first-timer:** The page communicates stature immediately but does not literally label itself as a press kit. Three equally weighted endorsements would also leave Jordan unsure which quotation matters most.

**Riley, stress tester:** HTML, PDF, Markdown, JSON, and structured data create a content-drift risk. If praise is added, decide which formats include it and regenerate them together. Riley will also test exact quotation wording and source links.

**Casey, distracted mobile user:** Tap targets and early actions are strong, but the hero and facts panel together are about 1085 pixels tall. A full-bleed band with tighter mobile padding would improve continuity. Keep the praise compact so it does not become another long scroll wall.

## Minor Observations

- The blue and ink have good legibility. The issue is silhouette and placement, not hue.
- Thin rules and all-caps labels feel controlled and press-appropriate.
- No additional motion is needed.
- The page behaves more like a biography and credentials kit than a full media kit because imagery remains available by request.

## Questions to Consider

1. Should the facts feel like a strong transition between the poppy hero and the cream body, or remain a quieter side note?
2. Is Family Sentence a current interview story, or primarily proof of range? That determines how large the praise section should be.
3. Should a reader remember Jeanine first for awards, range, or voice? If voice is one of the top two, the praise section earns its place.
