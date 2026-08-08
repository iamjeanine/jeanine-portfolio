import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ColorBridge, Eyebrow, Expandable, SpreadShell, gradientStart, gradientEnd } from '../components/chapter';

/**
 * PROTOTYPE: not linked from site navigation.
 * Production spread system: one full-bleed color field per production,
 * palette sampled from that production's actual key art.
 */

const DISPLAY_FAMILY = "'Bodoni Moda', serif";

interface SpreadPalette {
  field: string; // CSS background for the color field
  ink: string; // headline + pull-stat color
  inkSoft: string; // eyebrows, small labels
  inkBody: string; // serif body copy
  accent: string; // role label, index number, expandable markers
  border: string; // expandable hairlines
  shadow: string; // media drop shadows
}

interface SpreadMedia {
  src: string;
  alt: string;
  className?: string; // width/placement override (literal Tailwind classes)
  isVideo?: boolean; // renders as a muted video that plays once on scroll into view
}

interface SpreadData {
  index: string;
  /**
   * Stable anchor slug, rendered as id="production-<slug>". Exists so the
   * Cover's index can link straight to a single credit: before this, every
   * jump control on the site targeted a chapter *start*, so reaching spread
   * 6 meant scrolling past 1 through 5 (Impeccable recruiter-persona
   * critique, P0). Deliberately human-meaningful rather than positional, so
   * a link keeps working if the chapter order ever changes.
   */
  slug: string;
  /**
   * Plain-text title for the Cover index. Needed because `title` below is
   * JSX for several spreads (zero-width spaces, bound &nbsp;) and cannot be
   * rendered into a text link or read as a string.
   */
  name: string;
  eyebrow: string;
  title: React.ReactNode;
  /**
   * Awards to surface at skim speed, under the pull-stat. Only for spreads
   * whose Impact expandable hides credentials the stat doesn't already
   * state: the recruiter critique found the impatient persona never opens
   * an expandable, so an Ambie win or a Peabody was invisible on a fast
   * scroll. Omitted where the stat already carries the award (Born This
   * Way, No Passport Required) rather than repeating it.
   */
  awards?: string[];
  role: string;
  description: string;
  stat?: { value: string; label: string };
  expandables?: { label: string; body: string }[];
  media: { main: SpreadMedia; overlap?: SpreadMedia };
  palette: SpreadPalette;
  flip?: boolean; // true = media left, text right
  /**
   * Let the oversized title cross into the artwork (the magazine collage
   * move). Opt-in, and only legitimate when the image's top band is empty:
   * no face, logotype, or credential up there for the title to deface.
   * Default is a clean gap.
   *
   * This used to be a free-form class string defaulting to overlap, which
   * inverted the rule on four of seven spreads. The worst case had the cream
   * title crossing the white "Apple Podcasts" endorsement on Scamfluencers
   * at 1:1 contrast, so the wordmark read as "P/dca/ts".
   */
  mediaOverlap?: boolean;
}

const SPREADS: SpreadData[] = [
  {
    index: '01',
    slug: 'scamfluencers',
    name: 'Scamfluencers',
    awards: ['2023 Ambie winner', 'Vogue’s Best Podcasts', 'Apple’s Creators We Love'],
    eyebrow: 'Wondery · Amazon · 2022–Present',
    // Zero-width space, not a soft hyphen: the title needs a break
    // opportunity to fit a 375px measure, but &shy; renders a visible
    // hyphen there, which reads as if the show's name were hyphenated.
    // This breaks cleanly with no inserted character.
    title: <>Scam&#8203;fluencers</>,
    role: 'Creator & Showrunner',
    description:
      'A weekly true-crime pop series unpacking the internet’s most audacious scammers, hosted by Scaachi Koul and Sarah Hagi.',
    stat: { value: '53M', label: 'downloads' },
    expandables: [
      {
        label: 'Role',
        body: 'Created the original IP and pitched it to Wondery, then ran the series as showrunner: format, hosting, editorial voice, and weekly production across its run.',
      },
      {
        label: 'Impact',
        body: 'Winner, 2023 Ambie for Best Entertainment Podcast, with a second nomination in 2025. Selected for Vogue’s Best Podcasts of the Year. Named among Apple’s Creators We Love. Adapted internationally, including Mexico and Brazil.',
      },
    ],
    media: {
      main: {
        src: '/proto/scamfluencers-hosts.jpg',
        alt: 'Scamfluencers hosts Scaachi Koul and Sarah Hagi, featured by Apple Podcasts',
      },
      overlap: { src: '/proto/scamfluencers-keyart.jpg', alt: 'Scamfluencers key art' },
    },
    // Contrast repair (REDESIGN-PLAN.md 6.1, computed via WCAG relative
    // luminance, not eyeballed): the original field's light stops failed
    // 4.5:1 for small text at every stop (inkSoft as low as 2.67:1). Field
    // darkened ~22% (uniformly, so its gradient shape is unchanged) and ink
    // lifted slightly toward white; every stop now clears 4.5:1 for
    // inkSoft/inkBody and 3:1 for the display-size title, with margin.
    // Bonus: the chartreuse accent, previously a disclosed 3.69:1 ceiling
    // against the original field ("no chartreuse-family value passes 4.5:1
    // there"; see plan 9.1), now clears 4.5:1 too against the darkened
    // field, unchanged. The hue was never touched.
    palette: {
      field: 'linear-gradient(160deg, #9F481C 0%, #933D14 55%, #893710 100%)',
      ink: '#FCF5EC',
      inkSoft: 'rgba(252,245,236,0.85)',
      inkBody: 'rgba(252,245,236,0.95)',
      accent: '#F0FF29',
      border: 'rgba(252,245,236,0.28)',
      shadow: 'rgba(60,20,0,0.35)',
    },
  },
  {
    index: '02',
    slug: 'dying-for-sex',
    name: 'Dying for Sex',
    awards: ['Apple Favorites of the Year', 'Peabody-winning FX series', '9 Primetime Emmy nominations'],
    eyebrow: 'Wondery · Amazon · 2019–2020',
    title: <>Dying for&nbsp;Sex</>,
    role: 'Producer',
    description:
      'Molly is dying of breast cancer. So she leaves her marriage and sets out to feel everything she still can, telling it all to her best friend, Nikki Boyer.',
    stat: { value: 'Podcast of the Year', label: 'Ambie Award winner · 2021' },
    expandables: [
      {
        label: 'Role',
        body: 'Producer on the original Wondery podcast, from development through editorial.',
      },
      {
        label: 'Impact',
        body: 'Winner, Ambie Podcast of the Year. Named to Apple Podcasts’ Favorites of the Year. Adapted as a Peabody-winning FX limited series starring Michelle Williams, with 9 Primetime Emmy nominations.',
      },
    ],
    media: {
      main: {
        src: '/proto/dfs-emmy.jpg',
        alt: 'Dying for Sex podcast and FX series artwork with 9 Emmy nominations laurel',
      },
      overlap: {
        src: '/proto/dfs-peabody.jpg',
        alt: 'Dying for Sex FX series Peabody Awards winner poster',
      },
    },
    palette: {
      field: 'linear-gradient(165deg, #F7E1DB 0%, #F3D5CE 60%, #EFCCC5 100%)',
      ink: '#26141A',
      // Phase 5 sweep: measured 4.24:1 against the field's lightest stop,
      // failing the 4.5:1 floor for the eyebrow/stat-label/expandable-label
      // text this drives. Raised to the computed minimum plus a buffer.
      inkSoft: 'rgba(38,20,26,0.65)',
      inkBody: 'rgba(38,20,26,0.85)',
      accent: '#B30957',
      border: 'rgba(38,20,26,0.22)',
      shadow: 'rgba(140,50,70,0.28)',
    },
    flip: true,
  },
  {
    index: '03',
    slug: 'the-last-city',
    name: 'The Last City',
    awards: ['Ambie Best Fiction nominee', 'Audible Original'],
    eyebrow: 'Wondery · Amazon · 2023–2025',
    title: <>The Last&nbsp;City</>,
    role: 'Creator & Showrunner',
    description:
      'A serialized climate thriller starring Rhea Seehorn. Scripted fiction set inside the last domed city on a changed Earth.',
    stat: { value: '#1', label: 'Apple Fiction · 20 countries' },
    expandables: [
      {
        label: 'Role',
        body: 'Created the original IP and pitched it to Wondery, then ran the series as showrunner across two seasons, from development through serialized production.',
      },
      {
        label: 'Impact',
        body: '#1 Apple Fiction in 20 countries. Ambie Best Fiction nominee. Adapted as an Audible Original. Its world became the raw material for Multiverse Quad, built with Amazon’s AGI team.',
      },
    ],
    media: {
      main: {
        src: '/proto/tlc-notext.png',
        alt: 'The Last City key art: a woman looking back at a smoking domed city at golden hour',
        className: 'w-full lg:w-[76%] block lg:ml-auto',
      },
      overlap: {
        src: '/proto/tlc-s1.jpg',
        alt: 'The Last City season one poster: a silhouette holding a domed city at golden hour',
        className: 'hidden lg:block absolute w-[34%] aspect-[4/5] object-cover -bottom-10 left-[2%]',
      },
    },
    palette: {
      field: 'linear-gradient(165deg, #2B3A55 0%, #1C2540 55%, #131A30 100%)',
      ink: '#F2ECDD',
      inkSoft: 'rgba(242,236,221,0.68)',
      inkBody: 'rgba(242,236,221,0.9)',
      accent: '#E5A43B',
      border: 'rgba(242,236,221,0.25)',
      shadow: 'rgba(0,5,20,0.5)',
    },
    // The one spread whose art can take it: the top band is open sky,
    // with the figure at 45-56% of the image height.
    mediaOverlap: true,
  },
];

// Rendered after the Hollywood & Crime band, closing the chapter on the
// show that established her. One flagship-weight spread, not a triptych:
// the other two TV credits fold into its Impact line instead.
const BORN_THIS_WAY: SpreadData = {
  index: '05',
  slug: 'born-this-way',
  name: 'Born This Way',
  eyebrow: 'A&E · 2015–2016',
  title: <>Born This&nbsp;Way</>,
  role: 'Supervising Producer',
  description:
    'Seven young adults with Down syndrome build careers, independence, and love, on camera and on their own terms.',
  stat: { value: '3', label: 'Wins · 16 Primetime Emmy Nominations' },
  expandables: [
    {
      label: 'Role',
      body: 'Supervising producer across the series, shaping story at A&E through its Emmy-winning run.',
    },
    {
      label: 'Impact',
      body: '3 wins, 16 Primetime Emmy nominations.',
    },
  ],
  media: {
    main: {
      src: '/proto/tv-born-this-way-full.jpg',
      alt: 'The cast of Born This Way posing together in a studio portrait',
    },
    overlap: {
      src: '/proto/bornthisway-keyart.jpg',
      alt: 'Born This Way key art: individual cast headshots against a brick wall',
    },
  },
  palette: {
    field: 'linear-gradient(165deg, #EDEAE1 0%, #E6E1D4 55%, #DED7C5 100%)',
    ink: '#211C15',
    // Phase 5 sweep: measured 4.15:1 against the field's lightest stop.
    inkSoft: 'rgba(33,28,21,0.66)',
    inkBody: 'rgba(33,28,21,0.86)',
    accent: '#066B34',
    border: 'rgba(33,28,21,0.2)',
    shadow: 'rgba(60,50,30,0.22)',
  },
};

// Full flagship treatment: rich, distinct art (kitchen hero shot + a
// completely separate restaurant portrait) and a real credential to anchor it.
const NO_PASSPORT_REQUIRED: SpreadData = {
  index: '06',
  slug: 'no-passport-required',
  name: 'No Passport Required',
  eyebrow: 'Vox Media · PBS · 2018–2019',
  title: 'No Passport Required',
  role: 'Supervising Producer',
  description:
    'Chef Marcus Samuelsson travels the country to find the immigrant communities quietly redefining American food.',
  stat: { value: 'James Beard', label: 'Media Award' },
  expandables: [
    {
      label: 'Role',
      body: 'Supervising producer on the series for Vox Media and PBS, shaping story across its run.',
    },
    {
      label: 'Impact',
      body: 'Winner, James Beard Media Award.',
    },
  ],
  media: {
    main: {
      src: '/proto/npr-hero.jpg',
      alt: 'Marcus Samuelsson holding a crab in a kitchen, from No Passport Required',
    },
    overlap: {
      src: '/proto/npr-redrooster.webp',
      alt: 'Marcus Samuelsson standing outside his restaurant, Red Rooster',
    },
  },
  // Phase 5 sweep: inkSoft measured 3.45:1 here, the worst failure on the
  // site. Raising alpha alone would have needed 0.91, collapsing inkSoft
  // into inkBody (0.92) and flattening the text hierarchy, so this splits
  // the correction: field darkened ~12% uniformly (gradient shape intact)
  // and inkSoft raised to a still-distinct 0.80. Every stop now clears
  // 4.5:1 for both ink weights, and 3:1 for the display title.
  palette: {
    field: 'linear-gradient(160deg, #943322 0%, #7E2A1B 55%, #6C2315 100%)',
    ink: '#F5E6D8',
    inkSoft: 'rgba(245,230,216,0.80)',
    inkBody: 'rgba(245,230,216,0.92)',
    accent: '#00F5D4',
    border: 'rgba(245,230,216,0.28)',
    shadow: 'rgba(40,10,5,0.4)',
  },
  flip: true,
};

// Lighter treatment: one image, one line, no expandables or pull-stat.
// Her value here is cultural reach, not an award, so the spread doesn't
// pretend otherwise: it just gives that reach a real, quiet page.
const LIFE_OF_KYLIE: SpreadData = {
  index: '07',
  slug: 'life-of-kylie',
  name: 'Life of Kylie',
  eyebrow: 'E! · Bunim/Murray · 2017–2018',
  title: <>Life of&nbsp;Kylie</>,
  role: 'Senior Supervising Producer',
  description:
    'One of the most-watched women in the world opens her life to cameras, at the height of the Kardashian-Jenner media empire.',
  expandables: [
    {
      label: 'Role',
      body: 'Senior supervising producer on the series for E! and Bunim/Murray, overseeing production during the height of media attention around the family.',
    },
    {
      label: 'Impact',
      body: 'Produced at the peak of the Kardashian-Jenner media empire, when Kylie Jenner was among the most-followed people on the planet.',
    },
  ],
  media: {
    main: {
      src: '/proto/kylie-notext.png',
      alt: 'Life of Kylie key art: a portrait of Kylie Jenner with a neon crown graphic',
      className: 'w-full lg:w-[58%] block lg:ml-auto',
    },
  },
  palette: {
    field: 'linear-gradient(165deg, #2B1233 0%, #1D0B24 55%, #120616 100%)',
    ink: '#F3E9F7',
    inkSoft: 'rgba(243,233,247,0.68)',
    inkBody: 'rgba(243,233,247,0.9)',
    accent: '#E85FD1',
    border: 'rgba(243,233,247,0.25)',
    shadow: 'rgba(10,2,15,0.55)',
  },
};

const Spread: React.FC<{ data: SpreadData; progressIndex: number; progressTotal: number }> = ({
  data,
  progressIndex,
  progressTotal,
}) => {
  const { palette: p, flip } = data;

  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Plays once when a video main-image scrolls into view, then rests on its final frame.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !data.media.main.isVideo) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().catch(() => {});
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [data.media.main.isVideo]);

  return (
    <SpreadShell
      // Stable, human-meaningful anchor so the Cover's index can link to
      // this one credit. The progress markers ChapterRail reads moved to
      // data-* attributes below, which frees `id` for exactly this and
      // stops the two concerns fighting over one attribute.
      id={`production-${data.slug}`}
      tabIndex={-1}
      dataAttributes={{
        'data-progress-chapter': 'productions',
        'data-progress-index': progressIndex,
        'data-progress-total': progressTotal,
      }}
      background={p.field}
      gutterClassName="px-6 md:px-20"
      paddingClassName="pt-10 md:pt-14 pb-24 md:pb-36"
    >
      <Eyebrow label={data.eyebrow} index={data.index} labelColor={p.inkSoft} indexColor={p.accent} />

      {/* oversized title, overlapping the media cluster */}
      <h3
        className="relative z-10 mt-10 md:mt-16"
        style={{
          fontFamily: DISPLAY_FAMILY,
          fontSize: 'var(--display-xl)',
          lineHeight: 0.92,
          letterSpacing: '-0.015em',
          color: p.ink,
          // Evens out the two-line titles (No Passport Required, Hollywood &
          // Crime) instead of leaving a long first line over a short second.
          // Note a latent risk left in place deliberately: at 0.92 the plan's
          // specified leading, consecutive ink boxes at 180px sit about 18px
          // inside each other, so a future title could collide letter-on-letter.
          // Both current wraps clear it. Loosening the leading to ~1.02 would
          // fix it but visibly slackens all seven titles to prevent a bug that
          // does not yet occur, so this stays as the plan specifies.
          textWrap: 'balance',
        }}
      >
        {data.title}
      </h3>

      {/*
        Spread body: media and text alternate sides per spread.

        Two columns only from lg, not md. In the 768-1023 band the md grid
        squeezed the text column to 181px (a ~22 character measure, narrower
        than the 375px phone layout's 304px) while shrinking the artwork to
        280px, so the title was larger than the work it introduced. That band
        now uses the single-column stack, which was already the most coherent
        of the four widths.

        Media comes first in the DOM and the order-* utilities are gone:
        col-start does the desktop placement, so source order can match
        visual order instead of contradicting it on all seven spreads.
      */}
      <div className="mt-10 lg:mt-4 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
        {/* media cluster, asymmetric; mirrors when flipped. self-start so the
            column shrink-wraps the artwork: as a stretched grid item its
            height was set by the *text* column, which is why the inset's
            -bottom-14 produced a 166px interlock on one spread, a 24px gap on
            another, and 240-406px of drift in the md band. */}
        {/* Both columns are pinned to row 1. Required, not decorative: with
            media first in the DOM at col-start-6, grid's default sparse
            packing cannot backfill row 1 for a following item at col-start-1,
            so the text column dropped to row 2 and sat ~590px below the
            artwork on every non-flipped spread. */}
        <div
          className={`relative self-start lg:row-start-1 lg:col-span-7 ${
            data.mediaOverlap ? 'chapter-media-overlap' : 'chapter-media-clear'
          } ${flip ? 'lg:col-start-1' : 'lg:col-start-6'}`}
        >
          {data.media.main.isVideo ? (
            <video
              ref={videoRef}
              src={data.media.main.src}
              aria-label={data.media.main.alt}
              muted
              playsInline
              preload="auto"
              className={
                data.media.main.className ??
                `w-full lg:w-[82%] block ${flip ? 'lg:mr-auto' : 'lg:ml-auto'}`
              }
              style={{ boxShadow: `0 30px 80px ${p.shadow}` }}
            />
          ) : (
            <img
              src={data.media.main.src}
              alt={data.media.main.alt}
              /* Spread art runs to 2.4MB per file and only the first spread
                 is ever above the fold, so everything defers. decoding=async
                 keeps a large decode off the main thread during scroll. */
              loading="lazy"
              decoding="async"
              className={
                data.media.main.className ??
                `w-full lg:w-[82%] block ${flip ? 'lg:mr-auto' : 'lg:ml-auto'}`
              }
              style={{ boxShadow: `0 30px 80px ${p.shadow}` }}
            />
          )}
          {data.media.overlap && (
            <img
              src={data.media.overlap.src}
              alt={data.media.overlap.alt}
              loading="lazy"
              decoding="async"
              /* Fixed 4:5 crop: at w-[36%] alone the inset's height came from
                 whatever ratio the source file happened to have, so it ran
                 from 37% to 99% of the main image's height and the
                 main-plus-inset hierarchy inverted on two spreads. */
              className={
                data.media.overlap.className ??
                `hidden lg:block absolute w-[36%] aspect-[4/5] object-cover -bottom-14 ${
                  flip ? '-right-[8%]' : '-left-[8%]'
                }`
              }
              style={{ boxShadow: `0 24px 60px ${p.shadow}` }}
            />
          )}
        </div>

        {/* text column */}
        <div
          className={`lg:row-start-1 lg:col-span-4 lg:pt-16 ${
            flip ? 'lg:col-start-9' : 'lg:col-start-1'
          }`}
        >
          <p className="text-[0.8rem] tracking-[0.14em] uppercase" style={{ color: p.accent }}>
            {data.role}
          </p>
          <p
            className="mt-5 text-[length:var(--body)] leading-relaxed"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: p.inkBody, maxWidth: '36ch' }}
          >
            {data.description}
          </p>

          {/* pull stat, set editorially, omitted for lighter spreads */}
          {data.stat && (
            <div className="mt-12 md:mt-16">
              <p
                className="italic"
                style={{
                  fontFamily: DISPLAY_FAMILY,
                  fontSize:
                    data.stat.value.length > 6 ? 'var(--stat-long)' : 'var(--stat)',
                  lineHeight: 1.05,
                  color: p.ink,
                  maxWidth: '12ch',
                }}
              >
                {data.stat.value}
              </p>
              <p className="mt-2 text-[0.7rem] tracking-[0.18em] uppercase" style={{ color: p.inkSoft }}>
                {data.stat.label}
              </p>
            </div>
          )}

          {/* Award strip: the credentials that were only inside the Impact
              expandable, hoisted so they read on a fast scroll. The
              recruiter-persona critique found this persona never opens an
              expandable, so a spread could pass at speed showing "53M
              downloads" and never the Ambie win. Uses the accent for the
              separators only, so the strip reads as one line of credential
              rather than a list competing with the stat above it. */}
          {data.awards && data.awards.length > 0 && (
            <ul className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              {data.awards.map((award, i) => (
                <li key={award} className="flex items-baseline gap-2">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-[0.7rem]" style={{ color: p.accent }}>
                      &middot;
                    </span>
                  )}
                  <span
                    className="text-[0.7rem] tracking-[0.14em] uppercase"
                    style={{ color: p.inkBody }}
                  >
                    {award}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* expandables, omitted for lighter spreads */}
          {data.expandables && data.expandables.length > 0 && (
            <div className="mt-12 md:mt-16">
              {data.expandables.map((e) => (
                <Expandable
                  key={e.label}
                  label={e.label}
                  accentColor={p.accent}
                  labelColor={p.inkSoft}
                  bodyColor={p.inkBody}
                  borderColor={p.border}
                >
                  {e.body}
                </Expandable>
              ))}
            </div>
          )}
        </div>

      </div>
    </SpreadShell>
  );
};

// Promoted from a half-scale interstitial band to a full flagship spread:
// once the chapter grew past three flagships, a single compressed band
// started to read as inconsistent rather than intentional. Keeps its
// animated main image as a quiet point of distinction from the rest.
const HOLLYWOOD_CRIME: SpreadData = {
  index: '04',
  slug: 'hollywood-and-crime',
  name: 'Hollywood & Crime',
  eyebrow: 'Wondery · Amazon · 2019–2024',
  title: <>Hollywood &amp;&nbsp;Crime</>,
  role: 'Senior Producer',
  description:
    'Two seasons inside Wondery’s Hollywood true-crime anthology, produced alongside her work on Scamfluencers and Dying for Sex.',
  expandables: [
    {
      label: 'Role',
      body: 'Senior producer on both seasons, shaping story across Wondery’s Hollywood true-crime franchise.',
    },
    {
      label: 'Series',
      body: 'Billionaire Boys Club (Season 6): co-hosted with Tracy Pattin and Timothy Olyphant, critically praised. The Execution of Bonny Lee Bakley (Season 7): co-hosted with Tracy Pattin and Josh Lucas, a chart-topping true-crime hit.',
    },
    {
      label: 'Impact',
      body: 'Part of the same true-crime slate that produced Scamfluencers and Dying for Sex.',
    },
  ],
  media: {
    main: {
      src: '/proto/hc-bonny-motion.mp4',
      alt: 'The Execution of Bonny Lee Bakley animated cover art',
      isVideo: true,
    },
    overlap: {
      src: '/proto/hc-bbc.jpg',
      alt: 'Billionaire Boys Club cover art',
    },
  },
  palette: {
    field: 'linear-gradient(165deg, #E8EBEF 0%, #E4E8EB 55%, #DBDFE2 100%)',
    ink: '#1A1613',
    inkSoft: 'rgba(26,22,19,0.62)',
    inkBody: 'rgba(26,22,19,0.86)',
    // Contrast repair (6.1): #C2201F measured a 4.45:1 near miss against
    // the field's darkest stop. Computed nudge to #BF201F clears 4.5:1
    // against all three stops with a small margin (4.55-5.10).
    accent: '#BF201F',
    border: 'rgba(26,22,19,0.2)',
    shadow: 'rgba(20,10,10,0.28)',
  },
  flip: true,
};

// Chapter render order. Bridge endpoints are derived from this array (see
// ProductionsChapter below), so they can never desync from the palettes above.
const CHAPTER_ORDER: SpreadData[] = [
  SPREADS[0],
  SPREADS[1],
  SPREADS[2],
  HOLLYWOOD_CRIME,
  BORN_THIS_WAY,
  NO_PASSPORT_REQUIRED,
  LIFE_OF_KYLIE,
];

// The chapter's own opening and closing colors, for whatever composes it
// (the standalone page bridges to/from cream; the Spine bridges to/from
// its neighbors instead) to derive its own boundary bridge from.
export const PRODUCTIONS_FIRST_COLOR = gradientStart(CHAPTER_ORDER[0].palette.field);
export const PRODUCTIONS_LAST_COLOR = gradientEnd(CHAPTER_ORDER[CHAPTER_ORDER.length - 1].palette.field);

// Scamfluencers' own field/ink/accent, exported so the Spine's Cover can
// open in literally the same color world as the first spread (the whole
// reason the cover options exercise picked this direction) by reading
// from the same source of truth, not a hand-copied duplicate string that
// could drift out of sync if this palette ever changes.
/**
 * Every credit by name and anchor, in chapter order, for the Cover's index.
 * Derived from CHAPTER_ORDER rather than hand-listed so the index can never
 * fall out of sync with what the chapter actually renders, or silently drop
 * a spread if one is added.
 */
export const PRODUCTIONS_INDEX = CHAPTER_ORDER.map((s) => ({
  anchor: `production-${s.slug}`,
  name: s.name,
  index: s.index,
}));

export const SCAMFLUENCERS_FIELD = CHAPTER_ORDER[0].palette.field;
export const SCAMFLUENCERS_INK = CHAPTER_ORDER[0].palette.ink;
export const SCAMFLUENCERS_INK_SOFT = CHAPTER_ORDER[0].palette.inkSoft;
export const SCAMFLUENCERS_ACCENT = CHAPTER_ORDER[0].palette.accent;

/**
 * The chapter's own title card, its spreads, and their internal bridges.
 * No boundary bridges: the page or Spine composing this owns the
 * transition to whatever comes before and after. The title card mirrors
 * LabsChapter carrying its own "Ghost Mode Labs" header, so both
 * chapters read as siblings wherever this is embedded (previously
 * Productions' title lived only in the standalone page's identity
 * header, so the Spine skipped straight into Scamfluencers unannounced).
 */
export const ProductionsChapter: React.FC = () => (
  <>
    <div
      className="px-6 md:px-20 pt-16 md:pt-24 pb-16 md:pb-24"
      style={{ backgroundColor: 'var(--bg-site)' }}
    >
      <div className="flex items-end justify-between">
        <h2
          className="text-[2rem] md:text-[2.75rem] leading-none"
          style={{ fontFamily: DISPLAY_FAMILY, color: 'var(--ink)' }}
        >
          Productions
        </h2>
        <span
          className="hidden md:block text-[0.8rem] italic"
          style={{ fontFamily: "'Source Serif 4', serif", color: 'var(--ink-mute)' }}
        >
          2015–Present &middot; podcasts &amp; television
        </span>
      </div>
    </div>
    {/* This is an internal bridge, not a boundary one: the title card above
        is always cream and CHAPTER_ORDER[0] (Scamfluencers) is always the
        chapter's own first color, regardless of what composes this
        component, so it belongs here rather than with whatever page or
        Spine section owns the transition into the chapter as a whole.
        Missing before: the title card sat directly against Scamfluencers'
        terra field with no bridge between them, a hard seam that stayed
        easy to miss while whatever preceded the card was also cream (the
        standalone page's own header) and a boundary bridge's brief terra
        excursion partly masked it. Wiring the Spine's Cover onto
        Scamfluencers' own field made the same pre-existing seam obvious:
        terra Cover, cream card, terra spread, cream doing nothing but
        interrupting two things that already match. */}
    <ColorBridge from="var(--bg-site)" to={PRODUCTIONS_FIRST_COLOR} />
    {CHAPTER_ORDER.map((spread, i) => (
      <React.Fragment key={spread.index}>
        <Spread data={spread} progressIndex={i + 1} progressTotal={CHAPTER_ORDER.length} />
        {i + 1 < CHAPTER_ORDER.length && (
          <ColorBridge
            from={gradientEnd(spread.palette.field)}
            to={gradientStart(CHAPTER_ORDER[i + 1].palette.field)}
          />
        )}
      </React.Fragment>
    ))}
  </>
);

const ProductionsPreviewPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-site)' }}>
      {/* Cream connective tissue: chapter opening (identity only; the
          "Productions" title itself lives in ProductionsChapter, see
          there for why) */}
      <header className="px-6 md:px-20 pt-12 md:pt-16">
        <div className="flex items-baseline justify-between">
          <Link
            to="/"
            className="text-[0.7rem] tracking-[0.18em] uppercase"
            style={{ color: 'var(--ink-mute)' }}
          >
            Jeanine Emilia Cornillot
          </Link>
        </div>
      </header>

      {/* No bridge here: the header above and ProductionsChapter's own
          title card are both var(--bg-site), already seamless. The real
          cream-to-terra transition is ProductionsChapter's own internal
          bridge, between its title card and Scamfluencers' spread, not a
          boundary concern of this page. */}
      <ProductionsChapter />
      <ColorBridge from={PRODUCTIONS_LAST_COLOR} to="var(--bg-site)" />
    </div>
  );
};

export default ProductionsPreviewPage;
