
import type { Project } from './types';

export const HERO_VIDEOS = {
  url: 'https://storage.googleapis.com/jeanine-portfolio-video/Heroshotmusic2.mp4',
  posterUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Hero-poster.jpg',
};

export const PROJECTS: Project[] = [
  {
    id: 'unstill',
    title: 'Unstill',
    client: 'A24 Labs',
    category: 'Selected',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Hero%20Shot.mp4',
    previewAutoplay: true,
    previewHasAudio: true,
    mainVideos: [
      { 
        url: 'https://storage.googleapis.com/jeanine-portfolio-video/Unstill%20Portfolio.mp4',
        glassPlateImageUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Unstill-Glass-Plate.jpg',
        aspectRatio: '16:9', 
        autoplay: true, 
        loop: true, 
        showControls: true, 
        hasAudio: true 
      }
    ],
    descriptor: 'Archives in motion. Interactive experience.',
    description: `"The archive is a record of power, not of truth." That line from Saidiya Hartman is the starting point. \n\n1920s Sydney. A generation testing every boundary of the old Victorian order. What survives for most of them is the moment the system caught up. A name, a date, a charge. Hover and color returns to the photograph. Click and the portrait starts breathing. Their stories are built from court records, press clippings, and the photographs themselves. Hold the loupe over the moving image and the original glass plate appears underneath. \n\nThe person is always there if you look for them. \n\nSeven full stories. Then a dozen more faces from the Museums of History NSW collection — each one a fragment of the world they carried.\n\nBuilt as a proposal for Museums of History NSW.`,
    tools: 'Tools: React, Claude API, ElevenLabs, VEO 3.1, Nano Banana, Vite. Built with Claude Code.'
  },
  {
    id: 'narrative-space',
    title: 'Narrative Space',
    client: 'Speculative',
    category: 'Selected',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Hero%20Shot%20with%20Header.mp4',
    previewAutoplay: true,
    previewHasAudio: true,
    mainVideos: [
      { 
        url: 'https://storage.googleapis.com/jeanine-portfolio-video/NarrativeSpace%202.16.mp4', 
        aspectRatio: '16:9', 
        autoplay: true, 
        loop: true, 
        showControls: true, 
        hasAudio: true 
      }
    ],
    descriptor: 'Interactive Story Bible',
    description: "What happens when a story bible becomes a space you can walk through?\n\nI built an environment for developing narrative worlds. Characters, locations, and themes become nodes you can orbit, rearrange, and question in conversation. See your story from multiple angles. Click anything to understand how it connects.\n\nThe Writer's Room is a collaborator that knows what you've built. It can add to the world, explain the connections, or push back when something conflicts.\n\nPrototype uses the Stranger Things pitch bible as source material.",
    tools: 'Tools: React, Three.js, Claude API, vector embeddings. Built with Claude Code.',
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
    id: 'in-world-social-campaign',
    title: 'The Last City',
    client: 'Wondery',
    category: 'Experiments',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Socials3.mp4',
    previewAutoplay: true,
    mainVideos: [
        {
            url: 'https://storage.googleapis.com/jeanine-portfolio-video/B9%20Prototype.mp4',
            aspectRatio: '16:9',
            autoplay: true,
            loop: true,
            showControls: true,
            hasAudio: true
        },
        {
            url: 'https://storage.googleapis.com/jeanine-portfolio-video/B9%20Whiteboard.mp4',
            aspectRatio: '16:9',
            autoplay: true,
            loop: true,
            showControls: true,
            hasAudio: true,
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
            title: 'The Last City Hub',
            subtitle: 'Built an internal tool for cross-department teams. One source to answer questions about the show for marketing, ad sales, and film/TV.'
        }
    ],
    descriptor: "In-World Social Campaign",
    description: "In-world social prototypes for a Wondery sci-fi series. Marketing from the perspective of the fictional city: destination spots, mission videos, tours, and character testimonials.\n\nPitched the concept to marketing and content, then built 12+ prototypes to demonstrate the approach. Some pieces leaned into viral TikTok trends - the video above adapts one from the time. All voices by ElevenLabs. Two prototypes moved into production.",
    tools: 'Tools: ElevenLabs, Midjourney, Runway, Luma, Magnific, After Effects, Premiere Pro, CapCut.'
  },
  {
    id: 'podcast-mixtape',
    title: 'Podcast Mixtape',
    client: 'Experiments',
    category: 'Experiments',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Minisdisc%20recorder2.mp4',
    previewAutoplay: true,
    mainVideos: [
        {
            url: 'https://storage.googleapis.com/jeanine-portfolio-video/Podcastnotitle.mp4',
            aspectRatio: '16:9',
            autoplay: true,
            loop: true,
            showControls: true,
            hasAudio: true
        }
    ],
    descriptor: 'Audio discovery prototype',
    description: "I wanted podcast discovery to feel more like asking a friend than scrolling a grid. Describe a vibe or what you're in the mood for, build a library over time. So I built it myself. The cassette interface brings back something tactile. A reminder that curation used to feel personal.",
    tools: 'Tools: Google AI Studio - Build (Gemini)'
  }
];
