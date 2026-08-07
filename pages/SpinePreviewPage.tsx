import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Hero from '../components/Hero';
import { ColorBridge, ChapterRail, MotionToggle, RailSection } from '../components/chapter';
import { ProductionsChapter, PRODUCTIONS_FIRST_COLOR, PRODUCTIONS_LAST_COLOR } from './ProductionsPreviewPage';
import { LabsChapter, LAB } from './LabsPreviewPage';

/**
 * PROTOTYPE: not linked from site navigation.
 * The Spine (REDESIGN-PLAN.md section 4): Cover, Productions, Ghost Mode
 * Labs, and the About colophon stitched into one continuous scroll, with
 * a persistent chapter rail and anchor deep-links. Reuses the Productions
 * and Labs chapters from their own preview pages unchanged; the
 * connective tissue (bridges, rail, cover, colophon) is built here.
 *
 * The About colophon (below) is Phase 4's full build per section 7: bio
 * narrative plus structured Awards/Teaching/Publications lists. Teaching
 * has no source content anywhere in constants.ts or Appendix A, so per
 * 8.3 it renders as an honest pending marker rather than invented copy,
 * the same pattern Visual Audiobooks uses in the Labs chapter.
 */

// Colophon data (REDESIGN-PLAN.md section 7). Every entry is drawn from
// Appendix A or constants.ts; nothing here is invented (8.3). Ordered to
// match the Productions chapter's own spread order, then Labs. Hollywood &
// Crime and Life of Kylie are correctly absent: Appendix A states their
// value is prose-only, with no stat to list.
const AWARDS: { title: string; detail: string }[] = [
  {
    title: 'Scamfluencers',
    detail:
      'Winner, 2023 Ambie for Best Entertainment Podcast, with a second nomination in 2025. Vogue’s Best Podcasts of the Year. Apple’s Creators We Love.',
  },
  {
    title: 'Dying for Sex',
    detail:
      'Winner, Ambie Podcast of the Year, 2021. Named to Apple Podcasts’ Favorites of the Year. Its FX adaptation won a Peabody Award, with 9 Primetime Emmy nominations.',
  },
  {
    title: 'The Last City',
    detail: '#1 Apple Fiction in 20 countries. Ambie Best Fiction nominee.',
  },
  {
    title: 'Born This Way',
    detail: '3 wins, 16 Primetime Emmy nominations.',
  },
  {
    title: 'No Passport Required',
    detail: 'Winner, James Beard Media Award.',
  },
  {
    title: 'Multiverse Quad',
    detail: 'Shortlisted for Amazon’s AWS re:Invent keynote.',
  },
];

const PUBLICATIONS: { title: string; detail: string }[] = [
  { title: 'Family Sentence', detail: 'Beacon Press' },
];

const ColophonList: React.FC<{
  label: string;
  items?: { title: string; detail: string }[];
  pending?: string;
}> = ({ label, items, pending }) => (
  <div>
    <p className="chapter-label" style={{ color: 'var(--terra-text)' }}>
      {label}
    </p>
    {items && (
      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <li key={item.title}>
            <p
              className="text-[0.95rem]"
              style={{ fontFamily: "'Bodoni Moda', serif", color: 'var(--ink)' }}
            >
              {item.title}
            </p>
            <p
              className="mt-1 text-[0.85rem] leading-relaxed"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: 'var(--ink-mute)', maxWidth: '38ch' }}
            >
              {item.detail}
            </p>
          </li>
        ))}
      </ul>
    )}
    {pending && (
      <p
        className="mt-4 chapter-label"
        style={{ color: 'var(--ink-faint)' }}
      >
        {pending}
      </p>
    )}
  </div>
);


const RAIL_SECTIONS: RailSection[] = [
  { id: 'productions', index: '01', label: 'Productions' },
  { id: 'labs', index: '02', label: 'Ghost Mode' },
  { id: 'about', index: '03', label: 'About' },
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

/**
 * Skip-link target handling: scroll there and move focus, so a keyboard
 * visitor's next Tab continues inside the chapter they jumped to rather
 * than back at the top of the document. The targets carry tabIndex={-1}
 * so they can receive programmatic focus without joining the tab order.
 */
const skipToSection = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  el.focus({ preventScroll: true });
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
      {/* Skip links (8.7): first in the tab order, offscreen until focused.
          Buttons rather than href anchors on purpose: this site runs on
          HashRouter, so an href="#productions" would read as a route change
          and navigate away instead of jumping down the page. These also move
          focus to the target, not just the scroll position, so tabbing
          continues from the chapter the visitor landed on. */}
      <nav aria-label="Skip to chapter">
        {RAIL_SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            className="chapter-skip-link"
            onClick={() => skipToSection(s.id)}
          >
            Skip to {s.label}
          </button>
        ))}
      </nav>

      <ChapterRail sections={RAIL_SECTIONS} />
      <MotionToggle />

      {/*
        The Cover proper (4.3, "cover restage"): the real hero, unchanged
        from the live site, carrying the name as the page's single h1, its
        video, the scroll-driven recession, and its own mute control. Earlier
        phases stood in a text-only placeholder here and never came back for
        this, which left the publication opening on words alone.
      */}
      <Hero />

      {/*
        Everything after the Cover rides over the sticky hero, the same
        z-index handoff HomePage uses, so the hero recedes as the contents
        page climbs over it.
      */}
      <div className="relative" style={{ zIndex: 2, backgroundColor: 'var(--bg-site)' }}>
        {/* Contents page: the magazine beat straight after a cover. The name
            is not repeated here, since the hero above already carries it as
            the h1. */}
        <section className="px-6 md:px-20 pt-20 pb-28 md:pt-28 md:pb-40">
          <p className="chapter-label" style={{ color: 'var(--ink-mute)' }}>
            Contents
          </p>
          <nav aria-label="Contents" className="mt-10 md:mt-14 flex flex-col gap-5 md:gap-6">
            {CONTENTS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => scrollToSection(c.id)}
                className="chapter-rail-btn chapter-rail-btn-light group flex items-baseline gap-5 text-left w-fit"
              >
                <span className="chapter-label tabular-nums" style={{ color: 'var(--terra-text)' }}>
                  {c.index}
                </span>
                <span
                  className="text-[1.6rem] md:text-[2.2rem] transition-opacity duration-300 group-hover:opacity-70"
                  style={{ fontFamily: "'Bodoni Moda', serif", color: 'var(--ink)' }}
                >
                  {c.label}
                </span>
              </button>
            ))}
          </nav>
        </section>

      {/* Chapter 01: Productions */}
      <div id="productions" tabIndex={-1}>
        <ColorBridge from="var(--bg-site)" to={PRODUCTIONS_FIRST_COLOR} />
        <ProductionsChapter />
        <ColorBridge from={PRODUCTIONS_LAST_COLOR} to="var(--bg-site)" />

        {/*
          Cream breather: Kylie's field and the Labs ground are both
          near-black, so a bridge straight between them has no visible
          swing and the "lights down" moment disappears. Surfacing back
          to paper first, however briefly, gives the real dip (below) a
          light stop to fall from.
        */}
        <div className="px-6 md:px-20 py-16 md:py-20" style={{ backgroundColor: 'var(--bg-site)' }}>
          <p
            className="text-[1rem] italic leading-relaxed"
            style={{ fontFamily: "'Source Serif 4', serif", color: 'var(--ink-mute)', maxWidth: '52ch' }}
          >
            Ghost Mode Labs follows: the studio for what she is building next.
          </p>
        </div>
      </div>

      {/* The biggest lightness swing in the spine: paper diving into the
          Labs ground. Kept outside both chapter ids since it belongs to
          neither. */}
      <ColorBridge from="var(--bg-site)" to={LAB.ground} heightClassName="h-[32vh] md:h-[40vh]" />

      {/* Chapter 02: Ghost Mode Labs */}
      <div id="labs" tabIndex={-1}>
        <LabsChapter onAbout={() => scrollToSection('about')} />
      </div>

      <ColorBridge from={LAB.ground} to="var(--bg-site)" heightClassName="h-[32vh] md:h-[40vh]" />

      {/* Colophon: About (REDESIGN-PLAN.md section 7). Editorial
          masthead form: bio narrative and structured lists side by side,
          no cards, no icons, no timeline graphics. */}
      <section id="about" tabIndex={-1} className="px-6 md:px-20 pt-8 pb-24 md:pt-12 md:pb-36">
        <h2
          style={{
            fontFamily: "'Bodoni Moda', serif",
            fontSize: 'var(--display-md)',
            color: 'var(--ink)',
          }}
        >
          About
        </h2>

        {/* Two columns from lg, not md: at exactly 768px the 12-column grid's
            eleven 64px gutters exceed the 608px content box, which pushed 16px
            of horizontal scroll onto the whole page (caught in the Phase 5
            critique). Below lg the colophon stacks, which also reads better in
            the 768 to 1023 band than two cramped columns would. */}
        <div className="mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Bio narrative. Accolade specifics live in the Awards list
              instead of here now, so the two don't repeat each other. */}
          <div
            className="lg:col-span-6 space-y-5 text-[length:var(--body)] leading-relaxed"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: 'var(--ink-mute)', maxWidth: '52ch' }}
          >
            <p>
              Emmy and Ambie Award-winning executive producer and showrunner.
              300+ episodes across podcasts, television, and digital.
            </p>
            <p>
              Created Scamfluencers, produced Dying for Sex, and created The
              Last City for Wondery and Amazon.
            </p>
            <p>
              Founded Wondery&rsquo;s first AI Creator Lab, growing it from four
              people to more than fifty across the company.
            </p>
            <p>
              At Ghost Mode Labs, she develops original IP and prototypes new
              ways to research, develop, and extend stories across scripted,
              nonfiction, and interactive formats.
            </p>
            <p>
              She is the author of <em>Family Sentence</em> (Beacon Press).
            </p>
          </div>

          {/* Structured lists */}
          {/* col-start-7, not 8: starting at 8 left a ~350px void between the
              bio and the lists that broke the masthead read. */}
          <div className="lg:col-span-6 lg:col-start-7 flex flex-col gap-10">
            <ColophonList label="Awards" items={AWARDS} />
            <ColophonList label="Teaching" pending="Details to come" />
            <ColophonList label="Publications" items={PUBLICATIONS} />
          </div>
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
    </div>
  );
};

export default SpinePreviewPage;
