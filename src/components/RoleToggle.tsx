"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";

export default function RoleToggle({ userId, currentRole }: { userId: string; currentRole: "USER" | "ADMIN" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    const nextRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`Change this user's role to ${nextRole}?`)) return;

    setLoading(true);
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: nextRole })
    });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to update role");
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
        currentRole === "ADMIN"
          ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30"
          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      <Shield className="w-3.5 h-3.5" aria-hidden="true" />
      {currentRole}
    </button>
  );
}