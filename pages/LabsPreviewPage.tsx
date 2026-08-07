import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ColorBridge,
  Eyebrow,
  Expandable,
  LazyVideo,
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
  index: string;
  client: string;
  title: React.ReactNode;
  tagline: string;
  tier: Tier;
  description?: string;
  stat?: { value: string; label: string };
  expandables?: { label: string; body: string }[];
  video: { src: string; poster?: string; alt: string };
  note?: string;
  flip?: boolean;
}

/**
 * Order per 5.1: lead with proof, and never open the chapter on an unbuilt
 * project. Visual Audiobooks holds L-03 by Jeanine's call, graduating to a
 * full Feature in place when she ships it. AI Creator Lab is promoted from
 * the plan's default Short to a Feature: it carries the chapter's strongest
 * verified adoption number, which the Short tier has no slot for.
 */
const ENTRIES: LabEntry[] = [
  {
    id: 'static',
    index: 'L-01',
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
      alt: 'Static cover video',
    },
  },
  {
    id: 'multiverse-quad',
    index: 'L-02',
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
      alt: 'Multiverse Quad cover video',
    },
    flip: true,
  },
  {
    id: 'visual-audiobooks',
    index: 'L-03',
    client: 'Ghost Mode Labs',
    title: 'Visual Audiobooks',
    tagline: 'A new visual telling with every listen',
    tier: 'in-development',
    note: 'Coming soon',
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/visual-audiobook-cover.mp4',
      alt: 'Visual Audiobooks cover video',
    },
  },
  {
    id: 'narrative-space',
    index: 'L-04',
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
      alt: 'Narrative Space cover video',
    },
    flip: true,
  },
  {
    id: 'mythos',
    index: 'L-05',
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
    // own demo footage (mainVideos[0] in constants.ts) instead. No media
    // file was cropped or re-edited.
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/MythOS%20Demo4.mp4',
      alt: 'MythOS demo: an interactive globe tracking myths across cultures',
    },
  },
  {
    id: 'unstill',
    index: 'L-06',
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
      alt: 'Unstill cover video',
    },
    flip: true,
  },
  {
    id: 'ai-creator-lab',
    index: 'L-07',
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
        body: 'I founded Wondery’s first AI Creator Lab to explore how new tools could fit into real production workflows.',
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
      alt: 'AI Creator Lab cover video',
    },
  },
  {
    id: 'tender',
    index: 'L-08',
    client: 'Ghost Mode Labs',
    title: 'Tender',
    tagline: 'Conversation with culture',
    tier: 'short',
    description:
      'A library of films, essays, poems, myths, and podcasts chosen by people who care deeply about culture. Tell Tender how you are feeling and it finds something to meet you there. Part human curation, part conversational system.',
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/Cover2%20Tender%20Updated.mp4',
      alt: 'Tender cover video',
    },
  },
  {
    id: 'in-world-social-campaign',
    index: 'L-09',
    client: 'Wondery',
    title: 'In-World Social Campaign',
    tagline: 'In-world marketing',
    tier: 'short',
    description:
      'For The Last City, the marketing came from inside the story: destination posts, recruitment ads, a trailer made as if the city had its own creative agency. More than a dozen prototypes; two moved into production.',
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/Cover%20StoryCraft5.mp4',
      alt: 'In-World Social Campaign cover video',
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
        fontSize: stat.value.length > 6 ? 'clamp(1.9rem, 2.8vw, 2.8rem)' : 'clamp(3rem, 5vw, 4.5rem)',
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
const FeatureEntry: React.FC<{ data: LabEntry }> = ({ data }) => (
  <article className="pb-40 md:pb-64">
    <Reveal>
      <Eyebrow label={data.client} index={data.index} labelColor={LAB.inkSoft} indexColor={LAB.accent} />

      <h2
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
      </h2>

      <div className={`mt-10 md:mt-16 ${data.flip ? 'md:mr-auto' : 'md:ml-auto'} md:w-[92%]`}>
        <ProjectorLight>
          <LazyVideo
            src={data.video.src}
            poster={data.video.poster}
            alt={data.video.alt}
            fallbackTitle={data.title}
          />
        </ProjectorLight>
      </div>

      <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-12">
        <div className={data.flip ? 'md:col-span-6 md:col-start-7' : 'md:col-span-6 md:col-start-1'}>
          <p className="text-[0.8rem] tracking-[0.14em] uppercase" style={{ color: LAB.accent }}>
            {data.tagline}
          </p>

          {data.description && (
            <p
              className="mt-5 text-[1.02rem] leading-relaxed"
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

          <OpenProjectLink id={data.id} />
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
const ShortEntry: React.FC<{ data: LabEntry }> = ({ data }) => (
  <article className="pb-24 md:pb-36">
    <Reveal>
      <Eyebrow label={data.client} index={data.index} labelColor={LAB.inkSoft} indexColor={LAB.accent} />

      <h2
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
      </h2>

      <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 md:items-center">
        <div className={`md:col-span-7 order-1 ${data.flip ? 'md:col-start-6 md:order-2' : 'md:col-start-1'}`}>
          <LazyVideo
            src={data.video.src}
            poster={data.video.poster}
            alt={data.video.alt}
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
const InDevelopmentEntry: React.FC<{ data: LabEntry }> = ({ data }) => (
  <article className="pb-32 md:pb-48">
    <Reveal>
      <Eyebrow label={data.client} index={data.index} labelColor={LAB.inkSoft} indexColor={LAB.accent} />

      <h2
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
      </h2>

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

      <div className="mt-8 md:mt-12 md:w-[64%]">
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

const Entry: React.FC<{ data: LabEntry }> = ({ data }) => {
  if (data.tier === 'feature') return <FeatureEntry data={data} />;
  if (data.tier === 'short') return <ShortEntry data={data} />;
  return <InDevelopmentEntry data={data} />;
};

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
        .lab-open { border-bottom: 1px solid ${LAB.border}; padding-bottom: 0.4rem; transition: border-color 0.3s ease; }
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
            <h1
              className="text-[2.4rem] md:text-[3.5rem] leading-none"
              style={{ fontFamily: SERIF_DISPLAY, color: LAB.ink }}
            >
              Ghost Mode Labs
            </h1>
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
            <Entry data={e} />
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

      {/* Cream coda: the rhythm continues into About */}
      <footer className="px-6 md:px-24 py-20 md:py-28 flex items-baseline justify-between">
        <p
          className="text-[1rem] italic leading-relaxed"
          style={{ fontFamily: SERIF_BODY, color: 'var(--ink-mute)', maxWidth: '52ch' }}
        >
          About follows: the person behind both chapters.
        </p>
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
