import { projects } from "./data/projects.js";

const nav = [
  ["/", "Mirpworks"],
  ["/projects/", "Projects"],
  ["/studio/", "Studio"],
  ["/about/", "About"],
  ["/contact/", "Contact"]
];

const escapeHtml = (value) => String(value).replace(/[&<>"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
}[character]));

function wordmark() {
  return `<img class="brand-icon" src="/assets/brand/mirpworks-mark.jpg" alt="" width="36" height="32"><span>Mirpworks</span>`;
}

function layout({ title, description, path, content, bodyClass = "" }) {
  const pageTitle = title === "Mirpworks" ? title : `${title} — Mirpworks`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="theme-color" content="#111513">
  <title>${escapeHtml(pageTitle)}</title>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/styles.css">
  <link rel="stylesheet" href="/assets/responsive-fix.css">
  <link rel="stylesheet" href="/assets/brand-integration.css">
  <link rel="stylesheet" href="/assets/contact.css">
  <script src="/assets/site.js" defer></script>
</head>
<body class="${bodyClass}">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="shell nav-wrap">
      <a class="wordmark" href="/" aria-label="Mirpworks home">${wordmark()}</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav"><span>Menu</span><i aria-hidden="true"></i></button>
      <nav id="primary-nav" class="primary-nav" aria-label="Primary navigation">
        ${nav.map(([href, label]) => `<a href="${href}"${path === href || (href !== "/" && path.startsWith(href)) ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
      </nav>
    </div>
  </header>
  <main id="main">${content}</main>
  <footer class="site-footer">
    <div class="shell footer-grid">
      <div><a class="wordmark" href="/">${wordmark()}</a><p>Let’s play a game.</p></div>
      <nav aria-label="Footer navigation">${nav.slice(1).map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}</nav>
      <p class="copyright">© 2026 Mirpworks</p>
    </div>
  </footer>
</body>
</html>`;
}

function projectCard(project, compact = false) {
  return `<article class="project-card${project.featured ? " featured" : ""}${compact ? " compact" : ""}">
    <div class="card-top"><span class="eyebrow">${project.type}</span>${project.status ? `<span class="status">${project.status}</span>` : ""}</div>
    <div><h3><a href="/projects/${project.slug}/">${project.name}</a></h3>${compact ? "" : `<p>${project.overview}</p>`}</div>
    <a class="text-link" href="/projects/${project.slug}/" aria-label="View ${project.name}">View project <span aria-hidden="true">↗</span></a>
  </article>`;
}

const principles = [
  ["01", "Protect the play", "Theme the surfaces, never rearrange the gameplay. Environmental storytelling should enhance, not obscure, interaction."],
  ["02", "Design for people", "Mobile-first whenever practical. Accessibility is a feature. Readability comes before decoration."],
  ["03", "Build a coherent world", "Cohesion matters more than ornamentation, and every environment should have its own material language."],
  ["04", "Respect the screen", "Bottom screen space is valuable on mobile. Cosmetic changes should never reduce readability."],
  ["05", "Make it hold up", "Test before polishing. Design for long play sessions and for maintainability beyond the first release."],
  ["06", "Share the foundation", "Reusable assets belong to the studio, not individual games."]
];

export const pages = [
  {
    path: "/",
    output: "index.html",
    html: layout({
      title: "Mirpworks",
      description: "Mirpworks is an independent game and application development studio.",
      path: "/",
      bodyClass: "home",
      content: `<section class="hero"><div class="hero-art" aria-hidden="true"></div><div class="shell hero-inner"><p class="eyebrow">Independent game & application studio</p><h1 class="hero-logo"><img src="/assets/brand/mirpworks-logo.jpg" alt="Mirpworks — Let’s play a game."></h1><p class="hero-copy">Polished, approachable games and applications—made with thoughtful design, strong usability, and room for discovery.</p><a class="button" href="/projects/">Explore our projects <span aria-hidden="true">↗</span></a></div><p class="art-credit">Original studio artwork</p></section>
      <section class="section shell"><div class="section-heading"><div><p class="eyebrow">Selected work</p><h2>Projects in motion</h2></div><a class="text-link" href="/projects/">All projects <span aria-hidden="true">→</span></a></div><div class="project-grid feature-grid">${projects.filter(project => project.featured).map(project => projectCard(project)).join("")}</div></section>
      <section class="section ruled shell"><div class="section-heading"><div><p class="eyebrow">More from the studio</p><h2>In the workshop</h2></div></div><div class="compact-grid">${projects.filter(project => !project.featured).map(project => projectCard(project, true)).join("")}</div></section>
      <section class="studio-intro"><div class="shell split"><p class="eyebrow">About Mirpworks</p><div><h2>Thoughtful by design.<br>Built to last.</h2><p>Mirpworks is an independent studio exploring games and useful applications. We care about clear interfaces, accessible experiences, environmental storytelling, and foundations that remain maintainable over time.</p><a class="text-link" href="/about/">Meet the studio <span aria-hidden="true">→</span></a></div></div></section>`
    })
  },
  {
    path: "/projects/",
    output: "projects/index.html",
    html: layout({
      title: "Projects",
      description: "Games and applications by Mirpworks.",
      path: "/projects/",
      content: `<header class="page-head shell"><p class="eyebrow">Our work</p><h1>Projects</h1><p>Games and applications at different stages of development, united by clear interaction and durable design.</p></header>
      ${["Game", "Application"].map((type, index) => `<section class="section shell${index ? " ruled" : ""}"><div class="section-heading"><div><p class="eyebrow">${type === "Game" ? "Play" : "Tools"}</p><h2>${type}s</h2></div><span class="count">0${projects.filter(project => project.type === type).length}</span></div><div class="project-grid">${projects.filter(project => project.type === type).map(project => projectCard(project)).join("")}</div></section>`).join("")}`
    })
  },
  {
    path: "/studio/",
    output: "studio/index.html",
    html: layout({
      title: "Studio",
      description: "The design and development principles behind Mirpworks.",
      path: "/studio/",
      content: `<header class="page-head shell studio-head"><p class="eyebrow">How we work</p><h1>Play deserves<br>careful design.</h1><p>Our principles help us make clear decisions—from the first interaction to the last polish pass.</p></header>
      <section class="principles shell" aria-labelledby="principles-title"><div class="section-heading"><div><p class="eyebrow">Studio principles</p><h2 id="principles-title">A shared foundation</h2></div></div><div class="principle-list">${principles.map(([number, title, copy]) => `<article><span>${number}</span><h3>${title}</h3><p>${copy}</p></article>`).join("")}</div></section>
      <section class="section shell ruled"><div class="split"><p class="eyebrow">Looking ahead</p><div><h2>The studio library</h2><p>Future guides will turn these principles into practical standards for brand, interface design, accessibility, development, shared assets, and music. For now, the public foundation stays focused and useful.</p></div></div></section>`
    })
  },
  {
    path: "/about/",
    output: "about/index.html",
    html: layout({
      title: "About",
      description: "About Mirpworks, an independent game and application development studio.",
      path: "/about/",
      content: `<header class="page-head shell"><p class="eyebrow">About Mirpworks</p><h1>Small studio.<br>Long view.</h1></header>
      <section class="section shell"><div class="about-grid"><h2>We make games and applications with intention.</h2><div class="prose"><p>Mirpworks is an independent development studio focused on polished, approachable experiences. Our work spans games and practical applications, but the priorities stay consistent: thoughtful design, strong usability, accessibility, and maintainable foundations.</p><p>We value experimentation when it clarifies an idea. In games, environmental storytelling can add texture and meaning—but it should always support the player’s understanding of the world and never compete with interaction.</p><p>We build for the long term: testing before polishing, respecting the realities of mobile screens, and treating reusable work as part of a shared studio library.</p></div></div></section>
      <section class="closing-panel"><div class="shell"><p class="eyebrow">The invitation</p><p class="display-line">Let’s play a game.</p><a class="button light" href="/projects/">See what we’re making <span aria-hidden="true">↗</span></a></div></section>`
    })
  },
  {
    path: "/contact/",
    output: "contact/index.html",
    html: layout({
      title: "Contact",
      description: "Contact Mirpworks for general inquiries, support, or media and press.",
      path: "/contact/",
      content: `<header class="page-head shell"><p class="eyebrow">Get in touch</p><h1>Contact</h1><p>For general inquiries, support, or media and press, email us at <a href="mailto:contact@mirpworks.com">contact@mirpworks.com</a>.</p></header>
      <section class="section shell contact-section" aria-labelledby="contact-options"><div class="section-heading"><div><p class="eyebrow">How can we help?</p><h2 id="contact-options">Choose a topic</h2></div></div><div class="contact-grid"><a class="contact-card" href="mailto:contact@mirpworks.com"><span class="eyebrow">01</span><h3>General inquiries</h3><span class="text-link">Email Mirpworks <span aria-hidden="true">↗</span></span></a><a class="contact-card" href="mailto:contact@mirpworks.com"><span class="eyebrow">02</span><h3>Support / bug reports</h3><span class="text-link">Email Mirpworks <span aria-hidden="true">↗</span></span></a><a class="contact-card" href="mailto:contact@mirpworks.com"><span class="eyebrow">03</span><h3>Media / press</h3><span class="text-link">Email Mirpworks <span aria-hidden="true">↗</span></span></a></div></section>`
    })
  }
];

for (const project of projects) {
  pages.push({
    path: `/projects/${project.slug}/`,
    output: `projects/${project.slug}/index.html`,
    html: layout({
      title: project.name,
      description: `${project.name} is a ${project.type.toLowerCase()} project by Mirpworks.`,
      path: `/projects/${project.slug}/`,
      content: `<header class="project-hero shell"><a class="back-link" href="/projects/"><span aria-hidden="true">←</span> All projects</a><div class="project-title"><div><p class="eyebrow">${project.type}</p><h1>${project.name}</h1></div><dl>${project.status ? `<div><dt>Status</dt><dd>${project.status}</dd></div>` : ""}<div><dt>Type</dt><dd>${project.type}</dd></div></dl></div></header>
      <section class="project-body shell"><div class="project-overview"><p class="eyebrow">Overview</p><h2>${project.overview}</h2></div><div class="media-placeholder" role="img" aria-label="Media for ${project.name} will be added as development progresses"><span aria-hidden="true">MW—${String(projects.indexOf(project) + 1).padStart(2, "0")}</span><p>Project media<br>coming later</p></div>${project.engine || project.presentation || project.visualDirection || project.tone ? `<section class="project-facts" aria-label="Project details"><p class="eyebrow">At a glance</p><dl>${[["Engine", project.engine], ["Presentation", project.presentation], ["Visual direction", project.visualDirection], ["Tone", project.tone]].filter(([, value]) => value).map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl></section>` : ""}${project.gameplay ? `<section class="gameplay-details"><p class="eyebrow">Gameplay</p><h2>Characters and roles</h2><ul>${project.gameplay.map(item => `<li>${item}</li>`).join("")}</ul></section>` : ""}${project.systems?.length || project.principles?.length ? `<div class="detail-grid">${project.systems?.length ? `<section><p class="eyebrow">Major systems</p><h2>Areas in development</h2><ul>${project.systems.map(item => `<li>${item}</li>`).join("")}</ul></section>` : ""}${project.principles?.length ? `<section><p class="eyebrow">Design principles</p><h2>What guides the work</h2><ul>${project.principles.map(item => `<li>${item}</li>`).join("")}</ul></section>` : ""}</div>` : ""}${project.links?.length ? `<section class="project-links" aria-label="Project links">${project.links.map(link => `<a class="button" href="${link.href}" target="_blank" rel="noopener noreferrer">${link.label} <span aria-hidden="true">↗</span></a>`).join("")}</section>` : ""}${project.status ? `<aside class="development-note"><p class="eyebrow">Development status</p><p>This page reflects the project’s current public status. More detail, media, and relevant links will be added as the work is ready to share.</p></aside>` : ""}</section>`
    })
  });
}
