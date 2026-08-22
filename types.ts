
export interface ProjectVideo {
  url: string;
  posterUrl?: string;
  aspectRatio: '16:9' | '9:16' | '4:3' | '1:1';
  autoplay?: boolean;
  loop?: boolean;
  title?: string;
  subtitle?: string;
  caption?: string;
  showControls?: boolean;
  hasAudio?: boolean;
  /** Playback volume cap, 0-1. Measured 2026-08-21: four sound-on pages
   *  already sat within 2.3dB of each other; this trims the hot outliers
   *  web-side to meet that cluster instead of re-exporting masters. */
  volume?: number;
  startMuted?: boolean;
  glassPlateImageUrl?: string;
  /** Dip to dark at the film's tail and ease the restart in, masking a
   *  loop seam whose master lacks an opening bloom. */
  softLoop?: boolean;
  /** Seconds to skip into the clip before it starts (and restarts on
   *  each loop) — for a clip that opens on something the source
   *  recording can't cut. */
  startTime?: number;
}

export interface ProjectImage {
  url:string;
  aspectRatio: '16:9' | '9:16' | '4:3' | '1:1';
}

export interface Project {
  id: string;
  title: string;
  client: string;
  category: 'Selected' | 'All' | 'Experiments';
  filterCategories?: string[];
  categoryLabel?: string;
  previewVideoUrl?: string;
  previewImageUrl?: string;
  previewPosterUrl?: string;
  previewAutoplay?: boolean;
  previewHasAudio?: boolean;
  mainVideos: ProjectVideo[];
  mainImages?: ProjectImage[];
  description: string;
  descriptor?: string;
  subtitle?: string;
  tools?: string;
  coverTitle?: string;
  /**
   * Cut from the Labs chapter but the detail page is kept (Tender, the
   * In-World Social Campaign). Excluded from getVisibleProjects so the
   * detail page's own Previous/Next carousel cannot surface a project
   * nothing else on the site links to.
   */
  archived?: boolean;
  formats?: string[];
  interactivePitch?: {
    url: string;
    previewVideoUrl: string;
  };
  liveUrl?: string;
  liveUrlLabel?: string;
  liveUrlEyebrow?: string;
  /** One-line how-to rendered inside the action card, under the label. */
  liveUrlNote?: string;
  /** Lift the action card above the description so skimmers cannot miss
   *  it; the old bottom position keeps a quiet text link as the reader's
   *  exit. Rolls out per project after Jeanine approves the shape. */
  liveUrlFirst?: boolean;
  embedUrl?: string;
}