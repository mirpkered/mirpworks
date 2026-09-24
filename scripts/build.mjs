import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pages } from "../src/site.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(resolve(dist, "assets"), { recursive: true });
await mkdir(resolve(dist, "assets/brand"), { recursive: true });

for (const page of pages) {
  const target = resolve(dist, page.output);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, page.html, "utf8");
}

await cp(resolve(root, "src/styles.css"), resolve(dist, "assets/styles.css"));
await cp(resolve(root, "src/responsive-fix.css"), resolve(dist, "assets/responsive-fix.css"));
await cp(resolve(root, "src/brand-integration.css"), resolve(dist, "assets/brand-integration.css"));
await cp(resolve(root, "src/contact.css"), resolve(dist, "assets/contact.css"));
await cp(resolve(root, "src/script.js"), resolve(dist, "assets/site.js"));
await cp(resolve(root, "src/assets/hero.png"), resolve(dist, "assets/hero.png"));
await cp(resolve(root, "src/assets/brand/mirpworks-logo-source.jpg"), resolve(dist, "assets/brand/mirpworks-logo-source.jpg"));
await cp(resolve(root, "src/assets/brand/mirpworks-logo.jpg"), resolve(dist, "assets/brand/mirpworks-logo.jpg"));
await cp(resolve(root, "src/assets/brand/mirpworks-mark.jpg"), resolve(dist, "assets/brand/mirpworks-mark.jpg"));
await cp(resolve(root, "src/favicon.svg"), resolve(dist, "favicon.svg"));
await writeFile(resolve(dist, "_headers"), "/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n", "utf8");
await writeFile(resolve(dist, "404.html"), pages[0].html.replace("<title>Mirpworks</title>", "<title>Page not found — Mirpworks</title>").replace("<main id=\"main\">", "<main id=\"main\"><section class=\"page-head shell\"><p class=\"eyebrow\">404</p><h1>Page not found.</h1><p><a class=\"text-link\" href=\"/\">Return to Mirpworks →</a></p></section><div hidden>" ).replace("</main>", "</div></main>"), "utf8");

console.log(`Built ${pages.length} routes in dist/`);
