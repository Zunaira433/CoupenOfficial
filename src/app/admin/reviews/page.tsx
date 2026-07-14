import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";

export const metadata = { title: "Manage Reviews – Admin" };
export const revalidate = 0;

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { brand: { select: { name: true, slug: true } } }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews</h1>
        <Link
          href="/admin/reviews/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Review
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Title</th>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Brand</th>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">Rating</th>
              <th scope="col" className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{r.title}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 hidden md:table-cell">{r.brand?.name}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" aria-hidden="true" />
                    {r.rating}/5
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/reviews/${r.id}`} className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={`Edit ${r.title}`}>
                      <Pencil className="w-4 h-4" aria-hidden="true" />
                    </Link>
                    <DeleteButton endpoint={`/api/admin/reviews/${r.id}`} label={`Delete ${r.title}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reviews.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-600 py-12">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}