import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ColorBridge,
  Eyebrow,
  Expandable,
  LazyVideo,
  MotionToggle,
  ProjectorLight,
  SpreadShell,
} from '../components/chapter';

/**
 * PROTOTYPE: not linked from site navigation.
 * Ghost Mode Labs, "The Screening Room" (REDESIGN-PLAN.md section 5): one
 * continuous warm ink-black ground, a single ember accent, video-led entries
 * with wide cinematic spacing. Deliberately inverts the Productions chapter's
 * per-spread color fields; distinction between chapters is structure and pace
 * only, never temperature.
 *
 * Three tiers carry the hierarchy (5.2) so nine entries no longer read as one
 * infinite feed: Features get the full treatment, Shorts are compact, and the
 * one in-development project holds its position without pretending to be
 * finished. All media streams from the Google Cloud bucket; nothing local.
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
  inkSoft: 'rgba(242,237,226,0.55)',
  inkBody: 'rgba(242,237,226,0.82)',
  // Terra tuned for dark ground: same hue as the site accent, lightness
  // raised for legibility (9.4:1 on the ground; raw terra reads 3.9:1).
  accent: 'var(--ember)',
  border: 'rgba(242,237,226,0.16)',
};

const SERIF_DISPLAY = "'Bodoni Moda', serif";
const SERIF_BODY = "'Source Serif 4', Georgia, serif";

type Tier = 'feature' | 'short' | 'in-development';

interface LabEntry {
  id: string; // links to the existing /project/:id detail page
  client: string;
  /**
   * Plain string, not ReactNode: the Cover's index renders these as text
   * links, and every Labs title happens to need no typographic binding
   * (unlike the Productions spreads, several of which are JSX).
   */
  title: string;
  tagline: string;
  tier: Tier;
  description?: string;
  stat?: { value: string; label: string };
  expandables?: { label: string; body: string }[];
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
 * missing `flip` renders right.
 */
const ENTRIES: LabEntry[] = [
  {
    id: 'static',
    client: 'Ghost Mode Labs',
    title: 'Static',
    tagline: 'Scripted series built from online folklore',
    tier: 'feature',
    description:
      'Thousands of people vanish in the American wilderness every year, and thirteen Reddit communities have spent a decade building folklore around them. Last Active, a research tool built for this, found 582 recurring overlaps across 6,884 accounts. Static is the first story to come out of it.',
    stat: { value: '7,000 voices', label: 'One American haunting' },
    expandables: [
      {
        label: 'Concept',
        body: 'Every year, thousands of people vanish in the American wilderness. Their families post online because no one else is listening. Over the last decade, thirteen Reddit communities have built a body of folklore around these disappearances, ten million subscribers deep, and nobody had connected what they were writing.',
      },
      {
        label: 'Build',
        body: 'I built a research tool called Last Active. You point it at a public archive and it finds story patterns, under-reported stories, and hidden gems. Pointed at those thirteen communities, it found 582 recurring overlaps across 6,884 accounts: creatures, phenomena, rules.',
      },
      {
        label: 'Status',
        body: 'Static is the first story to come out of the tool. Built as a proposal for iHeart.',
      },
    ],
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/Static.mp4',
      alt: 'Preview reel for Static, a scripted series built from online folklore',
    },
  },
  {
    id: 'multiverse-quad',
    client: 'Amazon AGI',
    title: 'Multiverse Quad',
    tagline: 'One story, four formats',
    tier: 'feature',
    description:
      'A single narrative adapted into an animated short film, a graphic novel, a visual audiobook, and a podcast, unfolding at the same time. Pitched to Amazon’s AGI team and built into a working demo with engineers, scientists, and product leadership.',
    stat: { value: 'AWS re:Invent', label: 'Shortlisted for the keynote' },
    expandables: [
      {
        label: 'Concept',
        body: 'Most stories live in a single format. A podcast stays a podcast, a film stays a film. Multiverse Quad explores what happens when a story launches across several formats at once, using the sci-fi series The Last City as its starting point.',
      },
      {
        label: 'Build',
        body: 'Pitched to Amazon’s AGI team, then built into a working demo with engineers, scientists, product leadership, and Go To Market teams. Four formats unfold at the same time: an animated short film, a graphic novel, a visual audiobook, and a podcast.',
      },
      {
        label: 'Status',
        body: 'A working demo, shortlisted for Andy Jassy’s AWS re:Invent keynote.',
      },
    ],
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/CoverLCaudio2.mp4',
      alt: 'Preview reel for Multiverse Quad, one story told across four formats at once',
    },
    flip: true,
  },
  {
    id: 'visual-audiobooks',
    client: 'Ghost Mode Labs',
    title: 'Visual Audiobooks',
    tagline: 'Original kids’ stories that draw themselves differently every time a child returns',
    tier: 'feature',
    note: 'Launching soon',
    description:
      'Kids play a favorite story a hundred times. Built a player where the pictures redraw themselves every time, so the hundredth listen doesn’t look like the first.',
    expandables: [
      {
        label: 'Concept',
        body: 'The first story built for it: The Kids’ Guidebook to the Rock, an original story. Every Sunday, a girl visits her father in a Florida prison. Before they moved him to the Rock, he escaped from a work camp and was gone a month. She tells you how he did it, step by step, like she could do it herself. Every time you listen, the escape gets redrawn, because that’s what she’s actually doing in that yard on those long Sundays: imagining it differently, over and over, while she waits.',
      },
      {
        label: 'Build',
        body: 'Charcoal one listen. A flashlight on a quilt the next. Mixed media built from real archival footage after that. Some tellings are drawn by code. Others come from illustrators who pitch their own version and join the book.',
      },
      {
        label: 'Status',
        body: 'Narrated today. You can record it in a parent’s voice, a grandparent’s, or your own, next. Still in build, launching soon.',
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
    title: 'AI Creator Lab',
    tagline: 'Creative workflow lab',
    tier: 'feature',
    description:
      'Wondery’s first AI Creator Lab: hands-on workshops, learning modules, and outside partners demonstrating new tools inside real production workflows. Three working tools came out of it.',
    stat: { value: '4 to 50+', label: 'People across the company' },
    expandables: [
      {
        label: 'Concept',
        body: 'Founded Wondery’s first AI Creator Lab to explore how new tools could fit into real production workflows.',
      },
      {
        label: 'Build',
        body: 'Hands-on workshops, learning modules, and outside partners who were building these tools demonstrating how they worked. To support the lab I built an online hub where the curriculum lived: each module with a walkthrough, study guide, FAQs, and the original presentation. Tools included ElevenLabs, ChatGPT, Midjourney, and NotebookLM.',
      },
      {
        label: 'Status',
        body: 'The lab grew from four people to more than fifty across content, marketing, product, and ad sales. Three projects came out of it: StoryCraft, a research assistant, and a metadata tool.',
      },
    ],
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/AI%20Creator%20Lab%202%20-%20New%20Cover%20.mp4',
      poster: 'https://storage.googleapis.com/jeanine-portfolio-video/B6-Cover2-poster.jpg',
      // Measured directly from the asset (1920x946).
      aspectRatio: '1920 / 946',
      alt: 'Preview reel for the AI Creator Lab, a creative workflow lab founded at Wondery',
    },
    flip: true,
  },
  {
    id: 'narrative-space',
    client: 'Ghost Mode Labs',
    title: 'Narrative Space',
    tagline: 'Interactive world building',
    tier: 'feature',
    description:
      'Story worlds usually begin as documents. Narrative Space turns that material into something you can explore: characters, locations, and themes as nodes in a living space you can move through, question, and build in.',
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
    id: 'mythos',
    client: 'Ghost Mode Labs',
    title: 'MythOS',
    tagline: 'Franchise intelligence',
    tier: 'feature',
    description:
      'An interactive globe that tracks how myths travel across cultures and centuries. Click Circe and it lights up with every culture that told her story, 46 of them across 3,500 years. Built for studio development and franchise teams.',
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
    // Cover swap per 5.4: the original cover carries a baked-in MythOS
    // wordmark that duplicates the page title, so this uses the project's
    // own demo footage (mainVideos[0] in constants.ts) instead. That demo
    // clip *also* opens on its own gold "MythOS / Original Signal" title
    // card for its first ~3.5s (confirmed by frame-capture during Phase 2
    // review), so this plays "a clean segment" per 5.4 by starting at t=4,
    // past the card, into the actual globe demo. No media file was cropped
    // or re-edited; startAt is playback-only.
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/MythOS%20Demo4.mp4',
      // Measured directly from the asset (2664x1440): pinning it up front
      // avoids the small reflow while metadata loads.
      aspectRatio: '2664 / 1440',
      startAt: 4,
      alt: 'MythOS demo: an interactive globe tracking myths across cultures',
    },
    flip: true,
  },
  {
    id: 'unstill',
    client: 'Ghost Mode Labs',
    title: 'Unstill',
    tagline: 'Regenerative lives',
    tier: 'feature',
    description:
      '1920s Sydney, through what survives in the archive: a name, a date, a charge. Hover and color returns to the photograph. Click and the portrait begins to breathe. Built as a proposal for Museums of History NSW.',
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
  },
];

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

/** Soft fade-up on scroll into view; skipped under reduced motion. */
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
      { threshold: 0.12 }
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

const OpenProjectLink: React.FC<{ id: string }> = ({ id }) => (
  <Link
    to={`/project/${id}`}
    className="lab-open mt-10 inline-flex items-baseline gap-2 text-[0.75rem] tracking-[0.18em] uppercase"
    style={{ color: LAB.ink }}
  >
    Open project
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
}) => (
  <article
    id={`lab-${data.id}`}
    tabIndex={-1}
    data-progress-chapter="labs"
    data-progress-index={position}
    data-progress-total={total}
    /* Was pb-40 md:pb-64. The recruiter critique measured these Feature
       entries at ~2 viewport-heights each, with roughly every other screen
       carrying no title at flick speed, just frame or collapsed rows and
       dead air. Tightened here and at the text block below. */
    className="pb-24 md:pb-40"
  >
    <Reveal>
      <Eyebrow label={data.client} index={`L-0${position}`} labelColor={LAB.inkSoft} indexColor={LAB.accent} />

      <h3
        className="mt-8 md:mt-12"
        style={{
          fontFamily: SERIF_DISPLAY,
          fontSize: 'var(--display-xl)',
          lineHeight: 0.92,
          letterSpacing: '-0.015em',
          color: LAB.ink,
        }}
      >
        {data.title}
      </h3>

      <div className={`mt-10 md:mt-16 ${data.flip ? 'md:mr-auto' : 'md:ml-auto'} md:w-[92%]`}>
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

      <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-12">
        <div className={data.flip ? 'md:col-span-6 md:col-start-7' : 'md:col-span-6 md:col-start-1'}>
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
            <p
              className="mt-5 text-[length:var(--body)] leading-relaxed"
              style={{ fontFamily: SERIF_BODY, color: LAB.inkBody, maxWidth: '40ch' }}
            >
              {data.description}
            </p>
          )}

          {/* Verified stats only; a Feature without one simply omits the slot. */}
          {data.stat && <StatBlock stat={data.stat} />}

          {data.expandables && data.expandables.length > 0 && (
            <div className="mt-10 md:mt-14">
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

          {data.hasProjectPage !== false && <OpenProjectLink id={data.id} />}
        </div>
      </div>
    </Reveal>
  </article>
);

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
      <Eyebrow label={data.client} index={`L-0${position}`} labelColor={LAB.inkSoft} indexColor={LAB.accent} />

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
      <Eyebrow label={data.client} index={`L-0${position}`} labelColor={LAB.inkSoft} indexColor={LAB.accent} />

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
 * index. Derived from ENTRIES rather than hand-listed, so it cannot fall out
 * of sync with what the chapter renders or silently drop a new entry.
 */
export const LABS_INDEX = ENTRIES.map((e, i) => ({
  anchor: `lab-${e.id}`,
  name: e.title,
  index: `L-0${i + 1}`,
}));

/** Quiet divider introducing the compact run at the chapter's end (5.2). */
const ShortsDivider: React.FC = () => (
  <div className="pb-16 md:pb-24 flex items-baseline gap-6">
    <span className="chapter-label" style={{ color: LAB.inkSoft }}>
      Shorts
    </span>
    <span aria-hidden="true" className="flex-1" style={{ borderTop: `1px solid ${LAB.border}` }} />
  </div>
);

/**
 * The chapter's dark ground, header, and entries only. No boundary
 * bridges: the page or Spine composing this owns the transition to
 * whatever comes before and after.
 */
export const LabsChapter: React.FC<{ onAbout?: () => void }> = ({ onAbout }) => {
  const firstShortIndex = ENTRIES.findIndex((e) => e.tier === 'short');

  return (
    <>
      <style>{`
        /* Vertical padding brings the tap target close to the 44px
           guideline (measured at ~25px before this); the visible
           underline still sits tight under the text via border-bottom. */
        .lab-open { border-bottom: 1px solid ${LAB.border}; padding: 0.65rem 0; transition: border-color 0.3s ease; }
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
        background={LAB.ground}
        grainOpacity={0.04}
        gutterClassName="px-6 md:px-24"
      >
        {/* chapter header */}
        <div className="pt-24 md:pt-40 pb-24 md:pb-40">
          <div className="flex items-end justify-between">
            <h2
              className="text-[2.4rem] md:text-[3.5rem] leading-none"
              style={{ fontFamily: SERIF_DISPLAY, color: LAB.ink }}
            >
              Ghost Mode Labs
            </h2>
            <span
              className="hidden md:block text-[0.8rem] italic"
              style={{ fontFamily: SERIF_BODY, color: LAB.inkSoft }}
            >
              story systems &middot; production tools &middot; cultural experiments
            </span>
          </div>
          <p
            className="mt-10 md:mt-14 text-[1.1rem] md:text-[1.25rem] leading-relaxed"
            style={{ fontFamily: SERIF_BODY, color: LAB.inkBody, maxWidth: '46ch' }}
          >
            The studio for what she is building next: stories and the systems
            that make them, built hands-on with&nbsp;AI.
          </p>
        </div>

        {ENTRIES.map((e, i) => (
          <React.Fragment key={e.id}>
            {i === firstShortIndex && <ShortsDivider />}
            <Entry data={e} position={i + 1} total={ENTRIES.length} />
          </React.Fragment>
        ))}

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
      <MotionToggle />

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

      <ColorBridge from="var(--bg-site)" to={LAB.ground} heightClassName="h-[18vh] md:h-[26vh]" />

      <LabsChapter />

      <ColorBridge from={LAB.ground} to="var(--bg-site)" heightClassName="h-[18vh] md:h-[26vh]" />

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
