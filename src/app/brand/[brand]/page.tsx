import { prisma } from "@/lib/prisma";
import { cacheGetOrSet } from "@/lib/redis";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CouponCard from "@/components/CouponCard";
import FavoriteButton from "@/components/FavoriteButton";
import { getCurrentUser } from "@/lib/auth";
import { Star, ExternalLink, Tag, Shield } from "lucide-react";
import { env } from "@/lib/env";

export const revalidate = 3600;

type Props = { params: { brand: string } };

async function getBrand(slug: string) {
  return cacheGetOrSet(`brands:${slug}`, 3600, () =>
    prisma.brand.findUnique({
      where: { slug },
      include: {
        coupons: { orderBy: { verified: "desc" } },
        category: true,
        _count: { select: { coupons: true } }
      }
    })
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brand = await getBrand(params.brand);
  if (!brand) return {};
  const title = brand.metaTitle || `${brand.name} Coupon Codes & Promo Deals`;
  const description = brand.metaDesc || `Get verified ${brand.name} coupon codes and promo deals. Save on your next ${brand.name} order with our exclusive discount codes.`;
  return {
    title,
    description,
    alternates: { canonical: `/brand/${brand.slug}` },
    openGraph: { title, description, url: `${env.SITE_URL}/brand/${brand.slug}`, images: brand.logoUrl ? [{ url: brand.logoUrl }] : [] }
  };
}

export default async function BrandPage({ params }: Props) {
  const brand = await getBrand(params.brand);
  if (!brand) notFound();

  const user = getCurrentUser();
  let isFavorited = false;
  if (user) {
    const fav = await prisma.favorite.findFirst({ where: { userId: user.userId, brandId: brand.id } });
    isFavorited = !!fav;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: brand.websiteUrl,
    ...(brand.logoUrl && { logo: brand.logoUrl }),
    aggregateRating: brand.rating > 0 ? {
      "@type": "AggregateRating",
      ratingValue: brand.rating,
      bestRating: 5,
      worstRating: 1,
      ratingCount: brand._count.coupons || 1
    } : undefined
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Does ${brand.name} have coupon codes?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes! We have ${brand._count.coupons} verified coupon codes for ${brand.name}. All codes are tested before listing.`
        }
      },
      {
        "@type": "Question",
        name: `How do I use a ${brand.name} coupon code?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Click "Reveal Code" on any coupon, copy the code shown, then paste it at checkout on the ${brand.name} website.`
        }
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <Breadcrumbs crumbs={[
        { label: brand.category?.name || "Category", href: brand.category ? `/categories/${brand.category.slug}` : "/categories" },
        { label: brand.name }
      ]} />

      <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-10">
        <div className="shrink-0">
          {brand.logoUrl ? (
            <div className="relative w-24 h-24 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white">
              <Image src={brand.logoUrl} alt={`${brand.name} logo`} fill className="object-contain p-2" sizes="96px" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Tag className="w-10 h-10 text-primary" aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
         <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{brand.name} Coupon Codes</h1>
{brand.rating > 0 && (
  <div className="flex items-center gap-1 mb-2" aria-label={`Rating: ${brand.rating} out of 5`}>
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.round(brand.rating) ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-gray-600"}`} aria-hidden="true" />
    ))}
    <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{brand.rating.toFixed(1)}</span>
  </div>
)}
<Link
  href={`/review/${brand.slug}`}
  className="inline-block text-sm text-primary hover:underline mb-2 focus:outline-none focus-visible:underline"
>
  Read Reviews
</Link>
          {brand.description && <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">{brand.description}</p>}
          <div className="flex flex-wrap gap-3">
            <a
              href={`/go/${brand.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              Visit {brand.name}
            </a>
            <FavoriteButton brandId={brand.id} initialFavorited={isFavorited} />
          </div>
        </div>
      </div>

      {brand.coupons.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No coupons available for {brand.name} right now. Check back soon!</p>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-green-500" aria-hidden="true" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {brand._count.coupons} Verified Coupon{brand._count.coupons !== 1 ? "s" : ""}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brand.coupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} brandSlug={brand.slug} />
            ))}
          </div>
        </>
      )}

      <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
        <dl className="space-y-4">
          <div>
            <dt className="font-medium text-gray-800 dark:text-gray-200">Does {brand.name} have coupon codes?</dt>
            <dd className="mt-1 text-gray-600 dark:text-gray-400 text-sm">Yes! We have {brand._count.coupons} verified coupon codes for {brand.name}. All codes are tested before listing.</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-800 dark:text-gray-200">How do I use a {brand.name} coupon code?</dt>
            <dd className="mt-1 text-gray-600 dark:text-gray-400 text-sm">Click &quot;Reveal Code&quot; on any coupon, copy the code shown, then paste it at checkout on the {brand.name} website.</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
