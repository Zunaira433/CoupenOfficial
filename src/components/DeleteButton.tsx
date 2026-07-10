"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteButton({ endpoint, label = "Delete" }: { endpoint: string; label?: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this?")) return;
    setDeleting(true);
    const res = await fetch(endpoint, { method: "DELETE" });
    setDeleting(false);
   if (res.ok) {
  router.refresh();
} else {
  const j = await res.json().catch(() => null);
  alert(j?.error || "Failed to delete");
}
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50"
      aria-label={label}
    >
      <Trash2 className="w-4 h-4" aria-hidden="true" />
    </button>
  );
}