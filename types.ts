
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
  startMuted?: boolean;
  glassPlateImageUrl?: string;
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
  embedUrl?: string;
}