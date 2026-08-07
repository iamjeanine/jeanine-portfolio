import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ColorBridge, Eyebrow, LazyVideo, SpreadShell } from '../components/chapter';

/**
 * PROTOTYPE: not linked from site navigation.
 * Ghost Mode Labs chapter: one continuous near-black ground, a single
 * spectral accent, video-led entries with wide cinematic spacing.
 * Deliberately inverts the Productions chapter's per-spread color fields.
 * All media streams from the Google Cloud bucket; nothing local.
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

interface LabEntry {
  id: string; // links to the existing /project/:id detail page
  index: string;
  client: string;
  title: React.ReactNode;
  tagline: string;
  description?: string;
  stat?: { value: string; label: string };
  video: { src: string; poster?: string; alt: string };
  note?: string;
  flip?: boolean;
}

// Order mirrors constants.ts, which Jeanine curated for the live grid.
// Copy is tightened from each project's existing description; no new claims.
const ENTRIES: LabEntry[] = [
  {
    id: 'visual-audiobooks',
    index: 'L-01',
    client: 'Ghost Mode Labs',
    title: 'Visual Audiobooks',
    tagline: 'A new visual telling with every listen',
    note: 'Coming soon',
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/visual-audiobook-cover.mp4',
      alt: 'Visual Audiobooks cover video',
    },
  },
  {
    id: 'static',
    index: 'L-02',
    client: 'Ghost Mode Labs',
    title: 'Static',
    tagline: 'Scripted series built from online folklore',
    description:
      'Thousands of people vanish in the American wilderness every year, and thirteen Reddit communities have spent a decade building folklore around them. Last Active, a research tool built for this, found 582 recurring overlaps across 6,884 accounts. Static is the first story to come out of it.',
    stat: { value: '7,000 voices', label: 'One American haunting' },
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/Static.mp4',
      alt: 'Static cover video',
    },
    flip: true,
  },
  {
    id: 'multiverse-quad',
    index: 'L-03',
    client: 'Amazon AGI',
    title: 'Multiverse Quad',
    tagline: 'One story, four formats',
    description:
      'A single narrative adapted into an animated short film, a graphic novel, a visual audiobook, and a podcast, unfolding at the same time. Pitched to Amazon’s AGI team and built into a working demo with engineers, scientists, and product leadership.',
    stat: { value: 'AWS re:Invent', label: 'Shortlisted for the keynote' },
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/CoverLCaudio2.mp4',
      alt: 'Multiverse Quad cover video',
    },
  },
  {
    id: 'ai-creator-lab',
    index: 'L-04',
    client: 'Wondery',
    title: 'AI Creator Lab',
    tagline: 'Creative workflow lab',
    description:
      'Wondery’s first AI Creator Lab: hands-on workshops, learning modules, and outside partners demonstrating new tools inside real production workflows. Three working tools came out of it.',
    stat: { value: '4 to 50+', label: 'People across the company' },
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/AI%20Creator%20Lab%202%20-%20New%20Cover%20.mp4',
      poster: 'https://storage.googleapis.com/jeanine-portfolio-video/B6-Cover2-poster.jpg',
      alt: 'AI Creator Lab cover video',
    },
    flip: true,
  },
  {
    id: 'mythos',
    index: 'L-05',
    client: 'Ghost Mode Labs',
    title: 'MythOS',
    tagline: 'Franchise intelligence',
    description:
      'An interactive globe that tracks how myths travel across cultures and centuries. Click Circe and it lights up with every culture that told her story, 46 of them across 3,500 years. Built for studio development and franchise teams.',
    stat: { value: '494', label: 'Source stories in the prototype' },
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/MythOS%20Cover3.mp4',
      alt: 'MythOS cover video',
    },
  },
  {
    id: 'narrative-space',
    index: 'L-06',
    client: 'Ghost Mode Labs',
    title: 'Narrative Space',
    tagline: 'Interactive world building',
    description:
      'Story worlds usually begin as documents. Narrative Space turns that material into something you can explore: characters, locations, and themes as nodes in a living space you can move through, question, and build in.',
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/Sphere%20Cover%202.mp4',
      alt: 'Narrative Space cover video',
    },
    flip: true,
  },
  {
    id: 'unstill',
    index: 'L-07',
    client: 'Ghost Mode Labs',
    title: 'Unstill',
    tagline: 'Regenerative lives',
    description:
      '1920s Sydney, through what survives in the archive: a name, a date, a charge. Hover and color returns to the photograph. Click and the portrait begins to breathe. Built as a proposal for Museums of History NSW.',
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/Face-compressed.mp4',
      alt: 'Unstill cover video',
    },
  },
  {
    id: 'tender',
    index: 'L-08',
    client: 'Ghost Mode Labs',
    title: 'Tender',
    tagline: 'Conversation with culture',
    description:
      'A library of films, essays, poems, myths, and podcasts chosen by people who care deeply about culture. Tell Tender how you are feeling and it finds something to meet you there. Part human curation, part conversational system.',
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/Cover2%20Tender%20Updated.mp4',
      alt: 'Tender cover video',
    },
    flip: true,
  },
  {
    id: 'in-world-social-campaign',
    index: 'L-09',
    client: 'Wondery',
    title: 'In-World Social Campaign',
    tagline: 'In-world marketing',
    description:
      'For The Last City, the marketing came from inside the story: destination posts, recruitment ads, a trailer made as if the city had its own creative agency. More than a dozen prototypes; two moved into production.',
    video: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/Cover%20StoryCraft5.mp4',
      alt: 'In-World Social Campaign cover video',
    },
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

const Entry: React.FC<{ data: LabEntry }> = ({ data }) => (
  <article className="pb-32 md:pb-56">
    <Reveal>
      <Eyebrow label={data.client} index={data.index} labelColor={LAB.inkSoft} indexColor={LAB.accent} />

      {/* title */}
      <h2
        className="mt-8 md:mt-12"
        style={{
          fontFamily: SERIF_DISPLAY,
          fontSize: 'clamp(2.6rem, 7.5vw, 7.5rem)',
          lineHeight: 0.95,
          letterSpacing: '-0.015em',
          color: LAB.ink,
        }}
      >
        {data.title}
      </h2>

      {/* body: video and a thin text column, alternating sides */}
      <div className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
        <div
          className={`md:col-span-8 order-1 ${
            data.flip ? 'md:col-start-5 md:order-2' : 'md:col-start-1 md:order-1'
          }`}
        >
          <LazyVideo
            src={data.video.src}
            poster={data.video.poster}
            alt={data.video.alt}
            fallbackTitle={data.title}
          />
        </div>

        <div
          className={`md:col-span-4 md:pt-4 order-2 ${
            data.flip ? 'md:col-start-1 md:row-start-1 md:order-1' : 'md:order-2'
          }`}
        >
          <p className="text-[0.8rem] tracking-[0.14em] uppercase" style={{ color: LAB.accent }}>
            {data.tagline}
          </p>

          {data.description && (
            <p
              className="mt-5 text-[1.02rem] leading-relaxed"
              style={{ fontFamily: SERIF_BODY, color: LAB.inkBody, maxWidth: '38ch' }}
            >
              {data.description}
            </p>
          )}

          {data.stat && (
            <div className="mt-10 md:mt-14">
              <p
                className="italic"
                style={{
                  fontFamily: SERIF_DISPLAY,
                  fontSize:
                    data.stat.value.length > 6
                      ? 'clamp(1.9rem, 2.8vw, 2.8rem)'
                      : 'clamp(3rem, 5vw, 4.5rem)',
                  lineHeight: 1.05,
                  color: LAB.ink,
                  maxWidth: '14ch',
                }}
              >
                {data.stat.value}
              </p>
              <p className="mt-2 text-[0.7rem] tracking-[0.18em] uppercase" style={{ color: LAB.inkSoft }}>
                {data.stat.label}
              </p>
            </div>
          )}

          {data.note ? (
            <p
              className="mt-8 inline-block text-[0.7rem] tracking-[0.18em] uppercase px-3 py-1.5"
              style={{ color: LAB.accent, border: `1px solid ${LAB.border}` }}
            >
              {data.note}
            </p>
          ) : (
            <Link
              to={`/project/${data.id}`}
              className="lab-open mt-10 inline-flex items-baseline gap-2 text-[0.75rem] tracking-[0.18em] uppercase"
              style={{ color: LAB.ink }}
            >
              Open project
              <span aria-hidden="true" style={{ color: LAB.accent }}>
                &rarr;
              </span>
            </Link>
          )}
        </div>
      </div>
    </Reveal>
  </article>
);

/**
 * The chapter's dark ground, header, and entries only. No boundary
 * bridges: the page or Spine composing this owns the transition to
 * whatever comes before and after.
 */
export const LabsChapter: React.FC = () => (
  <>
    <style>{`
      .lab-open { border-bottom: 1px solid ${LAB.border}; padding-bottom: 0.4rem; transition: border-color 0.3s ease; }
      .lab-open:hover { border-color: ${LAB.accent}; }
    `}</style>
    <SpreadShell
      as="div"
      background={LAB.ground}
      overflowHidden={false}
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

      {ENTRIES.map((e) => (
        <Entry key={e.id} data={e} />
      ))}
    </SpreadShell>
  </>
);

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
