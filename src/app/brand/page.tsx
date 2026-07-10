import { prisma } from "@/lib/prisma";
import { cacheGetOrSet } from "@/lib/redis";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import Pagination from "@/components/Pagination";
import { Store, Star, Tag } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All Brands – Verified Coupons & Promo Codes",
  description:
    "Browse every brand on CoupenOfficial. Find verified coupon codes and exclusive deals for hundreds of top stores."
};

const PER_PAGE = 24;

export default async function BrandListPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Math.max(1, Number(searchParams.page) || 1);

  const [brands, total] = await cacheGetOrSet(
    `brands:list:${page}`,
    3600,
    () =>
      Promise.all([
        prisma.brand.findMany({
          orderBy: { name: "asc" },
          take: PER_PAGE,
          skip: (page - 1) * PER_PAGE,
          include: { _count: { select: { coupons: true } } }
        }),
        prisma.brand.count()
      ])
  );

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs crumbs={[{ label: "All Brands" }]} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Store className="w-8 h-8 text-primary" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Brands</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          {total} brands with verified coupon codes and promo deals.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brand/${brand.slug}`}
            className="group flex flex-col p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-md hover:border-primary/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="flex items-center gap-3 mb-3">
              {brand.logoUrl ? (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shrink-0">
                  <Image
                    src={brand.logoUrl}
                    alt={`${brand.name} logo`}
                    fill
                    className="object-contain p-1"
                    sizes="48px"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Store className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
              )}
              <h2 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">
                {brand.name}
              </h2>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" aria-hidden="true" />
                {brand._count.coupons} coupons
              </span>
              {brand.rating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" aria-hidden="true" />
                  {brand.rating.toFixed(1)}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} basePath="/brand" />
    </div>
  );
}
