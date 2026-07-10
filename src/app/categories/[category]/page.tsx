import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const revalidate = 3600;

async function getCategory(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: { brands: true }
  });
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = await getCategory(params.category);
  if (!category) return {};
  return {
    title: `Best ${category.name} Tools & Coupons`,
    description: category.description || `Compare and find the best ${category.name} tools.`,
    alternates: { canonical: `/categories/${category.slug}` }
  };
}

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({ select: { slug: true } });
  return categories.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = await getCategory(params.category);
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">{category.name}</h1>
      <p className="mt-2 text-gray-500">{category.description}</p>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {category.brands.map((b) => (
          <Link key={b.id} href={`/brand/${b.slug}`} className="rounded-lg border p-4 hover:shadow">
            <p className="font-semibold">{b.name}</p>
            <p className="text-sm text-gray-500">⭐ {b.rating}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
