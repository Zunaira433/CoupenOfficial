import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://coupenofficial.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [brands, categories, comparisons, posts] = await Promise.all([
    prisma.brand.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true } }),
    prisma.comparison.findMany({ select: { slug: true } }),
    prisma.blogPost.findMany({ select: { slug: true, createdAt: true } })
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/deals`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/search`, changeFrequency: "weekly", priority: 0.5 }
  ];

  const categoryPages = categories.map((c) => ({
    url: `${SITE_URL}/categories/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));

  const brandPages = brands.flatMap((b) => [
    { url: `${SITE_URL}/brand/${b.slug}`, lastModified: b.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${SITE_URL}/coupons/${b.slug}`, lastModified: b.updatedAt, changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${SITE_URL}/review/${b.slug}`, lastModified: b.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 }
  ]);

  const comparePages = comparisons.map((c) => ({
    url: `${SITE_URL}/compare/${c.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6
  }));

  const blogPages = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.createdAt,
    changeFrequency: "monthly" as const,
    priority: 0.6
  }));

  return [...staticPages, ...categoryPages, ...brandPages, ...comparePages, ...blogPages];
}
