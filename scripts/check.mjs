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
  } catch { failures.push(`Missing built file: ${page.output}`); }
}

for (const asset of ["assets/styles.css", "assets/responsive-fix.css", "assets/brand-integration.css", "assets/contact.css", "assets/site.js", "assets/hero.png", "assets/brand/mirpworks-logo-source.jpg", "assets/brand/mirpworks-logo.jpg", "assets/brand/mirpworks-mark.jpg", "favicon.svg", "_headers", "404.html"]) {
  try { await stat(resolve(dist, asset)); } catch { failures.push(`Missing asset: ${asset}`); }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Checked ${requiredRoutes.length} routes and shared assets successfully.`);
