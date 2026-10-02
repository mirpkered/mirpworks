export const projects = [
  {
    slug: "word-search-adventure",
    name: "Word Search Adventure",
    status: "Active Development",
    type: "Game",
    featured: true,
    overview: "A word-search game in active development, shaped around an approachable and readable play experience.",
    systems: ["Core play experience", "Interface and readability", "Progression structure"],
    principles: ["Readability before decoration", "Design for long play sessions", "Accessibility is a feature"],
    links: [
      { label: "Play Game", href: "https://wordsearchadventure.onrender.com/" },
      { label: "itch.io", href: "https://mirpkered.itch.io/word-search-adventure" }
    ],
    screenshots: [
      { src: "/assets/word-search-adventure-menu.jpg", alt: "Word Search Adventure main menu with Free Play, Adventure, Daily, Customize, Achievements, Statistics, and Settings.", width: 590, height: 1280 },
      { src: "/assets/word-search-adventure-gameplay.jpg", alt: "Word Search Adventure free-play puzzle with a letter grid, word list, timer, and found-word highlight.", width: 590, height: 1280 },
      { src: "/assets/word-search-adventure-adventure-map.jpg", alt: "Word Search Adventure Adventure mode level map, showing a path through a colorful park with numbered levels.", width: 590, height: 1280 }
    ]
  },
  {
    slug: "lets-go-shall-we",
    name: "Let’s Go, Shall We?",
    status: "Active Development",
    type: "Game",
    featured: false,
    overview: "A mobile-first, bite-sized, choice-driven text RPG inspired by classic DOS-era interactive fiction.",
    systems: ["Short, replayable runs and compact play sessions", "Touch-friendly 2×2 choice-button interaction", "Fair, foreshadowed risk without arbitrary instant-death traps", "Narrative continuity, environmental storytelling, and carrying one item forward after successful runs"],
    principles: ["Readability before decoration", "Accessibility is a feature", "Environmental storytelling should enhance interaction"],
    links: [
      { label: "Playtest on itch.io", href: "https://mirpkered.itch.io/lets-go-shall-we" },
      { label: "Play Direct Build", href: "https://mirpkered.github.io/lets-go-shall-we/" }
    ]
  },
  {
    slug: "why-is-there-a-hole-in-the-middle-of-town",
    name: "Why Is There a Hole in the Middle of Town?",
    status: "In Development — Playable Now",
    type: "Game",
    featured: false,
    overview: "There is a hole in the middle of town. Nobody knows why. Prepare in town, take a questionable job, descend into a dangerously absurd dungeon, and decide how much deeper to go before trying to get back.",
    artwork: {
      src: "/assets/why-is-there-a-hole-in-the-middle-of-town.png",
      alt: "Official game artwork showing a deep hole at the center of a colorful town, with a goose and an adventurer nearby.",
      width: 1254,
      height: 1254
    },
    developmentNote: "Playable development build. Mechanics, balance, art, audio, dungeon generation, and content continue to evolve.",
    links: [{ label: "Play Current Build", href: "https://mirpkered.github.io/why-is-there-a-hole-in-the-middle-of-the-town/" }],
    systems: [
      "Turn-based, single-player exploration through procedurally evolving dungeons",
      "Persistent automapping of discovered spaces",
      "Town bulletin-board quests, merchants, and strange NPC encounters",
      "Ridiculous equipment, buying, selling, and barter",
      "Hand-drawn absurd enemies, with colored and original-ink sprite modes",
      "Events, landmarks, hazards, and bizarre dungeon rooms",
      "Risk-based return trips and persistent local saves"
    ],
    principles: [
      "Readability before decoration",
      "Accessibility is a feature",
      "Theme the surfaces, never rearrange the gameplay",
      "Environmental storytelling should enhance interaction"
    ]
  },
  {
    slug: "winkbound",
    name: "Winkbound",
    status: "Concept / Active Development",
    type: "Game",
    featured: true,
    overview: "A game project moving between concept work and active development.",
    systems: ["Core gameplay exploration", "Interaction design", "World and tone"],
    principles: ["Theme the surfaces, never rearrange the gameplay", "Test before polishing", "Cohesion over ornamentation"]
  },
  {
    slug: "stillwater",
    name: "Stillwater Camp Mystery",
    status: "Concept Development",
    type: "Game",
    featured: false,
    overview: "A mystery game currently in concept development, with room for environmental storytelling to support discovery.",
    systems: ["Mystery structure", "Environmental storytelling", "Player guidance"],
    principles: ["Environmental storytelling should enhance interaction", "Readability before decoration", "Test before polishing"]
  },
  {
    slug: "slabberjaws",
    name: "Slabberjaws",
    status: "Active Development",
    type: "Application",
    featured: false,
    overview: "An application in active development with a focus on a clear, maintainable user experience.",
    systems: ["Application workflow", "Responsive interface", "Maintainable foundations"],
    principles: ["Mobile-first whenever practical", "Accessibility is a feature", "Readability before decoration"],
    links: [{ label: "Open App", href: "https://mirpkered.github.io/slabberjaws/" }]
  },
  {
    slug: "trivia-generator",
    name: "Trivia Generator",
    status: "Production / Active Development",
    type: "Application",
    featured: true,
    overview: "A production application under active development for creating and working with trivia content.",
    systems: ["Content workflow", "Production tooling", "Usable output"],
    principles: ["Test before polishing", "Readability before decoration", "Long-term maintainability"],
    links: [{ label: "Open App", href: "https://trivia-generator.onrender.com" }],
    screenshots: [
      { src: "/assets/trivia-generator-setup.jpg", alt: "Trivia Generator setup screen with the master question bank, category selection, and game configuration.", width: 590, height: 1280 },
      { src: "/assets/trivia-generator-text-game.jpg", alt: "Trivia Generator text-question game showing a question, answer, and game controls.", width: 590, height: 1280 },
      { src: "/assets/trivia-generator-image-game.jpg", alt: "Trivia Generator image-question game showing a flag-identification question and answer.", width: 590, height: 1280 }
    ]
  },
  {
    slug: "zombie-swarm",
    name: "Zombie Swarm",
    type: "Game",
    featured: false,
    overview: "A dark-comedy Unity game with a fixed elevated isometric / 2.5D view and retro pixel art. Gameplay involves a Commander Zombie, Basic Zombies, Civilians, and specialist characters.",
    engine: "Unity",
    presentation: "Fixed elevated isometric / 2.5D",
    visualDirection: "Retro pixel art",
    tone: "Dark comedy",
    gameplay: ["Commander Zombie", "Basic Zombies", "Civilians", "Specialist characters"],
    links: [{ label: "View on itch.io", href: "https://mirpkered.itch.io/zombie-swarm" }]
  }
];
