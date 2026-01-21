
import type { Project } from './types';

export const HERO_VIDEOS = {
  url: 'https://storage.googleapis.com/jeanine-portfolio-video/Heroshotmusic2.mp4',
  posterUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Hero-poster.jpg',
};

export const PROJECTS: Project[] = [
  {
    id: 'in-world-social-campaign',
    title: 'The Last City',
    coverTitle: 'Social Campaign',
    client: 'Wondery',
    category: 'Selected',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Socials3.mp4',
    previewAutoplay: true,
    previewHasAudio: true,
    mainVideos: [
      { url: 'https://storage.googleapis.com/jeanine-portfolio-video/B9%20Prototype.mp4', aspectRatio: '16:9', autoplay: true },
      { 
        url: 'https://storage.googleapis.com/jeanine-portfolio-video/B9%20Whiteboard.mp4', 
        aspectRatio: '16:9', 
        autoplay: true, 
        loop: true, 
        showControls: false
      },
      {
        url: 'https://storage.googleapis.com/jeanine-portfolio-video/AI%20Story%20Bible%20Explorer.mp4',
        aspectRatio: '16:9',
        autoplay: true,
        loop: true,
        showControls: true,
        hasAudio: true,
        caption: 'Story Bible Explorer\n\nBuilt for cross-department teams. One internal source to answer questions about the show for marketing, ad sales, and film/TV.'
      }
    ],
    descriptor: 'Social Campaign',
    description: '12+ in-world social prototypes for a Wondery sci-fi series. Marketing as if created by the city itself. Destination spots, tours, and character testimonials.\n\nSome pieces played with TikTok formats and trending sounds. All voices by ElevenLabs. Two prototypes moved into production.',
    tools: 'Tools: ElevenLabs, Midjourney, Runway, Luma, Magnific, After Effects, Premiere Pro, CapCut.',
  },
  {
    id: 'the-anomaly-zone',
    title: 'The Anomaly Zone',
    client: 'Speculative',
    category: 'Selected',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/B2%20cover.mp4',
    previewAutoplay: true,
    previewHasAudio: true,
    mainVideos: [
      { url: 'https://storage.googleapis.com/jeanine-portfolio-video/B2%20Moodpiece.mp4', aspectRatio: '16:9' }
    ],
    descriptor: 'Grounded sci-fi audio series - pilot material',
    description: 'Explores uncanny phenomena within a quarantined exclusion zone. Voices, music, and sound effects generated using ElevenLabs. One of several mood pieces developed for QCODE pitch.',
    tools: 'Tools: ElevenLabs, Runway, Midjourney, Magnific, CapCut',
  },
  {
    id: 'strange-hour',
    title: 'Strange Hour',
    client: 'A24 Labs',
    category: 'Selected',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Cover%20White%20Stranghour.mp4',
    previewAutoplay: true,
    previewHasAudio: true,
    mainVideos: [
      { url: 'https://storage.googleapis.com/jeanine-portfolio-video/B1-Strangehour.mp4', aspectRatio: '16:9' }
    ],
    descriptor: 'Archival reconstructions - pilot excerpt',
    description: 'Brought 1920s Sydney to life from mugshots, blueprints, and crime records. Voice, music, and sound effects by ElevenLabs. Proof-of-concept pitched to museums for activating archival collections.',
    tools: 'Tools: ElevenLabs, Midjourney, Nano Banana, Runway, Veo 3.1, CapCut'
  },
  {
    id: 'podcast-mixtape',
    title: 'Podcast Mixtape',
    client: 'Self-initiated',
    category: 'Selected',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Minisdisc%20recorder2.mp4',
    previewAutoplay: true,
    mainVideos: [
      { url: 'https://storage.googleapis.com/jeanine-portfolio-video/B3-MiniDisc.mp4', aspectRatio: '16:9', autoplay: true }
    ],
    descriptor: 'Audio discovery prototype',
    description: 'Enter a feeling or situation, get a personalized podcast mixtape. Built around a vintage cassette interface because discovery should feel tactile, not algorithmic. Users describe their mood or moment, AI builds the mix.',
    tools: 'Tools: Google AI Studio (Gemini)',
  },
  {
    id: 'the-last-city',
    title: 'Multiverse Quad',
    client: 'Amazon AGI',
    category: 'Selected',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/CoverLCaudio2.mp4',
    previewHasAudio: true,
    mainVideos: [],
    mainImages: [
      { url: 'https://storage.googleapis.com/jeanine-portfolio-video/B4%20Interior.jpg', aspectRatio: '16:9' }
    ],
    descriptor: 'Multiformat storytelling',
    description: "Shortlisted for Andy Jassy's AWS re:Invent keynote. One story from The Last City adapted into four AI-generated formats. Pitched to Amazon's AGI team and co-developed with their engineers.",
    formats: [
        'Animated short film',
        'Graphic novel',
        'Visual audiobook',
        'Podcast'
    ],
  },
  {
    id: 'news-tracker',
    title: 'Throughline',
    coverTitle: 'Story Tracker',
    client: 'Google Antigravity',
    category: 'Selected',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/CoverStoryTracker4.mp4',
    mainVideos: [
      { 
        url: 'https://storage.googleapis.com/jeanine-portfolio-video/Newtrackerinterior.mp4', 
        aspectRatio: '16:9', 
        autoplay: true,
        showControls: true
      }
    ],
    descriptor: 'Long-tail news tracking',
    description: "Some stories flare up, disappear, then resurface with new developments. Throughline follows a single story across that entire arc, keeping the reporting together as it evolves over time. Built with Google's Antigravity using a four-agent workflow.",
    tools: 'Tools: Antigravity (Gemini 3 Pro, Deep Think, Flash)',
  },
  {
    id: 'ai-creator-lab',
    title: 'AI Creator Lab',
    client: 'Google Labs',
    category: 'Selected',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/B6-Cover2.mp4',
    mainVideos: [
        { url: 'https://storage.googleapis.com/jeanine-portfolio-video/B6%20Interior.mp4', aspectRatio: '16:9' },
        { 
          url: 'https://storage.googleapis.com/jeanine-portfolio-video/LearningHub.mp4', 
          aspectRatio: '16:9',
          autoplay: true,
          loop: true,
          showControls: true,
          hasAudio: true,
          caption: 'AI Lab Archive\n\nBuilt an online hub for the curriculum. Each module included a NotebookLM podcast walkthrough, FAQs, study guide, and original presentation. Some included recorded sessions with industry partners. Team could learn or revisit sessions.'
        }
    ],
    descriptor: "Creative workflow lab",
    description: "Founded and launched Wondery's first AI Creator Lab, scaling from 4 to 50+ people across content, marketing, product, and ad sales. Ran hands-on workshops, built learning modules, and brought in industry partners. Two projects moved from lab to production: Storycraft and two custom GPTs - one for research and media pulls, one for metadata tailoring.",
    tools: 'Tools: ElevenLabs, ChatGPT, Midjourney, NotebookLM. Plus Runway, Riverside, Descript, Luma, PartyRock, Nova, Google Labs.'
  },
  {
    id: 'storycraft',
    title: 'StoryCraft',
    client: 'Wondery',
    category: 'Experiments',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Cover%20StoryCraft5.mp4',
    previewAutoplay: true,
    mainVideos: [
        { url: 'https://storage.googleapis.com/jeanine-portfolio-video/B7%20interior.mp4', aspectRatio: '16:9', autoplay: true }
    ],
    descriptor: 'Adaptation app',
    description: 'Built a writer’s tool for adapting Wondery narrative series into kids and family adventures. Developed with titles like Against the Odds in mind. It supports writer-led changes to tone, structure, and language, plus content flags and age guidance.\n\nGreenlit to pilot with Kids and Family.',
    tools: 'Tools: Party Rock, Claude, Stable Diffusion.'
  },
  {
    id: 'split-continuity',
    title: 'Split Continuity',
    client: 'Self-initiated',
    category: 'Experiments',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/B8-cover.mp4',
    previewAutoplay: true,
    mainVideos: [
      { url: 'https://storage.googleapis.com/jeanine-portfolio-video/B8-2interior.mp4', aspectRatio: '16:9', autoplay: true }
    ],
    descriptor: 'VEO3.1 experiment',
    description: "A simulated two-minute continuous shot across split-screen panels. VEO's tools couldn't sustain it, so I found a workaround - stitching 18 separate clips together seamlessly. Creating something in AI-generated post that would be impossible with traditional editing.",
    tools: 'Tools: VEO 3.1, Nano Banana, ChatGPT, ElevenLabs.'
  }
];
