import { prisma } from "@/lib/prisma";
import { cacheGetOrSet } from "@/lib/redis";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import Pagination from "@/components/Pagination";
import { BookOpen, Calendar } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog – Buying Guides, Tips & Coupon News",
  description:
    "Expert buying guides, money-saving tips, and the latest coupon news from CoupenOfficial."
};

const PER_PAGE = 12;

export default async function BlogListPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Math.max(1, Number(searchParams.page) || 1);

  const [posts, total] = await cacheGetOrSet(
    `blog:list:${page}`,
    3600,
    () =>
      Promise.all([
        prisma.blogPost.findMany({
          orderBy: { createdAt: "desc" },
          take: PER_PAGE,
          skip: (page - 1) * PER_PAGE
        }),
        prisma.blogPost.count()
      ])
  );

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs crumbs={[{ label: "Blog" }]} />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-primary" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Expert guides, money-saving tips and the latest coupon news.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No posts yet — check back soon!</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
           <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {post.coverUrl && (
                <div className="relative h-48 w-full">
                  <Image
                    src={post.coverUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-primary transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">{post.excerpt}</p>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                  <Calendar className="w-3 h-3" aria-hidden="true" />
                  <time dateTime={new Date(post.createdAt).toISOString()}>
                    {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </time>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} basePath="/blog" />
    </div>
  );
}
