
import type { Project } from './types';

export const HERO_VIDEOS = {
  url: 'https://storage.googleapis.com/jeanine-portfolio-video/Heroshotmusic2.mp4',
  posterUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Hero-poster.jpg',
};

export const getVisibleProjects = () => PROJECTS.filter(p => p.category === 'Selected' || p.category === 'Experiments');

export const PROJECTS: Project[] = [
  {
    id: 'narrative-space',
    title: 'Narrative Space',
    subtitle: 'Interactive world building',
    client: 'Ghost Mode Labs',
    category: 'Selected',
    filterCategories: ['story-system'],
    categoryLabel: 'Story System',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Sphere%20Cover%202.mp4',
    previewAutoplay: true,
    previewHasAudio: true,
    mainVideos: [
      {
        url: 'https://storage.googleapis.com/jeanine-portfolio-video/Narrative%20Space%203.14.mp4',
        aspectRatio: '16:9',
        autoplay: true,
        loop: true,
        showControls: true,
        hasAudio: true,
        startMuted: false
      }
    ],
    descriptor: 'Interactive Story Bible',
    description: "Story worlds usually begin as documents. Notes about characters, places, timelines, and relationships.\n\nNarrative Space turns that material into something you can explore.\n\nYou can upload an existing story bible and watch the world assemble itself. Or start from scratch. The tool asks questions that help shape the structure of the story as you go.\n\nCharacters, locations, and themes appear as nodes in a shared space. You can move through the world in three dimensions, or switch to more familiar views that organize everything into categories and cards.\n\nSeeing the material from different angles helps new connections emerge. Relationships between characters, places, and events start to reveal themselves as part of a living world rather than a stack of notes.\n\nYou can also talk with the world as you build it. Ask questions about characters, conflicts, or story logic. It can clarify relationships, suggest additions, or point out conflicts in the story.\n\nThe process stays human-led. Writers decide what belongs in the world. If you want to add a beat, you can simply say where it should go and it places it on the story grid.\n\nA space for thinking through a story.",
    tools: 'Tools: React, Three.js, Claude API, vector embeddings. Built with AI Studio Build and Claude Code.',
    liveUrl: 'https://narrative-space.vercel.app/',
  },
  {
    id: 'unstill',
    title: 'Unstill',
    subtitle: 'Regenerative lives',
    client: 'Ghost Mode Labs',
    category: 'Selected',
    filterCategories: ['cultural-experiment'],
    categoryLabel: 'Cultural Experiment',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Unstill%20cover%20new.mp4',
    previewAutoplay: true,
    mainVideos: [
      {
        url: 'https://storage.googleapis.com/jeanine-portfolio-video/Unstill%20w%20Screen%20Studio%284%29.mp4',
        aspectRatio: '16:9',
        autoplay: true,
        loop: true,
        showControls: true,
        hasAudio: true
      }
    ],
    descriptor: 'Archives in motion. Interactive experience.',
    description: `\u201CThe archive is a record of power, not of truth.\u201D\n\u2014 Saidiya Hartman\n\nUnstill begins with that idea.\n\n1920s Sydney. A generation pushing against the old Victorian order. What survives in the archive is often the moment the system caught up: a name, a date, a charge.\n\nHover and color returns to the photograph. Click and the portrait begins to breathe. A loupe reveals the original glass plate beneath the moving image.\n\nEach portrait draws from court records, press clippings, and the historical archive to generate new inscriptions about the life behind the record. Every visit produces a different reading.\n\nSeven full stories appear first. Then a dozen more faces from the Museums of History NSW collection \u2014 fragments of the world they carried.\n\nBuilt as a proposal for Museums of History NSW.`,
    tools: 'Tools: React, Claude API, ElevenLabs, Gemini VEO 3.1, Nano Banana, Vite. Built with Claude Code.',
    liveUrl: 'https://unstill.vercel.app/',
  },
  {
    id: 'multiverse-quad',
    title: 'Multiverse Quad',
    subtitle: 'One story, four formats',
    client: 'Amazon AGI',
    category: 'Selected',
    filterCategories: ['story-system'],
    categoryLabel: 'Story System',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/CoverLCaudio2.mp4',
    previewAutoplay: true,
    previewHasAudio: true,
    mainVideos: [],
    mainImages: [
      { url: 'https://storage.googleapis.com/jeanine-portfolio-video/B4%20Interior.jpg', aspectRatio: '16:9' }
    ],
    descriptor: 'Multiformat storytelling',
    description: "Most stories live in a single format. A podcast stays a podcast. A film stays a film.\n\nMultiverse Quad explores what happens when a story launches across several formats at once.\n\nUsing the sci-fi series The Last City as the starting point, the project adapts a single narrative into four different formats.\n\nI pitched the concept to Amazon\u2019s AGI team and worked with engineers, scientists, product leadership, and Go To Market teams to build a working demo. The quad showed how one story could unfold across four formats at the same time.\n\nThe project was shortlisted for Andy Jassy\u2019s AWS re:Invent keynote.",
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
    subtitle: 'Wondery creator lab',
    client: 'Ghost Mode Labs',
    category: 'Selected',
    filterCategories: ['production-tool'],
    categoryLabel: 'Production Tool',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/AI%20Creator%20Lab%202%20-%20New%20Cover%20.mp4',
    previewPosterUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/B6-Cover2-poster.jpg',
    previewAutoplay: true,
    previewHasAudio: true,
    mainVideos: [
        { 
          url: 'https://storage.googleapis.com/jeanine-portfolio-video/AI%20Creator%20Lab2.mp4',
          posterUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/B6-Interior-poster.jpg',
          aspectRatio: '16:9',
          autoplay: true,
          loop: true,
          showControls: true,
          hasAudio: true
        },
        { 
          url: 'https://storage.googleapis.com/jeanine-portfolio-video/LearningHub.mp4', 
          posterUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/LearningHub-poster.jpg',
          aspectRatio: '16:9',
          autoplay: true,
          loop: true,
          showControls: true,
          hasAudio: true,
          caption: 'AI Lab Archive\n\nTo support the lab, I built an online hub where the curriculum could live.\n\nEach module included a NotebookLM podcast walkthrough, study guide, FAQs, and the original presentation. Some modules also included recorded sessions with industry partners demonstrating the tools in practice.\n\nThe archive allowed teams across the company to learn at their own pace or revisit sessions as the tools evolved.'
        }
    ],
    descriptor: "Creative workflow lab",
    description: "I founded Wondery\u2019s first AI Creator Lab to explore how new tools could fit into real production workflows.\n\nThe lab grew from four people to more than fifty across content, marketing, product, and ad sales. I ran hands-on workshops, built learning modules, and brought in outside partners who were building these tools to demonstrate how they worked and how our teams could use them.\n\nThree projects came out of the lab.\n\nStoryCraft, a tool for adapting narrative series for kids and family audiences.\n\nA research assistant that helped teams gather background material and media pulls for new stories.\n\nAnd a metadata tool that generated titles, descriptions, and tags for publishing across platforms.",
    tools: 'Tools: ElevenLabs, ChatGPT, Midjourney, NotebookLM. Plus Runway, Riverside, Descript, Luma, PartyRock, Nova.'
  },
  {
    id: 'mythos',
    title: 'MythOS',
    subtitle: 'Data + Storytelling',
    client: 'Ghost Mode Labs',
    category: 'Experiments',
    filterCategories: ['story-system'],
    categoryLabel: 'Story System',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/MythOS%20Cover3.mp4',
    previewAutoplay: true,
    previewHasAudio: true,
    mainVideos: [
      {
        url: 'https://storage.googleapis.com/jeanine-portfolio-video/MythOSDemo2.mp4',
        aspectRatio: '16:9',
        autoplay: true,
        loop: true,
        showControls: true,
        hasAudio: true,
        startMuted: false
      }
    ],
    descriptor: 'Franchise intelligence',
    description: "Studios circle the same franchises. Meanwhile, thousands of stories sit in public domain archives, never mapped, never developed.\n\nI built an interactive globe tracking how myths travel across cultures and centuries. Where they originated, where they traveled, where they were adapted, and where the gaps are. 494 source stories in the prototype. Click Circe and descend into her full timeline, from Christopher Nolan\u2019s The Odyssey to before the written word existed. Ask questions, surface connections, find what\u2019s developable.\n\nThe tool works with any mythology, any folklore tradition, any public domain IP.\n\nBuilt as a prototype for studio development and franchise teams.",
    tools: 'Tools: React, Three.js, React Three Fiber, Claude API, GSAP, Vite. Built with Claude Code.',
  },
  {
    id: 'tender',
    title: 'Tender',
    subtitle: 'Conversation with culture',
    client: 'Ghost Mode Labs',
    category: 'Experiments',
    filterCategories: ['cultural-experiment'],
    categoryLabel: 'Cultural Experiment',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Cover2%20Tender%20Updated.mp4',
    previewAutoplay: true,
    previewHasAudio: true,
    mainVideos: [
      {
        url: 'https://storage.googleapis.com/jeanine-portfolio-video/Tender%204_new%20cover.mp4',
        aspectRatio: '16:9',
        autoplay: true,
        loop: true,
        showControls: true,
        hasAudio: true
      }
    ],
    descriptor: 'Feel something, find something.',
    description: "Recommendation feeds slowly train us downward. Not dramatically\u2009\u2014\u2009just a little less curious, a little more numb, each time.\n\nTender starts somewhere else.\n\nIt begins with a library of films, essays, poems, myths, and podcasts chosen by people who care deeply about culture. You tell Tender how you\u2019re feeling or what you need, and it finds something to meet you there.\n\nPart human curation, part conversational system. A way of finding culture that feels closer to asking a thoughtful friend than scrolling a feed.",
    embedUrl: 'https://tender-app-gamma.vercel.app',
    liveUrl: 'https://tender-app-gamma.vercel.app/demo',
    liveUrlLabel: 'Try it on your phone',
    tools: 'Tools: React, Claude Code, Claude API, Web Speech API, Vite.',
  },
  {
    id: 'storycraft',
    title: 'StoryCraft',
    subtitle: 'Story adaptation tool',
    client: 'Wondery',
    category: 'Experiments',
    filterCategories: ['production-tool'],
    categoryLabel: 'Production Tool',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Cover%20StoryCraft5.mp4',
    previewAutoplay: true,
    mainVideos: [
        { url: 'https://storage.googleapis.com/jeanine-portfolio-video/StoryCraft2.mp4', aspectRatio: '16:9', autoplay: true, showControls: true, hasAudio: true, startMuted: true }
    ],
    descriptor: 'Adaptation app',
    description: "When you have a large catalog of narrative shows, the question becomes how those stories might travel to new audiences. StoryCraft explores that idea.\n\nIt\u2019s a tool for adapting adult narrative podcasts into kids and family adventures. Writers can reshape tone, structure, and language while preserving the core story.\n\nThe tool extracts every story beat and theme from the source material. It flags darker content a writer needs to navigate as the adaptation evolves.\n\nThe prototype was developed at Wondery using Against the Odds. A four-episode arc turned into a 30-minute kids\u2019 adventure, to see whether a back catalog could be reinvented for younger listeners without losing what made the original story work.\n\nGreenlit to pilot with the Kids and Family team.",
    tools: 'Tools: Party Rock, Claude, Stable Diffusion, NotebookLM, Google Vids.'
  },
  {
    id: 'in-world-social-campaign',
    title: 'In-World Social Campaign',
    coverTitle: 'Social Campaign',
    subtitle: 'In-world marketing',
    client: 'Wondery',
    category: 'Experiments',
    filterCategories: ['production-tool'],
    categoryLabel: 'Production Tool',
    descriptor: 'The Last City',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Social%20Campaing3_New%20Cover.mp4',
    previewAutoplay: true,
    previewHasAudio: true,
    mainVideos: [
        {
            url: 'https://storage.googleapis.com/jeanine-portfolio-video/B9%20Prototype.mp4',
            aspectRatio: '16:9',
            autoplay: true,
            loop: true,
            showControls: true,
            hasAudio: true,
            startMuted: true
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
    description: "Most show marketing happens outside the story.\n\nFor The Last City, we tried something different. The city itself started speaking.\n\nSocial posts came from inside the fictional world: destination posts, recruitment ads, brand spots — even a trailer made as if the city had its own creative agency.\n\nBecause the format isn't widely used in podcasting, I built more than a dozen prototypes to show how in-world marketing could work for The Last City. AI tools made it possible to create and test these quickly.\n\nTwo prototypes moved into production.",
    tools: 'Tools: ElevenLabs, Midjourney, Runway, Luma, Magnific, After Effects, Premiere Pro, CapCut.'
  },
];
