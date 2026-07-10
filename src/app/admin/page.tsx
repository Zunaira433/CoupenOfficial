import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Store, Tag, LayoutGrid, BookOpen, Users, Mail, BarChart2, Plus, MessageCircle } from "lucide-react";
export const metadata = { title: "Admin Panel" };
export const revalidate = 0;

export default async function AdminPage() {
  const [brands, coupons, categories, posts, users, subscribers, comments, comparisons] = await Promise.all([
    prisma.brand.count(),
    prisma.coupon.count(),
    prisma.category.count(),
    prisma.blogPost.count(),
    prisma.user.count(),
    prisma.subscriber.count({ where: { unsubscribed: false } }),
    prisma.comment.count(),
    prisma.comparison.count()

  ]);

  const stats = [
    { label: "Brands", value: brands, icon: Store, href: "/admin/brands", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Coupons", value: coupons, icon: Tag, href: "/admin/coupons", color: "text-primary", bg: "bg-primary/10 dark:bg-primary/20" },
    { label: "Categories", value: categories, icon: LayoutGrid, href: "/admin/categories", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Blog Posts", value: posts, icon: BookOpen, href: "/admin/blog", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: "Users", value: users, icon: Users, href: "/admin/users", color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "Subscribers", value: subscribers, icon: Mail, href: "/admin/newsletter", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20" },
     { label: "Comments", value: comments, icon: MessageCircle, href: "/admin/comments", color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-900/20" },
     { label: "Comparisons", value: comparisons, icon: BarChart2, href: "/admin/compare", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-10">
        <BarChart2 className="w-8 h-8 text-primary" aria-hidden="true" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        {stats.map(({ label, value, icon: Icon, href, color, bg }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-4 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-md hover:border-primary/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className={`p-3 rounded-xl ${bg} shrink-0`}>
              <Icon className={`w-6 h-6 ${color}`} aria-hidden="true" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Add Brand", href: "/admin/brands/new" },
          { label: "Add Coupon", href: "/admin/coupons/new" },
          { label: "Add Category", href: "/admin/categories/new" },
          { label: "New Blog Post", href: "/admin/blog/new" },
          { label: "Moderate Comments", href: "/admin/comments" },
          { label: "Add Comparison", href: "/admin/compare/new" }
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
