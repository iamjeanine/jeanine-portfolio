import React from 'react';
import { GRAIN_URI } from '../components/chapter';

/**
 * PROTOTYPE, comparison only: not linked from site navigation, and nothing
 * here is wired into the Spine. Three candidate covers at full viewport
 * height so they can be judged against each other by scrolling, rather
 * than described.
 *
 * The question behind this page: the current Spine cover uses the live
 * site's Hero, whose footage is AI-generated and was made for Ghost Mode
 * Labs. That contradicts the redesign's own argument (credibility first,
 * frontier work second) by opening the publication on its last chapter,
 * and it puts near-black video immediately before a cream Contents page
 * and a burnt-orange first spread, so the opening reads as three moods
 * before the reader arrives anywhere.
 *
 * All copy is the already-approved hero and Contents copy. No new claims.
 * Art is limited to the two files Jeanine has already cleaned of
 * wordmarks (tlc-notext.png, kylie-notext.png).
 */

const DISPLAY = "'Bodoni Moda', serif";
const BODY_SERIF = "'Source Serif 4', Georgia, serif";

// Scamfluencers' own field and ink, unchanged, so a cover built on it is
// literally the same color world the first spread opens in. Both values are
// already contrast-verified from the Phase 3 and 5 sweeps.
const TERRA_FIELD = 'linear-gradient(160deg, #9F481C 0%, #933D14 55%, #893710 100%)';
const TERRA_INK = '#FCF5EC';
const TERRA_INK_SOFT = 'rgba(252,245,236,0.85)';
const TERRA_ACCENT = '#F0FF29';

const NAME_1 = 'Jeanine Emilia';
const NAME_2 = 'Cornillot';
const LINE_1 = 'Emmy and Ambie Award-winning showrunner.';
// Bound exactly as the live Hero binds it, so a narrow measure cannot
// split the studio name across lines.
const LINE_2 = (
  <>Podcasts, television, and Ghost&nbsp;Mode&nbsp;Labs.</>
);

const CONTENTS = [
  { index: '01', label: 'Productions' },
  { index: '02', label: 'Ghost Mode Labs' },
  { index: '03', label: 'About' },
];

const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => (
  <div
    aria-hidden="true"
    className="absolute inset-0 pointer-events-none mix-blend-overlay"
    style={{ backgroundImage: GRAIN_URI, opacity }}
  />
);

/** Labels each candidate for discussion. Not part of any real cover. */
const VariantTag: React.FC<{ letter: string; title: string; note: string }> = ({
  letter,
  title,
  note,
}) => (
  <div
    className="sticky top-0 z-50 px-6 md:px-20 py-3 flex flex-wrap items-baseline gap-x-4 gap-y-1"
    style={{ backgroundColor: '#150E0A', color: '#F5F2EC' }}
  >
    <span className="chapter-label" style={{ color: '#E8A672' }}>
      Option {letter}
    </span>
    <span className="chapter-label">{title}</span>
    <span className="text-[0.8rem] italic" style={{ fontFamily: BODY_SERIF, opacity: 0.75 }}>
      {note}
    </span>
  </div>
);

/**
 * Option A: typographic cover on the Productions palette.
 *
 * The magazine answer: no photography at all, the name set as the cover
 * line, and the opening color is the same field Scamfluencers uses, so
 * cover and first spread read as one gesture. Needs no assets, so nothing
 * here depends on rights or on cleaning another file.
 */
const OptionA: React.FC = () => (
  <section
    className="relative min-h-screen flex flex-col justify-between px-6 md:px-20 pt-20 pb-12 md:pt-28 md:pb-16"
    style={{ background: TERRA_FIELD }}
  >
    <Grain />
    <div className="relative">
      <p className="chapter-label" style={{ color: TERRA_ACCENT }}>
        Selected work
      </p>
      <h2
        className="mt-8 md:mt-10"
        style={{
          fontFamily: DISPLAY,
          fontSize: 'var(--display-xl)',
          lineHeight: 0.88,
          letterSpacing: '-0.02em',
          color: TERRA_INK,
        }}
      >
        {NAME_1}
        <br />
        {NAME_2}
      </h2>
    </div>

    <div className="relative mt-16 md:mt-0 flex flex-col md:flex-row md:items-end md:justify-between gap-10 md:gap-16">
      <div style={{ maxWidth: '34ch' }}>
        {/* Impeccable critique (2026-08-07): this line and the tagline below
            it were computed as typographically identical, same font, size,
            weight, and color down to the alpha channel, 4px apart. A real
            Emmy and Ambie are the single highest-value credibility claim on
            the page; they were dressed as filler copy next to a sentence
            with no informational weight. Given its own tier here: larger,
            the accent already used for the kicker and Contents index
            instead of the tagline's ink-soft, and Uncut Sans bold against
            the display serif name for a masthead-style contrast, not
            Source Serif 4 matching the prose below it. */}
        <p
          className="text-[1.3rem] md:text-[1.5rem] font-bold leading-snug"
          style={{ fontFamily: "'Uncut Sans', sans-serif", color: TERRA_ACCENT }}
        >
          {LINE_1}
        </p>
        <p
          className="mt-3 md:mt-4 text-[1rem] md:text-[1.15rem] leading-relaxed"
          style={{ fontFamily: BODY_SERIF, color: TERRA_INK_SOFT }}
        >
          {LINE_2}
        </p>
      </div>

      <nav aria-label="Contents" className="flex flex-col gap-3 md:items-end">
        {CONTENTS.map((c) => (
          <span key={c.index} className="flex items-baseline gap-4">
            <span className="chapter-label tabular-nums" style={{ color: TERRA_ACCENT }}>
              {c.index}
            </span>
            <span
              className="text-[1.35rem] md:text-[1.6rem]"
              style={{ fontFamily: DISPLAY, color: TERRA_INK }}
            >
              {c.label}
            </span>
          </span>
        ))}
      </nav>
    </div>
  </section>
);

/**
 * Option B: art-led cover, from real work.
 *
 * The Last City key art: cinematic, already cleaned of its wordmark, and a
 * show Jeanine created and pitched herself, so it stands for the career
 * rather than for a vendor. The scrim exists for legibility, not mood: the
 * source image runs from bright sky to dark ground, so the name needs a
 * consistent field under it rather than luck.
 */
const OptionB: React.FC = () => (
  <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
    {/* object-position, not the default 50% 50%: Impeccable critique
        (2026-08-07) measured the face sitting close enough to "Cornillot"
        to compete with it at every width tested, worse at 375px (crop runs
        horizontal on this square source, face lands beside the "J" of
        "Jeanine") than at 1440px (crop runs vertical, chin fell inside the
        name's own text box), not just the wide breakpoint assumed at
        first. Because object-fit: cover only crops one axis at a time,
        Y and X can be tuned independently here without conflict: the 82%
        Y raises the face clear of the name at wide viewports where the
        crop is vertical (X is inert there, full width already shows), the
        35% X gives it room from "Jeanine" at narrow ones where the crop is
        horizontal (Y is inert there, full height already shows). A CSS
        lever only: the source is a square asset, so this remains
        breakpoint-fragile until it's properly re-cropped wide. */}
    <img
      src="/proto/tlc-notext.png"
      alt=""
      aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover"
      style={{ objectPosition: '35% 82%' }}
    />
    {/* Vertical scrim: light at the top so the art reads, then deliberately
        heavy across the bottom 45% where every piece of type sits.
        The 0.86 stop is computed, not eyeballed. Worst case for legibility
        is bright art (this image is golden-hour sky) under the ember accent,
        the palest small text here: that pairing needs the scrim at 0.78 to
        clear 4.5:1 against a pure-white pixel, so the type band sits at 0.86
        for margin and stays safe even if the art behind it is ever swapped
        for something brighter. */}
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(180deg, rgba(10,14,26,0.15) 0%, rgba(10,14,26,0.42) 35%, rgba(10,14,26,0.86) 55%, rgba(10,14,26,0.94) 100%)',
      }}
    />
    <Grain opacity={0.04} />

    <div className="relative px-6 md:px-20 pb-12 md:pb-16">
      {/* Deliberately smaller than option A's display-xl, and anchored to the
          bottom. At full display-xl the name ran straight across the figure's
          face, which is the same defacement problem the Productions layout
          review just fixed on Scamfluencers. Sized so the art's upper two
          thirds, where the figure and the dome sit, stays clear. */}
      <h2
        style={{
          fontFamily: DISPLAY,
          fontSize: 'clamp(2.6rem, 7vw, 6.5rem)',
          lineHeight: 0.9,
          letterSpacing: '-0.02em',
          color: '#F7F3EA',
        }}
      >
        {NAME_1}
        <br />
        {NAME_2}
      </h2>

      <div className="mt-10 md:mt-12 flex flex-col md:flex-row md:items-end md:justify-between gap-10 md:gap-16">
        <div style={{ maxWidth: '34ch' }}>
          {/* Same fix as Option A, same reasoning: its own tier, the ember
              accent already used for Option B's own Contents index, Uncut
              Sans bold against the display serif name. */}
          <p
            className="text-[1.3rem] md:text-[1.5rem] font-bold leading-snug"
            style={{ fontFamily: "'Uncut Sans', sans-serif", color: '#E8A672' }}
          >
            {LINE_1}
          </p>
          <p
            className="mt-3 md:mt-4 text-[1rem] md:text-[1.15rem] leading-relaxed"
            style={{ fontFamily: BODY_SERIF, color: 'rgba(247,243,234,0.88)' }}
          >
            {LINE_2}
          </p>
        </div>

        <nav aria-label="Contents" className="flex flex-col gap-3 md:items-end">
          {CONTENTS.map((c) => (
            <span key={c.index} className="flex items-baseline gap-4">
              <span className="chapter-label tabular-nums" style={{ color: '#E8A672' }}>
                {c.index}
              </span>
              <span
                className="text-[1.35rem] md:text-[1.6rem]"
                style={{ fontFamily: DISPLAY, color: '#F7F3EA' }}
              >
                {c.label}
              </span>
            </span>
          ))}
        </nav>
      </div>
    </div>
  </section>
);

/**
 * Option C: three columns, one per chapter.
 *
 * Built so the clutter question can be judged rather than argued. Note
 * what it exposes honestly: only two of the three chapters have art that
 * is cleared and wordmark-free, and About has no portrait at all, so the
 * third column is type where the others are image. That asymmetry is the
 * real content, not a placeholder gap.
 */
const OptionC: React.FC = () => (
  <section
    className="relative min-h-screen flex flex-col px-6 md:px-20 pt-16 pb-12 md:pt-20 md:pb-16"
    style={{ backgroundColor: '#F5F2EC' }}
  >
    <Grain opacity={0.035} />

    <div className="relative">
      <h2
        style={{
          fontFamily: DISPLAY,
          fontSize: 'clamp(2.6rem, 7vw, 6rem)',
          lineHeight: 0.9,
          letterSpacing: '-0.02em',
          color: 'var(--ink)',
        }}
      >
        {NAME_1} {NAME_2}
      </h2>
      <p
        className="mt-5 text-[1rem] md:text-[1.1rem] leading-relaxed"
        style={{ fontFamily: BODY_SERIF, color: 'var(--ink-mute)', maxWidth: '46ch' }}
      >
        {LINE_1} {LINE_2}
      </p>
    </div>

    <div className="relative mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
      {/* 01 Productions */}
      <div>
        <div className="flex items-baseline gap-3">
          <span className="chapter-label tabular-nums" style={{ color: 'var(--terra-text)' }}>
            01
          </span>
          <span className="text-[1.3rem]" style={{ fontFamily: DISPLAY, color: 'var(--ink)' }}>
            Productions
          </span>
        </div>
        <img
          src="/proto/tlc-notext.png"
          alt="The Last City key art"
          loading="lazy"
          decoding="async"
          className="mt-4 w-full aspect-[4/3] object-cover"
        />
        <p
          className="mt-4 text-[0.95rem] leading-relaxed"
          style={{ fontFamily: BODY_SERIF, color: 'var(--ink-mute)' }}
        >
          Podcasts and television for Wondery, Amazon, A&amp;E, PBS, and E!
        </p>
      </div>

      {/* 02 Ghost Mode Labs */}
      <div>
        <div className="flex items-baseline gap-3">
          <span className="chapter-label tabular-nums" style={{ color: 'var(--terra-text)' }}>
            02
          </span>
          <span className="text-[1.3rem]" style={{ fontFamily: DISPLAY, color: 'var(--ink)' }}>
            Ghost Mode Labs
          </span>
        </div>
        {/* A real Labs asset. An earlier pass had Life of Kylie's art in this
            slot, which is wrong: Kylie is a TV production, not a Ghost Mode
            Labs project, so it would have misrepresented the chapter. This is
            Static, the chapter's own lead entry. */}
        <video
          src="https://storage.googleapis.com/jeanine-portfolio-video/Static.mp4"
          aria-label="Preview reel for Static, a scripted series built from online folklore"
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          className="mt-4 w-full aspect-[4/3] object-cover"
        />
        <p
          className="mt-4 text-[0.95rem] leading-relaxed"
          style={{ fontFamily: BODY_SERIF, color: 'var(--ink-mute)' }}
        >
          Original IP and prototypes for new ways to tell stories.
        </p>
      </div>

      {/* 03 About: type only, since no portrait exists */}
      <div>
        <div className="flex items-baseline gap-3">
          <span className="chapter-label tabular-nums" style={{ color: 'var(--terra-text)' }}>
            03
          </span>
          <span className="text-[1.3rem]" style={{ fontFamily: DISPLAY, color: 'var(--ink)' }}>
            About
          </span>
        </div>
        <div
          className="mt-4 w-full aspect-[4/3] flex items-center justify-center px-6"
          style={{ border: '1px solid rgba(21,14,10,0.18)' }}
        >
          <p
            className="text-[1.05rem] italic leading-relaxed text-center"
            style={{ fontFamily: BODY_SERIF, color: 'var(--ink-mute)' }}
          >
            No portrait in the project yet, so this column is type where the
            other two are image.
          </p>
        </div>
        <p
          className="mt-4 text-[0.95rem] leading-relaxed"
          style={{ fontFamily: BODY_SERIF, color: 'var(--ink-mute)' }}
        >
          300+ episodes. Author of <em>Family Sentence</em> (Beacon Press).
        </p>
      </div>
    </div>
  </section>
);

const CoverOptionsPreviewPage: React.FC = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ backgroundColor: '#F5F2EC' }}>
      <VariantTag
        letter="A"
        title="Typographic, Productions palette"
        note="No photography. Opens in the same color the first spread uses. Needs no assets."
      />
      <OptionA />

      <VariantTag
        letter="B"
        title="Art-led, The Last City"
        note="Real work, already wordmark-free, a show she created and pitched."
      />
      <OptionB />

      <VariantTag
        letter="C"
        title="Three columns, one per chapter"
        note="The clutter question, built so it can be seen. Note the third column has no art."
      />
      <OptionC />
    </div>
  );
};

export default CoverOptionsPreviewPage;
