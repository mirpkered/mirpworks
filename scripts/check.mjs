import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { pages } from "../src/site.js";

const dist = resolve("dist");
const failures = [];
const requiredRoutes = ["/", "/projects/", "/studio/", "/about/", "/contact/", "/projects/word-search-adventure/", "/projects/winkbound/", "/projects/stillwater/", "/projects/slabberjaws/", "/projects/trivia-generator/", "/projects/zombie-swarm/"];

for (const route of requiredRoutes) {
  const page = pages.find(item => item.path === route);
  if (!page) { failures.push(`Missing route: ${route}`); continue; }
  const file = resolve(dist, page.output);
  try {
    await stat(file);
    const html = await readFile(file, "utf8");
    for (const marker of ["<title>", "<main", "<h1", "aria-label=\"Primary navigation\""]) {
      if (!html.includes(marker)) failures.push(`${route} lacks ${marker}`);
    }
    if ((html.match(/<h1/g) || []).length !== 1) failures.push(`${route} must have exactly one h1`);
    if (route === "/contact/" && (!html.includes("mailto:contact@mirpworks.com") || !["General inquiries", "Support / bug reports", "Media / press"].every(item => html.includes(item)))) failures.push("Contact page is missing an email link or inquiry category");
    if (route === "/projects/zombie-swarm/" && (!html.includes("https://mirpkered.itch.io/zombie-swarm") || !html.includes('target="_blank" rel="noopener noreferrer"') || !html.includes("Commander Zombie"))) failures.push("Zombie Swarm page is missing expected project details or safe itch.io link attributes");
    if (route === "/projects/word-search-adventure/" && (!["word-search-adventure-menu.jpg", "word-search-adventure-gameplay.jpg", "word-search-adventure-adventure-map.jpg"].every(filename => html.includes(`/assets/${filename}`)) || !html.includes('aria-label="Word Search Adventure screenshots"'))) failures.push("Word Search Adventure page is missing its accessible screenshot gallery");
    if (route === "/projects/trivia-generator/" && (!["trivia-generator-setup.jpg", "trivia-generator-text-game.jpg", "trivia-generator-image-game.jpg"].every(filename => html.includes(`/assets/${filename}`)) || !html.includes('aria-label="Trivia Generator screenshots"'))) failures.push("Trivia Generator page is missing its accessible screenshot gallery");
    if (["/projects/", "/projects/word-search-adventure/", "/projects/slabberjaws/", "/projects/trivia-generator/", "/projects/zombie-swarm/"].includes(route)) {
      for (const [slug, href, label] of [
        ["word-search-adventure", "https://wordsearchadventure.onrender.com/", "Play"],
        ["slabberjaws", "https://mirpkered.github.io/slabberjaws/", "Open App"],
        ["trivia-generator", "https://trivia-generator.onrender.com", "Open App"],
        ["zombie-swarm", "https://mirpkered.itch.io/zombie-swarm", "View on itch.io"]
      ]) {
        const expected = route === "/projects/" || route === `/projects/${slug}/`;
        if (expected && (!html.includes(`href="${href}"`) || !html.includes(`>${label} <span`) || !html.includes('target="_blank" rel="noopener noreferrer"'))) failures.push(`${route} is missing the safe ${label} CTA for ${slug}`);
        if (!expected && html.includes(`href="${href}"`)) failures.push(`${route} unexpectedly contains a live link for ${slug}`);
      }
      if ((route === "/projects/winkbound/" || route === "/projects/stillwater/") && ["https://wordsearchadventure.onrender.com/", "https://mirpkered.github.io/slabberjaws/", "https://trivia-generator.onrender.com", "https://mirpkered.itch.io/zombie-swarm"].some(href => html.includes(href))) failures.push(`${route} unexpectedly contains a live project URL`);
    }
  } catch { failures.push(`Missing built file: ${page.output}`); }
}

for (const asset of ["assets/styles.css", "assets/responsive-fix.css", "assets/brand-integration.css", "assets/contact.css", "assets/site.js", "assets/hero.png", "assets/word-search-adventure-menu.jpg", "assets/word-search-adventure-gameplay.jpg", "assets/word-search-adventure-adventure-map.jpg", "assets/trivia-generator-setup.jpg", "assets/trivia-generator-text-game.jpg", "assets/trivia-generator-image-game.jpg", "assets/brand/mirpworks-logo-source.jpg", "assets/brand/mirpworks-logo.jpg", "assets/brand/mirpworks-mark.jpg", "favicon.svg", "_headers", "404.html"]) {
  try { await stat(resolve(dist, asset)); } catch { failures.push(`Missing asset: ${asset}`); }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Checked ${requiredRoutes.length} routes and shared assets successfully.`);
