
import type { Project } from './types';

export const HERO_VIDEOS = {
  url: 'https://storage.googleapis.com/jeanine-portfolio-video/Heroshotmusic2.mp4',
  posterUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Hero-poster.jpg',
};

export const PROJECTS: Project[] = [
  {
    id: 'the-last-city',
    title: 'Multiverse Quad',
    client: 'Amazon AGI',
    category: 'Selected',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/CoverLCaudio2.mp4',
    previewAutoplay: true,
    previewHasAudio: true,
    mainVideos: [],
    mainImages: [
      { url: 'https://storage.googleapis.com/jeanine-portfolio-video/B4%20Interior.jpg', aspectRatio: '16:9' }
    ],
    descriptor: 'Multiformat storytelling',
    description: "Shortlisted for Andy Jassy's AWS re:Invent keynote.\n\nDeveloped and pitched the concept to Amazon's AGI team: adapting one story from The Last City into four formats. Co-developed prototypes with AGI engineers and product lead, delivering final versions for the keynote. Worked with Go-To-Market on presentation strategy.",
    formats: [
        'Animated short film',
        'Graphic novel',
        'Visual audiobook',
        'Podcast'
    ],
  },
  {
    id: 'film-rd',
    title: 'Film Style Lab',
    coverTitle: 'Film Style Lab',
    client: 'Self-initiated',
    category: 'Experiments',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Cover%20Film%20Lab.mp4',
    previewAutoplay: true,
    previewHasAudio: false,
    mainVideos: [
       { 
        url: 'https://storage.googleapis.com/jeanine-portfolio-video/Film%20Lab.mp4',
        aspectRatio: '16:9', 
        autoplay: true,
        loop: true,
        showControls: true
      }
    ],
    descriptor: 'Cinematic AI Research & Development',
    description: "I wanted to know which cinematography tags actually work in Midjourney. So I used OpenAI's o3 to research its internal logic around film stocks, lenses, cameras, and lighting. Found about 50 prompt tags that mattered. Tested them - and these 12 showed the most dramatic shifts in look and feel.",
    tools: 'Tools: o3, Midjourney, Runway, Magnific',
  },
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
      { url: 'https://storage.googleapis.com/jeanine-portfolio-video/B9%20Prototype.mp4', aspectRatio: '16:9', autoplay: true, showControls: true, hasAudio: true },
      { 
        url: 'https://storage.googleapis.com/jeanine-portfolio-video/B9%20Whiteboard.mp4', 
        aspectRatio: '16:9', 
        autoplay: true, 
        loop: true, 
        showControls: false,
        title: 'Whiteboard',
        subtitle: 'Process board used to develop concepts and test formats.'
      },
      {
        url: 'https://storage.googleapis.com/jeanine-portfolio-video/AI%20Story%20Bible%20Explorer.mp4',
        aspectRatio: '16:9',
        autoplay: true,
        loop: true,
        showControls: true,
        hasAudio: true,
        title: 'Story Bible Explorer',
        subtitle: 'Built an internal tool for cross-department teams. One source to answer questions about the show for marketing, ad sales, and film/TV.'
      }
    ],
    descriptor: 'In-World Social Campaign',
    description: "In-world social prototypes for a Wondery sci-fi series. Marketing from the perspective of the fictional city: destination spots, mission videos, tours, and character testimonials.\n\nPitched the concept to marketing and content, then built 12+ prototypes to demonstrate the approach. Some pieces leaned into viral TikTok trends - the video above adapts one from the time. All voices by ElevenLabs. Two prototypes moved into production.",
    tools: 'Tools: ElevenLabs, Midjourney, Runway, Luma, Magnific, After Effects, Premiere Pro, CapCut.',
  },
  {
    id: 'tender',
    title: 'Tender',
    client: 'Self-initiated',
    category: 'Experiments',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/TenderCover3.mp4',
    previewAutoplay: true,
    mainVideos: [
      {
        url: 'https://storage.googleapis.com/jeanine-portfolio-video/Tender%20App.mp4',
        aspectRatio: '16:9',
        autoplay: true,
        loop: true,
        showControls: true,
        hasAudio: true
      }
    ],
    descriptor: 'Culture, curated for how you feel.',
    description: "You know when you're looking for something to watch or read and nothing feels right? You scroll, you browse, you give up. I wanted to build something you could talk to about how you're feeling - and it finds culture that meets you there. An essay, a film, a poem, a myth, a podcast.",
    tools: 'Tools: Claude Code, Claude API, React, Web Speech API, Vite',
  },
  {
    id: 'split-continuity',
    title: 'Split Continuity',
    client: 'Self-initiated',
    category: 'Experiments',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/B8-cover.mp4',
    previewAutoplay: true,
    mainVideos: [
      { url: 'https://storage.googleapis.com/jeanine-portfolio-video/B8-2interior.mp4', aspectRatio: '16:9', autoplay: true, loop: true, showControls: true, hasAudio: true }
    ],
    descriptor: 'VEO3.1 showcase',
    description: "I've always loved the continuous take - Touch of Evil, The Player, The Studio. I wanted to see if I could simulate that in AI video. VEO's scene extender couldn't sustain the length, so I developed a repeatable technique: stitching 18 clips by using each ending frame as the next prompt. Then pushed it to a two-panel split screen. Creates the effect of dual continuous shots.\n\n<a href=\"https://www.youtube.com/watch?v=-VUlz4VmdRU\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"underline hover:text-[#2C4A3C] transition-colors\">[Annotated version on YouTube]</a>",
    tools: 'Tools: VEO 3.1, Nano Banana, ChatGPT, ElevenLabs.'
  },
  {
    id: 'strange-hour',
    title: 'Unstill',
    client: 'A24 Labs',
    category: 'Selected',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/CoverSH2.mp4',
    previewAutoplay: true,
    previewHasAudio: true,
    mainVideos: [],
    interactivePitch: {
      url: 'https://wonderylab.my.canva.site/unstill-museumpitch-pdf',
      previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Interior%20Vid%20Unstill2.mp4',
    },
    descriptor: 'Archives in Motion - interactive web pitch + pilot excerpt',
    description: "\"The archive is a record of power, not of truth.\" — Saidiya Hartman\n\nThese mugshots tell us who was arrested, not who they were. I tried to fill in what the record left out with primary documents.\n\nSydney police archives from the 1920s. Mugshots, crime records, hand-drawn blueprints. I reconstructed the streets, interiors, and daily life around them. Built a short narrative experience as proof-of-concept for pitching to museums. ElevenLabs for music, sound effects, and narration scratch track.\n\nThe deck walks through the approach: what it means to work with archival material responsibly, how interpretation gets labeled, and why institutions might need new ways to surface collections no one sees.",
    tools: 'Tools: ElevenLabs, Midjourney, Nano Banana, Runway, Veo 3.1, CapCut'
  },
  {
    id: 'ai-creator-lab',
    title: 'AI Creator Lab',
    client: 'Google Labs',
    category: 'Selected',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/B6-Cover2.mp4',
    previewPosterUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/B6-Cover2-poster.jpg',
    previewAutoplay: true,
    mainVideos: [
        { 
          url: 'https://storage.googleapis.com/jeanine-portfolio-video/B6%20Interior.mp4',
          posterUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/B6-Interior-poster.jpg',
          aspectRatio: '16:9',
          autoplay: true,
          loop: true
        },
        { 
          url: 'https://storage.googleapis.com/jeanine-portfolio-video/LearningHub.mp4', 
          posterUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/LearningHub-poster.jpg',
          aspectRatio: '16:9',
          autoplay: true,
          loop: true,
          showControls: true,
          hasAudio: true,
          caption: 'AI Lab Archive\n\nBuilt an online hub for the curriculum. Each module included a NotebookLM podcast walkthrough, FAQs, study guide, and original presentation. Some included recorded sessions with industry partners. Team members could learn or revisit sessions.'
        }
    ],
    descriptor: "Creative workflow lab",
    description: "Founded and launched Wondery's first AI Creator Lab, scaling from 4 to 50+ people across content, marketing, product, and ad sales. Ran hands-on workshops, built learning modules, and brought in industry partners. Two projects moved from lab to production: Storycraft and two custom GPTs - one for research and media pulls, one for writing metadata across platforms.",
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
        { url: 'https://storage.googleapis.com/jeanine-portfolio-video/StoryCraft2.mp4', aspectRatio: '16:9', autoplay: true, showControls: true, hasAudio: true }
    ],
    descriptor: 'Adaptation app',
    description: "Built a writer's tool for adapting Wondery narrative series into kids and family adventures. Developed with titles like Against the Odds in mind. Supports writer-led changes to tone, structure, and language, plus content flags and age guidance. Greenlit to pilot with Kids and Family.",
    tools: 'Tools: Party Rock, Claude, Stable Diffusion, NotebookLM, Google Vids.'
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
      { url: 'https://storage.googleapis.com/jeanine-portfolio-video/B2%20Moodpiece.mp4', aspectRatio: '16:9', autoplay: true, loop: true, showControls: true, hasAudio: true }
    ],
    descriptor: 'Sci-fi audio series pitch',
    description: "Created an original series pitch exploring uncanny phenomena in a quarantined zone, told through survivors' fractured memories. Inspired by Missing 411 disappearances in National Parks.\n\nThis is one of several mood pieces developed for the QCODE pitch. Visuals and sound added to inspire thinking beyond the audio format. Music, sound effects, and voices created with ElevenLabs.",
    tools: 'Tools: ElevenLabs, Runway, Midjourney, Magnific, CapCut',
  },
  {
    id: 'podcast-mixtape',
    title: 'Podcast Mixtape',
    client: 'Self-initiated',
    category: 'Selected',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Minisdisc%20recorder2.mp4',
    previewAutoplay: true,
    mainVideos: [
      { url: 'https://storage.googleapis.com/jeanine-portfolio-video/Podcastnotitle.mp4', aspectRatio: '16:9', autoplay: true, showControls: true, hasAudio: true }
    ],
    descriptor: 'Audio discovery prototype',
    description: "I wanted podcast discovery to feel more like asking a friend than scrolling a grid. Describe a vibe or what you're in the mood for, build a library over time. So I built it myself. The cassette interface brings back something tactile. A reminder that curation used to feel personal.",
    tools: 'Tools: Google AI Studio (Gemini)',
  },
];
