import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import Pagination from "@/components/Pagination";
import { Search, Store, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Search Brands & Coupons",
  description: "Search for brands, coupon codes and deals on CoupenOfficial.",
  robots: { index: false, follow: true }
};

const PER_PAGE = 20;

export default async function SearchPage({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  const query = (searchParams.q || "").trim();
  const page = Math.max(1, Number(searchParams.page) || 1);

  const where = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { description: { contains: query, mode: "insensitive" as const } }
        ]
      }
    : {};

  const [brands, total] = await Promise.all([
    prisma.brand.findMany({
      where,
      orderBy: { name: "asc" },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
      include: { _count: { select: { coupons: true } } }
    }),
    prisma.brand.count({ where })
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs crumbs={[{ label: "Search" }]} />

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Search</h1>

      <form method="GET" action="/search" role="search" className="mb-8" aria-label="Search brands and coupons">
        <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search brands &amp; coupons
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden="true" />
            <input
              id="search-input"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search brands, stores, coupons…"
              autoComplete="off"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Search
          </button>
        </div>
      </form>

      {query && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {total} result{total !== 1 ? "s" : ""} for <strong className="text-gray-900 dark:text-white">&ldquo;{query}&rdquo;</strong>
        </p>
      )}

      {brands.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600">
          <Store className="w-12 h-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
          <p>{query ? `No results found for "${query}"` : "Enter a search term to find brands and coupons."}</p>
        </div>
      ) : (
        <ul className="space-y-3" role="list">
          {brands.map((brand) => (
            <li key={brand.id}>
              <Link
                href={`/brand/${brand.slug}`}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-md hover:border-primary/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {brand.logoUrl ? (
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shrink-0">
                    <Image src={brand.logoUrl} alt={`${brand.name} logo`} fill className="object-contain p-1" sizes="48px" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Store className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{brand.name}</p>
                  {brand.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{brand.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 shrink-0">
                  <Tag className="w-3.5 h-3.5" aria-hidden="true" />
                  {brand._count.coupons} coupon{brand._count.coupons !== 1 ? "s" : ""}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Pagination currentPage={page} totalPages={totalPages} basePath="/search" queryParams={query ? { q: query } : {}} />
    </div>
  );
}
