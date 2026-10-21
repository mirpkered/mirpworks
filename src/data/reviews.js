export const reviewCategories = [
  { id: "books-comics", name: "Books & Comics" },
  { id: "gaming", name: "Gaming" },
  { id: "tech-equipment", name: "Tech & Equipment" },
  { id: "everyday-finds", name: "Everyday Finds" }
];

// Only records marked "published" are rendered into public pages or copied media.
// Keep subjective fields empty until the reviewer supplies original first-hand content.
export const reviews = [
  {
    slug: "dr-mcninja-omnibus",
    productTitle: "The Adventures of Dr. McNinja Omnibus",
    ownerPossessesProduct: true,
    productDescription: "",
    categoryId: "books-comics",
    originalPhotographs: [],
    videoReviewUrl: "",
    writtenReview: { introduction: "", sections: [] },
    pros: [],
    cons: [],
    recommendationSummary: "",
    affiliateUrl: "https://amzn.to/4szUExz",
    publishedAt: null,
    updatedAt: null,
    status: "draft"
  }
];

export const publishedReviews = reviews.filter((review) => review.status === "published");
