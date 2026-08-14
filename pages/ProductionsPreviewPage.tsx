import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChapterContents,
  ColorBridge,
  Eyebrow,
  Expandable,
  SpreadShell,
  gradientStart,
  gradientEnd,
  useRevealOnce,
  useParallax,
} from '../components/chapter';

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
  /*
   * No stored `index`. The 01-07 labels are derived from position in
   * CHAPTER_ORDER at render (see displayIndex below), because storing them
   * meant any promotion between tiers silently desynced the numbering:
   * moving Born This Way (then '05') into the front of book while Hollywood
   * & Crime (then '04') stayed compressed would have rendered 01, 02, 03,
   * 05 in the spreads and 04, 06, 07 in the credits. Same lesson already
   * learned on the Labs L-0N labels, and the same fix.
   */
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
  // body is usually one paragraph; widened to ReactNode for the rare
  // expandable dense enough to need a break (The Last City's Role, once it
  // absorbed the Multiverse Quad connection on top of the casting detail).
  expandables?: { label: string; body: React.ReactNode }[];
  /** Optional outbound listen/read link, for credits with a public
   *  adaptation a reader can actually go hear (the Dying for Sex podcast,
   *  The Last City audiobook). Rendered the same small tracked-caps-plus-
   *  arrow way Labs' "Open project" link is, so the site has one link
   *  language rather than two. */
  link?: { label: string; url: string };
  /**
   * `thumb` is only read by the compressed credits screen, and only when the
   * spread's own art is the wrong choice at thumbnail scale. Hollywood &
   * Crime is the case it exists for: its main art is a video, so the credits
   * row fell back to the `overlap` still, which is Billionaire Boys Club
   * (season 6) rather than the Bonny Lee Bakley cover the spread actually
   * leads on. Jeanine asked for Bakley there, so the row names its own still
   * instead of inheriting one by accident of which field happened to be an
   * image.
   */
  media: { main: SpreadMedia; overlap?: SpreadMedia; thumb?: SpreadMedia };
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
    slug: 'scamfluencers',
    name: 'Scamfluencers',
    awards: ['2023 Ambie winner', '2025 Ambie nominee', 'Vogue’s Best Podcasts', 'Apple’s Creators We Love'],
    eyebrow: 'Wondery · Amazon · 2022–Present',
    // Zero-width space, not a soft hyphen: the title needs a break
    // opportunity to fit a 375px measure, but &shy; renders a visible
    // hyphen there, which reads as if the show's name were hyphenated.
    // This breaks cleanly with no inserted character.
    title: <>Scam&#8203;fluencers</>,
    role: 'Creator & Showrunner',
    description:
      'A weekly true-crime series about the internet’s biggest scammers and the people who fell for them. Hosted by Scaachi Koul and Sarah Hagi.',
    stat: { value: '53M', label: 'downloads' },
    expandables: [
      {
        label: 'Role',
        body: 'Scamfluencers is original IP I created at Wondery. I led it from development through production as showrunner, building the format, casting the hosts, shaping the editorial voice, and overseeing the series throughout its run.',
      },
      {
        label: 'Impact',
        body: 'Adapted into local versions abroad, including Mexico and Brazil.',
      },
    ],
    link: { label: 'Listen to the podcast', url: 'https://www.audible.com/podcast/Scamfluencers/B0G4FFWFFM?srsltid=AfmBOorlPCWRrHWhwc7NDKup6hIIokgk9X_Ixo6nIGNFNuc_DfaJxCTr' },
    media: {
      main: {
        // Both stills below moved off /proto/ (a gitignored local folder
        // that never made it into any deployed build) onto the Cloud
        // bucket, in the "Broader Portfolio references" folder Jeanine
        // uploaded. Content verified against the old alt text before
        // wiring in, not matched by filename alone.
        src: 'https://storage.googleapis.com/jeanine-portfolio-video/Broader%20Portfolio%20references/Scamfluencers/Podcasts.jpeg',
        alt: 'Scamfluencers hosts Scaachi Koul and Sarah Hagi, featured by Apple Podcasts',
      },
      overlap: {
        src: 'https://storage.googleapis.com/jeanine-portfolio-video/Broader%20Portfolio%20references/Scamfluencers/Scamfluencers%20Keyart.jpg',
        alt: 'Scamfluencers key art',
        // Custom override, default shared position: the shared default
        // (w-[36%], -bottom-14, -left-[8%]) is tuned for spreads whose main
        // image has no text near the bottom-left third. Scamfluencers' main
        // image has "Scaachi & Sarah" captioned there, and the default
        // inset's top-right corner cut directly through it (Jeanine caught
        // this live). Smaller and lower clears the caption instead of
        // covering it.
        className: 'hidden lg:block absolute w-[30%] aspect-[4/5] object-cover -bottom-24 -left-[6%]',
      },
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
    slug: 'dying-for-sex',
    name: 'Dying for Sex',
    awards: ['Apple Podcasts Favorites of the Year'],
    eyebrow: 'Wondery · Amazon · 2019–2020',
    title: <>Dying for&nbsp;Sex</>,
    role: 'Co-developer & Producer',
    description:
      'Molly is dying of breast cancer. She leaves her marriage to feel everything she still can while there’s time, and tells all of it to her best friend, Nikki Boyer. Adapted into a Peabody-winning FX limited series starring Michelle Williams and Jenny Slate, with nine Primetime Emmy nominations.',
    stat: { value: 'Podcast of the Year', label: 'Ambie Award winner · 2021' },
    expandables: [
      {
        label: 'Role',
        body: 'I co-developed and produced the original Wondery podcast.',
      },
    ],
    link: { label: 'Listen to the podcast', url: 'https://www.audible.com/podcast/Dying-For-Sex-Ad-free/B08D6T2D9C?srsltid=AfmBOorNZWWnmgZXNS8CkriLissNPrXrGQGgKmmI7u-cjrUgfsx2Xhtc' },
    media: {
      main: {
        src: 'https://storage.googleapis.com/jeanine-portfolio-video/Broader%20Portfolio%20references/Dying%20for%20Sex/9.jpg',
        alt: 'Dying for Sex podcast and FX series artwork with 9 Emmy nominations laurel',
      },
      overlap: {
        src: 'https://storage.googleapis.com/jeanine-portfolio-video/Broader%20Portfolio%20references/Dying%20for%20Sex/THE%20PEABODY%20AWARDS.jpg',
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
    slug: 'the-last-city',
    name: 'The Last City',
    awards: ['Ambie Best Fiction nominee'],
    eyebrow: 'Wondery · Amazon · 2023–2025',
    title: <>The Last&nbsp;City</>,
    role: 'Creator & Showrunner',
    description:
      'The Last City is an immersive, 12-part sci-fi audio thriller, starring Rhea Seehorn, that explores the dark truths behind a utopian society surviving the climate crisis.',
    stat: { value: '#1 Apple Fiction', label: 'in 20 countries' },
    expandables: [
      {
        label: 'Role',
        body: (
          <>
            <p>
              Original IP I created at Wondery. I developed the world and
              its characters, hired the head writer and writers. Cast more
              than forty roles and oversaw production across two seasons.
            </p>
            <p className="mt-3">
              It was adapted into an Audible Original audiobook. Its world
              later became the basis for Multiverse Quad, which I built
              with Amazon&rsquo;s AGI team.
            </p>
          </>
        ),
      },
    ],
    link: { label: 'Listen to the audiobook', url: 'https://www.audible.com/pd/The-Last-City-Audiobook/B0F44KWN5D?srsltid=AfmBOopjoEwnj_0Sm99UwpGxQotk0fA41r6p3zHw2NMEJ_CVMn0_FXhp' },
    media: {
      main: {
        src: 'https://storage.googleapis.com/jeanine-portfolio-video/Broader%20Portfolio%20references/The%20Last%20City/No%20text%20Key%20Art.png',
        alt: 'The Last City key art: a woman looking back at a smoking domed city at golden hour',
        className: 'w-full lg:w-[76%] block lg:ml-auto',
      },
      overlap: {
        src: 'https://storage.googleapis.com/jeanine-portfolio-video/Broader%20Portfolio%20references/The%20Last%20City/TLC%20S1.jpg',
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
  slug: 'born-this-way',
  name: 'Born This Way',
  eyebrow: 'A&E · Bunim/Murray · 2015–2016',
  title: <>Born This&nbsp;Way</>,
  role: 'Supervising Producer',
  description:
    'Seven young adults with Down syndrome build careers, independence, and love, on camera and on their own terms.',
  // Deliberate exception to the site's one-line pull-stat rule (every
  // other lead spread's display value is a single line: 53M, Podcast of
  // the Year, #1 Apple Fiction). "Primetime" matters enough to Jeanine to
  // break it here: Emmys can be local or daytime, Primetime is the top
  // tier, and burying that distinction in the smaller label undersold it.
  // "3 Primetime Emmy wins" still wraps to three lines at both 1440 and
  // 390 (measured), so "wins" is cut; "3 Primetime Emmys" wraps to a
  // clean two ("3 Primetime" / "Emmys") at both widths instead of three.
  // Label reverts to the plain "16 nominations" now that Primetime is
  // established above it — repeating the qualifier on both lines was
  // the same redundancy the original single-line design avoided.
  stat: { value: '3 Primetime Emmys', label: '16 nominations' },
  expandables: [
    {
      label: 'Role',
      body: 'As supervising producer, I led the story department across the A&E series.',
    },
  ],
  media: {
    main: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/Broader%20Portfolio%20references/Tv%20Born%20This%20way/Born-This-Way-cast.jpg',
      alt: 'The cast of Born This Way posing together in a studio portrait',
    },
    overlap: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/Broader%20Portfolio%20references/Tv%20Born%20This%20way/Keyart.jpg',
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
  // Required by its promotion to the fourth lead, not cosmetic: The Last
  // City ahead of it has no flip, so without this the front of book would
  // run right, left, right, right and lose the alternation.
  flip: true,
};

// Full flagship treatment: rich, distinct art (kitchen hero shot + a
// completely separate restaurant portrait) and a real credential to anchor it.
const NO_PASSPORT_REQUIRED: SpreadData = {
  slug: 'no-passport-required',
  name: 'No Passport Required',
  eyebrow: 'Vox Media · Apple TV · PBS · 2018–2019',
  title: 'No Passport Required',
  role: 'Supervising Producer',
  description:
    'Chef Marcus Samuelsson travels the country to find the immigrant communities quietly redefining American food.',
  // The whole award name carries the display line. Bolding only "James
  // Beard" left the credential split across two type weights, and in
  // this row it sits beside a photograph of a chef, so the bold line
  // read as a person's name rather than a prize. The label states the
  // outcome instead, which the award's name alone does not.
  stat: { value: 'James Beard Media Award', label: 'winner' },
  expandables: [
    {
      label: 'Role',
      body: 'Supervising producer on the series for Vox Media and PBS, shaping story across its run. Oversaw story across six cities, working closely with producers and editors.',
    },
  ],
  link: { label: 'Watch on Apple TV', url: 'https://tv.apple.com/us/show/no-passport-required/umc.cmc.4ft1es62v2rav3mk2sp2qsrbr' },
  media: {
    main: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/Broader%20Portfolio%20references/Tv%20No%20Passport%20Necessary/NPR_s2_HeroImage_3_2.jpg',
      alt: 'Marcus Samuelsson holding a crab in a kitchen, from No Passport Required',
    },
    overlap: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/Broader%20Portfolio%20references/Tv%20No%20Passport%20Necessary/vox-media-easter-marcus-samuelsson-no-passport-required.webp',
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
  slug: 'life-of-kylie',
  name: 'Life of Kylie',
  eyebrow: 'E! · Bunim/Murray · Apple TV · 2017–2018',
  title: <>Life of&nbsp;Kylie</>,
  role: 'Senior Supervising Producer',
  description:
    'One of the most-watched women in the world opens her life to cameras, at the height of the Kardashian-Jenner media empire.',
  expandables: [
    {
      label: 'Role',
      body: 'Senior supervising producer on the series for E! and Bunim/Murray, overseeing post production during the height of media attention around the family.',
    },
    {
      label: 'Impact',
      body: 'Produced at the peak of the Kardashian-Jenner media empire, when Kylie Jenner was among the most-followed people on the planet.',
    },
  ],
  link: { label: 'Watch on Apple TV', url: 'https://tv.apple.com/us/show/life-of-kylie/umc.cmc.687z0r46pelftup0kl0yyxcc2' },
  media: {
    main: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/Broader%20Portfolio%20references/Tv%20Life%20of%20Kylie/No%20text%20keyart.png',
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

const Spread: React.FC<{
  data: SpreadData;
  /** Visible 01-07 label. Passed in rather than read off `data`, because it
   *  is derived from chapter position; see displayIndex. */
  label: string;
  progressIndex: number;
  progressTotal: number;
}> = ({ data, label, progressIndex, progressTotal }) => {
  const { palette: p, flip } = data;

  /*
   * Spread choreography: the credits were the most static screens on the
   * site, which both the recruiter-persona pass and an outside review
   * flagged independently ("the strongest credits and the cover are the
   * most static screens"). Three beats as the spread arrives: the eyebrow
   * identifies the page, the title rises and settles, then the work
   * appears.
   *
   * Three, not four. The text column rides with the artwork rather than
   * taking its own beat, because a fourth stop turns an entrance into a
   * queue, and the supporting copy is not what a reader is waiting for.
   *
   * 560ms against the Cover's 1200ms, and rise-plus-fade with no
   * blur-to-sharp. Both are deliberate hierarchy, not thrift: the Cover
   * fires once per visit and can afford to be the site's signature
   * gesture, while this fires four times and has to stay out of the way of
   * a reader who is already moving. Keeping the blur exclusive to the
   * Cover is what stops it becoming a mannerism.
   *
   * The settled timing is 0/140/280ms. It keeps three perceptible beats but
   * finishes in 840ms rather than leaving a fast-scrolling reader looking at
   * an empty field for more than a second. Travel, not delay, now carries
   * most of the choreography.
   */
  const { shown, reduced } = useRevealOnce(`production-${data.slug}`);
  const beat = (delay: number, rise: number): React.CSSProperties =>
    reduced
      ? {}
      : {
          opacity: shown ? 1 : 0,
          transform: shown ? 'none' : `translateY(${rise}px)`,
          transition: `opacity 560ms cubic-bezier(0.2,0.8,0.2,1) ${delay}ms, transform 560ms cubic-bezier(0.2,0.8,0.2,1) ${delay}ms`,
        };

  /*
   * Parallax depth, the last item on the reconciled motion list. The media
   * cluster drifts a little slower than the surrounding scroll, which is
   * what makes The Last City's collage overlap read as a separate physical
   * layer with real depth rather than a flat inset, and gives the other
   * three leads a quieter version of the same "the artwork has its own
   * life" quality. Applied to the existing media div directly, not a new
   * wrapping element, so the overlap inset's own percentage-based offset
   * still resolves against the same box it always has.
   *
   * 0.05 chosen empirically, not guessed, and only after the first attempt
   * at measuring it lied: reading getComputedStyle immediately after a
   * synchronous scrollTo caught the value from before the scroll event and
   * its rAF handler had run, which held steady across every sample and
   * looked static rather than broken. Re-measured with a wait between each
   * step, then confirmed on The Last City across the full transit that
   * the media's own rect never exceeds the spread article's rect, which is
   * the actual overflow-hidden boundary, so there is nothing to clip
   * regardless of how that headroom is split between padding and
   * whatever's rendered above the media. The parallax also measurably
   * deepens this spread's existing title/artwork overlap as you scroll
   * (-57px at rest, -109px mid-transit), which is the effect by name, not
   * a side effect of it.
   */
  const parallaxRef = useParallax(0.05);

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
      gutterClassName="px-6 md:px-20 xl:pr-64"
      paddingClassName="pt-10 md:pt-14 pb-24 md:pb-36"
    >
      <Eyebrow
        label={data.eyebrow}
        index={label}
        labelColor={p.inkSoft}
        indexColor={p.accent}
        style={beat(0, 10)}
      />

      {/* oversized title, overlapping the media cluster */}
      <h3
        className="relative z-10 mt-10 md:mt-16"
        style={{
          fontFamily: DISPLAY_FAMILY,
          fontSize: 'var(--display-lg)',
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
          // Beat 2: the title rises further than the other two (44px against
          // 10 and 26) because it is the element the entrance is actually
          // about, and a large word needs more travel than a small one to
          // read as movement at all.
          ...beat(140, 44),
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
      {/* Beat 3. Applied to the grid container so artwork and text arrive
          together as one gesture. Safe against two things worth naming: the
          overlap inset is positioned against the media column, not this
          grid, so a transform here cannot shift it out of interlock; and
          the 20px of travel is absorbed by the spread's own pb-24/pb-36, so
          SpreadShell's overflow-hidden has nothing to clip mid-animation. */}
      <div
        className="mt-10 lg:mt-4 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8"
        style={beat(280, 26)}
      >
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
          ref={parallaxRef}
          className={`relative self-start lg:row-start-1 lg:col-span-7 ${
            data.mediaOverlap ? 'chapter-media-overlap' : 'chapter-media-clear'
          } ${flip ? 'lg:col-start-1' : 'lg:col-start-6'}`}
          style={{ transform: 'translateY(var(--parallax-y, 0px))' }}
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

        {/* Text column stays at four of twelve, starting at col 9 when
            flipped. Widening it to five (col-start-8) was tried and
            reverted: the flipped media's overlap inset is positioned at
            -right-[8%], so it pushes past column 7 into column 8, and the
            wider column put the description, pull-stat and awards strip
            underneath the Peabody inset on Dying for Sex. Column 9 is where
            this text has to begin.

            The rail reservation therefore moved to the container gutter
            instead of living here; see SpreadShell's gutterClassName below.
            Taking 176px out of a four-column measure left 197px at 1280,
            a 20-character ribbon; taking it out of the container scales
            every column down proportionally instead, which costs the media
            some width and the text almost none. */}
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

          {/* Recognition block. This list kept getting adjusted (dot
              separators to stacking, 0.7rem to 0.78rem, a fixed gap to one
              conditional on count) and kept reading, in Jeanine's words, as
              "hanging out there." Every one of those passes treated it as a
              size and spacing problem. It was not.

              Two things were actually wrong. First, the items were set in
              the same tracked uppercase micro-caps as the pull-stat's own
              label directly above them, so on a spread like Dying for Sex
              the eye saw two identical lines and read the award as a second
              label continuing off the stat rather than as its own content.
              Second, the block had no header at all, so nothing announced
              it as a deliberate section.

              So the items now sit in the body serif at a readable size,
              which is content styling rather than caption styling, under an
              accent label that matches the role eyebrow above and the
              colophon's own list headers. That header also supplies the
              separation the old conditional margin was faking, so the gap
              is one value again regardless of how many items there are.

              "Recognition", not "Awards": Scamfluencers carries Vogue's
              Best Podcasts and Apple's Creators We Love, which are
              editorial selections rather than prizes, and on the spreads
              whose pull-stat is itself an award, an "Awards" header
              underneath it implies the big line above is not one. */}
          {data.awards && data.awards.length > 0 && (
            <div className="mt-10">
              <p className="text-[0.8rem] tracking-[0.14em] uppercase" style={{ color: p.accent }}>
                Recognition
              </p>
              <ul className="mt-3.5 space-y-1.5">
                {data.awards.map((award) => (
                  <li
                    key={award}
                    className="text-[0.95rem] leading-snug"
                    style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: p.inkBody, maxWidth: '34ch' }}
                  >
                    {award}
                  </li>
                ))}
              </ul>
            </div>
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

          {data.link && (
            <a
              href={data.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex min-h-11 items-center gap-2 py-3 text-[0.75rem] tracking-[0.18em] uppercase transition-opacity duration-300 hover:opacity-70 active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: p.ink, outlineColor: p.accent }}
            >
              {data.link.label}
              <span aria-hidden="true" style={{ color: p.accent }}>
                &rarr;
              </span>
            </a>
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
  slug: 'hollywood-and-crime',
  name: 'Hollywood & Crime',
  eyebrow: 'Wondery · Amazon · 2019–2024',
  title: <>Hollywood &amp;&nbsp;Crime</>,
  role: 'Senior Producer',
  description:
    'Two seasons inside Wondery’s Hollywood true-crime anthology.',
  expandables: [
    {
      label: 'Role',
      body: 'Senior producer on both seasons, shaping story across Wondery’s Hollywood true-crime franchise.',
    },
    {
      label: 'Series',
      body: 'Billionaire Boys Club (Season 6): co-hosted with Tracy Pattin and actor Timothy Olyphant, critically praised. The Execution of Bonny Lee Bakley (Season 7): co-hosted with Tracy Pattin and actor Josh Lucas, a chart-topping true-crime hit.',
    },
  ],
  link: { label: 'Listen to the podcast', url: 'https://www.audible.com/podcast/Wondery-Presents-The-Execution-of-Bonny-Lee-Bakley/B0B4KM3J2Z?srsltid=AfmBOooMI8wLS-XV5zLtcRXM7u2hXGyt0iywklthBzUynqztD1EokIg_' },
  media: {
    // Still broken, not fixed in this pass: Jeanine's upload was images
    // only. She did add a new "Screen Recording 2026-08-05.mov" in the
    // same Cloud folder, which by name may be a replacement for this clip,
    // but a .mov needs a codec/format check before it goes anywhere near
    // production, and that wasn't confirmed as its intended purpose. Left
    // broken and flagged rather than guessed at.
    main: {
      src: '/proto/hc-bonny-motion.mp4',
      alt: 'The Execution of Bonny Lee Bakley animated cover art',
      isVideo: true,
    },
    overlap: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/Broader%20Portfolio%20references/Hollywood%20and%20Crime/Billionaire%20Boys%20Club.jpg',
      alt: 'Billionaire Boys Club cover art',
    },
    // Still frame of the same Bakley cover the spread's video leads on, so
    // the compressed row shows the season this credit is known for rather
    // than the inset from season 6. Filed in the Cloud folder as
    // "WONDERY.jpg", not obviously this by name; opened and confirmed by
    // content before wiring in, not matched on the filename.
    thumb: {
      src: 'https://storage.googleapis.com/jeanine-portfolio-video/Broader%20Portfolio%20references/Hollywood%20and%20Crime/WONDERY.jpg',
      alt: 'The Execution of Bonny Lee Bakley cover art',
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

/**
 * Front of book: the credits that get a full spread.
 *
 * Seven uniform spreads was the chapter's real pacing problem. An outside
 * review put the drag precisely: spreads one through three held, and "by
 * spread 5 I was pattern-matching the template and skimming to the next
 * colour... the Productions chapter is not too long; it is too evenly
 * paced." Jeanine's call was a few leading spreads with the rest
 * compressed.
 *
 * The first three pick themselves from the data rather than from taste:
 * the only credits carrying both a stat and an awards strip, the most
 * recent, and two of three at Creator & Showrunner, the
 * highest-authorship role on the page. They are also the three podcasts
 * getting listen links, so the front of book and the linkable work
 * coincide.
 *
 * Born This Way is promoted on a different argument, credential symmetry.
 * The Cover claims "Emmy and Ambie Award-winning": the Ambie half is
 * evidenced by two flagship spreads above, while the Emmy half traces
 * only to this credit, whose 3 wins and 16 Primetime Emmy nominations is
 * also the largest award figure anywhere on the site. Leaving it as one
 * line in a list put the weaker evidence under the more prominent claim.
 * It runs last so the front of book closes on that figure, and it is
 * deliberately the one lead that is television and the one at Supervising
 * Producer rather than Creator: mixing formats is what makes "showrunner"
 * read as range rather than a single lane.
 */
const LEAD_SPREADS: SpreadData[] = [SPREADS[0], SPREADS[1], SPREADS[2], BORN_THIS_WAY];

/**
 * Back of book: compressed to one screen by ProductionCredits below.
 *
 * Hollywood & Crime is a podcast like the leads but carries neither a stat
 * nor an awards strip, so it compresses on the same evidence they were
 * chosen on. The other two are the older television work Jeanine said she
 * did not want to link.
 *
 * Each row still keeps its key art and its stat: No Passport Required's
 * James Beard is the same kind of load-bearing credential Born This Way's
 * Emmy line was, and compression is meant to change the pace, not to
 * demote what a credit is known for.
 */
const CREDIT_SPREADS: SpreadData[] = [
  // No Passport Required first, not Hollywood & Crime: it carries a stat
  // (James Beard), and sitting it between two award-less rows read odd —
  // Jeanine's own note, live. Order otherwise unchanged.
  NO_PASSPORT_REQUIRED,
  HOLLYWOOD_CRIME,
  LIFE_OF_KYLIE,
];

// Full chapter order, both tiers. Bridge endpoints, PRODUCTIONS_INDEX and
// the displayed 01-07 labels are all derived from this, so they cannot
// desync from the palettes above or from each other.
const CHAPTER_ORDER: SpreadData[] = [...LEAD_SPREADS, ...CREDIT_SPREADS];

/**
 * The visible 01-07 label, from position in the full chapter order.
 *
 * Derived rather than stored so promoting a credit between tiers cannot
 * leave the numbering out of sequence, which is exactly what storing it
 * would have done the moment Born This Way moved into the front of book
 * while Hollywood & Crime stayed compressed.
 */
const displayIndex = (s: SpreadData): string =>
  String(CHAPTER_ORDER.indexOf(s) + 1).padStart(2, '0');

// The chapter's own opening and closing colors, for whatever composes it
// (the standalone page bridges to/from cream; the Spine bridges to/from
// its neighbors instead) to derive its own boundary bridge from.
export const PRODUCTIONS_FIRST_COLOR = gradientStart(CHAPTER_ORDER[0].palette.field);
/**
 * Cream, not a palette value: the chapter now closes on the paper-ground
 * credits screen rather than on Life of Kylie's field, so it already ends
 * at the color its neighbours bridge toward. Callers keep asking for this
 * rather than hardcoding cream, so if a colored spread ever returns to the
 * last position their bridges pick the change up on their own.
 */
export const PRODUCTIONS_LAST_COLOR = 'var(--bg-site)';

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
  index: displayIndex(s),
  meta: s.role,
}));

export const SCAMFLUENCERS_FIELD = CHAPTER_ORDER[0].palette.field;
export const SCAMFLUENCERS_INK = CHAPTER_ORDER[0].palette.ink;
export const SCAMFLUENCERS_INK_SOFT = CHAPTER_ORDER[0].palette.inkSoft;
export const SCAMFLUENCERS_ACCENT = CHAPTER_ORDER[0].palette.accent;

/**
 * The back of book: four credits on one paper screen instead of eight
 * viewport-heights of spread.
 *
 * Deliberately not a bare list. Each row keeps its key art as a thumbnail
 * and its stat verbatim, because the compression is meant to change the
 * pace, not to demote the credentials: the Emmy nominations and the James
 * Beard award live in these stats, and an outside review specifically
 * praised this chapter's art as its strongest asset, so throwing all four
 * images away to save height would trade the wrong thing. A credits page
 * with thumbnails is also the actual back-of-book convention this whole
 * structure is borrowing from.
 *
 * Paper ground, not a color field: it is the register change that tells a
 * reader the front of book has ended, it gives relief after three
 * saturated spreads, and it bookends the chapter against its own cream
 * title card. It also retires two now-redundant bridges, since the
 * chapter's last color and its neighbours' target color became the same.
 */
const ProductionCredits: React.FC<{ progressIndex: number; progressTotal: number }> = ({
  progressIndex,
  progressTotal,
}) => (
  <SpreadShell
    as="section"
    id="production-credits"
    tabIndex={-1}
    dataAttributes={{
      'data-progress-chapter': 'productions',
      'data-progress-index': progressIndex,
      'data-progress-total': progressTotal,
    }}
    background="var(--bg-site)"
    gutterClassName="px-6 md:px-20 xl:pr-64"
    paddingClassName="pt-16 md:pt-24 pb-20 md:pb-28"
  >
    {/* The rail clearance this screen needs lives on the gutter above now,
        not on a wrapper here, so the header rule, the row rules and the
        right-aligned stat column all share one right edge with the spreads.
        It matters here specifically because that stat column is deliberately
        flush to the container edge, which is exactly where the rail floats,
        and it once landed on Born This Way's Emmy line. */}
    <div className="flex items-baseline gap-6">
      <h3 className="chapter-label" style={{ color: 'var(--ink-mute)' }}>
        Also produced
      </h3>
      <span aria-hidden="true" className="flex-1" style={{ borderTop: '1px solid rgba(21,14,10,0.18)' }} />
    </div>

    <ul className="mt-10 md:mt-14">
      {CREDIT_SPREADS.map((credit) => (
        <li
          key={credit.slug}
          id={`production-${credit.slug}`}
          tabIndex={-1}
          className="py-7 md:py-9"
          style={{ borderBottom: '1px solid rgba(21,14,10,0.18)' }}
        >
          <div className="flex items-start gap-5 md:gap-10">
            {/* --terra-text, not --terra: index.css records raw --terra at
                4.43:1 on paper, a near miss, and carries this darkened
                variant for exactly this case. */}
            <span
              className="chapter-label tabular-nums pt-1 shrink-0"
              style={{ color: 'var(--terra-text)' }}
            >
              {displayIndex(credit)}
            </span>

            {/* Square, not the 3:2 this started as. The four sources measure
                1.00, 0.68, 1.78 and 0.67, so no single crop flatters all of
                them, but three of the four are cover art, which is designed
                to be read whole and is square or portrait. A landscape crop
                was actively destructive there: on Hollywood & Crime it cut
                "The Execution of Bonny Lee Bakley" through the middle of its
                own title. Square fits that one exactly and center-crops the
                two portraits on their subjects.

                Preference order matters: an explicit `thumb` wins, then the
                overlap still, then main. Main is last because a video credit
                cannot render in an <img> at all, and relying on the overlap
                as an implicit poster picked the wrong season's art on
                Hollywood & Crime. */}
            <img
              src={credit.media.thumb?.src ?? credit.media.overlap?.src ?? credit.media.main.src}
              alt={credit.media.thumb?.alt ?? credit.media.overlap?.alt ?? credit.media.main.alt}
              loading="lazy"
              decoding="async"
              className="hidden sm:block w-24 md:w-28 aspect-square object-cover shrink-0"
            />

            <div className="min-w-0 flex-1">
              <h4
                className="text-[1.5rem] md:text-[1.9rem] leading-tight"
                style={{ fontFamily: DISPLAY_FAMILY, color: 'var(--ink)' }}
              >
                {credit.name}
              </h4>
              <p className="mt-1.5 chapter-label" style={{ color: 'var(--ink-mute)' }}>
                {credit.role}
              </p>
              <p
                className="mt-2 text-[0.8rem] italic"
                style={{ fontFamily: "'Source Serif 4', serif", color: 'var(--ink-faint)' }}
              >
                {credit.eyebrow}
              </p>
              {credit.link && (
                <a
                  href={credit.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-[0.7rem] tracking-[0.16em] uppercase transition-opacity duration-300 hover:opacity-70 active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ color: 'var(--ink)', outlineColor: 'var(--terra-text)' }}
                >
                  {credit.link.label}
                  <span aria-hidden="true" style={{ color: 'var(--terra-text)' }}>
                    &rarr;
                  </span>
                </a>
              )}
            </div>

            {/* Right-aligned on desktop so the four stats form their own
                scannable column: this is the credential a fast reader is
                here for, and it should not be the last thing in a paragraph.
                Credits without a verified stat simply leave it empty rather
                than inventing one. */}
            {credit.stat && (
              <div className="hidden md:block shrink-0 text-right" style={{ maxWidth: '16ch' }}>
                <p
                  className="italic leading-tight"
                  style={{
                    fontFamily: DISPLAY_FAMILY,
                    fontSize: credit.stat.value.length > 6 ? '1.5rem' : '2.1rem',
                    color: 'var(--ink)',
                  }}
                >
                  {credit.stat.value}
                </p>
                <p className="mt-1.5 chapter-label" style={{ color: 'var(--ink-mute)' }}>
                  {credit.stat.label}
                </p>
              </div>
            )}
          </div>

          {/* Same stat, stacked, below md: the desktop right-hand column
              would otherwise crush to a few characters per line. */}
          {credit.stat && (
            <div className="md:hidden mt-4 flex items-baseline gap-3">
              <p
                className="italic leading-tight text-[1.35rem]"
                style={{ fontFamily: DISPLAY_FAMILY, color: 'var(--ink)' }}
              >
                {credit.stat.value}
              </p>
              <p className="chapter-label" style={{ color: 'var(--ink-mute)' }}>
                {credit.stat.label}
              </p>
            </div>
          )}
        </li>
      ))}
    </ul>
  </SpreadShell>
);

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
        {/* 2.4/3.5rem, not the original 2/2.75rem: the four chapter-tier
            headings (Productions, Ghost Mode Labs, About, Get in touch)
            are the same outline level doing the same job, and three of
            them render at 56px while this one sat at 44px — the only
            same-role type inconsistency the full-sweep polish pass found.
            Matches Labs' explicit step rather than var(--display-md) so
            the two chapter headers stay identical at every width, not
            just at the clamp's cap. */}
        <h2
          className="text-[2.4rem] md:text-[3.5rem] leading-none"
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
      <ChapterContents
        ariaLabel="Productions project index"
        label="Selected productions"
        items={PRODUCTIONS_INDEX}
        colors={{
          accent: 'var(--terra-text)',
          border: 'rgba(21,14,10,0.18)',
          ink: 'var(--ink)',
          muted: 'var(--ink-mute)',
        }}
      />
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
    {/* Progress counts the credits screen as the chapter's final unit, so
        the rail reads "2/4" rather than claiming seven stops when four of
        them now share one screen. */}
    {LEAD_SPREADS.map((spread, i) => (
      <React.Fragment key={spread.slug}>
        <Spread
          data={spread}
          label={displayIndex(spread)}
          progressIndex={i + 1}
          progressTotal={LEAD_SPREADS.length + 1}
        />
        <ColorBridge
          from={gradientEnd(spread.palette.field)}
          // The last lead bridges into the credits screen's paper rather
          // than into another field.
          to={
            i + 1 < LEAD_SPREADS.length
              ? gradientStart(LEAD_SPREADS[i + 1].palette.field)
              : 'var(--bg-site)'
          }
        />
      </React.Fragment>
    ))}
    <ProductionCredits
      progressIndex={LEAD_SPREADS.length + 1}
      progressTotal={LEAD_SPREADS.length + 1}
    />
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
      {/* No closing bridge either, for the same reason as the opening one:
          the chapter now ends on its own paper-ground credits screen, so
          PRODUCTIONS_LAST_COLOR and this page's cream are the same value
          and the bridge had nothing left to cross. */}
    </div>
  );
};

export default ProductionsPreviewPage;
