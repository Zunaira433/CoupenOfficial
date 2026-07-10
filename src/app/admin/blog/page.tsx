import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, BookOpen } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";

export const metadata = { title: "Manage Blog – Admin" };
export const revalidate = 0;

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-primary" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
        </div>
        <Link href="/admin/blog/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <Plus className="w-4 h-4" aria-hidden="true" />
          New Post
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500">Title</th>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500 hidden sm:table-cell">Published</th>
              <th scope="col" className="px-6 py-3 font-medium text-gray-500 text-right">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900 dark:text-white">{post.title}</span>
                  <span className="ml-2 text-xs text-gray-400 font-mono">/{post.slug}</span>
                </td>
                <td className="px-6 py-4 text-gray-500 hidden sm:table-cell text-xs">
                  {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </td>
                <td className="px-6 py-4 text-right">
  <div className="flex items-center justify-end gap-2">
    <Link href={`/admin/blog/${post.id}`} className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary inline-flex" aria-label={`Edit: ${post.title}`}>
      <Pencil className="w-4 h-4" aria-hidden="true" />
    </Link>
    <DeleteButton endpoint={`/api/admin/blog/${post.id}`} label={`Delete ${post.title}`} />
  </div>
</td>
                
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <p className="text-center text-gray-400 py-12">No blog posts yet.</p>}
      </div>
    </div>
  );
}
