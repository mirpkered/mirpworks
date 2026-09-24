import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { pages } from "../src/site.js";

const dist = resolve("dist");
const failures = [];
const requiredRoutes = ["/", "/projects/", "/studio/", "/about/", "/projects/word-search-adventure/", "/projects/winkbound/", "/projects/stillwater/", "/projects/slabberjaws/", "/projects/trivia-generator/"];

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
  } catch { failures.push(`Missing built file: ${page.output}`); }
}

for (const asset of ["assets/styles.css", "assets/responsive-fix.css", "assets/site.js", "assets/hero.png", "favicon.svg", "_headers", "404.html"]) {
  try { await stat(resolve(dist, asset)); } catch { failures.push(`Missing asset: ${asset}`); }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Checked ${requiredRoutes.length} routes and shared assets successfully.`);
