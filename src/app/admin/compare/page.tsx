import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Trash2, BarChart2 } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";

export const metadata = { title: "Manage Comparisons – Admin" };
export const revalidate = 0;

export default async function AdminComparePage() {
  const comparisons = await prisma.comparison.findMany({
    orderBy: { createdAt: "desc" },
    include: { brandA: { select: { name: true } }, brandB: { select: { name: true } } }
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <BarChart2 className="w-7 h-7 text-primary" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Comparisons</h1>
        </div>
        <Link
          href="/admin/compare/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Comparison
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Title</th>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">Slug</th>
              <th scope="col" className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {comparisons.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{c.title}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 hidden sm:table-cell font-mono text-xs">{c.slug}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/compare/${c.id}`} className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={`Edit ${c.title}`}>
  <Pencil className="w-4 h-4" aria-hidden="true" />
</Link>
                    <DeleteButton endpoint={`/api/admin/compare/${c.id}`} label={`Delete ${c.title}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {comparisons.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-600 py-12">No comparisons yet.</p>
        )}
      </div>
    </div>
  );
}