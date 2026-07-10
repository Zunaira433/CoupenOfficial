import { prisma } from "@/lib/prisma";
import { cacheGetOrSet } from "@/lib/redis";
import Link from "next/link";
import Image from "next/image";
import CouponCard from "@/components/CouponCard";
import { Tag, LayoutGrid, Star, ArrowRight, Store, Shield, Search } from "lucide-react";
export const revalidate = 3600;

export default async function HomePage() {
  const [categories, topBrands, latestCoupons] = await Promise.all([
    cacheGetOrSet("home:categories", 3600, () =>
      prisma.category.findMany({
        take: 12,
        orderBy: { name: "asc" },
        include: { _count: { select: { brands: true } } }
      })
    ),
    cacheGetOrSet("home:topBrands", 3600, () =>
      prisma.brand.findMany({
        orderBy: { rating: "desc" },
        take: 8,
        include: { _count: { select: { coupons: true } } }
      })
    ),
    cacheGetOrSet("home:latestCoupons", 1800, () =>
      prisma.coupon.findMany({
        where: {
          verified: true,
          OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }]
        },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { brand: { select: { name: true, slug: true, logoUrl: true } } }
      })
    )
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Hero */}
      <section className="py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <Shield className="w-4 h-4" aria-hidden="true" />
          Hand-verified coupon codes
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
          Save more with<br />
          <span className="text-primary">verified coupons</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Hosting, AI tools, SaaS, VPN, domains and developer tools — all coupon codes tested before listing.
        </p>

<form method="GET" action="/search" role="search" className="max-w-2xl mx-auto mb-10" aria-label="Search brands and coupons">          <div className="flex gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden="true" />
              <input
                name="q"
                type="search"
                placeholder="Search brands, stores, coupons…"
                autoComplete="off"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Tag className="w-5 h-5" aria-hidden="true" />
            Browse All Deals
          </Link>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-lg hover:border-primary hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <LayoutGrid className="w-5 h-5" aria-hidden="true" />
            Browse Categories
          </Link>
        </div>
      </section>

      {/* Trust signals */}
      <section className="pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Verified Coupons", value: "2,500+" },
            { label: "Top Brands", value: "500+" },
            { label: "Happy Shoppers", value: "120k+" },
            { label: "Avg. Saving", value: "$43" }
          ].map(({ label, value }) => (
            <div key={label} className="card p-6 text-center">
              <p className="text-3xl font-extrabold text-primary mb-1">{value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-primary" aria-hidden="true" />
            Browse by Category
          </h2>
          <Link
            href="/categories"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline focus:outline-none focus-visible:underline"
          >
            View all <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group card p-5 hover:shadow-md hover:border-primary/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <p className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                {cat.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {cat._count.brands} brands
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Brands */}
      <section className="py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" aria-hidden="true" />
            Top Rated Brands
          </h2>
          <Link href="/brand" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline focus:outline-none focus-visible:underline">
            All brands <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {topBrands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brand/${brand.slug}`}
              className="group card p-5 hover:shadow-md hover:border-primary/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="flex items-center gap-3 mb-2">
                {brand.logoUrl ? (
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 shrink-0">
                    <Image src={brand.logoUrl} alt={`${brand.name} logo`} fill className="object-contain p-0.5" sizes="40px" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5 text-primary" aria-hidden="true" />
                  </div>
                )}
                <p className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors text-sm truncate">
                  {brand.name}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" aria-hidden="true" />
                  {brand._count.coupons} coupons
                </span>
                {brand.rating > 0 && (
                  <span className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" aria-hidden="true" />
                    {brand.rating.toFixed(1)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Verified Coupons */}
      {latestCoupons.length > 0 && (
        <section className="py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-500" aria-hidden="true" />
              Latest Verified Coupons
            </h2>
            <Link href="/deals" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline focus:outline-none focus-visible:underline">
              See all deals <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                brandSlug={coupon.brand?.slug || ""}
                brandName={coupon.brand?.name}
                brandLogoUrl={coupon.brand?.logoUrl}
              />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      

    </div>
  );
}
