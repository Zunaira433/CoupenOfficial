import { prisma } from "@/lib/prisma";
import { cacheGetOrSet } from "@/lib/redis";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import CouponCard from "@/components/CouponCard";
import Pagination from "@/components/Pagination";
import { Tag } from "lucide-react";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Today's Best Deals & Verified Coupon Codes",
  description: "Browse the latest verified coupon codes and exclusive deals from hundreds of top brands. Updated daily."
};

const PER_PAGE = 24;

export default async function DealsPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Math.max(1, Number(searchParams.page) || 1);

  const [coupons, total] = await cacheGetOrSet(
    `coupons:deals:${page}`,
    1800,
    () =>
      Promise.all([
        prisma.coupon.findMany({
          where: { OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }] },
          orderBy: [{ verified: "desc" }, { createdAt: "desc" }],
          take: PER_PAGE,
          skip: (page - 1) * PER_PAGE,
          include: { brand: { select: { name: true, slug: true, logoUrl: true } } }
        }),
        prisma.coupon.count({
          where: { OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }] }
        })
      ])
  );

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs crumbs={[{ label: "Deals" }]} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Tag className="w-8 h-8 text-primary" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Today&apos;s Best Deals</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          {total} verified coupon code{total !== 1 ? "s" : ""} — updated daily.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.map((coupon) => (
          <CouponCard key={coupon.id} coupon={{ ...coupon, brand: undefined } as any} brandSlug={coupon.brand?.slug || ""} brandName={coupon.brand?.name} brandLogoUrl={coupon.brand?.logoUrl} />
        ))}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} basePath="/deals" />
    </div>
  );
}
