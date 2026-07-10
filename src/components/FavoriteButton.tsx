"use client";
import { useState } from "react";
import { Heart } from "lucide-react";

interface Props {
  brandId: string;
  initialFavorited: boolean;
}

export default function FavoriteButton({ brandId, initialFavorited }: Props) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      if (favorited) {
        await fetch(`/api/favorites?brandId=${brandId}`, { method: "DELETE" });
        setFavorited(false);
      } else {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brandId })
        });
        if (res.status === 401) {
          window.location.href = "/login?next=" + encodeURIComponent(window.location.pathname);
          return;
        }
        setFavorited(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={favorited}
      className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        favorited
          ? "bg-red-50 border-red-300 text-red-600 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400"
          : "bg-white border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 dark:bg-gray-800 dark:border-gray-700"
      }`}
    >
      <Heart className={`w-4 h-4 ${favorited ? "fill-current" : ""}`} />
      <span className="text-sm font-medium">{favorited ? "Saved" : "Save"}</span>
    </button>
  );
}
