export function productSchema(brand: {
  name: string;
  description?: string | null;
  websiteUrl: string;
  rating: number;
  logoUrl?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: brand.name,
    description: brand.description || `${brand.name} review and coupons`,
    url: brand.websiteUrl,
    image: brand.logoUrl || undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: brand.rating,
      bestRating: "5",
      ratingCount: "1"
    }
  };
}

export function reviewSchema(review: {
  title: string;
  body: string;
  rating: number;
  brandName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    name: review.title,
    reviewBody: review.body,
    reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: "5" },
    itemReviewed: { "@type": "Product", name: review.brandName }
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer }
    }))
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    // eslint-disable-next-line react/no-danger
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
