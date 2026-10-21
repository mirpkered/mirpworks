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
