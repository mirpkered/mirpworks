import { readFile, readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { pages } from "../src/site.js";
import { publishedReviews, reviewCategories, reviews } from "../src/data/reviews.js";

const dist = resolve("dist");
const failures = [];
const fail = (message) => failures.push(message);
const expectedCategories = ["Books & Comics", "Gaming", "Tech & Equipment", "Everyday Finds"];
const categoryNames = reviewCategories.map((category) => category.name);

if (JSON.stringify(categoryNames) !== JSON.stringify(expectedCategories)) fail("Reviews categories are missing, duplicated, or out of expected initial order");
if (new Set(reviewCategories.map((category) => category.id)).size !== reviewCategories.length) fail("Reviews category IDs must be unique");
if (new Set(reviews.map((review) => review.slug)).size !== reviews.length) fail("Review slugs must be unique");

const requiredFields = ["slug", "productTitle", "productDescription", "categoryId", "originalPhotographs", "videoReviewUrl", "writtenReview", "pros", "cons", "recommendationSummary", "affiliateUrl", "publishedAt", "updatedAt", "status"];
for (const review of reviews) {
  for (const field of requiredFields) if (!(field in review)) fail(`${review.slug} is missing ${field}`);
  if (!reviewCategories.some((category) => category.id === review.categoryId)) fail(`${review.slug} has an unknown category`);
  if (!new Set(["draft", "published"]).has(review.status)) fail(`${review.slug} has invalid publication state`);
  if (review.status === "published" && (!review.productTitle || !review.productDescription || !review.publishedAt)) fail(`${review.slug} is published without required public content`);
}

const drMcNinja = reviews.find((review) => review.slug === "dr-mcninja-omnibus");
if (!drMcNinja) fail("The Dr. McNinja Omnibus draft record is missing");
else {
  if (drMcNinja.productTitle !== "The Adventures of Dr. McNinja Omnibus" || drMcNinja.categoryId !== "books-comics" || drMcNinja.affiliateUrl !== "https://amzn.to/4szUExz" || drMcNinja.status !== "draft") fail("The Dr. McNinja draft has incorrect factual fields");
  if (drMcNinja.ownerPossessesProduct !== true) fail("The Dr. McNinja draft is missing the owner's stated possession context");
  if (drMcNinja.pros.length || drMcNinja.cons.length || drMcNinja.recommendationSummary || drMcNinja.writtenReview.introduction || drMcNinja.writtenReview.sections.length) fail("The Dr. McNinja draft contains unprovided subjective review content");
}

const batchDrafts = [
  ["https://amzn.to/4icmwD5", "Plok The Exploding Man: Volume 1: Awake! (Plok The Exploding Man, The Comic Strip)", "plok-the-exploding-man-volume-1-awake"],
  ["https://amzn.to/4iezsby", "Plok The Exploding Man: Volume 4: Destination Z (Plok The Exploding Man, The Comic Strip)", "plok-the-exploding-man-volume-4-destination-z"],
  ["https://amzn.to/4siwN5g", "Plok The Exploding Man: Volume 2: Boom! (Plok The Exploding Man, The Comic Strip)", "plok-the-exploding-man-volume-2-boom"],
  ["https://amzn.to/4siwS94", "Plok The Exploding Man: Volume 3: Cave (Plok The Exploding Man, The Comic Strip)", "plok-the-exploding-man-volume-3-cave"],
  ["https://amzn.to/4i8IsPs", "Plok The Exploding Man: Volume 5: The Trial of Plok (Plok The Exploding Man, The Comic Strip)", "plok-the-exploding-man-volume-5-the-trial-of-plok"],
  ["https://amzn.to/4siwXJU", "The Adventures of Dr. McNinja Volume 2: Timefist", "the-adventures-of-dr-mcninja-volume-2-timefist"],
  ["https://amzn.to/4dR2mgw", "Adventures of Dr. McNinja, The: King Radical", "adventures-of-dr-mcninja-the-king-radical"],
  ["https://amzn.to/487D1LQ", "The Adventures of Dr. McNinja: Night Powers", "the-adventures-of-dr-mcninja-night-powers"]
];
for (const [affiliateUrl, productTitle, slug] of batchDrafts) {
  const matches = reviews.filter((review) => review.affiliateUrl === affiliateUrl);
  if (matches.length !== 1) fail(`${affiliateUrl} must exist exactly once in review data`);
  const review = matches[0];
  if (!review) continue;
  if (review.productTitle !== productTitle || review.slug !== slug || review.status !== "draft") fail(`${affiliateUrl} has incorrect title, slug, or publication status`);
  if (review.categoryId !== "books-comics" || review.ownerPossessesProduct !== true) fail(`${affiliateUrl} has incorrect category or ownership note`);
  if (review.productDescription || review.videoReviewUrl || review.writtenReview.introduction || review.writtenReview.sections.length || review.pros.length || review.cons.length || review.recommendationSummary || review.publishedAt !== null || review.updatedAt !== null || review.originalPhotographs.length) fail(`${affiliateUrl} has non-empty subjective, publication, or media fields`);
}

const additionalBatchDrafts = [
  ["https://amzn.to/4scMpad", "HexClad 6pc Hybrid Nonstick Frying Pans Set with Lids, 8, 10 & 12\" Pans", "hexclad-6-piece-hybrid-frying-pan-set"],
  ["https://amzn.to/4ixm1Vj", "HexClad 12\" Hybrid Nonstick Wok & Lid, Induction-Ready, Dishwasher Safe", "hexclad-12-inch-hybrid-nonstick-wok-with-lid"],
  ["https://amzn.to/3WCJkEB", "HexClad 12\" Hybrid Nonstick Frying Pan with Lid, Dishwasher & Oven Safe", "hexclad-12-inch-hybrid-frying-pan-with-lid"],
  ["https://amzn.to/4elcG0m", "HexClad 10\" Hybrid Nonstick Frying Pan, Dishwasher & Induction Safe", "hexclad-10-inch-hybrid-frying-pan"],
  ["https://amzn.to/3WDIqrq", "HexClad 8\" Hybrid Nonstick Frying Pan, Dishwasher & Induction Safe", "hexclad-8-inch-hybrid-frying-pan"],
  ["https://amzn.to/47vxdvu", "HexClad 8\" Hybrid Nonstick Frying Pan with Lid, Dishwasher & Oven Safe", "hexclad-8-inch-hybrid-frying-pan-with-lid"]
];
for (const [affiliateUrl, productTitle, slug] of additionalBatchDrafts) {
  const matches = reviews.filter((review) => review.affiliateUrl === affiliateUrl);
  if (matches.length !== 1) fail(`${affiliateUrl} must exist exactly once in review data`);
  const review = matches[0];
  if (!review) continue;
  if (review.productTitle !== productTitle || review.slug !== slug || review.status !== "draft") fail(`${affiliateUrl} has incorrect title, slug, or publication status`);
  if (review.categoryId !== "everyday-finds" || review.ownerPossessesProduct !== true) fail(`${affiliateUrl} has incorrect category or ownership note`);
  if (review.productDescription || review.videoReviewUrl || review.writtenReview.introduction || review.writtenReview.sections.length || review.pros.length || review.cons.length || review.recommendationSummary || review.publishedAt !== null || review.updatedAt !== null || review.originalPhotographs.length) fail(`${affiliateUrl} has non-empty subjective, publication, or media fields`);
}

const catalog = pages.find((page) => page.path === "/reviews/");
if (!catalog) fail("The Reviews landing route is missing");
else {
  const html = await readFile(resolve(dist, catalog.output), "utf8");
  if (!html.includes("<title>Reviews — Mirpworks</title>") || !html.includes('rel="canonical" href="https://mirpworks.com/reviews/"')) fail("The Reviews landing page is missing SEO title or canonical URL");
  if (!html.includes("As an Amazon Associate I earn from qualifying purchases.")) fail("The Reviews landing page is missing the Amazon Associates disclosure");
  for (const name of expectedCategories) if (!html.includes(name.replaceAll("&", "&amp;"))) fail(`The Reviews landing page is missing ${name}`);
  if (!html.includes("Original reviews are coming.") || !html.includes("No reviews published here yet.")) fail("The Reviews landing page does not have its honest empty state");
  if (html.includes(drMcNinja?.productTitle ?? "\u0000") || html.includes("https://amzn.to/4szUExz")) fail("The draft product leaked into the public Reviews catalog");
}

if (!pages.find((page) => page.path === "/")?.html.includes("/reviews/")) fail("The primary navigation does not include Reviews");
const home = pages.find((page) => page.path === "/")?.html ?? "";
if (home.includes("Amazon Associate") || home.includes("Amazon.com") || home.includes("Gear &amp; Reviews")) fail("Reviews or affiliate promotions leaked onto the homepage");

for (const review of reviews.filter((item) => item.status !== "published")) {
  if (pages.some((page) => page.path === `/reviews/${review.slug}/`)) fail(`Draft ${review.slug} has a generated route`);
  try { await stat(resolve(dist, "reviews", review.slug, "index.html")); fail(`Draft ${review.slug} has a public output file`); } catch (error) { if (error.code !== "ENOENT") throw error; }
  const notFound = await readFile(resolve(dist, "404.html"), "utf8");
  if (notFound.includes(review.productTitle) || notFound.includes(review.affiliateUrl)) fail(`Draft ${review.slug} leaked into the not-found page`);
}

const publishedPaths = new Set(publishedReviews.map((review) => `/reviews/${review.slug}/`));
for (const review of publishedReviews) {
  const route = `/reviews/${review.slug}/`;
  if (!pages.some((page) => page.path === route)) fail(`Published review ${review.slug} has no generated route`);
  const page = pages.find((item) => item.path === route);
  const html = page ? await readFile(resolve(dist, page.output), "utf8") : "";
  if (page && !html.includes(`rel="canonical" href="https://mirpworks.com${route}"`)) fail(`${route} is missing its canonical URL`);
  if (review.affiliateUrl && (!html.includes(`href="${review.affiliateUrl}"`) || !html.includes('rel="sponsored nofollow noopener noreferrer"') || !html.includes("Affiliate link: I may earn a commission if you purchase through this link.") || !html.includes("As an Amazon Associate I earn from qualifying purchases."))) fail(`${route} has an invalid or undisclosed affiliate link`);
  for (const photo of review.originalPhotographs ?? []) {
    if (!photo.alt || !photo.width || !photo.height) fail(`${route} has a photograph without meaningful alt text or dimensions`);
    try { await stat(resolve(dist, photo.src.slice(1))); } catch { fail(`${route} is missing published photograph ${photo.src}`); }
  }
}

for (const file of await readdir(dist, { withFileTypes: true })) {
  if (file.isFile() && file.name === "sitemap.xml") {
    const sitemap = await readFile(resolve(dist, file.name), "utf8");
    for (const review of reviews.filter((item) => item.status !== "published")) if (sitemap.includes(review.slug)) fail(`Draft ${review.slug} appears in sitemap.xml`);
  }
}
if ([...publishedPaths].some((path) => !pages.some((page) => page.path === path))) fail("Published review route set is inconsistent");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Checked Reviews landing page, ${reviewCategories.length} categories, and publication filtering for ${reviews.length} review record(s).`);
