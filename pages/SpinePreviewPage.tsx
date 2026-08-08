import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ColorBridge, ChapterRail, MotionToggle, RailSection, GRAIN_URI, gradientEnd } from '../components/chapter';
import {
  ProductionsChapter,
  PRODUCTIONS_FIRST_COLOR,
  PRODUCTIONS_LAST_COLOR,
  SCAMFLUENCERS_FIELD,
  SCAMFLUENCERS_INK,
  SCAMFLUENCERS_INK_SOFT,
  SCAMFLUENCERS_ACCENT,
} from './ProductionsPreviewPage';
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
  // Matches CONTENTS' label exactly: the two used to read "Ghost Mode" here
  // and "Ghost Mode Labs" there, confirmed live as a real inconsistency
  // (Impeccable navigation critique) even before the rail/Contents overlap
  // itself was fixed.
  { id: 'labs', index: '02', label: 'Ghost Mode Labs' },
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

// Credential-line only, not Scamfluencers' own accent (the kicker and
// Contents index below keep that, for continuity with the first spread
// this cover opens directly into). Warm gold instead of the field's
// loudest, coolest-temperature color: Jeanine flagged the shared
// chartreuse as reading like caution tape at the size and weight a
// credential line needs. Verified against all three field stops before
// shipping: 3.37-4.40:1, clears 3:1 for bold text at this size.
const COVER_CREDENTIAL_ACCENT = '#E9B94C';

/**
 * The Cover (REDESIGN-PLAN.md 4.3, restaged 2026-08-07 per an Impeccable
 * critique run on three candidates at /preview/cover-options): typographic,
 * set directly on Scamfluencers' own field, ink, and accent, the literal
 * color the first Productions spread opens on, so cover and chapter read
 * as one continuous gesture instead of three moods (the live site's
 * AI-generated video hero, then a cream Contents page, then a
 * burnt-orange first spread) before a reader arrives anywhere. The other
 * candidate considered, a full-bleed still from The Last City, was
 * rejected on measurement, not taste: it reopened the same "different
 * mood at the seam" problem in the opposite direction (near-black into
 * warm terra), and it would have spent the chapter's own most striking
 * image before a reader ever reaches that spread.
 *
 * Carries the page's one h1. Replaces both the old video hero and the
 * separate Contents section that used to sit below it: this is the
 * "contents block in the magazine idiom" the plan called for, folded into
 * the same viewport as the name rather than a second screen after it, so
 * the rail and this list are never the same information shown twice.
 */
const Cover: React.FC<{ onSelectChapter: (id: string) => void }> = ({ onSelectChapter }) => (
  <section
    id="cover"
    // justify-start below lg, not justify-between: on a min-h-screen flex
    // column with two short blocks, justify-between distributes ALL
    // leftover vertical space into the gap between them, measured at
    // roughly a third of a 375px viewport, worse still at 768x1024
    // portrait (the same md-band-reads-as-a-tall-phone issue the
    // Productions layout review already found and fixed the same way).
    // justify-start plus the fixed mt-20 below replaces that with a
    // chosen amount at every width under 1024px; true desktop (>=1024px,
    // checked at both 1024 and 1440) keeps the original space-between,
    // unaffected.
    className="relative min-h-screen flex flex-col justify-start lg:justify-between px-6 md:px-20 pt-20 md:pt-28 pb-12 md:pb-16"
    style={{ background: SCAMFLUENCERS_FIELD }}
  >
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none mix-blend-overlay"
      style={{ backgroundImage: GRAIN_URI, opacity: 0.05 }}
    />

    <div className="relative">
      <p className="chapter-label" style={{ color: SCAMFLUENCERS_ACCENT }}>
        Selected work
      </p>
      <h1
        className="mt-8 md:mt-10"
        style={{
          fontFamily: "'Bodoni Moda', serif",
          fontSize: 'var(--display-xl)',
          lineHeight: 0.88,
          letterSpacing: '-0.02em',
          color: SCAMFLUENCERS_INK,
        }}
      >
        Jeanine Emilia
        <br />
        Cornillot
      </h1>
    </div>

    <div className="relative mt-20 lg:mt-0 flex flex-col md:flex-row md:items-end md:justify-between gap-10 md:gap-16">
      <div style={{ maxWidth: '34ch' }}>
        <p
          className="text-[1.3rem] md:text-[1.5rem] font-bold leading-snug"
          style={{ fontFamily: "'Uncut Sans', sans-serif", color: COVER_CREDENTIAL_ACCENT }}
        >
          Emmy and Ambie Award-winning showrunner.
        </p>
        <p
          className="mt-3 md:mt-4 text-[1rem] md:text-[1.15rem] leading-relaxed"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: SCAMFLUENCERS_INK_SOFT }}
        >
          Podcasts, television, and Ghost&nbsp;Mode&nbsp;Labs.
        </p>
      </div>

      <nav aria-label="Contents" className="flex flex-col gap-3 md:items-end">
        {CONTENTS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectChapter(c.id)}
            // The fixed ChapterRail's own inactive/focus colors (--terra,
            // --ember) both measure under 3:1 against this field (1.24-1.62
            // and 2.96-3.87 across its three stops), so neither existing
            // rail focus-ring class is safe here. Scamfluencers' own accent
            // already clears 5.57-7.27:1 against the same stops, so the
            // focus ring borrows it directly rather than reusing an outline
            // color that would be nearly invisible on this specific field.
            className="chapter-rail-btn group flex items-baseline gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: SCAMFLUENCERS_ACCENT }}
          >
            <span className="chapter-label tabular-nums" style={{ color: SCAMFLUENCERS_ACCENT }}>
              {c.index}
            </span>
            <span
              className="text-[1.35rem] md:text-[1.6rem] transition-opacity duration-300 group-hover:opacity-70"
              style={{ fontFamily: "'Bodoni Moda', serif", color: SCAMFLUENCERS_INK }}
            >
              {c.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  </section>
);

const SpinePreviewPage: React.FC = () => {
  const { chapter } = useParams<{ chapter?: string }>();
  const navigate = useNavigate();

  // Tracks the last chapter *this component* wrote into the URL, whether
  // via a deliberate click or a passive-scroll sync below. When `chapter`
  // changes to that same value, the effect below knows it caused the
  // change itself (the visitor is already there) and skips re-scrolling.
  // When `chapter` changes to anything else, the effect knows it came from
  // outside: the initial load, a pasted link, or Back/Forward, and scrolls
  // there for real. Without this guard, syncing the URL on every passive
  // scroll (below) would re-trigger this same effect and fight the
  // visitor's own scrolling.
  const lastSyncedChapter = useRef<string | undefined>(undefined);

  // Old-route deep links (/preview/spine/productions etc.), and now also
  // Back/Forward between chapters, land on the matching anchor instead of
  // the top of the page (Impeccable navigation critique, P2: Back/Forward
  // previously did nothing between chapters, and reload always dropped a
  // visitor at the Cover, since nothing ever wrote the chapter into the URL).
  useEffect(() => {
    if (chapter === lastSyncedChapter.current) return;
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
    lastSyncedChapter.current = chapter;
  }, [chapter]);

  // Deliberate navigation from the Contents block: push a real history
  // entry, so Back can undo the jump, and scroll there directly (Contents'
  // buttons own their scroll; unlike the rail, nothing else has already
  // moved the viewport before this runs).
  const goToChapter = (id: string) => {
    lastSyncedChapter.current = id;
    navigate(`/preview/spine/${id}`);
    scrollToSection(id);
  };

  // ChapterRail's onNavigate: the rail and its mobile menu already do their
  // own scrollIntoView before calling this, so it only needs to push the
  // history entry, not scroll again.
  const pushChapterUrl = (id: string) => {
    lastSyncedChapter.current = id;
    navigate(`/preview/spine/${id}`);
  };

  const goToChapterViaSkipLink = (id: string) => {
    lastSyncedChapter.current = id;
    navigate(`/preview/spine/${id}`);
    skipToSection(id);
  };

  const goToCover = () => {
    lastSyncedChapter.current = undefined;
    navigate('/preview/spine');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Passive scroll: silently keep the URL in step via history.replace (no
  // new entry, so ordinary scrolling never floods Back/Forward), purely so
  // reload or a copied link lands back where the visitor actually was.
  // undefined means the visitor has scrolled back up past every chapter to
  // the Cover (or Contents); the URL clears with them rather than sticking
  // to whichever chapter they last passed through.
  const syncActiveChapterToUrl = (id: string | undefined) => {
    lastSyncedChapter.current = id;
    navigate(id ? `/preview/spine/${id}` : '/preview/spine', { replace: true });
  };

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
            onClick={() => goToChapterViaSkipLink(s.id)}
          >
            Skip to {s.label}
          </button>
        ))}
      </nav>

      <ChapterRail
        sections={RAIL_SECTIONS}
        hideWhileVisibleId="cover"
        onNavigate={pushChapterUrl}
        onActiveChange={syncActiveChapterToUrl}
      />
      <MotionToggle />

      <Cover onSelectChapter={goToChapter} />

      {/* Chapter 01: Productions */}
      <div id="productions" tabIndex={-1}>
        {/* Cover and Scamfluencers share a field, but each element paints
            that gradient across its own box height, so the Cover's bottom
            edge and this spread's top edge land on different points along
            it (a bottom-anchored 100%-position color meeting a top-anchored
            0%-position one) without this bridge, the same hard-seam problem
            every inter-spread bridge below already exists to prevent, just
            one step earlier. from/to are computed the identical way those
            bridges are: gradientEnd of what came before, gradientStart of
            what's next, not "the fields already match so skip it." */}
        <ColorBridge from={gradientEnd(SCAMFLUENCERS_FIELD)} to={PRODUCTIONS_FIRST_COLOR} />
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
          onClick={goToCover}
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
