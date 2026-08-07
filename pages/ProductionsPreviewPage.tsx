import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ColorBridge, Eyebrow, Expandable, SpreadShell, gradientStart, gradientEnd } from '../components/chapter';

/**
 * PROTOTYPE: not linked from site navigation.
 * Production spread system: one full-bleed color field per production,
 * palette sampled from that production's actual key art.
 * Font comparison via ?face=bodoni | caslon | young
 */

const FACES: Record<string, { label: string; family: string; tracking: string; lineHeight: number }> = {
  bodoni: { label: 'Bodoni Moda', family: "'Bodoni Moda', serif", tracking: '-0.015em', lineHeight: 0.92 },
  caslon: { label: 'Libre Caslon Display', family: "'Libre Caslon Display', serif", tracking: '-0.02em', lineHeight: 0.94 },
  young: { label: 'Young Serif', family: "'Young Serif', serif", tracking: '-0.025em', lineHeight: 0.98 },
};

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
  eyebrow: string;
  title: React.ReactNode;
  role: string;
  description: string;
  stat?: { value: string; label: string };
  expandables?: { label: string; body: string }[];
  media: { main: SpreadMedia; overlap?: SpreadMedia };
  palette: SpreadPalette;
  flip?: boolean; // true = media left, text right
  mediaOffsetClass?: string; // vertical offset of media cluster vs title (default overlaps the title)
}

const SPREADS: SpreadData[] = [
  {
    index: '01',
    eyebrow: 'Wondery · Amazon · 2022–Present',
    title: <>Scam&shy;fluencers</>,
    role: 'Creator & Showrunner',
    description:
      'A weekly true-crime pop series unpacking the internet’s most audacious scammers, hosted by Scaachi Koul and Sarah Hagi.',
    stat: { value: '53M', label: 'downloads' },
    expandables: [
      {
        label: 'Role',
        body: 'Created the series and ran it as showrunner: format, hosting, editorial voice, and weekly production across its run at Wondery.',
      },
      {
        label: 'Series',
        body: 'Each week, two culture writers unravel how a scammer built the con, who fell for it, and what it says about the internet we all live in.',
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
    palette: {
      field: 'linear-gradient(160deg, #CC5D24 0%, #BC4E1A 55%, #B04715 100%)',
      ink: '#FAEFE2',
      inkSoft: 'rgba(250,239,226,0.75)',
      inkBody: 'rgba(250,239,226,0.92)',
      accent: '#F0FF29',
      border: 'rgba(250,239,226,0.28)',
      shadow: 'rgba(60,20,0,0.35)',
    },
  },
  {
    index: '02',
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
        label: 'Series',
        body: 'An intimate, funny, devastating series about desire at the end of a life. A conversation between best friends that became a cultural moment.',
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
      inkSoft: 'rgba(38,20,26,0.62)',
      inkBody: 'rgba(38,20,26,0.85)',
      accent: '#B30957',
      border: 'rgba(38,20,26,0.22)',
      shadow: 'rgba(140,50,70,0.28)',
    },
    flip: true,
  },
  {
    index: '03',
    eyebrow: 'Wondery · Amazon · 2023–2025',
    title: <>The Last&nbsp;City</>,
    role: 'Creator & Showrunner',
    description:
      'A serialized climate thriller starring Rhea Seehorn. Scripted fiction set inside the last domed city on a changed Earth.',
    stat: { value: '#1', label: 'Apple Fiction · 20 countries' },
    expandables: [
      {
        label: 'Role',
        body: 'Created the series and ran it as showrunner across two seasons, from development through serialized production.',
      },
      {
        label: 'Series',
        body: 'Audio-first science fiction built like prestige television: a city under glass, and the cost of being the ones who survived.',
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
        className: 'w-full md:w-[76%] block md:ml-auto',
      },
      overlap: {
        src: '/proto/tlc-s1.jpg',
        alt: 'The Last City season one poster: a silhouette holding a domed city at golden hour',
        className: 'hidden md:block absolute w-[34%] -bottom-10 left-[2%]',
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
    mediaOffsetClass: 'md:mt-6',
  },
];

// Rendered after the Hollywood & Crime band, closing the chapter on the
// show that established her. One flagship-weight spread, not a triptych:
// the other two TV credits fold into its Impact line instead.
const BORN_THIS_WAY: SpreadData = {
  index: '05',
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
      label: 'Series',
      body: 'A docuseries built around joy and independence rather than diagnosis, following its cast through work, dating, and moving out on their own.',
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
    inkSoft: 'rgba(33,28,21,0.62)',
    inkBody: 'rgba(33,28,21,0.86)',
    accent: '#066B34',
    border: 'rgba(33,28,21,0.2)',
    shadow: 'rgba(60,50,30,0.22)',
  },
  mediaOffsetClass: 'md:mt-10',
};

// Full flagship treatment: rich, distinct art (kitchen hero shot + a
// completely separate restaurant portrait) and a real credential to anchor it.
const NO_PASSPORT_REQUIRED: SpreadData = {
  index: '06',
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
      label: 'Series',
      body: 'Each episode follows Samuelsson into a different American city, tracing how immigrant communities have shaped what the country eats.',
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
  palette: {
    field: 'linear-gradient(160deg, #A83A26 0%, #8F2F1E 55%, #7A2818 100%)',
    ink: '#F5E6D8',
    inkSoft: 'rgba(245,230,216,0.72)',
    inkBody: 'rgba(245,230,216,0.92)',
    accent: '#00F5D4',
    border: 'rgba(245,230,216,0.28)',
    shadow: 'rgba(40,10,5,0.4)',
  },
  flip: true,
  mediaOffsetClass: 'md:mt-10',
};

// Lighter treatment: one image, one line, no expandables or pull-stat.
// Her value here is cultural reach, not an award, so the spread doesn't
// pretend otherwise — it just gives that reach a real, quiet page.
const LIFE_OF_KYLIE: SpreadData = {
  index: '07',
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
      label: 'Series',
      body: 'An unscripted series following Kylie Jenner in real time, through brand launches and the pressures of life inside one of the most-watched families in the world.',
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
      className: 'w-full md:w-[58%] block md:ml-auto',
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

const Spread: React.FC<{ data: SpreadData; face: (typeof FACES)[string] }> = ({ data, face }) => {
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
      background={p.field}
      gutterClassName="px-6 md:px-20"
      paddingClassName="pt-10 md:pt-14 pb-24 md:pb-36"
    >
      <Eyebrow label={data.eyebrow} index={data.index} labelColor={p.inkSoft} indexColor={p.accent} />

      {/* oversized title, overlapping the media cluster */}
      <h2
        className="relative z-10 mt-10 md:mt-16"
        style={{
          fontFamily: face.family,
          fontSize: 'var(--display-xl)',
          lineHeight: face.lineHeight,
          letterSpacing: face.tracking,
          color: p.ink,
        }}
      >
        {data.title}
      </h2>

      {/* spread body: text and media alternate sides per spread */}
      <div className="mt-10 md:mt-4 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
        {/* text column */}
        <div
          className={`md:col-span-4 md:pt-16 order-2 ${
            flip ? 'md:col-start-9 md:order-2' : 'md:order-1'
          }`}
        >
          <p className="text-[0.8rem] tracking-[0.14em] uppercase" style={{ color: p.accent }}>
            {data.role}
          </p>
          <p
            className="mt-5 text-[1.05rem] leading-relaxed"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif", color: p.inkBody, maxWidth: '36ch' }}
          >
            {data.description}
          </p>

          {/* pull stat, set editorially — omitted for lighter spreads */}
          {data.stat && (
            <div className="mt-12 md:mt-16">
              <p
                className="italic"
                style={{
                  fontFamily: face.family,
                  fontSize:
                    data.stat.value.length > 6
                      ? 'clamp(2.2rem, 3.4vw, 3.2rem)'
                      : 'clamp(3.5rem, 6vw, 5.5rem)',
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

          {/* expandables — omitted for lighter spreads */}
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

        {/* media cluster, asymmetric; mirrors when flipped */}
        <div
          className={`md:col-span-7 relative order-1 ${data.mediaOffsetClass ?? 'md:-mt-24'} ${
            flip ? 'md:col-start-1 md:row-start-1 md:order-1' : 'md:col-start-6 md:order-2'
          }`}
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
                `w-full md:w-[82%] block ${flip ? 'md:mr-auto' : 'md:ml-auto'}`
              }
              style={{ boxShadow: `0 30px 80px ${p.shadow}` }}
            />
          ) : (
            <img
              src={data.media.main.src}
              alt={data.media.main.alt}
              className={
                data.media.main.className ??
                `w-full md:w-[82%] block ${flip ? 'md:mr-auto' : 'md:ml-auto'}`
              }
              style={{ boxShadow: `0 30px 80px ${p.shadow}` }}
            />
          )}
          {data.media.overlap && (
            <img
              src={data.media.overlap.src}
              alt={data.media.overlap.alt}
              className={
                data.media.overlap.className ??
                `hidden md:block absolute w-[36%] -bottom-14 ${flip ? '-right-[8%]' : '-left-[8%]'}`
              }
              style={{ boxShadow: `0 24px 60px ${p.shadow}` }}
            />
          )}
        </div>
      </div>
    </SpreadShell>
  );
};

// Promoted from a half-scale interstitial band to a full flagship spread —
// once the chapter grew past three flagships, a single compressed band
// started to read as inconsistent rather than intentional. Keeps its
// animated main image as a quiet point of distinction from the rest.
const HOLLYWOOD_CRIME: SpreadData = {
  index: '04',
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
      body: 'The Execution of Bonny Lee reopens a decades-old Hollywood mystery. Billionaire Boys Club follows a circle of young men whose investment scheme spiraled into murder.',
    },
    {
      label: 'Impact',
      body: 'Part of the same true-crime slate that produced Scamfluencers and Dying for Sex.',
    },
  ],
  media: {
    main: {
      src: '/proto/hc-bonny-motion.mp4',
      alt: 'The Execution of Bonny Lee animated cover art',
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
    accent: '#C2201F',
    border: 'rgba(26,22,19,0.2)',
    shadow: 'rgba(20,10,10,0.28)',
  },
  flip: true,
  mediaOffsetClass: 'md:mt-10',
};

// Chapter render order. Bridge endpoints are derived from this array (see
// ProductionsPreviewPage below), so they can never desync from the
// palettes above.
const CHAPTER_ORDER: SpreadData[] = [
  SPREADS[0],
  SPREADS[1],
  SPREADS[2],
  HOLLYWOOD_CRIME,
  BORN_THIS_WAY,
  NO_PASSPORT_REQUIRED,
  LIFE_OF_KYLIE,
];

const ProductionsPreviewPage: React.FC = () => {
  const [params] = useSearchParams();
  const faceKey = params.get('face') || 'bodoni';
  const face = FACES[faceKey] || FACES.bodoni;

  useEffect(() => {
    const id = 'proto-display-fonts';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Young+Serif&display=swap';
      document.head.appendChild(link);
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-site)' }}>
      {/* Cream connective tissue: chapter opening */}
      <header className="px-6 md:px-20 pt-12 pb-16 md:pt-16 md:pb-24">
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
        <div className="mt-16 md:mt-24 flex items-end justify-between">
          <h1
            className="text-[2rem] md:text-[2.75rem] leading-none"
            style={{ fontFamily: face.family, color: 'var(--ink)' }}
          >
            Productions
          </h1>
          <span
            className="hidden md:block text-[0.8rem] italic"
            style={{ fontFamily: "'Source Serif 4', serif", color: 'var(--ink-mute)' }}
          >
            2015–Present · podcasts &amp; television
          </span>
        </div>
      </header>

      <ColorBridge from="var(--bg-site)" to={gradientStart(CHAPTER_ORDER[0].palette.field)} />

      {CHAPTER_ORDER.map((spread, i) => (
        <React.Fragment key={spread.index}>
          <Spread data={spread} face={face} />
          <ColorBridge
            from={gradientEnd(spread.palette.field)}
            to={
              i + 1 < CHAPTER_ORDER.length
                ? gradientStart(CHAPTER_ORDER[i + 1].palette.field)
                : 'var(--bg-site)'
            }
          />
        </React.Fragment>
      ))}

      {/* Cream coda: shows the rhythm continuing */}
      <footer className="px-6 md:px-20 py-20 md:py-28">
        <p
          className="text-[1rem] italic leading-relaxed"
          style={{ fontFamily: "'Source Serif 4', serif", color: 'var(--ink-mute)', maxWidth: '52ch' }}
        >
          Ghost Mode Labs follows: the studio for what she is building next.
        </p>
      </footer>

      {/* prototype-only font switcher */}
      <nav
        className="fixed bottom-5 right-5 z-50 flex gap-1 rounded-full px-2 py-1.5"
        style={{ background: 'rgba(21,14,10,0.85)', backdropFilter: 'blur(8px)' }}
        aria-label="Display face switcher (prototype)"
      >
        {Object.entries(FACES).map(([key, f]) => (
          <Link
            key={key}
            to={`/preview/productions?face=${key}`}
            className="text-[0.65rem] tracking-wide uppercase px-3 py-1.5 rounded-full transition-colors"
            style={{
              color: faceKey === key ? '#150E0A' : 'rgba(246,239,231,0.8)',
              background: faceKey === key ? '#F6EFE7' : 'transparent',
            }}
          >
            {f.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default ProductionsPreviewPage;
