import { readFile, readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { pages } from "../src/site.js";
import { inProgressReviews, publicReviews, publishedReviews, reviewCategories, reviews } from "../src/data/reviews.js";

const dist = resolve("dist");
const failures = [];
const fail = (message) => failures.push(message);
const expectedCategories = ["Books & Comics", "Gaming", "Tech & Equipment", "Everyday Finds"];
const categoryNames = reviewCategories.map((category) => category.name);
const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

if (JSON.stringify(categoryNames) !== JSON.stringify(expectedCategories)) fail("Reviews categories are missing, duplicated, or out of expected initial order");
if (new Set(reviewCategories.map((category) => category.id)).size !== reviewCategories.length) fail("Reviews category IDs must be unique");
if (new Set(reviews.map((review) => review.slug)).size !== reviews.length) fail("Review slugs must be unique");

const requiredFields = ["slug", "productTitle", "productDescription", "categoryId", "originalPhotographs", "videoReviewUrl", "writtenReview", "pros", "cons", "recommendationSummary", "affiliateUrl", "publishedAt", "updatedAt", "status"];
for (const review of reviews) {
  for (const field of requiredFields) if (!(field in review)) fail(`${review.slug} is missing ${field}`);
  if (!reviewCategories.some((category) => category.id === review.categoryId)) fail(`${review.slug} has an unknown category`);
  if (!new Set(["draft", "in-progress", "published"]).has(review.status)) fail(`${review.slug} has invalid publication state`);
  if (review.status === "in-progress") {
    if (!review.productTitle || review.ownerPossessesProduct !== true || !review.affiliateUrl) fail(`${review.slug} is missing factual in-progress page fields`);
    if (review.productDescription || review.videoReviewUrl || review.writtenReview.introduction || review.writtenReview.sections.length || review.pros.length || review.cons.length || review.recommendationSummary || review.originalPhotographs.length || review.publishedAt !== null || review.updatedAt !== null) fail(`${review.slug} contains unprovided review content, media, or publication dates`);
  }
  if (review.status === "published" && (!review.productTitle || !review.productDescription || !review.publishedAt)) fail(`${review.slug} is published without required public content`);
}
if (publicReviews.length !== inProgressReviews.length + publishedReviews.length) fail("Public review records do not match in-progress plus published records");

const expectedRecords = [
  ["https://amzn.to/4szUExz", "The Adventures of Dr. McNinja Omnibus", "dr-mcninja-omnibus", "books-comics"],
  ["https://amzn.to/4icmwD5", "Plok The Exploding Man: Volume 1: Awake! (Plok The Exploding Man, The Comic Strip)", "plok-the-exploding-man-volume-1-awake", "books-comics"],
  ["https://amzn.to/4iezsby", "Plok The Exploding Man: Volume 4: Destination Z (Plok The Exploding Man, The Comic Strip)", "plok-the-exploding-man-volume-4-destination-z", "books-comics"],
  ["https://amzn.to/4siwN5g", "Plok The Exploding Man: Volume 2: Boom! (Plok The Exploding Man, The Comic Strip)", "plok-the-exploding-man-volume-2-boom", "books-comics"],
  ["https://amzn.to/4siwS94", "Plok The Exploding Man: Volume 3: Cave (Plok The Exploding Man, The Comic Strip)", "plok-the-exploding-man-volume-3-cave", "books-comics"],
  ["https://amzn.to/4i8IsPs", "Plok The Exploding Man: Volume 5: The Trial of Plok (Plok The Exploding Man, The Comic Strip)", "plok-the-exploding-man-volume-5-the-trial-of-plok", "books-comics"],
  ["https://amzn.to/4siwXJU", "The Adventures of Dr. McNinja Volume 2: Timefist", "the-adventures-of-dr-mcninja-volume-2-timefist", "books-comics"],
  ["https://amzn.to/4dR2mgw", "Adventures of Dr. McNinja, The: King Radical", "adventures-of-dr-mcninja-the-king-radical", "books-comics"],
  ["https://amzn.to/487D1LQ", "The Adventures of Dr. McNinja: Night Powers", "the-adventures-of-dr-mcninja-night-powers", "books-comics"],
  ["https://amzn.to/4scMpad", "HexClad 6pc Hybrid Nonstick Frying Pans Set with Lids, 8, 10 & 12\" Pans", "hexclad-6-piece-hybrid-frying-pan-set", "everyday-finds"],
  ["https://amzn.to/4ixm1Vj", "HexClad 12\" Hybrid Nonstick Wok & Lid, Induction-Ready, Dishwasher Safe", "hexclad-12-inch-hybrid-nonstick-wok-with-lid", "everyday-finds"],
  ["https://amzn.to/3WCJkEB", "HexClad 12\" Hybrid Nonstick Frying Pan with Lid, Dishwasher & Oven Safe", "hexclad-12-inch-hybrid-frying-pan-with-lid", "everyday-finds"],
  ["https://amzn.to/4elcG0m", "HexClad 10\" Hybrid Nonstick Frying Pan, Dishwasher & Induction Safe", "hexclad-10-inch-hybrid-frying-pan", "everyday-finds"],
  ["https://amzn.to/3WDIqrq", "HexClad 8\" Hybrid Nonstick Frying Pan, Dishwasher & Induction Safe", "hexclad-8-inch-hybrid-frying-pan", "everyday-finds"],
  ["https://amzn.to/47vxdvu", "HexClad 8\" Hybrid Nonstick Frying Pan with Lid, Dishwasher & Oven Safe", "hexclad-8-inch-hybrid-frying-pan-with-lid", "everyday-finds"]
];
if (inProgressReviews.length !== expectedRecords.length) fail(`Expected ${expectedRecords.length} owner-possessed in-progress records, found ${inProgressReviews.length}`);
for (const [affiliateUrl, productTitle, slug, categoryId] of expectedRecords) {
  const matches = reviews.filter((review) => review.affiliateUrl === affiliateUrl);
  if (matches.length !== 1) fail(`${affiliateUrl} must exist exactly once in review data`);
  const review = matches[0];
  if (!review) continue;
  if (review.productTitle !== productTitle || review.slug !== slug || review.categoryId !== categoryId || review.status !== "in-progress") fail(`${affiliateUrl} has incorrect title, slug, category, or publication status`);
}

const catalog = pages.find((page) => page.path === "/reviews/");
if (!catalog) fail("The Reviews landing route is missing");
else {
  const html = await readFile(resolve(dist, catalog.output), "utf8");
  if (!html.includes("<title>Reviews — Mirpworks</title>") || !html.includes('rel="canonical" href="https://mirpworks.com/reviews/"')) fail("The Reviews landing page is missing SEO title or canonical URL");
  if (!html.includes("As an Amazon Associate I earn from qualifying purchases.")) fail("The Reviews landing page is missing the Amazon Associates disclosure");
  if (!html.includes("Review in progress") || !html.includes("They are not completed reviews.")) fail("The catalog does not clearly identify in-progress items");
  for (const name of expectedCategories) if (!html.includes(name.replaceAll("&", "&amp;"))) fail(`The Reviews landing page is missing ${name}`);
  for (const review of publicReviews) {
    if (!html.includes(escapeHtml(review.productTitle)) || !html.includes(`/reviews/${review.slug}/`)) fail(`${review.slug} is missing from the public catalog`);
    if (review.status === "in-progress" && !html.includes(`Review in progress`)) fail(`${review.slug} has no in-progress catalog label`);
  }
}

if (!pages.find((page) => page.path === "/")?.html.includes("/reviews/")) fail("The primary navigation does not include Reviews");
const home = pages.find((page) => page.path === "/")?.html ?? "";
if (home.includes("Amazon Associate") || home.includes("Amazon.com") || home.includes("Gear &amp; Reviews")) fail("Reviews or affiliate promotions leaked onto the homepage");

const notFound = await readFile(resolve(dist, "404.html"), "utf8");
for (const review of reviews.filter((item) => item.status === "draft")) {
  const route = `/reviews/${review.slug}/`;
  if (pages.some((page) => page.path === route)) fail(`Draft ${review.slug} has a generated route`);
  try { await stat(resolve(dist, "reviews", review.slug, "index.html")); fail(`Draft ${review.slug} has a public output file`); } catch (error) { if (error.code !== "ENOENT") throw error; }
  if (notFound.includes(review.productTitle) || notFound.includes(review.affiliateUrl)) fail(`Draft ${review.slug} leaked into the not-found page`);
}

for (const review of publicReviews) {
  const route = `/reviews/${review.slug}/`;
  const page = pages.find((item) => item.path === route);
  if (!page) { fail(`Public review ${review.slug} has no generated route`); continue; }
  const html = await readFile(resolve(dist, page.output), "utf8");
  if (!html.includes(`rel="canonical" href="https://mirpworks.com${route}"`)) fail(`${route} is missing its canonical URL`);
  if (!html.includes(`href="${review.affiliateUrl}"`) || !html.includes('rel="sponsored nofollow noopener noreferrer"') || !html.includes("Affiliate link: I may earn a commission if you purchase through this link.") || !html.includes("As an Amazon Associate I earn from qualifying purchases.")) fail(`${route} has an invalid or undisclosed affiliate link`);
  if (review.status === "in-progress") {
    if (!html.includes("Review in progress") || !html.includes("We own this item and are preparing a full Mirpworks review.")) fail(`${route} is missing its clear in-progress status or factual owner note`);
    if (html.includes("What worked for me") || html.includes("What didn’t") || html.includes("In short") || html.includes("rating")) fail(`${route} includes an empty/fabricated review section or rating`);
  }
  for (const photo of review.originalPhotographs ?? []) {
    if (!photo.alt || !photo.width || !photo.height) fail(`${route} has a photograph without meaningful alt text or dimensions`);
    try { await stat(resolve(dist, photo.src.slice(1))); } catch { fail(`${route} is missing published photograph ${photo.src}`); }
  }
}

for (const file of await readdir(dist, { withFileTypes: true })) {
  if (file.isFile() && file.name === "sitemap.xml") {
    const sitemap = await readFile(resolve(dist, file.name), "utf8");
    for (const review of reviews.filter((item) => item.status === "draft")) if (sitemap.includes(review.slug)) fail(`Draft ${review.slug} appears in sitemap.xml`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Checked Reviews catalog, ${reviewCategories.length} categories, ${inProgressReviews.length} in-progress page(s), and draft filtering for ${reviews.length} record(s).`);
