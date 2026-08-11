---
target: "Cover verdict: Option A vs Option B (pages/CoverOptionsPreviewPage.tsx)"
total_score: 32
max_score: 32
na_heuristics: comparative verdict pass, no heuristics scored
p0_count: 0
p1_count: 0
timestamp: 2026-08-07T23-52-55Z
slug: on-a-vs-option-b-pages-coveroptionspreviewpage-tsx
---
Method: dual-agent (A: a357b4a039a87814e · B: a72d671a95528a78a)

## Verdict

**Option A.** Assessment A gave this as a direct, unhedged recommendation after inspecting both at 1440px and 375px and tracing how each cover's color and art actually relate to the Productions chapter that follows.

## The reasons that decided it, ranked

**1. A solves the problem Jeanine actually raised; B only half-solves it.** Option A's field is not "inspired by" Productions, it is the byte-identical gradient the Scamfluencers spread opens on (`CoverOptionsPreviewPage.tsx:29` matches `ProductionsPreviewPage.tsx:96` exactly). Cover flows into chapter with zero color break. Option B opens on near-black (`#0A0E1A`) behind a heavy dark scrim, the same lightness profile as the AI-hero video that started this whole exercise. Swapping the AI hero for real key art fixes the *authenticity* complaint, but going from near-black into the warm terra spread still reproduces the *pacing* complaint, a mood swing right at the seam, just with a different mood on each side of it. A removes the swing entirely; B relocates it.

**2. B has a reuse problem A structurally cannot have.** The exact same file, `tlc-notext.png`, is also the lead image on The Last City's own spread inside Productions (`ProductionsPreviewPage.tsx:167`, the #1 Apple Fiction show). Using it as the cover spends the single most striking image in the chapter before the reader ever opens the chapter, so its own spread's reveal is already spent by the time they reach it. A needs no image at all, so this risk doesn't exist for it.

**3. Design specificity, on close inspection, cuts against B.** B uses real, cleared IP, which sounds more "authored for her," but its *form* (moody dusk photo, dark scrim, serif name bottom-left) is the generic prestige-drama-poster template regardless of whose photo fills it. A's typographic gesture, keyed to the exact color system recurring through the whole chapter, is the more idiosyncratic signature, one no other site's template could produce without also owning that specific palette logic.

## What to still change in Option A before it goes live

- The credential line's yellow-green (`#F0FF29`) is now the single most saturated color on the cover, and correctly giving it its own bold tier means the cover's loudest element sits right under an elegant serif name. Worth checking whether a slightly desaturated variant of the same hue reads as intentional emphasis rather than caution-tape yellow, without touching the accent used elsewhere on the site.
- At 375px, the `justify-between` flex on a `min-h-screen` container leaves a noticeably large empty gap between the name and the credential block, confirmed in the screenshot at roughly a third of the viewport. Not broken, but worth tightening before shipping.

## What you'd be giving up by not choosing B, stated honestly

B is the more arresting first three seconds. A human face, a real produced sci-fi show, dusk light, a smoking dome behind her, stops a scroll in a way clean typography on a color field doesn't, and it proves in one glance that she's a working scripted-TV creator with an actual photographic body of work, not just a name making claims about itself. If the priority were maximum emotional impact on first contact over pacing and asset-reuse cleanliness, B would be defensible. It just isn't the better answer to the specific problem that started this.

## Fix-verification (evidence, both assessments independently confirm)

Both prior rounds' fixes hold, at both 1440px and 375px, with no regression:

- **Credential-line hierarchy**, measured directly: 24px/20.8px, weight 700, Uncut Sans, distinct color per option (chartreuse in A, ember in B), 16px/12px gap to the tagline, which stays 18.4px/16px, weight 400, Source Serif 4. Explicitly confirmed distinct in every one of the 4 option-by-width combinations, not the identical state the code's own comments describe as the pre-fix condition.
- **Contrast**, measured by reconstructing the actual rendered background (canvas gradient for A, canvas drawImage of the real loaded image plus scrim for B) rather than assumed: 6.52-6.71:1 in A, 7.81-9.29:1 in B, both far past the correct 3:1 floor for bold text at this size (20.8-24px bold clears the WCAG large-text bold threshold of 18.66px).
- **Option B's face-position fix**, confirmed live at both widths: at 375px the new 4:3 image band plus solid dark ground below it (measured 111.49px gap from image-band bottom to the name heading's top) gives real separation; at 1440px the tuned object-position leaves her chin clear of the name, the name's own baseline crossing her shoulder/collar, not her face.
- Zero horizontal overflow at 375, 768, and 1440px. Zero console errors across the full navigate/resize/scroll sequence. Mechanical scan clean (no findings, expected: this file is inline-style/Tailwind-arbitrary-value driven, outside the regex engine's coverage on `.tsx`, so a clean scan reflects the engine's reach on this file type, not an assertion that the render has no issues, that's what the direct measurements above are for).
