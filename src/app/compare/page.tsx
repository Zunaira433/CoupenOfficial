import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import { BarChart2, Store } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Comparisons – CoupenOfficial",
  description: "Side-by-side comparisons to help you choose the right tool or service."
};

export default async function CompareIndexPage() {
  const comparisons = await prisma.comparison.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      brandA: { select: { name: true, logoUrl: true } },
      brandB: { select: { name: true, logoUrl: true } }
    }
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs crumbs={[{ label: "Compare" }]} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <BarChart2 className="w-8 h-8 text-primary" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Comparisons</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Side-by-side breakdowns to help you pick the right tool.
        </p>
      </header>

      {comparisons.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No comparisons published yet. Check back soon!</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {comparisons.map((c) => (
            <Link
              key={c.id}
              href={`/compare/${c.slug}`}
              className="flex items-center gap-4 p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-md hover:border-primary/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {(c.brandA || c.brandB) && (
                <div className="flex items-center -space-x-3 shrink-0">
                  {[c.brandA, c.brandB].filter(Boolean).map((b, i) => (
                    <div key={i} className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-white dark:border-gray-900 bg-white shrink-0">
                      {b!.logoUrl ? (
                        <Image src={b!.logoUrl} alt={`${b!.name} logo`} fill className="object-contain p-1" sizes="48px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10">
                          <Store className="w-5 h-5 text-primary" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate">{c.title}</p>
                {c.summary && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                    {c.summary.slice(0, 80)}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}