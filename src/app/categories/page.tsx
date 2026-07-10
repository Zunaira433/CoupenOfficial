import { prisma } from "@/lib/prisma";
import { cacheGetOrSet } from "@/lib/redis";
import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { LayoutGrid, Tag } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All Coupon Categories – Browse by Category",
  description:
    "Browse coupon codes and deals by category. From fashion to tech to food — find verified promo codes for every type of store."
};

export default async function CategoriesPage() {
  const categories = await cacheGetOrSet("categories:all", 3600, () =>
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { brands: true } } }
    })
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs crumbs={[{ label: "Categories" }]} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <LayoutGrid className="w-8 h-8 text-primary" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Categories</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Browse {categories.length} categories to find the best deals for what you need.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group flex items-start gap-4 p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-md hover:border-primary/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
              <Tag className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">
                {cat.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {cat._count.brands} {cat._count.brands === 1 ? "brand" : "brands"}
              </p>
              {cat.description && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
