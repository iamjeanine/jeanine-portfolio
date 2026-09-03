import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ColorBridge, ChapterRail, MotionToggle, RailSection, gradientEnd, gradientStart } from '../components/chapter';
import { preferredScrollBehavior } from '../components/chapter/motionPreference';
import {
  ProductionsChapter,
  SCAMFLUENCERS_FIELD,
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
 * narrative plus structured Awards/Publications lists. Teaching was
 * dropped rather than shipped as a pending placeholder (Jeanine's call):
 * there's no real content for it yet, and "Details to come" read as
 * unfinished on a page meant to ship. Add it back once there's something
 * real to say.
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

const PROJECT_RETURN_SCROLL_KEY = 'portfolio-project-return-scroll';

const PROGRAMS: { title: string; detail: string }[] = [
  {
    title: 'Google Labs Trusted Tester',
    detail: 'Early access to pre-release AI tools',
  },
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

const AuthorColophon: React.FC = () => (
  <div
    aria-labelledby="about-author-label"
  >
    <p
      className="chapter-label"
      id="about-author-label"
      style={{ color: 'var(--terra-text)' }}
    >
      Author
    </p>

    <div className="mt-4">
      <h3
        className="text-[0.95rem]"
        style={{ fontFamily: "'Bodoni Moda', serif", color: 'var(--ink)' }}
      >
        Family Sentence
      </h3>
      <p
        className="mt-1 text-[0.85rem] leading-relaxed"
        style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: 'var(--ink-mute)', maxWidth: '38ch' }}
      >
        The Search for My Cuban-Revolutionary, Prison-Yard, Mythic-Hero, Deadbeat Dad
      </p>
      <p
        className="mt-4 text-[0.85rem] leading-relaxed"
        style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: 'var(--ink-mute)', maxWidth: '38ch' }}
      >
        Family Sentence, a memoir by Jeanine Cornillot published by Beacon Press,
        grew out of her audio documentary of the same name, produced at Transom with Viki Merrick
        and Jay Allison.
      </p>

      <p
        className="mt-4 text-[0.85rem] leading-relaxed"
        style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: 'var(--ink-mute)' }}
      >
        Publishers Weekly <strong className="font-bold" style={{ color: 'var(--ink)' }}>“Top 20” Fall Book Selection</strong>
      </p>
    </div>
  </div>
);


const RAIL_SECTIONS: RailSection[] = [
  { id: 'productions', index: '01', label: 'Productions' },
  // "Ghost Mode Labs" in full, matching the Cover's index label: the two
  // used to read "Ghost Mode" here and "Ghost Mode Labs" there, confirmed
  // live as a real inconsistency (Impeccable navigation critique) even
  // before the rail/Contents overlap itself was fixed.
  { id: 'labs', index: '02', label: 'Ghost Mode Labs' },
  { id: 'about', index: '03', label: 'About' },
];

const RAIL_SUPPRESSION_IDS = ['cover', 'contact-endcap'] as const;
const MOTION_TOGGLE_SUPPRESSION_IDS = ['labs-chapter-header', 'about'] as const;

const VALID_CHAPTERS = new Set(RAIL_SECTIONS.map((s) => s.id));

const scrollToSection = (id: string, behavior?: ScrollBehavior) => {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: behavior ?? preferredScrollBehavior(), block: 'start' });
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
  el.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'start' });
  el.focus({ preventScroll: true });
};

/**
 * One cropped headphone, treated as an editorial object rather than an
 * avatar. Its scale and interruption carry the hero; there is deliberately
 * no face for the object to explain or decorate.
 */
const HeadphoneMotif: React.FC = () => (
  <div className="cover-headphones" aria-hidden="true">
    <svg
      className="cover-headphones-desktop"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMaxYMid meet"
      role="presentation"
    >
      <g transform="rotate(-9 1280 280)">
        <path
          className="cover-headphones-band"
          pathLength="1"
          d="M 1118 292 C 1095 121, 1189 20, 1327 28 C 1464 36, 1523 143, 1484 310"
        />
        <path
          className="cover-headphones-band-inner"
          pathLength="1"
          d="M 1140 286 C 1124 144, 1203 58, 1322 64 C 1439 70, 1485 161, 1460 300"
        />
        <path
          className="cover-headphones-yoke"
          pathLength="1"
          d="M 1118 278 C 1091 303, 1081 327, 1083 354 M 1484 296 C 1499 320, 1501 344, 1492 370"
        />
        <g className="cover-headphones-earcup">
          <path
            d="M 1083 284 C 1124 254, 1205 257, 1239 297 C 1270 334, 1262 417, 1228 453 C 1193 490, 1105 479, 1076 436 C 1047 393, 1045 325, 1083 284 Z"
          />
          <path
            className="cover-headphones-earcup-seam"
            d="M 1105 307 C 1135 286, 1185 288, 1209 316 C 1232 343, 1226 401, 1202 427 C 1177 453, 1123 446, 1102 416 C 1081 386, 1078 337, 1105 307 Z"
          />
        </g>
        <g className="cover-headphones-earcup cover-headphones-earcup-back">
          <path
            d="M 1460 309 C 1498 284, 1559 293, 1583 331 C 1606 369, 1593 431, 1559 459 C 1526 487, 1466 467, 1447 428 C 1428 389, 1428 335, 1460 309 Z"
          />
          <path
            className="cover-headphones-earcup-seam"
            d="M 1480 331 C 1506 315, 1542 321, 1558 345 C 1574 370, 1565 412, 1542 430 C 1519 449, 1484 436, 1471 410 C 1459 383, 1459 349, 1480 331 Z"
          />
        </g>
        <path
          className="cover-headphones-cable"
          pathLength="1"
          d="M 1168 476 C 1171 562, 1244 588, 1225 682 C 1208 766, 1268 831, 1312 934"
        />
      </g>
    </svg>

    <svg
      className="cover-headphones-mobile"
      viewBox="0 0 390 844"
      preserveAspectRatio="none"
      role="presentation"
    >
      <path
        className="cover-headphones-band"
        pathLength="1"
        d="M 430 -26 C 356 34, 326 116, 348 194"
      />
      <path
        className="cover-headphones-band-inner"
        pathLength="1"
        d="M 414 -8 C 357 46, 340 118, 358 183"
      />
      <path
        className="cover-headphones-yoke"
        pathLength="1"
        d="M 348 188 C 334 209, 331 235, 339 258"
      />
      <g className="cover-headphones-earcup cover-headphones-earcup-mobile">
        <path
          d="M 375 111 C 423 82, 486 104, 512 156 C 538 208, 523 296, 481 337 C 437 379, 372 347, 347 296 C 323 246, 331 153, 375 111 Z"
        />
        <path
          className="cover-headphones-earcup-seam"
          d="M 395 143 C 425 126, 463 140, 479 174 C 495 208, 486 269, 459 294 C 432 320, 394 299, 380 267 C 366 235, 369 171, 395 143 Z"
        />
      </g>
      <path
        className="cover-headphones-cable"
        pathLength="1"
        d="M 352 317 C 336 407, 366 471, 350 557 C 336 643, 361 731, 374 872"
      />
    </svg>
  </div>
);

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
 * separate Contents section that used to sit below it.
 *
 * Contents lists the three chapters only, deliberately. A full 16-work
 * index lived here briefly (recruiter critique, P0) and Jeanine cut it: a
 * cover teases, a contents page lists, and the flat list under the name
 * read as a different document stapled onto the cover. The inventory job
 * moves into the chapters themselves via the front-of-book/back-of-book
 * restructure (a compact credits screen in Productions, a compact tier in
 * Labs); the per-work anchors and the PRODUCTIONS_INDEX/LABS_INDEX exports
 * stay wired so a proper contents beat can return without rebuilding.
 * The email stays with the credential: contact used to be the last element
 * on the page, ~30 viewport-heights deep, so any earlier bail lost it.
 * Mastheads print contact information.
 */
const Cover: React.FC<{ onSelectChapter: (id: string) => void }> = ({ onSelectChapter }) => {
  // Entrance, once, on mount. Ported from the video hero this Cover
  // replaced (components/Hero.tsx): the swap took the hero's staggered
  // blur-to-sharp settle and its scroll-driven zoom and left nothing in
  // their place, so the first thing a visitor does, scroll, got no
  // response from the page at all. Both an outside review and the
  // recruiter-persona pass landed on the same reading of that, one calling
  // it "nothing moves and nothing invites."
  //
  // Same durations and stagger as the original hero, so this reads as the
  // site's own gesture rather than a new one: 1200ms, lines at 300ms and
  // 550ms, supporting copy at 900ms and 1050ms, with the kicker added at
  // 150ms since the Cover has one and the hero did not. The letter-spacing
  // settle (0.08em to the Cover's own -0.02em) is the part that carries
  // the "type setting itself" quality; it is not decoration on top of a
  // fade.
  //
  // Curve retuned from the original hero's cubic-bezier(0.2,0.8,0.2,1)
  // (Jeanine, 2026-08-19): that curve front-loads motion hard -- 80% of
  // the distance covered in the first 20% of the duration -- so anything
  // riding it that isn't also softened by the name's blur (the tagline,
  // kicker, nav) read as popping into place and then sitting through an
  // imperceptible, overlong tail. Material's standard ease-in-out spreads
  // the same 1200ms evenly across a rise and settle instead of a snap and
  // coast, with no change to any of the durations or delays above.
  //
  // Reduced motion is read synchronously in the initial state, not in an
  // effect, so `shown` starts true and no transition property is ever
  // applied. Deferring that to an effect would paint one frame of an
  // invisible cover first, which is cheap to avoid and least acceptable
  // here of anywhere on the site.
  const [reduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [shown, setShown] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    // One frame of the pre-entrance state has to actually paint for the
    // transition to run at all; setting state directly in the effect would
    // batch into the same commit and jump straight to the end.
    let raf = 0;
    let begun = false;
    const begin = () => {
      if (begun) return;
      begun = true;
      raf = requestAnimationFrame(() => {
        if (!cancelled) setShown(true);
      });
    };
    // Bodoni Moda loads with font-display: swap and nothing else preloads
    // it. On a cold cache the swap from the fallback serif can land mid-
    // entrance, reflowing the headline into its real metrics on top of the
    // letter-spacing settle already in motion -- a second, uncontrolled
    // snap stacked on the deliberate one. Bounded so a slow or failed font
    // load can't hang the entrance itself.
    if (typeof document !== 'undefined' && 'fonts' in document) {
      const timeout = window.setTimeout(begin, 400);
      document.fonts.ready.then(() => {
        window.clearTimeout(timeout);
        begin();
      }).catch(begin);
    } else {
      begin();
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const entrance = (delay: number): React.CSSProperties =>
    reduced
      ? {}
      : {
          transition: `opacity 800ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 800ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, filter 800ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, letter-spacing 800ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        };

  return (
  <section
    id="cover"
    // justify-start at every width, not justify-between above lg: on a
    // min-h-screen flex column with two short blocks, justify-between
    // distributes ALL leftover vertical space into the gap between them.
    // Originally fixed only below 1024px (measured at roughly a third of a
    // 375px viewport, worse at 768x1024 portrait); desktop kept the
    // original space-between and the same defect just reappears there,
    // worse the taller the monitor (measured 215px at a 900px-tall
    // viewport, 515px at 1200px) since it scales with viewport height, not
    // content. justify-start plus the fixed lg:mt-28 below replaces that
    // with a chosen amount at every width; leftover height now collects
    // as trailing space below the credential block instead of a void
    // between it and the name.
    className="relative min-h-screen flex flex-col justify-start px-6 md:px-20 pt-20 md:pt-28 pb-12"
    style={{ background: SCAMFLUENCERS_FIELD }}
  >
    <HeadphoneMotif />

    <div className="relative z-10">
      <p
        className="chapter-label"
        style={{
          color: SCAMFLUENCERS_ACCENT,
          fontSize: '1.2rem',
          fontWeight: 700,
          opacity: shown ? 1 : 0,
          transform: shown ? 'none' : 'translateY(8px)',
          ...entrance(80),
        }}
      >
        Selected work
      </p>
      {/* Two spans rather than a <br />: each line settles on its own beat,
          which is what made the original hero's two-line name read as type
          arriving rather than a block fading in. letterSpacing lives on the
          spans, not the h1, because it is the animated property here. */}
      <h1
        className="mt-8 md:mt-10"
        style={{
          fontFamily: "'Bodoni Moda', serif",
          fontSize: 'var(--display-xl)',
          lineHeight: 0.88,
          color: 'var(--poppy-ink)',
        }}
      >
        {[
          { text: 'Jeanine Emilia', delay: 0, immediate: true },
          { text: 'Cornillot', delay: 180, immediate: false },
        ].map((line) => (
          <span
            key={line.text}
            className="block"
            style={{
              letterSpacing: shown || line.immediate ? '-0.02em' : '0.02em',
              opacity: 1,
              transform: shown || line.immediate ? 'none' : 'translateY(8px)',
              filter: shown || line.immediate ? 'blur(0px)' : 'blur(3px)',
              ...(line.immediate ? {} : entrance(line.delay)),
            }}
          >
            {line.text}
          </span>
        ))}
      </h1>
    </div>

    <div className="relative z-10 mt-16 lg:mt-20 flex flex-col md:flex-row md:items-start md:justify-between gap-10 md:gap-16">
      <p
        className="text-[1.5rem] md:text-[1.75rem] italic leading-snug"
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          color: 'var(--poppy-ink)',
          maxWidth: '31ch',
          opacity: 1,
        }}
      >
        Emmy and Ambie Award‑winning showrunner and executive producer.
      </p>

      <nav
        aria-label="Chapters"
        className="relative flex flex-col gap-3 md:items-end"
        style={{
          background: SCAMFLUENCERS_FIELD,
          boxShadow: '0 0 0 0.9rem var(--poppy)',
          opacity: shown ? 1 : 0,
          transform: shown ? 'none' : 'translateY(12px)',
          ...entrance(460),
        }}
      >
        {[
          { id: 'productions', index: '01', label: 'Productions' },
          { id: 'labs', index: '02', label: 'Ghost Mode Labs' },
          { id: 'about', index: '03', label: 'About' },
        ].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectChapter(c.id)}
            // The fixed ChapterRail's own inactive/focus colors (--terra,
            // --ember) both measure under 3:1 against this field (1.24-1.62
            // and 2.96-3.87 across its three stops), so neither existing
            // rail focus-ring class is safe here. Scamfluencers' own accent
            // clears 5.57-7.27:1 on the same stops, so the focus ring
            // borrows it directly.
            className="chapter-rail-btn group flex min-h-11 items-center gap-4 py-1 active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: SCAMFLUENCERS_ACCENT }}
          >
            <span
              className="chapter-label tabular-nums"
              style={{ color: 'var(--poppy-ink)', fontSize: '1.2rem', fontWeight: 700 }}
            >
              {c.index}
            </span>
            <span
              className="text-[1.5rem] md:text-[1.6rem] transition-opacity duration-300 group-hover:opacity-70"
              style={{
                fontFamily: "'Bodoni Moda', serif",
                color: 'var(--poppy-ink)',
                textDecorationLine: 'underline',
                textDecorationColor: SCAMFLUENCERS_ACCENT,
                textDecorationThickness: 2,
                textUnderlineOffset: 6,
              }}
            >
              {c.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  </section>
  );
};

const SpinePreviewPage: React.FC = () => {
  const { chapter } = useParams<{ chapter?: string }>();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // This page is mounted at two paths: the live site root and the original
  // /preview/spine prototype route, which is kept so existing links to it
  // still work. Chapter URLs are built off whichever one the visitor is
  // actually on, so the root serves clean /labs links while the preview
  // route stays self-consistent instead of bouncing visitors to the root.
  const chapterBase = pathname.startsWith('/preview/spine') ? '/preview/spine' : '';
  const chapterPath = (id?: string) => (id ? `${chapterBase}/${id}` : chapterBase || '/');

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

  // A project opens as its own route, so the continuous homepage unmounts.
  // Save the exact viewport before leaving and restore it before paint when
  // Back returns. Setting lastSyncedChapter at the same time prevents the
  // chapter deep-link effect below from replacing the exact position with
  // the beginning of the Labs section.
  useLayoutEffect(() => {
    let saved: {
      pathname?: string;
      scrollY?: number;
      projectHref?: string;
      linkViewportTop?: number;
    } | null = null;

    try {
      const raw = sessionStorage.getItem(PROJECT_RETURN_SCROLL_KEY);
      sessionStorage.removeItem(PROJECT_RETURN_SCROLL_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch {
      return;
    }

    if (
      saved?.pathname !== pathname ||
      typeof saved.scrollY !== 'number' ||
      !Number.isFinite(saved.scrollY)
    ) {
      return;
    }

    const restorePosition = () => {
      let targetScrollY = saved!.scrollY!;

      if (
        saved!.projectHref &&
        typeof saved!.linkViewportTop === 'number'
      ) {
        const projectLink = Array.from(
          document.querySelectorAll<HTMLAnchorElement>('a[href]')
        ).find(link => link.getAttribute('href') === saved!.projectHref);

        if (projectLink) {
          const linkDocumentTop = window.scrollY + projectLink.getBoundingClientRect().top;
          targetScrollY = linkDocumentTop - saved!.linkViewportTop;
        }
      }

      window.scrollTo(0, targetScrollY);
    };

    restorePosition();
    lastSyncedChapter.current = chapter;

    // Reapply after the mount effects settle so the clicked project link
    // returns to the same viewport position even if fonts finish resolving
    // during the route transition.
    const settleTimer = window.setTimeout(restorePosition, 0);
    return () => window.clearTimeout(settleTimer);
  }, [chapter, pathname]);

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
    navigate(chapterPath(id));
    scrollToSection(id);
  };

  // ChapterRail's onNavigate: the rail and its mobile menu already do their
  // own scrollIntoView before calling this, so it only needs to push the
  // history entry, not scroll again.
  const pushChapterUrl = (id: string) => {
    lastSyncedChapter.current = id;
    navigate(chapterPath(id));
  };

  const goToChapterViaSkipLink = (id: string) => {
    lastSyncedChapter.current = id;
    navigate(chapterPath(id));
    skipToSection(id);
  };

  const goToCover = () => {
    lastSyncedChapter.current = undefined;
    navigate(chapterPath());
    window.scrollTo({ top: 0, behavior: preferredScrollBehavior() });
  };

  // Passive scroll: silently keep the URL in step via history.replace (no
  // new entry, so ordinary scrolling never floods Back/Forward), purely so
  // reload or a copied link lands back where the visitor actually was.
  // undefined means the visitor has scrolled back up past every chapter to
  // the Cover (or Contents); the URL clears with them rather than sticking
  // to whichever chapter they last passed through.
  const syncActiveChapterToUrl = (id: string | undefined) => {
    lastSyncedChapter.current = id;
    navigate(chapterPath(id), { replace: true });
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
        hideWhileVisibleIds={RAIL_SUPPRESSION_IDS}
        onNavigate={pushChapterUrl}
        onActiveChange={syncActiveChapterToUrl}
      />
      {/* Labs only. Hide as soon as About enters the viewport, even while the
          tail of Labs is technically still intersecting, so this fixed
          control never sits on top of the colophon copy. */}
      <MotionToggle
        showWhileVisibleId="labs"
        hideWhileVisibleIds={MOTION_TOGGLE_SUPPRESSION_IDS}
      />

      <Cover onSelectChapter={goToChapter} />

      {/* Chapter 01: Productions */}
      <div id="productions" tabIndex={-1}>
        {/* Bridges into ProductionsChapter's own title card (cream), not
            into Scamfluencers' field directly: the card is the first thing
            the chapter actually renders, and it sits between this bridge
            and the spread regardless. An earlier version of this bridge
            went straight to PRODUCTIONS_FIRST_COLOR (terra), which fixed
            nothing, the card still sat there, cream, immediately after,
            so the visible seam just moved from "Cover meets card" to
            "bridge's terra excursion meets card" without closing either
            gap. This is exactly why the flash was still visible after the
            first version of this fix: it addressed the wrong pair of
            edges. The chapter's own internal bridge (in
            ProductionsPreviewPage.tsx, between the card and Scamfluencers)
            handles the cream-to-terra half; this one only needs to get
            the Cover's terra to the card's cream. */}
        <ColorBridge from={gradientEnd(SCAMFLUENCERS_FIELD)} to="var(--bg-site)" />
        <ProductionsChapter />
        {/*
          Both the closing bridge and the cream breather that used to sit
          here are gone, retired by the front-of-book/back-of-book split.
          They existed because the chapter ended on Life of Kylie's
          near-black field, which needed a wash out to paper and then a
          light stop before the Labs ground (also near-black) so the
          "lights down" dip had somewhere to fall from. The chapter now
          ends on its own paper-ground credits screen, which already is
          that light stop and is real content rather than empty color, so
          the dip below falls from it directly.
        */}
      </div>

      {/* The biggest lightness swing in the spine: paper diving into the
          Labs ground. Kept outside both chapter ids since it belongs to
          neither.

          via="var(--terra)": the plain cream/ink-deep mix measured as
          #7b7274, 3.8% saturation, i.e. grey rather than warm, confirmed by
          sampling the actual composited pixel. See ColorBridge's own doc
          comment for why terra, not a different mixing function, is the
          fix: both endpoints are themselves near-neutral, so no
          colour-accurate mix of them can land anywhere but near-neutral,
          in any interpolation space. */}
      <ColorBridge from="var(--bg-site)" to={LAB.ground} via="var(--terra)" heightClassName="h-[20vh] md:h-[24vh]" />

      {/* Chapter 02: Ghost Mode Labs */}
      <div id="labs" tabIndex={-1}>
        <LabsChapter onAbout={() => scrollToSection('about')} />
      </div>

      <ColorBridge from={LAB.ground} to="var(--bg-site)" via="var(--terra)" heightClassName="h-[20vh] md:h-[24vh]" />

      {/* Colophon: About (REDESIGN-PLAN.md section 7). Editorial
          masthead form: bio narrative and structured lists side by side,
          no cards, no icons, no timeline graphics. */}
      <section id="about" tabIndex={-1} className="px-6 md:px-20 pt-8 pb-24 md:pt-12 md:pb-36">
        <h2
          className="text-[2.4rem] md:text-[3.5rem] leading-none"
          style={{
            fontFamily: "'Bodoni Moda', serif",
            letterSpacing: '-0.01em',
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
          <div className="lg:col-span-6 flex flex-col gap-10 md:gap-12">
            <div
              className="space-y-5 text-[length:var(--body)] leading-relaxed"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: 'var(--ink-mute)', maxWidth: '52ch' }}
            >
              <p>
                Emmy and Ambie Award-winning executive producer and showrunner.
                More than 300 episodes across podcasts, television, and
                digital.
              </p>
              <p>
                Created Scamfluencers and The Last City and produced Dying for
                Sex, all for Wondery and Amazon.
              </p>
              <p>
                Founded Wondery&rsquo;s first AI Creator Lab and grew it from
                four people to more than fifty across the company.
              </p>
              <p>
                At Ghost Mode Labs, I develop original IP and prototype new
                ways to research, develop, and extend stories across scripted,
                nonfiction, and new formats.
              </p>
            </div>
          </div>

          {/* Structured lists */}
          {/* col-start-7, not 8: starting at 8 left a ~350px void between the
              bio and the lists that broke the masthead read. */}
          <div className="lg:col-span-6 lg:col-start-7 flex flex-col gap-10">
            <ColophonList label="Awards" items={AWARDS} />
            <ColophonList label="Programs" items={PROGRAMS} />
            <AuthorColophon />
          </div>
        </div>

      </section>

      {/* Back cover (10/10 pass, per an outside design review: the site
          opened on the Cover's own terra field and a name, then just
          stopped at a cream utility footer after About, no closing beat.
          This bookends it: same field as the Cover, one closing line and
          one unmissable ask, replacing the old footer rather than sitting
          below it, so there's a single last impression, not a headline
          moment followed by a smaller administrative one. Functional links
          (LinkedIn, back to cover) move in here as the small print under
          the beat, the same relationship the Cover's own contact line has
          to its name. */}
      <div id="contact-endcap">
        <ColorBridge from="var(--bg-site)" to={gradientStart(SCAMFLUENCERS_FIELD)} heightClassName="h-[20vh] md:h-[24vh]" />
        <footer
          className="relative overflow-hidden px-6 md:px-20 pt-20 md:pt-28 pb-12 md:pb-16"
          style={{ background: SCAMFLUENCERS_FIELD }}
        >
        <div className="relative">
          {/* "Get in touch" is the headline itself now, not an eyebrow over
              a separate statement line: the statement ("Building the next
              thing now") read as a try-hard non-sequitur and, worse, sized
              email like a hero line while LinkedIn sat in tiny caps in a
              corner, so the two actual ways to reach her had no shared
              hierarchy. Email and LinkedIn are equal-weight, underlined
              links now, sized to read as a contact block, not a mismatched
              headline-plus-footnote. */}
          <h2
            className="text-[2.4rem] md:text-[3.5rem] leading-none"
            style={{
              fontFamily: "'Bodoni Moda', serif",
              letterSpacing: '-0.01em',
              color: 'var(--poppy-ink)',
            }}
          >
            Get in touch
          </h2>

          <div className="mt-8 md:mt-10 flex flex-col md:flex-row gap-4 md:gap-10">
            <a
              href="mailto:iamjeanine@me.com"
              className="inline-flex min-h-11 items-center py-2 underline decoration-2 underline-offset-4 hover:opacity-70 active:translate-y-px transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: 'clamp(1.5rem, 1.8vw, 1.65rem)',
                color: 'var(--poppy-ink)',
                textDecorationColor: SCAMFLUENCERS_ACCENT,
                outlineColor: SCAMFLUENCERS_ACCENT,
              }}
            >
              iamjeanine@me.com
            </a>
            <a
              href="https://www.linkedin.com/in/jcornillot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center py-2 underline decoration-2 underline-offset-4 hover:opacity-70 active:translate-y-px transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: 'clamp(1.5rem, 1.8vw, 1.65rem)',
                color: 'var(--poppy-ink)',
                textDecorationColor: SCAMFLUENCERS_ACCENT,
                outlineColor: SCAMFLUENCERS_ACCENT,
              }}
            >
              LinkedIn
            </a>
            <a
              href="/press.html"
              className="inline-flex min-h-11 items-center py-2 underline decoration-2 underline-offset-4 hover:opacity-70 active:translate-y-px transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: 'clamp(1.5rem, 1.8vw, 1.65rem)',
                color: 'var(--poppy-ink)',
                textDecorationColor: SCAMFLUENCERS_ACCENT,
                outlineColor: SCAMFLUENCERS_ACCENT,
              }}
            >
              Press kit
            </a>
          </div>

          <div className="mt-16 md:mt-20 flex flex-wrap items-center gap-x-8 gap-y-2">
            <button
              type="button"
              onClick={goToCover}
              className="chapter-rail-btn inline-flex min-h-11 items-center py-3 underline decoration-2 underline-offset-4 hover:opacity-70 active:translate-y-px transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: '1rem',
                color: 'var(--ink)',
                textDecorationColor: SCAMFLUENCERS_ACCENT,
                outlineColor: SCAMFLUENCERS_ACCENT,
              }}
            >
              Back to cover
            </button>
            <a
              href="/work.html"
              className="inline-flex min-h-11 items-center py-3 underline decoration-2 underline-offset-4 hover:opacity-70 active:translate-y-px transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: '1rem',
                color: 'var(--ink)',
                textDecorationColor: SCAMFLUENCERS_ACCENT,
                outlineColor: SCAMFLUENCERS_ACCENT,
              }}
            >
              Work index
            </a>
          </div>
        </div>
        </footer>
      </div>
    </div>
  );
};

export default SpinePreviewPage;
