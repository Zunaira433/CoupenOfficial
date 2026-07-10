import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Shield, Clock } from "lucide-react";

export const metadata = { title: "Manage Coupons – Admin" };
export const revalidate = 0;

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    include: { brand: { select: { name: true } } },
    take: 100
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Coupons</h1>
        <Link href="/admin/coupons/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Coupon
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500">Title</th>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500 hidden md:table-cell">Brand</th>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500 hidden sm:table-cell">Code</th>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500 hidden lg:table-cell">Status</th>
              <th scope="col" className="px-6 py-3 font-medium text-gray-500 text-right">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {coupons.map((c) => {
              const expired = c.expiresAt && new Date(c.expiresAt) < new Date();
              return (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white max-w-xs truncate">{c.title}</td>
                  <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{c.brand?.name}</td>
                  <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">
                    {c.code ? <code className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded font-mono text-xs">{c.code}</code> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    {expired ? (
                      <span className="inline-flex items-center gap-1 text-xs text-red-500"><Clock className="w-3 h-3" />Expired</span>
                    ) : c.verified ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600"><Shield className="w-3 h-3" />Verified</span>
                    ) : (
                      <span className="text-xs text-gray-400">Unverified</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/coupons/${c.id}`} className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary inline-flex" aria-label={`Edit coupon: ${c.title}`}>
                      <Pencil className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {coupons.length === 0 && <p className="text-center text-gray-400 py-12">No coupons yet.</p>}
      </div>
    </div>
  );
}
