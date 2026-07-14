import { prisma } from "@/lib/prisma";
import Avatar from "@/components/Avatar";
import { Users } from "lucide-react";
import RoleToggle from "@/components/RoleToggle";

export const metadata = { title: "Manage Users – Admin" };
export const revalidate = 0;

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      createdAt: true
    }
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Users className="w-7 h-7 text-primary" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500">User</th>
              <th scope="col" className="text-left px-6 py-3 font-medium text-gray-500 hidden sm:table-cell">Joined</th>
              <th scope="col" className="px-6 py-3 font-medium text-gray-500 text-right">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={u.avatarUrl} name={u.name || u.email} size={36} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{u.name || u.email.split("@")[0]}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 hidden sm:table-cell text-xs">
                  {new Date(u.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </td>
                <td className="px-6 py-4 text-right">
                  <RoleToggle userId={u.id} currentRole={u.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="text-center text-gray-400 py-12">No users yet.</p>}
      </div>
    </div>
  );
}