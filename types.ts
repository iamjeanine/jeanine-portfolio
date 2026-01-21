
export interface ProjectVideo {
  url: string;
  aspectRatio: '16:9' | '9:16' | '4:3' | '1:1';
  autoplay?: boolean;
  loop?: boolean;
  title?: string;
  subtitle?: string;
  caption?: string;
  showControls?: boolean;
  hasAudio?: boolean;
}

export interface ProjectImage {
  url: string;
  aspectRatio: '16:9' | '9:16' | '4:3' | '1:1';
}

export interface Project {
  id: string;
  title: string;
  client: string;
  category: 'Selected' | 'All' | 'Experiments';
  previewVideoUrl: string;
  previewAutoplay?: boolean;
  previewHasAudio?: boolean;
  mainVideos: ProjectVideo[];
  mainImages?: ProjectImage[];
  description: string;
  descriptor?: string;
  subtitle?: string;
  tools?: string;
  coverTitle?: string;
  formats?: string[];
}