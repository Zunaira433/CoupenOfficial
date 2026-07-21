import { prisma } from "@/lib/prisma";
import { cacheGetOrSet } from "@/lib/redis";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";

import { Calendar } from "lucide-react";
import { env } from "@/lib/env";
import BlogReactions from "@/components/BlogReactions";
import BlogComments from "@/components/BlogComments";

export const revalidate = 3600;
type Props = { params: { slug: string } };

async function getPost(slug: string) {
  return cacheGetOrSet(`blog:${slug}`, 3600, () =>
    prisma.blogPost.findUnique({ where: { slug } })
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};
  return {
    title: post.metaTitle || post.title,
    description: post.metaDesc || post.excerpt || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.metaTitle || post.title,
      description: post.metaDesc || post.excerpt || undefined,
      url: `${env.SITE_URL}/blog/${post.slug}`,
      images: post.coverUrl ? [{ url: post.coverUrl }] : [{ url: "/og-default.png" }],
      publishedTime: new Date(post.createdAt).toISOString()
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    datePublished: new Date(post.createdAt).toISOString(),
dateModified: new Date(post.createdAt).toISOString(),
    publisher: { "@type": "Organization", name: "CoupenOfficial", url: env.SITE_URL },
    ...(post.coverUrl && { image: post.coverUrl })
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs crumbs={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

      {post.coverUrl && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8">
          <Image src={post.coverUrl} alt={post.title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 768px" />
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{post.title}</h1>
        <div className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500">
          <Calendar className="w-4 h-4" aria-hidden="true" />
        
            <time dateTime={new Date(post.createdAt).toISOString()}>
            {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </time>
        </div>
      </header>

      <div
  className="prose prose-gray dark:prose-invert max-w-none"
  dangerouslySetInnerHTML={{ __html: post.content }}
/>

      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <BlogReactions slug={post.slug} />
      </div>

      <BlogComments slug={post.slug} />
    </div>
  );
}
