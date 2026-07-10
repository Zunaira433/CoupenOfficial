import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Star, Store } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Brand Reviews – CoupenOfficial",
  description: "Honest, detailed reviews of the brands and services listed on CoupenOfficial."
};

export default async function ReviewsIndexPage() {
  const brands = await prisma.brand.findMany({
    where: { reviews: { some: {} } },
    orderBy: { name: "asc" },
    include: { _count: { select: { reviews: true } } }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs crumbs={[{ label: "Reviews" }]} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Star className="w-8 h-8 text-amber-400 fill-amber-400" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Brand Reviews</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Honest, hands-on reviews of the brands and services we cover.
        </p>
      </header>

      {brands.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No reviews published yet. Check back soon!</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/review/${brand.slug}`}
              className="group flex flex-col p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-md hover:border-primary/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="flex items-center gap-3 mb-3">
                {brand.logoUrl ? (
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shrink-0">
                    <Image src={brand.logoUrl} alt={`${brand.name} logo`} fill className="object-contain p-1" sizes="48px" />
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
              <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" aria-hidden="true" />
                {brand._count.reviews} review{brand._count.reviews !== 1 ? "s" : ""}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}