import { prisma } from "@/lib/prisma";
import { Mail, Users } from "lucide-react";

export const metadata = { title: "Newsletter Subscribers – Admin" };
export const revalidate = 0;

export default async function AdminNewsletterPage() {
  const [subscribers, total] = await Promise.all([
    prisma.subscriber.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
    prisma.subscriber.count({ where: { unsubscribed: false } })
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Mail className="w-7 h-7 text-primary" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Newsletter Subscribers</h1>
        <span className="ml-auto px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold flex items-center gap-1">
          <Users className="w-4 h-4" aria-hidden="true" />
          {total} active
        </span>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500 hidden sm:table-cell">Joined</th>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {subscribers.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 text-gray-900 dark:text-white font-mono text-xs">{sub.email}</td>
                <td className="px-6 py-4 text-gray-500 hidden sm:table-cell text-xs">
                  {new Date(sub.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </td>
                <td className="px-6 py-4">
                  {sub.unsubscribed ? (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-500">Unsubscribed</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">Active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subscribers.length === 0 && <p className="text-center text-gray-400 py-12">No subscribers yet.</p>}
      </div>
    </div>
  );
}
