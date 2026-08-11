import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChapterContents,
  ColorBridge,
  Eyebrow,
  Expandable,
  LazyVideo,
  MotionToggle,
  ProjectorLight,
  SpreadShell,
  useRevealOnce,
} from '../components/chapter';

/**
 * PROTOTYPE: not linked from site navigation.
 * Ghost Mode Labs, "The Screening Room" (REDESIGN-PLAN.md section 5): one
 * continuous warm ink-black ground, a single ember accent, video-led entries
 * with wide cinematic spacing. Deliberately inverts the Productions chapter's
 * per-spread color fields; distinction between chapters is structure and pace
 * only, never temperature.
 *
 * Two tiers carry the hierarchy (5.2) so the chapter does not read as one
 * infinite feed: four Features get the full treatment, and the rest share a
 * single credits screen, matching the front-of-book/back-of-book split
 * Productions uses. ShortEntry and InDevelopmentEntry are kept as live
 * templates on the Entry dispatcher, reachable by setting a tier, but no
 * current entry uses them. All media streams from the Google Cloud bucket;
 * nothing local.
 *
 * All copy here is drawn from constants.ts and the plan's Appendix A. Nothing
 * is invented: the third expandable is "Status" rather than the plan's
 * proposed "Signal" because most of these are prototypes built solo and have
 * no traction or recognition to report, and inventing one would break 8.3.
 */

export const LAB = {
  // Warm ink-black: the site's own ink (#150E0A) deepened, same hue family
  // as terra. Labs is the site with the lights down, not a different site.
  ground: 'var(--ink-deep)',
  ink: 'var(--cream-ink)',
  // Bumped from 0.55: Labs was the one chapter whose secondary label
  // color didn't scale with anything — a fixed value regardless of
  // ground, while every Productions palette's own inkSoft runs
  // 0.62-0.85 depending on the credit. Labs' single dark ground read
  // measurably dimmer than every one of them (Jeanine caught this
  // directly), even though it clears contrast (5.5:1). 0.67 lands
  // inside Productions' own range rather than at either end of it —
  // still clearly secondary to the ink/inkBody tiers above it, just no
  // longer the one label on the page that's easy to miss.
  inkSoft: 'rgba(242,237,226,0.67)',
  inkBody: 'rgba(242,237,226,0.82)',
  // Terra tuned for dark ground: same hue as the site accent, lightness
  // raised for legibility (9.4:1 on the ground; raw terra reads 3.9:1).
  accent: 'var(--ember)',
  border: 'rgba(242,237,226,0.16)',
};

/**
 * The chapter ground, plus a bloom. Both an outside reviewer and Jeanine
 * separately raised the same worry about this chapter, in different words:
 * her "this looks black, did we decide black was too cold" and the
 * review's "the warmth is carried entirely by the ember kickers and cream
 * serif sitting on top... the dead margins read #000." Correct on the
 * numbers: LAB.ground (#120C08) is warm in hue, but at that luminance the
 * hue is imperceptible, so any patch of it with no text or frame over it
 * reads as plain black.
 *
 * The reviewer's own prescription, taken directly rather than reinvented:
 * "a subtle warm vignette or a barely-there ember bloom... without lifting
 * the base." So the base colour is untouched (LAB.ground is still what
 * ColorBridge blends against, keeping the seams into and out of this
 * chapter exact), and a very low-opacity radial glow sits above it,
 * `background-attachment: fixed` so it holds roughly centred on the
 * viewport as the page scrolls, rather than being pinned to one point in
 * a chapter that runs many viewport-heights tall. --ember at 0.05 alpha:
 * enough to lift the empty ground a little without reading as a coloured
 * patch or competing with the projector light's own glow around each
 * frame.
 */
const LAB_GROUND_WITH_BLOOM =
  'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(232,166,114,0.05), transparent 70%) fixed, var(--ink-deep)';

const SERIF_DISPLAY = "'Bodoni Moda', serif";
const SERIF_BODY = "'Source Serif 4', Georgia, serif";

/**
 * The chapter's index label for a 1-based position. Zero-pads to two digits
 * rather than prefixing a literal "0", which is what four separate call
 * sites used to do: correct through L-09, then "L-010" on the tenth entry.
 * The chapter is at seven, so the trap was real but not yet visible. Pads
 * rather than truncates past 99, on the principle that a wrong-looking
 * number beats a silently wrong one.
 */
const labIndex = (position: number) => `L-${String(position).padStart(2, '0')}`;

type Tier = 'feature' | 'short' | 'in-development';

interface LabEntry {
  id: string; // links to the existing /project/:id detail page
  client: string;
  /**
   * Given directly by Jeanine, not inferred: Multiverse Quad and AI Creator
   * Lab, both built alongside Wondery/Amazon, are 2025; every self-initiated
   * entry (Static, Visual Audiobooks, MythOS, Narrative Space, Unstill) is
   * 2026. Worth reading against the client field rather than past it: the
   * self-initiated work being the *more recent* year is what tells an
   * employer this is ongoing output, not two old company projects and
   * everything else undated filler.
   *
   * Optional, not required: ARCHIVED_ENTRIES (Tender, In-World Social
   * Campaign) predate this field and no year for them has been given, so
   * leaving it required would have meant fabricating one, which 8.3 rules
   * out. Every entry actually in ENTRIES or CREDIT_ENTRIES sets it.
   */
  year?: string;
  /**
   * Plain string, not ReactNode: the Cover's index renders these as text
   * links, and every Labs title happens to need no typographic binding
   * (unlike the Productions spreads, several of which are JSX).
   */
  title: string;
  tagline: string;
  tier: Tier;
  // Usually a plain paragraph; widened to ReactNode for the rare entry
  // dense enough to need a break (Static, once Last Active's own sentence
  // needed separating from the setup before it).
  description?: React.ReactNode;
  stat?: { value: string; label: string };
  // body is usually a plain paragraph; AI Creator Lab's Impact needs a real
  // list (three distinct projects), which reads as a wall of text run
  // together as prose in a 38ch column, so ReactNode is allowed here too.
  expandables?: { label: string; body: React.ReactNode }[];
  video: { src: string; poster?: string; alt: string; aspectRatio?: string; startAt?: number };
  /**
   * Was shown only on the in-development tier ("Coming soon"). Now also
   * rendered by FeatureEntry, for Visual Audiobooks: promoted to a full
   * Feature on real content, but genuinely still building, so it needs an
   * honest status signal visible without opening an expandable, not just
   * an in-development template's smaller frame.
   */
  note?: string;
  /**
   * Defaults true. Set false to suppress "Open project →" for a Feature
   * whose real detail page has no content yet (constants.ts currently has
   * description: '' and mainVideos: [] for Visual Audiobooks). Showing
   * that link before the page behind it exists would be the same
   * scaffolding problem as the About colophon's empty Teaching block.
   */
  hasProjectPage?: boolean;
  /** Overrides OpenProjectLink's default "Open project" label. Static uses
   *  this: its detail page is itself framed as a pitch, so "Open the
   *  original pitch" names what a visitor actually gets, the same way the
   *  detail page's own CTA box already does. */
  openProjectLabel?: string;
  flip?: boolean;
}

/**
 * Order per 5.1: lead with proof, and never open the chapter on an unbuilt
 * project. Visual Audiobooks holds third position by Jeanine's call,
 * graduating to a full Feature in place when she ships it. AI Creator Lab is
 * promoted from the plan's default Short to a Feature: it carries the
 * chapter's strongest verified adoption number, which the Short tier has no
 * slot for.
 *
 * AI Creator Lab moved from seventh to fourth after the recruiter-persona
 * critique measured this chapter's back half as the site's real fatigue
 * zone: four consecutive same-template Feature entries, roughly eight
 * viewport-heights of structural sameness, with the "4 to 50+" adoption
 * stat, the single strongest employer-facing credential in the chapter,
 * sitting behind all of it at 24 viewport-heights deep.
 *
 * The L-0N labels are derived from array position at render, not stored per
 * entry, so a future reorder cannot leave them out of sequence. Left/right
 * frame alternation for the Feature and in-development tiers is still
 * per-entry (`flip`), so it does need re-checking on any reorder: the
 * sequence should read right, left, right, left down the chapter, where a
 * missing `flip` renders right. This ENTRIES array is now the Feature run
 * only: four entries (Static, Multiverse Quad, Visual Audiobooks, AI
 * Creator Lab) running right/left/right/left. MythOS leaving the run needed
 * no flip changes, since it sat fifth with no flip and its removal leaves
 * the alternation already correct. The three demoted entries live in
 * CREDIT_ENTRIES below and render as one credits screen, where `flip` is
 * not read at all.
 */
const ENTRIES: LabEntry[] = [
  {
    id: 'static',
    client: 'Ghost Mode Labs',
    year: '2026',
    title: 'Static',
    tagline: 'Scripted supernatural series built from online folklore',
    tier: 'feature',
    description: (
      <>
        <p>
          For more than a decade, thirteen Reddit communities built a
          shared folklore around disappearances in the American
          wilderness.
        </p>
        <p className="mt-3">
          Last Active, a research tool I built to trace story patterns
          across public archives, found 582 recurring overlaps across
          6,884 accounts.
        </p>
        <p className="mt-3">
          Static is the first scripted series built from that research.
        </p>
      </>
    ),
    stat: { value: '7,000 voices', label: 'One American haunting' },
    // Detail page is itself framed as a pitch (the CTA there already reads
    // "See the original pitch"), so this names what the click leads to
    // instead of the generic default every other Feature entry uses.
    openProjectLabel: 'Open the original pitch',
    // Left column (description) = what happened and what she made. Concept
    // = what she saw in the material. Build = what the tool actually did.
    // Status = where the project went. Each expandable advances past the
    // description instead of restating it — round two of the same
    // redundancy trim, this time on Jeanine's own wording rather than a
    // mechanical cut.
    expandables: [
      {
        label: 'Concept',
        body: (
          <>
            <p>
              Across thousands of posts, the same creatures, phenomena,
              warnings, and rules kept resurfacing. Taken together, they
              began to read less like isolated stories and more like one
              shared mythology.
            </p>
            <p className="mt-3">
              Static turns that mythology into one American haunting.
            </p>
          </>
        ),
      },
      {
        label: 'Build',
        body: 'Last Active searches large public archives for recurring story patterns, under-reported stories, and hidden connections. For Static, it mapped a decade of scattered folklore into source material for a scripted series.',
      },
      {
        label: 'Status',
        body: 'Developed as a proposal for iHeart.',
      },
    ],
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/Static.mp4',
      poster: '/static-poster.jpg',
      alt: 'Preview reel for Static, a scripted supernatural series built from online folklore',
    },
  },
  {
    id: 'multiverse-quad',
    client: 'Amazon AGI',
    year: '2025',
    title: 'Multiverse Quad',
    tagline: 'One story, four formats',
    tier: 'feature',
    description: (
      <>
        <p>
          A scene from The Last City became the foundation for a
          four-format storytelling prototype. The same story was
          developed as an animated short, graphic novel, visual
          audiobook, and podcast.
        </p>
        <p className="mt-3">
          I pitched the concept to Amazon&rsquo;s AGI team and built it
          into a working demo with their engineers, scientists, and
          product leadership.
        </p>
      </>
    ),
    stat: { value: 'AWS re:Invent', label: 'Shortlisted for Andy Jassy’s keynote' },
    expandables: [
      {
        label: 'Concept',
        body: 'Most stories start in one format and get adapted later. Multiverse Quad develops a story across four formats from the start.',
      },
    ],
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/CoverLCaudio2.mp4',
      poster: '/multiverse-quad-poster.jpg',
      alt: 'Preview reel for Multiverse Quad, one story told across four formats at once',
    },
    flip: true,
  },
  {
    id: 'visual-audiobooks',
    client: 'Ghost Mode Labs',
    year: '2026',
    title: 'Visual Audiobooks',
    tagline: 'Original children’s stories that can change each time you return',
    tier: 'feature',
    note: 'Launching soon',
    // Broken into three beats, not one dense block: Jeanine's call after
    // seeing it rendered — same words, but pacing on the page, not a
    // rewrite. Left side = the experience; Concept and Build pick up from
    // there without restating it.
    description: (
      <>
        <p>
          Children return to the same stories again and again. What if the
          book could redraw itself every time they came back?
        </p>
        <p className="mt-3">
          Each reading can unfold in a different visual language. One
          version might come from an illustrator. Another might be drawn
          in real time by code, responding to the story as it unfolds and
          producing a new interpretation each time.
        </p>
        <p className="mt-3">
          The voice can be personal too, with narration recorded by a
          parent, grandparent, or even the child.
        </p>
      </>
    ),
    expandables: [
      {
        label: 'Concept',
        body: 'The first prototype uses an excerpt from The Kids’ Guidebook to the Rock, an original story about a girl visiting her father in a Florida prison and telling the story of how he once escaped.',
      },
      {
        // Description already covers illustrator-vs-code editions; Build
        // doesn't restate that, it goes one layer deeper into what the
        // prototype is actually testing.
        label: 'Build',
        body: 'What happens when code doesn’t simply illustrate a story, but interprets it? That question sits at the center of the prototype. Each reading unfolds differently.',
      },
    ],
    hasProjectPage: false,
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/visual-audiobook-cover.mp4',
      alt: 'Preview reel for Visual Audiobooks, a new visual telling with every listen',
    },
  },
  {
    id: 'ai-creator-lab',
    client: 'Wondery',
    year: '2025',
    title: 'AI Creator Lab',
    tagline: 'Creative workflow lab',
    tier: 'feature',
    description:
      'I founded Wondery’s first AI Creator Lab. I created the curriculum, built the learning modules and the site they lived on, and brought in outside partners to demo their tools inside production work. Three projects were greenlit out of it.',
    stat: { value: '4 to 50+', label: 'People across the company' },
    expandables: [
      {
        label: 'Impact',
        body: (
          <>
            The lab grew from four people to more than fifty across content,
            marketing, product, and ad sales.
            {/* Project names carry accent color, not just italic: italic
                alone at the same size and weight as the surrounding prose
                was too weak a signal to read as a label, the "almost
                invisible" half of the complaint that also hit the awards
                strip. Color is the same cue the rest of the site already
                uses for labels (chapter-label, index numbers), so this
                stays inside the established system rather than inventing a
                new emphasis style. */}
            <ul className="mt-3 space-y-3 list-none pl-0">
              <li>
                <em style={{ color: LAB.accent, fontStyle: 'normal' }}>StoryCraft</em>
                {' '}&mdash; a tool that helped writers turn adult narrative
                podcasts into kids&rsquo; and family adventures. Greenlit for
                the Kids and Family division.
              </li>
              <li>
                <em style={{ color: LAB.accent, fontStyle: 'normal' }}>In-world social campaign</em>
                {' '}&mdash; a dozen in-world prototypes for The Last City.
                Two moved into production, one beat its engagement
                benchmarks.
              </li>
              <li>
                <em style={{ color: LAB.accent, fontStyle: 'normal' }}>Production tools</em>
                {' '}&mdash; built research and metadata tools that cut
                show-prep time by about 90% and helped tailor metadata for
                platforms including Spotify, YouTube, and Apple.
              </li>
            </ul>
          </>
        ),
      },
    ],
    // Swapped from the record-player clip (AI Creator Lab 2 - New Cover):
    // Jeanine's call, reads "too much of a Canva template." Reused instead
    // is the moody close-up piece from the old site's own video hero
    // (components/Hero.tsx's HERO_VIDEOS) — same asset, same poster, now
    // repurposed here instead of retired outright.
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/Heroshotmusic2.mp4',
      poster: '/hero-poster.jpg',
      // Measured directly from the asset (3840x2160).
      aspectRatio: '16 / 9',
      alt: 'Preview reel for the AI Creator Lab, a creative workflow lab founded at Wondery',
    },
    flip: true,
  },
];

/**
 * Back of book, three entries on one screen.
 *
 * The Feature run is now four: Static, Multiverse Quad, Visual Audiobooks,
 * AI Creator Lab. Two carry a company's own validation (Amazon AGI, Wondery)
 * and two are self-initiated, which is the balance the chapter wants, since
 * Productions already carries the institutional load at scale and Labs
 * exists to show what she builds when nobody assigns it.
 *
 * MythOS demoted on Jeanine's call. Worth recording that her own earlier
 * argument for keeping it was a good one ("speaks an entertainment
 * employer's language more directly than anything else in the chapter"),
 * so the honest reason for the demotion is not that it is weak: it is that
 * it overlaps Static, which already occupies "self-initiated prototype,
 * built its own tool, has a number to show for it," and does so with an
 * outside proposal (iHeart) attached. Four entries answering four different
 * questions beats five where two answer the same one.
 *
 * Narrative Space and Unstill sit below it, in that order, weakest last.
 *
 * Every demoted entry keeps its full Concept/Build/Status content in the
 * data even though the credits rows do not render it, so promoting any of
 * them back is a one-word tier change plus a `flip` re-check, not a
 * rewrite. Same reversibility as ARCHIVED_ENTRIES below.
 */
const CREDIT_ENTRIES: LabEntry[] = [
  {
    id: 'mythos',
    client: 'Ghost Mode Labs',
    year: '2026',
    title: 'MythOS',
    tagline: 'Franchise intelligence',
    tier: 'feature',
    description:
      'Studios return to the same handful of myths while thousands more remain largely unused. MythOS maps how stories move across cultures and centuries. Start with Circe and trace her across 46 cultures and 3,500 years.',
    stat: { value: '494', label: 'Source stories in the prototype' },
    expandables: [
      {
        label: 'Concept',
        body: 'Studios keep looping the same franchises while thousands of stories sit in public domain archives, never mapped, never developed. MythOS is an interactive globe that tracks how myths travel across cultures and centuries. Click Circe and it lights up with every culture that told her story, 46 of them across 3,500 years.',
      },
      {
        label: 'Build',
        body: 'Scroll down through a figure’s full timeline, ask it questions, and find what is developable. Built with React, Three.js, React Three Fiber, the Claude API, GSAP, and Vite, using Claude Code.',
      },
      {
        label: 'Status',
        body: 'A working prototype with 494 source stories in it. Works with any mythology, folklore tradition, or public domain IP. Built for studio development and franchise teams.',
      },
    ],
    // Kept for a possible promotion back, and unread by the credits rows:
    // the original cover carries a baked-in MythOS wordmark that duplicates
    // the page title, so this uses the project's own demo footage instead,
    // starting at t=4 to clear that clip's own gold title card (confirmed by
    // frame-capture during Phase 2 review). No media file was re-edited;
    // startAt is playback-only.
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/MythOS%20Demo4.mp4',
      aspectRatio: '2664 / 1440',
      startAt: 4,
      alt: 'MythOS demo: an interactive globe tracking myths across cultures',
    },
  },
  {
    id: 'narrative-space',
    client: 'Ghost Mode Labs',
    year: '2026',
    title: 'Narrative Space',
    tagline: 'Interactive worldbuilding',
    tier: 'short',
    description:
      'Story worlds usually live across scattered documents, character notes, locations, and timelines. Narrative Space turns them into an interactive space where characters, places, and themes become connected nodes you can explore and build on.',
    expandables: [
      {
        label: 'Concept',
        body: 'Story worlds usually begin as documents: notes about characters, places, timelines, and relationships. Narrative Space turns that material into something you can move through, where characters, locations, and themes appear as nodes in a shared space.',
      },
      {
        label: 'Build',
        body: 'Upload an existing story bible and watch the world assemble itself, or start from scratch and let the tool ask the questions that shape the structure. Built with React, Three.js, the Claude API, and vector embeddings, using AI Studio Build and Claude Code.',
      },
      {
        label: 'Status',
        body: 'A working prototype, live to try. The process stays human-led: writers decide what belongs in the world.',
      },
    ],
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/Sphere%20Cover%202.mp4',
      // Measured directly from the asset (1850x1080).
      aspectRatio: '1850 / 1080',
      alt: 'Preview reel for Narrative Space, story worlds as nodes you can move through',
    },
  },
  {
    id: 'unstill',
    client: 'Ghost Mode Labs',
    year: '2026',
    title: 'Unstill',
    tagline: 'Regenerative lives',
    tier: 'short',
    description: (
      <>
        <p>
          Unstill begins with people preserved in 1920s Sydney police
          archives, often as little more than a name, date, photograph,
          and charge. Their portraits gradually come back to life through
          color, motion, archival material, and fragments of story that
          change over time.
        </p>
        <p className="mt-3">Built as a proposal for Museums of History NSW.</p>
      </>
    ),
    expandables: [
      {
        label: 'Concept',
        body: '“The archive is a record of power, not of truth.” Saidiya Hartman’s line is where Unstill begins. 1920s Sydney, a generation pushing against the old Victorian order, and what survives is often the moment the system caught up: a name, a date, a charge.',
      },
      {
        label: 'Build',
        body: 'Hover and color returns to the photograph. Click and the portrait begins to breathe. A loupe reveals the original glass plate beneath the moving image. Built with React, the Claude API, ElevenLabs, Gemini VEO 3.1, Nano Banana, and Vite, using Claude Code.',
      },
      {
        label: 'Status',
        body: 'A working prototype: seven full stories, then a dozen more faces from the collection. Built as a proposal for Museums of History NSW.',
      },
    ],
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/Face-compressed.mp4',
      // Measured directly from the asset (480x320, 3:2): notably off 16:9,
      // so pinning this one matters most among the three that needed it.
      aspectRatio: '480 / 320',
      alt: 'Preview reel for Unstill, 1920s Sydney archive portraits returning to color and motion',
    },
    flip: true,
  },
];

/*
 * No longer appended to ENTRIES. ENTRIES is now the Feature run only, and
 * CREDIT_ENTRIES is rendered separately by LabCredits, which is what lets
 * the chapter count six progress units (five Features plus one credits
 * screen) instead of claiming seven stops when two share a screen.
 */

/**
 * Cut from the chapter on Jeanine's call: nine entries read as too much
 * under Ghost Mode, and these two weren't necessarily the four she'd
 * choose to highlight. Kept intact and in the exact shape ENTRIES expects,
 * not deleted, so restoring either one is just moving its object back into
 * ENTRIES (and re-checking its `flip` against whatever now sits on either
 * side, per the alternation note above). Excluded from LABS_INDEX and the
 * rendered chapter automatically, since both are derived from ENTRIES only.
 */
export const ARCHIVED_ENTRIES: LabEntry[] = [
  {
    id: 'tender',
    client: 'Ghost Mode Labs',
    title: 'Tender',
    tagline: 'Conversation with culture',
    tier: 'short',
    description:
      'A library of films, essays, poems, myths, and podcasts chosen by people who care deeply about culture. Tell Tender how you are feeling and it finds something to meet you there. Part human curation, part conversational system.',
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/Cover2%20Tender%20Updated.mp4',
      alt: 'Preview reel for Tender, a conversational way to find films, essays, poems, and podcasts',
    },
  },
  {
    id: 'in-world-social-campaign',
    client: 'Wondery',
    title: 'In-World Social Campaign',
    tagline: 'In-world marketing',
    tier: 'short',
    description:
      'For The Last City, the marketing came from inside the story: destination posts, recruitment ads, a trailer made as if the city had its own creative agency. More than a dozen prototypes; two moved into production.',
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/Cover%20StoryCraft5.mp4',
      alt: 'Preview reel for the In-World Social Campaign, marketing written from inside The Last City',
    },
    flip: true,
  },
];

/**
 * Soft fade-up on scroll into view; skipped under reduced motion.
 *
 * Trigger geometry matches components/chapter/useRevealOnce, which carries
 * the full reasoning. Same defect was live here: a bare 12% threshold with
 * no rootMargin fires far too early for an element taller than the
 * viewport, and these entries are the tallest on the site. MythOS measures
 * 1782px against a 900px viewport, so 12% meant ~214px of entry, which put
 * its title's top edge at 758px, 84% down the screen, with the 900ms fade
 * then running while the title climbed into view. Worse here than in
 * Productions in one sense: those spreads are 1.14 viewports, these are
 * nearly two, so proportionally less of the entry has to arrive before the
 * observer is satisfied.
 *
 * rootMargin pulls the root's bottom edge up 40% and threshold drops to 0,
 * so an entry fires once it crosses into the top 60% of the viewport,
 * putting its title near 68% with room left to animate on screen. Kept
 * numerically identical to the shared hook so both chapters move alike.
 */
/** "Client · Year", or plain client when year is absent (the two archived
 *  entries). One place composing this so the Feature eyebrow and the
 *  credits row's byline can't drift out of the same format. */
const clientLine = (e: LabEntry): string => (e.year ? `${e.client} · ${e.year}` : e.client);

const Reveal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -40% 0px', threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(28px)',
        transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {children}
    </div>
  );
};

const OpenProjectLink: React.FC<{ id: string; label?: string }> = ({ id, label = 'Open project' }) => (
  <Link
    to={`/project/${id}`}
    className="lab-open mt-10 inline-flex items-baseline gap-2 text-[0.75rem] tracking-[0.18em] uppercase"
    style={{ color: LAB.ink }}
  >
    {label}
    <span aria-hidden="true" style={{ color: LAB.accent }}>
      &rarr;
    </span>
  </Link>
);

const StatBlock: React.FC<{ stat: { value: string; label: string } }> = ({ stat }) => (
  <div className="mt-10 md:mt-14">
    <p
      className="italic"
      style={{
        fontFamily: SERIF_DISPLAY,
        // Long values drop a step so a phrase-length stat never overruns
        // its column (3.2).
        fontSize: stat.value.length > 6 ? 'var(--stat-long)' : 'var(--stat)',
        lineHeight: 1.05,
        color: LAB.ink,
        maxWidth: '14ch',
      }}
    >
      {stat.value}
    </p>
    <p className="mt-2 chapter-label" style={{ color: LAB.inkSoft }}>
      {stat.label}
    </p>
  </div>
);

/**
 * Full treatment: oversized title matching the Productions spread scale so
 * the chapters read as siblings, a near-full-width frame with the projector
 * light behind it, and Concept / Build / Status expandables for parity with
 * Productions' Role / Series / Impact.
 */
const FeatureEntry: React.FC<{ data: LabEntry; position: number; total: number }> = ({
  data,
  position,
  total,
}) => {
  /*
   * Three-beat choreography, Labs' own version of the Productions spread
   * entrance built earlier: title (eyebrow travels with it, one beat, not
   * two), then the frame, then the text row. Same 560ms duration and
   * cubic-bezier as Productions so the two chapters read as siblings; same
   * 0/140/280ms stagger and 10/44/26px travel too, mapped onto Labs' own
   * three beats rather than Productions' eyebrow/title/artwork three.
   *
   * The frame beat is deliberately the one with the most travel (44px,
   * matching the weight Productions gives its title): this chapter's
   * identity is the screening room, so the entrance should be about the
   * frame arriving, not the words above it. ProjectorLight's own glow is
   * untouched and keeps its independent scroll-coupled brighten-and-hold;
   * wrapping its container in this beat does not gate that effect, only the
   * frame's own opacity and position, so the two compound: the frame rises
   * into place while the light is already warming up behind it.
   *
   * useRevealOnce observes `lab-${data.id}`, the same id this article
   * already carries for the Cover's index and the rail's progress tracking,
   * so no second id or ref is introduced. Geometrically equivalent to the
   * local Reveal component this replaces for Features: that component's own
   * ref sat flush with this article's top padding edge, so switching to
   * id-based observation of the article moves the trigger by nothing
   * measurable.
   */
  const { shown, reduced } = useRevealOnce(`lab-${data.id}`);
  const beat = (delay: number, rise: number): React.CSSProperties =>
    reduced
      ? {}
      : {
          opacity: shown ? 1 : 0,
          transform: shown ? 'none' : `translateY(${rise}px)`,
          transition: `opacity 560ms cubic-bezier(0.2,0.8,0.2,1) ${delay}ms, transform 560ms cubic-bezier(0.2,0.8,0.2,1) ${delay}ms`,
        };

  return (
  <article
    id={`lab-${data.id}`}
    tabIndex={-1}
    data-progress-chapter="labs"
    data-progress-index={position}
    data-progress-total={total}
    /* Was pb-40 md:pb-64, then pb-24 md:pb-40. The recruiter critique
       measured these Feature entries at ~2 viewport-heights each, with
       roughly every other screen carrying no title at flick speed, just
       frame or collapsed rows and dead air. Trimmed again alongside the
       two-column split below: at 160px this was the third-largest single
       item in the entry, behind only the frame and the text row. */
    className="pb-20 md:pb-28"
  >
    {/* Beat 1: eyebrow + title together, since the choreography is three
        beats (title, frame, text), not four. */}
    <div style={beat(0, 10)}>
      <Eyebrow label={clientLine(data)} index={labIndex(position)} labelColor={LAB.inkSoft} indexColor={LAB.accent} />

      <h3
        className="mt-8 md:mt-12"
        style={{
          fontFamily: SERIF_DISPLAY,
          fontSize: 'var(--display-lg)',
          lineHeight: 0.92,
          letterSpacing: '-0.015em',
          color: LAB.ink,
        }}
      >
        {data.title}
      </h3>
    </div>

      {/* Beat 2: the frame. mt-12, was mt-16: part of the 167px of
          inter-beat gaps measured in this entry, trimmed where it costs
          nothing to the rhythm. */}
      <div
        className={`mt-10 md:mt-12 ${data.flip ? 'md:mr-auto' : 'md:ml-auto'} md:w-[92%]`}
        style={beat(140, 44)}
      >
        <ProjectorLight>
          <LazyVideo
            src={data.video.src}
            poster={data.video.poster}
            alt={data.video.alt}
            aspectRatio={data.video.aspectRatio}
            startAt={data.video.startAt}
            fallbackTitle={data.title}
          />
        </ProjectorLight>
      </div>

      {/*
        Two columns, not one.

        Measured on MythOS: this row was 651px tall while occupying exactly
        50% of the available width, which made it nearly as tall as the 621px
        video frame above it with the other half of the page empty. That was
        the single largest piece of Labs' height problem, and the reason a
        Labs Feature ran 1.99 viewport-heights against a Productions spread's
        1.19: Productions runs media and text side by side, while this
        stacked tagline, description, stat, expandables and link in one
        half-width column straight down.

        Splitting it puts the narrative material (tagline, description,
        stat) beside the reference material (expandables, project link), so
        the row's height becomes the taller of the two rather than their sum.
        The wide frame above is deliberately untouched: it plus the projector
        light is what makes this chapter a screening room rather than
        Productions with the lights off, and narrowing it to buy height
        would trade the chapter's identity for the wrong saving.

        Beat 3 lives on this same div: the two-column split above is a
        layout concern, the entrance below is a motion concern, and this
        div already exists as the natural boundary between them.
      */}
      <div
        className="mt-10 md:mt-10 grid grid-cols-1 md:grid-cols-12 gap-y-10 md:gap-x-10"
        style={beat(280, 26)}
      >
        {/* Whichever of these two columns lands at col-start-8 is the one at
            the container's right edge, so the rail clearance follows `flip`
            rather than being pinned to one column's role. */}
        <div
          className={
            data.flip
              ? 'md:col-span-5 md:col-start-8 xl:pr-44'
              : 'md:col-span-5 md:col-start-1'
          }
        >
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-4">
            <p className="text-[0.8rem] tracking-[0.14em] uppercase" style={{ color: LAB.accent }}>
              {data.tagline}
            </p>
            {data.note && (
              <p
                className="inline-block chapter-label px-3 py-1.5"
                style={{ color: LAB.accent, border: `1px solid ${LAB.border}` }}
              >
                {data.note}
              </p>
            )}
          </div>

          {data.description && (
            <div
              className="mt-5 text-[length:var(--body)] leading-relaxed"
              style={{ fontFamily: SERIF_BODY, color: LAB.inkBody, maxWidth: '40ch' }}
            >
              {data.description}
            </div>
          )}

          {/* Verified stats only; a Feature without one simply omits the slot. */}
          {data.stat && <StatBlock stat={data.stat} />}
        </div>

        {/* Reference column: the rows a reader opens on purpose, plus the way
            out to the full project. md:row-start-1 pins it beside the
            narrative column rather than below it, which is the entire point;
            without it grid's sparse packing drops it to row 2 on the
            non-flipped entries and nothing is saved. On mobile it stacks
            underneath, in DOM order, unchanged. */}
        {/* xl:pr-44 only when this column sits at the right edge, reserving
            the rail's footprint at 1024 and up where the rail exists. Same
            clearance the Productions spreads and credits screen carry. */}
        <div
          className={`md:row-start-1 ${
            data.flip
              ? 'md:col-span-5 md:col-start-1'
              : 'md:col-span-5 md:col-start-8 xl:pr-44'
          }`}
        >
          {data.expandables && data.expandables.length > 0 && (
            <div>
              {data.expandables.map((e) => (
                <Expandable
                  key={e.label}
                  label={e.label}
                  accentColor={LAB.accent}
                  labelColor={LAB.inkSoft}
                  bodyColor={LAB.inkBody}
                  borderColor={LAB.border}
                >
                  {e.body}
                </Expandable>
              ))}
            </div>
          )}

          {data.hasProjectPage !== false && (
            <OpenProjectLink id={data.id} label={data.openProjectLabel} />
          )}
        </div>
      </div>
  </article>
  );
};

/**
 * Compact: smaller title, narrower frame, one paragraph, no stat slot and no
 * expandables. Deliberately faster so the chapter has a back third with a
 * different pace rather than nine identical templates.
 */
const ShortEntry: React.FC<{ data: LabEntry; position: number; total: number }> = ({
  data,
  position,
  total,
}) => (
  <article
    id={`lab-${data.id}`}
    tabIndex={-1}
    data-progress-chapter="labs"
    data-progress-index={position}
    data-progress-total={total}
    className="pb-24 md:pb-36"
  >
    <Reveal>
      <Eyebrow label={data.client} index={labIndex(position)} labelColor={LAB.inkSoft} indexColor={LAB.accent} />

      <h3
        className="mt-6 md:mt-8"
        style={{
          fontFamily: SERIF_DISPLAY,
          fontSize: 'var(--display-md)',
          lineHeight: 0.95,
          letterSpacing: '-0.015em',
          color: LAB.ink,
        }}
      >
        {data.title}
      </h3>

      <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 md:items-center">
        <div className={`md:col-span-7 order-1 ${data.flip ? 'md:col-start-6 md:order-2' : 'md:col-start-1'}`}>
          <LazyVideo
            src={data.video.src}
            poster={data.video.poster}
            alt={data.video.alt}
            aspectRatio={data.video.aspectRatio}
            startAt={data.video.startAt}
            fallbackTitle={data.title}
          />
        </div>
        <div
          className={`md:col-span-4 order-2 ${
            data.flip ? 'md:col-start-1 md:row-start-1 md:order-1' : 'md:col-start-9'
          }`}
        >
          <p className="text-[0.8rem] tracking-[0.14em] uppercase" style={{ color: LAB.accent }}>
            {data.tagline}
          </p>
          {data.description && (
            <p
              className="mt-4 text-[1rem] leading-relaxed"
              style={{ fontFamily: SERIF_BODY, color: LAB.inkBody, maxWidth: '36ch' }}
            >
              {data.description}
            </p>
          )}
          <OpenProjectLink id={data.id} />
        </div>
      </div>
    </Reveal>
  </article>
);

/**
 * Light entry for work still in progress: title, one line, the looping cover,
 * and an honest tag. No fabricated description and no stat. Graduating this
 * to a Feature when it ships is a one-word change to its tier.
 */
const InDevelopmentEntry: React.FC<{ data: LabEntry; position: number; total: number }> = ({
  data,
  position,
  total,
}) => (
  <article
    id={`lab-${data.id}`}
    tabIndex={-1}
    data-progress-chapter="labs"
    data-progress-index={position}
    data-progress-total={total}
    className="pb-24 md:pb-40"
  >
    <Reveal>
      <Eyebrow label={data.client} index={labIndex(position)} labelColor={LAB.inkSoft} indexColor={LAB.accent} />

      <h3
        className="mt-6 md:mt-8"
        style={{
          fontFamily: SERIF_DISPLAY,
          fontSize: 'var(--display-md)',
          lineHeight: 0.95,
          letterSpacing: '-0.015em',
          color: LAB.ink,
        }}
      >
        {data.title}
      </h3>

      <div className="mt-8 md:mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-4">
        <p className="text-[0.8rem] tracking-[0.14em] uppercase" style={{ color: LAB.accent }}>
          {data.tagline}
        </p>
        {data.note && (
          <p
            className="inline-block chapter-label px-3 py-1.5"
            style={{ color: LAB.accent, border: `1px solid ${LAB.border}` }}
          >
            {data.note}
          </p>
        )}
      </div>

      {/* Right-aligned (md:ml-auto): Static and Multiverse Quad on either
          side already run right/left, and this entry sits between them and
          Narrative Space (left). Left-anchoring it, the unstyled default,
          produced three left frames in a row; this restores strict
          alternation through the whole Feature run. */}
      <div className="mt-8 md:mt-12 md:w-[64%] md:ml-auto">
        <LazyVideo
          src={data.video.src}
          poster={data.video.poster}
          alt={data.video.alt}
          fallbackTitle={data.title}
        />
      </div>
    </Reveal>
  </article>
);

const Entry: React.FC<{ data: LabEntry; position: number; total: number }> = ({
  data,
  position,
  total,
}) => {
  if (data.tier === 'feature') return <FeatureEntry data={data} position={position} total={total} />;
  if (data.tier === 'short') return <ShortEntry data={data} position={position} total={total} />;
  return <InDevelopmentEntry data={data} position={position} total={total} />;
};

/**
 * Every Labs entry by name and anchor, in chapter order, for the Cover's
 * index. Spans both tiers so it cannot silently drop the compressed ones.
 */
export const LABS_INDEX = [...ENTRIES, ...CREDIT_ENTRIES].map((e, i) => ({
  anchor: `lab-${e.id}`,
  name: e.title,
  index: labIndex(i + 1),
  meta: e.tagline,
}));

/**
 * The chapter's back of book: Narrative Space and Unstill on one screen
 * instead of two mini-features.
 *
 * Matches ProductionCredits in role, so the site has one back-of-book idea
 * rather than three layout patterns. Measured cost of the old form was 0.79
 * and 0.85 viewport-heights for two entries whose whole purpose was to be
 * the quick tier.
 *
 * Typographic, with no thumbnails, and that is a considered divergence from
 * Productions rather than an omission. Neither entry has a poster still, so
 * a thumbnail would mean downloading an entire video to show one frame of
 * it, in the one tier whose job is to be light. On the ink-black ground the
 * ember index numbers, hairlines and display titles already read as a
 * designed credits list, where paper genuinely needed the images to anchor
 * it. Descriptions are kept in full: nothing is lost here except the frames
 * and the space around them.
 */
const LabCredits: React.FC<{ position: number; total: number }> = ({ position, total }) => (
  <article
    id="lab-credits"
    tabIndex={-1}
    data-progress-chapter="labs"
    data-progress-index={position}
    data-progress-total={total}
    className="pb-20 md:pb-28"
  >
    <Reveal>
      <div className="flex items-baseline gap-6">
        <h3 className="chapter-label" style={{ color: LAB.inkSoft }}>
          Also in the lab
        </h3>
        <span
          aria-hidden="true"
          className="flex-1"
          style={{ borderTop: `1px solid ${LAB.border}` }}
        />
      </div>

      <ul className="mt-10 md:mt-14">
        {CREDIT_ENTRIES.map((entry, i) => (
          <li
            key={entry.id}
            id={`lab-${entry.id}`}
            tabIndex={-1}
            className="py-8 md:py-10"
            style={{ borderBottom: `1px solid ${LAB.border}` }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-5 md:gap-x-10">
              <div className="md:col-span-5 md:col-start-1 flex items-start gap-5">
                <span
                  className="chapter-label tabular-nums shrink-0 pt-1"
                  style={{ color: LAB.accent }}
                >
                  {labIndex(ENTRIES.length + i + 1)}
                </span>

                {/* Video, not a still, unlike ProductionCredits' thumbnails.
                    That screen crops a poster image; nothing here has one,
                    every entry's own asset is already a muted looping clip,
                    and this chapter's whole identity is video-led frames, so
                    a small cover playing is the native form, not a
                    substitute for a missing one. Square via `compact` so
                    Static's landscape source and Multiverse Quad's own
                    ratio still read as one even row of covers.

                    hidden lg:block, not sm: unlike ProductionCredits' row,
                    which is one unconstrained flex-1 group so a thumbnail
                    there only ever competes with the index number, this
                    title/byline block is pinned to a fixed 5-of-12 grid
                    column. Measured at 768: that column is 217px total, and
                    index (30) + gap (20) + this video at md:w-28 (112) + gap
                    (20) left 32px for the title, tagline and byline
                    combined, which rendered "Ghost Mode Labs · 2026" as one
                    word per line. lg is where the same column has enough
                    room for both. */}
                <LazyVideo
                  src={entry.video.src}
                  poster={entry.video.poster}
                  alt={entry.video.alt}
                  aspectRatio="1 / 1"
                  compact
                  className="hidden lg:block w-28 shrink-0"
                  fallbackTitle={entry.title}
                />

                <div className="min-w-0">
                  <h4
                    className="text-[1.6rem] md:text-[2rem] leading-tight"
                    style={{ fontFamily: SERIF_DISPLAY, color: LAB.ink }}
                  >
                    {entry.title}
                  </h4>
                  <p
                    className="mt-2 text-[0.8rem] tracking-[0.14em] uppercase"
                    style={{ color: LAB.accent }}
                  >
                    {entry.tagline}
                  </p>
                  {/* Client and year, matching ProductionCredits' own
                      byline under its title. This row had no date anywhere
                      before, on a chapter where the self-initiated work
                      (this row, all 2026) is the same age or newer than the
                      client-backed Features above it (2025): the ongoing,
                      unassigned output is the more recent half, not the
                      older one, which is worth a date to actually show. */}
                  <p
                    className="mt-1 text-[0.8rem] italic"
                    style={{ fontFamily: SERIF_BODY, color: LAB.inkSoft }}
                  >
                    {clientLine(entry)}
                  </p>
                </div>
              </div>

              <div className="md:col-span-6 md:col-start-7 xl:pr-44">
                {entry.description && (
                  <div
                    className="text-[1rem] leading-relaxed"
                    style={{ fontFamily: SERIF_BODY, color: LAB.inkBody, maxWidth: '44ch' }}
                  >
                    {entry.description}
                  </div>
                )}
                {entry.hasProjectPage !== false && <OpenProjectLink id={entry.id} />}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Reveal>
  </article>
);

/**
 * The chapter's dark ground, header, and entries only. No boundary
 * bridges: the page or Spine composing this owns the transition to
 * whatever comes before and after.
 */
export const LabsChapter: React.FC<{ onAbout?: () => void }> = ({ onAbout }) => {
  return (
    <>
      <style>{`
        /* Vertical padding brings the tap target close to the 44px
           guideline (measured at ~25px before this); the visible
           underline still sits tight under the text via border-bottom. */
        .lab-open { min-height: 2.75rem; align-items: center; border-bottom: 1px solid ${LAB.border}; padding: 0.8rem 0; transition: border-color 0.3s ease, opacity 0.3s ease; }
        .lab-open:hover { border-color: ${LAB.accent}; }
        .lab-open:focus-visible { outline: 2px solid var(--ember); outline-offset: 2px; }
      `}</style>
      {/* overflow-hidden (the SpreadShell default) contains the projector
          light, which is deliberately wider than its frame. Its gradient
          reaches full transparency well inside that width, so clipping at
          the chapter edge is invisible; without it the light pushed 76px
          past the viewport and created horizontal scroll. */}
      <SpreadShell
        as="div"
        background={LAB_GROUND_WITH_BLOOM}
        grainOpacity={0.04}
        gutterClassName="px-6 md:px-24"
      >
        {/* chapter header */}
        <div id="labs-chapter-header" className="pt-24 md:pt-40 pb-24 md:pb-40">
          <h2
            className="text-[2.4rem] md:text-[3.5rem] leading-none"
            style={{ fontFamily: SERIF_DISPLAY, color: LAB.ink }}
          >
            Ghost Mode Labs
          </h2>
          <p
            className="mt-10 md:mt-14 text-[1.1rem] md:text-[1.25rem] leading-relaxed"
            style={{ fontFamily: SERIF_BODY, color: LAB.inkBody, maxWidth: '46ch' }}
          >
            At Ghost Mode Labs, I develop original IP and prototype new ways
            to research, develop, and extend stories across scripted,
            nonfiction, and interactive formats.
          </p>
          <ChapterContents
            ariaLabel="Ghost Mode Labs project index"
            label="Projects in this chapter"
            items={LABS_INDEX}
            colors={{
              accent: LAB.accent,
              border: LAB.border,
              ink: LAB.ink,
              muted: LAB.inkSoft,
            }}
          />
        </div>

        {/* Progress counts the credits screen as the chapter's final unit,
            matching how ProductionCredits is counted, so the rail reads
            "3/6" rather than claiming seven stops when two of them share a
            screen. */}
        {ENTRIES.map((e, i) => (
          <Entry key={e.id} data={e} position={i + 1} total={ENTRIES.length + 1} />
        ))}
        <LabCredits position={ENTRIES.length + 1} total={ENTRIES.length + 1} />

        {/* Chapter coda: a real link into the About colophon when the
            composing page has one to point at (5.5). */}
        {onAbout && (
          <div className="pb-24 md:pb-32">
            <button
              type="button"
              onClick={onAbout}
              className="lab-open inline-flex items-baseline gap-2 text-[0.75rem] tracking-[0.18em] uppercase"
              style={{ color: LAB.ink, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              About follows: the person behind both chapters
              <span aria-hidden="true" style={{ color: LAB.accent }}>
                &rarr;
              </span>
            </button>
          </div>
        )}
      </SpreadShell>
    </>
  );
};

const LabsPreviewPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-site)' }}>
      <MotionToggle hideWhileVisibleId="labs-chapter-header" />

      {/* Cream strip: where the Productions coda hands off */}
      <header className="px-6 md:px-24 pt-12 pb-10 md:pt-16 md:pb-14">
        <div className="flex items-baseline justify-between">
          <Link
            to="/"
            className="text-[0.7rem] tracking-[0.18em] uppercase"
            style={{ color: 'var(--ink-mute)' }}
          >
            Jeanine Emilia Cornillot
          </Link>
          <span className="text-[0.7rem] tracking-[0.18em] uppercase" style={{ color: 'var(--ink-faint)' }}>
            Prototype
          </span>
        </div>
      </header>

      {/* via="var(--terra)": the plain cream/ink-deep mix measured as
          #7b7274, 3.8% saturation, i.e. grey rather than warm. See
          ColorBridge's own doc comment for the measurement and why terra,
          not a different mixing function, is the fix. */}
      <ColorBridge from="var(--bg-site)" to={LAB.ground} via="var(--terra)" heightClassName="h-[12vh] md:h-[16vh]" />

      <LabsChapter />

      <ColorBridge from={LAB.ground} to="var(--bg-site)" via="var(--terra)" heightClassName="h-[12vh] md:h-[16vh]" />

      {/* Cream coda: same fix as the Spine's own breather, the narration
          line was an unnecessary stage direction; the real navigation
          (the link below) stays. */}
      <footer className="px-6 md:px-24 py-20 md:py-28 flex items-baseline justify-end">
        <Link
          to="/preview/productions"
          className="hidden md:block text-[0.7rem] tracking-[0.18em] uppercase"
          style={{ color: 'var(--ink-mute)' }}
        >
          &larr; Productions
        </Link>
      </footer>
    </div>
  );
};

export default LabsPreviewPage;
