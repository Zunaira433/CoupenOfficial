import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { reviewSchema, JsonLd } from "@/lib/schema";
import type { Metadata } from "next";

export const revalidate = 1800;

async function getBrand(slug: string) {
  return prisma.brand.findUnique({ where: { slug }, include: { reviews: true } });
}

export async function generateMetadata({ params }: { params: { brand: string } }): Promise<Metadata> {
  const brand = await getBrand(params.brand);
  if (!brand) return {};
  return {
    title: `${brand.name} Review 2026 — Honest & Detailed`,
    description: `In-depth ${brand.name} review covering pros, cons, pricing and performance.`,
    alternates: { canonical: `/review/${brand.slug}` }
  };
}

export default async function ReviewPage({ params }: { params: { brand: string } }) {
  const brand = await getBrand(params.brand);
  if (!brand) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">{brand.name} Review</h1>
      {brand.reviews.map((r) => (
        <article key={r.id} className="mt-6 rounded-lg border p-5">
          <JsonLd data={reviewSchema({ title: r.title, body: r.body, rating: r.rating, brandName: brand.name })} />
          <h2 className="text-xl font-semibold">{r.title}</h2>
          <p className="text-sm">⭐ {r.rating}/5</p>
          <p className="mt-3 whitespace-pre-wrap break-words">{r.body}</p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-green-600">Pros</p>
              <ul className="list-disc pl-5">{r.pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
            <div>
              <p className="font-semibold text-red-600">Cons</p>
              <ul className="list-disc pl-5">{r.cons.map((c, i) => <li key={i}>{c}</li>)}</ul>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
