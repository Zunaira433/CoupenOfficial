import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Store } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";

export const metadata = { title: "Manage Brands – Admin" };
export const revalidate = 0;

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { coupons: true } }, category: { select: { name: true } } }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Brands</h1>
        <Link
          href="/admin/brands/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Brand
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Brand</th>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Category</th>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">Coupons</th>
              <th scope="col" className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {brands.map((brand) => (
              <tr key={brand.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {brand.logoUrl ? (
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 shrink-0">
                        <Image src={brand.logoUrl} alt={`${brand.name} logo`} fill className="object-contain p-0.5" sizes="32px" />
                      </div>
                    ) : (
                      <Store className="w-5 h-5 text-gray-400 shrink-0" aria-hidden="true" />
                    )}
                    <span className="font-medium text-gray-900 dark:text-white">{brand.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 hidden md:table-cell">{brand.category?.name}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 hidden sm:table-cell">{brand._count.coupons}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/brands/${brand.id}`} className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={`Edit ${brand.name}`}>
                      <Pencil className="w-4 h-4" aria-hidden="true" />
                    </Link>
                    <DeleteButton endpoint={`/api/admin/brands/${brand.id}`} label={`Delete ${brand.name}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {brands.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-600 py-12">No brands yet.</p>
        )}
      </div>
    </div>
  );
}
