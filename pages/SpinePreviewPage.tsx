import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ColorBridge, ChapterRail, RailSection } from '../components/chapter';
import { ProductionsChapter, PRODUCTIONS_FIRST_COLOR, PRODUCTIONS_LAST_COLOR } from './ProductionsPreviewPage';
import { LabsChapter, LAB } from './LabsPreviewPage';

/**
 * PROTOTYPE: not linked from site navigation.
 * Phase 1, the Spine (REDESIGN-PLAN.md section 4): Cover, Productions,
 * Ghost Mode Labs, and About stitched into one continuous scroll, with a
 * persistent chapter rail and anchor deep-links. Reuses the Productions
 * and Labs chapters from their own preview pages unchanged; only the
 * connective tissue (bridges, rail, cover, colophon) is new here.
 *
 * The About section below is a Phase 1 stand-in: enough to prove the
 * spine's structure and anchors, reusing AboutModal's existing bio
 * verbatim. The full colophon (Family Sentence, teaching, awards) is
 * Phase 4 scope per the plan and isn't built here.
 */

const RAIL_SECTIONS: RailSection[] = [
  { id: 'productions', index: '01', label: 'Productions', dark: false },
  { id: 'labs', index: '02', label: 'Ghost Mode', dark: true },
  { id: 'about', index: '03', label: 'About', dark: false },
];

const CONTENTS = [
  { id: 'productions', index: '01', label: 'Productions' },
  { id: 'labs', index: '02', label: 'Ghost Mode Labs' },
  { id: 'about', index: '03', label: 'About' },
];

const VALID_CHAPTERS = new Set(RAIL_SECTIONS.map((s) => s.id));

const scrollToSection = (id: string, behavior: ScrollBehavior = 'smooth') => {
  document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' });
};

const SpinePreviewPage: React.FC = () => {
  const { chapter } = useParams<{ chapter?: string }>();

  // Old-route deep links (/preview/spine/productions etc.) land on the
  // matching anchor instead of the top of the page.
  useEffect(() => {
    // No rAF here: every section is always mounted (never conditionally
    // rendered), so the target's layout is already correct on this render
    // and there's nothing to wait a frame for. (An rAF-deferred version of
    // this was found, while testing, to silently never fire in a
    // backgrounded/occluded tab, since Chromium throttles rAF callbacks
    // to near-zero when the page isn't visible; scrollIntoView needs no
    // such deferral, so it isn't exposed to that throttling at all.)
    if (chapter && VALID_CHAPTERS.has(chapter)) {
      scrollToSection(chapter, 'auto');
    } else {
      window.scrollTo(0, 0);
    }
  }, [chapter]);

  return (
    <div style={{ backgroundColor: 'var(--bg-site)' }}>
      <ChapterRail sections={RAIL_SECTIONS} />

      {/* Cover */}
      <header className="px-6 md:px-20 pt-12 pb-16 md:pt-16 md:pb-24">
        <div className="flex items-baseline justify-between">
          <span className="chapter-label" style={{ color: 'var(--ink-mute)' }}>
            Jeanine Emilia Cornillot
          </span>
          <span className="chapter-label" style={{ color: 'var(--ink-faint)' }}>
            Prototype
          </span>
        </div>
      </header>

      <section className="px-6 md:px-20 pt-8 pb-28 md:pt-16 md:pb-40">
        <h1
          style={{
            fontFamily: "'Bodoni Moda', serif",
            fontSize: 'var(--display-md)',
            lineHeight: 0.95,
            letterSpacing: '-0.015em',
            color: 'var(--ink)',
          }}
        >
          Jeanine Emilia Cornillot
        </h1>
        <p
          className="mt-6 md:mt-8 text-[1.05rem] md:text-[1.2rem] leading-relaxed"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: 'var(--ink-mute)', maxWidth: '48ch' }}
        >
          Emmy and Ambie Award-winning executive producer and showrunner across
          podcasts and television. At Ghost Mode Labs, she develops original IP
          and prototypes new ways to tell stories.
        </p>

        {/* Contents: teaches the structure in the first viewport */}
        <nav aria-label="Contents" className="mt-16 md:mt-24 flex flex-col gap-4 md:gap-5">
          {CONTENTS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => scrollToSection(c.id)}
              className="chapter-rail-btn chapter-rail-btn-light group flex items-baseline gap-4 text-left w-fit"
            >
              <span className="chapter-label" style={{ color: 'var(--terra)' }}>
                {c.index}
              </span>
              <span
                className="text-[1.4rem] md:text-[1.8rem] transition-colors duration-300 group-hover:opacity-70"
                style={{ fontFamily: "'Bodoni Moda', serif", color: 'var(--ink)' }}
              >
                {c.label}
              </span>
            </button>
          ))}
        </nav>
      </section>

      {/* Chapter 01: Productions */}
      <div id="productions">
        <ColorBridge from="var(--bg-site)" to={PRODUCTIONS_FIRST_COLOR} />
        <ProductionsChapter />
        <ColorBridge
          from={PRODUCTIONS_LAST_COLOR}
          to={LAB.ground}
          heightClassName="h-[32vh] md:h-[40vh]"
        />
      </div>

      {/* Chapter 02: Ghost Mode Labs */}
      <div id="labs">
        <LabsChapter />
      </div>

      <ColorBridge from={LAB.ground} to="var(--bg-site)" heightClassName="h-[32vh] md:h-[40vh]" />

      {/* Colophon: About (Phase 1 stand-in, see file header) */}
      <section id="about" className="px-6 md:px-20 pt-8 pb-24 md:pt-12 md:pb-36">
        <h2
          style={{
            fontFamily: "'Bodoni Moda', serif",
            fontSize: 'var(--display-md)',
            color: 'var(--ink)',
          }}
        >
          About
        </h2>
        <div
          className="mt-8 md:mt-10 space-y-5 text-[1.02rem] leading-relaxed"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: 'var(--ink-mute)', maxWidth: '58ch' }}
        >
          <p>
            Emmy and Ambie Award-winning executive producer and showrunner.
            300+ episodes across podcasts, television, and digital.
          </p>
          <p>
            Created Scamfluencers (53M downloads, #1 Apple Podcasts). Produced
            Dying for Sex (Apple Podcast of the Year, adapted as a
            Peabody-winning FX series with 9 Emmy nominations). Created The
            Last City (scripted sci-fi, #1 Apple Fiction in 20 countries).
          </p>
          <p>Founded Wondery&rsquo;s first Creator Lab, training 50+ staff on AI creative tools.</p>
          <p>
            At Ghost Mode Labs, she develops original IP and prototypes new
            ways to research, develop, and extend stories across scripted,
            nonfiction, and interactive formats.
          </p>
        </div>
        <div className="mt-10 flex items-center gap-2 chapter-label" style={{ color: 'var(--ink-faint)' }}>
          <span>Full colophon (Family Sentence, teaching, awards) lands in Phase 4</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-20 py-16 md:py-20 flex flex-col md:flex-row items-baseline justify-between gap-6">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="chapter-rail-btn chapter-rail-btn-light chapter-label"
          style={{ color: 'var(--ink-mute)' }}
        >
          Back to cover
        </button>
        <div className="flex items-center gap-6 chapter-label" style={{ color: 'var(--ink-mute)' }}>
          <a
            href="https://www.linkedin.com/in/jcornillot"
            target="_blank"
            rel="noopener noreferrer"
            className="chapter-rail-btn-light hover:opacity-70 transition-opacity"
          >
            LinkedIn
          </a>
          <a
            href="mailto:iamjeanine@me.com"
            className="chapter-rail-btn-light hover:opacity-70 transition-opacity"
          >
            Email
          </a>
        </div>
      </footer>
    </div>
  );
};

export default SpinePreviewPage;
