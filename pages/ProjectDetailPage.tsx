
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { PROJECTS, getVisibleProjects } from '../constants';
import type { Project } from '../types';
import VideoPlayer from '../components/VideoPlayer';
import { BackIcon, NextIcon, PrevIcon, ExternalLinkIcon } from '../components/icons/NavigationIcons';
import PhoneEmbed from '../components/PhoneEmbed';
import { useViewTransitionNavigate } from '../hooks/useViewTransition';


const ProjectActionCard = ({
  url,
  eyebrow,
  label,
  dark = true,
}: {
  url: string;
  eyebrow: string;
  label: string;
  dark?: boolean;
}) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => window.dispatchEvent(new Event('portfolio:silence-videos'))}
    className={`group grid min-h-24 w-full max-w-[30rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-6 border px-5 py-4 text-left transition-colors duration-300 sm:px-6 sm:py-5 ${
      dark
        ? 'border-[rgba(242,237,226,0.22)] bg-[rgba(242,237,226,0.025)] hover:border-[var(--ember)]'
        : 'border-neutral-300 bg-neutral-50/60 hover:border-[#B3543A]'
    }`}
    aria-label={`${label}, opens in a new tab`}
  >
    <span>
      <span
        className={`block text-[0.65rem] uppercase tracking-[0.18em] ${
          dark ? 'text-[rgba(242,237,226,0.58)]' : 'text-neutral-500'
        }`}
      >
        {eyebrow}
      </span>
      <span
        className={`mt-2 block text-base font-light ${
          dark
            ? 'text-[var(--cream-ink)] group-hover:text-[var(--ember)]'
            : 'text-neutral-800 group-hover:text-[#B3543A]'
        }`}
      >
        {label}
      </span>
    </span>
    <span
      aria-hidden="true"
      className={`text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${
        dark ? 'text-[var(--ember)]' : 'text-[#B3543A]'
      }`}
    >
      ↗
    </span>
  </a>
);

// The quiet second door: pages that lift the action card above the fold
// keep this one-line exit where the card used to sit, so a visitor who
// reads to the end still lands on a way in.
const PrototypeExitLink = ({
  url,
  label,
  dark = true,
}: {
  url: string;
  label: string;
  dark?: boolean;
}) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => window.dispatchEvent(new Event('portfolio:silence-videos'))}
    className={`group inline-flex items-center gap-3 text-base font-light ${
      dark
        ? 'text-[rgba(242,237,226,0.78)] hover:text-[var(--ember)]'
        : 'text-neutral-700 hover:text-[#B3543A]'
    }`}
    aria-label={`${label}, opens in a new tab`}
  >
    <span className="border-b border-current pb-0.5">{label}</span>
    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
  </a>
);


// Reusable component for the text block
const ProjectTextBlock = ({ project, dark = false }: { project: Project; dark?: boolean }) => {
  const paragraphs = project.description.split('\n\n').filter(Boolean);
  const lastParagraph = paragraphs[paragraphs.length - 1];
  const hasCallout = paragraphs.length > 2 && lastParagraph.length < 80;
  const bodyParagraphs = hasCallout ? paragraphs.slice(1, -1) : paragraphs.slice(1);

  // Detect pull quotes: paragraphs wrapped in curly quotes or straight quotes
  const isPullQuote = (text: string) => {
    const trimmed = text.trim();
    return (trimmed.startsWith('\u201C') && trimmed.endsWith('\u201D')) ||
           (trimmed.startsWith('"') && trimmed.endsWith('"'));
  };

  const stripQuotes = (text: string) => {
    return text.trim().replace(/^[\u201C"]/,'').replace(/[\u201D"]$/,'');
  };

  // Lead paragraph analysis
  const leadText = paragraphs[0] || '';
  const isEpigraph = leadText.startsWith('\u201C') || leadText.startsWith('"');
  const dropCapLetter = leadText.charAt(0);
  const leadRest = leadText.slice(1);

  // Parse epigraph into quote + attribution
  const parseEpigraph = (text: string) => {
    const dashMatch = text.match(/(.+?)\n\u2014\s*(.+)/s) || text.match(/(.+?)\s*\u2014\s*(.+)/);
    if (dashMatch) {
      return { quote: stripQuotes(dashMatch[1].trim()), attribution: dashMatch[2].trim() };
    }
    return { quote: stripQuotes(text), attribution: '' };
  };

  return (
    <div className="w-full max-w-5xl mt-8 md:mt-12">
        <div className="max-w-2xl">
            {/* Category label */}
            {(project.client || project.categoryLabel) && (
              <p className={`${dark ? 'text-[0.68rem]' : 'text-[10px]'} tracking-[0.2em] uppercase font-normal mb-4 ${dark ? 'text-[var(--ember)]' : 'text-neutral-400'}`}>
                {[project.client, project.categoryLabel].filter(Boolean).join(' \u00B7 ')}
              </p>
            )}

            <div className="mb-8">
              <h1
                className={`${dark ? 'font-serif text-[clamp(2.8rem,6vw,5rem)] leading-[0.92] tracking-[-0.015em]' : 'text-3xl md:text-4xl'} font-normal ${dark ? 'text-[var(--cream-ink)]' : ''}`}
              >
                {project.title}
              </h1>
              {(project.subtitle || project.descriptor) && (
                <p className={`${dark ? 'mt-3 text-base leading-relaxed text-[rgba(242,237,226,0.72)]' : 'text-lg md:text-xl italic text-neutral-500'} font-light`}>
                  {project.subtitle || project.descriptor}
                </p>
              )}
            </div>

            {project.liveUrl && project.liveUrlFirst && (
              <div className="mb-10">
                <ProjectActionCard
                  url={project.liveUrl}
                  eyebrow={project.liveUrlEyebrow || 'Interactive prototype'}
                  label={project.liveUrlLabel || 'Try the prototype'}
                  dark={dark}
                />
              </div>
            )}

            {/* Lead: epigraph or drop cap */}
            {leadText && isEpigraph ? (
              <blockquote className={`border-l-2 pl-6 mb-8 ${dark ? 'border-[rgba(242,237,226,0.2)]' : 'border-neutral-300'}`}>
                <p className={`font-body-serif text-xl md:text-2xl font-light leading-relaxed italic ${dark ? 'text-[rgba(242,237,226,0.82)]' : 'text-neutral-700'}`}>
                  {parseEpigraph(leadText).quote}
                </p>
                {parseEpigraph(leadText).attribution && (
                  <p className={`text-sm font-light mt-3 tracking-wide ${dark ? 'text-[rgba(242,237,226,0.55)]' : 'text-neutral-500'}`}>
                    &mdash; {parseEpigraph(leadText).attribution}
                  </p>
                )}
              </blockquote>
            ) : leadText ? (
              <p className={`font-body-serif text-xl md:text-2xl font-light leading-relaxed mb-8 ${dark ? 'text-[rgba(242,237,226,0.86)]' : 'text-neutral-800'}`}>
                <span className="float-left text-5xl md:text-6xl font-normal leading-[0.8] mr-2 mt-1">{dropCapLetter}</span>
                {leadRest}
              </p>
            ) : null}

            {/* Subtle divider between lead and body */}
            {bodyParagraphs.length > 0 && (
              <div className={`w-10 h-px mb-8 ${dark ? 'bg-[rgba(242,237,226,0.2)]' : 'bg-neutral-300'}`} />
            )}

            {/* Body paragraphs, with pull quote detection */}
            {bodyParagraphs.map((para, i) =>
              isPullQuote(para) ? (
                <blockquote key={i} className={`border-l-2 pl-6 my-10 ${dark ? 'border-[rgba(242,237,226,0.2)]' : 'border-neutral-300'}`}>
                  <p className={`font-body-serif text-xl md:text-2xl font-light leading-relaxed italic ${dark ? 'text-[rgba(242,237,226,0.78)]' : 'text-neutral-700'}`}>
                    {stripQuotes(para)}
                  </p>
                </blockquote>
              ) : (
                <p key={i} className={`font-body-serif text-base md:text-lg font-light leading-[1.85] mb-7 ${dark ? 'text-[rgba(242,237,226,0.72)]' : 'text-neutral-700'}`}>
                  {para}
                </p>
              )
            )}

            {/* Closing callout: short final lines get pulled out */}
            {hasCallout && (
              <p className={`font-body-serif text-lg md:text-xl font-light italic mt-10 mb-8 ${dark ? 'text-[rgba(242,237,226,0.86)]' : 'text-neutral-800'}`}>
                {lastParagraph}
              </p>
            )}

            {project.formats && (
                <div className="mt-10 mb-8">
                    <span className={`block text-[10px] tracking-[0.14em] uppercase font-normal mb-3 ${dark ? 'text-[rgba(242,237,226,0.48)]' : 'text-neutral-400'}`}>Formats</span>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        {project.formats.map((format, index) => (
                            <p key={index} className={`text-base md:text-lg font-light ${dark ? 'text-[rgba(242,237,226,0.72)]' : 'text-neutral-700'}`}>{format}</p>
                        ))}
                    </div>
                </div>
            )}

            {project.liveUrl && !project.liveUrlFirst && (
              <div className="mt-10 mb-2">
                <ProjectActionCard
                  url={project.liveUrl}
                  eyebrow={project.liveUrlEyebrow || 'Interactive prototype'}
                  label={project.liveUrlLabel || 'Try the prototype'}
                  dark={dark}
                />
              </div>
            )}
            {project.liveUrl && project.liveUrlFirst && (
              <div className="mt-10 mb-2">
                <PrototypeExitLink url={project.liveUrl} label={project.liveUrlLabel || 'Try the prototype'} dark={dark} />
              </div>
            )}

        </div>
    </div>
  );
};


const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const vtNavigate = useViewTransitionNavigate();
  // Resolve the route synchronously. The previous effect-driven lookup left
  // the first render completely empty, which created a visible dark flash
  // between the homepage card and the project's media.
  const project = PROJECTS.find(candidate => candidate.id === id) ?? null;
  const [isClosing, setIsClosing] = useState(false);
  

  useEffect(() => {
    // Scroll to top on new project load
    window.scrollTo(0, 0);

    if (!project) {
      navigate('/');
    }
  }, [id, navigate, project]);

    

  // location.key is 'default' only for the very first entry in this tab's
  // history (a direct link, bookmark, or refresh landed here with nothing
  // in-app before it). React Router's own signal means "there is no real
  // back destination." Any in-app navigation before this page replaces it
  // with a unique key, so navigate(-1) is safe: it returns to wherever the
  // visitor actually came from (Labs, Productions, or the old homepage),
  // rather than always dropping them on '/' regardless of entry point.
  const hasInAppHistory = location.key !== 'default';

  const handleClose = () => {
    const destination = hasInAppHistory ? -1 : '/';
    if (!(document as any).startViewTransition) {
      // Fallback for browsers without View Transitions API
      setIsClosing(true);
      setTimeout(() => navigate(destination as any), 300);
      return;
    }
    vtNavigate(destination);
  };
  
  if (!project) {
    return null; 
  }

  const visibleProjects = getVisibleProjects();
  const visibleIndex = visibleProjects.findIndex(p => p.id === id);
  const prevProject = visibleIndex > 0 ? visibleProjects[visibleIndex - 1] : visibleProjects[visibleProjects.length - 1];
  const nextProject = visibleIndex < visibleProjects.length - 1 ? visibleProjects[visibleIndex + 1] : visibleProjects[0];
  const isDarkEditorial = project.id === 'narrative-space' || project.id === 'visual-audiobooks';

  /**
   * Shared screening-room frame for project artifacts. The Labs chapter has
   * already done the explaining; these pages are for the thing itself: a
   * demo, a visualization, or a pitch, plus one concise line of context.
   */
  const renderArtifactRoom = ({
    eyebrow,
    title,
    subtitle,
    media,
    statement,
    aside,
    action,
    actionFirst = false,
    exit,
  }: {
    eyebrow: string;
    title: string;
    subtitle: string;
    media: React.ReactNode;
    statement: React.ReactNode;
    aside?: React.ReactNode;
    action?: React.ReactNode;
    /** Lift the action card above the media so the first screenful holds
     *  the door; `exit` then renders the quiet link in the old bottom slot. */
    actionFirst?: boolean;
    exit?: React.ReactNode;
  }) => (
      <div
        className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        style={{
          background:
            'radial-gradient(ellipse 72% 58% at 50% 42%, rgba(232,166,114,0.055), transparent 72%), var(--ink-deep)',
          color: 'var(--cream-ink)',
          overscrollBehavior: 'contain',
        }}
      >
        <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 py-5 sm:px-6 md:px-10 md:py-7 xl:px-14">
          <header className="flex w-full shrink-0 items-center justify-between">
            <button
              onClick={handleClose}
              className="group -ml-2 inline-flex min-h-11 items-center gap-3 px-2 text-[0.7rem] uppercase tracking-[0.18em] transition-colors duration-300"
              style={{ color: 'rgba(242,237,226,0.67)' }}
              aria-label="Back to work"
            >
              <BackIcon />
              <span className="group-hover:text-[var(--cream-ink)]">Work</span>
            </button>
            <Link
              to="/"
              className="text-[0.65rem] uppercase tracking-[0.2em] transition-colors duration-300 hover:text-[var(--cream-ink)]"
              style={{ color: 'rgba(242,237,226,0.67)' }}
            >
              Jeanine Emilia Cornillot
            </Link>
          </header>

          <main className="flex flex-1 flex-col justify-center py-10 md:py-12">
            <section className="mb-6 grid items-end gap-5 md:mb-8 md:grid-cols-[1fr_auto] md:gap-12">
              <div>
                <p
                  className="mb-3 text-[0.68rem] uppercase tracking-[0.2em]"
                  style={{ color: 'var(--ember)' }}
                >
                  {eyebrow}
                </p>
                <h1
                  className="font-serif font-normal leading-[0.88]"
                  style={{
                    fontSize:
                      title.length > 22
                        ? 'clamp(2.65rem, 5vw, 5.2rem)'
                        : title.length > 12
                        ? 'clamp(3.15rem, 6.5vw, 6.35rem)'
                        : 'clamp(3.8rem, 7.5vw, 7rem)',
                  }}
                >
                  {title}
                </h1>
              </div>
              <p
                className="max-w-[34rem] pb-1 font-light leading-relaxed md:text-right"
                style={{ color: 'rgba(242,237,226,0.72)' }}
              >
                {subtitle}
              </p>
            </section>

            {media}

            {/* Consistent placement across every project (Jeanine, 2026-08-16):
                the door sits directly under the video, everywhere. */}
            {action && actionFirst && <div className="mt-6 md:mt-8">{action}</div>}

            <div
              className={`grid gap-7 border-t py-6 md:items-center md:gap-12 md:py-7 ${aside ? 'md:grid-cols-[minmax(0,1fr)_auto]' : ''}`}
              style={{ borderColor: 'rgba(242,237,226,0.16)' }}
            >
              {statement}
              {aside}
            </div>
            {action && !actionFirst && (
              <div
                className="border-t py-6 md:py-7"
                style={{ borderColor: 'rgba(242,237,226,0.16)' }}
              >
                {action}
              </div>
            )}
            {exit && actionFirst && (
              <div
                className="border-t py-6 md:py-7"
                style={{ borderColor: 'rgba(242,237,226,0.16)' }}
              >
                {exit}
              </div>
            )}
          </main>
        </div>
      </div>
  );

  const renderStaticDemoRoom = () => {
    const demo = project.mainVideos[0];

    return renderArtifactRoom({
      eyebrow: 'Ghost Mode Labs · 2026',
      title: project.title,
      subtitle: 'Scripted supernatural series built from online folklore',
      media: demo ? (
        <div
          className="w-full border"
          style={{
            borderColor: 'rgba(242,237,226,0.18)',
            viewTransitionName: 'project-hero',
          } as React.CSSProperties}
        >
          <VideoPlayer
            src={demo.url}
            posterUrl={demo.posterUrl}
            aspectRatio={demo.aspectRatio}
            autoplay={demo.autoplay}
            loop={demo.loop}
            showControls={demo.showControls}
            hasAudio={demo.hasAudio}
            projectId={project.id}
            startUnmuted={Boolean(demo.hasAudio && !demo.startMuted)}
          />
        </div>
      ) : null,
      statement: (
        <p
          className="max-w-[48rem] font-body-serif text-[1.05rem] font-light leading-relaxed md:text-[1.18rem]"
          style={{ color: 'rgba(242,237,226,0.82)' }}
        >
          Last Active mapped 582 recurring patterns across 6,884 public accounts. It became the research engine behind Static.
        </p>
      ),
      action: project.liveUrl ? (
        <ProjectActionCard
          url={project.liveUrl}
          eyebrow={project.liveUrlEyebrow || 'Original pitch'}
          label={project.liveUrlLabel || 'View the original pitch'}
        />
      ) : undefined,
      actionFirst: true,
      exit: project.liveUrl ? (
        <PrototypeExitLink url={project.liveUrl} label={project.liveUrlLabel || 'View the original pitch'} />
      ) : undefined,
    });
  };

  const renderMultiverseArtifactRoom = () => {
    const visualization = project.mainImages?.[0];

    return renderArtifactRoom({
      eyebrow: 'Amazon AGI · 2025',
      title: project.title,
      subtitle: 'One story, four formats',
      media: visualization ? (
        <figure
          className="w-full border"
          style={{
            borderColor: 'rgba(242,237,226,0.18)',
            viewTransitionName: 'project-hero',
          } as React.CSSProperties}
        >
          <div className="aspect-video w-full overflow-hidden bg-[var(--ink-deep)]">
            <img
              src={visualization.url}
              alt="Concept visualization of Multiverse Quad on an AWS re:Invent keynote stage"
              className="h-full w-full scale-[1.03] object-cover"
            />
          </div>
          <figcaption
            className="flex items-center justify-between gap-4 border-t px-4 py-3 text-[0.62rem] uppercase tracking-[0.18em] sm:px-5"
            style={{ borderColor: 'rgba(242,237,226,0.16)', color: 'rgba(242,237,226,0.62)' }}
          >
            <span>Concept visualization</span>
            <span>AWS re:Invent</span>
          </figcaption>
        </figure>
      ) : null,
      statement: (
        <p
          className="max-w-[50rem] font-body-serif text-[1.05rem] font-light leading-relaxed md:text-[1.18rem]"
          style={{ color: 'rgba(242,237,226,0.82)' }}
        >
          Built with Amazon AGI engineers and product leadership, one scene from The Last City became four simultaneous formats.
        </p>
      ),
      aside: (
        <p className="max-w-[20rem] md:text-right">
          <span
            className="block text-[0.62rem] uppercase tracking-[0.18em]"
            style={{ color: 'rgba(242,237,226,0.62)' }}
          >
            AWS re:Invent
          </span>
          <span className="mt-1 block text-sm leading-relaxed" style={{ color: 'var(--cream-ink)' }}>
            Shortlisted for Andy Jassy’s keynote
          </span>
        </p>
      ),
    });
  };

  const renderCreatorLabArtifactRoom = () => {
    const archive = project.mainVideos[1];

    return renderArtifactRoom({
      eyebrow: 'Wondery · 2025',
      title: project.title,
      subtitle: 'Creative innovation',
      media: archive ? (
        <figure
          className="w-full border"
          style={{
            borderColor: 'rgba(242,237,226,0.18)',
            viewTransitionName: 'project-hero',
          } as React.CSSProperties}
        >
          <VideoPlayer
            src={archive.url}
            posterUrl={archive.posterUrl}
            aspectRatio={archive.aspectRatio}
            autoplay={archive.autoplay}
            loop={archive.loop}
            showControls={archive.showControls}
            hasAudio={archive.hasAudio}
            projectId={project.id}
            startUnmuted={false}
          />
          <figcaption
            className="grid gap-3 border-t px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-baseline sm:gap-10 sm:px-5"
            style={{ borderColor: 'rgba(242,237,226,0.16)' }}
          >
            <span className="text-sm" style={{ color: 'var(--cream-ink)' }}>
              AI Lab Archive
            </span>
            <span
              className="max-w-[60rem] text-[0.68rem] leading-relaxed tracking-[0.06em] sm:text-right"
              style={{ color: 'rgba(242,237,226,0.62)' }}
            >
              I built this archive so people could catch up on sessions they missed or learn independently. Each module included a podcast, study guide, FAQs, original decks, and in some cases a recorded partner demonstration.
            </span>
          </figcaption>
        </figure>
      ) : null,
      statement: (
        <p
          className="max-w-[50rem] font-body-serif text-[1.05rem] font-light leading-relaxed md:text-[1.18rem]"
          style={{ color: 'rgba(242,237,226,0.82)' }}
        >
          I founded Wondery’s first AI Creator Lab and built the curriculum, partnerships, and learning archive that grew it from four people to more than fifty across the company.
        </p>
      ),
      aside: (
        <p className="max-w-[22rem] md:text-right">
          <span
            className="block text-[0.62rem] uppercase tracking-[0.18em]"
            style={{ color: 'rgba(242,237,226,0.62)' }}
          >
            Outcome
          </span>
          <span className="mt-1 block text-sm leading-relaxed" style={{ color: 'var(--cream-ink)' }}>
            Three projects greenlit
          </span>
        </p>
      ),
    });
  };

  const renderMythosArtifactRoom = () => {
    const demo = project.mainVideos[0];

    return renderArtifactRoom({
      eyebrow: 'Ghost Mode Labs · 2026',
      title: project.title,
      subtitle: 'Franchise intelligence',
      media: demo ? (
        <figure
          className="w-full border"
          style={{
            borderColor: 'rgba(242,237,226,0.18)',
            viewTransitionName: 'project-hero',
          } as React.CSSProperties}
        >
          <VideoPlayer
            src={demo.url}
            posterUrl={demo.posterUrl}
            aspectRatio={demo.aspectRatio}
            autoplay={demo.autoplay}
            loop={demo.loop}
            showControls={demo.showControls}
            hasAudio={demo.hasAudio}
            projectId={project.id}
            startUnmuted={Boolean(demo.hasAudio && !demo.startMuted)}
          />
          <figcaption
            className="flex flex-col gap-2 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5"
            style={{ borderColor: 'rgba(242,237,226,0.16)' }}
          >
            <span className="text-sm" style={{ color: 'var(--cream-ink)' }}>
              Prototype demonstration
            </span>
            <span
              className="text-[0.62rem] uppercase tracking-[0.18em]"
              style={{ color: 'rgba(242,237,226,0.62)' }}
            >
              Mythology · Folklore · Public domain IP
            </span>
          </figcaption>
        </figure>
      ) : null,
      statement: (
        <p
          className="max-w-[52rem] font-body-serif text-[1.05rem] font-light leading-relaxed md:text-[1.18rem]"
          style={{ color: 'rgba(242,237,226,0.82)' }}
        >
          MythOS maps 494 public-domain stories across cultures and centuries. Start with Circe and trace her through 46 cultures and 3,500 years.
        </p>
      ),
    });
  };

  const renderUnstillArtifactRoom = () => {
    const demo = project.mainVideos[0];

    return renderArtifactRoom({
      eyebrow: 'Ghost Mode Labs · 2026',
      title: project.title,
      subtitle: 'Regenerative lives',
      media: demo ? (
        <figure
          className="w-full border"
          style={{
            borderColor: 'rgba(242,237,226,0.18)',
            viewTransitionName: 'project-hero',
          } as React.CSSProperties}
        >
          <VideoPlayer
            src={demo.url}
            posterUrl={demo.posterUrl}
            aspectRatio={demo.aspectRatio}
            autoplay={demo.autoplay}
            loop={demo.loop}
            showControls={demo.showControls}
            hasAudio={demo.hasAudio}
            projectId={project.id}
            startUnmuted={Boolean(demo.hasAudio && !demo.startMuted)}
          />
          <figcaption
            className="flex flex-col gap-2 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5"
            style={{ borderColor: 'rgba(242,237,226,0.16)' }}
          >
            <span className="text-sm" style={{ color: 'var(--cream-ink)' }}>
              Prototype demonstration
            </span>
            <span
              className="text-[0.62rem] uppercase tracking-[0.18em]"
              style={{ color: 'rgba(242,237,226,0.62)' }}
            >
              Archives in motion · 1920s Sydney
            </span>
          </figcaption>
        </figure>
      ) : null,
      statement: (
        <div className="max-w-[52rem]">
          <p
            className="max-w-[48rem] font-body-serif text-[1.05rem] font-light leading-relaxed md:text-[1.18rem]"
            style={{ color: 'rgba(242,237,226,0.82)' }}
          >
            Unstill begins with people preserved in 1920s Sydney police archives, often as little more than a name, date, photograph, and charge.
          </p>
          <blockquote className="mt-5">
            <p
              className="font-body-serif text-[1.15rem] font-light italic leading-relaxed md:text-[1.45rem]"
              style={{ color: 'rgba(242,237,226,0.84)' }}
            >
              “The archive is a record of power, not of truth.”
            </p>
            <cite
              className="mt-2 block text-[0.65rem] not-italic uppercase tracking-[0.18em]"
              style={{ color: 'rgba(242,237,226,0.5)' }}
            >
              Saidiya Hartman
            </cite>
          </blockquote>
        </div>
      ),
      action: project.liveUrl ? (
        <ProjectActionCard
          url={project.liveUrl}
          eyebrow={project.liveUrlEyebrow || 'Proposal for Museums of History NSW'}
          label={project.liveUrlLabel || 'Explore Unstill'}
        />
      ) : undefined,
      actionFirst: true,
      exit: project.liveUrl ? (
        <PrototypeExitLink url={project.liveUrl} label={project.liveUrlLabel || 'Explore Unstill'} />
      ) : undefined,
    });
  };

  const renderCampaignSystemArtifactRoom = () => {
    const artifacts = [project.mainVideos[1], project.mainVideos[2]].filter(Boolean);
    const labels = [
      { title: '01 · Prototype board', detail: '12+ campaign concepts' },
      { title: '02 · The Last City Hub', detail: 'Marketing · Ad sales · Film/TV' },
    ];

    return renderArtifactRoom({
      eyebrow: 'Wondery · 2023–24',
      title: 'In-World Campaign System',
      subtitle: 'The Last City',
      media: (
        <div className="flex w-full flex-col gap-8 md:gap-12">
          {artifacts.map((artifact, index) => (
            <figure
              key={artifact.url}
              className="border"
              style={{
                borderColor: 'rgba(242,237,226,0.18)',
                ...(index === 0 ? { viewTransitionName: 'project-hero' } : {}),
              } as React.CSSProperties}
            >
              <VideoPlayer
                src={artifact.url}
                posterUrl={artifact.posterUrl}
                aspectRatio={artifact.aspectRatio}
                autoplay={artifact.autoplay}
                loop={artifact.loop}
                showControls={artifact.showControls}
                hasAudio={artifact.hasAudio}
                projectId={project.id}
                startUnmuted={false}
              />
              <figcaption
                className="flex flex-col gap-2 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5"
                style={{ borderColor: 'rgba(242,237,226,0.16)' }}
              >
                <span className="text-sm" style={{ color: 'var(--cream-ink)' }}>
                  {labels[index].title}
                </span>
                <span
                  className="text-[0.62rem] uppercase tracking-[0.18em]"
                  style={{ color: 'rgba(242,237,226,0.62)' }}
                >
                  {labels[index].detail}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      ),
      statement: (
        <p
          className="max-w-[52rem] font-body-serif text-[1.05rem] font-light leading-relaxed md:text-[1.18rem]"
          style={{ color: 'rgba(242,237,226,0.82)' }}
        >
          I developed more than a dozen in-world campaign concepts for The Last City, then built a shared story hub for teams across the company.
        </p>
      ),
      aside: (
        <p className="max-w-[20rem] md:text-right">
          <span
            className="block text-[0.62rem] uppercase tracking-[0.18em]"
            style={{ color: 'rgba(242,237,226,0.62)' }}
          >
            Two prototypes
          </span>
          <span className="mt-1 block text-sm leading-relaxed" style={{ color: 'var(--cream-ink)' }}>
            Moved into production
          </span>
        </p>
      ),
    });
  };

  if (project.id === 'static') {
    return renderStaticDemoRoom();
  }

  if (project.id === 'multiverse-quad') {
    return renderMultiverseArtifactRoom();
  }

  if (project.id === 'ai-creator-lab') {
    return renderCreatorLabArtifactRoom();
  }

  if (project.id === 'mythos') {
    return renderMythosArtifactRoom();
  }

  if (project.id === 'unstill') {
    return renderUnstillArtifactRoom();
  }

  if (project.id === 'in-world-social-campaign') {
    return renderCampaignSystemArtifactRoom();
  }
  
  const renderDefaultLayout = () => (
    <>
      {project.embedUrl ? (
        <div className="w-full max-w-5xl py-8" style={{ viewTransitionName: 'project-hero' } as React.CSSProperties}>
          <PhoneEmbed src={project.embedUrl} title={`${project.title}: interactive prototype`} />
        </div>
      ) : project.interactivePitch ? (
         <div className="w-full max-w-5xl" style={{ viewTransitionName: 'project-hero' } as React.CSSProperties}>
            <a 
                href={project.interactivePitch.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative block w-full aspect-video bg-neutral-200 border border-neutral-300"
                aria-label={`View interactive pitch for ${project.title}`}
            >
                <video
                    src={project.interactivePitch.previewVideoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-100 scale-95 ease-in-out">
                        <span className="text-white text-lg font-light mr-3">View Pitch</span>
                        <ExternalLinkIcon className="h-5 w-5 text-white" />
                    </div>
                </div>
            </a>
         </div>
      ) : (
        <div className="w-full max-w-5xl space-y-8">
            {project.mainVideos.map((video, index) => (
                <div
                  key={`video-container-${index}`}
                  className={isDarkEditorial ? 'border' : undefined}
                  style={{
                    ...(index === 0 ? { viewTransitionName: 'project-hero' } : {}),
                    ...(isDarkEditorial ? { borderColor: 'rgba(242,237,226,0.18)' } : {}),
                  } as React.CSSProperties}
                >
                  <VideoPlayer
                    src={video.url}
                    posterUrl={video.posterUrl}
                    glassPlateImageUrl={video.glassPlateImageUrl}
                    aspectRatio={video.aspectRatio}
                    autoplay={video.autoplay}
                    loop={video.loop}
                    showControls={video.showControls}
                    hasAudio={video.hasAudio}
                    projectId={project.id}
                    startUnmuted={index === 0 && video.hasAudio && !video.startMuted}
                  />
                  {video.caption && (
                      <p className="text-center text-xs text-neutral-500 mt-2 font-light tracking-wide">{video.caption}</p>
                  )}
                </div>
            ))}
            {project.mainImages && project.mainImages.map((image, index: number) => {
              const needsTransitionName = project.mainVideos.length === 0 && index === 0;
              const getAspectRatioClass = () => {
                switch (image.aspectRatio) {
                  case '16:9': return 'aspect-video';
                  case '9:16': return 'aspect-[9/16]';
                  case '4:3': return 'aspect-[4/3]';
                  case '1:1': return 'aspect-square';
                  default: return 'aspect-video';
                }
              };
              return (
                <div key={`image-${index}`} className={`relative w-full mx-auto ${getAspectRatioClass()}`} style={needsTransitionName ? { viewTransitionName: 'project-hero' } as React.CSSProperties : undefined}>
                  <img src={image.url} alt={`${project?.title} content`} className="w-full h-full object-contain bg-black" loading="lazy" />
                </div>
              )
            })}
        </div>
      )}
      <ProjectTextBlock project={project} dark={isDarkEditorial} />
    </>
  );

  const renderAICreatorLabLayout = () => {
    const video2 = project.mainVideos[1];
    const captionParts = video2?.caption?.split('\n\n') || [];
    const captionTitle = captionParts[0] || '';
    const captionBody = captionParts.slice(1).join('\n\n');

    return (
        <>
          <div className="w-full max-w-5xl">
            {project.mainVideos[0] && (
              <div key="video-container-0" style={{ viewTransitionName: 'project-hero' } as React.CSSProperties}>
                <VideoPlayer
                  src={project.mainVideos[0].url}
                  posterUrl={project.mainVideos[0].posterUrl}
                  aspectRatio={project.mainVideos[0].aspectRatio}
                  autoplay={project.mainVideos[0].autoplay}
                  loop={project.mainVideos[0].loop}
                  showControls={project.mainVideos[0].showControls}
                  hasAudio={project.mainVideos[0].hasAudio}
                  projectId={project.id}
                />
                {project.mainVideos[0].caption && (
                  <p className="text-center text-xs text-neutral-500 mt-2 font-light tracking-wide">
                    {project.mainVideos[0].caption}
                  </p>
                )}
              </div>
            )}
          </div>

          <ProjectTextBlock project={project} />
    
          <div className="w-full max-w-5xl mt-8 md:mt-12">
            {video2 && (
              <div key="video-container-1">
                <VideoPlayer
                  src={video2.url}
                  posterUrl={video2.posterUrl}
                  aspectRatio={video2.aspectRatio}
                  autoplay={video2.autoplay}
                  loop={video2.loop}
                  showControls={video2.showControls}
                  hasAudio={video2.hasAudio}
                  projectId={project.id}
                />
                {video2.caption && (
                  <div className="max-w-2xl mt-8">
                    <h3 className="text-2xl md:text-3xl font-light text-neutral-800 mb-8">{captionTitle}</h3>
                    {captionParts.slice(1).map((para, i) => (
                      <p key={i} className="font-body-serif text-base md:text-lg font-light text-neutral-700 leading-[1.85] mb-7">
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      );
  }

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'} overflow-y-auto ${isDarkEditorial ? 'text-[var(--cream-ink)]' : 'bg-[#F5F2EC]'}`}
      style={{
        overscrollBehavior: 'contain',
        willChange: 'scroll-position',
        ...(isDarkEditorial
          ? {
              background:
                'radial-gradient(ellipse 72% 52% at 50% 28%, rgba(232,166,114,0.045), transparent 72%), var(--ink-deep)',
            }
          : {}),
      }}
    >
      {/* Top gradient only. Grain removed from detail pages (invisible at 0.015 on light bg, wastes CPU) */}
      <div
        className="fixed top-0 left-0 right-0 pointer-events-none"
        style={{
          height: isDarkEditorial ? '100%' : '200px',
          background: isDarkEditorial
            ? 'linear-gradient(to bottom, rgba(242,237,226,0.018), transparent 26%)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0.03), transparent)',
          zIndex: 0,
        }}
      />

      <div className="w-full min-h-screen p-4 md:p-8 flex flex-col" style={{ contain: 'layout', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header className="flex justify-between items-center w-full mb-8 shrink-0">
          <button
            onClick={handleClose}
            className={`group transition-colors ${isDarkEditorial ? '-ml-2 inline-flex min-h-11 items-center gap-3 px-2 text-[0.7rem] uppercase tracking-[0.18em] text-[rgba(242,237,226,0.67)] hover:text-[var(--cream-ink)]' : 'flex items-center space-x-2 text-neutral-600 hover:text-[#B3543A]'}`}
            aria-label="Back to work"
          >
            <BackIcon />
            <span className={isDarkEditorial ? '' : 'opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out font-light text-sm'}>Work</span>
          </button>
          <Link to="/" className={`${isDarkEditorial ? 'text-[0.65rem] tracking-[0.2em] text-[rgba(242,237,226,0.67)] hover:text-[var(--cream-ink)]' : 'text-[11px] tracking-[0.18em] text-neutral-400 hover:text-neutral-700'} uppercase transition-colors duration-300`}>
            Jeanine Emilia Cornillot
          </Link>
        </header>

        {/* Content */}
        <main className="flex-grow flex flex-col items-center">
            {(() => {
              /* visual-audiobooks used to short-circuit here to a "Coming
                 soon" placeholder (looping teaser, no description). Retired
                 2026-08-14 when the page got real content: it now falls
                 through to the default dark-editorial layout, same as
                 Narrative Space, so the Living Photocopy film renders
                 through VideoPlayer with loop off and controls on. */
              if (project.id === 'ai-creator-lab') {
                return renderAICreatorLabLayout();
              } else {
                return (
                  <>
                    {renderDefaultLayout()}
                  </>
                );
              }
            })()}
        </main>
        
        {/* Legacy navigation remains available for old light-layout routes.
            The two dark editorial pages use Work as the single consistent exit. */}
        {!isDarkEditorial && (
          <footer className="w-full mt-auto pt-8 shrink-0">
            {/* Mobile: full-width prev/next with project names */}
            <div className="flex flex-col gap-3 md:hidden">
                <Link
                  to={`/project/${prevProject.id}`}
                  className={`flex items-center gap-3 px-4 py-3 border rounded-sm transition-colors ${isDarkEditorial ? 'border-[rgba(242,237,226,0.18)] text-[rgba(242,237,226,0.62)] hover:border-[rgba(242,237,226,0.34)] hover:text-[var(--cream-ink)]' : 'border-neutral-200 text-neutral-600 hover:text-neutral-800 hover:border-neutral-400'}`}
                >
                    <PrevIcon />
                    <div className="min-w-0">
                      <span className={`block text-[10px] tracking-[0.12em] uppercase ${isDarkEditorial ? 'text-[rgba(242,237,226,0.45)]' : 'text-neutral-400'}`}>Previous</span>
                      <span className="block text-sm font-light truncate">{prevProject.title}</span>
                    </div>
                </Link>
                <Link
                  to={`/project/${nextProject.id}`}
                  className={`flex items-center justify-end gap-3 px-4 py-3 border rounded-sm transition-colors text-right ${isDarkEditorial ? 'border-[rgba(242,237,226,0.18)] text-[rgba(242,237,226,0.62)] hover:border-[rgba(242,237,226,0.34)] hover:text-[var(--cream-ink)]' : 'border-neutral-200 text-neutral-600 hover:text-neutral-800 hover:border-neutral-400'}`}
                >
                    <div className="min-w-0">
                      <span className={`block text-[10px] tracking-[0.12em] uppercase ${isDarkEditorial ? 'text-[rgba(242,237,226,0.45)]' : 'text-neutral-400'}`}>Next</span>
                      <span className="block text-sm font-light truncate">{nextProject.title}</span>
                    </div>
                    <NextIcon />
                </Link>
            </div>
            {/* Desktop: full-width editorial nav */}
            <div className={`hidden md:block border-t mt-4 ${isDarkEditorial ? 'border-[rgba(242,237,226,0.16)]' : 'border-neutral-200'}`}>
              <div className="grid grid-cols-2">
                <Link
                  to={`/project/${prevProject.id}`}
                  className={`group flex items-center gap-4 py-6 pr-8 transition-colors ${isDarkEditorial ? 'text-[rgba(242,237,226,0.55)] hover:text-[var(--cream-ink)]' : 'text-neutral-500 hover:text-neutral-800'}`}
                >
                  <span className="transition-transform duration-200 group-hover:-translate-x-1">
                    <PrevIcon />
                  </span>
                  <div>
                    <span className={`block text-[10px] tracking-[0.14em] uppercase mb-1 ${isDarkEditorial ? 'text-[rgba(242,237,226,0.42)]' : 'text-neutral-400'}`}>Previous</span>
                    <span className="block text-base font-light">{prevProject.title}</span>
                  </div>
                </Link>
                <Link
                  to={`/project/${nextProject.id}`}
                  className={`group flex items-center justify-end gap-4 py-6 pl-8 border-l transition-colors text-right ${isDarkEditorial ? 'border-[rgba(242,237,226,0.16)] text-[rgba(242,237,226,0.55)] hover:text-[var(--cream-ink)]' : 'border-neutral-200 text-neutral-500 hover:text-neutral-800'}`}
                >
                  <div>
                    <span className={`block text-[10px] tracking-[0.14em] uppercase mb-1 ${isDarkEditorial ? 'text-[rgba(242,237,226,0.42)]' : 'text-neutral-400'}`}>Next</span>
                    <span className="block text-base font-light">{nextProject.title}</span>
                  </div>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    <NextIcon />
                  </span>
                </Link>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;
