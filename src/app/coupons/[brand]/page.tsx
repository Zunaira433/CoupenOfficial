import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CouponCard from "@/components/CouponCard";
import type { Metadata } from "next";

export const revalidate = 600;

async function getBrand(slug: string) {
  return prisma.brand.findUnique({
    where: { slug },
    include: { coupons: { where: { OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }] } } }
  });
}

export async function generateMetadata({ params }: { params: { brand: string } }): Promise<Metadata> {
  const brand = await getBrand(params.brand);
  if (!brand) return {};
  return {
    title: `${brand.name} Coupons & Promo Codes`,
    description: `Verified, working ${brand.name} discount codes updated regularly.`,
    alternates: { canonical: `/coupons/${brand.slug}` }
  };
}

export default async function CouponsPage({ params }: { params: { brand: string } }) {
  const brand = await getBrand(params.brand);
  if (!brand) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">{brand.name} Coupons</h1>
      <div className="mt-6 flex flex-col gap-4">
        {brand.coupons.map((c) => (
          <CouponCard
            key={c.id}
            brandSlug={brand.slug}
            brandName={brand.name}
            title={c.title}
            code={c.code}
            discount={c.discount}
            verified={c.verified}
          />
        ))}
        {brand.coupons.length === 0 && <p className="text-gray-500">No active coupons right now.</p>}
      </div>
    </div>
  );
}
