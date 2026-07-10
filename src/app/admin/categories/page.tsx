import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Trash2, LayoutGrid } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";

export const metadata = { title: "Manage Categories – Admin" };
export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { brands: true } } }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Category
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Category</th>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Slug</th>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">Brands</th>
              <th scope="col" className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="w-5 h-5 text-gray-400 shrink-0" aria-hidden="true" />
                    <span className="font-medium text-gray-900 dark:text-white">{cat.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 hidden md:table-cell">{cat.slug}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 hidden sm:table-cell">{cat._count.brands}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/categories/${cat.id}`} className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={`Edit ${cat.name}`}>
                      <Pencil className="w-4 h-4" aria-hidden="true" />
                    </Link>
                   <DeleteButton endpoint={`/api/admin/categories/${cat.id}`} label={`Delete ${cat.name}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-600 py-12">No categories yet.</p>
        )}
      </div>
    </div>
  );
}