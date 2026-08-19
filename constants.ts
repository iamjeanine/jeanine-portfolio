
import type { Project } from './types';

export const HERO_VIDEOS = {
  url: 'https://storage.googleapis.com/jeanine-portfolio-video/Heroshotmusic2.mp4',
  posterUrl: '/hero-poster.jpg',
};

// The category check no longer excludes anything by itself: every current
// project is 'Selected' or 'Experiments'. !archived is what actually keeps
// Tender and the In-World Social Campaign, cut from the live Labs chapter,
// out of the detail page's own Previous/Next carousel.
export const getVisibleProjects = () => PROJECTS.filter(p => (p.category === 'Selected' || p.category === 'Experiments') && !p.archived);

export const PROJECTS: Project[] = [
  {
    id: 'visual-audiobooks',
    title: 'Visual Audiobooks',
    coverTitle: 'Visual Audio Book',
    // Detail-page headline, her approved copy (2026-08-15): "The strange
    // visual life of a children's story." Distinct on purpose from the
    // Labs chapter's tagline below (descriptor) — the chapter states what
    // it is, this page opens on why it's creatively interesting.
    subtitle: "The strange visual life of a children’s story",
    client: 'Ghost Mode Labs',
    category: 'Experiments',
    filterCategories: ['story-system'],
    categoryLabel: 'Story System',
    // Kept in sync with the Labs chapter entry (2026-08-14): the Living
    // Photocopy cover film replaced the old cover reel in both places.
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/living-photocopy-cover-web-1080p.mp4',
    previewPosterUrl: '/visual-audiobooks-poster.jpg',
    previewAutoplay: true,
    // The interior piece ("The picture will not stay put"), not the cover
    // film: her call, 2026-08-15 — the chapter already opens on the cover,
    // and the detail page should not repeat what the chapter or the
    // prototype shows. Loops with its music on (Static's precedent:
    // autoplay starts muted for the browser, then unmutes when allowed;
    // VideoPlayer's mute button is the visitor's control either way).
    // Near-4:3 source (1898x1440), so the box is 4:3 rather than 16:9.
    mainVideos: [
      {
        url: 'https://storage.googleapis.com/jeanine-portfolio-video/Audiobook%20interior%20cover.mp4',
        posterUrl: '/visual-audiobooks-interior-poster.jpg',
        aspectRatio: '4:3',
        autoplay: true,
        loop: true,
        showControls: true,
        hasAudio: true,
        startMuted: false,
        // The film blooms out at its tail but opens cold; until the
        // CapCut master is re-exported with its opening bloom, the
        // player veils the loop seam (Jeanine, 2026-08-17).
        softLoop: true,
      }
    ],
    descriptor: "Original children’s stories that can change each time you return",
    // Her approved copy (2026-08-15, third pass), supplied by dictation.
    // One reconstruction flagged to her at the time: the dictated text
    // opened mid-phrase ("children's story, things are never...") and
    // "In a" was restored to complete it. Checked against her rules:
    // no colons, semicolons, or em dashes.
    description: "In a children’s story, things are never just what they are. A blanket becomes a landscape. A monster turns out to be a feeling.\n\nA child hears the same story a hundred times and pictures it a hundred ways.\n\nSo what would code make of a story like that? What would it hold onto, and what would it find in there that we never saw?\n\nThat’s what fascinates me. What comes back is weird and whimsical, and sometimes unexpectedly beautiful.\n\nThe first listen never looks like the hundredth.",
    // Public prototype went live 2026-08-15 on Vercel (deploys from the
    // visiting-day repo's main branch, opens on Pieced Together). The path
    // matters: the bare domain root serves an abandoned July-era player.html
    // via a redirect that predates this whole system, unrelated to the
    // current visual-audiobook-player/ — caught while verifying this link,
    // not a hypothetical. Label updated to her current wording, "Explore
    // the prototype" (was "Experience the prototype" in the original
    // handoff).
    liveUrl: 'https://visiting-day.vercel.app/visual-audiobook-player/',
    liveUrlLabel: 'Explore the prototype',
    // Flow ruling in progress (2026-08-16): the card sits above the
    // description so skimmers meet the door in the first screenful; the
    // bottom keeps a quiet text link as the reader's exit. Approved shape
    // rolls out to static, narrative-space, and unstill afterward.
    liveUrlFirst: true,
  },
  {
    id: 'static',
    title: 'Static',
    subtitle: "Scripted supernatural series built from online folklore",
    client: 'Ghost Mode Labs',
    category: 'Experiments',
    filterCategories: ['production-tool'],
    categoryLabel: 'Production Tool',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Static.mp4',
    previewAutoplay: true,
    previewHasAudio: true,
    mainVideos: [
      {
        url: 'https://storage.googleapis.com/jeanine-portfolio-video/last-active-v2-web-1080p.mp4',
        posterUrl: '/static-poster.jpg',
        aspectRatio: '16:9',
        autoplay: true,
        loop: true,
        showControls: true,
        hasAudio: true,
        startMuted: false
      }
    ],
    descriptor: "Scripted supernatural series built from online folklore",
    description: "Every year, thousands of people vanish in the American wilderness. Their families post online because no one else is listening.\n\nOver the last decade, thirteen Reddit communities have built a body of folklore around these disappearances. Ten million subscribers. Nobody had connected what they were writing.\n\nI built a research tool called Last Active. You point it at a public archive and it finds story patterns, under-reported stories, and hidden gems. Pointed at those thirteen communities, it found 582 recurring overlaps across 6,884 accounts. Creatures, phenomena, rules. Static is the first story to come out of it.\n\n7,000 voices. One American haunting.",
    liveUrl: 'https://static-show.vercel.app/',
    liveUrlLabel: 'See the original pitch',
    liveUrlEyebrow: 'Built as a proposal for iHeart',
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
    subtitle: "Creative innovation",
    client: 'Ghost Mode Labs',
    category: 'Selected',
    filterCategories: ['production-tool'],
    categoryLabel: 'Production Tool',
    // The record-player reel ("AI Creator Lab 2 - New Cover") is retired
    // here too: Jeanine moved this entry to the moody close-up everywhere
    // it previews (same call as the Labs chapter, "too much of a Canva
    // template"). Same asset and poster the chapter already streams.
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Heroshotmusic2.mp4',
    previewPosterUrl: '/hero-poster.jpg',
    previewAutoplay: true,
    previewHasAudio: true,
    mainVideos: [
        {
          url: 'https://storage.googleapis.com/jeanine-portfolio-video/AI%20Creator%20Lab2.mp4',
          posterUrl: '/ai-creator-lab-interior-poster.jpg',
          aspectRatio: '16:9',
          autoplay: true,
          loop: true,
          showControls: true,
          hasAudio: true
        },
        {
          url: 'https://storage.googleapis.com/jeanine-portfolio-video/LearningHub.mp4',
          posterUrl: '/creator-lab-archive-poster.jpg',
          aspectRatio: '16:9',
          autoplay: true,
          loop: true,
          showControls: true,
          hasAudio: true,
          // The recording opens on a stale 2025 landing screen that reads
          // wrong now (Jeanine, 2026-08-19); skips past it into the hub.
          // 15 and 16 both landed mid-transition (a scroll/loading frame,
          // not the stale screen itself). Checked the actual frames:
          // ~17-19s is a settled gallery view, ~19.5-20.5s is the scroll
          // transition into the Custom GPTs page (still white, but the
          // heading hasn't landed — that was the sliver), and it's fully
          // settled by 21.
          startTime: 21,
          // The tail (duration 52.35s) is a scroll blur into solid black
          // with the loading circles still visible -- confirmed by
          // scrubbing to 52.3s directly. That's what flashed on every
          // loop restart. softLoop dips to black just before it and eases
          // back in after the restart, same mechanism as Unstill's veil.
          softLoop: true,
          caption: 'AI Lab Archive\n\nTo support the lab, I built an online hub where the curriculum could live.\n\nEach module included a NotebookLM podcast walkthrough, study guide, FAQs, and the original presentation. Some modules also included recorded sessions with industry partners demonstrating the tools in practice.\n\nThe archive allowed teams across the company to learn at their own pace or revisit sessions as the tools evolved.'
        }
    ],
    descriptor: "Creative innovation",
    description: "I founded Wondery\u2019s first AI Creator Lab to explore how new tools could fit into production workflows.\n\nThe lab grew from four people to more than fifty across content, marketing, product, and ad sales. I ran hands-on workshops, built learning modules, and brought in outside partners who were building these tools to demonstrate how they worked and how our teams could use them.\n\nThree projects came out of the lab.\n\nStoryCraft, a tool for adapting narrative series for kids and family audiences.\n\nA research assistant that helped teams gather background material and media pulls for new stories.\n\nAnd a metadata tool that generated titles, descriptions, and tags for publishing across platforms.",
    tools: 'Tools: ElevenLabs, ChatGPT, Midjourney, NotebookLM. Plus Runway, Riverside, Descript, Luma, PartyRock, Nova.'
  },
  {
    id: 'mythos',
    title: 'MythOS',
    subtitle: 'Franchise intelligence',
    client: 'Ghost Mode Labs',
    category: 'Experiments',
    filterCategories: ['story-system'],
    categoryLabel: 'Story System',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/MythOS%20Cover3.mp4',
    previewAutoplay: true,
    previewHasAudio: true,
    mainVideos: [
      {
        url: 'https://storage.googleapis.com/jeanine-portfolio-video/MythOS%20Demo4.mp4',
        posterUrl: '/mythos-demo-poster.jpg',
        aspectRatio: '16:9',
        autoplay: true,
        loop: true,
        showControls: true,
        hasAudio: true,
        startMuted: false
      }
    ],
    descriptor: 'Franchise intelligence',
    description: "Studios keep looping the same franchises. Meanwhile, there are thousands of stories in public domain archives, never mapped, never developed.\n\nI built an interactive globe that tracks how myths travel across cultures and centuries.\n\nClick Circe and the globe lights up with every culture that told her story, 46 of them, across 3,500 years. Scroll down and you descend through her full timeline, from Nolan’s The Odyssey this summer to before the written word. You can ask it questions, make connections, find what’s developable.\n\nThere are 494 source stories in the prototype. The tool works with any mythology, folklore tradition, or public domain IP.\n\nBuilt for studio development and franchise teams.",
    tools: 'Tools: React, Three.js, React Three Fiber, Claude API, GSAP, Vite. Built with Claude Code.',
  },
  {
    id: 'narrative-space',
    title: 'Narrative Space',
    subtitle: "Interactive worldbuilding",
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
        posterUrl: '/narrative-space-poster.jpg',
        aspectRatio: '16:9',
        autoplay: true,
        loop: true,
        showControls: true,
        hasAudio: true,
        startMuted: false
      }
    ],
    descriptor: "Interactive worldbuilding",
    description: "Story worlds usually begin as documents. Notes about characters, places, timelines, and relationships.\n\nNarrative Space turns that material into something you can explore.\n\nYou can upload an existing story bible and watch the world assemble itself. Or start from scratch. The tool asks questions that help shape the structure of the story as you go.\n\nCharacters, locations, and themes appear as nodes in a shared space. You can move through the world in three dimensions, or switch to more familiar views that organize everything into categories and cards.\n\nSeeing the material from different angles helps new connections emerge. Relationships between characters, places, and events start to reveal themselves as part of a living world rather than a stack of notes.\n\nYou can also talk with the world as you build it. Ask questions about characters, conflicts, or story logic. It can clarify relationships, suggest additions, or point out conflicts in the story.\n\nThe process stays human-led. Writers decide what belongs in the world. If you want to add a beat, you can simply say where it should go and it places it on the story grid.\n\nA space for thinking through a story.",
    tools: 'Tools: React, Three.js, Claude API, vector embeddings. Built with AI Studio Build and Claude Code.',
    liveUrl: 'https://narrative-space.vercel.app/',
    liveUrlFirst: true,
    liveUrlLabel: 'Try the prototype',
    liveUrlEyebrow: 'Interactive prototype',
  },
  {
    id: 'unstill',
    title: 'Unstill',
    subtitle: 'Regenerative lives',
    client: 'Ghost Mode Labs',
    category: 'Selected',
    filterCategories: ['cultural-experiment'],
    categoryLabel: 'Cultural Experiment',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Face-compressed.mp4',
    previewAutoplay: true,
    mainVideos: [
      {
        url: 'https://storage.googleapis.com/jeanine-portfolio-video/Unstill%20w%20Screen%20Studio%284%29.mp4',
        posterUrl: '/unstill-poster.jpg',
        aspectRatio: '16:9',
        autoplay: true,
        loop: true,
        showControls: true,
        hasAudio: true
      }
    ],
    descriptor: 'Archives in motion. Interactive experience.',
    description: `\u201CThe archive is a record of power, not of truth.\u201D\n\u2014 Saidiya Hartman\n\nUnstill begins with that idea.\n\n1920s Sydney. A generation pushing against the old Victorian order. What survives in the archive is often the moment the system caught up: a name, a date, a charge.\n\nHover and color returns to the photograph. Click and the portrait begins to breathe. A loupe reveals the original glass plate beneath the moving image.\n\nEach portrait draws from court records, press clippings, and the historical archive to generate new inscriptions about the life behind the record. Every visit produces a different reading.\n\nSeven full stories appear first. Then a dozen more faces from the Museums of History NSW collection.\n\nBuilt as a proposal for Museums of History NSW.`,
    tools: 'Tools: React, Claude API, ElevenLabs, Gemini VEO 3.1, Nano Banana, Vite. Built with Claude Code.',
    liveUrl: 'https://unstill.vercel.app/',
    liveUrlLabel: 'Explore Unstill',
    liveUrlEyebrow: 'Proposal for Museums of History NSW',
  },
  {
    id: 'tender',
    archived: true,
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
    id: 'in-world-social-campaign',
    archived: true,
    title: 'In-World Social Campaign',
    coverTitle: 'Social Campaign',
    subtitle: 'In-world marketing',
    client: 'Wondery',
    category: 'Experiments',
    filterCategories: ['production-tool'],
    categoryLabel: 'Production Tool',
    descriptor: 'The Last City',
    previewVideoUrl: 'https://storage.googleapis.com/jeanine-portfolio-video/Cover%20StoryCraft5.mp4',
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
            posterUrl: '/campaign-whiteboard-poster.jpg',
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
            posterUrl: '/campaign-hub-poster.jpg',
            aspectRatio: '16:9',
            autoplay: true,
            loop: true,
            showControls: true,
            hasAudio: true,
            title: 'The Last City Hub',
            subtitle: 'Built an internal tool for cross-department teams. One source to answer questions about the show for marketing, ad sales, and film/TV.'
        }
    ],
    description: "Most show marketing happens outside the story.\n\nFor The Last City, we tried something different. The city itself started speaking.\n\nSocial posts came from inside the fictional world: destination posts, recruitment ads, brand spots \u2014 even a trailer made as if the city had its own creative agency.\n\nBecause the format isn't widely used in podcasting, I built more than a dozen prototypes to show how in-world marketing could work for The Last City. AI tools made it possible to create and test these quickly.\n\nTwo prototypes moved into production.",
    tools: 'Tools: ElevenLabs, Midjourney, Runway, Luma, Magnific, After Effects, Premiere Pro, CapCut.'
  },
];
