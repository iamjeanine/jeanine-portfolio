
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
    client: 'Speculative',
    category: 'Selected',
    filterCategories: ['story-system'],
    categoryLabel: 'Story System',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Narrative%20Space4_New%20Cover.mp4',
    previewAutoplay: true,
    previewHasAudio: true,
    mainVideos: [
      {
        url: 'https://storage.googleapis.com/jeanine-portfolio-video/Narrative%20Space_Screen%20Studio%20.mp4',
        aspectRatio: '16:9',
        autoplay: true,
        loop: true,
        showControls: true,
        hasAudio: true,
        startMuted: true
      }
    ],
    descriptor: 'Interactive Story Bible',
    description: "Story worlds usually begin as documents. Notes about characters, places, timelines, and relationships.\n\nNarrative Space turns that material into something you can explore.\n\nYou can upload an existing story bible and watch the world assemble itself. Or start from scratch. The tool asks questions that help shape the structure of the story as you go.\n\nCharacters, locations, and themes appear as nodes in a shared space. You can move through the world in three dimensions, or switch to more familiar views that organize everything into categories and cards.\n\nSeeing the material from different angles helps new connections emerge. Relationships between characters, places, and events start to reveal themselves as part of a living world rather than a stack of notes.\n\nYou can also talk with the world as you build it. Ask questions about characters, conflicts, or story logic. It can clarify relationships, suggest additions, or point out conflicts in the story.\n\nThe process stays human-led. Writers decide what belongs in the world. If you want to add a beat, you can simply say where it should go and it places it on the story grid.\n\nA space for thinking through a story.",
    tools: 'Tools: React, Three.js, Claude API, vector embeddings. Built with Claude Code.',
    liveUrl: 'https://narrative-space.vercel.app/',
  },
  {
    id: 'unstill',
    title: 'Unstill',
    subtitle: 'Regenerative lives',
    client: 'A24 Labs',
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
    tools: 'Tools: React, Claude API, ElevenLabs, VEO 3.1, Nano Banana, Vite. Built with Claude Code.',
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
    description: "Most stories live in a single format. A podcast stays a podcast. A film stays a film.\n\nMultiverse Quad explores what happens when a story launches across several formats at once.\n\nUsing the sci-fi series The Last City as the starting point, the project adapts a single narrative into four different formats.\n\n<div style='display:grid; grid-template-columns:1fr 1fr; gap:0.75rem 2rem; margin:1.5rem 0; padding:1.25rem 0; border-top:1px solid #e5e5e5; border-bottom:1px solid #e5e5e5;'><span style='padding-left:1rem; border-left:2px solid #a3a3a3; font-size:0.9em; letter-spacing:0.02em;'>Animated short film</span><span style='padding-left:1rem; border-left:2px solid #a3a3a3; font-size:0.9em; letter-spacing:0.02em;'>Graphic novel</span><span style='padding-left:1rem; border-left:2px solid #a3a3a3; font-size:0.9em; letter-spacing:0.02em;'>Visual audiobook</span><span style='padding-left:1rem; border-left:2px solid #a3a3a3; font-size:0.9em; letter-spacing:0.02em;'>Podcast</span></div>\n\nI pitched the concept to Amazon\u2019s AGI team and worked with engineers, scientists, product leadership, and Go To Market teams to build a working demo. The quad showed how one story could unfold across four formats at the same time.\n\nThe project was shortlisted for Andy Jassy\u2019s AWS re:Invent keynote.",
  },
  {
    id: 'ai-creator-lab',
    title: 'AI Creator Lab',
    subtitle: 'Wondery creator lab',
    client: 'Google Labs',
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
    id: 'tender',
    title: 'Tender',
    subtitle: 'Conversation with culture',
    client: 'Self-initiated',
    category: 'Experiments',
    filterCategories: ['cultural-experiment'],
    categoryLabel: 'Cultural Experiment',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Tender%202_New%20Cover.mp4',
    previewAutoplay: true,
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
    descriptor: 'Culture, curated for how you feel.',
    description: "Recommendation feeds slowly train us downward. We linger on something for a second too long, and the algorithm decides we want more of that.\n\nTender tries a different path.\n\nIt begins with a library of films, essays, poems, myths, and podcasts chosen by people who care deeply about culture. You talk to Tender about where you are or what you need, and it thoughtfully assembles something to meet you there.\n\nPart human curation, part conversational system. A way of finding culture that feels closer to asking a thoughtful friend than scrolling a feed.",
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
    description: "When you have a large catalog of narrative shows, the question becomes how those stories might travel to new audiences.\n\nStoryCraft explores that idea.\n\nIt\u2019s a tool for adapting narrative podcasts into kids and family adventures. Writers can reshape tone, structure, and language while preserving the core story. The tool also helps flag sensitive content and guide age appropriateness as the adaptation evolves.\n\nThe prototype was developed at Wondery with shows like Against the Odds in mind. The idea was to see whether a back catalog could be reinvented for younger listeners without losing what made the original story work.\n\nGreenlit to pilot with the Kids and Family team.",
    tools: 'Tools: Party Rock, Claude, Stable Diffusion, NotebookLM, Google Vids.'
  },
  {
    id: 'in-world-social-campaign',
    title: 'In-World Social Campaign',
    coverTitle: 'Social Campaign',
    subtitle: 'In-world marketing',
    client: 'Wondery',
    category: 'Experiments',
    filterCategories: ['story-system', 'production-tool'],
    categoryLabel: 'Story System',
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
    description: "Most show marketing happens outside the story.\n\nFor The Last City, we tried something different. The city itself started speaking.\n\nSocial posts came from inside the fictional world: destination spots, mission briefings, character testimonials, even a trailer made as if the city had produced it.\n\nBecause the format isn't widely used in podcasting, I built more than a dozen prototypes to show how in-world marketing could work for The Last City. AI tools made it possible to create and test these quickly.\n\nTwo prototypes moved into production.",
    tools: 'Tools: ElevenLabs, Midjourney, Runway, Luma, Magnific, After Effects, Premiere Pro, CapCut.'
  },
  {
    id: 'podcast-mixtape',
    title: 'Podcast Mixtape',
    subtitle: 'Listening, remixed',
    client: 'Experiments',
    category: 'Experiments',
    filterCategories: ['cultural-experiment'],
    categoryLabel: 'Cultural Experiment',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Minisdisc%20recorder2.mp4',
    previewAutoplay: true,
    mainVideos: [
        {
            url: 'https://storage.googleapis.com/jeanine-portfolio-video/Podcastnotitle.mp4',
            aspectRatio: '16:9',
            autoplay: true,
            loop: true,
            showControls: true,
            hasAudio: true,
            startMuted: true
        }
    ],
    descriptor: 'Audio discovery prototype',
    description: "Podcast discovery usually means scrolling endless grids.\n\nPodcast Mixtape turns listening into something you can organize and play.\n\nAdd shows you care about and they appear as discs in your library. You can start with the latest episode or go back to the beginning and follow a series over time.\n\nYou can also generate a mixtape. Describe what you\u2019re looking for and the app assembles five podcasts onto a single disc. Something to help you rethink your career. Something to get your finances in order. Something to keep you company on a long trip.\n\nDrag a disc into the player and press play.\n\nA more tactile way to listen.",
    tools: 'Tools: Google AI Studio - Build (Gemini)'
  }
];
