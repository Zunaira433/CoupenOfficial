"use client";
import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BlogReactions({ slug }: { slug: string }) {
  const router = useRouter();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState<"LIKE" | "DISLIKE" | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/${slug}/reactions`)
      .then((res) => res.json())
      .then((data) => {
        setLikes(data.likes);
        setDislikes(data.dislikes);
        setUserReaction(data.userReaction);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  async function react(type: "LIKE" | "DISLIKE") {
    setSubmitting(true);
    const res = await fetch(`/api/blog/${slug}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type })
    });
    setSubmitting(false);
    if (res.status === 401) {
      router.push(`/login?next=/blog/${slug}`);
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setUserReaction(data.userReaction);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => react("LIKE")}
        disabled={loading || submitting}
        aria-pressed={userReaction === "LIKE"}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60 ${
          userReaction === "LIKE"
            ? "bg-primary/10 border-primary text-primary"
            : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
      >
        <ThumbsUp className="w-4 h-4" aria-hidden="true" fill={userReaction === "LIKE" ? "currentColor" : "none"} />
        {likes}
      </button>
      <button
        onClick={() => react("DISLIKE")}
        disabled={loading || submitting}
        aria-pressed={userReaction === "DISLIKE"}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60 ${
          userReaction === "DISLIKE"
            ? "bg-red-50 dark:bg-red-900/20 border-red-400 text-red-500"
            : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
      >
        <ThumbsDown className="w-4 h-4" aria-hidden="true" fill={userReaction === "DISLIKE" ? "currentColor" : "none"} />
        {dislikes}
      </button>
    </div>
  );
}