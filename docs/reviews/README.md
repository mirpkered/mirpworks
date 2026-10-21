# Mirpworks Reviews

Reviews are structured in `src/data/reviews.js`. Add categories in `reviewCategories` and add one record per product in `reviews`; the shared renderer creates the catalog card and stable `/reviews/{slug}/` page. Keep subjective writing, pros, cons, recommendation summaries, and dates empty until supplied from the owner's own review.

## Prepare and publish a review

1. Add or update one record with a unique lowercase hyphenated slug, product title, description, category ID, exact Associates URL, and any original photographs/video or written review sections.
2. Store original photographs only under `src/assets/reviews/{slug}/`, with useful alt text, captions, and intrinsic width/height in the record. Only media belonging to published records is copied into the public build.
3. Keep `status: "draft"` while collecting notes. Draft records are not used to render public pages. Do not add draft content to navigation or other public discovery surfaces.
4. When the complete, owner-authored review is ready, set `status: "published"`; add its publication date and any update date. This is the only publication switch.
5. Run `npm run build` and `npm run check`. The focused review check verifies public routes, disclosures, links, and draft exclusion.

Published affiliate links are emitted exactly as recorded, open in a new tab, and use `rel="sponsored nofollow noopener noreferrer"`. Keep the global disclosure on `/reviews/` and the contextual disclosure beside each affiliate link. Do not add Amazon-supplied photos, ratings, prices, availability, or customer-review content.

The current static site does not generate a sitemap or declare a `robots.txt`; if sitemap generation is introduced later, derive review URLs from published review routes only.
